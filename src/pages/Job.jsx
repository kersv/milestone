import React, { useEffect } from 'react'
import { useJobs } from '../hooks/useJob'
import { useParams } from 'react-router-dom'
import { ArrowLeftIcon, SaveIcon, Trash2Icon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function Job() {
    const {deleteJob, getJob, updateJob, jobAppData, loading, error, setJobData} = useJobs()
    const {id} = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        getJob(id)
    }
    , [getJob, id])

    if (loading) {
        return (
          <div className="flex justify-center items-center h-full bg-gray-950">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-700 border-t-indigo-500" />
          </div>
        );
    }

    if (error) {
        return (
          <div className="h-full bg-gray-950 px-4 py-8">
            <div className="max-w-xl mx-auto bg-red-900/20 border border-red-700 text-red-400 rounded-lg p-4">
              {error}
            </div>
          </div>
        );
    }

    const handleDelete = async () => {
        await deleteJob(id)
        navigate("/")
    }

  return (
    <div className="h-full overflow-y-auto bg-gray-950 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate("/")} className="mb-6 flex items-center gap-2 text-sm text-gray-400 hover:text-gray-100 transition-colors">
          <ArrowLeftIcon className="size-4" />
          Back to Dashboard
        </button>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-xl">
          <h2 className="text-xl font-semibold text-gray-100 mb-6">Edit Job Application</h2>
          <form onSubmit={(e) => {
            e.preventDefault()
            updateJob(id, jobAppData)
          }} className='space-y-4'>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Company Name</label>
              <input type="text" placeholder="Enter Company Name" className="input"
                value={jobAppData.company} onChange={(e) => setJobData({ ...jobAppData, company: e.target.value })} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Role</label>
              <input type="text" placeholder="Enter Job Role" className="input"
                value={jobAppData.title} onChange={(e) => setJobData({ ...jobAppData, title: e.target.value })} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Job Posting Link</label>
              <input type="text" placeholder="Enter Job Posting Link" className="input"
                value={jobAppData.job_link} onChange={(e) => setJobData({ ...jobAppData, job_link: e.target.value })} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Date Applied</label>
              <input type="date" className="input"
                value={jobAppData.date_applied} onChange={(e) => setJobData({ ...jobAppData, date_applied: e.target.value })} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Status</label>
              <select className="input" value={jobAppData.status} onChange={(e) => setJobData({ ...jobAppData, status: e.target.value })}>
                <option>Applied</option>
                <option>Interviewing</option>
                <option>Offer Extended</option>
                <option>Rejected</option>
                <option>Accepted</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Notes</label>
              <textarea className="input resize-none h-24" placeholder="Enter any notes about the application"
                value={jobAppData.notes} onChange={(e) => setJobData({ ...jobAppData, notes: e.target.value })} />
            </div>

            <div className="flex justify-between pt-2">
              <button type="button" onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-lg transition-colors">
                <Trash2Icon className="size-4" />
                Delete
              </button>
              <button type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || !jobAppData.company || !jobAppData.status || !jobAppData.title}>
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
                ) : (
                  <SaveIcon className="size-4" />
                )}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Job