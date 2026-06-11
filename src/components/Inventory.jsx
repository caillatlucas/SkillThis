import React, { useState } from 'react';

export default function Inventory({ character, onEquipTheme, onEquipAvatar, onEquipTitle, t }) {
  const [activeCategory, setActiveCategory] = useState('themes');
  const { unlockedThemes, unlockedAvatars, unlockedTitles, activeTheme, avatar, activeTitle } = character;

  // Helper mapping category identifiers to translation lookup keys
  const getLookupKey = (id, cat) => {
    if (cat === 'themes') return id;
    if (cat === 'titles') {
      if (id === 'Novice Adventurer') return 'novice';
      if (id === 'Code Archmage') return 'mage';
      if (id === 'Grammar Assassin') return 'rogue';
      if (id === 'Iron Overlord') return 'warrior';
      if (id === 'Pixel Alchemist') return 'bard';
      if (id === 'The Unstoppable') return 'unstoppable';
    }
    return id;
  };

  // Helper translation for tab category titles
  const getCategoryLabel = (cat) => {
    if (cat === 'themes') return t.shopTabs.themes;
    if (cat === 'avatars') return t.shopTabs.avatars;
    if (cat === 'titles') return t.shopTabs.titles;
    return cat;
  };

  return (
    <div className="inventory-container animate-card">
      
      {/* Inventory Header */}
      <div className="inventory-header">
        <div>
          <span className="inventory-label">{t.inventoryLabel}</span>
          <h2 className="inventory-title neon-text-primary">{t.inventoryTitle}</h2>
        </div>
        
        <div className="glass-panel items-count-card">
          <span className="backpack-icon">🎒</span>
          <span className="items-count">
            {t.unlockedCount.replace('{count}', unlockedThemes.length + unlockedAvatars.length + unlockedTitles.length)}
          </span>
        </div>
      </div>

      {/* Categories Tab Selector */}
      <div className="inventory-tabs">
        {['themes', 'avatars', 'titles'].map((cat) => {
          let count = 0;
          if (cat === 'themes') count = unlockedThemes.length;
          if (cat === 'avatars') count = unlockedAvatars.length;
          if (cat === 'titles') count = unlockedTitles.length;

          return (
            <button
              key={cat}
              className={`cat-btn glass-button ${activeCategory === cat ? 'active-cat' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {getCategoryLabel(cat)} <span className="cat-count">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Unlocked Items Grid */}
      <div className="inventory-items-grid">
        
        {/* THEMES */}
        {activeCategory === 'themes' && unlockedThemes.map((themeId) => {
          const detail = t.cosmetics[themeId] || { name: themeId, desc: '' };
          const isActive = activeTheme === themeId;

          // Resolve bg color values from shop database structure to keep preview consistency
          let bgVal = '#ff3131'; // default red
          if (themeId === 'cobalt') bgVal = '#1e1145';
          else if (themeId === 'emerald') bgVal = '#0d382b';
          else if (themeId === 'crimson') bgVal = '#4a0e1b';
          else if (themeId === 'cyber') bgVal = '#2e2609';
          else if (themeId === 'amethyst') bgVal = '#3a0d45';

          return (
            <div 
              key={themeId} 
              className={`glass-panel inventory-item-card ${isActive ? 'equipped' : ''}`}
              onClick={() => !isActive && onEquipTheme(themeId)}
            >
              <div 
                className="inventory-theme-circle"
                style={{ background: `radial-gradient(circle, ${bgVal} 0%, #03010b 100%)` }}
              >
                <div className="preview-glare" />
                {isActive && <div className="equipped-badge">{t.activeBadge}</div>}
              </div>
              <h4 className="inventory-item-name">{detail.name}</h4>
              <p className="inventory-item-desc">{detail.desc}</p>
            </div>
          );
        })}

        {/* AVATARS */}
        {activeCategory === 'avatars' && unlockedAvatars.map((avatarEmoji) => {
          const isActive = avatar === avatarEmoji;

          return (
            <div 
              key={avatarEmoji} 
              className={`glass-panel inventory-item-card ${isActive ? 'equipped' : ''}`}
              onClick={() => !isActive && onEquipAvatar(avatarEmoji)}
            >
              <div className="glass-avatar-container inventory-avatar">
                <span className="glass-avatar-emoji">{avatarEmoji}</span>
                <div className="bubble-reflection" />
                {isActive && <div className="equipped-badge">{t.activeBadge}</div>}
              </div>
              <h4 className="inventory-item-name">{t.backpackAvatarName}</h4>
              <p className="inventory-item-desc">{t.backpackAvatarDesc.replace('{emoji}', avatarEmoji)}</p>
            </div>
          );
        })}

        {/* TITLES */}
        {activeCategory === 'titles' && unlockedTitles.map((titleId) => {
          const detail = t.cosmetics[getLookupKey(titleId, 'titles')] || { name: titleId, desc: '' };
          const isActive = activeTitle === titleId;

          return (
            <div 
              key={titleId} 
              className={`glass-panel inventory-item-card title-card ${isActive ? 'equipped' : ''}`}
              onClick={() => !isActive && onEquipTitle(titleId)}
            >
              <div className="inventory-title-tag">
                🛡️ {detail.name}
              </div>
              {isActive && <div className="equipped-badge relative-badge">{t.activeBadge}</div>}
              <p className="inventory-item-desc">{detail.desc}</p>
            </div>
          );
        })}
      </div>

      <style>{`
        .inventory-container {
          width: 100%;
        }

        .inventory-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .inventory-label {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--text-muted);
          letter-spacing: 1px;
        }

        .inventory-title {
          font-size: 1.8rem;
          font-weight: 800;
          margin: 4px 0 0 0;
        }

        .items-count-card {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 16px;
        }

        .backpack-icon {
          font-size: 1.25rem;
        }

        .items-count {
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text-sub);
        }

        /* Tabs Menu */
        .inventory-tabs {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
          border-bottom: 1px solid var(--glass-border);
          padding-bottom: 12px;
        }

        .cat-btn {
          padding: 8px 18px;
          border-radius: 12px;
          font-size: 0.88rem;
        }

        .cat-btn.active-cat {
          border-color: var(--neon-secondary);
          background: rgba(0, 240, 255, 0.08);
          box-shadow: 0 0 10px rgba(0, 240, 255, 0.2);
          color: var(--text-main);
        }

        .cat-count {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-left: 2px;
        }

        .cat-btn.active-cat .cat-count {
          color: var(--neon-secondary);
        }

        /* Items Grid Layout */
        .inventory-items-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 16px;
        }

        .inventory-item-card {
          padding: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
          min-height: 180px;
          justify-content: center;
          position: relative;
        }

        .inventory-item-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3), var(--glass-shadow);
        }

        .inventory-item-card.equipped {
          border-color: var(--neon-secondary);
          box-shadow: 0 0 15px rgba(0, 240, 255, 0.2), var(--glass-shadow);
          background: radial-gradient(circle at 50% 50%, rgba(0, 240, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
          cursor: default;
        }

        /* Visual details */
        .inventory-theme-circle {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          border: 1px solid var(--glass-border);
          position: relative;
          overflow: hidden;
          margin-bottom: 12px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.4);
        }

        .inventory-avatar {
          width: 56px;
          height: 56px;
          margin-bottom: 12px;
        }

        .inventory-avatar .glass-avatar-emoji {
          font-size: 1.8rem;
        }

        .inventory-title-tag {
          font-family: var(--font-display);
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--neon-secondary);
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--glass-border);
          padding: 6px 12px;
          border-radius: 10px;
          margin-bottom: 12px;
          text-shadow: 0 0 6px rgba(0, 240, 255, 0.3);
        }

        .inventory-item-name {
          font-family: var(--font-display);
          font-size: 0.95rem;
          font-weight: 700;
          margin: 0 0 4px 0;
          color: var(--text-main);
        }

        .inventory-item-desc {
          font-size: 0.72rem;
          color: var(--text-muted);
          line-height: 1.3;
          margin: 0;
        }

        /* Equipped badge on visual */
        .equipped-badge {
          position: absolute;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--neon-secondary);
          color: #03010b;
          font-size: 0.58rem;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 6px;
          box-shadow: 0 2px 6px rgba(0, 240, 255, 0.4);
          letter-spacing: 0.5px;
        }

        .equipped-badge.relative-badge {
          position: relative;
          transform: none;
          left: 0;
          margin-bottom: 8px;
          display: inline-block;
        }
      `}</style>
    </div>
  );
}
