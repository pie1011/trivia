// src/app/page.js
'use client'

import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Form, Alert, Spinner } from 'react-bootstrap'

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

  const startGame = () => {
    if (!settings.category) {
      setError('Please select a category')
      return
    }
    setError('')
    setGameState('playing')
    // TODO: Fetch questions and start game
    console.log('Starting game with settings:', settings)
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
        <Col md={8}>
          <Card className="shadow-lg">
            <Card.Header className="bg-success text-white text-center">
              <h3 className="mb-0">Game In Progress</h3>
            </Card.Header>
            <Card.Body className="text-center p-5">
              <h5>Game functionality coming soon!</h5>
              <p className="text-muted">
                Selected: {categories.find(c => c.id == settings.category)?.name || 'Unknown'} | 
                Difficulty: {settings.difficulty.charAt(0).toUpperCase() + settings.difficulty.slice(1)} | 
                Questions: {settings.amount}
              </p>
              <Button 
                variant="secondary" 
                onClick={() => setGameState('setup')}
                className="mt-3"
              >
                Back to Setup
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )

  // Main render
  return (
    <div className="min-vh-100 bg-light">
      {gameState === 'setup' && renderSetupScreen()}
      {gameState === 'playing' && renderGameScreen()}
    </div>
  )
}