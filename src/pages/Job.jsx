import React, { useEffect } from 'react'
import { useJobs } from '../hooks/useJob'
import { useParams } from 'react-router-dom'
import { ArrowLeftIcon, SaveIcon, Trash2Icon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function Job() {
    const {addJob, getJobs, jobs, deleteJob, getJob, currentJob, updateJob, jobAppData, loading, error, setJobData} = useJobs()
    const {id} = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        getJob(id)
    }
    , [getJob, id])
    console.log(currentJob)

    if (loading) {
        return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="loading loading-spinner loading-lg" />
        </div>
        );
    }

    if (error) {
        return (
        <div className="container mx-auto px-4 py-8">
            <div className="alert alert-error">{error}</div>
        </div>
        );
    }

    const handleDelete = () => {
        deleteJob(id)
        navigate("/")
    }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button onClick={() => navigate("/")} className="btn btn-ghost mb-8">
        <ArrowLeftIcon className="size-4 mr-2" />
        Back to Dashboard
      </button>

      {/* TASK FORM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className='card-body'>
          <h2 className='card-title text-2xl mb-6'>Edit Job Application</h2>

          <form onSubmit={(e) => {
            e.preventDefault()
            updateJob(id, jobAppData)
          }} className='space-y-6'>
            {/* COMPANY NAME */}
            <div className="form-control">
                <label className="label">
                  <span className="label-text text-base font-medium">Company Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Company Name"
                  className="input input-bordered w-full"
                  value={jobAppData.company}
                  onChange={(e) => setJobData({ ...jobAppData, company: e.target.value })}
                />
            </div>

            {/* JOB TITLE */}
            <div className='form-control'>
                <label className='label'>
                  <span className='label-text text-base font-medium'>Title</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Job Title"
                  className="input input-bordered w-full"
                  value={jobAppData.title}
                  onChange={(e) => setJobData({ ...jobAppData, title: e.target.value })}
                />
            </div>

            {/* JOB LINK */}
            <div className='form-control'>
                <label className='label'>
                  <span className='label-text text-base font-medium'>Job Posting Link</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Job Posting Link"
                  className="input input-bordered w-full"
                  value={jobAppData.job_link}
                  onChange={(e) => setJobData({ ...jobAppData, job_link: e.target.value })}
                />
            </div>
            {/* DATE APPLIED */}
            <div className='form-control'>
                <label className='label'>
                  <span className='label-text text-base font-medium'>Date Applied</span>
                </label>
                <input
                  type="date"
                  className="input input-bordered w-full"
                  value={jobAppData.date_applied}
                  onChange={(e) => setJobData({ ...jobAppData, date_applied: e.target.value })}
                />
            </div>
            {/* STATUS */}
            <div className='form-control'>
                <label className='label'>
                  <span className='label-text text-base font-medium'>Status</span>
                </label>
                <select
                  className="input input-bordered w-full"
                  value={jobAppData.status}
                  onChange={(e) => setJobData({ ...jobAppData, status: e.target.value })}
                >
                  <option>Applied</option>
                  <option>Interviewing</option>
                  <option>Rejected</option>
                  <option>Accepted</option>
                </select>
            </div>
            {/* NOTES */}
            <div className='form-control'>
                <label className='label'>
                  <span className='label-text text-base font-medium'>Notes</span>
                </label>
                <textarea
                  className="input input-bordered w-full h-24"
                  placeholder="Enter any notes about the application"
                  value={jobAppData.notes}
                  onChange={(e) => setJobData({ ...jobAppData, notes: e.target.value })}
                />
            </div>

            {/* FORM ACTIONS */}
            <div className="flex justify-between mt-8">
                <button type="button" onClick={handleDelete} className="btn btn-error">
                  <Trash2Icon className="size-4 mr-2" />
                  Delete Job Application
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading || !jobAppData.company || !jobAppData.status || !jobAppData.title}
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-sm" />
                  ) : (
                    <>
                      <SaveIcon className="size-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
          </form>
        </div>
      </div>

    </div>
  )
}

export default Job