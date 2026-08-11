import React from 'react';

// 卡片类型定义
export interface Card {
  id: string;
  name: string;
  region: string;
  category: string;
  subcategory: string;
  frontImage: string;
  backImage: string;
}

interface CardComponentProps {
  card: Card;
  isFlipped: boolean;
  onClick: () => void;
}

const CardComponent: React.FC<CardComponentProps> = ({ card, isFlipped, onClick }) => {
  return (
    <div 
      className="card-container"
      style={{ 
        position: 'relative',
        width: 'var(--card-width)',
        height: 'var(--card-height)',
        cursor: 'pointer',
        perspective: '1000px',
        margin: '0 auto'
      }}
      onClick={onClick}
    >
      <div 
        className="card-inner"
        style={{ 
          position: 'relative',
          width: '100%',
          height: '100%'
        }}
      >
        {/* 卡片正面 */}
        <div 
          className="card-face card-front"
          style={{ 
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: 'var(--radius-card)',
            background: 'var(--bg-card)',
            boxShadow: 'var(--shadow-card)',
            overflow: 'hidden',
            transition: 'opacity 0.4s',
            opacity: isFlipped ? 0 : 1
          }}
        >
          {/* 卡片图片 */}
          <div 
            style={{
              position: 'relative',
              width: '100%',
              height: '70%',
              overflow: 'hidden'
            }}
          >
            <img 
              src={card.frontImage} 
              alt={card.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform var(--transition-normal)'
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/api/placeholder/256/384';
              }}
            />
            
            {/* 渐变遮罩 */}
            <div 
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '50%',
                background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)'
              }}
            />
            
            {/* 分类标签 */}
            <div 
              style={{
                position: 'absolute',
                top: 'var(--space-3)',
                right: 'var(--space-3)',
                background: 'var(--primary-blue)',
                color: 'white',
                padding: 'var(--space-1) var(--space-2)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--font-medium)',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              {card.category}
            </div>
          </div>
          
          {/* 卡片信息区域 */}
          <div 
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: 'var(--space-4)',
              background: 'var(--bg-card)',
              borderTop: '1px solid var(--gray-100)'
            }}
          >
            <h3 
              style={{ 
                fontSize: 'var(--text-lg)',
                fontWeight: 'var(--font-bold)',
                color: 'var(--gray-900)',
                margin: '0 0 var(--space-2) 0',
                lineHeight: '1.3',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {card.name}
            </h3>
            
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                marginBottom: 'var(--space-2)'
              }}
            >
              <span 
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--primary-blue)',
                  fontWeight: 'var(--font-medium)',
                  background: 'var(--bg-light)',
                  padding: 'var(--space-1) var(--space-2)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--gray-200)'
                }}
              >
                {card.region}
              </span>
              
              <span 
                style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--gray-500)',
                  background: 'var(--gray-100)',
                  padding: 'var(--space-1) var(--space-2)',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                {card.subcategory}
              </span>
            </div>
            
            {/* 翻转提示 */}
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-1)',
                fontSize: 'var(--text-xs)',
                color: 'var(--gray-400)',
                marginTop: 'var(--space-2)'
              }}
            >
              <span>点击翻转查看详情</span>
              <svg 
                width="12" 
                height="12" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                <path d="M21 3v5h-5"/>
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                <path d="M3 21v-5h5"/>
              </svg>
            </div>
          </div>
        </div>
        
        {/* 卡片背面 */}
        <div 
          className="card-face card-back"
          style={{ 
            position: 'absolute',
            width: '100%',
            height: '100%',
            opacity: isFlipped ? 1 : 0,
            transition: 'opacity 0.4s, transform 0.6s',
            display: isFlipped ? 'flex' : 'none',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 0,
            transform: isFlipped ? 'rotate(90deg)' : 'rotate(0deg)',
            borderRadius: 'var(--radius-card)',
            background: 'var(--bg-card)',
            boxShadow: 'var(--shadow-card)',
            overflow: 'visible',
            zIndex: isFlipped ? 2 : 1
          }}
        >
          <img 
            src={card.backImage} 
            alt={`${card.name} 详细信息`}
            style={{
              width: '150%',
              height: '150%',
              objectFit: 'contain',
              position: 'absolute',
              zIndex: 10,
              borderRadius: 'var(--radius-card)'
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'block';
              target.style.width = '100%';
              target.style.height = '100%';
              target.style.objectFit = 'cover';
              target.style.background = 'var(--gray-100)';
              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjM4NCIgdmlld0JveD0iMCAwIDI1NiAzODQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMzg0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMjggMTkyQzEzNi44MzcgMTkyIDE0NCAxODQuODM3IDE0NCAxNzZDMTQ0IDE2Ny4xNjMgMTM2LjgzNyAxNjAgMTI4IDE2MEMxMTkuMTYzIDE2MCAxMTIgMTY3LjE2MyAxMTIgMTc2QzExMiAxODQuODM3IDExOS4xNjMgMTkyIDEyOCAxOTJaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0xNDQgMjA4SDExMlYyMTZIMTQ0VjIwOFoiIGZpbGw9IiM5QjlCQTAiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTkgMTJMMTEgMTRMMTUgMTBNMjEgMTJDMjEgMTYuOTcwNiAxNi45NzA2IDIxIDEyIDIxQzcuMDI5NDQgMjEgMyAxNi45NzA2IDMgMTJDMyA3LjAyOTQ0IDcuMDI5NDQgMyAxMiAzQzE2Ljk3MDYgMyAyMSA3LjAyOTQ0IDIxIDEyWiIgc3Ryb2tlPSIjOUI5QkEwIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4KPC9zdmc+';
            }}
          />
          
          {/* 返回提示 */}
          <div 
            style={{
              position: 'absolute',
              bottom: 'var(--space-4)',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              padding: 'var(--space-2) var(--space-3)',
              borderRadius: 'var(--radius-lg)',
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--font-medium)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-1)',
              backdropFilter: 'blur(10px)',
              zIndex: 20
            }}
          >
            <svg 
              width="12" 
              height="12" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
              <path d="M21 3v5h-5"/>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
              <path d="M3 21v-5h5"/>
            </svg>
            <span>再次点击返回</span>
          </div>
        </div>
      </div>
      
      {/* 内联样式处理悬停效果 */}
      <style>{`
        .card-container {
          transition: var(--transition-mystical);
        }
        
        .card-container:hover {
          transform: translateY(-8px);
          animation: magicGlow 2s ease-in-out infinite;
        }
        
        .card-container:hover .card-front {
          transform: translateY(-2px);
          box-shadow: var(--shadow-mystical);
          background: var(--gradient-card);
        }
        
        .card-container:hover .card-front img {
          transform: scale(1.05);
          filter: brightness(1.1) saturate(1.2);
        }
        
        .card-container:active {
          transform: scale(0.98) translateY(-5px);
        }
        
        .card-face {
          transition: all var(--transition-mystical);
        }
        
        .card-container::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: var(--gradient-magic);
          border-radius: calc(var(--radius-card) + 2px);
          opacity: 0;
          transition: var(--transition-mystical);
          z-index: -1;
        }
        
        .card-container:hover::before {
          opacity: 0.3;
          animation: magicGlow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default CardComponent;