import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { blink } from '../blink/client'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { ScrollArea } from '../components/ui/scroll-area'
import { 
  Brain,
  Send,
  ArrowLeft,
  GraduationCap,
  Settings,
  LogOut,
  User,
  Bot,
  Lightbulb,
  BookOpen,
  Target,
  Clock
} from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  subject?: string
}

interface QuickPrompt {
  id: string
  title: string
  prompt: string
  icon: React.ReactNode
  category: string
}

export default function AITutorChat() {
  const [user, setUser] = useState(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState('Mathematics')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const quickPrompts: QuickPrompt[] = [
    {
      id: '1',
      title: 'Explain a concept',
      prompt: 'Can you explain quadratic equations in simple terms?',
      icon: <Lightbulb className="w-4 h-4" />,
      category: 'Learning'
    },
    {
      id: '2',
      title: 'Practice questions',
      prompt: 'Give me 3 practice questions on algebra',
      icon: <BookOpen className="w-4 h-4" />,
      category: 'Practice'
    },
    {
      id: '3',
      title: 'Study tips',
      prompt: 'What are the best ways to prepare for GCSE Mathematics?',
      icon: <Target className="w-4 h-4" />,
      category: 'Strategy'
    },
    {
      id: '4',
      title: 'Time management',
      prompt: 'How should I manage my time during a 90-minute exam?',
      icon: <Clock className="w-4 h-4" />,
      category: 'Strategy'
    }
  ]

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await blink.auth.me()
        setUser(currentUser)
        
        // Add welcome message
        setMessages([{
          id: '1',
          type: 'ai',
          content: `Hello! I'm your AI tutor assistant. I'm here to help you with your ${selectedSubject} studies. You can ask me to explain concepts, provide practice questions, give study tips, or help with any specific problems you're facing. How can I help you today?`,
          timestamp: new Date()
        }])
      } catch (error) {
        console.error('Error loading user:', error)
      }
    }

    loadUser()
  }, [selectedSubject])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async (messageContent?: string) => {
    const content = messageContent || inputMessage.trim()
    if (!content) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
      subject: selectedSubject
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const { text } = await blink.ai.generateText({
        prompt: `You are an expert ${selectedSubject} tutor for GCSE and A-Level students. The student has asked: "${content}". 

Please provide a helpful, clear, and educational response that:
1. Directly addresses their question
2. Uses simple, age-appropriate language
3. Includes examples where relevant
4. Encourages further learning
5. Is supportive and motivating

Keep your response concise but comprehensive. If they ask for practice questions, provide them with step-by-step solutions.`,
        maxTokens: 500
      })

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: text,
        timestamp: new Date(),
        subject: selectedSubject
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error getting AI response:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'I apologize, but I encountered an error. Please try asking your question again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickPrompt = (prompt: string) => {
    handleSendMessage(prompt)
  }

  const handleLogout = () => {
    blink.auth.logout('/')
  }

  const subjects = [
    'Mathematics', 'English Language', 'English Literature', 'Science', 
    'Biology', 'Chemistry', 'Physics', 'History', 'Geography', 'Computer Science'
  ]

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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Subject Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Subject</CardTitle>
              </CardHeader>
              <CardContent>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </CardContent>
            </Card>

            {/* Quick Prompts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Prompts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {quickPrompts.map(prompt => (
                    <Button
                      key={prompt.id}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-left h-auto p-3"
                      onClick={() => handleQuickPrompt(prompt.prompt)}
                    >
                      <div className="flex items-start space-x-2">
                        {prompt.icon}
                        <div>
                          <div className="font-medium text-sm">{prompt.title}</div>
                          <div className="text-xs text-gray-600 mt-1">{prompt.prompt}</div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="p-2 bg-blue-50 rounded">
                    <p className="text-blue-800">Ask specific questions for better help</p>
                  </div>
                  <div className="p-2 bg-green-50 rounded">
                    <p className="text-green-800">Request practice questions anytime</p>
                  </div>
                  <div className="p-2 bg-orange-50 rounded">
                    <p className="text-orange-800">Get explanations for difficult concepts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="h-full flex flex-col">
              <CardHeader className="border-b">
                <div className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-primary" />
                  <CardTitle>AI Tutor - {selectedSubject}</CardTitle>
                  <Badge variant="secondary">Online</Badge>
                </div>
              </CardHeader>
              
              {/* Messages */}
              <CardContent className="flex-1 p-0">
                <ScrollArea className="h-full p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex items-start space-x-2 max-w-[80%] ${
                          message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                        }`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            message.type === 'user' 
                              ? 'bg-primary text-white' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {message.type === 'user' ? (
                              <User className="w-4 h-4" />
                            ) : (
                              <Bot className="w-4 h-4" />
                            )}
                          </div>
                          <div className={`rounded-lg p-3 ${
                            message.type === 'user'
                              ? 'bg-primary text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}>
                            <div className="whitespace-pre-wrap">{message.content}</div>
                            <div className={`text-xs mt-2 ${
                              message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {message.timestamp.toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="flex items-start space-x-2 max-w-[80%]">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <Bot className="w-4 h-4 text-gray-600" />
                          </div>
                          <div className="bg-gray-100 rounded-lg p-3">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </CardContent>

              {/* Input */}
              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder={`Ask me anything about ${selectedSubject}...`}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button 
                    onClick={() => handleSendMessage()}
                    disabled={isLoading || !inputMessage.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Press Enter to send, Shift+Enter for new line
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}