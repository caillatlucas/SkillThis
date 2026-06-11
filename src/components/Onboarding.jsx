import React, { useState } from 'react';

const AVATAR_OPTIONS = ['🧙‍♂️', '🥷', '🏋️‍♂️', '💻', '🧠', '🎨', '🐉', '⚔️'];

const CLASS_OPTIONS = [
  { id: 'Code Mage', emoji: '🔮', color: '#00f0ff' },
  { id: 'Language Rogue', emoji: '🗡️', color: '#ff007f' },
  { id: 'Fitness Warrior', emoji: '🛡️', color: '#00e676' },
  { id: 'Creative Bard', emoji: '🎨', color: '#ffb300' }
];

export default function Onboarding({ onComplete, t }) {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('🧙‍♂️');
  const [selectedClass, setSelectedClass] = useState(CLASS_OPTIONS[0]);

  const handleNext = () => {
    if (step === 1 && !username.trim()) return;
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setStep((s) => s - 1);
  };

  const handleFinish = () => {
    if (!username.trim() || !avatar || !selectedClass) return;
    
    // Initial active domains based on class
    let initialDomains = [];
    if (selectedClass.id === 'Code Mage') {
      initialDomains = ['React Development', 'Data Structures'];
    } else if (selectedClass.id === 'Language Rogue') {
      initialDomains = ['Japanese Language', 'Spanish Drills'];
    } else if (selectedClass.id === 'Fitness Warrior') {
      initialDomains = ['Fitness & Strength', 'Daily Hydration'];
    } else {
      initialDomains = ['Creative Writing', 'Color Theory'];
    }

    // Default starting title in local translations is matched in GoldShop items
    onComplete({
      name: username.trim(),
      avatar: avatar,
      className: selectedClass.id,
      level: 1,
      xp: 0,
      gold: 0,
      domains: initialDomains,
      activeTitle: 'Novice Adventurer',
      activeTheme: 'default',
      unlockedTitles: ['Novice Adventurer'],
      unlockedAvatars: [avatar],
      unlockedThemes: ['default']
    });
  };

  return (
    <div className="onboarding-wrapper">
      <div className="glass-panel-heavy onboarding-card">
        
        {/* Header */}
        <div className="onboarding-header">
          <div className="logo-spark">🔮</div>
          <h1 className="neon-text-primary">SkillThis</h1>
          <p className="onboarding-subtitle">{t.tagline}</p>
        </div>


        {/* Progress Dots */}
        <div className="step-indicator">
          <span className={`dot ${step >= 1 ? 'active' : ''}`} />
          <span className={`dot ${step >= 2 ? 'active' : ''}`} />
          <span className={`dot ${step >= 3 ? 'active' : ''}`} />
        </div>

        {/* STEP 1: Choose Username */}
        {step === 1 && (
          <div className="step-content animate-card">
            <h2 className="step-title">{t.step1Title}</h2>
            <p className="step-desc">{t.step1Desc}</p>
            
            <div className="input-group">
              <input
                type="text"
                className="glass-input"
                placeholder={t.usernamePlaceholder}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                maxLength={18}
                autoFocus
              />
            </div>

            <button
              className="glass-button accent onboarding-btn"
              disabled={!username.trim()}
              onClick={handleNext}
            >
              {t.continueBtn}
            </button>
          </div>
        )}

        {/* STEP 2: Select Avatar */}
        {step === 2 && (
          <div className="step-content animate-card">
            <h2 className="step-title">{t.step2Title}</h2>
            <p className="step-desc">{t.step2Desc}</p>

            <div className="avatar-grid">
              {AVATAR_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  className={`avatar-bubble-select ${avatar === emoji ? 'selected' : ''}`}
                  onClick={() => setAvatar(emoji)}
                >
                  <span className="emoji">{emoji}</span>
                  <div className="bubble-reflection" />
                </button>
              ))}
            </div>

            <div className="button-row">
              <button className="glass-button" onClick={handleBack}>
                {t.backBtn}
              </button>
              <button className="glass-button accent" onClick={handleNext}>
                {t.nextBtn}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Select Class */}
        {step === 3 && (
          <div className="step-content animate-card">
            <h2 className="step-title">{t.step3Title}</h2>
            <p className="step-desc">{t.step3Desc}</p>

            <div className="class-list">
              {CLASS_OPTIONS.map((c) => {
                const classTrans = t.classes[c.id] || { id: c.id, description: '' };
                return (
                  <div
                    key={c.id}
                    className={`class-card-option glass-panel ${selectedClass.id === c.id ? 'selected' : ''}`}
                    onClick={() => setSelectedClass(c)}
                    style={{ '--class-color': c.color }}
                  >
                    <div className="class-card-header">
                      <span className="class-emoji">{c.emoji}</span>
                      <span className="class-name">{classTrans.id}</span>
                    </div>
                    <p className="class-desc">{classTrans.description}</p>
                  </div>
                );
              })}
            </div>

            <div className="button-row">
              <button className="glass-button" onClick={handleBack}>
                {t.backBtn}
              </button>
              <button className="glass-button accent" onClick={handleFinish}>
                {t.beginBtn}
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .onboarding-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          width: 100%;
          padding: 20px;
        }

        .onboarding-card {
          width: 100%;
          max-width: 500px;
          padding: 40px 32px;
          text-align: center;
          position: relative;
        }

        .onboarding-header {
          margin-bottom: 24px;
        }

        .logo-spark {
          font-size: 2.8rem;
          margin-bottom: 8px;
          animation: float 4s ease-in-out infinite;
        }

        .onboarding-card h1 {
          font-size: 2.5rem;
          font-weight: 800;
          margin: 0;
          letter-spacing: 1px;
        }

        .onboarding-subtitle {
          color: var(--text-sub);
          font-size: 0.95rem;
          margin-top: 6px;
        }

        .step-indicator {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-bottom: 32px;
        }

        .step-indicator .dot {
          width: 24px;
          height: 6px;
          border-radius: 3px;
          background: rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .step-indicator .dot.active {
          background: var(--neon-secondary);
          box-shadow: 0 0 8px var(--neon-secondary);
          width: 32px;
        }

        .step-title {
          font-family: var(--font-display);
          font-size: 1.6rem;
          font-weight: 700;
          margin: 0 0 8px 0;
        }

        .step-desc {
          color: var(--text-sub);
          font-size: 0.9rem;
          line-height: 1.4;
          margin: 0 0 24px 0;
        }

        .input-group {
          margin-bottom: 28px;
        }

        .onboarding-btn {
          width: 100%;
        }

        .avatar-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 28px;
        }

        .avatar-bubble-select {
          aspect-ratio: 1;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.02) 80%);
          border: 1px solid var(--glass-border);
          position: relative;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--glass-shadow);
        }

        .avatar-bubble-select .emoji {
          font-size: 2.2rem;
          transition: transform 0.3s ease;
        }

        .avatar-bubble-select .bubble-reflection {
          content: '';
          position: absolute;
          top: 4px; left: 8px;
          width: 12px; height: 6px;
          background: rgba(255, 255, 255, 0.25);
          border-radius: 50% / 100% 100% 0 0;
          transform: rotate(-15deg);
        }

        .avatar-bubble-select:hover {
          transform: scale(1.1);
          border-color: var(--neon-secondary);
          box-shadow: 0 0 12px rgba(0, 240, 255, 0.3);
        }

        .avatar-bubble-select.selected {
          transform: scale(1.1);
          border-color: var(--neon-secondary);
          background: radial-gradient(circle at 30% 30%, rgba(0, 240, 255, 0.15) 0%, rgba(255, 255, 255, 0.03) 80%);
          box-shadow: 0 0 20px rgba(0, 240, 255, 0.5), inset 0 2px 4px rgba(255,255,255,0.3);
        }

        .avatar-bubble-select.selected .emoji {
          transform: scale(1.15);
        }

        .button-row {
          display: flex;
          gap: 16px;
          justify-content: space-between;
        }

        .button-row button {
          flex: 1;
        }

        .class-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 28px;
          max-height: 300px;
          overflow-y: auto;
          padding-right: 4px;
        }

        .class-card-option {
          padding: 16px;
          text-align: left;
          cursor: pointer;
          border-radius: 16px;
          transition: all 0.3s ease;
          border-color: var(--glass-border);
        }

        .class-card-option:hover {
          transform: translateY(-2px);
          border-color: var(--class-color);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .class-card-option.selected {
          border-color: var(--class-color);
          background: rgba(255, 255, 255, 0.05);
          box-shadow: 0 0 15px var(--class-color), inset 0 0 10px rgba(255,255,255,0.05);
        }

        .class-card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 6px;
        }

        .class-emoji {
          font-size: 1.4rem;
        }

        .class-name {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 1.1rem;
          color: var(--text-main);
        }

        .class-desc {
          font-size: 0.8rem;
          color: var(--text-sub);
          line-height: 1.35;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
