import React from 'react'

const Filter = ({selectedStatuses, setSelectedStatuses, resetFilter, setSelectedYears, selectedYears, yearsOptions}) =>{
  const statusOptions = ['Applied', 'Interviewing', 'Offer Extended', 'Rejected', 'Accepted']

  return (
    <div className="space-y-4 overflow-auto">
      {yearsOptions.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Year</p>
          <div className="space-y-2">
            {yearsOptions.map(year => (
              <label key={year} className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  className="accent-indigo-500"
                  checked={selectedYears.includes(year)}
                  onChange={e => {
                    if (e.target.checked) {
                      setSelectedYears([...selectedYears, year])
                    } else {
                      setSelectedYears(selectedYears.filter(y => y !== year))
                    }
                  }}
                />
                {year}
              </label>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Status</p>
        <div className="space-y-2">
          {statusOptions.map(status => (
            <label key={status} className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                className="accent-indigo-500"
                checked={selectedStatuses.includes(status)}
                onChange={e => {
                  if (e.target.checked) {
                    setSelectedStatuses([...selectedStatuses, status])
                  } else {
                    setSelectedStatuses(selectedStatuses.filter(s => s !== status))
                  }
                }}
              />
              {status}
            </label>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={resetFilter}
        className="w-full px-3 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-lg transition-colors"
      >
        Reset Filters
      </button>
    </div>
  )
}

export default Filter