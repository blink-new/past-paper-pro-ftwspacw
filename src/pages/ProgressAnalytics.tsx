import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { blink } from '../blink/client'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Progress } from '../components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { 
  BarChart3,
  TrendingUp,
  Target,
  Clock,
  Award,
  BookOpen,
  GraduationCap,
  Settings,
  LogOut,
  Calendar,
  CheckCircle,
  AlertCircle,
  Star
} from 'lucide-react'

interface SubjectProgress {
  id: string
  name: string
  currentGrade: string
  targetGrade: string
  progress: number
  papersCompleted: number
  averageScore: number
  weakAreas: string[]
  strongAreas: string[]
  lastAttempt: string
}

interface RecentAttempt {
  id: string
  paperTitle: string
  subject: string
  score: number
  totalMarks: number
  timeSpent: number
  completedAt: string
  feedback: string
}

export default function ProgressAnalytics() {
  const [user, setUser] = useState(null)
  const [subjectProgress, setSubjectProgress] = useState<SubjectProgress[]>([])
  const [recentAttempts, setRecentAttempts] = useState<RecentAttempt[]>([])
  const [overallStats, setOverallStats] = useState({
    totalPapers: 0,
    averageScore: 0,
    studyStreak: 0,
    hoursStudied: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProgressData = async () => {
      try {
        const currentUser = await blink.auth.me()
        setUser(currentUser)

        // Mock progress data
        setSubjectProgress([
          {
            id: 'gcse-math',
            name: 'Mathematics',
            currentGrade: 'B+',
            targetGrade: 'A*',
            progress: 75,
            papersCompleted: 8,
            averageScore: 78,
            weakAreas: ['Quadratic Equations', 'Trigonometry'],
            strongAreas: ['Algebra', 'Statistics'],
            lastAttempt: '2 days ago'
          },
          {
            id: 'gcse-eng-lang',
            name: 'English Language',
            currentGrade: 'A-',
            targetGrade: 'A',
            progress: 85,
            papersCompleted: 6,
            averageScore: 82,
            weakAreas: ['Creative Writing'],
            strongAreas: ['Reading Comprehension', 'Language Analysis'],
            lastAttempt: '1 week ago'
          },
          {
            id: 'gcse-science',
            name: 'Science (Combined)',
            currentGrade: 'B',
            targetGrade: 'A',
            progress: 60,
            papersCompleted: 4,
            averageScore: 72,
            weakAreas: ['Physics - Forces', 'Chemistry - Bonding'],
            strongAreas: ['Biology - Cells', 'Chemistry - Reactions'],
            lastAttempt: '3 days ago'
          }
        ])

        setRecentAttempts([
          {
            id: '1',
            paperTitle: 'GCSE Mathematics Paper 1',
            subject: 'Mathematics',
            score: 68,
            totalMarks: 80,
            timeSpent: 85,
            completedAt: '2 days ago',
            feedback: 'Good progress on algebra, need to work on geometry'
          },
          {
            id: '2',
            paperTitle: 'GCSE Science Paper 2',
            subject: 'Science',
            score: 58,
            totalMarks: 75,
            timeSpent: 90,
            completedAt: '3 days ago',
            feedback: 'Strong in biology sections, physics needs improvement'
          },
          {
            id: '3',
            paperTitle: 'GCSE English Language Paper 1',
            subject: 'English Language',
            score: 72,
            totalMarks: 80,
            timeSpent: 95,
            completedAt: '1 week ago',
            feedback: 'Excellent reading comprehension, work on creative writing'
          }
        ])

        setOverallStats({
          totalPapers: 18,
          averageScore: 76,
          studyStreak: 7,
          hoursStudied: 24
        })
      } catch (error) {
        console.error('Error loading progress data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProgressData()
  }, [])

  const handleLogout = () => {
    blink.auth.logout('/')
  }

  const getGradeColor = (grade: string) => {
    if (grade.includes('A')) return 'text-green-600'
    if (grade.includes('B')) return 'text-blue-600'
    if (grade.includes('C')) return 'text-yellow-600'
    return 'text-gray-600'
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 70) return 'text-blue-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
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
              <Link to="/dashboard" className="text-gray-600 hover:text-primary transition-colors">Dashboard</Link>
              <Link to="/subjects" className="text-gray-600 hover:text-primary transition-colors">Subjects</Link>
              <Link to="/progress" className="text-primary font-medium">Progress</Link>
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
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Progress Analytics</h1>
          <p className="text-gray-600">Track your improvement and identify areas for focus</p>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Papers Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{overallStats.totalPapers}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Score</p>
                  <p className="text-2xl font-bold text-gray-900">{overallStats.averageScore}%</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Study Streak</p>
                  <p className="text-2xl font-bold text-gray-900">{overallStats.studyStreak} days</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Hours Studied</p>
                  <p className="text-2xl font-bold text-gray-900">{overallStats.hoursStudied}h</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="subjects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="subjects">Subject Progress</TabsTrigger>
            <TabsTrigger value="recent">Recent Attempts</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="subjects" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {subjectProgress.map((subject) => (
                <Card key={subject.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{subject.name}</CardTitle>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-sm text-gray-600">
                            Current: <span className={`font-medium ${getGradeColor(subject.currentGrade)}`}>
                              {subject.currentGrade}
                            </span>
                          </span>
                          <span className="text-sm text-gray-600">
                            Target: <span className={`font-medium ${getGradeColor(subject.targetGrade)}`}>
                              {subject.targetGrade}
                            </span>
                          </span>
                        </div>
                      </div>
                      <Badge variant="outline">{subject.progress}% to target</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">Progress to Target</span>
                          <span className="text-sm text-gray-600">{subject.progress}%</span>
                        </div>
                        <Progress value={subject.progress} className="h-2" />
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Papers Completed</p>
                          <p className="font-medium">{subject.papersCompleted}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Average Score</p>
                          <p className={`font-medium ${getScoreColor(subject.averageScore)}`}>
                            {subject.averageScore}%
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Strong Areas</p>
                        <div className="flex flex-wrap gap-1">
                          {subject.strongAreas.map((area, index) => (
                            <Badge key={index} variant="secondary" className="text-xs bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Areas to Improve</p>
                        <div className="flex flex-wrap gap-1">
                          {subject.weakAreas.map((area, index) => (
                            <Badge key={index} variant="secondary" className="text-xs bg-red-100 text-red-800">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <span className="text-xs text-gray-500">Last attempt: {subject.lastAttempt}</span>
                        <Link to={`/practice/${subject.id}`}>
                          <Button size="sm">Practice More</Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recent" className="space-y-6">
            <div className="space-y-4">
              {recentAttempts.map((attempt) => (
                <Card key={attempt.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-medium text-gray-900">{attempt.paperTitle}</h3>
                        <p className="text-sm text-gray-600">{attempt.subject}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${getScoreColor((attempt.score / attempt.totalMarks) * 100)}`}>
                          {attempt.score}/{attempt.totalMarks}
                        </div>
                        <p className="text-sm text-gray-600">
                          {Math.round((attempt.score / attempt.totalMarks) * 100)}%
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <p className="text-gray-600">Time Spent</p>
                        <p className="font-medium">{attempt.timeSpent} minutes</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Completed</p>
                        <p className="font-medium">{attempt.completedAt}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">AI Feedback</p>
                      <p className="text-sm text-gray-600">{attempt.feedback}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span>Key Insights</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-900">Study Pattern</p>
                      <p className="text-sm text-blue-700">
                        You perform best in the morning sessions. Consider scheduling difficult topics between 9-11 AM.
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm font-medium text-green-900">Strength</p>
                      <p className="text-sm text-green-700">
                        Your algebra skills have improved by 25% over the last month. Keep up the excellent work!
                      </p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <p className="text-sm font-medium text-orange-900">Focus Area</p>
                      <p className="text-sm text-orange-700">
                        Geometry questions take you 40% longer than average. Consider additional practice in this area.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-primary" />
                    <span>Recommendations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Focus on Trigonometry</p>
                        <p className="text-sm text-gray-600">
                          Complete 3 more trigonometry papers to reach your target grade
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Increase Practice Frequency</p>
                        <p className="text-sm text-gray-600">
                          Aim for 4 practice sessions per week instead of 3 for optimal progress
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Review Weak Areas</p>
                        <p className="text-sm text-gray-600">
                          Spend 15 minutes reviewing incorrect answers after each practice session
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}