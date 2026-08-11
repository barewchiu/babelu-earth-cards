import React, { useEffect, useRef, useState } from 'react';

interface RealisticEarthProps {
  onEnterGame: () => void;
}

const RealisticEarth: React.FC<RealisticEarthProps> = ({ onEnterGame }) => {
  const earthRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    // 预加载地球贴图
    const loadImages = async () => {
      const imageUrls = [
        '/earth-textures/earth%20albedo.jpg',
        '/earth-textures/clouds%20earth.png',
        '/earth-textures/earth%20bump.jpg',
        '/earth-textures/earth%20night_lights_modified.png'
      ];

      const promises = imageUrls.map(url => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = reject;
          img.src = url;
        });
      });

      try {
        await Promise.all(promises);
        setImagesLoaded(true);
      } catch (error) {
        console.log('Some earth textures failed to load, using fallback');
        setImagesLoaded(true);
      }
    };

    loadImages();

    // 创建星空粒子效果
    const createStars = () => {
      const starsContainer = document.getElementById('realistic-stars-container');
      if (!starsContainer) return;

      // 清除现有星星
      starsContainer.innerHTML = '';

      for (let i = 0; i < 300; i++) {
        const star = document.createElement('div');
        star.className = 'realistic-star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 4 + 's';
        star.style.animationDuration = (Math.random() * 3 + 2) + 's';
        
        // 不同类型的星星
        const starType = Math.random();
        if (starType < 0.7) {
          star.classList.add('star-white');
        } else if (starType < 0.9) {
          star.classList.add('star-blue');
        } else {
          star.classList.add('star-gold');
        }
        
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
    }, 2000);
  };

  return (
    <div className="realistic-earth-homepage">
      {/* 深空背景 */}
      <div className="deep-space-background">
        {/* 星空粒子容器 */}
        <div id="realistic-stars-container" className="realistic-stars-container"></div>
        
        {/* 远景星系 */}
        <div className="distant-galaxy galaxy-1"></div>
        <div className="distant-galaxy galaxy-2"></div>
        <div className="distant-galaxy galaxy-3"></div>
        
        {/* 太空尘埃 */}
        <div className="space-dust"></div>
      </div>

      {/* 主要内容 */}
      <div className="realistic-homepage-content">
        {/* 游戏标题 */}
        <div className="realistic-game-title">
          <h1 className="realistic-title-main">🔮 贝贝鲁地球百科卡片 ✨</h1>
          <p className="realistic-title-subtitle">🌌 探索东方传说的神秘世界 🌌</p>
        </div>

        {/* 真实3D地球容器 */}
        <div className="realistic-earth-container">
          <div 
            ref={earthRef}
            className={`realistic-earth-3d ${isHovered ? 'hovered' : ''} ${isClicked ? 'clicked' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleEarthClick}
          >
            {/* 地球核心 - 使用真实贴图 */}
            <div className="realistic-earth-core">
              {/* 地球表面 */}
              <div 
                className="realistic-earth-surface"
                style={{
                  backgroundImage: imagesLoaded 
                    ? 'url(/earth-textures/earth%20albedo.jpg)' 
                    : 'radial-gradient(circle at 30% 30%, #4ade80 0%, #22c55e 30%, #16a34a 60%, #15803d 100%)'
                }}
              >
                {/* 凹凸效果层 */}
                <div 
                  className="earth-bump-layer"
                  style={{
                    backgroundImage: imagesLoaded ? 'url(/earth-textures/earth%20bump.jpg)' : 'none'
                  }}
                ></div>
                
                {/* 夜晚城市灯光 */}
                <div 
                  className="earth-night-lights"
                  style={{
                    backgroundImage: imagesLoaded ? 'url(/earth-textures/earth%20night_lights_modified.png)' : 'none'
                  }}
                ></div>
              </div>

              {/* 云层 */}
              <div 
                className="realistic-earth-clouds"
                style={{
                  backgroundImage: imagesLoaded ? 'url(/earth-textures/clouds%20earth.png)' : 'none'
                }}
              ></div>

              {/* 大气层光晕 */}
              <div className="earth-atmosphere"></div>
            </div>

            {/* 轨道环 */}
            <div className="realistic-orbit-ring ring-1"></div>
            <div className="realistic-orbit-ring ring-2"></div>
            <div className="realistic-orbit-ring ring-3"></div>

            {/* 魔法粒子轨道 */}
            <div className="realistic-magic-particles">
              {[...Array(16)].map((_, i) => (
                <div 
                  key={i} 
                  className="realistic-particle"
                  style={{
                    '--delay': `${i * 0.4}s`,
                    '--rotation': `${i * 22.5}deg`,
                    '--distance': `${200 + (i % 3) * 20}px`
                  } as React.CSSProperties}
                ></div>
              ))}
            </div>
          </div>

          {/* 交互提示 */}
          <div className="realistic-interaction-hint">
            <p>✨ 点击地球开始神秘之旅 ✨</p>
            <div className="realistic-hint-arrow">↑</div>
          </div>
        </div>

        {/* 特色介绍 */}
        <div className="realistic-features-preview">
          <div className="realistic-feature-item">
            <span className="realistic-feature-icon">🎴</span>
            <span className="realistic-feature-text">收集传说卡牌</span>
          </div>
          <div className="realistic-feature-item">
            <span className="realistic-feature-icon">🗺️</span>
            <span className="realistic-feature-text">探索神秘世界</span>
          </div>
          <div className="realistic-feature-item">
            <span className="realistic-feature-icon">📚</span>
            <span className="realistic-feature-text">学习东方文化</span>
          </div>
        </div>
      </div>

      {/* 样式定义 */}
      <style>{`
        .realistic-earth-homepage {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          background: radial-gradient(ellipse at center, #1a1b3a 0%, #0f0f23 70%, #000000 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .deep-space-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .realistic-stars-container {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .realistic-star {
          position: absolute;
          border-radius: 50%;
          animation: realisticStarTwinkle 3s ease-in-out infinite;
        }

        .star-white {
          width: 2px;
          height: 2px;
          background: rgba(255, 255, 255, 0.8);
          box-shadow: 0 0 6px rgba(255, 255, 255, 0.6);
        }

        .star-blue {
          width: 1px;
          height: 1px;
          background: rgba(167, 139, 250, 0.9);
          box-shadow: 0 0 4px rgba(167, 139, 250, 0.7);
        }

        .star-gold {
          width: 3px;
          height: 3px;
          background: rgba(251, 191, 36, 0.8);
          box-shadow: 0 0 8px rgba(251, 191, 36, 0.6);
        }

        @keyframes realisticStarTwinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        .distant-galaxy {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.2;
          animation: galaxyRotate 60s linear infinite;
        }

        .galaxy-1 {
          width: 400px;
          height: 200px;
          background: radial-gradient(ellipse, rgba(167, 139, 250, 0.3) 0%, transparent 70%);
          top: 10%;
          left: 5%;
          animation-delay: 0s;
        }

        .galaxy-2 {
          width: 300px;
          height: 150px;
          background: radial-gradient(ellipse, rgba(251, 191, 36, 0.2) 0%, transparent 70%);
          bottom: 15%;
          right: 10%;
          animation-delay: -20s;
        }

        .galaxy-3 {
          width: 250px;
          height: 250px;
          background: radial-gradient(circle, rgba(76, 29, 149, 0.3) 0%, transparent 70%);
          top: 50%;
          right: 5%;
          animation-delay: -40s;
        }

        @keyframes galaxyRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .space-dust {
          position: absolute;
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.1), transparent),
            radial-gradient(1px 1px at 40% 70%, rgba(167, 139, 250, 0.1), transparent),
            radial-gradient(1px 1px at 90% 40%, rgba(251, 191, 36, 0.1), transparent);
          background-repeat: repeat;
          background-size: 300px 200px;
          animation: dustDrift 120s linear infinite;
        }

        @keyframes dustDrift {
          0% { transform: translateX(0) translateY(0); }
          100% { transform: translateX(-300px) translateY(-200px); }
        }

        .realistic-homepage-content {
          position: relative;
          z-index: 10;
          text-align: center;
          color: white;
          max-width: 900px;
          padding: var(--space-8);
        }

        .realistic-game-title {
          margin-bottom: var(--space-20);
          animation: realisticTitleFadeIn 3s ease-out;
        }

        .realistic-title-main {
          font-size: clamp(2.5rem, 6vw, 5rem);
          font-weight: var(--font-bold);
          margin: 0 0 var(--space-4) 0;
          background: linear-gradient(45deg, #a78bfa 0%, #fbbf24 50%, #a78bfa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 0 40px rgba(167, 139, 250, 0.6);
          animation: realisticTitleGlow 4s ease-in-out infinite;
        }

        .realistic-title-subtitle {
          font-size: clamp(1.2rem, 3vw, 2rem);
          margin: 0;
          color: var(--magic-moonlight);
          opacity: 0.9;
          text-shadow: 0 0 20px rgba(221, 214, 254, 0.5);
        }

        @keyframes realisticTitleFadeIn {
          0% { opacity: 0; transform: translateY(50px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes realisticTitleGlow {
          0%, 100% { text-shadow: 0 0 40px rgba(167, 139, 250, 0.6); }
          50% { text-shadow: 0 0 60px rgba(167, 139, 250, 0.9), 0 0 80px rgba(251, 191, 36, 0.4); }
        }

        .realistic-earth-container {
          position: relative;
          margin: var(--space-20) 0;
          animation: realisticEarthAppear 4s ease-out 1s both;
        }

        @keyframes realisticEarthAppear {
          0% { opacity: 0; transform: scale(0.3) translateY(200px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }

        .realistic-earth-3d {
          position: relative;
          width: 350px;
          height: 350px;
          margin: 0 auto;
          cursor: pointer;
          transition: var(--transition-mystical);
          animation: realisticEarthFloat 8s ease-in-out infinite;
          perspective: 1000px;
        }

        @keyframes realisticEarthFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }

        .realistic-earth-3d.hovered {
          transform: scale(1.15) translateY(-20px);
          filter: brightness(1.3) saturate(1.2);
        }

        .realistic-earth-3d.clicked {
          animation: realisticEarthExplode 2s ease-out forwards;
        }

        @keyframes realisticEarthExplode {
          0% { transform: scale(1.15); }
          30% { transform: scale(1.4); filter: brightness(3) saturate(3); }
          100% { transform: scale(25); opacity: 0; filter: brightness(5) saturate(5); }
        }

        .realistic-earth-core {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          overflow: hidden;
          box-shadow: 
            inset 0 0 80px rgba(0, 0, 0, 0.4),
            0 0 80px rgba(167, 139, 250, 0.3),
            0 0 120px rgba(251, 191, 36, 0.2);
          animation: realisticEarthRotate 30s linear infinite;
        }

        @keyframes realisticEarthRotate {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }

        .realistic-earth-surface {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }

        .earth-bump-layer {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          mix-blend-mode: overlay;
          opacity: 0.3;
        }

        .earth-night-lights {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          mix-blend-mode: screen;
          opacity: 0.6;
          animation: nightLightsGlow 6s ease-in-out infinite;
        }

        @keyframes nightLightsGlow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }

        .realistic-earth-clouds {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          opacity: 0.4;
          animation: cloudsRotate 40s linear infinite;
        }

        @keyframes cloudsRotate {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(-360deg); }
        }

        .earth-atmosphere {
          position: absolute;
          width: 110%;
          height: 110%;
          top: -5%;
          left: -5%;
          border-radius: 50%;
          background: radial-gradient(circle, transparent 45%, rgba(135, 206, 235, 0.2) 50%, rgba(135, 206, 235, 0.1) 55%, transparent 60%);
          animation: atmosphereGlow 4s ease-in-out infinite;
        }

        @keyframes atmosphereGlow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        .realistic-orbit-ring {
          position: absolute;
          border: 1px solid;
          border-radius: 50%;
          opacity: 0.4;
          animation: realisticRingPulse 6s ease-in-out infinite;
        }

        .ring-1 {
          width: 380px;
          height: 380px;
          top: -15px;
          left: -15px;
          border-color: var(--magic-crystal);
          animation-delay: 0s;
        }

        .ring-2 {
          width: 420px;
          height: 420px;
          top: -35px;
          left: -35px;
          border-color: var(--magic-gold);
          animation-delay: -2s;
        }

        .ring-3 {
          width: 460px;
          height: 460px;
          top: -55px;
          left: -55px;
          border-color: var(--magic-silver);
          animation-delay: -4s;
        }

        @keyframes realisticRingPulse {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.02); }
        }

        .realistic-magic-particles {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }

        .realistic-particle {
          position: absolute;
          width: 8px;
          height: 8px;
          background: var(--magic-gold);
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform-origin: 0 0;
          animation: realisticParticleOrbit 12s linear infinite;
          animation-delay: var(--delay);
          box-shadow: 0 0 15px currentColor;
        }

        .realistic-particle:nth-child(even) {
          background: var(--magic-crystal);
        }

        .realistic-particle:nth-child(3n) {
          background: var(--magic-silver);
          width: 6px;
          height: 6px;
        }

        .realistic-particle:nth-child(4n) {
          background: rgba(255, 255, 255, 0.8);
          width: 4px;
          height: 4px;
        }

        @keyframes realisticParticleOrbit {
          0% { transform: rotate(var(--rotation)) translateX(var(--distance)) rotate(calc(-1 * var(--rotation))); }
          100% { transform: rotate(calc(var(--rotation) + 360deg)) translateX(var(--distance)) rotate(calc(-1 * (var(--rotation) + 360deg))); }
        }

        .realistic-interaction-hint {
          margin-top: var(--space-12);
          animation: realisticHintPulse 3s ease-in-out infinite;
        }

        .realistic-interaction-hint p {
          margin: 0 0 var(--space-3) 0;
          font-size: var(--text-xl);
          color: var(--magic-starlight);
          text-shadow: 0 0 15px rgba(251, 191, 36, 0.6);
          font-weight: var(--font-semibold);
        }

        .realistic-hint-arrow {
          font-size: var(--text-3xl);
          color: var(--magic-gold);
          animation: realisticArrowBounce 1.5s ease-in-out infinite;
        }

        @keyframes realisticHintPulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }

        @keyframes realisticArrowBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }

        .realistic-features-preview {
          display: flex;
          justify-content: center;
          gap: var(--space-10);
          margin-top: var(--space-20);
          animation: realisticFeaturesSlideIn 3s ease-out 2s both;
        }

        @keyframes realisticFeaturesSlideIn {
          0% { opacity: 0; transform: translateY(50px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .realistic-feature-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-6);
          background: rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-2xl);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          transition: var(--transition-mystical);
          min-width: 120px;
        }

        .realistic-feature-item:hover {
          transform: translateY(-8px);
          background: rgba(255, 255, 255, 0.12);
          box-shadow: 0 15px 40px rgba(167, 139, 250, 0.4);
        }

        .realistic-feature-icon {
          font-size: var(--text-3xl);
          filter: drop-shadow(0 0 10px rgba(251, 191, 36, 0.5));
        }

        .realistic-feature-text {
          font-size: var(--text-base);
          color: var(--magic-moonlight);
          font-weight: var(--font-semibold);
          text-align: center;
          text-shadow: 0 0 10px rgba(221, 214, 254, 0.3);
        }

        /* 响应式设计 */
        @media (max-width: 768px) {
          .realistic-earth-3d {
            width: 280px;
            height: 280px;
          }

          .realistic-features-preview {
            flex-direction: column;
            gap: var(--space-6);
          }

          .realistic-feature-item {
            flex-direction: row;
            justify-content: center;
            min-width: auto;
            width: 100%;
            max-width: 300px;
            margin: 0 auto;
          }
        }

        @media (max-width: 480px) {
          .realistic-earth-3d {
            width: 220px;
            height: 220px;
          }

          .realistic-homepage-content {
            padding: var(--space-4);
          }

          .realistic-title-main {
            font-size: 2rem;
          }

          .realistic-title-subtitle {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default RealisticEarth;