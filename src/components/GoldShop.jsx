import React, { useState } from 'react';

const SHOP_ITEMS = {
  themes: [
    { id: 'default', name: 'Original Red', cost: 0, desc: 'The classic crimson style.', bg: '#ff3131' },
    { id: 'cobalt', name: 'Cobalt Nebula', cost: 100, desc: 'Cosmic purple-blue layers.', bg: '#1e1145' },
    { id: 'emerald', name: 'Emerald Aurora', cost: 120, desc: 'Cosmic green layers.', bg: '#0d382b' },
    { id: 'crimson', name: 'Crimson Nebula', cost: 200, desc: 'Burning red landscape.', bg: '#4a0e1b' },
    { id: 'cyber', name: 'Cyberpunk Gold', cost: 300, desc: 'Bronze and gold details.', bg: '#2e2609' },
    { id: 'amethyst', name: 'Amethyst Shadow', cost: 240, desc: 'Shadow purple style.', bg: '#3a0d45' }
  ],
  avatars: [
    { id: '🦄', name: 'Starlight Unicorn', cost: 80, desc: 'A unicorn avatar.' },
    { id: '🦊', name: 'Shadow Fox', cost: 120, desc: 'A clever fox avatar.' },
    { id: '🤖', name: 'Cybernetic Mech', cost: 180, desc: 'A robot mech avatar.' },
    { id: '🚀', name: 'Space Explorer', cost: 250, desc: 'A spaceship builder avatar.' },
    { id: '👑', name: 'Royal Crown', cost: 300, desc: 'A majestic crown avatar.' }
  ],
  titles: [
    { id: 'Novice Adventurer', name: 'Novice Adventurer', cost: 0, desc: 'Just starting.' },
    { id: 'Code Archmage', name: 'Code Archmage', cost: 100, desc: 'Galaxy compiler.' },
    { id: 'Grammar Assassin', name: 'Grammar Assassin', cost: 100, desc: 'Translation solver.' },
    { id: 'Iron Overlord', name: 'Iron Overlord', cost: 150, desc: 'Gym iron master.' },
    { id: 'Pixel Alchemist', name: 'Pixel Alchemist', cost: 120, desc: 'CSS builder.' },
    { id: 'The Unstoppable', name: 'The Unstoppable', cost: 400, desc: 'Elite pathfinder.' }
  ]
};

export default function GoldShop({ character, onBuyTheme, onBuyAvatar, onBuyTitle, onEquipTheme, onEquipAvatar, onEquipTitle, t }) {
  const [activeTab, setActiveTab] = useState('themes');
  const { gold, unlockedThemes, unlockedAvatars, unlockedTitles, activeTheme, avatar, activeTitle } = character;

  const handlePurchase = (category, item) => {
    if (gold < item.cost) return;

    if (category === 'themes') {
      onBuyTheme(item.id, item.cost);
    } else if (category === 'avatars') {
      onBuyAvatar(item.id, item.cost);
    } else if (category === 'titles') {
      onBuyTitle(item.id, item.cost);
    }
  };

  const handleEquip = (category, itemId) => {
    if (category === 'themes') {
      onEquipTheme(itemId);
    } else if (category === 'avatars') {
      onEquipAvatar(itemId);
    } else if (category === 'titles') {
      onEquipTitle(itemId);
    }
  };

  // Helper mapping category translation IDs
  const getTabLabel = (tabId) => {
    if (tabId === 'themes') return t.shopTabs.themes;
    if (tabId === 'avatars') return t.shopTabs.avatars;
    if (tabId === 'titles') return t.shopTabs.titles;
    return tabId;
  };

  // Helper mapping cosmetic key to translation dictionary
  const getCosmeticDetail = (item) => {
    let lookupKey = item.id;
    // Map avatar emojis to cosmetic key names defined in translation.js
    if (activeTab === 'avatars') {
      if (item.id === '🦄') lookupKey = 'unicorn';
      else if (item.id === '🦊') lookupKey = 'fox';
      else if (item.id === '🤖') lookupKey = 'mech';
      else if (item.id === '🚀') lookupKey = 'explorer';
      else if (item.id === '👑') lookupKey = 'crown';
    } else if (activeTab === 'titles') {
      if (item.id === 'Novice Adventurer') lookupKey = 'novice';
      else if (item.id === 'Code Archmage') lookupKey = 'mage';
      else if (item.id === 'Grammar Assassin') lookupKey = 'rogue';
      else if (item.id === 'Iron Overlord') lookupKey = 'warrior';
      else if (item.id === 'Pixel Alchemist') lookupKey = 'bard';
      else if (item.id === 'The Unstoppable') lookupKey = 'unstoppable';
    }

    return t.cosmetics[lookupKey] || { name: item.name, desc: item.desc };
  };

  return (
    <div className="shop-container animate-card">
      
      {/* Shop Header */}
      <div className="shop-header">
        <div>
          <span className="shop-label">{t.shopTagline}</span>
          <h2 className="shop-title neon-text-primary">{t.shopTitle}</h2>
        </div>
        
        {/* User Gold Balance Display */}
        <div className="glass-panel balance-card">
          <span className="coin-glow">🪙</span>
          <span className="balance-amount">{gold} <span className="balance-unit">{t.goldUnit}</span></span>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="shop-tabs">
        {['themes', 'avatars', 'titles'].map((tab) => (
          <button
            key={tab}
            className={`tab-btn glass-button ${activeTab === tab ? 'active-tab' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {getTabLabel(tab)}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="shop-items-grid">
        {SHOP_ITEMS[activeTab].map((item) => {
          let isOwned = false;
          let isActive = false;

          if (activeTab === 'themes') {
            isOwned = unlockedThemes.includes(item.id);
            isActive = activeTheme === item.id;
          } else if (activeTab === 'avatars') {
            isOwned = unlockedAvatars.includes(item.id);
            isActive = avatar === item.id;
          } else if (activeTab === 'titles') {
            isOwned = unlockedTitles.includes(item.id);
            isActive = activeTitle === item.id;
          }

          const canAfford = gold >= item.cost;
          const cosmetic = getCosmeticDetail(item);

          return (
            <div 
              key={item.id} 
              className={`glass-panel shop-item-card ${isActive ? 'active-equipped' : ''}`}
            >
              {/* Visual Preview */}
              <div className="item-preview-area">
                {activeTab === 'themes' && (
                  <div 
                    className="theme-preview-circle" 
                    style={{ background: `radial-gradient(circle, ${item.bg} 0%, #03010b 100%)` }}
                  >
                    <div className="preview-glare" />
                  </div>
                )}
                {activeTab === 'avatars' && (
                  <div className="glass-avatar-container preview-avatar">
                    <span className="glass-avatar-emoji">{item.id}</span>
                    <div className="bubble-reflection" />
                  </div>
                )}
                {activeTab === 'titles' && (
                  <div className="title-preview-tag">
                    🛡️ {cosmetic.name}
                  </div>
                )}
              </div>

              {/* Title & Description */}
              <div className="item-details">
                <h4 className="item-name">{cosmetic.name}</h4>
                <p className="item-desc">{cosmetic.desc}</p>
              </div>

              {/* Action Area */}
              <div className="item-action-row">
                <div className="price-tag">
                  {item.cost === 0 ? (
                    <span className="free-label">{t.itemFree}</span>
                  ) : (
                    <>
                      <span className="gold-icon-sm">🪙</span>
                      <span className="cost-val">{item.cost}</span>
                    </>
                  )}
                </div>

                {isActive ? (
                  <button className="glass-button equipped-btn" disabled>
                    {t.btnEquipped}
                  </button>
                ) : isOwned ? (
                  <button 
                    className="glass-button equip-btn"
                    onClick={() => handleEquip(activeTab, item.id)}
                  >
                    {t.btnEquip}
                  </button>
                ) : (
                  <button 
                    className={`glass-button buy-btn ${canAfford ? 'accent' : 'disabled'}`}
                    disabled={!canAfford}
                    onClick={() => handlePurchase(activeTab, item)}
                  >
                    {!canAfford ? t.btnLocked : t.btnUnlock}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .shop-container {
          width: 100%;
        }

        .shop-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .shop-label {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--text-muted);
          letter-spacing: 1px;
        }

        .shop-title {
          font-size: 1.8rem;
          font-weight: 800;
          margin: 4px 0 0 0;
        }

        .balance-card {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 16px;
          border-color: rgba(255, 179, 0, 0.3);
        }

        .coin-glow {
          font-size: 1.25rem;
          filter: drop-shadow(0 0 4px #ffb300);
        }

        .balance-amount {
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 800;
          color: #ffb300;
          text-shadow: 0 0 8px rgba(255, 179, 0, 0.3);
        }

        .balance-unit {
          font-size: 0.8rem;
          font-weight: 400;
          color: var(--text-muted);
        }

        /* Tabs Menu */
        .shop-tabs {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
          border-bottom: 1px solid var(--glass-border);
          padding-bottom: 12px;
        }

        .tab-btn {
          padding: 8px 18px;
          border-radius: 12px;
          font-size: 0.88rem;
        }

        .tab-btn.active-tab {
          border-color: var(--neon-secondary);
          background: rgba(0, 240, 255, 0.08);
          box-shadow: 0 0 10px rgba(0, 240, 255, 0.2);
          color: var(--text-main);
        }

        /* Items Grid Layout */
        .shop-items-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 20px;
        }

        .shop-item-card {
          padding: 18px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          justify-content: space-between;
          min-height: 280px;
        }

        .shop-item-card.active-equipped {
          border-color: var(--neon-secondary);
          box-shadow: 0 0 15px rgba(0, 240, 255, 0.2), var(--glass-shadow);
        }

        /* Previews area */
        .item-preview-area {
          height: 90px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
          position: relative;
          width: 100%;
        }

        .theme-preview-circle {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          border: 1.5px solid var(--glass-border);
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0,0,0,0.5);
        }

        .preview-glare {
          position: absolute;
          top: 0; left: 0; right: 0; height: 50%;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, transparent 100%);
        }

        .preview-avatar {
          width: 70px;
          height: 70px;
          animation: float 4s ease-in-out infinite;
        }

        .preview-avatar .glass-avatar-emoji {
          font-size: 2.2rem;
        }

        .title-preview-tag {
          font-family: var(--font-display);
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--neon-secondary);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--glass-border);
          padding: 6px 14px;
          border-radius: 12px;
          text-shadow: 0 0 6px rgba(0, 240, 255, 0.3);
        }

        /* Details */
        .item-details {
          margin-bottom: 16px;
        }

        .item-name {
          font-family: var(--font-display);
          font-size: 1rem;
          font-weight: 700;
          margin: 0 0 6px 0;
          color: var(--text-main);
        }

        .item-desc {
          font-size: 0.78rem;
          line-height: 1.4;
          color: var(--text-sub);
          margin: 0;
          max-height: 52px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Action elements */
        .item-action-row {
          display: flex;
          width: 100%;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          border-top: 1px solid var(--glass-border);
          padding-top: 12px;
        }

        .price-tag {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .gold-icon-sm {
          font-size: 0.95rem;
        }

        .cost-val {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 0.95rem;
          color: #ffb300;
        }

        .free-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--easy-color);
        }

        .buy-btn, .equip-btn, .equipped-btn {
          padding: 6px 14px;
          font-size: 0.78rem;
          border-radius: 10px;
          flex: 1;
        }

        .buy-btn.disabled {
          background: rgba(255, 255, 255, 0.02);
          border-color: rgba(255, 255, 255, 0.03);
          color: var(--text-muted);
          cursor: not-allowed;
          box-shadow: none;
        }

        .buy-btn.disabled:hover {
          transform: none;
          box-shadow: none;
        }

        .equipped-btn {
          background: rgba(0, 240, 255, 0.1);
          border-color: rgba(0, 240, 255, 0.25);
          color: var(--neon-secondary);
          cursor: default;
        }

        .equipped-btn:hover {
          transform: none;
          box-shadow: none;
        }
      `}</style>
    </div>
  );
}
