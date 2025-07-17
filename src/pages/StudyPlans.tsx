import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { blink } from '../blink/client'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Progress } from '../components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Calendar } from '../components/ui/calendar'
import { 
  Calendar as CalendarIcon,
  Clock,
  Target,
  BookOpen,
  CheckCircle,
  AlertCircle,
  GraduationCap,
  Settings,
  LogOut,
  Plus,
  Edit,
  Brain,
  TrendingUp,
  Award
} from 'lucide-react'

interface StudyTask {
  id: string
  title: string
  subject: string
  type: 'practice' | 'review' | 'weak-area'
  estimatedTime: number
  priority: 'high' | 'medium' | 'low'
  dueDate: string
  completed: boolean
  description: string
}

interface StudyPlan {
  id: string
  name: string
  subject: string
  targetGrade: string
  examDate: string
  totalTasks: number
  completedTasks: number
  weeklyHours: number
  progress: number
  tasks: StudyTask[]
}

export default function StudyPlans() {
  const [user, setUser] = useState(null)
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([])
  const [todayTasks, setTodayTasks] = useState<StudyTask[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStudyPlans = async () => {
      try {
        const currentUser = await blink.auth.me()
        setUser(currentUser)

        // Mock study plans data
        const mockPlans: StudyPlan[] = [
          {
            id: '1',
            name: 'GCSE Mathematics Mastery',
            subject: 'Mathematics',
            targetGrade: 'A*',
            examDate: '2024-05-15',
            totalTasks: 24,
            completedTasks: 18,
            weeklyHours: 6,
            progress: 75,
            tasks: [
              {
                id: '1',
                title: 'Complete Algebra Practice Paper',
                subject: 'Mathematics',
                type: 'practice',
                estimatedTime: 90,
                priority: 'high',
                dueDate: 'Today',
                completed: false,
                description: 'Focus on quadratic equations and simultaneous equations'
              },
              {
                id: '2',
                title: 'Review Trigonometry Mistakes',
                subject: 'Mathematics',
                type: 'review',
                estimatedTime: 30,
                priority: 'medium',
                dueDate: 'Tomorrow',
                completed: false,
                description: 'Go through previous paper errors in trigonometry'
              }
            ]
          },
          {
            id: '2',
            name: 'English Language Excellence',
            subject: 'English Language',
            targetGrade: 'A',
            examDate: '2024-05-22',
            totalTasks: 16,
            completedTasks: 12,
            weeklyHours: 4,
            progress: 75,
            tasks: [
              {
                id: '3',
                title: 'Creative Writing Practice',
                subject: 'English Language',
                type: 'weak-area',
                estimatedTime: 60,
                priority: 'high',
                dueDate: 'Today',
                completed: false,
                description: 'Practice descriptive writing techniques'
              }
            ]
          },
          {
            id: '3',
            name: 'Science Comprehensive Review',
            subject: 'Science',
            targetGrade: 'A',
            examDate: '2024-06-03',
            totalTasks: 20,
            completedTasks: 8,
            weeklyHours: 5,
            progress: 40,
            tasks: [
              {
                id: '4',
                title: 'Physics Forces Revision',
                subject: 'Science',
                type: 'weak-area',
                estimatedTime: 45,
                priority: 'high',
                dueDate: 'Tomorrow',
                completed: false,
                description: 'Review Newton\'s laws and force calculations'
              }
            ]
          }
        ]

        setStudyPlans(mockPlans)

        // Extract today's tasks
        const today = new Date().toDateString()
        const allTasks = mockPlans.flatMap(plan => plan.tasks)
        const todaysTasks = allTasks.filter(task => 
          task.dueDate === 'Today' || new Date(task.dueDate).toDateString() === today
        )
        setTodayTasks(todaysTasks)

      } catch (error) {
        console.error('Error loading study plans:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStudyPlans()
  }, [])

  const handleLogout = () => {
    blink.auth.logout('/')
  }

  const toggleTaskCompletion = (taskId: string) => {
    setTodayTasks(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    )
    
    setStudyPlans(prev => 
      prev.map(plan => ({
        ...plan,
        tasks: plan.tasks.map(task => 
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      }))
    )
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'practice': return <BookOpen className="w-4 h-4" />
      case 'review': return <Brain className="w-4 h-4" />
      case 'weak-area': return <Target className="w-4 h-4" />
      default: return <BookOpen className="w-4 h-4" />
    }
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
              <Link to="/progress" className="text-gray-600 hover:text-primary transition-colors">Progress</Link>
              <Link to="/study-plans" className="text-primary font-medium">Study Plans</Link>
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Study Plans</h1>
            <p className="text-gray-600">Personalized study schedules to reach your target grades</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create New Plan
          </Button>
        </div>

        <Tabs defaultValue="today" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="today">Today's Tasks</TabsTrigger>
            <TabsTrigger value="plans">My Plans</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="ai-suggestions">AI Suggestions</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Today's Tasks */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CalendarIcon className="w-5 h-5" />
                      <span>Today's Tasks</span>
                    </CardTitle>
                    <CardDescription>
                      {todayTasks.filter(task => !task.completed).length} tasks remaining
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {todayTasks.length === 0 ? (
                        <div className="text-center py-8">
                          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
                          <p className="text-gray-600">No tasks scheduled for today. Great work!</p>
                        </div>
                      ) : (
                        todayTasks.map((task) => (
                          <div key={task.id} className={`p-4 border rounded-lg ${task.completed ? 'bg-gray-50' : 'bg-white'}`}>
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3">
                                <button
                                  onClick={() => toggleTaskCompletion(task.id)}
                                  className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                    task.completed 
                                      ? 'bg-green-600 border-green-600' 
                                      : 'border-gray-300 hover:border-primary'
                                  }`}
                                >
                                  {task.completed && <CheckCircle className="w-3 h-3 text-white" />}
                                </button>
                                <div className="flex-1">
                                  <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                    {task.title}
                                  </h3>
                                  <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                                  <div className="flex items-center space-x-4 mt-2">
                                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                                      {getTypeIcon(task.type)}
                                      <span>{task.subject}</span>
                                    </div>
                                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                                      <Clock className="w-4 h-4" />
                                      <span>{task.estimatedTime} min</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <Badge className={getPriorityColor(task.priority)}>
                                {task.priority}
                              </Badge>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Stats */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Today's Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">Tasks Completed</span>
                          <span className="text-sm text-gray-600">
                            {todayTasks.filter(task => task.completed).length}/{todayTasks.length}
                          </span>
                        </div>
                        <Progress 
                          value={todayTasks.length > 0 ? (todayTasks.filter(task => task.completed).length / todayTasks.length) * 100 : 0} 
                          className="h-2" 
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Time Planned</p>
                          <p className="font-medium">
                            {todayTasks.reduce((total, task) => total + task.estimatedTime, 0)} min
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Subjects</p>
                          <p className="font-medium">
                            {new Set(todayTasks.map(task => task.subject)).size}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Link to="/subjects">
                        <Button variant="outline" className="w-full justify-start">
                          <BookOpen className="w-4 h-4 mr-2" />
                          Practice Past Papers
                        </Button>
                      </Link>
                      <Link to="/question-generator">
                        <Button variant="outline" className="w-full justify-start">
                          <Plus className="w-4 h-4 mr-2" />
                          Generate Questions
                        </Button>
                      </Link>
                      <Link to="/ai-tutor">
                        <Button variant="outline" className="w-full justify-start">
                          <Brain className="w-4 h-4 mr-2" />
                          AI Study Assistant
                        </Button>
                      </Link>
                      <Link to="/progress">
                        <Button variant="outline" className="w-full justify-start">
                          <TrendingUp className="w-4 h-4 mr-2" />
                          View Progress
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="plans" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {studyPlans.map((plan) => (
                <Card key={plan.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                        <CardDescription>{plan.subject}</CardDescription>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Target Grade</p>
                          <p className="font-medium text-green-600">{plan.targetGrade}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Exam Date</p>
                          <p className="font-medium">{new Date(plan.examDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Weekly Hours</p>
                          <p className="font-medium">{plan.weeklyHours}h</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Tasks Done</p>
                          <p className="font-medium">{plan.completedTasks}/{plan.totalTasks}</p>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                          <span className="text-sm text-gray-600">{plan.progress}%</span>
                        </div>
                        <Progress value={plan.progress} className="h-2" />
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          {plan.progress >= 80 ? (
                            <Award className="w-4 h-4 text-yellow-500" />
                          ) : plan.progress >= 60 ? (
                            <TrendingUp className="w-4 h-4 text-blue-500" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-orange-500" />
                          )}
                          <span className="text-sm text-gray-600">
                            {plan.progress >= 80 ? 'Excellent progress!' : 
                             plan.progress >= 60 ? 'Good progress' : 
                             'Needs attention'}
                          </span>
                        </div>
                        <Button size="sm">View Details</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Study Calendar</CardTitle>
                    <CardDescription>View and manage your study schedule</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      className="rounded-md border"
                    />
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {selectedDate.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-blue-900">Mathematics</p>
                        <p className="text-sm text-blue-700">Algebra Practice - 90 min</p>
                        <p className="text-xs text-blue-600">9:00 AM - 10:30 AM</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-sm font-medium text-green-900">English</p>
                        <p className="text-sm text-green-700">Essay Writing - 60 min</p>
                        <p className="text-xs text-green-600">2:00 PM - 3:00 PM</p>
                      </div>
                      <div className="p-3 bg-orange-50 rounded-lg">
                        <p className="text-sm font-medium text-orange-900">Science</p>
                        <p className="text-sm text-orange-700">Physics Review - 45 min</p>
                        <p className="text-xs text-orange-600">7:00 PM - 7:45 PM</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ai-suggestions" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-primary" />
                    <span>AI Study Recommendations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-medium text-blue-900 mb-2">Optimize Study Schedule</h3>
                      <p className="text-sm text-blue-700 mb-3">
                        Based on your performance data, you learn best in the morning. Consider moving difficult topics to 9-11 AM.
                      </p>
                      <Button size="sm" variant="outline">Apply Suggestion</Button>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h3 className="font-medium text-green-900 mb-2">Focus on Weak Areas</h3>
                      <p className="text-sm text-green-700 mb-3">
                        Trigonometry needs attention. I recommend 3 additional practice sessions this week.
                      </p>
                      <Button size="sm" variant="outline">Add to Plan</Button>
                    </div>

                    <div className="p-4 bg-orange-50 rounded-lg">
                      <h3 className="font-medium text-orange-900 mb-2">Increase Practice Frequency</h3>
                      <p className="text-sm text-orange-700 mb-3">
                        Your current pace may not reach your A* target. Consider increasing practice to 4 sessions per week.
                      </p>
                      <Button size="sm" variant="outline">Update Plan</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-accent" />
                    <span>Personalized Goals</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-4 border-primary pl-4">
                      <h3 className="font-medium text-gray-900">This Week's Goal</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Complete 3 mathematics papers focusing on algebra and geometry
                      </p>
                      <div className="mt-2">
                        <Progress value={66} className="h-2" />
                        <p className="text-xs text-gray-500 mt-1">2 of 3 completed</p>
                      </div>
                    </div>

                    <div className="border-l-4 border-accent pl-4">
                      <h3 className="font-medium text-gray-900">Monthly Target</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Improve average score from 76% to 82% across all subjects
                      </p>
                      <div className="mt-2">
                        <Progress value={45} className="h-2" />
                        <p className="text-xs text-gray-500 mt-1">Current: 78% (+2%)</p>
                      </div>
                    </div>

                    <div className="border-l-4 border-green-500 pl-4">
                      <h3 className="font-medium text-gray-900">Exam Readiness</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Achieve consistent A-grade performance in practice papers
                      </p>
                      <div className="mt-2">
                        <Progress value={75} className="h-2" />
                        <p className="text-xs text-gray-500 mt-1">75% ready for target grade</p>
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