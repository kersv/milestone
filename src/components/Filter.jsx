
const Filter = ({selectedStatuses, setSelectedStatuses}) =>{
  const statusOptions = ['Applied', 'Interviewing', 'Offer Extended', 'Rejected', 'Accepted']

  return (
    <div className= "shadow p-4 rounded space-y-4 border-2 bg-green-50 w-full">
        <p>Year</p>
        <p>Month</p>
        <p>Status</p>
        <div className="mb-4 flex flex-col gap-4 border-2 bg-green-50 ">
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
        <p>Reset Filters</p>
    </div>
  )
}

export default Filter