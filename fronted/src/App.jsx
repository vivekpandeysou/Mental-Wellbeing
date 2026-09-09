import { useState } from 'react'

const API_URL = 'http://127.0.0.1:8000/predict'

const PLATFORMS = [
  'Facebook', 'LinkedIn', 'Instagram', 'Snapchat', 'Twitter',
  'YouTube', 'TikTok', 'LINE', 'KakaoTalk', 'VKontakte', 'WhatsApp', 'WeChat',
]

const initialForm = {
  age: 20,
  gender: 'Female',
  country: 'India',
  academic_level: 'Undergraduate',
  most_used_platform: 'Instagram',
  purpose_of_use: 'Entertainment',
  avg_daily_usage_hours: 4,
  daily_unlocks: 50,
  study_hours: 3,
  physical_activity_hours: 1,
  sleep_hours_per_night: 7,
  stress_level: 'Medium',
}

function scoreBand(score) {
  // Descriptive banding only — not a diagnosis, just a plain-language read of the number.
  if (score >= 7.5) return { label: 'Thriving range', tone: 'good' }
  if (score >= 5) return { label: 'Steady range', tone: 'ok' }
  if (score >= 3) return { label: 'Strained range', tone: 'watch' }
  return { label: 'Struggling range', tone: 'low' }
}

export default function App() {
  const [form, setForm] = useState(initialForm)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const payload = {
        ...form,
        age: Number(form.age),
        avg_daily_usage_hours: Number(form.avg_daily_usage_hours),
        daily_unlocks: Number(form.daily_unlocks),
        study_hours: Number(form.study_hours),
        physical_activity_hours: Number(form.physical_activity_hours),
        sleep_hours_per_night: Number(form.sleep_hours_per_night),
      }
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const detail = await res.json().catch(() => null)
        throw new Error(detail?.detail?.[0]?.msg || `Request failed (${res.status})`)
      }
      const data = await res.json()
      setResult(data)
    } catch (err) {
      setError(err.message || 'Something went wrong. Is the backend running on port 8000?')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setResult(null)
    setError(null)
  }

  return (
    <div className="page">
      <header className="hero">
        <p className="hero-eyebrow">Digital habits &amp; wellbeing</p>
        <h1>Mind &amp; Screen</h1>
        <p className="hero-sub">
          A quick estimate of how your screen habits, sleep, and stress line up —
          built on a model trained on student survey data.
        </p>
      </header>

      <main className="layout">
        <form className="card form-card" onSubmit={handleSubmit}>
          <section className="field-group">
            <h2>About you</h2>
            <div className="field-row">
              <label>
                Age
                <input
                  type="number" min="10" max="100" required
                  value={form.age}
                  onChange={(e) => update('age', e.target.value)}
                />
              </label>
              <label>
                Gender
                <select value={form.gender} onChange={(e) => update('gender', e.target.value)}>
                  <option>Female</option>
                  <option>Male</option>
                </select>
              </label>
            </div>
            <div className="field-row">
              <label>
                Country
                <input
                  type="text" required placeholder="e.g. India"
                  value={form.country}
                  onChange={(e) => update('country', e.target.value)}
                />
              </label>
              <label>
                Academic level
                <select
                  value={form.academic_level}
                  onChange={(e) => update('academic_level', e.target.value)}
                >
                  <option>High School</option>
                  <option>Undergraduate</option>
                  <option>Graduate</option>
                </select>
              </label>
            </div>
          </section>

          <section className="field-group">
            <h2>Digital habits</h2>
            <div className="field-row">
              <label>
                Most used platform
                <select
                  value={form.most_used_platform}
                  onChange={(e) => update('most_used_platform', e.target.value)}
                >
                  {PLATFORMS.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </label>
              <label>
                Main purpose of use
                <select
                  value={form.purpose_of_use}
                  onChange={(e) => update('purpose_of_use', e.target.value)}
                >
                  <option>Networking</option>
                  <option>Education</option>
                  <option>Entertainment</option>
                  <option>News</option>
                </select>
              </label>
            </div>
            <div className="field-row">
              <label>
                Avg. daily usage (hours)
                <input
                  type="number" min="0" max="24" step="0.5" required
                  value={form.avg_daily_usage_hours}
                  onChange={(e) => update('avg_daily_usage_hours', e.target.value)}
                />
              </label>
              <label>
                Daily phone unlocks
                <input
                  type="number" min="0" required
                  value={form.daily_unlocks}
                  onChange={(e) => update('daily_unlocks', e.target.value)}
                />
              </label>
            </div>
          </section>

          <section className="field-group">
            <h2>Lifestyle</h2>
            <div className="field-row three">
              <label>
                Study hours / day
                <input
                  type="number" min="0" max="24" step="0.5" required
                  value={form.study_hours}
                  onChange={(e) => update('study_hours', e.target.value)}
                />
              </label>
              <label>
                Physical activity (hrs)
                <input
                  type="number" min="0" max="24" step="0.5" required
                  value={form.physical_activity_hours}
                  onChange={(e) => update('physical_activity_hours', e.target.value)}
                />
              </label>
              <label>
                Sleep / night (hrs)
                <input
                  type="number" min="0" max="24" step="0.5" required
                  value={form.sleep_hours_per_night}
                  onChange={(e) => update('sleep_hours_per_night', e.target.value)}
                />
              </label>
            </div>
            <label className="stress-field">
              Current stress level
              <div className="stress-toggle">
                {['Low', 'Medium', 'High', 'Very High'].map((level) => (
                  <button
                    type="button"
                    key={level}
                    className={form.stress_level === level ? 'active' : ''}
                    onClick={() => update('stress_level', level)}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </label>
          </section>

          <button className="submit" type="submit" disabled={loading}>
            {loading ? 'Calculating…' : 'Get my estimate'}
          </button>
          {error && <p className="error">{error}</p>}
        </form>

        <div className="card result-card">
          {!result && !loading && (
            <div className="result-empty">
              <h2>Your result appears here</h2>
              <p>Fill in the form and submit to see your predicted score.</p>
            </div>
          )}
          {loading && (
            <div className="result-empty">
              <h2>Calculating…</h2>
              <p>Sending your details to the model.</p>
            </div>
          )}
          {result && (
            <ResultView result={result} onReset={reset} />
          )}
        </div>
      </main>

      <footer className="disclaimer">
        This tool gives a statistical estimate from a machine-learning model — it is not a
        diagnosis and isn't a substitute for talking to a mental health professional.
      </footer>
    </div>
  )
}

function ResultView({ result, onReset }) {
  const score = result.predicted_mental_health_score
  const band = scoreBand(score)
  const pct = Math.max(0, Math.min(100, (score / 10) * 100))

  return (
    <div className={`result-view tone-${band.tone}`}>
      <p className="result-eyebrow">Predicted mental health score</p>
      <div className="score-display">
        <span className="score-number">{score}</span>
        <span className="score-max">/ 10</span>
      </div>
      <div className="meter">
        <div className="meter-fill" style={{ width: `${pct}%` }} />
      </div>
      <p className="band-label">{band.label}</p>
      <button className="secondary" onClick={onReset}>Try another scenario</button>
    </div>
  )
}
