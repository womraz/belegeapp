import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Upload from './pages/Upload'
import DocumentDetail from './pages/DocumentDetail'

function App() {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (session === undefined) {
    return (<div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="text-center"><div className="inline-block w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" /><p className="text-slate-500 text-sm">Laden…</p></div></div>)
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={session ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/" element={session ? <Dashboard /> : <Navigate to="/login" replace />} />
        <Route path="/upload" element={session ? <Upload /> : <Navigate to="/login" replace />} />
        <Route path="/beleg/:id" element={session ? <DocumentDetail /> : <Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
