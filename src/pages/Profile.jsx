import React, { useState, useEffect } from 'react'
import { supabase } from '../supabase-client'
import toast from 'react-hot-toast'

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB

function Profile({ userId, email }) {
  const [resumeFile, setResumeFile] = useState(null)
  const [resumeUrl, setResumeUrl] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  useEffect(() => {
    if (userId) fetchResume()
  }, [userId])

  if (!userId) return null

  const fetchResume = async () => {
    try {
      const filePath = `${userId}/resume.pdf`

      // 1. Get signed URL
      const { data: signedData, error: urlError } = await supabase.storage
        .from("resume")
        .createSignedUrl(filePath, 5 * 60)

      if (urlError) {
        setResumeUrl(null)
      } else {
        setResumeUrl(signedData?.signedUrl ?? null)
      }

      // 2. Get file metadata (for last updated date)
      const { data: fileData } = await supabase.storage
        .from("resume")
        .list(userId, { search: "resume.pdf" })

      if (fileData && fileData.length > 0) {
        setLastUpdated(fileData[0].updated_at)
      }
    } catch (err) {
      toast.error('Failed to load resume')
    }
  }

  const handleFileChange = (e) => {
    setResumeFile(e.target.files?.[0])
  }

  const handleUpload = async () => {
    if (!resumeFile) {
      toast.error('Please select a file first')
      return
    }

    if (resumeFile.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed')
      return
    }

    if (resumeFile.size > MAX_FILE_SIZE_BYTES) {
      toast.error('File must be smaller than 5 MB')
      return
    }

    const filePath = `${userId}/resume.pdf`

    const { error } = await supabase.storage
      .from("resume")
      .upload(filePath, resumeFile, {
        upsert: true,
        contentType: 'application/pdf',
      })

    if (error) {
      toast.error('Resume upload failed')
    } else {
      toast.success('Resume uploaded successfully')
      fetchResume()
    }
  }

  const handleDelete = async () => {
    const filePath = `${userId}/resume.pdf`

    const { error } = await supabase.storage
      .from("resume")
      .remove([filePath])

    if (error) {
      toast.error('Resume deletion failed')
    } else {
      toast.success('Resume deleted successfully')
      setResumeUrl(null)
      setLastUpdated(null)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="h-full overflow-hidden bg-gray-950 p-6 flex gap-6">
      {/* Left panel */}
      <div className="w-72 flex-shrink-0 bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6 h-fit">
        <div>
          <h1 className="text-xl font-semibold text-gray-100 mb-1">Profile</h1>
          <p className="text-sm text-gray-400">{email}</p>
        </div>

        <div className="border-t border-gray-800 pt-5 space-y-3">
          <label className="block text-sm font-medium text-gray-400">Upload Resume (PDF, max 5 MB)</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-700 file:text-gray-200 hover:file:bg-gray-600 file:cursor-pointer"
          />
          <button
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium py-2 rounded-lg transition-colors"
            onClick={handleUpload}
          >
            Upload
          </button>
        </div>
      </div>

      {/* Resume preview */}
      <div className="flex-1 flex flex-col">
        <div className='flex justify-between'>
          <h2 className="text-lg font-semibold text-gray-100 mb-3">Your Resume</h2>
          <button
            onClick={handleDelete}
            className="self-start px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Delete Resume
          </button>
        </div>
        {resumeUrl ? (
          <>
            <p className="text-sm text-gray-500 mb-3">
              Last updated: {formatDate(lastUpdated)}
            </p>
            <iframe
              src={resumeUrl}
              className="flex-1 w-full border border-gray-700 rounded-xl mb-4 bg-gray-800"
              title="Resume PDF"
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center border border-gray-800 rounded-xl bg-gray-900">
            <p className="text-gray-500 text-sm">No resume uploaded yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
