import React from 'react';

interface FilterBarProps {
  regions: string[];
  currentFilter: string;
  onFilterChange: (filter: string) => void;
  totalCards: number;
  filteredCount: number;
}

const FilterBar: React.FC<FilterBarProps> = ({ 
  regions, 
  currentFilter, 
  onFilterChange, 
  totalCards, 
  filteredCount 
}) => {
  return (
    <div className="filter-bar animate-fadeIn">
      {/* 筛选标题和统计 */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--space-6)',
          flexWrap: 'wrap',
          gap: 'var(--space-4)'
        }}
      >
        <div>
          <h3 
            style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 'var(--font-bold)',
              color: 'var(--gray-900)',
              margin: '0 0 var(--space-1) 0'
            }}
          >
            探索卡片
          </h3>
          <p 
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--gray-600)',
              margin: 0
            }}
          >
            {currentFilter === 'all' 
              ? `共 ${totalCards} 张卡片` 
              : `${currentFilter} 地区：${filteredCount} 张卡片`
            }
          </p>
        </div>
        
        {/* 搜索框占位 */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--bg-white)',
            border: '2px solid var(--gray-200)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-2) var(--space-3)',
            minWidth: '200px',
            transition: 'all var(--transition-fast)'
          }}
        >
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            style={{ color: 'var(--gray-400)', marginRight: 'var(--space-2)' }}
          >
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input 
            type="text" 
            placeholder="搜索卡片..." 
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: 'var(--text-sm)',
              color: 'var(--gray-700)',
              width: '100%'
            }}
          />
        </div>
      </div>
      
      {/* 筛选按钮组 */}
      <div 
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--space-3)',
          justifyContent: 'center',
          padding: 'var(--space-6)',
          background: 'var(--bg-white)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--gray-100)'
        }}
      >
        {/* 全部按钮 */}
        <button 
          onClick={() => onFilterChange('all')}
          className={`filter-button ${currentFilter === 'all' ? 'active' : ''}`}
          style={{
            padding: 'var(--space-3) var(--space-5)',
            borderRadius: 'var(--radius-lg)',
            border: 'none',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-medium)',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
            position: 'relative',
            overflow: 'hidden',
            background: currentFilter === 'all' 
              ? 'linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-blue-light) 100%)'
              : 'var(--bg-light)',
            color: currentFilter === 'all' ? 'white' : 'var(--gray-700)',
            boxShadow: currentFilter === 'all' 
              ? 'var(--shadow-md)' 
              : 'var(--shadow-sm)',
            transform: currentFilter === 'all' ? 'translateY(-1px)' : 'translateY(0)'
          }}
        >
          <span style={{ position: 'relative', zIndex: 1 }}>
            🌍 全部地区
          </span>
          {currentFilter === 'all' && (
            <div 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(255, 255, 255, 0.1)',
                animation: 'shimmer 2s infinite'
              }}
            />
          )}
        </button>
        
        {/* 地区按钮 */}
        {regions.map(region => {
          const regionEmojis: { [key: string]: string } = {
            '太平洋岛': '🏝️',
            '西欧': '🏰',
            '非洲南': '🦁',
            '东欧': '🏛️',
            '非洲北': '🐪',
            '东南亚': '🌺',
            '澳洲': '🦘',
            '南美': '🦜'
          };
          
          return (
            <button 
              key={region}
              onClick={() => onFilterChange(region)}
              className={`filter-button ${currentFilter === region ? 'active' : ''}`}
              style={{
                padding: 'var(--space-3) var(--space-4)',
                borderRadius: 'var(--radius-lg)',
                border: 'none',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-medium)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                position: 'relative',
                overflow: 'hidden',
                background: currentFilter === region 
                  ? 'linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-blue-light) 100%)'
                  : 'var(--bg-light)',
                color: currentFilter === region ? 'white' : 'var(--gray-700)',
                boxShadow: currentFilter === region 
                  ? 'var(--shadow-md)' 
                  : 'var(--shadow-sm)',
                transform: currentFilter === region ? 'translateY(-1px)' : 'translateY(0)'
              }}
            >
              <span style={{ position: 'relative', zIndex: 1 }}>
                {regionEmojis[region] || '🌏'} {region}
              </span>
              {currentFilter === region && (
                <div 
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(255, 255, 255, 0.1)',
                    animation: 'shimmer 2s infinite'
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
      
      {/* 动画样式 */}
      <style>{`
        .filter-button:hover:not(.active) {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
          background: var(--bg-white);
        }
        
        .filter-button:active {
          transform: translateY(0);
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        @media (max-width: 768px) {
          .filter-button {
            padding: var(--space-2) var(--space-3);
            font-size: var(--text-xs);
          }
        }
      `}</style>
    </div>
  );
};

export default FilterBar;