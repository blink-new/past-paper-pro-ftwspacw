import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { blink } from './blink/client'
import { Toaster } from './components/ui/toaster'

// Pages
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import SubjectSelection from './pages/SubjectSelection'
import PastPaperPractice from './pages/PastPaperPractice'
import ProgressAnalytics from './pages/ProgressAnalytics'
import StudyPlans from './pages/StudyPlans'
import AITutorChat from './pages/AITutorChat'
import QuestionGenerator from './pages/QuestionGenerator'
import LoadingScreen from './components/LoadingScreen'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
          <Route path="/subjects" element={user ? <SubjectSelection /> : <Navigate to="/" />} />
          <Route path="/practice/:subjectId" element={user ? <PastPaperPractice /> : <Navigate to="/" />} />
          <Route path="/progress" element={user ? <ProgressAnalytics /> : <Navigate to="/" />} />
          <Route path="/study-plans" element={user ? <StudyPlans /> : <Navigate to="/" />} />
          <Route path="/ai-tutor" element={user ? <AITutorChat /> : <Navigate to="/" />} />
          <Route path="/question-generator" element={user ? <QuestionGenerator /> : <Navigate to="/" />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  )
}

export default App