import React, { useState, useEffect } from 'react';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import QuestLog from './components/QuestLog';
import GoldShop from './components/GoldShop';
import Inventory from './components/Inventory';
import Confetti from './components/Confetti';
import InstallBanner from './components/InstallBanner';
import { fetchQuestsFromAI, fetchSingleAlternativeQuest } from './services/aiService';
import { translations } from './services/translations';

export default function App() {
  // --- 1. State Declarations ---
  const [character, setCharacter] = useState(null);
  const [quests, setQuests] = useState({}); // format: { [domainName]: Array<Quests> }
  const [selectedDomain, setSelectedDomain] = useState('');
  const [activeTab, setActiveTab] = useState('status'); // 'status' | 'quests' | 'shop' | 'inventory'
  
  // Language State
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('skillthis-lang') || 'en';
  });

  // UX UI overlays
  const [loadingQuests, setLoadingQuests] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);
  const [levelUpModal, setLevelUpModal] = useState(null); // { oldLevel, newLevel, titleUnlocked }

  // PWA Install States
  const [installPromptEvent, setInstallPromptEvent] = useState(null);

  // Translate lookup dictionary
  const t = translations[language] || translations.en;

  // --- 2. Load Initial State from LocalStorage ---
  useEffect(() => {
    const savedChar = localStorage.getItem('skillthis-character');
    const savedQuests = localStorage.getItem('skillthis-quests');

    if (savedChar) {
      const parsedChar = JSON.parse(savedChar);
      setCharacter(parsedChar);
      
      // Inject theme class immediately
      document.documentElement.setAttribute('data-theme', parsedChar.activeTheme || 'default');

      if (parsedChar.domains && parsedChar.domains.length > 0) {
        setSelectedDomain(parsedChar.domains[0]);
      }
    }

    if (savedQuests) {
      setQuests(JSON.parse(savedQuests));
    }

    // --- PWA Installation Listener ---
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault(); // Prevent standard mini-infobar from appearing on mobile
      console.log('[PWA] beforeinstallprompt event captured');
      setInstallPromptEvent(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // --- 3. Save State to LocalStorage on Updates ---
  useEffect(() => {
    if (character) {
      localStorage.setItem('skillthis-character', JSON.stringify(character));
      // Sync active theme attribute
      document.documentElement.setAttribute('data-theme', character.activeTheme || 'default');
    }
  }, [character]);

  useEffect(() => {
    if (Object.keys(quests).length > 0) {
      localStorage.setItem('skillthis-quests', JSON.stringify(quests));
    }
  }, [quests]);

  // Sync Language preference & clear quests cache to regenerate in new language
  useEffect(() => {
    localStorage.setItem('skillthis-lang', language);
    if (character) {
      // Clear quest state to force regeneration in the new language
      setQuests({});
    }
  }, [language]);

  // --- 4. Fetch initial quests for a domain if missing ---
  useEffect(() => {
    if (!selectedDomain || !character) return;

    const loadQuests = async () => {
      // If quests already exist in state, don't fetch new ones
      if (quests[selectedDomain] && quests[selectedDomain].length > 0) return;

      setLoadingQuests(true);
      try {
        const newQuests = await fetchQuestsFromAI(selectedDomain, 5, language);
        setQuests((prev) => ({
          ...prev,
          [selectedDomain]: newQuests
        }));
      } catch (err) {
        console.error('Failed to load quests', err);
      } finally {
        setLoadingQuests(false);
      }
    };

    loadQuests();
  }, [selectedDomain, character, language]);


  // --- 5. RPG Actions & Level Up Calculations ---
  
  const handleOnboardingComplete = async (initialChar) => {
    // Generate initial quests for all starting domains immediately
    setLoadingQuests(true);
    const initialQuests = {};
    for (const d of initialChar.domains) {
      initialQuests[d] = await fetchQuestsFromAI(d, 5, language);
    }
    setQuests(initialQuests);
    setCharacter(initialChar);
    setSelectedDomain(initialChar.domains[0]);
    setLoadingQuests(false);
  };

  const handleCompleteQuest = (questId) => {
    if (!character || !selectedDomain) return;

    // Find the quest
    const activeDomainQuests = quests[selectedDomain] || [];
    const quest = activeDomainQuests.find((q) => q.id === questId);
    if (!quest) return;

    // Trigger confetti splash!
    setConfettiActive(true);

    // Calculate level calculations
    let newXp = character.xp + quest.xp;
    let newGold = character.gold + quest.gold;
    let newLevel = character.level;
    let leveledUp = false;
    let titleUnlocked = null;

    const getXpNeeded = (lvl) => 100 * Math.pow(lvl, 2);
    let xpNeeded = getXpNeeded(newLevel);

    // Level up loop in case they gain enough XP to level up multiple times
    while (newXp >= xpNeeded) {
      newXp -= xpNeeded;
      newLevel += 1;
      leveledUp = true;
      xpNeeded = getXpNeeded(newLevel);

      // Check level-up milestone rewards
      if (newLevel === 3) titleUnlocked = 'Valiant Champion';
      if (newLevel === 5) titleUnlocked = 'Master of Fates';
      if (newLevel === 10) titleUnlocked = 'Transcendent Deity';
    }

    const updatedUnlockedTitles = [...character.unlockedTitles];
    if (titleUnlocked && !updatedUnlockedTitles.includes(titleUnlocked)) {
      updatedUnlockedTitles.push(titleUnlocked);
    }

    // Update character state
    setCharacter((prev) => ({
      ...prev,
      xp: newXp,
      gold: newGold,
      level: newLevel,
      unlockedTitles: updatedUnlockedTitles
    }));

    // Archive (remove) the completed quest from the active quest list
    setQuests((prev) => ({
      ...prev,
      [selectedDomain]: prev[selectedDomain].filter((q) => q.id !== questId)
    }));

    // Trigger Level Up announce overlay if necessary
    if (leveledUp) {
      setLevelUpModal({
        oldLevel: character.level,
        newLevel: newLevel,
        titleUnlocked: titleUnlocked
      });
    }
  };

  const handleRefreshQuest = async (domainName, questId) => {
    const activeQuests = quests[domainName] || [];
    const existingTitles = activeQuests.map((q) => q.title);

    try {
      const altQuest = await fetchSingleAlternativeQuest(domainName, existingTitles, language);
      
      setQuests((prev) => ({
        ...prev,
        [domainName]: prev[domainName].map((q) => q.id === questId ? altQuest : q)
      }));
    } catch (err) {
      console.error('Failed to refresh quest', err);
    }
  };

  const handleAddDomain = (domainName) => {
    if (character.domains.includes(domainName)) return;

    setCharacter((prev) => ({
      ...prev,
      domains: [...prev.domains, domainName]
    }));
    setSelectedDomain(domainName);
  };

  const handleDeleteDomain = (domainName) => {
    const updatedDomains = character.domains.filter((d) => d !== domainName);
    
    setCharacter((prev) => ({
      ...prev,
      domains: updatedDomains
    }));

    // Remove domain quests from state & LocalStorage
    const updatedQuests = { ...quests };
    delete updatedQuests[domainName];
    setQuests(updatedQuests);

    // Fallback selection
    if (selectedDomain === domainName && updatedDomains.length > 0) {
      setSelectedDomain(updatedDomains[0]);
    }
  };

  // --- 6. Shop Cosmetics purchases & Equipping callbacks ---
  const handleBuyTheme = (themeId, cost) => {
    setCharacter((prev) => ({
      ...prev,
      gold: prev.gold - cost,
      unlockedThemes: [...prev.unlockedThemes, themeId],
      activeTheme: themeId
    }));
  };

  const handleBuyAvatar = (avatarEmoji, cost) => {
    setCharacter((prev) => ({
      ...prev,
      gold: prev.gold - cost,
      unlockedAvatars: [...prev.unlockedAvatars, avatarEmoji],
      avatar: avatarEmoji
    }));
  };

  const handleBuyTitle = (titleId, cost) => {
    setCharacter((prev) => ({
      ...prev,
      gold: prev.gold - cost,
      unlockedTitles: [...prev.unlockedTitles, titleId],
      activeTitle: titleId
    }));
  };

  // Equips
  const handleEquipTheme = (themeId) => {
    setCharacter((prev) => ({ ...prev, activeTheme: themeId }));
  };

  const handleEquipAvatar = (avatarEmoji) => {
    setCharacter((prev) => ({ ...prev, avatar: avatarEmoji }));
  };

  const handleEquipTitle = (titleId) => {
    setCharacter((prev) => ({ ...prev, activeTitle: titleId }));
  };

  // --- 7. Layout Coordinator Render ---
  
  if (!character) {
    return <Onboarding onComplete={handleOnboardingComplete} t={t} />;
  }

  const activeQuestsList = quests[selectedDomain] || [];

  return (
    <div id="main-frame">
      
      {/* Dynamic Shimmer Confetti Overlay */}
      <Confetti active={confettiActive} onComplete={() => setConfettiActive(false)} />

      {/* Floating Install Pill PWA banner */}
      <InstallBanner 
        installPromptEvent={installPromptEvent} 
        onInstalled={() => setInstallPromptEvent(null)} 
        t={t}
      />

      <div className="main-app-container">
        
        {/* Floating Sidebar Layout (Desktop) */}
        <aside className="glass-panel desktop-sidebar">
          <div className="sidebar-header">
            <span className="sidebar-logo-icon">🔮</span>
            <span className="sidebar-app-name neon-text-primary">SkillThis</span>
          </div>

          <nav className="sidebar-nav">
            <button 
              className={`nav-item ${activeTab === 'status' ? 'active' : ''}`}
              onClick={() => setActiveTab('status')}
            >
              <span className="nav-icon">👤</span> {t.statusTab}
            </button>
            <button 
              className={`nav-item ${activeTab === 'quests' ? 'active' : ''}`}
              onClick={() => setActiveTab('quests')}
            >
              <span className="nav-icon">⚔️</span> {t.questsTab}
            </button>
            <button 
              className={`nav-item ${activeTab === 'shop' ? 'active' : ''}`}
              onClick={() => setActiveTab('shop')}
            >
              <span className="nav-icon">🪙</span> {t.shopTab}
            </button>
            <button 
              className={`nav-item ${activeTab === 'inventory' ? 'active' : ''}`}
              onClick={() => setActiveTab('inventory')}
            >
              <span className="nav-icon">🎒</span> {t.inventoryTab}
            </button>
          </nav>

          <div className="sidebar-footer">
            <span className="character-class-label">
              {t.classes[character.className]?.id || character.className}
            </span>
            <span className="character-level-label">{t.levelLabel} {character.level}</span>
          </div>
        </aside>

        {/* Content Area */}
        <main className="content-window">
          {activeTab === 'status' && (
            <Dashboard 
              character={character}
              selectedDomain={selectedDomain}
              onSelectDomain={(dom) => {
                setSelectedDomain(dom);
                setActiveTab('quests'); // Direct redirect to quests log for usability
              }}
              onAddDomain={handleAddDomain}
              onDeleteDomain={handleDeleteDomain}
              t={t}
              language={language}
              onChangeLanguage={setLanguage}
            />
          )}

          {activeTab === 'quests' && (
            <div className="quests-split-layout">
              {/* Domain Quick-select side rail (shown alongside quests on desktop) */}
              <div className="glass-panel domain-quick-rail">
                <h4 className="rail-title">{t.domainRealms}</h4>
                {character.domains.map((d) => (
                  <button
                    key={`rail-${d}`}
                    className={`rail-item ${selectedDomain === d ? 'active' : ''}`}
                    onClick={() => setSelectedDomain(d)}
                  >
                    {d}
                  </button>
                ))}
              </div>

              <div className="quests-main-area">
                <QuestLog 
                  domain={selectedDomain}
                  quests={activeQuestsList}
                  isLoading={loadingQuests}
                  onCompleteQuest={handleCompleteQuest}
                  onRefreshQuest={handleRefreshQuest}
                  t={t}
                />
              </div>
            </div>
          )}

          {activeTab === 'shop' && (
            <GoldShop 
              character={character}
              onBuyTheme={handleBuyTheme}
              onBuyAvatar={handleBuyAvatar}
              onBuyTitle={handleBuyTitle}
              onEquipTheme={handleEquipTheme}
              onEquipAvatar={handleEquipAvatar}
              onEquipTitle={handleEquipTitle}
              t={t}
            />
          )}

          {activeTab === 'inventory' && (
            <Inventory 
              character={character}
              onEquipTheme={handleEquipTheme}
              onEquipAvatar={handleEquipAvatar}
              onEquipTitle={handleEquipTitle}
              t={t}
            />
          )}
        </main>

        {/* Mobile Navigation Bar (Bottom Navigation) */}
        <nav className="glass-panel-heavy mobile-bottom-nav">
          <button 
            className={`mobile-nav-btn ${activeTab === 'status' ? 'active' : ''}`}
            onClick={() => setActiveTab('status')}
          >
            <span className="mobile-icon">👤</span>
            <span className="mobile-label">{t.statusTab.split(' ')[0]}</span>
          </button>
          <button 
            className={`mobile-nav-btn ${activeTab === 'quests' ? 'active' : ''}`}
            onClick={() => setActiveTab('quests')}
          >
            <span className="mobile-icon">⚔️</span>
            <span className="mobile-label">{t.questsTab.split(' ')[0]}</span>
          </button>
          <button 
            className={`mobile-nav-btn ${activeTab === 'shop' ? 'active' : ''}`}
            onClick={() => setActiveTab('shop')}
          >
            <span className="mobile-icon">🪙</span>
            <span className="mobile-label">{t.shopTab.split(' ')[0]}</span>
          </button>
          <button 
            className={`mobile-nav-btn ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveTab('inventory')}
          >
            <span className="mobile-icon">🎒</span>
            <span className="mobile-label">{t.inventoryTab.split(' ')[0]}</span>
          </button>
        </nav>
      </div>

      {/* RPG LEVEL UP MODAL */}
      {levelUpModal && (
        <div className="modal-backdrop">
          <div className="glass-panel-heavy levelup-card animate-card" style={{ animationName: 'modal-entry' }}>
            <div className="levelup-light-beam" />
            
            <span className="levelup-icon">🏆</span>
            <h2 className="levelup-announcement">{t.levelupAnnounce}</h2>
            
            <p className="levelup-text">{t.levelupText}</p>
            
            <div className="levelup-stat-grid">
              <div className="stat-box">
                <span className="stat-label">{t.prevLevel}</span>
                <span className="stat-val">{t.levelLabel} {levelUpModal.oldLevel}</span>
              </div>
              <div className="arrow-split">➔</div>
              <div className="stat-box active-glow">
                <span className="stat-label">{t.currLevel}</span>
                <span className="stat-val">{t.levelLabel} {levelUpModal.newLevel}</span>
              </div>
            </div>

            {levelUpModal.titleUnlocked && (
              <div className="title-unlock-banner">
                <span className="unlock-spark">✨</span>
                <div>
                  <div className="unlock-sub">{t.newTitleAcquired}</div>
                  <div className="unlock-title-id">"{levelUpModal.titleUnlocked}"</div>
                </div>
              </div>
            )}

            <button 
              className="glass-button accent close-levelup-btn"
              onClick={() => setLevelUpModal(null)}
            >
              {t.continueJourneyBtn}
            </button>
          </div>
        </div>
      )}

      <style>{`
        /* Core Frame Styles */
        #main-frame {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-height: 100vh;
        }

        .content-window {
          flex: 1;
          width: 100%;
        }

        /* Desktop Sidebar navigation styling */
        .desktop-sidebar {
          display: none;
          position: fixed;
          top: 24px; left: 24px; bottom: 24px;
          width: 230px;
          padding: 24px;
          flex-direction: column;
          justify-content: space-between;
          z-index: 10;
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 32px;
        }

        .sidebar-logo-icon {
          font-size: 1.8rem;
          animation: float 4s ease-in-out infinite;
        }

        .sidebar-app-name {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1.4rem;
          letter-spacing: 0.5px;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 12px;
          flex: 1;
        }

        .nav-item {
          background: transparent;
          border: 1px solid transparent;
          color: var(--text-sub);
          padding: 10px 14px;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 0.92rem;
          text-align: left;
          transition: all 0.3s ease;
        }

        .nav-item:hover {
          color: var(--text-main);
          background: rgba(255, 255, 255, 0.04);
          transform: translateX(4px);
        }

        .nav-item.active {
          color: var(--text-main);
          background: rgba(255, 255, 255, 0.06);
          border-color: var(--glass-border);
          box-shadow: var(--glass-shadow);
        }

        .sidebar-footer {
          display: flex;
          flex-direction: column;
          gap: 4px;
          border-top: 1px solid var(--glass-border);
          padding-top: 16px;
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--text-muted);
          align-items: flex-start;
        }

        .character-level-label {
          color: var(--neon-secondary);
        }

        /* Mobile Bottom Nav Bar Styling */
        .mobile-bottom-nav {
          position: fixed;
          bottom: 16px; left: 16px; right: 16px;
          height: 64px;
          border-radius: 20px;
          display: flex;
          justify-content: space-around;
          align-items: center;
          z-index: 999;
          padding: 0 8px;
          border-color: rgba(255, 255, 255, 0.12);
        }

        .mobile-nav-btn {
          background: transparent;
          border: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          gap: 3px;
          cursor: pointer;
          flex: 1;
          height: 100%;
          transition: all 0.3s ease;
        }

        .mobile-icon {
          font-size: 1.25rem;
          transition: transform 0.3s ease;
        }

        .mobile-label {
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.2px;
        }

        .mobile-nav-btn.active {
          color: var(--neon-secondary);
          text-shadow: 0 0 10px rgba(0, 240, 255, 0.3);
        }

        .mobile-nav-btn.active .mobile-icon {
          transform: translateY(-2px) scale(1.1);
        }

        /* Quest Screen split rail (desktop layout helper) */
        .quests-split-layout {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .domain-quick-rail {
          display: none;
          padding: 18px;
          height: fit-content;
        }

        .rail-title {
          font-family: var(--font-display);
          font-size: 0.95rem;
          font-weight: 700;
          margin: 0 0 12px 0;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .rail-item {
          background: transparent;
          border: none;
          color: var(--text-sub);
          padding: 10px 14px;
          text-align: left;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.88rem;
          width: 100%;
          transition: all 0.2s;
        }

        .rail-item:hover {
          background: rgba(255, 255, 255, 0.03);
          color: var(--text-main);
        }

        .rail-item.active {
          background: rgba(0, 240, 255, 0.08);
          color: var(--neon-secondary);
          border-left: 2px solid var(--neon-secondary);
          border-radius: 0 10px 10px 0;
        }

        /* Level Up Card details */
        .levelup-card {
          position: fixed;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 90%;
          max-width: 400px;
          padding: 36px 30px;
          z-index: 9999;
          text-align: center;
          overflow: hidden;
        }

        .levelup-light-beam {
          position: absolute;
          top: -100px; left: -100px; right: -100px; height: 160px;
          background: linear-gradient(90deg, transparent, var(--neon-primary), var(--neon-secondary), transparent);
          background-size: 200% 200%;
          filter: blur(50px);
          opacity: 0.35;
          animation: levelup-beam 8s ease infinite;
        }

        .levelup-icon {
          font-size: 3.5rem;
          display: block;
          margin-bottom: 8px;
          filter: drop-shadow(0 0 10px #ffb300);
          animation: float 4s ease infinite;
        }

        .levelup-announcement {
          font-family: var(--font-display);
          font-size: 2.2rem;
          font-weight: 900;
          letter-spacing: 2px;
          margin: 0 0 6px 0;
          color: #ffffff;
          text-shadow: 0 0 20px var(--neon-glow), 0 0 5px var(--neon-secondary);
        }

        .levelup-text {
          color: var(--text-sub);
          font-size: 0.9rem;
          margin: 0 0 24px 0;
        }

        .levelup-stat-grid {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          margin-bottom: 24px;
        }

        .stat-box {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--glass-border);
          border-radius: 16px;
          padding: 12px 18px;
          width: 100px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-box.active-glow {
          border-color: var(--neon-secondary);
          box-shadow: 0 0 15px rgba(0, 240, 255, 0.2);
          background: rgba(0, 240, 255, 0.04);
        }

        .stat-label {
          font-size: 0.65rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }

        .stat-val {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1.15rem;
          color: var(--text-main);
        }

        .stat-box.active-glow .stat-val {
          color: var(--neon-secondary);
        }

        .arrow-split {
          color: var(--text-muted);
          font-size: 1.2rem;
        }

        /* Title unlocks banner inside levelup */
        .title-unlock-banner {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 214, 0, 0.25);
          border-radius: 16px;
          padding: 10px 16px;
          margin-bottom: 24px;
          text-align: left;
          box-shadow: 0 4px 15px rgba(0,0,0,0.15);
        }

        .unlock-spark {
          font-size: 1.5rem;
          filter: drop-shadow(0 0 4px #ffd600);
        }

        .unlock-sub {
          font-size: 0.58rem;
          font-weight: 800;
          letter-spacing: 1.5px;
          color: #ffd600;
        }

        .unlock-title-id {
          font-family: var(--font-display);
          font-size: 0.95rem;
          font-weight: 700;
          color: #ffffff;
        }

        .close-levelup-btn {
          width: 100%;
        }

        /* Media Queries for responsive sidebar navigation */
        @media (min-width: 1024px) {
          .desktop-sidebar {
            display: flex;
          }

          .mobile-bottom-nav {
            display: none;
          }

          .quests-split-layout {
            flex-direction: row;
            align-items: flex-start;
          }

          .domain-quick-rail {
            display: block;
            width: 180px;
            flex-shrink: 0;
          }

          .quests-main-area {
            flex: 1;
          }
        }
      `}</style>
    </div>
  );
}
