import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { blink } from '../blink/client'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Progress } from '../components/ui/progress'
import { Textarea } from '../components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group'
import { Label } from '../components/ui/label'
import { 
  BookOpen, 
  Clock,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Send,
  Brain,
  Target,
  Award,
  GraduationCap,
  Settings,
  LogOut,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react'

interface Question {
  id: number
  text: string
  type: 'multiple-choice' | 'short-answer' | 'essay'
  marks: number
  options?: string[]
  topic: string
}

interface PastPaper {
  id: string
  title: string
  year: number
  examBoard: string
  paperType: string
  season: string
  totalMarks: number
  timeLimit: number
  questions: Question[]
}

interface Answer {
  questionId: number
  answer: string
  timeSpent: number
}

export default function PastPaperPractice() {
  const { subjectId } = useParams()
  const [user, setUser] = useState(null)
  const [pastPaper, setPastPaper] = useState<PastPaper | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, Answer>>({})
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [aifeedback, setAiFeedback] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const loadPastPaper = async () => {
      try {
        const currentUser = await blink.auth.me()
        setUser(currentUser)

        // Mock past paper data
        const mockPaper: PastPaper = {
          id: 'gcse-math-2023-p1',
          title: 'GCSE Mathematics Paper 1',
          year: 2023,
          examBoard: 'AQA',
          paperType: 'Paper 1',
          season: 'Summer',
          totalMarks: 80,
          timeLimit: 90, // minutes
          questions: [
            {
              id: 1,
              text: 'Solve the equation 3x + 7 = 22',
              type: 'short-answer',
              marks: 2,
              topic: 'Algebra'
            },
            {
              id: 2,
              text: 'Calculate the area of a circle with radius 5cm. Give your answer to 2 decimal places.',
              type: 'short-answer',
              marks: 3,
              topic: 'Geometry'
            },
            {
              id: 3,
              text: 'A bag contains 5 red balls and 3 blue balls. What is the probability of drawing a red ball?',
              type: 'multiple-choice',
              marks: 2,
              options: ['3/8', '5/8', '3/5', '5/3'],
              topic: 'Probability'
            },
            {
              id: 4,
              text: 'Expand and simplify (x + 3)(x - 2)',
              type: 'short-answer',
              marks: 3,
              topic: 'Algebra'
            },
            {
              id: 5,
              text: 'The table shows the number of goals scored by a football team in 20 matches. Calculate the mean number of goals per match.',
              type: 'short-answer',
              marks: 4,
              topic: 'Statistics'
            },
            {
              id: 6,
              text: 'Explain the method you would use to solve a quadratic equation by factoring. Use an example to illustrate your explanation.',
              type: 'essay',
              marks: 6,
              topic: 'Algebra'
            }
          ]
        }

        setPastPaper(mockPaper)
        setTimeRemaining(mockPaper.timeLimit * 60) // Convert to seconds
      } catch (error) {
        console.error('Error loading past paper:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPastPaper()
  }, [subjectId])

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false)
            handleSubmit()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning, timeRemaining, handleSubmit])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        questionId,
        answer,
        timeSpent: 0 // Would track actual time spent
      }
    }))
  }

  const handleSubmit = useCallback(async () => {
    if (!pastPaper) return
    
    setSubmitting(true)
    try {
      // Generate AI feedback
      const answersText = Object.values(answers).map(answer => 
        `Question ${answer.questionId}: ${answer.answer}`
      ).join('\n\n')

      const { text } = await blink.ai.generateText({
        prompt: `You are an expert ${pastPaper.title.includes('Mathematics') ? 'Mathematics' : 'subject'} teacher providing detailed feedback on student answers to a past paper.

For each question answered, please provide:
1. ✅ or ❌ to indicate if the answer is correct/incorrect
2. The correct answer (if different from student's answer)
3. Specific feedback on the method and approach used
4. Constructive tips for improvement
5. A score out of the total marks for that question
6. Key concepts the student should review

Past Paper: ${pastPaper.title}
Total Questions: ${pastPaper.questions.length}
Questions and Student Answers:
${answersText}

Please format your response clearly with headings for each question and be encouraging while providing constructive feedback. Focus on helping the student understand where they went wrong and how to improve.`,
        maxTokens: 1200
      })

      setAiFeedback(text)
      setShowResults(true)
      setIsTimerRunning(false)
    } catch (error) {
      console.error('Error generating feedback:', error)
      setAiFeedback('Unable to generate feedback at this time. Please try again.')
      setShowResults(true)
    } finally {
      setSubmitting(false)
    }
  }, [pastPaper, answers])

  const startTimer = () => {
    setIsTimerRunning(true)
  }

  const pauseTimer = () => {
    setIsTimerRunning(false)
  }

  const resetTimer = () => {
    if (pastPaper) {
      setTimeRemaining(pastPaper.timeLimit * 60)
      setIsTimerRunning(false)
    }
  }

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

  if (!pastPaper) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Past Paper Not Found</h2>
          <p className="text-gray-600 mb-4">The requested past paper could not be loaded.</p>
          <Link to="/subjects">
            <Button>Back to Subjects</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (showResults) {
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

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Results Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Practice Complete!</h1>
            <p className="text-gray-600">{pastPaper.title} - {pastPaper.year}</p>
          </div>

          {/* Score Summary */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Your Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {Object.keys(answers).length}/{pastPaper.questions.length}
                  </div>
                  <p className="text-gray-600">Questions Answered</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-2">
                    {formatTime((pastPaper.timeLimit * 60) - timeRemaining)}
                  </div>
                  <p className="text-gray-600">Time Taken</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">85%</div>
                  <p className="text-gray-600">Estimated Score</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Feedback */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-primary" />
                <CardTitle>AI Feedback & Analysis</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-gray-700">
                  {aifeedback}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/subjects">
              <Button variant="outline" size="lg">
                Try Another Paper
              </Button>
            </Link>
            <Link to="/progress">
              <Button size="lg">
                View Detailed Progress
              </Button>
            </Link>
            <Link to="/study-plans">
              <Button variant="outline" size="lg">
                Update Study Plan
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const currentQuestion = pastPaper.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / pastPaper.questions.length) * 100

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/subjects">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Past Paper Pro</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Timer */}
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-600" />
                <span className={`font-mono text-lg ${timeRemaining < 600 ? 'text-red-600' : 'text-gray-900'}`}>
                  {formatTime(timeRemaining)}
                </span>
                <div className="flex items-center space-x-1">
                  {!isTimerRunning ? (
                    <Button variant="ghost" size="sm" onClick={startTimer}>
                      <Play className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button variant="ghost" size="sm" onClick={pauseTimer}>
                      <Pause className="w-4 h-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={resetTimer}>
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Paper Info */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{pastPaper.title}</h1>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>{pastPaper.examBoard}</span>
            <span>•</span>
            <span>{pastPaper.year} {pastPaper.season}</span>
            <span>•</span>
            <span>{pastPaper.totalMarks} marks</span>
            <span>•</span>
            <span>{pastPaper.timeLimit} minutes</span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Question {currentQuestionIndex + 1} of {pastPaper.questions.length}
            </span>
            <span className="text-sm text-gray-600">{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">Question {currentQuestion.id}</CardTitle>
                <div className="flex items-center space-x-4 mt-2">
                  <Badge variant="outline">{currentQuestion.marks} marks</Badge>
                  <Badge variant="secondary">{currentQuestion.topic}</Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <p className="text-gray-900 leading-relaxed">{currentQuestion.text}</p>
            </div>

            {/* Answer Input */}
            <div className="space-y-4">
              {currentQuestion.type === 'multiple-choice' && currentQuestion.options ? (
                <RadioGroup
                  value={answers[currentQuestion.id]?.answer || ''}
                  onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                >
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                <Textarea
                  placeholder="Enter your answer here..."
                  value={answers[currentQuestion.id]?.answer || ''}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  className={`min-h-[120px] ${currentQuestion.type === 'essay' ? 'min-h-[200px]' : ''}`}
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex items-center space-x-2">
            {pastPaper.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                  index === currentQuestionIndex
                    ? 'bg-primary text-white'
                    : answers[pastPaper.questions[index].id]
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {currentQuestionIndex === pastPaper.questions.length - 1 ? (
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Paper
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentQuestionIndex(prev => Math.min(pastPaper.questions.length - 1, prev + 1))}
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}