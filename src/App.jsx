import { useState, useEffect, useRef } from 'react'
import './App.css'

const EMOJIS = ['🌸', '✨', '⭐', '🦋', '🌈', '🍩', '🎉', '🧁', '🤗', '🫶', '🎊', '🪩']

const LOADING_MSGS = [
  "Booting up emotional vulnerability...",
  "Calculating how dramatic to be...",
  "Loading 47 unread feelings...",
  "Disabling my pride.exe...",
  "Consulting the universe real quick...",
  "Almost ready (just fixing my hair)...",
]

const ROASTS = [
  "I spent hours coding this instead of just texting you 'happy vday.' You're welcome 🫡",
  "Yes, I coded this. No, I won't fix your laptop 💻",
  "Don't worry, this isn't a love letter. It's a ✨FRIEND✨ letter 📝",
  "Plot twist: this website cost me more effort than our relationship 😂",
  "I asked ChatGPT for advice and it said 'just be yourself.' Terrible advice as always 🤖",
  "You're reading this because someone (me) is still dramatic 🎭",
]

const TERMS = [
  "I agree that she is, in fact, the coolest ex ever",
  "I acknowledge that this website is peak effort",
  "I promise not to screenshot this and send it to the group chat (jk do whatever)",
]

const QUIZ = [
  {
    q: "What kind of ex am I? 🤔",
    options: [
      { text: "The annoying one", response: "Rude but... fair 😭" },
      { text: "The cool one", response: "Finally, some respect around here 😌" },
      { text: "The one who made a whole website", response: "Correct! ...and also maybe a little bit of A 😅" },
    ],
  },
  {
    q: "What's my best quality? ✨",
    options: [
      { text: "Your sense of humor", response: "Good taste. Subscribe for more 🎤" },
      { text: "Your loyalty", response: "Okay that actually means a lot 🥹" },
      { text: "Your audacity to make this website", response: "AUDACITY?! It's called ✨dedication✨ 😤" },
    ],
  },
  {
    q: "Rate this website so far (be honest) 📊",
    options: [
      { text: "11/10 masterpiece", response: "Finally someone with taste 👨‍🍳💋" },
      { text: "It's... something", response: "I'll take that as a 10 📝" },
      { text: "You need therapy, not a website", response: "Therapy is expensive. Domains are $12 💀" },
    ],
  },
  {
    q: "Will we always be cool? 🤝",
    options: [
      { text: "Obviously", response: "Confidence. I respect it 😎" },
      { text: "Duh", response: "Short and sweet, just like our— nevermind 😂" },
      { text: "Was that even a question?", response: "All correct. I don't make bad quizzes 💯" },
    ],
  },
]

const PROMISES = [
  { emoji: "📱", text: "I'll always answer your texts/calls (even at 3am)" },
  { emoji: "🤡", text: "I'll keep making you laugh (or at least try)" },
  { emoji: "🤐", text: "Your secrets are still safe with me" },
  { emoji: "🤝", text: "No matter what — I got you. Always." },
]

const STAR_LABELS = ["Terrible", "Meh", "It's okay", "Pretty good", "Masterpiece 🏆"]

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
  const [screen, setScreen] = useState('loading')
  const [loadingMsg, setLoadingMsg] = useState(0)
  const [loadingDone, setLoadingDone] = useState(false)
  const [roastIndex, setRoastIndex] = useState(0)
  const [termsChecked, setTermsChecked] = useState(TERMS.map(() => false))
  const [quizStep, setQuizStep] = useState(0)
  const [quizResponse, setQuizResponse] = useState(null)
  const [clickCount, setClickCount] = useState(0)
  const [typingDone, setTypingDone] = useState(false)
  const [visiblePromises, setVisiblePromises] = useState(0)
  const [rating, setRating] = useState(0)
  const [ratingHover, setRatingHover] = useState(0)
  const [ratingSubmitted, setRatingSubmitted] = useState(false)

  // Floating emojis
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

  // Fake loading screen cycle
  useEffect(() => {
    if (screen !== 'loading') return
    if (loadingMsg < LOADING_MSGS.length - 1) {
      const timer = setTimeout(() => setLoadingMsg((m) => m + 1), 1200)
      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(() => setLoadingDone(true), 1200)
      return () => clearTimeout(timer)
    }
  }, [screen, loadingMsg])

  // Stagger promises
  useEffect(() => {
    if (screen === 'promises' && visiblePromises < PROMISES.length) {
      const timer = setTimeout(() => setVisiblePromises((v) => v + 1), 400)
      return () => clearTimeout(timer)
    }
  }, [screen, visiblePromises])

  const nextRoast = () => {
    if (roastIndex < ROASTS.length - 1) {
      setRoastIndex((i) => i + 1)
    } else {
      setScreen('terms')
    }
  }

  const toggleTerm = (i) => {
    setTermsChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)))
  }

  const allTermsChecked = termsChecked.every(Boolean)

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

  const handleEmojiButton = () => setClickCount((c) => c + 1)

  const handleRating = (stars) => {
    setRating(stars)
    setRatingSubmitted(true)
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

      {/* ── SCREEN 0: Fake Loading ── */}
      {screen === 'loading' && (
        <div className="screen fade-in">
          <div className="big-emoji spin">⏳</div>
          <h1 className="title" style={{ fontSize: 'clamp(1.1rem, 4vw, 1.6rem)' }}>
            {LOADING_MSGS[loadingMsg]}
          </h1>
          <div className="loading-bar">
            <div
              className="loading-fill"
              style={{
                width: `${((loadingMsg + 1) / LOADING_MSGS.length) * 100}%`,
              }}
            />
          </div>
          {loadingDone && (
            <button
              className="main-btn fade-in"
              style={{ marginTop: '24px' }}
              onClick={() => setScreen('intro')}
            >
              I'm ready 😤
            </button>
          )}
        </div>
      )}

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

      {/* ── SCREEN 2.5: Terms & Conditions ── */}
      {screen === 'terms' && (
        <div className="screen fade-in">
          <div className="big-emoji bounce">📜</div>
          <h1 className="title quiz-title">Terms & Conditions</h1>
          <p className="subtitle-small">
            Before we proceed, some legal stuff (not really) 🧑‍⚖️
          </p>
          <div className="terms-card pop-in">
            {TERMS.map((term, i) => (
              <label key={i} className="term-row" onClick={() => toggleTerm(i)}>
                <span className={`term-check ${termsChecked[i] ? 'checked' : ''}`}>
                  {termsChecked[i] ? '✓' : ''}
                </span>
                <span className="term-text">{term}</span>
              </label>
            ))}
          </div>
          {allTermsChecked ? (
            <button
              className="main-btn fade-in"
              style={{ marginTop: '16px' }}
              onClick={() => setScreen('quiz')}
            >
              I agree to everything 🤝
            </button>
          ) : (
            <p className="subtitle-small" style={{ marginTop: '16px', marginBottom: 0 }}>
              Check all boxes to continue 👆
            </p>
          )}
        </div>
      )}

      {/* ── SCREEN 3: Quiz ── */}
      {screen === 'quiz' && (
        <div className="screen fade-in">
          <div className="big-emoji bounce">🧠</div>
          <h1 className="title quiz-title">Quick Quiz</h1>
          <p className="subtitle-small">
            Question {quizStep + 1} of {QUIZ.length} — no cheating 👀
          </p>

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
                    <span className="quiz-letter">
                      {String.fromCharCode(65 + idx)}
                    </span>
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
          <p className="subtitle-small" style={{ marginTop: '8px' }}>
            (the dramatic music would start here if I had the budget) 🎻
          </p>
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
            Look, I'm not gonna lie — I made you scroll through 
            roasts, a fake loading screen, a terms & conditions page, 
            AND a quiz just to get here. That should tell you 
            something about how much I care 😂
          </p>
          <p className="message">
            Things changed between us, and that's okay. 
            But some things? Some things are permanent. 
            Like my bad jokes. And the fact that I'll always 
            show up for you — whether you want me to or not 
            (spoiler: you don't get a choice) 🫡
          </p>
          <p className="message highlight">
            So here's the deal: I'm basically like a subscription 
            you never signed up for but can't cancel. 
            3am meltdowns? I'm there. Bad day? I got you. 
            Need someone to argue with? Sir, I was BORN for that. 
            Need food? Already on the way. 
            You're stuck with me, Nicole. Forever. No refunds 🧾🤝
          </p>
          <p className="message love-note">
            And just so we're clear — you are loved. 
            Not in a "let's make it weird" way. 
            In a "you could literally move to Antarctica 
            and I'd still find a way to send you memes" way. 
            It's not going away. I'm not going away. 
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
              : clickCount < 20
              ? "You broke the hug counter 💀"
              : clickCount < 25
              ? "I'm running out of responses 🫠"
              : "NICOLE STOP 😂😂😂"}
            {clickCount > 0 && ` (${clickCount})`}
          </button>

          {/* Rate this experience */}
          <div className="rating-section fade-in">
            <p className="rating-label">Rate this experience ⭐</p>
            <div className="star-row">
              {[1, 2, 3, 4, 5].map((s) => (
                <span
                  key={s}
                  className={`star ${s <= (ratingHover || rating) ? 'active' : ''}`}
                  onMouseEnter={() => !ratingSubmitted && setRatingHover(s)}
                  onMouseLeave={() => !ratingSubmitted && setRatingHover(0)}
                  onClick={() => !ratingSubmitted && handleRating(s)}
                >
                  {s <= (ratingHover || rating) ? '⭐' : '☆'}
                </span>
              ))}
            </div>
            {ratingSubmitted && (
              <p className="rating-response pop-in">
                {rating === 5
                  ? "Taste. Elegance. Sophistication. 👨‍🍳💋"
                  : rating === 4
                  ? "I'll take it. Aiming for 5 next year 📈"
                  : rating === 3
                  ? "Mid?! I poured my HEART into this 😭"
                  : rating === 2
                  ? "Two stars?! This is a hate crime 💔"
                  : "One star?! Blocked. Unfriended. Deported 🚨"}
              </p>
            )}
          </div>

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
