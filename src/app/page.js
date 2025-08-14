// src/app/page.js
'use client'

import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Form, Alert, Spinner } from 'react-bootstrap'
import QuestionCard from '../components/QuestionCard'

export default function TriviaGame() {
  const [gameState, setGameState] = useState('setup') // 'setup', 'playing', 'results'
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Game settings
  const [settings, setSettings] = useState({
    category: '',
    difficulty: 'medium',
    amount: 10,
    type: 'multiple'
  })

  // Game state
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [userAnswers, setUserAnswers] = useState([])

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await fetch('https://opentdb.com/api_category.php')
      const data = await response.json()
      setCategories(data.trivia_categories)
    } catch (err) {
      setError('Failed to load categories. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSettingChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      setError('')
      
      const url = new URL('https://opentdb.com/api.php')
      url.searchParams.append('amount', settings.amount)
      url.searchParams.append('category', settings.category)
      url.searchParams.append('difficulty', settings.difficulty)
      url.searchParams.append('type', settings.type)
      
      const response = await fetch(url)
      const data = await response.json()
      
      if (data.response_code !== 0) {
        throw new Error('Failed to fetch questions. Please try different settings.')
      }
      
      // Process questions to include shuffled answers
      const processedQuestions = data.results.map(q => {
        const allAnswers = [...q.incorrect_answers, q.correct_answer]
        // Shuffle answers
        for (let i = allAnswers.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[allAnswers[i], allAnswers[j]] = [allAnswers[j], allAnswers[i]]
        }
        
        return {
          ...q,
          all_answers: allAnswers
        }
      })
      
      setQuestions(processedQuestions)
      setCurrentQuestionIndex(0)
      setScore(0)
      setUserAnswers([])
      setGameState('playing')
      
    } catch (err) {
      setError(err.message || 'Failed to load questions. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswer = (selectedAnswer, isCorrect) => {
    const answerData = {
      question: questions[currentQuestionIndex],
      selectedAnswer,
      isCorrect,
      timeUsed: 30 // TODO: Calculate actual time used
    }
    
    setUserAnswers(prev => [...prev, answerData])
    
    if (isCorrect) {
      setScore(prev => prev + 1)
    }
    
    // Move to next question or end game
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      setGameState('results')
    }
  }

  const resetGame = () => {
    setGameState('setup')
    setQuestions([])
    setCurrentQuestionIndex(0)
    setScore(0)
    setUserAnswers([])
    setError('')
  }

  const startGame = () => {
    if (!settings.category) {
      setError('Please select a category')
      return
    }
    fetchQuestions()
  }

  const renderSetupScreen = () => (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-lg">
            <Card.Header className="bg-primary text-white text-center">
              <h2 className="mb-0">🧠 Trivia Challenge</h2>
            </Card.Header>
            <Card.Body className="p-4">
              <h5 className="text-center mb-4">Configure Your Game</h5>
              
              {error && (
                <Alert variant="danger" dismissible onClose={() => setError('')}>
                  {error}
                </Alert>
              )}

              <Form>
                {/* Category Selection */}
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select 
                    value={settings.category}
                    onChange={(e) => handleSettingChange('category', e.target.value)}
                    disabled={loading}
                  >
                    <option value="">Select a category...</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                {/* Difficulty Selection */}
                <Form.Group className="mb-3">
                  <Form.Label>Difficulty</Form.Label>
                  <div>
                    {['easy', 'medium', 'hard'].map(diff => (
                      <Form.Check
                        key={diff}
                        inline
                        type="radio"
                        name="difficulty"
                        id={`difficulty-${diff}`}
                        label={diff.charAt(0).toUpperCase() + diff.slice(1)}
                        checked={settings.difficulty === diff}
                        onChange={() => handleSettingChange('difficulty', diff)}
                      />
                    ))}
                  </div>
                </Form.Group>

                {/* Number of Questions */}
                <Form.Group className="mb-3">
                  <Form.Label>Number of Questions</Form.Label>
                  <Form.Select
                    value={settings.amount}
                    onChange={(e) => handleSettingChange('amount', parseInt(e.target.value))}
                  >
                    <option value={5}>5 Questions</option>
                    <option value={10}>10 Questions</option>
                    <option value={15}>15 Questions</option>
                    <option value={20}>20 Questions</option>
                  </Form.Select>
                </Form.Group>

                {/* Question Type */}
                <Form.Group className="mb-4">
                  <Form.Label>Question Type</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      type="radio"
                      name="type"
                      id="type-multiple"
                      label="Multiple Choice"
                      checked={settings.type === 'multiple'}
                      onChange={() => handleSettingChange('type', 'multiple')}
                    />
                    <Form.Check
                      inline
                      type="radio"
                      name="type"
                      id="type-boolean"
                      label="True/False"
                      checked={settings.type === 'boolean'}
                      onChange={() => handleSettingChange('type', 'boolean')}
                    />
                  </div>
                </Form.Group>

                <div className="d-grid">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    onClick={startGame}
                    disabled={loading || !settings.category}
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Loading...
                      </>
                    ) : (
                      'Start Game 🚀'
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )

  const renderGameScreen = () => (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          {/* Score and Progress Header */}
          <Card className="mb-4 shadow-sm">
            <Card.Body className="py-3">
              <Row className="align-items-center">
                <Col>
                  <h5 className="mb-0">
                    Score: <span className="text-primary">{score}/{questions.length}</span>
                  </h5>
                </Col>
                <Col className="text-center">
                  <small className="text-muted">
                    {categories.find(c => c.id == settings.category)?.name} | 
                    {settings.difficulty.charAt(0).toUpperCase() + settings.difficulty.slice(1)}
                  </small>
                </Col>
                <Col className="text-end">
                  <Button 
                    variant="outline-secondary" 
                    size="sm"
                    onClick={resetGame}
                  >
                    Quit Game
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Question Card */}
          <QuestionCard
            question={questions[currentQuestionIndex]}
            onAnswer={handleAnswer}
            currentQuestion={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            timePerQuestion={30}
          />
        </Col>
      </Row>
    </Container>
  )

  const renderResultsScreen = () => {
    const percentage = Math.round((score / questions.length) * 100)
    const decodeHTML = (text) => {
      const textarea = document.createElement('textarea')
      textarea.innerHTML = text
      return textarea.value
    }

    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <Card className="shadow-lg">
              <Card.Header className="bg-info text-white text-center">
                <h2 className="mb-0">🎉 Game Complete!</h2>
              </Card.Header>
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <h3>Final Score: {score}/{questions.length}</h3>
                  <h4 className="text-primary">{percentage}%</h4>
                  <p className="text-muted">
                    Category: {categories.find(c => c.id == settings.category)?.name} | 
                    Difficulty: {settings.difficulty.charAt(0).toUpperCase() + settings.difficulty.slice(1)}
                  </p>
                </div>

                <h5 className="mb-3">Review Your Answers:</h5>
                <div className="review-answers">
                  {userAnswers.map((answer, index) => (
                    <Card key={index} className={`mb-3 border-start border-5 ${answer.isCorrect ? 'border-success' : 'border-danger'}`}>
                      <Card.Body className="py-3">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <span className="badge bg-secondary">Question {index + 1}</span>
                          <span className={`badge ${answer.isCorrect ? 'bg-success' : 'bg-danger'}`}>
                            {answer.isCorrect ? '✅ Correct' : '❌ Incorrect'}
                          </span>
                        </div>
                        <h6 className="mb-2">{decodeHTML(answer.question.question)}</h6>
                        <div className="small">
                          <div className="mb-1">
                            <strong>Your answer:</strong> {decodeHTML(answer.selectedAnswer || 'No answer')}
                          </div>
                          {!answer.isCorrect && (
                            <div className="text-success">
                              <strong>Correct answer:</strong> {decodeHTML(answer.question.correct_answer)}
                            </div>
                          )}
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                </div>

                <div className="d-grid gap-2 d-md-flex justify-content-md-center mt-4">
                  <Button 
                    variant="primary" 
                    size="lg"
                    onClick={resetGame}
                    className="me-md-2"
                  >
                    Play Again
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    size="lg"
                    onClick={() => setGameState('setup')}
                  >
                    Change Settings
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    )
  }

  // Main render
  return (
    <div className="min-vh-100 bg-light">
      {gameState === 'setup' && renderSetupScreen()}
      {gameState === 'playing' && renderGameScreen()}
      {gameState === 'results' && renderResultsScreen()}
    </div>
  )
}