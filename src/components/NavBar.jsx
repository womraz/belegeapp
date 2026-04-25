import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function NavBar() {
  const navigate = useNavigate()
  const location = useLocation()
  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }
  const isUpload = location.pathname === '/upload'
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 font-semibold text-slate-800 hover:text-blue-600 transition-colors">BelegeApp</button>
        <div className="flex items-center gap-2">
          {!isUpload && (<button onClick={() => navigate('/upload')} className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors">Neuer Beleg</button>)}
          <button onClick={handleLogout} title="Abmelden" className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors">Ab</button>
        </div>
      </div>
    </header>
  )
}
