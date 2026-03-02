import React, {useEffect, useMemo, useState} from 'react'
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
        channel
          .on("postgres_changes", {event: "INSERT", schema: 'public', table: 'jobs'}, () => { getJobs() })
          .on("postgres_changes", {event: "UPDATE", schema: 'public', table: 'jobs'}, () => { getJobs() })
          .on("postgres_changes", {event: "DELETE", schema: 'public', table: 'jobs'}, () => { getJobs() })
          .subscribe()
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



      const yearsOptions = useMemo(() => {
        return [...new Set(
          jobs
            .filter(job => job.date_applied)
            .map(job => new Date(job.date_applied).getUTCFullYear())
        )].sort((a, b) => b - a);
      }, [jobs]);

      const resetFilter = () => {
        setSelectedStatuses([]);
        setSelectedYears([]);
      }

      const statusColors = {
        Applied: "bg-blue-100 text-blue-800",
        Interviewing: "bg-amber-100 text-amber-800",
        'Offer Extended': "bg-emerald-100 text-emerald-800",
        Rejected: "bg-red-100 text-red-800",
        Accepted: "bg-green-100 text-green-800"
      }

  return (
    <div className="h-full bg-gray-950 p-4 flex flex-col gap-3">
      {/* Search + reset row */}
      <div className="flex items-center gap-2">
        <input
          className="input"
          placeholder="Search by company or role…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button
          onClick={resetFilter}
          className="p-2 text-gray-400 hover:text-gray-100 transition-colors flex-shrink-0"
          title="Reset filters"
        >
          <RotateCcw className='size-5'/>
        </button>
      </div>

      <div className='flex flex-row flex-grow overflow-auto rounded-xl border border-gray-800'>
        {/* Sidebar */}
        <div className='flex flex-col w-64 flex-shrink-0 p-4 border-r border-gray-800 bg-gray-900 space-y-4'>
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
          ) : (
            <form onSubmit={addJob} className="space-y-3">
              <input required className="input" placeholder="Company" value={jobAppData.company} onChange={(e) => setJobData({...jobAppData, company: e.target.value})}/>
              <input required className="input" placeholder="Role" value={jobAppData.title} onChange={(e) => setJobData({...jobAppData, title: e.target.value})}/>
              <input className="input" placeholder="Job posting link" value={jobAppData.job_link} onChange={(e) => setJobData({...jobAppData, job_link: e.target.value})}/>
              <input type="date" className="input" value={jobAppData.date_applied} onChange={(e) => setJobData({...jobAppData, date_applied: e.target.value})}/>
              <select className="input" value={jobAppData.status} onChange={(e) => setJobData({...jobAppData, status: e.target.value})}>
                <option>Applied</option>
                <option>Interviewing</option>
                <option>Offer Extended</option>
                <option>Rejected</option>
                <option>Accepted</option>
              </select>
              <textarea className="input resize-none h-20" placeholder="Notes" value={jobAppData.notes} onChange={(e) => setJobData({...jobAppData, notes: e.target.value})}/>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors" onClick={resetFilter}>
                  Add
                </button>
                <button type="button" className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm font-medium px-3 py-2 rounded-lg transition-colors" onClick={resetForm}>
                  Reset
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto bg-gray-900">
          <div className="grid grid-cols-7">
            {/* Header */}
            {Headers.map((header) => (
              <div key={header} className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400 border-b border-gray-800 bg-gray-900 sticky top-0">
                {header}
              </div>
            ))}

            {/* Rows */}
            {filteredJobs.length === 0 ? (
              <div className="col-span-7 py-16 text-center text-gray-500">
                No applications found.
              </div>
            ) : (
              filteredJobs.map((job) => (
                <React.Fragment key={job.id}>
                  <p className="px-3 py-3 border-b border-gray-800 text-gray-200 text-sm">{job.company}</p>
                  <p className="px-3 py-3 border-b border-gray-800 text-gray-200 text-sm">{job.title}</p>
                  <p className="px-3 py-3 border-b border-gray-800 text-sm">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[job.status]}`}>
                      {job.status}
                    </span>
                  </p>
                  <p className="px-3 py-3 border-b border-gray-800 text-gray-400 text-sm">{formatDate(job.date_applied)}</p>
                  <a href={job.job_link} className="px-3 py-3 border-b border-gray-800 text-indigo-400 hover:text-indigo-300 text-sm truncate transition-colors" target="_blank" rel="noopener noreferrer">Link</a>
                  <p className="px-3 py-3 border-b border-gray-800 text-gray-400 text-sm truncate" title={job.notes}>
                    {job.notes}
                  </p>
                  <div className="px-3 py-3 border-b border-gray-800 flex items-center gap-3 justify-center">
                    <button className='text-indigo-400 hover:text-indigo-300 transition-colors' onClick={() => navigate(`/job/${job.id}`)}>
                      <SquarePen className="size-4"/>
                    </button>
                    <button className='text-red-400 hover:text-red-300 transition-colors' onClick={() => deleteJob(job.id)}>
                      <SquareX className="size-4"/>
                    </button>
                  </div>
                </React.Fragment>
              ))
            )}
          </div>
        </div>
        <EditJobModal/>
      </div>
    </div>
  )
}

export default Homepage