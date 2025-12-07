import {useEffect, useState} from 'react'
import Homepage from './pages/homepage'
import Job from './pages/job'
import Auth from './pages/Auth'
import Profile from './pages/profile'
import {Link} from 'react-router-dom'
import { Routes, Route } from 'react-router-dom'
import { supabase } from './supabase-client'
import { Toaster } from 'react-hot-toast'

function App() {
  const [session, setSession] = useState(null)

  const fetchSession = async () => {
    const currentSession = await supabase.auth.getSession()
    console.log(currentSession)
    setSession(currentSession.data.session)
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
    <div className='flex flex-col min-h-screen'>
      {/* Header containing Milestone title and Logout button */}
      <div className="flex justify-between items-center p-4 bg-white shadow-md">
        <>
          <Link to='/' className="text-2xl font-bold text-blue-600">Milestone</Link>
        </>
        {session && (
        <>
          <Link to='/profile'>Profile</Link>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex"
            >
              Log Out
            </button>
        </>
        )}
      </div>

      {/* Main content area */}
      <div className='flex-grow bg-base-200 transition-colors duration-300'>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            transition: 'all 0.4s cubic-bezier(.21,1.02,.73,1)', // smoother transition
            background: '#fff',
            color: '#333',
            boxShadow: '0 4px 14px rgba(0,0,0,0.08)'
          },
          duration: 3000, // show for 3 seconds
        }}
      />
      <Routes>
        {session ? (
        <>
          <Route path='/' element={<Homepage/>}/>
          <Route path='/job/:id' element={<Job/>}/>
          <Route path='/profile' element={<Profile session={session} />}/>
        </>
        ) : (
          <Route path='/' element={<Auth/>}/>
        )}
      </Routes>
    </div>
    </div>
  )
}

export default App
