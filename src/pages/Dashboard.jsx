import { useEffect } from 'react'
import { useJobs } from '../hooks/useJob'
import { Doughnut, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

const STATUS_COLORS = {
  'Applied':        '#6366f1',
  'Interviewing':   '#f59e0b',
  'Offer Extended': '#10b981',
  'Rejected':       '#ef4444',
  'Accepted':       '#22c55e',
}

const CHART_TEXT  = '#9ca3af'
const CHART_GRID  = '#1f2937'

function Dashboard() {
  const { jobs, getJobs } = useJobs()

  useEffect(() => { getJobs() }, [])

  // --- Status counts ---
  const statusCounts = {}
  jobs.forEach(job => {
    statusCounts[job.status] = (statusCounts[job.status] || 0) + 1
  })

  const statuses = Object.keys(statusCounts)

  const donutData = {
    labels: statuses,
    datasets: [{
      data: statuses.map(s => statusCounts[s]),
      backgroundColor: statuses.map(s => STATUS_COLORS[s] ?? '#6b7280'),
      borderWidth: 0,
    }],
  }

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: CHART_TEXT, padding: 16, boxWidth: 12, font: { size: 12 } },
      },
    },
  }

  // --- Applications per month (rolling 12 months) ---
  const monthlyMap = {}
  const now = new Date()
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = d.toLocaleString('default', { month: 'short', year: '2-digit' })
    monthlyMap[key] = 0
  }
  jobs.forEach(job => {
    const d = new Date(job.date_applied)
    const key = d.toLocaleString('default', { month: 'short', year: '2-digit' })
    if (key in monthlyMap) monthlyMap[key]++
  })
  const monthLabels = Object.keys(monthlyMap)

  const barData = {
    labels: monthLabels,
    datasets: [{
      label: 'Applications',
      data: monthLabels.map(k => monthlyMap[k]),
      backgroundColor: '#6366f1',
      borderRadius: 6,
    }],
  }

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { grid: { color: CHART_GRID }, ticks: { color: CHART_TEXT } },
      y: { grid: { color: CHART_GRID }, ticks: { color: CHART_TEXT, stepSize: 1 }, beginAtZero: true },
    },
    plugins: { legend: { display: false } },
  }

  // --- Summary stats ---
  const total       = jobs.length
  const interviewing = jobs.filter(j => j.status === 'Interviewing').length
  const offers      = jobs.filter(j => j.status === 'Offer Extended').length
  const jobsThisWeek = jobs.filter(job => {
    const appliedDate = new Date(job.date_applied)
    const diffTime = Math.abs(now - appliedDate)
    return diffTime <= 7 * 24 * 60 * 60 * 1000 // within last 7 days
  }).length



  const stats = [
    { label: 'Total',        value: total,        color: 'text-gray-100'   },
    { label: 'Interviewing', value: interviewing,  color: 'text-amber-400'  },
    { label: 'Offers',       value: offers,        color: 'text-emerald-400' },
    { label: 'Application applied this week', value: jobsThisWeek, color: 'text-blue-400' },
  ]




  return (
    <div className="h-full overflow-y-auto bg-gray-950 p-6 space-y-6">
      <h1 className="text-xl font-semibold text-gray-100">Summary</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map(({ label, value, color }) => (
          <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">{label}</p>
            <p className={`text-3xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      {jobs.length === 0 ? (
        <div className="flex items-center justify-center bg-gray-900 border border-gray-800 rounded-xl p-12">
          <p className="text-gray-500 text-sm">No applications yet. Add some jobs to see your stats.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Donut — by status */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <p className="text-sm font-medium text-gray-300 mb-4">By Status</p>
            <div className="h-64">
              <Doughnut data={donutData} options={donutOptions} />
            </div>
          </div>

          {/* Bar — per month */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <p className="text-sm font-medium text-gray-300 mb-4">Applications per Month</p>
            <div className="h-64">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
