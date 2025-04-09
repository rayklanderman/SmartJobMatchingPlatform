import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import { logInfo } from './utils/logger'
import Dashboard from './pages/Dashboard'
import JobFeed from './pages/JobFeed'
import Profile from './pages/Profile'

function App() {
  logInfo('App component rendered')

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm">
            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 justify-between items-center">
                <div className="flex-shrink-0">
                  <Link to="/" className="text-2xl font-bold text-indigo-600">
                    SmartJob
                  </Link>
                </div>
                <div className="hidden sm:flex sm:space-x-8">
                  <Link
                    to="/dashboard"
                    className="text-gray-900 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/jobs"
                    className="text-gray-900 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
                  >
                    Job Feed
                  </Link>
                  <Link
                    to="/profile"
                    className="text-gray-900 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
                  >
                    Profile
                  </Link>
                </div>
              </div>
            </nav>
          </header>

          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/jobs" element={<JobFeed />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/" element={<JobFeed />} />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  )
}

export default App
