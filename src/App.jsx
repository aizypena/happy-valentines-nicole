import { useState, useEffect } from 'react'
import './App.css'

const EMOJIS = ['🌸', '✨', '⭐', '🦋', '🌈', '🍩', '🎉', '🧁', '🤗', '🫶', '🎊', '🪩']

const ROASTS = [
  "I spent hours coding this instead of just texting you 'happy vday.' You're welcome 🫡",
  "Yes, I coded this. No, I won't fix your laptop 💻",
  "Don't worry, this isn't a love letter. It's a FRIEND letter 📝",
  "Plot twist: this website cost me more effort than our relationship 😂",
  "I asked ChatGPT for advice and it said 'just be yourself.' Terrible advice as always 🤖",
]

const QUIZ = [
  {
    q: "What kind of ex am I? 🤔",
    options: ["The annoying one", "The cool one", "The one who made a whole website"],
    correct: 2,
    response: "Correct! And also maybe a little bit of option A 😅",
  },
  {
    q: "Why did I make this? 🧐",
    options: ["To show off my coding skills", "Because I care about you", "Both honestly"],
    correct: 2,
    response: "You know me too well 😌",
  },
  {
    q: "Will we always be cool? 🤝",
    options: ["Obviously", "Duh", "Was that even a question?"],
    correct: -1, // all correct
    response: "All correct answers. I don't make bad quizzes 😎",
  },
]

function FloatingEmoji({ style, emoji }) {
  return (
    <div className="floating-emoji" style={style}>
      {emoji}
    </div>
  )
}

function App() {
  const [emojis, setEmojis] = useState([])
  const [screen, setScreen] = useState('intro')
  const [roastIndex, setRoastIndex] = useState(0)
  const [quizStep, setQuizStep] = useState(0)
  const [quizResponse, setQuizResponse] = useState(null)
  const [clickCount, setClickCount] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setEmojis((prev) => [
        ...prev.slice(-20),
        {
          id: Date.now() + Math.random(),
          left: Math.random() * 100,
          emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
          size: Math.random() * 16 + 14,
          duration: Math.random() * 5 + 5,
          delay: Math.random() * 2,
          opacity: Math.random() * 0.4 + 0.2,
        },
      ])
    }, 600)
    return () => clearInterval(interval)
  }, [])

  const nextRoast = () => {
    if (roastIndex < ROASTS.length - 1) {
      setRoastIndex((i) => i + 1)
    } else {
      setScreen('quiz')
    }
  }

  const handleQuizAnswer = (idx) => {
    const current = QUIZ[quizStep]
    setQuizResponse(current.response)
    setTimeout(() => {
      setQuizResponse(null)
      if (quizStep < QUIZ.length - 1) {
        setQuizStep((s) => s + 1)
      } else {
        setScreen('transition')
        setTimeout(() => setScreen('card'), 2200)
      }
    }, 2000)
  }

  const handleEmojiButton = () => {
    setClickCount((c) => c + 1)
  }

  return (
    <div className="valentine-container">
      {emojis.map((e) => (
        <FloatingEmoji
          key={e.id}
          emoji={e.emoji}
          style={{
            left: `${e.left}%`,
            fontSize: `${e.size}px`,
            animationDuration: `${e.duration}s`,
            animationDelay: `${e.delay}s`,
            opacity: e.opacity,
          }}
        />
      ))}

      {/* ── SCREEN 1: Intro ── */}
      {screen === 'intro' && (
        <div className="screen fade-in">
          <div className="big-emoji wobble">👋</div>
          <h1 className="title">Hey Nicole!</h1>
          <p className="subtitle">So... it's Valentine's Day</p>
          <p className="subtitle-small">
            And before you panic — no, this isn't what you think 😂
          </p>
          <button className="main-btn" onClick={() => setScreen('roast')}>
            Okay I'm intrigued 👀
          </button>
        </div>
      )}

      {/* ── SCREEN 2: Roasts / Fun Facts ── */}
      {screen === 'roast' && (
        <div className="screen fade-in" key={roastIndex}>
          <div className="big-emoji bounce">
            {['😂', '💀', '🤡', '😭', '🫠'][roastIndex % 5]}
          </div>
          <div className="roast-card pop-in" key={roastIndex}>
            <p className="roast-text">{ROASTS[roastIndex]}</p>
          </div>
          <div className="roast-progress">
            {ROASTS.map((_, i) => (
              <div
                key={i}
                className={`progress-dot ${i <= roastIndex ? 'active' : ''}`}
              />
            ))}
          </div>
          <button className="main-btn" onClick={nextRoast}>
            {roastIndex < ROASTS.length - 1 ? "Next 😂" : "Okay okay, what else? 👀"}
          </button>
        </div>
      )}

      {/* ── SCREEN 3: Quiz ── */}
      {screen === 'quiz' && (
        <div className="screen fade-in">
          <div className="big-emoji bounce">🧠</div>
          <h1 className="title quiz-title">Quick Quiz</h1>
          <p className="subtitle-small">Let's see if you still know me</p>

          <div className="quiz-card pop-in" key={quizStep}>
            <p className="quiz-question">{QUIZ[quizStep].q}</p>
            {!quizResponse && (
              <div className="quiz-options">
                {QUIZ[quizStep].options.map((opt, idx) => (
                  <button
                    key={idx}
                    className="quiz-btn"
                    onClick={() => handleQuizAnswer(idx)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
            {quizResponse && (
              <div className="quiz-response pop-in">
                <p>{quizResponse}</p>
              </div>
            )}
          </div>
          <div className="roast-progress">
            {QUIZ.map((_, i) => (
              <div
                key={i}
                className={`progress-dot ${i <= quizStep ? 'active' : ''}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── SCREEN 4: Transition ── */}
      {screen === 'transition' && (
        <div className="screen fade-in">
          <div className="big-emoji spin">🎊</div>
          <h1 className="title celebration">Okay but for real now...</h1>
        </div>
      )}

      {/* ── SCREEN 5: The Real Card ── */}
      {screen === 'card' && (
        <div className="screen card-content fade-in">
          <div className="big-emoji gentle-float">🌸</div>
          <h1 className="title card-title">Happy Valentine's Day</h1>
          <h2 className="name">Nicole</h2>
          <div className="divider">✦ 🤍 ✦</div>
          <p className="message">
            I know things are different now, and honestly? That's okay.
            Some things don't need a label to matter.
          </p>
          <p className="message">
            You helped me grow into a better person, 
            and I hope you know that didn't expire 
            when we changed our relationship status.
          </p>
          <p className="message highlight">
            So here's your annual reminder: I'm always just a text away.
            For the good days, the bad days, the 2am overthinking,
            or when you just need someone to send you memes. 
            No awkwardness, no strings — just someone who genuinely 
            cares about you. Always. 🤝
          </p>
          <p className="message love-note">
            And just so we're clear — you are loved. 
            Not in a weird way. Not in a "let's make it awkward" way.
            In a "you matter to me and that's never going away" way. 
            Deal with it 😤💛
          </p>
          <div className="emoji-row">
            <span>🧡</span>
            <span>🌻</span>
            <span>⭐</span>
            <span>🌻</span>
            <span>🧡</span>
          </div>
          <p className="signature">Your favorite ex 😌✌️</p>
          <div className="footer-note">
            <p>P.S. — You still owe me that plane ticket you promised ✈️</p>
            <p>P.P.S. — Claim your free pili mazapan from me 🤌🍬</p>
          </div>
          <button
            className="main-btn emoji-btn"
            onClick={handleEmojiButton}
          >
            {clickCount === 0
              ? "Send a hug 🤗"
              : clickCount === 1
              ? "Hug sent! Want another?"
              : clickCount === 2
              ? "Okay that's a lot of hugs"
              : clickCount === 3
              ? "You're getting greedy 😂"
              : clickCount === 4
              ? "Last one I swear"
              : clickCount === 5
              ? "OKAY FINE one more"
              : clickCount < 10
              ? `${clickCount} hugs?! Chill 😭`
              : "You broke the hug counter 💀"}
            {clickCount > 0 && ` (${clickCount})`}
          </button>
        </div>
      )}
    </div>
  )
}

export default App
