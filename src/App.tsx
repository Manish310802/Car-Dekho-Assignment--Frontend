import { Link, Route, Routes, useLocation } from 'react-router-dom'
import { Landing } from './pages/Landing'
import { Wizard } from './pages/Wizard'
import { Shortlist } from './pages/Shortlist'

function Header() {
  const { pathname } = useLocation()
  const isWizard = pathname === '/wizard'

  return (
    <header className="sticky top-0 z-10 border-b border-zinc-100 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link
          to="/"
          className="flex items-center gap-2.5 font-black tracking-tight text-zinc-900"
        >
          <span className="text-lg">CarMatch</span>
          <span className="hidden rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500 sm:inline">
            AI advisor
          </span>
        </Link>

        {!isWizard && (
          <Link
            to="/wizard"
            className="rounded-xl bg-zinc-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-zinc-700"
          >
            Find my car →
          </Link>
        )}
      </div>
    </header>
  )
}

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/wizard" element={<Wizard />} />
          <Route path="/s/:id" element={<Shortlist />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
