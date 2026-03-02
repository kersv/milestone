import { Link } from 'react-router-dom'
import { BriefcaseIcon, SearchIcon, FilterIcon } from 'lucide-react'
import Dashboard from '../assets/Dashboard.png'
import Summary from '../assets/Summary.png'


const features = [
  { icon: BriefcaseIcon, title: 'Track applications', description: 'Log every job you apply to with company, role, status, and notes in one place.' },
  { icon: SearchIcon,    title: 'Search instantly',   description: 'Filter by company, role, status, or year to find any application in seconds.' },
  { icon: FilterIcon,    title: 'Stay organized',      description: 'Track where you are in each process — Applied, Interviewing, Offer, and more.' },
]

function Landing() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
        <h1 className="text-6xl font-bold text-white mb-4 font-['Snell_Roundhand'] tracking-tight">
          Milestone
        </h1>
        <p className="text-xl text-gray-400 mb-2 max-w-md">
          Your job search, organized.
        </p>
        <p className="text-gray-500 mb-10 max-w-sm text-sm">
          Track every application, follow up with confidence, and never lose track of an opportunity again.
        </p>
        <Link
          to="/auth"
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-8 py-3 rounded-xl transition-colors text-sm shadow-lg shadow-indigo-900/30"
        >
          Get started — it's free
        </Link>
      </div>

      {/* Screenshots */}
      <div className="bg-gray-950 px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-3">See it in action</p>
          <h2 className="text-center text-2xl font-bold text-gray-100 mb-12">Everything you need, nothing you don't</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Screenshot 1 */}
            <div className="flex flex-col gap-3">
              <div className="rounded-xl border border-gray-800 bg-gray-900 overflow-hidden">
                <img src={Dashboard} alt="Dashboard" className="w-full" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-200">Dashboard</p>
                <p className="text-xs text-gray-500 mt-0.5">Track all your applications at a glance with search and filters.</p>
              </div>
            </div>

            {/* Screenshot 2 */}
            <div className="flex flex-col gap-3">
              <div className="rounded-xl border border-gray-800 bg-gray-900 overflow-hidden">
                <img src={Summary} alt="Analytics dashboard" className="w-full" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-200">Analytics</p>
                <p className="text-xs text-gray-500 mt-0.5">Visualize your job search with status breakdowns and monthly application trends.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="border-t border-gray-800 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex flex-col gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-600/20 flex items-center justify-center">
                <Icon className="size-4 text-indigo-400" />
              </div>
              <h3 className="text-gray-100 font-semibold text-sm">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-800 py-5 text-center text-xs text-gray-600">
        Already have an account?{' '}
        <Link to="/auth" className="text-indigo-400 hover:text-indigo-300 transition-colors">
          Sign in
        </Link>
      </div>
    </div>
  )
}

export default Landing
