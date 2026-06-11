import React, { useState } from 'react';

export default function QuestLog({ domain, quests, isLoading, onCompleteQuest, onRefreshQuest, t }) {
  // Track which specific quests are currently refreshing
  const [refreshingQuestIds, setRefreshingQuestIds] = useState([]);

  const handleRefresh = async (questId) => {
    setRefreshingQuestIds((prev) => [...prev, questId]);
    await onRefreshQuest(domain, questId);
    setRefreshingQuestIds((prev) => prev.filter((id) => id !== questId));
  };

  // Helper to translate difficulty badge
  const getDifficultyLabel = (diff) => {
    if (diff === 'Easy') return t.easyBadge;
    if (diff === 'Medium') return t.mediumBadge;
    if (diff === 'Hard') return t.hardBadge;
    return diff;
  };

  // Skeleton Loader Component for a single quest card
  const CardSkeleton = () => (
    <div className="glass-panel skeleton-card">
      <div className="skeleton-header">
        <div className="skeleton-bar skeleton-title" />
        <div className="skeleton-bar skeleton-circle" />
      </div>
      <div className="skeleton-bar skeleton-desc" />
      <div className="skeleton-bar skeleton-desc short" />
      <div className="skeleton-footer">
        <div className="skeleton-bar skeleton-badge" />
        <div className="skeleton-bar skeleton-rewards" />
        <div className="skeleton-bar skeleton-btn" />
      </div>
    </div>
  );

  return (
    <div className="quest-log-container animate-card">
      
      {/* Title Header */}
      <div className="quest-log-header">
        <div>
          <span className="quest-domain-label">{t.skillRealm}</span>
          <h2 className="domain-title neon-text-primary">{domain}</h2>
        </div>
        <div className="quest-count-badge">
          {t.activeQuestsCount.replace('{count}', quests.length)}
        </div>
      </div>

      {/* Quests Container */}
      <div className="quests-grid">
        {isLoading ? (
          // Full Screen Loading State
          Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={`init-skel-${i}`} />)
        ) : quests.length === 0 ? (
          // Empty State
          <div className="glass-panel empty-quests-card">
            <span className="empty-icon">🛡️</span>
            <h4>{t.noQuestsTitle}</h4>
            <p>{t.noQuestsDesc}</p>
          </div>
        ) : (
          quests.map((quest) => {
            const isRefreshing = refreshingQuestIds.includes(quest.id);
            
            if (isRefreshing) {
              return <CardSkeleton key={`refresh-skel-${quest.id}`} />;
            }

            const difficultyClass = quest.difficulty.toLowerCase();

            return (
              <div 
                key={quest.id} 
                className="glass-panel quest-card animate-card"
                style={{ '--diff-glow': `var(--${difficultyClass}-glow)` }}
              >
                
                {/* Card Header (Title & Refresh Button) */}
                <div className="quest-card-header">
                  <h4 className="quest-title">{quest.title}</h4>
                  <button 
                    className="quest-refresh-btn"
                    onClick={() => handleRefresh(quest.id)}
                    title={t.refreshQuestTooltip}
                    aria-label="Refresh Quest"
                  >
                    <svg className="sync-icon" viewBox="0 0 24 24" width="16" height="16">
                      <path fill="currentColor" d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
                    </svg>
                  </button>
                </div>

                {/* Description */}
                <p className="quest-description">{quest.description}</p>

                {/* Card Footer (Badges, Rewards, Complete button) */}
                <div className="quest-card-footer">
                  <div className="badge-row">
                    {/* Difficulty Badge */}
                    <span className={`difficulty-badge ${difficultyClass}`}>
                      {getDifficultyLabel(quest.difficulty)}
                    </span>
                    
                    {/* Rewards Info */}
                    <div className="quest-rewards">
                      <span className="reward-pill xp">
                        +{quest.xp} XP
                      </span>
                      <span className="reward-pill gold">
                        +{quest.gold} G
                      </span>
                    </div>
                  </div>

                  {/* Complete Button */}
                  <button 
                    className="glass-button accent complete-btn"
                    onClick={() => onCompleteQuest(quest.id)}
                  >
                    {t.completeQuestBtn}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <style>{`
        .quest-log-container {
          width: 100%;
        }

        .quest-log-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .quest-domain-label {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--text-muted);
          letter-spacing: 1px;
        }

        .domain-title {
          font-size: 1.8rem;
          font-weight: 800;
          margin: 4px 0 0 0;
          color: var(--text-main);
        }

        .quest-count-badge {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--neon-secondary);
          background: rgba(0, 240, 255, 0.08);
          border: 1px solid rgba(0, 240, 255, 0.2);
          border-radius: 20px;
          padding: 6px 14px;
        }

        .quests-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* Quest Card Styling */
        .quest-card {
          padding: 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 140px;
          border-left: 4px solid var(--diff-glow);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2), var(--glass-shadow);
        }

        .quest-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.35), 0 0 8px var(--diff-glow), var(--glass-shadow);
          border-color: rgba(255, 255, 255, 0.15);
          border-left-color: var(--diff-glow);
        }

        .quest-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 8px;
        }

        .quest-title {
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 700;
          margin: 0;
          color: var(--text-main);
        }

        .quest-refresh-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 4px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.25s ease;
        }

        .quest-refresh-btn:hover {
          color: var(--neon-secondary);
          background: rgba(255, 255, 255, 0.05);
        }

        .quest-refresh-btn:hover .sync-icon {
          animation: spin-sync 0.8s linear;
        }

        .quest-description {
          font-size: 0.88rem;
          line-height: 1.45;
          color: var(--text-sub);
          margin: 0 0 16px 0;
        }

        .quest-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .badge-row {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        /* Difficulty Badges */
        .difficulty-badge {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .difficulty-badge.easy {
          color: var(--easy-color);
          background: rgba(0, 230, 118, 0.08);
          border: 1px solid rgba(0, 230, 118, 0.2);
        }

        .difficulty-badge.medium {
          color: var(--medium-color);
          background: rgba(255, 179, 0, 0.08);
          border: 1px solid rgba(255, 179, 0, 0.2);
        }

        .difficulty-badge.hard {
          color: var(--hard-color);
          background: rgba(255, 23, 68, 0.08);
          border: 1px solid rgba(255, 23, 68, 0.2);
        }

        /* Reward Pills */
        .quest-rewards {
          display: flex;
          gap: 8px;
        }

        .reward-pill {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 20px;
          display: inline-flex;
          align-items: center;
        }

        .reward-pill.xp {
          color: #cc66ff;
          background: rgba(204, 102, 255, 0.08);
          border: 1px solid rgba(204, 102, 255, 0.2);
        }

        .reward-pill.gold {
          color: var(--medium-color);
          background: rgba(255, 179, 0, 0.08);
          border: 1px solid rgba(255, 179, 0, 0.2);
        }

        .complete-btn {
          padding: 8px 16px;
          font-size: 0.85rem;
          border-radius: 12px;
        }

        /* Empty State */
        .empty-quests-card {
          padding: 40px;
          text-align: center;
        }

        .empty-icon {
          font-size: 3rem;
          display: block;
          margin-bottom: 12px;
          animation: float 4s ease-in-out infinite;
        }

        .empty-quests-card h4 {
          font-family: var(--font-display);
          font-size: 1.2rem;
          font-weight: 700;
          margin: 0 0 6px 0;
        }

        .empty-quests-card p {
          color: var(--text-sub);
          font-size: 0.85rem;
          margin: 0;
        }

        /* Skeletons details */
        .skeleton-card {
          border-left: 4px solid rgba(255, 255, 255, 0.05);
        }

        .skeleton-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .skeleton-title {
          width: 60%;
          height: 18px;
        }

        .skeleton-circle {
          width: 20px;
          height: 20px;
          border-radius: 50%;
        }

        .skeleton-desc {
          width: 95%;
          height: 12px;
          margin-bottom: 6px;
        }

        .skeleton-desc.short {
          width: 45%;
        }

        .skeleton-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 16px;
        }

        .skeleton-badge {
          width: 60px;
          height: 20px;
          border-radius: 8px;
        }

        .skeleton-rewards {
          width: 90px;
          height: 20px;
          border-radius: 20px;
        }

        .skeleton-btn {
          width: 80px;
          height: 28px;
          border-radius: 12px;
        }

        @media (max-width: 480px) {
          .quest-card-footer {
            flex-direction: column;
            align-items: stretch;
          }
          .complete-btn {
            width: 100%;
          }
          .badge-row {
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
}
