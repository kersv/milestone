import {useEffect, useState} from 'react'
import Homepage from './pages/Homepage'
import Job from './pages/Job'
import Auth from './pages/Auth'
import Landing from './pages/Landing'
import Profile from './pages/Profile'
import Dashboard from './pages/Dashboard'
import {Link, Routes, Route, Navigate, useNavigate} from 'react-router-dom'
import { supabase } from './supabase-client'
import { Toaster } from 'react-hot-toast'
import { CircleUser, LogOut, LayoutDashboard } from 'lucide-react'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchSession = async () => {
    try {
      const { data, error } = await supabase.auth.getSession()
      if (error) throw error
      setSession(data.session)
    } catch (err) {
      console.error('Session fetch failed:', err.message)
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    fetchSession()

    const {data: authListener} = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className='flex flex-col h-screen bg-gray-950 overflow-hidden'>
      {/* Header — only shown when authenticated */}
      {session && (
        <div className="flex justify-between items-center px-6 py-4 bg-gray-900 border-b border-gray-800">
          <Link to='/' className="text-2xl font-bold text-white tracking-tight font-['Snell_Roundhand'] hover:text-indigo-400 transition-colors">
            Milestone
          </Link>
          <div className="flex items-center gap-3">
            <Link to='/dashboard' className="text-gray-400 hover:text-gray-100 transition-colors">
              <LayoutDashboard className='size-5'/>
            </Link>
            <Link to='/profile' className="text-gray-400 hover:text-gray-100 transition-colors">
              <CircleUser className='size-5'/>
            </Link>
            <button
              onClick={async () => {
                await logout()
                navigate('/auth')
              }}
              className="text-gray-400 hover:text-gray-100 transition-colors"
            >
              <LogOut className='size-5'/>
            </button>
          </div>
        </div>
      )}

      {/* Main content area */}
      <div className='flex-1 overflow-auto'>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#1e2130',
            color: '#e2e8f0',
            border: '1px solid #374151',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          },
          duration: 3000,
        }}
      />
      {loading ? (
        <div className="flex justify-center items-center h-full p-8 text-gray-400">Loading...</div>
      ) : (
        <Routes>
          {session ? (
          <>
            <Route path='/' element={<Homepage/>}/>
            <Route path='/job/:id' element={<Job/>}/>
            <Route path='/profile' element={<Profile userId={session.user.id} email={session.user.email} />}/>
            <Route path='/dashboard' element={<Dashboard/>}/>
            <Route path='*' element={<Navigate to="/" replace />}/>
          </>
          ) : (
          <>
            <Route path='/' element={<Landing/>}/>
            <Route path='/auth' element={<Auth/>}/>
            <Route path='*' element={<Navigate to="/" replace />}/>
          </>
          )}
        </Routes>
      )}
    </div>
    </div>
  )
}

export default App
