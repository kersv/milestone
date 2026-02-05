import React, {useEffect, useMemo, useState, useCallback} from 'react'
import { useJobs } from '../hooks/useJob'
import { SquarePen, SquareX, RotateCcw } from 'lucide-react'
import EditJobModal from '../components/EditJobModal'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase-client'
import Button from '../components/Button'
import Filter from '../components/Filter'

function Homepage() {
     const {jobAppData, setJobData, addJob, getJobs, jobs, deleteJob, resetForm} = useJobs()
     const navigate = useNavigate()
     const [search, setSearch] = useState('')
     const [selectedStatuses, setSelectedStatuses] = useState([])
     const [filterActive, setFilterActive] = useState(false)
     const [selectedYears, setSelectedYears] = useState([])


     useEffect(() => {
       getJobs()
       resetForm()
      }, [])

      useEffect(() => {
        const channel = supabase.channel("jobs-channel")
        channel.on("postgres_changes", {event: "INSERT", schema: 'public', table: 'jobs'}, () => {
          getJobs()
        }).subscribe((status) => {
          console.log('Subscription status: ', status)
        })
        return () => channel.unsubscribe();
      },[])

      const formatDate = (dateString) =>{
        if (!dateString) return ''
        const date = new Date(dateString)
        const mm = String(date.getUTCMonth() + 1).padStart(2, '0')
        const dd = String(date.getUTCDate()).padStart(2, '0')
        const yyyy = date.getUTCFullYear()
        return `${mm}/${dd}/${yyyy}`
      }

      const filteredJobs = useMemo(() => {
        return jobs.filter(job => {
          return (
            (job.company.toLowerCase().includes(search.toLowerCase()) ||
            job.title.toLowerCase().includes(search.toLowerCase())) &&
            (selectedStatuses.length === 0 || selectedStatuses.includes(job.status)) &&
            (selectedYears.length === 0 || selectedYears.includes(new Date(job.date_applied).getUTCFullYear()))
          )
        })
      }, [jobs, search, selectedStatuses, selectedYears])

      const Headers = ['Company', 'Role', 'Status', 'Date Applied', 'Job Link', 'Notes', 'Actions']

      const memoizedGetJobs = useCallback(getJobs, [getJobs]);

      useEffect(() => {
        memoizedGetJobs();
        return () => resetForm();
      }, [memoizedGetJobs, resetForm]);


      const yearsOptions = useMemo(() => {
        return [...new Set(
          jobs
            .filter(job => job.date_applied)
            .map(job => new Date(job.date_applied).getUTCFullYear())
        )].sort((a, b) => b - a);
      }, [jobs]);

      const resetFilter = () => {
        console.log('Resetting filters');
        setSelectedStatuses([]);
        setSelectedYears([]);
      }

  return (
    <div className="h-full bg-gray-50 p-6 overflow-hidden flex flex-col">
      <input className="w-full mb-4 p-3 rounded-sm border-2 bg-green-50" placeholder='Search' value={search} onChange={e => setSearch(e.target.value)}/>
      <RotateCcw className='size-6 mt-2 mb-2 cursor-pointer' onClick={resetFilter}/>

      <div className='border-2 bg-gray-50 flex w-full flex-row flex-grow overflow-hidden'>
      <div className='flex flex-col w-1/4 p-4 border-r-2 bg-green-50 space-y-4'>
        {/* Form */}
        <Button
          label={filterActive ? 'Add Job' : 'Filter'}
          onClick={() => setFilterActive(!filterActive)}
        />
        {filterActive ? (
          <Filter
            selectedStatuses={selectedStatuses}
            setSelectedStatuses={setSelectedStatuses}
            resetFilter={resetFilter}
            filteredJobs={filteredJobs}
            selectedYears={selectedYears}
            setSelectedYears={setSelectedYears}
            yearsOptions={yearsOptions}

          />
        ): (
            <form onSubmit={addJob} className= "shadow p-4 rounded space-y-4 max-w-xl border-2 bg-green-50 w-full">
              <input className="input" placeholder="Company" value={jobAppData.company} onChange={(e) => setJobData({...jobAppData, company: e.target.value})}/>
              <input className="input" placeholder="Role" value={jobAppData.title} onChange={(e) => setJobData({...jobAppData, title: e.target.value})}/>
              <input className="input" placeholder="Job Posting Link" value={jobAppData.job_link} onChange={(e) => setJobData({...jobAppData, job_link: e.target.value})}/>
              <input type="date" className="input" value={jobAppData.date_applied} onChange={(e) => setJobData({...jobAppData, date_applied: e.target.value})}/>
              <select className="input" value={jobAppData.status} onChange={(e) => setJobData({...jobAppData, status: e.target.value})}>
                <option>Applied</option>
                <option>Interviewing</option>
                <option>Offer Extended</option>
                <option>Rejected</option>
                <option>Accepted</option>
              </select>
              <textarea className="input" placeholder="Notes" value={jobAppData.notes} onChange={(e) => setJobData({...jobAppData, notes: e.target.value})}/>
              <div className="flex justify-between ">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={resetFilter}>Add Application</button>
              <button type="button" className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700" onClick={resetForm}>Reset</button>
              </div>
            </form>
        )}
      </div>

      {/* List */}
        <div className="w-3/4 overflow-y-auto h-full border-2 ml-4 p-2 bg-green-50">
          {/* Grid container for both header and rows */}
          <div className="grid grid-cols-7 gap-x-4">
            {/* Header Row */}
            {Headers.map((header) => (
              <p key={header} className="font-bold text-lg p-2 sticky top-0 flex items-center">
                {header}
              </p>
            ))}

            {/* Data Rows */}
            {filteredJobs.map((job) => (
              // Use a React Fragment to span multiple columns
              <React.Fragment key={job.id}>
                <p className="p-2 border-b">{job.company}</p>
                <p className="p-2 border-b">{job.title}</p>
                <p className="p-2 border-b">{job.status}</p>
                <p className="p-2 border-b">{formatDate(job.date_applied)}</p>
                <a href={job.job_link} className="p-2 border-b text-blue-500 underline truncate" target="_blank" rel="noopener noreferrer">Link</a>
                <p className="p-2 border-b truncate" title={job.notes} aria-label={job.notes}>
                  {job.notes}
                </p>
                <div className="p-2 border-b flex items-center gap-10 space-between justify-center m-0">
                  <button className='size-5' onClick={() => navigate(`/job/${job.id}`)}>
                    <SquarePen/>
                  </button>
                  <button className='size-5' onClick={() => deleteJob(job.id)}>
                    <SquareX/>
                  </button>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
        <EditJobModal/>
      </div>
    </div>
  )
}

export default Homepage