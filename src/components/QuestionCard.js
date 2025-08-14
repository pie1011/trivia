// src/components/QuestionCard.js
'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, Button, Alert, ProgressBar } from 'react-bootstrap'

const QuestionCard = ({ 
  question, 
  onAnswer, 
  currentQuestion, 
  totalQuestions,
  timePerQuestion = 30 
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [timeLeft, setTimeLeft] = useState(timePerQuestion)
  const [isCorrect, setIsCorrect] = useState(false)

  // Decode HTML entities
  const decodeHTML = (text) => {
    const textarea = document.createElement('textarea')
    textarea.innerHTML = text
    return textarea.value
  }

  // Reset state when question changes
  useEffect(() => {
    setSelectedAnswer('')
    setShowFeedback(false)
    setTimeLeft(timePerQuestion)
    setIsCorrect(false)
  }, [question, timePerQuestion])

  const handleAnswer = useCallback((answer) => {
    if (showFeedback) return

    const correct = answer === question.correct_answer
    setSelectedAnswer(answer)
    setIsCorrect(correct)
    setShowFeedback(true)

    // Show feedback for 2 seconds before moving to next question
    setTimeout(() => {
      onAnswer(answer, correct)
    }, 2000)
  }, [showFeedback, question?.correct_answer, onAnswer])

  // Timer logic
  useEffect(() => {
    if (timeLeft > 0 && !showFeedback) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !showFeedback) {
      handleAnswer('')
    }
  }, [timeLeft, showFeedback, handleAnswer])


  const getButtonVariant = (answer) => {
    if (!showFeedback) {
      return selectedAnswer === answer ? 'primary' : 'outline-primary'
    }
    
    if (answer === question.correct_answer) {
      return 'success'
    } else if (answer === selectedAnswer && !isCorrect) {
      return 'danger'
    }
    return 'outline-secondary'
  }

  const getTimeVariant = () => {
    if (timeLeft > 15) return 'success'
    if (timeLeft > 5) return 'warning'
    return 'danger'
  }

  if (!question) {
    return (
      <Card className="shadow-lg">
        <Card.Body className="text-center p-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading question...</span>
          </div>
          <p className="mt-3">Loading next question...</p>
        </Card.Body>
      </Card>
    )
  }

  return (
    <Card className="shadow-lg">
      <Card.Header className="bg-primary text-white">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            Question {currentQuestion} of {totalQuestions}
          </h5>
          <div className="text-end">
            <small>Time: {timeLeft}s</small>
            <ProgressBar 
              now={(timeLeft / timePerQuestion) * 100} 
              variant={getTimeVariant()}
              style={{ width: '100px', height: '8px' }}
              className="mt-1"
            />
          </div>
        </div>
      </Card.Header>
      
      <Card.Body className="p-4">
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="badge bg-secondary">{question.category}</span>
            <span className="badge bg-info">
              {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
            </span>
          </div>
          
          <h4 className="question-text">{decodeHTML(question.question)}</h4>
        </div>

        {showFeedback && (
          <Alert variant={isCorrect ? 'success' : 'danger'} className="mb-3">
            <strong>{isCorrect ? '✅ Correct!' : '❌ Incorrect!'}</strong>
            {!isCorrect && (
              <div className="mt-1">
                The correct answer was: <strong>{decodeHTML(question.correct_answer)}</strong>
              </div>
            )}
          </Alert>
        )}

        <div className="d-grid gap-2">
          {question.all_answers.map((answer, index) => (
            <Button
              key={index}
              variant={getButtonVariant(answer)}
              size="lg"
              onClick={() => handleAnswer(answer)}
              disabled={showFeedback}
              className="text-start answer-button"
            >
              <span className="me-2 fw-bold">
                {String.fromCharCode(65 + index)}.
              </span>
              {decodeHTML(answer)}
            </Button>
          ))}
        </div>

        {showFeedback && (
          <div className="text-center mt-3">
            <small className="text-muted">Next question in 2 seconds...</small>
          </div>
        )}
      </Card.Body>
    </Card>
  )
}

export default QuestionCard