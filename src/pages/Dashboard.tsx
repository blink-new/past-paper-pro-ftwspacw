import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { blink } from '../blink/client'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Progress } from '../components/ui/progress'
import { 
  BookOpen, 
  Brain, 
  Target, 
  TrendingUp, 
  Clock,
  Award,
  BarChart3,
  GraduationCap,
  Settings,
  LogOut,
  Plus,
  Calendar,
  CheckCircle
} from 'lucide-react'

interface UserProfile {
  id: string
  displayName: string
  email: string
  educationLevel: 'gcse' | 'alevel'
  targetGrades: Record<string, string>
}

interface RecentActivity {
  id: string
  type: 'practice' | 'study_plan' | 'achievement'
  title: string
  description: string
  timestamp: string
  score?: number
}

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [weeklyProgress, setWeeklyProgress] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const currentUser = await blink.auth.me()
        setUser(currentUser)

        // Mock data for now since database setup had issues
        setUserProfile({
          id: currentUser.id,
          displayName: currentUser.displayName || 'Student',
          email: currentUser.email,
          educationLevel: 'gcse',
          targetGrades: {
            'Mathematics': 'A*',
            'English Language': 'A',
            'Science': 'A'
          }
        })

        setRecentActivity([
          {
            id: '1',
            type: 'practice',
            title: 'GCSE Mathematics Paper 1',
            description: 'Completed with 78% score',
            timestamp: '2 hours ago',
            score: 78
          },
          {
            id: '2',
            type: 'achievement',
            title: 'Algebra Master',
            description: 'Achieved 90% accuracy in algebra questions',
            timestamp: '1 day ago'
          },
          {
            id: '3',
            type: 'study_plan',
            title: 'Weekly Study Plan Updated',
            description: 'New focus areas identified',
            timestamp: '2 days ago'
          }
        ])

        setWeeklyProgress(65)
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const handleLogout = () => {
    blink.auth.logout('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Past Paper Pro</span>
            </div>
            <nav className="flex items-center space-x-6">
              <Link to="/dashboard" className="text-primary font-medium">Dashboard</Link>
              <Link to="/subjects" className="text-gray-600 hover:text-primary transition-colors">Subjects</Link>
              <Link to="/progress" className="text-gray-600 hover:text-primary transition-colors">Progress</Link>
              <Link to="/study-plans" className="text-gray-600 hover:text-primary transition-colors">Study Plans</Link>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {userProfile?.displayName}!
          </h1>
          <p className="text-gray-600">
            Ready to continue your exam preparation journey?
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Weekly Progress</p>
                  <p className="text-2xl font-bold text-gray-900">{weeklyProgress}%</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
              </div>
              <Progress value={weeklyProgress} className="mt-3" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Papers Completed</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Score</p>
                  <p className="text-2xl font-bold text-gray-900">82%</p>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Study Streak</p>
                  <p className="text-2xl font-bold text-gray-900">7 days</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Jump into your studies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link to="/subjects">
                    <Button className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                      <BookOpen className="w-6 h-6" />
                      <span>Practice Past Papers</span>
                    </Button>
                  </Link>
                  <Link to="/question-generator">
                    <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                      <Plus className="w-6 h-6" />
                      <span>Generate Questions</span>
                    </Button>
                  </Link>
                  <Link to="/ai-tutor">
                    <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                      <Brain className="w-6 h-6" />
                      <span>AI Tutor Chat</span>
                    </Button>
                  </Link>
                  <Link to="/study-plans">
                    <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                      <Calendar className="w-6 h-6" />
                      <span>View Study Plan</span>
                    </Button>
                  </Link>
                  <Link to="/progress">
                    <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                      <BarChart3 className="w-6 h-6" />
                      <span>Check Progress</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Current Subjects */}
            <Card>
              <CardHeader>
                <CardTitle>Your Subjects</CardTitle>
                <CardDescription>Track your progress across all subjects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(userProfile?.targetGrades || {}).map(([subject, targetGrade]) => (
                    <div key={subject} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{subject}</h3>
                          <p className="text-sm text-gray-600">Target: {targetGrade}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">Current: B+</p>
                          <p className="text-xs text-gray-600">3 papers completed</p>
                        </div>
                        <Link to={`/practice/${subject.toLowerCase().replace(' ', '-')}`}>
                          <Button size="sm">Practice</Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        activity.type === 'practice' ? 'bg-primary/10' :
                        activity.type === 'achievement' ? 'bg-green-100' :
                        'bg-blue-100'
                      }`}>
                        {activity.type === 'practice' && <BookOpen className="w-4 h-4 text-primary" />}
                        {activity.type === 'achievement' && <Award className="w-4 h-4 text-green-600" />}
                        {activity.type === 'study_plan' && <Calendar className="w-4 h-4 text-blue-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-xs text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                      </div>
                      {activity.score && (
                        <Badge variant={activity.score >= 80 ? 'default' : 'secondary'}>
                          {activity.score}%
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Today's Goals */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-900 line-through">Complete Math Paper 2</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                    <span className="text-sm text-gray-900">Review English Literature notes</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                    <span className="text-sm text-gray-900">Practice 10 Chemistry questions</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Exams */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Exams</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Mathematics</p>
                      <p className="text-xs text-gray-600">Paper 1 & 2</p>
                    </div>
                    <Badge variant="outline">May 15</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">English Language</p>
                      <p className="text-xs text-gray-600">Paper 1</p>
                    </div>
                    <Badge variant="outline">May 22</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Science</p>
                      <p className="text-xs text-gray-600">Combined Paper</p>
                    </div>
                    <Badge variant="outline">Jun 3</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}