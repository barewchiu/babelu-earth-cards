import React, { useEffect, useState } from 'react';

interface SimpleEarthProps {
  onEnterGame: () => void;
  onEnterRandomDraw: () => void;
}

const SimpleEarth: React.FC<SimpleEarthProps> = ({ onEnterGame, onEnterRandomDraw }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [earthTexture, setEarthTexture] = useState<string>('');

  useEffect(() => {
    // 预加载地球纹理
    const img = new Image();
    img.onload = () => {
      console.log('地球纹理加载成功');
      setEarthTexture('/earth-textures/earth%20albedo.jpg');
    };
    img.onerror = () => {
      console.log('地球纹理加载失败，使用默认样式');
      setEarthTexture('');
    };
    img.src = '/earth-textures/earth%20albedo.jpg';

    // 创建星空效果
    const createStars = () => {
      const container = document.getElementById('simple-stars-container');
      if (!container) return;

      container.innerHTML = '';
      
      for (let i = 0; i < 200; i++) {
        const star = document.createElement('div');
        star.style.position = 'absolute';
        star.style.width = Math.random() * 3 + 1 + 'px';
        star.style.height = star.style.width;
        star.style.backgroundColor = 'white';
        star.style.borderRadius = '50%';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.opacity = (Math.random() * 0.8 + 0.2).toString();
        star.style.animation = `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`;
        star.style.animationDelay = Math.random() * 2 + 's';
        
        container.appendChild(star);
      }
    };

    createStars();
  }, []);

  const handleEarthClick = () => {
    setIsClicked(true);
    setTimeout(() => {
      onEnterGame();
    }, 1500);
  };

  return (
    <div className="simple-earth-homepage">
      {/* 星空背景 */}
      <div id="simple-stars-container" className="simple-stars-container"></div>
      
      {/* 主要内容 */}
      <div className="simple-content">
        {/* 标题 */}
        <div className="simple-title">
          <h1>🔮 贝贝鲁地球百科卡片 ✨</h1>
          <p>🌌 探索东方传说的神秘世界 🌌</p>
        </div>

        {/* 地球容器 */}
        <div className="simple-earth-container">
          <div 
            className={`simple-earth ${isHovered ? 'hovered' : ''} ${isClicked ? 'clicked' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleEarthClick}
          >
            {/* 地球核心 */}
            <div 
              className="simple-earth-core"
              style={{
                backgroundImage: earthTexture 
                  ? `url(${earthTexture})` 
                  : 'radial-gradient(circle at 30% 40%, #4ade80 0%, #22c55e 30%, #16a34a 60%, #15803d 100%)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              {/* 大气层光晕 */}
              <div className="simple-atmosphere"></div>
            </div>

            {/* 轨道环 */}
            <div className="simple-orbit-ring ring-1"></div>
            <div className="simple-orbit-ring ring-2"></div>
            <div className="simple-orbit-ring ring-3"></div>

            {/* 魔法粒子 */}
            <div className="simple-particles">
              {[...Array(12)].map((_, i) => (
                <div 
                  key={i} 
                  className="simple-particle"
                  style={{
                    '--delay': `${i * 0.5}s`,
                    '--rotation': `${i * 30}deg`
                  } as React.CSSProperties}
                ></div>
              ))}
            </div>
          </div>

          {/* 交互提示 */}
          <div className="simple-interaction-hint">
            <p>✨ 点击地球开始探索 ✨</p>
            <div className="simple-arrow">↑</div>
          </div>
        </div>

        {/* 游戏模式选择 */}
        <div className="simple-game-modes">
          <button 
            className="simple-mode-button collection-mode"
            onClick={onEnterGame}
          >
            <span className="mode-icon">📚</span>
            <span className="mode-title">卡牌收藏</span>
            <span className="mode-desc">浏览所有卡牌</span>
          </button>
          
          <button 
            className="simple-mode-button random-mode"
            onClick={onEnterRandomDraw}
          >
            <span className="mode-icon">🎲</span>
            <span className="mode-title">随机抽卡</span>
            <span className="mode-desc">神秘地图抽取</span>
          </button>
        </div>

        {/* 特色展示 */}
        <div className="simple-features">
          <div className="simple-feature">
            <span>🎴</span>
            <p>收集卡牌</p>
          </div>
          <div className="simple-feature">
            <span>🌍</span>
            <p>探索世界</p>
          </div>
          <div className="simple-feature">
            <span>📚</span>
            <p>学习知识</p>
          </div>
        </div>
      </div>

      {/* 样式 */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        @keyframes earthRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes orbitRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes particleOrbit {
          from { transform: rotate(var(--rotation)) translateX(180px) rotate(calc(-1 * var(--rotation))); }
          to { transform: rotate(calc(var(--rotation) + 360deg)) translateX(180px) rotate(calc(-1 * (var(--rotation) + 360deg))); }
        }

        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(167, 139, 250, 0.3); }
          50% { box-shadow: 0 0 40px rgba(167, 139, 250, 0.6); }
        }

        @keyframes clickExplosion {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.8; }
          100% { transform: scale(3); opacity: 0; }
        }

        .simple-earth-homepage {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: radial-gradient(ellipse at center, #1a1b3a 0%, #0f0f23 70%, #000000 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          z-index: 1000;
        }

        .simple-stars-container {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }

        .simple-content {
          text-align: center;
          z-index: 10;
          position: relative;
        }

        .simple-title h1 {
          font-size: 2.5rem;
          background: linear-gradient(45deg, #a78bfa, #fbbf24, #a78bfa);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 0.5rem;
          text-shadow: 0 0 20px rgba(167, 139, 250, 0.5);
        }

        .simple-title p {
          font-size: 1.2rem;
          color: #a78bfa;
          margin-bottom: 3rem;
          text-shadow: 0 0 10px rgba(167, 139, 250, 0.3);
        }

        .simple-earth-container {
          position: relative;
          margin: 2rem 0;
        }

        .simple-earth {
          position: relative;
          width: 300px;
          height: 300px;
          margin: 0 auto;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .simple-earth.hovered {
          transform: scale(1.1);
        }

        .simple-earth.clicked {
          animation: clickExplosion 1.5s ease-out;
        }

        .simple-earth-core {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          position: relative;
          animation: earthRotate 20s linear infinite;
          border: 2px solid rgba(167, 139, 250, 0.3);
          overflow: hidden;
        }

        .simple-earth:hover .simple-earth-core {
          animation: earthRotate 20s linear infinite, pulseGlow 2s ease-in-out infinite;
        }

        .simple-atmosphere {
          position: absolute;
          top: -10px;
          left: -10px;
          right: -10px;
          bottom: -10px;
          border-radius: 50%;
          background: radial-gradient(circle, transparent 70%, rgba(167, 139, 250, 0.2) 100%);
          pointer-events: none;
        }

        .simple-orbit-ring {
          position: absolute;
          border: 1px solid rgba(167, 139, 250, 0.2);
          border-radius: 50%;
          animation: orbitRotate 30s linear infinite;
        }

        .simple-orbit-ring.ring-1 {
          width: 380px;
          height: 380px;
          top: -40px;
          left: -40px;
          animation-duration: 25s;
        }

        .simple-orbit-ring.ring-2 {
          width: 460px;
          height: 460px;
          top: -80px;
          left: -80px;
          animation-duration: 35s;
          animation-direction: reverse;
        }

        .simple-orbit-ring.ring-3 {
          width: 540px;
          height: 540px;
          top: -120px;
          left: -120px;
          animation-duration: 45s;
        }

        .simple-particles {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .simple-particle {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: particleOrbit 8s linear infinite;
          animation-delay: var(--delay);
        }

        .simple-particle:nth-child(4n+1) {
          background: radial-gradient(circle, #fbbf24, #f59e0b);
          box-shadow: 0 0 10px #fbbf24;
        }

        .simple-particle:nth-child(4n+2) {
          background: radial-gradient(circle, #a78bfa, #8b5cf6);
          box-shadow: 0 0 10px #a78bfa;
        }

        .simple-particle:nth-child(4n+3) {
          background: radial-gradient(circle, #34d399, #10b981);
          box-shadow: 0 0 10px #34d399;
        }

        .simple-particle:nth-child(4n) {
          background: radial-gradient(circle, #f472b6, #ec4899);
          box-shadow: 0 0 10px #f472b6;
        }

        .simple-interaction-hint {
          margin-top: 2rem;
          color: #fbbf24;
          font-size: 1.1rem;
          text-shadow: 0 0 10px rgba(251, 191, 36, 0.5);
        }

        .simple-arrow {
          font-size: 2rem;
          animation: bounce 2s ease-in-out infinite;
          margin-top: 0.5rem;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .simple-features {
          display: flex;
          justify-content: center;
          gap: 3rem;
          margin-top: 3rem;
        }

        .simple-feature {
          text-align: center;
          color: #a78bfa;
        }

        .simple-feature span {
          display: block;
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .simple-feature p {
          font-size: 0.9rem;
          margin: 0;
          text-shadow: 0 0 5px rgba(167, 139, 250, 0.3);
        }

        .simple-game-modes {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin: 3rem 0;
        }

        .simple-mode-button {
          background: rgba(167, 139, 250, 0.1);
          border: 2px solid rgba(167, 139, 250, 0.3);
          border-radius: 1rem;
          padding: 1.5rem 2rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
          min-width: 160px;
          backdrop-filter: blur(10px);
        }

        .simple-mode-button:hover {
          background: rgba(167, 139, 250, 0.2);
          border-color: rgba(167, 139, 250, 0.6);
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(167, 139, 250, 0.3);
        }

        .simple-mode-button.collection-mode:hover {
          background: rgba(34, 197, 94, 0.2);
          border-color: rgba(34, 197, 94, 0.6);
          box-shadow: 0 10px 25px rgba(34, 197, 94, 0.3);
        }

        .simple-mode-button.random-mode:hover {
          background: rgba(251, 191, 36, 0.2);
          border-color: rgba(251, 191, 36, 0.6);
          box-shadow: 0 10px 25px rgba(251, 191, 36, 0.3);
        }

        .mode-icon {
          display: block;
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }

        .mode-title {
          display: block;
          font-size: 1.1rem;
          font-weight: bold;
          color: #a78bfa;
          margin-bottom: 0.3rem;
          text-shadow: 0 0 10px rgba(167, 139, 250, 0.5);
        }

        .collection-mode:hover .mode-title {
          color: #22c55e;
          text-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
        }

        .random-mode:hover .mode-title {
          color: #fbbf24;
          text-shadow: 0 0 10px rgba(251, 191, 36, 0.5);
        }

        .mode-desc {
          display: block;
          font-size: 0.9rem;
          color: rgba(167, 139, 250, 0.8);
          text-shadow: 0 0 5px rgba(167, 139, 250, 0.3);
        }

        .collection-mode:hover .mode-desc {
          color: rgba(34, 197, 94, 0.8);
          text-shadow: 0 0 5px rgba(34, 197, 94, 0.3);
        }

        .random-mode:hover .mode-desc {
          color: rgba(251, 191, 36, 0.8);
          text-shadow: 0 0 5px rgba(251, 191, 36, 0.3);
        }

        @media (max-width: 768px) {
          .simple-title h1 {
            font-size: 2rem;
          }
          
          .simple-earth {
            width: 250px;
            height: 250px;
          }
          
          .simple-features {
            gap: 2rem;
          }

          .simple-game-modes {
            flex-direction: column;
            align-items: center;
            gap: 1.5rem;
          }

          .simple-mode-button {
            min-width: 200px;
          }
        }
      `}</style>
    </div>
  );
};

export default SimpleEarth;