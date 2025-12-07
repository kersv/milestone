import React, { useState, useEffect } from 'react'
import { supabase } from '../supabase-client'
import toast from 'react-hot-toast'

function Profile({ session }) {
  const userId = session?.user?.id
  const [resumeFile, setResumeFile] = useState(null)
  const [resumeUrl, setResumeUrl] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  useEffect(() => {
    if (userId) fetchResume()
  }, [userId])

  const fetchResume = async () => {
    const filePath = `${userId}/resume.pdf`

    // 1. Get signed URL
    const { data: signedData } = await supabase.storage
      .from("resume")
      .createSignedUrl(filePath, 60 * 60)

    if (signedData?.signedUrl) {
      setResumeUrl(signedData.signedUrl)
    } else {
      setResumeUrl(null)
    }

    // 2. Get file metadata (for last updated date)
    const { data: fileData } = await supabase.storage
      .from("resume")
      .list(userId, { search: "resume.pdf" })

    if (fileData && fileData.length > 0) {
      setLastUpdated(fileData[0].updated_at)
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

    const filePath = `${userId}/resume.pdf`

    const { error } = await supabase.storage
      .from("resume")
      .upload(filePath, resumeFile, {
        upsert: true,
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
    <div>
      <h1 className="text-3xl font-bold mb-4">User Profile</h1>
      <p>Email: {session?.user?.email}</p>

      <div className="mt-6">
        <label className="block mb-2 font-semibold">Upload Resume (PDF):</label>

        <input type="file" accept="application/pdf" onChange={handleFileChange} />

        <button
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded"
          onClick={handleUpload}
        >
          Upload
        </button>
      </div>

      {/* Display resume */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Your Resume</h2>

        {resumeUrl ? (
          <>
            <p className="text-gray-500 mb-2">
              Last updated: {formatDate(lastUpdated)}
            </p>

            <iframe
              src={resumeUrl}
              className="w-full h-[600px] border rounded mb-4"
              title="Resume PDF"
            />

            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Delete Resume
            </button>
          </>
        ) : (
          <p className="text-gray-500">No resume uploaded yet.</p>
        )}
      </div>
    </div>
  )
}

export default Profile
