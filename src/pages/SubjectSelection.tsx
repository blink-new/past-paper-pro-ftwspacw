import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { blink } from '../blink/client'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Input } from '../components/ui/input'
import { 
  BookOpen, 
  Search,
  Filter,
  GraduationCap,
  Settings,
  LogOut,
  Clock,
  FileText,
  TrendingUp,
  Star
} from 'lucide-react'

interface Subject {
  id: string
  name: string
  educationLevel: 'gcse' | 'alevel'
  examBoard: string
  description: string
  paperCount: number
  averageScore?: number
  lastAttempt?: string
  difficulty: number
}

export default function SubjectSelection() {
  const [user, setUser] = useState(null)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([])
  const [selectedLevel, setSelectedLevel] = useState<'gcse' | 'alevel'>('gcse')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const currentUser = await blink.auth.me()
        setUser(currentUser)

        // Mock subjects data
        const mockSubjects: Subject[] = [
          {
            id: 'gcse-math',
            name: 'Mathematics',
            educationLevel: 'gcse',
            examBoard: 'AQA',
            description: 'GCSE Mathematics covering algebra, geometry, statistics and more',
            paperCount: 15,
            averageScore: 78,
            lastAttempt: '2 days ago',
            difficulty: 3
          },
          {
            id: 'gcse-eng-lang',
            name: 'English Language',
            educationLevel: 'gcse',
            examBoard: 'AQA',
            description: 'GCSE English Language focusing on reading, writing and spoken language',
            paperCount: 12,
            averageScore: 82,
            lastAttempt: '1 week ago',
            difficulty: 3
          },
          {
            id: 'gcse-eng-lit',
            name: 'English Literature',
            educationLevel: 'gcse',
            examBoard: 'AQA',
            description: 'GCSE English Literature covering poetry, prose and drama',
            paperCount: 10,
            difficulty: 4
          },
          {
            id: 'gcse-science',
            name: 'Science (Combined)',
            educationLevel: 'gcse',
            examBoard: 'AQA',
            description: 'GCSE Combined Science covering biology, chemistry and physics',
            paperCount: 18,
            averageScore: 75,
            lastAttempt: '3 days ago',
            difficulty: 4
          },
          {
            id: 'gcse-biology',
            name: 'Biology',
            educationLevel: 'gcse',
            examBoard: 'AQA',
            description: 'GCSE Biology covering life processes and living things',
            paperCount: 8,
            difficulty: 3
          },
          {
            id: 'gcse-chemistry',
            name: 'Chemistry',
            educationLevel: 'gcse',
            examBoard: 'AQA',
            description: 'GCSE Chemistry covering atomic structure, bonding and reactions',
            paperCount: 9,
            difficulty: 4
          },
          {
            id: 'gcse-physics',
            name: 'Physics',
            educationLevel: 'gcse',
            examBoard: 'AQA',
            description: 'GCSE Physics covering forces, energy, waves and matter',
            paperCount: 11,
            difficulty: 4
          },
          {
            id: 'gcse-history',
            name: 'History',
            educationLevel: 'gcse',
            examBoard: 'AQA',
            description: 'GCSE History covering key historical periods and themes',
            paperCount: 7,
            difficulty: 3
          },
          {
            id: 'gcse-geography',
            name: 'Geography',
            educationLevel: 'gcse',
            examBoard: 'AQA',
            description: 'GCSE Geography covering physical and human geography',
            paperCount: 6,
            difficulty: 3
          },
          {
            id: 'gcse-computer-science',
            name: 'Computer Science',
            educationLevel: 'gcse',
            examBoard: 'AQA',
            description: 'GCSE Computer Science covering programming and computational thinking',
            paperCount: 5,
            difficulty: 4
          },
          // A-Level subjects
          {
            id: 'alevel-math',
            name: 'Mathematics',
            educationLevel: 'alevel',
            examBoard: 'AQA',
            description: 'A-Level Mathematics covering pure, mechanics and statistics',
            paperCount: 20,
            averageScore: 85,
            lastAttempt: '1 day ago',
            difficulty: 5
          },
          {
            id: 'alevel-further-math',
            name: 'Further Mathematics',
            educationLevel: 'alevel',
            examBoard: 'AQA',
            description: 'A-Level Further Mathematics for advanced mathematical study',
            paperCount: 15,
            difficulty: 5
          },
          {
            id: 'alevel-physics',
            name: 'Physics',
            educationLevel: 'alevel',
            examBoard: 'AQA',
            description: 'A-Level Physics covering mechanics, electricity, waves and quantum physics',
            paperCount: 18,
            averageScore: 79,
            lastAttempt: '4 days ago',
            difficulty: 5
          },
          {
            id: 'alevel-chemistry',
            name: 'Chemistry',
            educationLevel: 'alevel',
            examBoard: 'AQA',
            description: 'A-Level Chemistry covering organic, inorganic and physical chemistry',
            paperCount: 16,
            difficulty: 5
          },
          {
            id: 'alevel-biology',
            name: 'Biology',
            educationLevel: 'alevel',
            examBoard: 'AQA',
            description: 'A-Level Biology covering molecular biology, ecology and evolution',
            paperCount: 14,
            difficulty: 4
          },
          {
            id: 'alevel-eng-lit',
            name: 'English Literature',
            educationLevel: 'alevel',
            examBoard: 'AQA',
            description: 'A-Level English Literature covering poetry, prose and drama analysis',
            paperCount: 12,
            difficulty: 4
          },
          {
            id: 'alevel-history',
            name: 'History',
            educationLevel: 'alevel',
            examBoard: 'AQA',
            description: 'A-Level History covering in-depth historical analysis and interpretation',
            paperCount: 10,
            difficulty: 4
          },
          {
            id: 'alevel-psychology',
            name: 'Psychology',
            educationLevel: 'alevel',
            examBoard: 'AQA',
            description: 'A-Level Psychology covering approaches, research methods and applications',
            paperCount: 8,
            difficulty: 4
          },
          {
            id: 'alevel-economics',
            name: 'Economics',
            educationLevel: 'alevel',
            examBoard: 'AQA',
            description: 'A-Level Economics covering micro and macroeconomic theory',
            paperCount: 9,
            difficulty: 4
          },
          {
            id: 'alevel-computer-science',
            name: 'Computer Science',
            educationLevel: 'alevel',
            examBoard: 'AQA',
            description: 'A-Level Computer Science covering advanced programming and theory',
            paperCount: 7,
            difficulty: 5
          }
        ]

        setSubjects(mockSubjects)
      } catch (error) {
        console.error('Error loading subjects:', error)
      } finally {
        setLoading(false)
      }
    }

    loadSubjects()
  }, [])

  useEffect(() => {
    let filtered = subjects.filter(subject => subject.educationLevel === selectedLevel)
    
    if (searchQuery) {
      filtered = filtered.filter(subject =>
        subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subject.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    setFilteredSubjects(filtered)
  }, [subjects, selectedLevel, searchQuery])

  const handleLogout = () => {
    blink.auth.logout('/')
  }

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 2) return 'bg-green-100 text-green-800'
    if (difficulty <= 3) return 'bg-yellow-100 text-yellow-800'
    if (difficulty <= 4) return 'bg-orange-100 text-orange-800'
    return 'bg-red-100 text-red-800'
  }

  const getDifficultyText = (difficulty: number) => {
    if (difficulty <= 2) return 'Easy'
    if (difficulty <= 3) return 'Medium'
    if (difficulty <= 4) return 'Hard'
    return 'Very Hard'
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
              <Link to="/subjects" className="text-primary font-medium">Subjects</Link>
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
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Subject</h1>
          <p className="text-gray-600">Select a subject to start practicing with past papers</p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Level Selection */}
          <div className="flex justify-center">
            <div className="bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setSelectedLevel('gcse')}
                className={`px-6 py-3 rounded-md font-medium transition-all ${
                  selectedLevel === 'gcse'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                GCSE (Ages 14-16)
              </button>
              <button
                onClick={() => setSelectedLevel('alevel')}
                className={`px-6 py-3 rounded-md font-medium transition-all ${
                  selectedLevel === 'alevel'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                A-Level (Ages 16-18)
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search subjects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((subject) => (
            <Card key={subject.id} className="hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      selectedLevel === 'gcse' ? 'bg-primary/10' : 'bg-accent/10'
                    }`}>
                      <BookOpen className={`w-6 h-6 ${
                        selectedLevel === 'gcse' ? 'text-primary' : 'text-accent'
                      }`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{subject.name}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {subject.examBoard}
                      </Badge>
                    </div>
                  </div>
                  <Badge className={`text-xs ${getDifficultyColor(subject.difficulty)}`}>
                    {getDifficultyText(subject.difficulty)}
                  </Badge>
                </div>
                <CardDescription className="mt-2">
                  {subject.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{subject.paperCount} papers</span>
                    </div>
                    {subject.averageScore && (
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{subject.averageScore}% avg</span>
                      </div>
                    )}
                  </div>

                  {subject.lastAttempt && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>Last attempt: {subject.lastAttempt}</span>
                    </div>
                  )}

                  {/* Action Button */}
                  <Link to={`/practice/${subject.id}`} className="block">
                    <Button className="w-full group-hover:bg-primary/90 transition-colors">
                      Start Practice
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSubjects.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No subjects found</h3>
            <p className="text-gray-600">
              {searchQuery 
                ? `No subjects match "${searchQuery}". Try a different search term.`
                : 'No subjects available for the selected level.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}