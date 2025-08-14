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
  const [showGlitch, setShowGlitch] = useState(false)

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
    
    // Trigger glitch effect on question change
    if (question) {
      setShowGlitch(true)
      setTimeout(() => setShowGlitch(false), 300)
    }
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


  const getAnswerClasses = (answer, index) => {
    const baseClass = 'retro-btn w-100 text-start mb-2'
    const colorClasses = ['answer-btn-a', 'answer-btn-b', 'answer-btn-c', 'answer-btn-d']
    const colorClass = colorClasses[index] || 'answer-btn-a'
    
    let statusClass = ''
    if (showFeedback) {
      if (answer === question.correct_answer) {
        statusClass = 'neon-green'
      } else if (answer === selectedAnswer && !isCorrect) {
        statusClass = 'neon-red'
      }
    } else if (selectedAnswer === answer) {
      statusClass = 'neon-pulse'
    }
    
    return `${baseClass} ${colorClass} ${statusClass}`.trim()
  }

  const getTimerColor = () => {
    if (timeLeft > 20) return 'var(--neon-green)'
    if (timeLeft > 10) return 'var(--neon-orange)'
    return 'var(--neon-red)'
  }

  if (!question) {
    return (
      <div className="question-card">
        <div className="text-center p-5">
          <div className="loading-pulse neon-cyan font-mono" style={{ fontSize: '2rem' }}>
            ◄ ► ◄ ►
          </div>
          <p className="mt-3 neon-cyan">Loading next question...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`question-card ${showGlitch ? 'glitch' : ''}`}>
      {/* Header with Progress and Timer */}
      <div className="d-flex justify-content-between align-items-center p-4 border-bottom" style={{ borderColor: 'var(--neon-cyan)' }}>
        <div>
          <h5 className="mb-0 font-title neon-cyan">
            <span className="font-retro">Q</span> {currentQuestion}/{totalQuestions}
          </h5>
        </div>
        <div className="timer-container">
          <div 
            className="timer-circle"
            style={{ 
              '--progress': `${(timeLeft / timePerQuestion) * 100}%`,
              borderColor: getTimerColor()
            }}
          >
            <div className="timer-inner" style={{ color: getTimerColor() }}>
              {timeLeft}
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        {/* Category and Difficulty Badges */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <span className="category-pill">{question.category}</span>
          <span className="category-pill" style={{ borderColor: 'var(--neon-orange)', color: 'var(--neon-orange)' }}>
            {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
          </span>
        </div>
        
        {/* Question Text */}
        <h4 className="question-text">{decodeHTML(question.question)}</h4>

        {/* Feedback Alert */}
        {showFeedback && (
          <div className={`p-3 mb-4 border rounded ${isCorrect ? 'neon-green' : 'neon-red'}`} 
               style={{ 
                 backgroundColor: 'var(--space-dark)', 
                 borderColor: isCorrect ? 'var(--neon-green)' : 'var(--neon-red)',
                 boxShadow: isCorrect ? 'var(--glow-medium)' : 'var(--glow-medium)'
               }}>
            <div className="font-mono">
              <strong>{isCorrect ? '✓ CORRECT!' : '✗ INCORRECT!'}</strong>
              {!isCorrect && (
                <div className="mt-2 neon-green">
                  Correct answer: <strong>{decodeHTML(question.correct_answer)}</strong>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Answer Buttons */}
        <div className="d-grid gap-3">
          {question.all_answers.map((answer, index) => (
            <button
              key={index}
              className={getAnswerClasses(answer, index)}
              onClick={() => handleAnswer(answer)}
              disabled={showFeedback}
            >
              <span className="font-mono me-3 neon-pulse">
                [{String.fromCharCode(65 + index)}]
              </span>
              <span className="font-body">{decodeHTML(answer)}</span>
            </button>
          ))}
        </div>

        {/* Next Question Countdown */}
        {showFeedback && (
          <div className="text-center mt-4">
            <div className="font-mono neon-cyan loading-pulse">
              ► NEXT QUESTION IN 2 SECONDS ◄
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default QuestionCard