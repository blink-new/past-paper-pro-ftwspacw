import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { blink } from '../blink/client'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Textarea } from '../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group'
import { Label } from '../components/ui/label'
import { 
  Brain,
  Wand2,
  ArrowLeft,
  GraduationCap,
  Settings,
  LogOut,
  RefreshCw,
  CheckCircle,
  Target,
  Clock,
  BookOpen,
  Lightbulb
} from 'lucide-react'

interface GeneratedQuestion {
  id: string
  question: string
  type: 'multiple-choice' | 'short-answer' | 'essay'
  options?: string[]
  correctAnswer?: string
  explanation: string
  marks: number
  topic: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export default function QuestionGenerator() {
  const [user, setUser] = useState(null)
  const [selectedSubject, setSelectedSubject] = useState('Mathematics')
  const [selectedTopic, setSelectedTopic] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium')
  const [questionType, setQuestionType] = useState('mixed')
  const [numberOfQuestions, setNumberOfQuestions] = useState('3')
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([])
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({})
  const [showAnswers, setShowAnswers] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [loading, setLoading] = useState(true)

  const subjects = {
    'Mathematics': ['Algebra', 'Geometry', 'Trigonometry', 'Statistics', 'Probability', 'Calculus'],
    'English Language': ['Reading Comprehension', 'Creative Writing', 'Language Analysis', 'Grammar'],
    'English Literature': ['Poetry Analysis', 'Prose Analysis', 'Drama Analysis', 'Context'],
    'Science': ['Biology', 'Chemistry', 'Physics'],
    'Biology': ['Cell Biology', 'Genetics', 'Evolution', 'Ecology', 'Human Biology'],
    'Chemistry': ['Atomic Structure', 'Bonding', 'Reactions', 'Organic Chemistry', 'Analysis'],
    'Physics': ['Forces', 'Energy', 'Waves', 'Electricity', 'Magnetism', 'Quantum Physics'],
    'History': ['Medieval History', 'Modern History', 'World Wars', 'Social History'],
    'Geography': ['Physical Geography', 'Human Geography', 'Environmental Issues'],
    'Computer Science': ['Programming', 'Algorithms', 'Data Structures', 'Networks', 'Databases']
  }

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await blink.auth.me()
        setUser(currentUser)
      } catch (error) {
        console.error('Error loading user:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  const generateQuestions = async () => {
    setIsGenerating(true)
    setGeneratedQuestions([])
    setUserAnswers({})
    setShowAnswers(false)

    try {
      const topicText = selectedTopic ? `focusing on ${selectedTopic}` : ''
      const typeText = questionType === 'mixed' ? 'a mix of multiple-choice, short-answer, and essay questions' : `${questionType} questions`
      
      const { text } = await blink.ai.generateText({
        prompt: `You are an expert ${selectedSubject} teacher creating practice questions for GCSE/A-Level students.

Generate exactly ${numberOfQuestions} ${typeText} ${topicText} at ${selectedDifficulty} difficulty level.

For each question, provide:
1. The question text
2. Question type (multiple-choice, short-answer, or essay)
3. If multiple-choice: 4 options (A, B, C, D)
4. The correct answer
5. A detailed explanation
6. Number of marks (1-6)
7. Specific topic area
8. Difficulty level

Format your response as a JSON array with this structure:
[
  {
    "question": "Question text here",
    "type": "multiple-choice",
    "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
    "correctAnswer": "B) Option 2",
    "explanation": "Detailed explanation here",
    "marks": 2,
    "topic": "Specific topic",
    "difficulty": "medium"
  }
]

Make sure questions are educationally valuable and appropriate for the level.`,
        maxTokens: 1500
      })

      // Try to parse the JSON response
      try {
        const questionsData = JSON.parse(text)
        const questions: GeneratedQuestion[] = questionsData.map((q: any, index: number) => ({
          id: `q_${Date.now()}_${index}`,
          question: q.question,
          type: q.type,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          marks: q.marks || 2,
          topic: q.topic || selectedTopic || selectedSubject,
          difficulty: q.difficulty || selectedDifficulty
        }))
        
        setGeneratedQuestions(questions)
      } catch (parseError) {
        // If JSON parsing fails, create a fallback question
        console.error('Failed to parse AI response:', parseError)
        const fallbackQuestion: GeneratedQuestion = {
          id: `q_${Date.now()}`,
          question: text.substring(0, 200) + '...',
          type: 'short-answer',
          explanation: 'AI-generated question - please review the content above.',
          marks: 3,
          topic: selectedTopic || selectedSubject,
          difficulty: selectedDifficulty as 'easy' | 'medium' | 'hard'
        }
        setGeneratedQuestions([fallbackQuestion])
      }
    } catch (error) {
      console.error('Error generating questions:', error)
      // Create an error question
      const errorQuestion: GeneratedQuestion = {
        id: `error_${Date.now()}`,
        question: 'Sorry, there was an error generating questions. Please try again.',
        type: 'short-answer',
        explanation: 'Please try generating questions again with different parameters.',
        marks: 0,
        topic: 'Error',
        difficulty: 'medium'
      }
      setGeneratedQuestions([errorQuestion])
    } finally {
      setIsGenerating(false)
    }
  }

  const handleAnswerChange = (questionId: string, answer: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const checkAnswers = () => {
    setShowAnswers(true)
  }

  const resetQuestions = () => {
    setGeneratedQuestions([])
    setUserAnswers({})
    setShowAnswers(false)
  }

  const handleLogout = () => {
    blink.auth.logout('/')
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
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
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Question Generator</h1>
          <p className="text-gray-600">Generate unlimited practice questions tailored to your needs</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Configuration Panel */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-primary" />
                  <span>Question Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Subject Selection */}
                <div>
                  <Label className="text-sm font-medium">Subject</Label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(subjects).map(subject => (
                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Topic Selection */}
                <div>
                  <Label className="text-sm font-medium">Topic (Optional)</Label>
                  <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any topic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any topic</SelectItem>
                      {subjects[selectedSubject as keyof typeof subjects]?.map(topic => (
                        <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Difficulty */}
                <div>
                  <Label className="text-sm font-medium">Difficulty</Label>
                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Question Type */}
                <div>
                  <Label className="text-sm font-medium">Question Type</Label>
                  <Select value={questionType} onValueChange={setQuestionType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mixed">Mixed Types</SelectItem>
                      <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                      <SelectItem value="short-answer">Short Answer</SelectItem>
                      <SelectItem value="essay">Essay Questions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Number of Questions */}
                <div>
                  <Label className="text-sm font-medium">Number of Questions</Label>
                  <Select value={numberOfQuestions} onValueChange={setNumberOfQuestions}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Question</SelectItem>
                      <SelectItem value="3">3 Questions</SelectItem>
                      <SelectItem value="5">5 Questions</SelectItem>
                      <SelectItem value="10">10 Questions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Generate Button */}
                <Button 
                  onClick={generateQuestions} 
                  disabled={isGenerating}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Generate Questions
                    </>
                  )}
                </Button>

                {generatedQuestions.length > 0 && (
                  <div className="space-y-2">
                    <Button 
                      onClick={checkAnswers} 
                      variant="outline"
                      className="w-full"
                      disabled={showAnswers}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Check Answers
                    </Button>
                    <Button 
                      onClick={resetQuestions} 
                      variant="outline"
                      className="w-full"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Questions Display */}
          <div className="lg:col-span-3">
            {generatedQuestions.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Generate Questions</h3>
                  <p className="text-gray-600 mb-4">
                    Configure your preferences and click "Generate Questions" to create personalized practice questions.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-md mx-auto">
                    <div className="text-center">
                      <Target className="w-8 h-8 text-primary mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Targeted Practice</p>
                    </div>
                    <div className="text-center">
                      <Clock className="w-8 h-8 text-accent mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Instant Generation</p>
                    </div>
                    <div className="text-center">
                      <Lightbulb className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">AI-Powered</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {generatedQuestions.map((question, index) => (
                  <Card key={question.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="outline">{question.marks} marks</Badge>
                            <Badge variant="secondary">{question.topic}</Badge>
                            <Badge className={getDifficultyColor(question.difficulty)}>
                              {question.difficulty}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Question Text */}
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-gray-900 leading-relaxed">{question.question}</p>
                        </div>

                        {/* Answer Input */}
                        {question.type === 'multiple-choice' && question.options ? (
                          <RadioGroup
                            value={userAnswers[question.id] || ''}
                            onValueChange={(value) => handleAnswerChange(question.id, value)}
                          >
                            {question.options.map((option, optionIndex) => (
                              <div key={optionIndex} className="flex items-center space-x-2">
                                <RadioGroupItem value={option} id={`${question.id}-${optionIndex}`} />
                                <Label htmlFor={`${question.id}-${optionIndex}`} className="cursor-pointer">
                                  {option}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        ) : (
                          <Textarea
                            placeholder="Enter your answer here..."
                            value={userAnswers[question.id] || ''}
                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                            className="min-h-[100px]"
                          />
                        )}

                        {/* Show Answer and Explanation */}
                        {showAnswers && (
                          <div className="space-y-3 border-t pt-4">
                            {question.correctAnswer && (
                              <div className="p-3 bg-green-50 rounded-lg">
                                <p className="text-sm font-medium text-green-900 mb-1">Correct Answer:</p>
                                <p className="text-green-800">{question.correctAnswer}</p>
                              </div>
                            )}
                            <div className="p-3 bg-blue-50 rounded-lg">
                              <p className="text-sm font-medium text-blue-900 mb-1">Explanation:</p>
                              <p className="text-blue-800">{question.explanation}</p>
                            </div>
                            {userAnswers[question.id] && (
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm font-medium text-gray-900 mb-1">Your Answer:</p>
                                <p className="text-gray-800">{userAnswers[question.id]}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}