import React, { useState } from 'react';

export default function Dashboard({ character, selectedDomain, onSelectDomain, onAddDomain, onDeleteDomain, t, language, onChangeLanguage }) {
  const [showModal, setShowModal] = useState(false);
  const [newDomain, setNewDomain] = useState('');

  const { name, avatar, className, level, xp, gold, domains, activeTitle } = character;

  // Level Formulas
  const getXpNeeded = (lvl) => 100 * Math.pow(lvl, 2);
  const xpNeeded = getXpNeeded(level);
  const xpPercentage = Math.min(100, Math.floor((xp / xpNeeded) * 100));

  const handleSubmitDomain = (e) => {
    e.preventDefault();
    if (!newDomain.trim()) return;
    onAddDomain(newDomain.trim());
    setNewDomain('');
    setShowModal(false);
  };

  // Safe localized title display from shop list
  const displayTitle = t.cosmetics[activeTitle]?.name || activeTitle;
  const displayClassName = t.classes[className]?.id || className;

  return (
    <div className="dashboard-container animate-card">
      
      {/* 1. Character Status Card */}
      <div className="glass-panel character-card">
        <div className="character-card-inner">
          
          {/* Avatar Bubble */}
          <div className="avatar-side">
            <div className="glass-avatar-container">
              <span className="glass-avatar-emoji">{avatar}</span>
              <div className="bubble-reflection" />
            </div>
            <div className="level-badge-overlay">
              <span>{t.levelLabel} {level}</span>
            </div>
          </div>

          {/* Stats Info */}
          <div className="stats-side">
            <span className="char-title-tag">{displayTitle}</span>
            <h2 className="char-name">{name}</h2>
            <div className="char-class-badge">{displayClassName}</div>

            {/* Gold Display */}
            <div className="gold-container">
              <span className="gold-icon">🪙</span>
              <span className="gold-amount">{gold} <span className="gold-unit">{t.goldUnit}</span></span>
            </div>
          </div>
        </div>

        {/* XP Progress Section */}
        <div className="xp-section">
          <div className="xp-label-row">
            <span className="xp-title">{t.experience}</span>
            <span className="xp-values">{xp} / {xpNeeded} XP</span>
          </div>
          <div className="xp-bar-bg">
            <div 
              className="xp-bar-fill" 
              style={{ width: `${xpPercentage}%` }}
            >
              <div className="xp-bar-glow" />
            </div>
          </div>
          <div className="xp-percentage-indicator">{xpPercentage}% {t.nextLevel}</div>
        </div>
      </div>

      {/* 2. Domains Manager Card */}
      <div className="glass-panel domains-card">
        <div className="domains-header">
          <h3 className="section-title">{t.activeDomains}</h3>
          <button 
            className="add-domain-btn glass-button"
            onClick={() => setShowModal(true)}
            aria-label="Add Domain"
          >
            <span>+</span>
          </button>
        </div>

        <div className="domains-list">
          {domains.map((domain) => {
            const isActive = selectedDomain === domain;
            return (
              <div 
                key={domain} 
                className={`domain-item-wrapper ${isActive ? 'active' : ''}`}
                onClick={() => onSelectDomain(domain)}
              >
                <span className="domain-name-text">{domain}</span>
                
                {/* Delete button (only show delete if there's more than 1 domain) */}
                {domains.length > 1 && (
                  <button 
                    className="delete-domain-btn"
                    onClick={(e) => {
                      e.stopPropagation(); // Avoid selecting domain on click
                      const confirmText = t.deleteDomainConfirm.replace('{domain}', domain);
                      if (confirm(confirmText)) {
                        onDeleteDomain(domain);
                      }
                    }}
                    title={t.archiveDomainTooltip}
                  >
                    ×
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Settings Card */}
      <div className="glass-panel settings-card">
        <h3 className="section-title">{t.settingsTitle}</h3>
        <div className="settings-row">
          <span className="settings-label">{t.selectLanguage}</span>
          <div className="language-selector">
            <button 
              className={`lang-toggle-btn glass-button ${language === 'en' ? 'active-lang' : ''}`}
              onClick={() => onChangeLanguage('en')}
            >
              EN 🇺🇸
            </button>
            <button 
              className={`lang-toggle-btn glass-button ${language === 'fr' ? 'active-lang' : ''}`}
              onClick={() => onChangeLanguage('fr')}
            >
              FR 🇫🇷
            </button>
          </div>
        </div>
      </div>

      {/* Add Domain Glass Modal */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="glass-panel-heavy modal-content animate-card" style={{ animationName: 'modal-entry' }}>
            <h3 className="modal-title">{t.newDomainTitle}</h3>
            <p className="modal-subtitle">{t.newDomainDesc}</p>
            
            <form onSubmit={handleSubmitDomain}>
              <input
                type="text"
                className="glass-input"
                placeholder={t.newDomainPlaceholder}
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                maxLength={24}
                autoFocus
                required
              />
              
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="glass-button" 
                  onClick={() => {
                    setShowModal(false);
                    setNewDomain('');
                  }}
                >
                  {t.cancelBtn}
                </button>
                <button type="submit" className="glass-button accent">
                  {t.createDomainBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .dashboard-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
          width: 100%;
        }

        /* Character Card */
        .character-card {
          padding: 24px;
          position: relative;
          overflow: hidden;
        }

        .character-card-inner {
          display: flex;
          gap: 24px;
          align-items: center;
          margin-bottom: 24px;
        }

        .avatar-side {
          position: relative;
        }

        .level-badge-overlay {
          position: absolute;
          bottom: -4px;
          right: -4px;
          background: linear-gradient(135deg, var(--neon-accent) 0%, #aa00ff 100%);
          border: 1px solid rgba(255, 255, 255, 0.25);
          color: white;
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 0.75rem;
          padding: 4px 8px;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(255, 0, 127, 0.4);
        }

        .stats-side {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .char-title-tag {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: var(--neon-secondary);
          text-shadow: 0 0 10px rgba(0, 240, 255, 0.3);
          margin-bottom: 4px;
        }

        .char-name {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 800;
          margin: 0 0 4px 0;
          color: var(--text-main);
        }

        .char-class-badge {
          font-size: 0.8rem;
          font-weight: 500;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--glass-border);
          border-radius: 8px;
          padding: 3px 8px;
          color: var(--text-sub);
          margin-bottom: 10px;
        }

        .gold-container {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .gold-icon {
          font-size: 1.25rem;
        }

        .gold-amount {
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 800;
          color: #ffb300;
          text-shadow: 0 0 8px rgba(255, 179, 0, 0.3);
        }

        .gold-unit {
          font-size: 0.8rem;
          font-weight: 400;
          color: var(--text-muted);
        }

        /* XP Bar Styles */
        .xp-section {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .xp-label-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .xp-title {
          color: var(--text-muted);
        }

        .xp-values {
          color: var(--text-sub);
        }

        .xp-bar-bg {
          height: 12px;
          width: 100%;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--glass-border);
          border-radius: 6px;
          overflow: hidden;
          position: relative;
        }

        .xp-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--neon-primary) 0%, var(--neon-secondary) 100%);
          border-radius: 5px;
          transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
        }

        .xp-bar-glow {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 100%);
          box-shadow: 0 0 10px var(--neon-secondary);
        }

        .xp-percentage-indicator {
          font-size: 0.7rem;
          text-align: right;
          color: var(--text-muted);
        }

        /* Domains List */
        .domains-card {
          padding: 20px;
        }

        .domains-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .section-title {
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 700;
          margin: 0;
        }

        .add-domain-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          padding: 0;
          font-size: 1.25rem;
          line-height: 1;
        }

        .domains-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .domain-item-wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 18px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--glass-border);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .domain-item-wrapper:hover {
          transform: translateX(4px);
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.15);
        }

        .domain-item-wrapper.active {
          background: radial-gradient(circle at 10% 30%, rgba(0, 240, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 80%);
          border-color: var(--neon-secondary);
          box-shadow: 0 0 12px rgba(0, 240, 255, 0.15), inset 0 1px 1px rgba(255,255,255,0.1);
        }

        .domain-name-text {
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text-sub);
        }

        .domain-item-wrapper.active .domain-name-text {
          color: var(--text-main);
          text-shadow: 0 0 5px rgba(0, 240, 255, 0.2);
        }

        .delete-domain-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 1.3rem;
          line-height: 1;
          cursor: pointer;
          padding: 0 4px;
          transition: color 0.2s;
          opacity: 0;
        }

        .domain-item-wrapper:hover .delete-domain-btn {
          opacity: 1;
        }

        .delete-domain-btn:hover {
          color: var(--hard-color);
        }

        /* Settings Card */
        .settings-card {
          padding: 20px;
        }

        .settings-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 14px;
        }

        .settings-label {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-sub);
        }

        .language-selector {
          display: flex;
          gap: 8px;
        }

        .lang-toggle-btn {
          padding: 6px 12px;
          font-size: 0.8rem;
          border-radius: 10px;
        }

        .lang-toggle-btn.active-lang {
          border-color: var(--neon-secondary);
          background: rgba(0, 240, 255, 0.08);
          box-shadow: 0 0 8px rgba(0, 240, 255, 0.2);
          color: var(--text-main);
        }

        /* Modal Dialog */
        .modal-backdrop {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(3, 1, 11, 0.6);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          z-index: 999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .modal-content {
          position: fixed;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 90%;
          max-width: 440px;
          padding: 30px;
          z-index: 1000;
          text-align: center;
        }

        .modal-title {
          font-family: var(--font-display);
          font-size: 1.4rem;
          font-weight: 700;
          margin: 0 0 8px 0;
        }

        .modal-subtitle {
          font-size: 0.85rem;
          color: var(--text-sub);
          margin: 0 0 20px 0;
          line-height: 1.4;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          margin-top: 20px;
          justify-content: flex-end;
        }

        .modal-actions button {
          flex: 1;
        }

        @media (max-width: 480px) {
          .character-card-inner {
            flex-direction: row;
            text-align: left;
          }
        }
      `}</style>
    </div>
  );
}
