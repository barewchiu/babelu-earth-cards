import React, { useEffect, useRef, useState } from 'react';

interface EarthHomepageProps {
  onEnterGame: () => void;
}

const EarthHomepage: React.FC<EarthHomepageProps> = ({ onEnterGame }) => {
  const earthRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    // 创建星空粒子效果
    const createStars = () => {
      const starsContainer = document.getElementById('stars-container');
      if (!starsContainer) return;

      for (let i = 0; i < 200; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 4 + 's';
        star.style.animationDuration = (Math.random() * 3 + 2) + 's';
        starsContainer.appendChild(star);
      }
    };

    createStars();
  }, []);

  const handleEarthClick = () => {
    setIsClicked(true);
    // 延迟进入游戏，让动画播放完成
    setTimeout(() => {
      onEnterGame();
    }, 1500);
  };

  return (
    <div className="earth-homepage">
      {/* 宇宙背景 */}
      <div className="universe-background">
        {/* 星空粒子容器 */}
        <div id="stars-container" className="stars-container"></div>
        
        {/* 星云效果 */}
        <div className="nebula nebula-1"></div>
        <div className="nebula nebula-2"></div>
        <div className="nebula nebula-3"></div>
      </div>

      {/* 主要内容 */}
      <div className="homepage-content">
        {/* 游戏标题 */}
        <div className="game-title">
          <h1 className="title-main">🔮 贝贝鲁地球百科卡片 ✨</h1>
          <p className="title-subtitle">探索东方传说的神秘世界</p>
        </div>

        {/* 3D地球容器 */}
        <div className="earth-container">
          <div 
            ref={earthRef}
            className={`earth-3d ${isHovered ? 'hovered' : ''} ${isClicked ? 'clicked' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleEarthClick}
          >
            {/* 地球核心 */}
            <div className="earth-core">
              <div className="earth-surface">
                {/* 大陆轮廓 */}
                <div className="continent continent-1"></div>
                <div className="continent continent-2"></div>
                <div className="continent continent-3"></div>
                <div className="continent continent-4"></div>
                <div className="continent continent-5"></div>
              </div>
              
              {/* 地球光环 */}
              <div className="earth-ring ring-1"></div>
              <div className="earth-ring ring-2"></div>
              <div className="earth-ring ring-3"></div>
            </div>

            {/* 魔法粒子轨道 */}
            <div className="magic-particles">
              {[...Array(12)].map((_, i) => (
                <div 
                  key={i} 
                  className="particle"
                  style={{
                    '--delay': `${i * 0.5}s`,
                    '--rotation': `${i * 30}deg`
                  } as React.CSSProperties}
                ></div>
              ))}
            </div>
          </div>

          {/* 交互提示 */}
          <div className="interaction-hint">
            <p>🌟 点击地球开始探索 🌟</p>
            <div className="hint-arrow">↑</div>
          </div>
        </div>

        {/* 特色介绍 */}
        <div className="features-preview">
          <div className="feature-item">
            <span className="feature-icon">🎴</span>
            <span className="feature-text">收集卡牌</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🗺️</span>
            <span className="feature-text">探索世界</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📚</span>
            <span className="feature-text">学习知识</span>
          </div>
        </div>
      </div>

      {/* 样式定义 */}
      <style>{`
        .earth-homepage {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          background: var(--gradient-starry);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .universe-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .stars-container {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .star {
          position: absolute;
          width: 2px;
          height: 2px;
          background: white;
          border-radius: 50%;
          animation: starTwinkle 3s ease-in-out infinite;
        }

        .star:nth-child(3n) {
          background: var(--magic-gold);
          width: 1px;
          height: 1px;
        }

        .star:nth-child(5n) {
          background: var(--magic-crystal);
          width: 3px;
          height: 3px;
        }

        .nebula {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.3;
          animation: nebulaFloat 20s ease-in-out infinite;
        }

        .nebula-1 {
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, var(--magic-crystal) 0%, transparent 70%);
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }

        .nebula-2 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, var(--magic-gold) 0%, transparent 70%);
          top: 60%;
          right: 15%;
          animation-delay: -7s;
        }

        .nebula-3 {
          width: 250px;
          height: 250px;
          background: radial-gradient(circle, var(--mystical-purple) 0%, transparent 70%);
          bottom: 30%;
          left: 20%;
          animation-delay: -14s;
        }

        @keyframes nebulaFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.1); }
          66% { transform: translate(-20px, 30px) scale(0.9); }
        }

        .homepage-content {
          position: relative;
          z-index: 10;
          text-align: center;
          color: white;
          max-width: 800px;
          padding: var(--space-8);
        }

        .game-title {
          margin-bottom: var(--space-16);
          animation: titleFadeIn 2s ease-out;
        }

        .title-main {
          font-size: clamp(2rem, 5vw, 4rem);
          font-weight: var(--font-bold);
          margin: 0 0 var(--space-4) 0;
          background: var(--gradient-magic);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 0 30px rgba(167, 139, 250, 0.5);
          animation: titleGlow 3s ease-in-out infinite;
        }

        .title-subtitle {
          font-size: clamp(1rem, 2.5vw, 1.5rem);
          margin: 0;
          color: var(--magic-moonlight);
          opacity: 0.9;
        }

        @keyframes titleFadeIn {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes titleGlow {
          0%, 100% { text-shadow: 0 0 30px rgba(167, 139, 250, 0.5); }
          50% { text-shadow: 0 0 50px rgba(167, 139, 250, 0.8), 0 0 70px rgba(251, 191, 36, 0.3); }
        }

        .earth-container {
          position: relative;
          margin: var(--space-16) 0;
          animation: earthAppear 3s ease-out 0.5s both;
        }

        @keyframes earthAppear {
          0% { opacity: 0; transform: scale(0.5) translateY(100px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }

        .earth-3d {
          position: relative;
          width: 300px;
          height: 300px;
          margin: 0 auto;
          cursor: pointer;
          transition: var(--transition-mystical);
          animation: earthFloat 6s ease-in-out infinite;
        }

        @keyframes earthFloat {
          0%, 100% { transform: translateY(0px) rotateY(0deg); }
          50% { transform: translateY(-20px) rotateY(180deg); }
        }

        .earth-3d.hovered {
          transform: scale(1.1) translateY(-10px);
          filter: brightness(1.2);
        }

        .earth-3d.clicked {
          animation: earthExplode 1.5s ease-out forwards;
        }

        @keyframes earthExplode {
          0% { transform: scale(1.1); }
          50% { transform: scale(1.3); filter: brightness(2) saturate(2); }
          100% { transform: scale(20); opacity: 0; }
        }

        .earth-core {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: 
            radial-gradient(circle at 30% 30%, #4ade80 0%, #22c55e 30%, #16a34a  60%, #15803d 100%),
            radial-gradient(circle at 70% 70%, #3b82f6 0%, #1d4ed8 50%, #1e40af 100%);
          box-shadow: 
            inset 0 0 50px rgba(0, 0, 0, 0.3),
            0 0 50px rgba(167, 139, 250, 0.4),
            0 0 100px rgba(251, 191, 36, 0.2);
          animation: earthRotate 20s linear infinite;
          overflow: hidden;
        }

        @keyframes earthRotate {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }

        .earth-surface {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          overflow: hidden;
        }

        .continent {
          position: absolute;
          background: #22c55e;
          border-radius: 50%;
          opacity: 0.8;
        }

        .continent-1 {
          width: 60px;
          height: 40px;
          top: 30%;
          left: 20%;
          border-radius: 60% 40% 70% 30%;
        }

        .continent-2 {
          width: 50px;
          height: 60px;
          top: 20%;
          right: 25%;
          border-radius: 40% 60% 30% 70%;
        }

        .continent-3 {
          width: 40px;
          height: 30px;
          bottom: 35%;
          left: 30%;
          border-radius: 70% 30% 60% 40%;
        }

        .continent-4 {
          width: 35px;
          height: 45px;
          bottom: 20%;
          right: 20%;
          border-radius: 50% 50% 80% 20%;
        }

        .continent-5 {
          width: 25px;
          height: 25px;
          top: 50%;
          left: 50%;
          border-radius: 50%;
        }

        .earth-ring {
          position: absolute;
          border: 2px solid;
          border-radius: 50%;
          opacity: 0.6;
          animation: ringPulse 4s ease-in-out infinite;
        }

        .ring-1 {
          width: 320px;
          height: 320px;
          top: -10px;
          left: -10px;
          border-color: var(--magic-crystal);
          animation-delay: 0s;
        }

        .ring-2 {
          width: 340px;
          height: 340px;
          top: -20px;
          left: -20px;
          border-color: var(--magic-gold);
          animation-delay: -1.3s;
        }

        .ring-3 {
          width: 360px;
          height: 360px;
          top: -30px;
          left: -30px;
          border-color: var(--magic-silver);
          animation-delay: -2.6s;
        }

        @keyframes ringPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }

        .magic-particles {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }

        .particle {
          position: absolute;
          width: 6px;
          height: 6px;
          background: var(--magic-gold);
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform-origin: 0 0;
          animation: particleOrbit 8s linear infinite;
          animation-delay: var(--delay);
          box-shadow: 0 0 10px currentColor;
        }

        .particle:nth-child(even) {
          background: var(--magic-crystal);
        }

        .particle:nth-child(3n) {
          background: var(--magic-silver);
          width: 4px;
          height: 4px;
        }

        @keyframes particleOrbit {
          0% { transform: rotate(var(--rotation)) translateX(180px) rotate(calc(-1 * var(--rotation))); }
          100% { transform: rotate(calc(var(--rotation) + 360deg)) translateX(180px) rotate(calc(-1 * (var(--rotation) + 360deg))); }
        }

        .interaction-hint {
          margin-top: var(--space-8);
          animation: hintPulse 2s ease-in-out infinite;
        }

        .interaction-hint p {
          margin: 0 0 var(--space-2) 0;
          font-size: var(--text-lg);
          color: var(--magic-starlight);
          text-shadow: 0 0 10px rgba(251, 191, 36, 0.5);
        }

        .hint-arrow {
          font-size: var(--text-2xl);
          color: var(--magic-gold);
          animation: arrowBounce 1s ease-in-out infinite;
        }

        @keyframes hintPulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }

        @keyframes arrowBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .features-preview {
          display: flex;
          justify-content: center;
          gap: var(--space-8);
          margin-top: var(--space-16);
          animation: featuresSlideIn 2s ease-out 1s both;
        }

        @keyframes featuresSlideIn {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .feature-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-4);
          background: rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-xl);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: var(--transition-normal);
        }

        .feature-item:hover {
          transform: translateY(-5px);
          background: rgba(255, 255, 255, 0.15);
          box-shadow: 0 10px 30px rgba(167, 139, 250, 0.3);
        }

        .feature-icon {
          font-size: var(--text-2xl);
        }

        .feature-text {
          font-size: var(--text-sm);
          color: var(--magic-moonlight);
          font-weight: var(--font-medium);
        }

        /* 响应式设计 */
        @media (max-width: 768px) {
          .earth-3d {
            width: 250px;
            height: 250px;
          }

          .features-preview {
            flex-direction: column;
            gap: var(--space-4);
          }

          .feature-item {
            flex-direction: row;
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .earth-3d {
            width: 200px;
            height: 200px;
          }

          .homepage-content {
            padding: var(--space-4);
          }
        }
      `}</style>
    </div>
  );
};

export default EarthHomepage;