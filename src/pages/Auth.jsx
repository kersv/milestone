import { useState } from 'react'
import { supabase } from '../supabase-client'
import toast from 'react-hot-toast'

function Auth() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSignUp) {
      // Handle sign-up logic
      // console.log('Signing up with', form)
      const {error: signUpError} = await supabase.auth.signUp({email: form.email, password: form.password})
      if (signUpError) {
            console.error('Error during sign up:', signUpError.message)
            toast.error(signUpError.message)
            return
      }
      toast.success('Sign up successful! Please check your email to confirm your account.')
    } else {
        // Handle sign-in logic
        // console.log('Signing in with', form)
        const {error: signInError} = await supabase.auth.signInWithPassword({email: form.email, password: form.password})
        if (signInError) {
            console.error('Error during sign in:', signInError.message)
            toast.error(signInError.message)
            return
        }
        toast.success('Sign in successful!')
    }
    }

  return (
    <div className="bg-gray-950 min-h-screen flex items-center justify-center px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-8 text-center text-gray-100">
          {isSignUp ? 'Create account' : 'Welcome back'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={form.email}
              onChange={handleChange}
              required
              className="input"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={form.password}
              onChange={handleChange}
              required
              className="input"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>
        <div className="mt-5 text-center">
          <button
            className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp
              ? 'Already have an account? Sign In'
              : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Auth