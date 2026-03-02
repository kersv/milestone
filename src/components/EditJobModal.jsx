import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useJobs } from '../hooks/useJob'

function EditJobModal() {
    const { updateJob, jobAppData, setJobData } = useJobs()
    const navigate = useNavigate()
  return (
    <dialog id='edit_job_modal' className="rounded-xl border border-gray-800 bg-gray-900 shadow-2xl p-0 backdrop:bg-black/60 w-full max-w-md">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-100 mb-5">Edit Job Application</h3>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Company</label>
            <input
              type="text"
              placeholder="Enter Company name"
              className="input"
              value={jobAppData.company}
              onChange={(e) => setJobData({ ...jobAppData, company: e.target.value })}
            />
          </div>
          <div className="flex justify-end pt-2">
            <button
              onClick={async () => { await updateJob(jobAppData.id); navigate('/') }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </dialog>
  )
}

export default EditJobModal