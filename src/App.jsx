import { useState, useEffect, useRef } from 'react'
import './App.css'

const EMOJIS = ['🌸', '✨', '⭐', '🦋', '🌈', '🍩', '🎉', '🧁', '🤗', '🫶', '🎊', '🪩']

const ROASTS = [
  "I spent hours coding this instead of just texting you 'happy vday.' You're welcome 🫡",
  "Yes, I coded this. No, I won't fix your laptop 💻",
  "Don't worry, this isn't a love letter. It's a FRIEND letter 📝",
  "Plot twist: this website cost me more effort than our relationship 😂",
  "I asked ChatGPT for advice and it said 'just be yourself.' Terrible advice as always 🤖",
  "You're reading this because someone (me) is still dramatic 🎭",
]

const QUIZ = [
  {
    q: "What kind of ex am I? 🤔",
    options: [
      { text: "The annoying one", response: "Rude but... fair 😭" },
      { text: "The cool one", response: "Finally, some respect 😌" },
      { text: "The one who made a whole website", response: "Correct! And also maybe a little bit of option A 😅" },
    ],
  },
  {
    q: "Why did I make this? 🧐",
    options: [
      { text: "To show off my coding skills", response: "I mean... that's a bonus 💅" },
      { text: "Because I care about you", response: "Aww you actually picked the sweet one 🥹" },
      { text: "Both honestly", response: "You know me too well 😌" },
    ],
  },
  {
    q: "Will we always be cool? 🤝",
    options: [
      { text: "Obviously", response: "Confidence. I like it 😎" },
      { text: "Duh", response: "Short and sweet, just like our— nevermind 😂" },
      { text: "Was that even a question?", response: "All correct answers. I don't make bad quizzes 😎" },
    ],
  },
]

const PROMISES = [
  { emoji: "📱", text: "I'll always answer your texts/calls (even at 3am)" },
  { emoji: "🤡", text: "I'll keep making you laugh (or at least try)" },
  { emoji: "🤐", text: "Your secrets are still safe with me" },
  { emoji: "🤝", text: "No matter what — I got you. Always." },
]

function FloatingEmoji({ style, emoji }) {
  return (
    <div className="floating-emoji" style={style}>
      {emoji}
    </div>
  )
}

function Typewriter({ text, speed = 40, onDone }) {
  const [displayed, setDisplayed] = useState('')
  const idx = useRef(0)

  useEffect(() => {
    setDisplayed('')
    idx.current = 0
    const interval = setInterval(() => {
      if (idx.current < text.length) {
        const char = text[idx.current]
        idx.current++
        setDisplayed((prev) => prev + char)
      } else {
        clearInterval(interval)
        onDone && onDone()
      }
    }, speed)
    return () => clearInterval(interval)
  }, [text, speed])

  return (
    <span>
      {displayed}
      <span className="cursor">|</span>
    </span>
  )
}

function ConfettiBurst() {
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    color: ['#e8a0b0', '#d4899e', '#e0c898', '#c87a92', '#ecc8d4', '#dcc090'][
      Math.floor(Math.random() * 6)
    ],
    delay: Math.random() * 0.5,
    rotation: Math.random() * 360,
    size: Math.random() * 6 + 4,
  }))

  return (
    <div className="confetti-container">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            transform: `rotate(${p.rotation}deg)`,
            width: `${p.size}px`,
            height: `${p.size * 2.5}px`,
          }}
        />
      ))}
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
  const [typingDone, setTypingDone] = useState(false)
  const [visiblePromises, setVisiblePromises] = useState(0)

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

  // Stagger promises appearing
  useEffect(() => {
    if (screen === 'promises' && visiblePromises < PROMISES.length) {
      const timer = setTimeout(() => {
        setVisiblePromises((v) => v + 1)
      }, 400)
      return () => clearTimeout(timer)
    }
  }, [screen, visiblePromises])

  const nextRoast = () => {
    if (roastIndex < ROASTS.length - 1) {
      setRoastIndex((i) => i + 1)
    } else {
      setScreen('quiz')
    }
  }

  const handleQuizAnswer = (optionIndex) => {
    const current = QUIZ[quizStep]
    setQuizResponse(current.options[optionIndex].response)
    setTimeout(() => {
      setQuizResponse(null)
      if (quizStep < QUIZ.length - 1) {
        setQuizStep((s) => s + 1)
      } else {
        setScreen('transition')
        setTimeout(() => {
          setScreen('promises')
          setVisiblePromises(0)
        }, 2200)
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

      {/* ── SCREEN 1: Intro with Typewriter ── */}
      {screen === 'intro' && (
        <div className="screen fade-in">
          <div className="big-emoji wobble">👋</div>
          <h1 className="title">
            <Typewriter
              text="Hey Nicole!"
              speed={120}
              onDone={() => setTypingDone(true)}
            />
          </h1>
          {typingDone && (
            <div className="fade-in">
              <p className="subtitle">So... it's Valentine's Day</p>
              <p className="subtitle-small">
                And before you panic — no, this isn't what you think 😂
              </p>
              <button className="main-btn" onClick={() => setScreen('roast')}>
                Okay I'm intrigued 👀
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── SCREEN 2: Roasts ── */}
      {screen === 'roast' && (
        <div className="screen fade-in" key={roastIndex}>
          <div className="big-emoji bounce">
            {['😂', '💀', '🤡', '😭', '🫠', '🎭'][roastIndex % 6]}
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
                    {opt.text}
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

      {/* ── SCREEN 4: Transition with Confetti ── */}
      {screen === 'transition' && (
        <div className="screen fade-in">
          <ConfettiBurst />
          <div className="big-emoji spin">🎊</div>
          <h1 className="title celebration">Okay but for real now...</h1>
        </div>
      )}

      {/* ── SCREEN 5: Promises ── */}
      {screen === 'promises' && (
        <div className="screen fade-in">
          <div className="big-emoji gentle-float">🤞</div>
          <h1 className="title">Things That Haven't Changed</h1>
          <p className="subtitle-small">
            (even though we have, and that's fine)
          </p>
          <div className="promises-list">
            {PROMISES.map((p, i) => (
              <div
                key={i}
                className={`promise-item ${i < visiblePromises ? 'visible' : ''}`}
                style={{ transitionDelay: `${i * 0.05}s` }}
              >
                <span className="promise-emoji">{p.emoji}</span>
                <span className="promise-text">{p.text}</span>
              </div>
            ))}
          </div>
          {visiblePromises >= PROMISES.length && (
            <button
              className="main-btn fade-in"
              style={{ marginTop: '20px' }}
              onClick={() => setScreen('card')}
            >
              One last thing... 💌
            </button>
          )}
        </div>
      )}

      {/* ── SCREEN 6: The Real Card ── */}
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
            <p>P.S. — You still owe me that plane ticket ✈️</p>
            <p>P.P.S. — Claim your free pili mazapan from me 🤌</p>
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
              : clickCount < 15
              ? "At this point just call me 📞"
              : "You broke the hug counter 💀"}
            {clickCount > 0 && ` (${clickCount})`}
          </button>

          {/* Scrolling ticker */}
          <div className="ticker-wrapper">
            <div className="ticker">
              <span>always here for you 🤝 &nbsp;&nbsp;&nbsp; still got your back 🛡️ &nbsp;&nbsp;&nbsp; one text/call away 📱 &nbsp;&nbsp;&nbsp; your personal cheerleader 📣 &nbsp;&nbsp;&nbsp; free therapy sessions 🛋️ &nbsp;&nbsp;&nbsp; meme supplier 24/7 🤳 &nbsp;&nbsp;&nbsp; pili mazapan dealer 🍬 &nbsp;&nbsp;&nbsp;</span>
              <span>always here for you 🤝 &nbsp;&nbsp;&nbsp; still got your back 🛡️ &nbsp;&nbsp;&nbsp; one text/call away 📱 &nbsp;&nbsp;&nbsp; your personal cheerleader 📣 &nbsp;&nbsp;&nbsp; free therapy sessions 🛋️ &nbsp;&nbsp;&nbsp; meme supplier 24/7 🤳 &nbsp;&nbsp;&nbsp; pili mazapan dealer 🍬 &nbsp;&nbsp;&nbsp;</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
