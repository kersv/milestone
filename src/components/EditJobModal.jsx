import React from 'react'

import { useJobs } from '../hooks/useJob'

function EditJobModal() {
    const { updateJob, jobAppData } = useJobs()
  return (
    <dialog id='edit_job_modal'>
    <div className='modal-box'>
        <h3 className='font-bold text-xl mb-8'>Edit Job Application</h3>
        <form onSubmit={updateJob} className='space-y-6'>
        <div className="grid gap-6">
            <div className="form-control">
                <label className="label">
                            {/* TASK NAME */}
                    <div className="form-control">
                        <label className="label">
                        <span className="label-text text-base font-medium">Company</span>
                        </label>
                        <input
                        type="text"
                        placeholder="Enter Company name"
                        className="input input-bordered w-full"
                        value={jobAppData.company}
                        onChange={(e) => setJobData({ ...jobAppData, company: e.target.value })}
                        />
                    </div>
                    <div>
                        <button onClick={() => updateJob()}>
                            Save
                        </button>
                    </div>
                </label>
            </div>
        </div>

        </form>
    </div>
    </dialog>
  )
}

export default EditJobModal