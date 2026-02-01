import React from 'react'

const Filter = ({selectedStatuses, setSelectedStatuses, resetFilter, setSelectedYears, selectedYears, yearsOptions}) =>{
  const statusOptions = ['Applied', 'Interviewing', 'Offer Extended', 'Rejected', 'Accepted']

  return (
    <div className= "shadow p-4 rounded space-y-4 border-2 bg-green-50 w-full">
        <p className='flex justify-center font-extrabold'>Year</p>
        {yearsOptions.map(year => (
            <label key={year} className="flex items-center gap-1">
            <input
                type="checkbox"
                checked={selectedYears.includes(year)}
                onChange={e => {
                if (e.target.checked) {
                    setSelectedYears([...selectedYears, year])
                } else {
                    setSelectedYears(selectedYears.filter(y => y !== year))
                }}
                }
            />
            {year}
            </label>
        ))}
        <p className='flex justify-center font-extrabold'>Status</p>
        <div className="mb-4 flex flex-col gap-4">
        {statusOptions.map(status => (
            <label key={status} className="flex items-center gap-1">
            <input
                type="checkbox"
                checked={selectedStatuses.includes(status)}
                onChange={e => {
                if (e.target.checked) {
                    setSelectedStatuses([...selectedStatuses, status])
                } else {
                    setSelectedStatuses(selectedStatuses.filter(s => s !== status))
                }}
                }
            />
            {status}
            </label>
        ))}
        </div>
        <button
          type="button"
          onClick={resetFilter}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          Reset Filters
        </button>
    </div>
  )
}

export default Filter