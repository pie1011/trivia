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
        <Col md={10} lg={8}>
          <div className="crt-monitor">
            <div className="retro-container">
              {/* Arcade Title */}
              <div className="text-center p-4 border-bottom" style={{ borderColor: 'var(--neon-pink)' }}>
                <h1 className="font-title neon-cycle mb-2" style={{ fontSize: '2.5rem' }}>
                  TRIVIA ARCADE
                </h1>
                <div className="font-retro neon-pink">INSERT COIN TO PLAY</div>
              </div>
              
              <div className="p-4">
                <h3 className="font-title neon-cyan text-center mb-4">CONFIGURE GAME</h3>
                
                {error && (
                  <div className="p-3 mb-4 border rounded neon-red" 
                       style={{ 
                         backgroundColor: 'var(--space-dark)', 
                         borderColor: 'var(--neon-red)',
                         boxShadow: 'var(--glow-medium)'
                       }}>
                    <div className="font-mono">⚠ ERROR: {error}</div>
                  </div>
                )}

                {/* Category Selection */}
                <div className="mb-4">
                  <label className="font-title neon-purple mb-3 d-block">CATEGORY</label>
                  <select 
                    className="retro-btn w-100 font-body"
                    style={{ 
                      backgroundColor: 'var(--space-dark)',
                      color: 'var(--neon-cyan)',
                      border: '2px solid var(--neon-cyan)'
                    }}
                    value={settings.category}
                    onChange={(e) => handleSettingChange('category', e.target.value)}
                    disabled={loading}
                  >
                    <option value="">► SELECT CATEGORY ◄</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id} style={{ backgroundColor: 'var(--space-dark)' }}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Difficulty Selection */}
                <div className="mb-4">
                  <label className="font-title neon-lime mb-3 d-block">DIFFICULTY LEVEL</label>
                  <div className="d-flex gap-2 flex-wrap">
                    {['easy', 'medium', 'hard'].map((diff, index) => {
                      const colors = ['var(--neon-green)', 'var(--neon-orange)', 'var(--neon-red)']
                      const isSelected = settings.difficulty === diff
                      return (
                        <button
                          key={diff}
                          type="button"
                          className={`retro-btn ${isSelected ? 'neon-pulse' : ''}`}
                          style={{ 
                            color: colors[index],
                            borderColor: colors[index],
                            backgroundColor: isSelected ? colors[index] : 'transparent',
                            color: isSelected ? 'var(--space-black)' : colors[index]
                          }}
                          onClick={() => handleSettingChange('difficulty', diff)}
                        >
                          {diff.toUpperCase()}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Number of Questions */}
                <div className="mb-4">
                  <label className="font-title neon-orange mb-3 d-block">QUESTION COUNT</label>
                  <div className="d-flex gap-2 flex-wrap">
                    {[5, 10, 15, 20].map(amount => {
                      const isSelected = settings.amount === amount
                      return (
                        <button
                          key={amount}
                          type="button"
                          className={`retro-btn ${isSelected ? 'neon-pulse' : ''}`}
                          style={{ 
                            color: 'var(--neon-orange)',
                            backgroundColor: isSelected ? 'var(--neon-orange)' : 'transparent',
                            color: isSelected ? 'var(--space-black)' : 'var(--neon-orange)'
                          }}
                          onClick={() => handleSettingChange('amount', amount)}
                        >
                          {amount}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Question Type */}
                <div className="mb-4">
                  <label className="font-title neon-blue mb-3 d-block">GAME MODE</label>
                  <div className="d-flex gap-3">
                    <button
                      type="button"
                      className={`retro-btn ${settings.type === 'multiple' ? 'neon-pulse' : ''}`}
                      style={{ 
                        color: 'var(--neon-blue)',
                        backgroundColor: settings.type === 'multiple' ? 'var(--neon-blue)' : 'transparent',
                        color: settings.type === 'multiple' ? 'var(--space-black)' : 'var(--neon-blue)'
                      }}
                      onClick={() => handleSettingChange('type', 'multiple')}
                    >
                      MULTIPLE CHOICE
                    </button>
                    <button
                      type="button"
                      className={`retro-btn ${settings.type === 'boolean' ? 'neon-pulse' : ''}`}
                      style={{ 
                        color: 'var(--neon-blue)',
                        backgroundColor: settings.type === 'boolean' ? 'var(--neon-blue)' : 'transparent',
                        color: settings.type === 'boolean' ? 'var(--space-black)' : 'var(--neon-blue)'
                      }}
                      onClick={() => handleSettingChange('type', 'boolean')}
                    >
                      TRUE/FALSE
                    </button>
                  </div>
                </div>

                {/* Start Game Button */}
                <div className="text-center mt-5">
                  <button 
                    className={`retro-btn font-title ${loading ? 'loading-pulse' : 'neon-pulse'}`}
                    style={{ 
                      fontSize: '1.5rem',
                      padding: '15px 40px',
                      color: 'var(--neon-pink)',
                      borderColor: 'var(--neon-pink)'
                    }}
                    onClick={startGame}
                    disabled={loading || !settings.category}
                  >
                    {loading ? (
                      <span className="font-mono">◄ LOADING ►</span>
                    ) : (
                      'START GAME'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  )

  const renderGameScreen = () => (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={12} lg={10}>
          {/* Arcade Game Header */}
          <div className="retro-container mb-4">
            <div className="d-flex justify-content-between align-items-center p-3">
              <div className="score-display">
                <span className="font-retro">SCORE: </span>
                <span className="font-mono">{score.toString().padStart(3, '0')}/{questions.length.toString().padStart(3, '0')}</span>
              </div>
              
              <div className="text-center">
                <div className="font-title neon-pink" style={{ fontSize: '1.2rem' }}>
                  ARCADE MODE
                </div>
                <div className="font-body neon-cyan" style={{ fontSize: '0.9rem' }}>
                  {categories.find(c => c.id == settings.category)?.name} | 
                  {settings.difficulty.toUpperCase()}
                </div>
              </div>
              
              <button 
                className="retro-btn"
                style={{ 
                  color: 'var(--neon-red)',
                  borderColor: 'var(--neon-red)'
                }}
                onClick={resetGame}
              >
                <span className="font-retro">QUIT</span>
              </button>
            </div>
          </div>

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

    const getScoreRank = () => {
      if (percentage >= 90) return { rank: 'LEGENDARY', color: 'var(--neon-pink)' }
      if (percentage >= 80) return { rank: 'EXPERT', color: 'var(--neon-purple)' }
      if (percentage >= 70) return { rank: 'SKILLED', color: 'var(--neon-cyan)' }
      if (percentage >= 60) return { rank: 'NOVICE', color: 'var(--neon-lime)' }
      return { rank: 'BEGINNER', color: 'var(--neon-orange)' }
    }

    const { rank, color } = getScoreRank()

    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={12} lg={10}>
            <div className="crt-monitor">
              <div className="retro-container results-celebration">
                {/* Results Header */}
                <div className="text-center p-4 border-bottom" style={{ borderColor: color }}>
                  <h1 className="font-title neon-cycle mb-3" style={{ fontSize: '2.5rem' }}>
                    GAME OVER
                  </h1>
                  <div className="font-retro neon-pulse" style={{ color, fontSize: '1.2rem' }}>
                    RANK: {rank}
                  </div>
                </div>

                <div className="p-4">
                  {/* Score Display */}
                  <div className="text-center mb-5">
                    <div className="score-display d-inline-block mb-3" style={{ fontSize: '2rem' }}>
                      <span className="font-retro">FINAL SCORE: </span>
                      <span className="font-mono neon-pulse">{score}/{questions.length}</span>
                    </div>
                    <div className="font-title" style={{ color, fontSize: '3rem' }}>
                      {percentage}%
                    </div>
                    <div className="font-body neon-cyan">
                      {categories.find(c => c.id == settings.category)?.name} | 
                      {settings.difficulty.toUpperCase()} MODE
                    </div>
                  </div>

                  {/* Review Section */}
                  <h3 className="font-title neon-cyan mb-4 text-center">ANSWER REVIEW</h3>
                  <div className="review-answers">
                    {userAnswers.map((answer, index) => (
                      <div 
                        key={index} 
                        className={`answer-review-card p-3 mb-3 ${answer.isCorrect ? 'correct' : 'incorrect'}`}
                      >
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <span className="category-pill font-mono">Q{index + 1}</span>
                          <span 
                            className="category-pill font-mono"
                            style={{ 
                              borderColor: answer.isCorrect ? 'var(--neon-green)' : 'var(--neon-red)',
                              color: answer.isCorrect ? 'var(--neon-green)' : 'var(--neon-red)'
                            }}
                          >
                            {answer.isCorrect ? '✓ CORRECT' : '✗ WRONG'}
                          </span>
                        </div>
                        
                        <h6 className="question-text mb-3">{decodeHTML(answer.question.question)}</h6>
                        
                        <div className="font-body">
                          <div className="mb-2">
                            <span className="neon-cyan">YOUR ANSWER:</span> 
                            <span className="ms-2">{decodeHTML(answer.selectedAnswer || 'No answer')}</span>
                          </div>
                          {!answer.isCorrect && (
                            <div className="neon-green">
                              <span>CORRECT ANSWER:</span> 
                              <span className="ms-2 font-mono">{decodeHTML(answer.question.correct_answer)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="d-flex gap-3 justify-content-center mt-5 flex-wrap">
                    <button 
                      className="retro-btn font-title neon-pulse"
                      style={{ 
                        fontSize: '1.2rem',
                        padding: '12px 30px',
                        color: 'var(--neon-pink)',
                        borderColor: 'var(--neon-pink)'
                      }}
                      onClick={resetGame}
                    >
                      PLAY AGAIN
                    </button>
                    <button 
                      className="retro-btn font-title"
                      style={{ 
                        fontSize: '1.2rem',
                        padding: '12px 30px',
                        color: 'var(--neon-cyan)',
                        borderColor: 'var(--neon-cyan)'
                      }}
                      onClick={() => setGameState('setup')}
                    >
                      NEW GAME
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    )
  }

  // Main render
  return (
    <div className="min-vh-100" style={{ background: 'var(--space-black)' }}>
      {gameState === 'setup' && renderSetupScreen()}
      {gameState === 'playing' && renderGameScreen()}
      {gameState === 'results' && renderResultsScreen()}
    </div>
  )
}