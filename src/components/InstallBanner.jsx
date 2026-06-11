import React from 'react';

export default function InstallBanner({ installPromptEvent, onInstalled, t }) {
  if (!installPromptEvent) return null;

  const handleInstallClick = async () => {
    if (!installPromptEvent) return;

    // Show the browser install prompt
    installPromptEvent.prompt();

    // Wait for the user's response
    const { outcome } = await installPromptEvent.userChoice;
    console.log(`[PWA] Install choice outcome: ${outcome}`);

    // Clear the prompt event as it can only be used once
    onInstalled();
  };

  return (
    <div className="glass-panel-heavy install-banner animate-card">
      <div className="install-banner-inner">
        <span className="install-logo">🔮</span>
        <div className="install-text-col">
          <h4 className="install-title">{t.pwaTitle}</h4>
          <p className="install-desc">{t.pwaDesc}</p>
        </div>
        <button 
          className="glass-button accent install-cta-btn"
          onClick={handleInstallClick}
        >
          {t.pwaBtn}
        </button>
      </div>

      <style>{`
        .install-banner {
          position: fixed;
          bottom: 96px; /* Positioned above the mobile bottom nav */
          left: 50%;
          transform: translateX(-50%);
          z-index: 9999;
          width: 90%;
          max-width: 420px;
          padding: 12px 18px;
          border-color: var(--neon-secondary);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 15px rgba(0, 240, 255, 0.2);
          animation: card-entry 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .install-banner-inner {
          display: flex;
          align-items: center;
          gap: 12px;
          justify-content: space-between;
        }

        .install-logo {
          font-size: 1.6rem;
          animation: float 4s ease-in-out infinite;
        }

        .install-text-col {
          display: flex;
          flex-direction: column;
          flex: 1;
          text-align: left;
        }

        .install-title {
          font-family: var(--font-display);
          font-size: 0.92rem;
          font-weight: 700;
          margin: 0;
          color: var(--text-main);
        }

        .install-desc {
          font-size: 0.72rem;
          color: var(--text-sub);
          margin: 2px 0 0 0;
          line-height: 1.2;
        }

        .install-cta-btn {
          padding: 6px 14px;
          font-size: 0.78rem;
          border-radius: 10px;
          white-space: nowrap;
        }

        @media (min-width: 1024px) {
          .install-banner {
            bottom: 24px;
            right: 24px;
            left: auto;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}
