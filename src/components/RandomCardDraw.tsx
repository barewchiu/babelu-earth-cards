import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { getEarthImageUrl, getRegionImageUrl } from '../lib/supabase';
import ImageUploader from './ImageUploader';

// 地区映射配置 - 地图区域代码 -> 卡牌数据中的region字段
const REGION_MAPPING = {
  'A.N': '非洲北',
  'A.E': '非洲东',
  'A.S': '非洲南',
  'A.W': '非洲西',
  'E.A': '东亚',
  'S.AS': '东南亚',
  'S.A.I': '南亚印度',
  'W.A': '西亚',
  'C.A': '中亚',
  'FE.A': '亚洲大陆极东地区',
  'EA.N': '欧亚大陆北部',
  'N.E': '欧洲北部',
  'E.E': '欧洲东部',
  'W.E': '欧洲西部',
  'NA.E': '北美东部',
  'NA.W': '北美西部',
  'C.CA': '加勒比中美',
  'SA': '南美洲',
  'OC': '澳大利亚',
  'S.S.I': '太平洋岛'
};

// 地区显示名称（与实际文件名完全匹配）
const REGION_DISPLAY_NAMES = {
  'A.N': '非洲北部',
  'A.E': '非洲东部', 
  'A.S': '非洲南部',
  'A.W': '非洲西部',
  'E.A': '东亚',
  'S.AS': '东南亚',
  'S.A.I': '南亚.印度',
  'W.A': '西亚',
  'C.A': '中亚',
  'FE.A': '亚洲大陆极东地区',
  'EA.N': '欧亚大陆北部',
  'N.E': '欧洲北部',
  'E.E': '欧洲东部',
  'W.E': '欧洲西部',
  'NA.E': '北美东部',
  'NA.W': '北美西部',
  'C.CA': '加勒比.中美',
  'SA': '南美洲',
  'OC': '澳大利亚',
  'S.S.I': '南太平洋诸岛'
};

interface RandomCardDrawProps {
  cards: Card[];
  onBackToHome: () => void;
}

interface PlayerCollection {
  [cardId: string]: Card;
}

const RandomCardDraw: React.FC<RandomCardDrawProps> = ({ cards, onBackToHome }) => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [drawnCard, setDrawnCard] = useState<Card | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [showCollectButton, setShowCollectButton] = useState(false);
  const [playerCollection, setPlayerCollection] = useState<PlayerCollection>({});
  const [showCollectionMessage, setShowCollectionMessage] = useState(false);
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [useSupabaseImages, setUseSupabaseImages] = useState(false); // 默认使用本地图片

  // 从localStorage加载玩家收藏
  useEffect(() => {
    const savedCollection = localStorage.getItem('babelu-card-collection');
    if (savedCollection) {
      try {
        setPlayerCollection(JSON.parse(savedCollection));
      } catch (error) {
        console.error('Failed to load player collection:', error);
      }
    }
  }, []);

  // 保存玩家收藏到localStorage
  const saveCollection = (collection: PlayerCollection) => {
    localStorage.setItem('babelu-card-collection', JSON.stringify(collection));
    setPlayerCollection(collection);
  };

  // 获取所有可用的地区代码
  const availableRegions = Object.keys(REGION_MAPPING);

  // 随机抽取卡牌
  const handleRandomDraw = async () => {
    if (isDrawing) return;

    setIsDrawing(true);
    setShowCollectButton(false);
    setDrawnCard(null);
    setShowCollectionMessage(false);

    // 首先随机选择一张卡牌
    const randomCard = cards[Math.floor(Math.random() * cards.length)];
    
    // 根据卡牌的地区找到对应的地图区域代码
    let selectedRegionCode = null;
    for (const [regionCode, regionName] of Object.entries(REGION_MAPPING)) {
      if (regionName === randomCard.region) {
        selectedRegionCode = regionCode;
        break;
      }
    }
    
    // 如果找不到匹配的地区代码，使用默认的一个
    if (!selectedRegionCode) {
      selectedRegionCode = 'E.A'; // 默认使用东亚
      console.log(`未找到地区 "${randomCard.region}" 对应的地图区域代码，使用默认区域`);
    }
    
    setSelectedRegion(selectedRegionCode);

    // 开始闪烁动画
    setIsBlinking(true);

    // 1.5秒后停止闪烁并显示卡牌
    setTimeout(() => {
      setIsBlinking(false);
      setDrawnCard(randomCard);
      setShowCollectButton(true);
      setIsDrawing(false);
    }, 1500);
  };

  // 收集卡牌到玩家库
  const handleCollectCard = () => {
    if (!drawnCard) return;

    const newCollection = { ...playerCollection };
    
    // 添加或覆盖卡牌（去重机制）
    newCollection[drawnCard.id] = drawnCard;
    saveCollection(newCollection);

    // 显示收集消息
    setShowCollectionMessage(true);
    setShowCollectButton(false);

    // 3秒后隐藏消息
    setTimeout(() => {
      setShowCollectionMessage(false);
    }, 3000);
  };

  // 重置抽卡状态
  const handleReset = () => {
    setSelectedRegion(null);
    setDrawnCard(null);
    setIsDrawing(false);
    setIsBlinking(false);
    setShowCollectButton(false);
    setShowCollectionMessage(false);
  };

  return (
    <div 
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* 魔法背景效果 */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 20%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(255, 206, 84, 0.2) 0%, transparent 50%)
          `,
          animation: 'magicFloat 8s ease-in-out infinite'
        }}
      />

      {/* 返回按钮 */}
      <div 
        style={{
          position: 'fixed',
          top: 'var(--space-4)',
          left: 'var(--space-4)',
          zIndex: 1000
        }}
      >
        <button
          onClick={onBackToHome}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-3) var(--space-4)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-semibold)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            backdropFilter: 'blur(10px)',
            transition: 'all var(--transition-fast)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <span>🌍</span>
          <span>返回地球</span>
        </button>
      </div>

      {/* 收藏统计和工具按钮 */}
      <div 
        style={{
          position: 'fixed',
          top: 'var(--space-4)',
          right: 'var(--space-4)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-2)'
        }}
      >
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-3) var(--space-4)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-semibold)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <span>📚</span>
          <span>收藏: {Object.keys(playerCollection).length}/{cards.length}</span>
        </div>

        {/* 图片源切换按钮 */}
        <button
          onClick={() => setUseSupabaseImages(!useSupabaseImages)}
          style={{
            background: useSupabaseImages 
              ? 'rgba(34, 197, 94, 0.2)' 
              : 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-2) var(--space-3)',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--font-semibold)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-1)',
            backdropFilter: 'blur(10px)',
            transition: 'all var(--transition-fast)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = useSupabaseImages 
              ? 'rgba(34, 197, 94, 0.3)' 
              : 'rgba(255, 255, 255, 0.3)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = useSupabaseImages 
              ? 'rgba(34, 197, 94, 0.2)' 
              : 'rgba(255, 255, 255, 0.2)';
          }}
        >
          <span>{useSupabaseImages ? '☁️' : '💾'}</span>
          <span>{useSupabaseImages ? 'Supabase' : '本地'}</span>
        </button>

        {/* 上传工具按钮 */}
        <button
          onClick={() => setShowImageUploader(true)}
          style={{
            background: 'rgba(251, 191, 36, 0.2)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-2) var(--space-3)',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--font-semibold)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-1)',
            backdropFilter: 'blur(10px)',
            transition: 'all var(--transition-fast)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(251, 191, 36, 0.3)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(251, 191, 36, 0.2)';
          }}
        >
          <span>🚀</span>
          <span>上传工具</span>
        </button>
      </div>

      {/* 主要内容区域 */}
      <div 
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: 'var(--space-8)',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* 标题 */}
        <div 
          style={{
            textAlign: 'center',
            marginBottom: 'var(--space-8)',
            color: 'white'
          }}
        >
          <h1 
            style={{
              fontSize: 'var(--text-4xl)',
              fontWeight: 'var(--font-bold)',
              margin: '0 0 var(--space-4) 0',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            🎲 神秘卡牌抽取 ✨
          </h1>
          <p 
            style={{
              fontSize: 'var(--text-lg)',
              opacity: 0.9,
              margin: 0
            }}
          >
            点击按钮，让命运为你选择一张神秘卡牌！
          </p>
        </div>

        {/* 抽中的卡牌展示区域 */}
        {drawnCard && (
          <div 
            style={{
              marginBottom: 'var(--space-8)',
              animation: 'cardAppear 0.8s ease-out'
            }}
          >
            <div 
              style={{
                position: 'relative',
                width: '320px',
                height: '480px',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                transform: 'scale(1.1)',
                background: 'white'
              }}
            >
              <img 
                src={drawnCard.frontImage}
                alt={drawnCard.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/api/placeholder/320/480';
                }}
              />
              
              {/* 卡牌信息覆盖层 */}
              <div 
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
                  padding: 'var(--space-6) var(--space-4) var(--space-4) var(--space-4)',
                  color: 'white'
                }}
              >
                <h3 
                  style={{
                    fontSize: 'var(--text-xl)',
                    fontWeight: 'var(--font-bold)',
                    margin: '0 0 var(--space-2) 0'
                  }}
                >
                  {drawnCard.name}
                </h3>
                <div 
                  style={{
                    display: 'flex',
                    gap: 'var(--space-2)',
                    flexWrap: 'wrap'
                  }}
                >
                  <span 
                    style={{
                      background: 'rgba(255,255,255,0.2)',
                      padding: 'var(--space-1) var(--space-2)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--text-sm)',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    {drawnCard.region}
                  </span>
                  <span 
                    style={{
                      background: 'rgba(255,255,255,0.2)',
                      padding: 'var(--space-1) var(--space-2)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--text-sm)',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    {drawnCard.category}
                  </span>
                </div>
              </div>

              {/* 新卡牌标识 */}
              {!(drawnCard.id in playerCollection) && (
                <div 
                  style={{
                    position: 'absolute',
                    top: 'var(--space-4)',
                    right: 'var(--space-4)',
                    background: 'linear-gradient(45deg, #ff6b6b, #feca57)',
                    color: 'white',
                    padding: 'var(--space-2) var(--space-3)',
                    borderRadius: 'var(--radius-lg)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-bold)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                    animation: 'newCardPulse 2s ease-in-out infinite'
                  }}
                >
                  ✨ NEW
                </div>
              )}
            </div>
          </div>
        )}

        {/* 操作按钮区域 */}
        <div 
          style={{
            display: 'flex',
            gap: 'var(--space-4)',
            marginBottom: 'var(--space-8)',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}
        >
          {/* 随机抽取按钮 */}
          <button
            onClick={handleRandomDraw}
            disabled={isDrawing}
            style={{
              background: isDrawing 
                ? 'rgba(255,255,255,0.1)' 
                : 'linear-gradient(45deg, #667eea, #764ba2)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-4) var(--space-6)',
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-bold)',
              cursor: isDrawing ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
              transition: 'all var(--transition-fast)',
              opacity: isDrawing ? 0.6 : 1,
              transform: isDrawing ? 'scale(0.95)' : 'scale(1)'
            }}
            onMouseOver={(e) => {
              if (!isDrawing) {
                e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.3)';
              }
            }}
            onMouseOut={(e) => {
              if (!isDrawing) {
                e.currentTarget.style.transform = 'scale(1) translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
              }
            }}
          >
            <span style={{ fontSize: 'var(--text-2xl)' }}>
              {isDrawing ? '🎲' : '🎯'}
            </span>
            <span>{isDrawing ? '抽取中...' : '随机抽取'}</span>
          </button>

          {/* 收集按钮 */}
          {showCollectButton && (
            <button
              onClick={handleCollectCard}
              style={{
                background: 'linear-gradient(45deg, #48bb78, #38a169)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-4) var(--space-6)',
                fontSize: 'var(--text-lg)',
                fontWeight: 'var(--font-bold)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                transition: 'all var(--transition-fast)',
                animation: 'collectButtonAppear 0.5s ease-out'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1) translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
              }}
            >
              <span style={{ fontSize: 'var(--text-2xl)' }}>📚</span>
              <span>收集到卡牌库</span>
            </button>
          )}

          {/* 重新抽取按钮 */}
          {drawnCard && !showCollectButton && !isDrawing && (
            <button
              onClick={handleReset}
              style={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-4) var(--space-6)',
                fontSize: 'var(--text-lg)',
                fontWeight: 'var(--font-bold)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                backdropFilter: 'blur(10px)',
                transition: 'all var(--transition-fast)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span style={{ fontSize: 'var(--text-2xl)' }}>🔄</span>
              <span>重新抽取</span>
            </button>
          )}
        </div>

        {/* 收集成功消息 */}
        {showCollectionMessage && (
          <div 
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'linear-gradient(45deg, #48bb78, #38a169)',
              color: 'white',
              padding: 'var(--space-4) var(--space-6)',
              borderRadius: 'var(--radius-xl)',
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-bold)',
              boxShadow: '0 12px 24px rgba(0,0,0,0.3)',
              zIndex: 2000,
              animation: 'successMessage 3s ease-out'
            }}
          >
            ✨ 卡牌已收集到您的卡牌库！
          </div>
        )}

        {/* 世界地图区域 */}
        <div 
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '800px',
            transition: 'all var(--transition-normal)'
          }}
        >
          {/* 地球背景图 */}
          <div 
            style={{
              position: 'relative',
              width: '100%',
              paddingBottom: '50%', // 2:1 比例
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              boxShadow: '0 12px 24px rgba(0,0,0,0.2)'
            }}
          >
            <img 
              src={useSupabaseImages ? getEarthImageUrl() : "/maps/地球图片.png"}
              alt="世界地图"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              onLoad={() => console.log('地球图片加载成功')}
              onError={(e) => {
                console.error('地球图片加载失败，尝试备用方案');
                const target = e.target as HTMLImageElement;
                if (useSupabaseImages) {
                  // 如果Supabase图片失败，尝试本地图片
                  target.src = "/maps/地球图片.png";
                  setUseSupabaseImages(false);
                } else {
                  // 如果本地图片也失败，显示备用样式
                  target.style.background = 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
                  target.style.display = 'block';
                }
              }}
            />

            {/* 地区色块叠加层 */}
            {availableRegions.map((regionCode) => (
              <div
                key={regionCode}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: selectedRegion === regionCode && isBlinking ? 
                    (Math.floor(Date.now() / 250) % 2 === 0 ? 0.8 : 0.3) : 0,
                  transition: selectedRegion === regionCode ? 'none' : 'opacity 0.3s ease',
                  pointerEvents: 'none'
                }}
              >
                <img 
                  src={useSupabaseImages 
                    ? getRegionImageUrl(regionCode) 
                    : `/maps/色块-${REGION_DISPLAY_NAMES[regionCode as keyof typeof REGION_DISPLAY_NAMES]}(${regionCode}).png`
                  }
                  alt={`${REGION_DISPLAY_NAMES[regionCode as keyof typeof REGION_DISPLAY_NAMES]}区域`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  onLoad={() => console.log(`色块图片加载成功: ${regionCode}`)}
                  onError={(e) => {
                    console.error(`色块图片加载失败: ${regionCode}`);
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            ))}

            {/* 选中区域信息显示 */}
            {selectedRegion && (
              <div 
                style={{
                  position: 'absolute',
                  bottom: 'var(--space-4)',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(0,0,0,0.8)',
                  color: 'white',
                  padding: 'var(--space-3) var(--space-4)',
                  borderRadius: 'var(--radius-lg)',
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-bold)',
                  backdropFilter: 'blur(10px)',
                  animation: isBlinking ? 'regionPulse 0.5s ease-in-out infinite' : 'none'
                }}
              >
                🎯 {REGION_DISPLAY_NAMES[selectedRegion as keyof typeof REGION_DISPLAY_NAMES]}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 图片上传工具 */}
      {showImageUploader && (
        <>
          {/* 遮罩层 */}
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1999
            }}
            onClick={() => setShowImageUploader(false)}
          />
          
          {/* 上传工具组件 */}
          <ImageUploader 
            onUploadComplete={() => {
              setShowImageUploader(false);
              setUseSupabaseImages(true);
            }}
          />
        </>
      )}

      {/* 动画样式 */}
      <style>{`
        @keyframes magicFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(1deg); }
          66% { transform: translateY(5px) rotate(-1deg); }
        }
        
        @keyframes cardAppear {
          0% { 
            opacity: 0; 
            transform: scale(0.8) translateY(50px) rotateY(180deg); 
          }
          100% { 
            opacity: 1; 
            transform: scale(1.1) translateY(0) rotateY(0deg); 
          }
        }
        
        @keyframes collectButtonAppear {
          0% { 
            opacity: 0; 
            transform: scale(0.8) translateY(20px); 
          }
          100% { 
            opacity: 1; 
            transform: scale(1) translateY(0); 
          }
        }
        
        @keyframes newCardPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        @keyframes regionPulse {
          0%, 100% { transform: translateX(-50%) scale(1); }
          50% { transform: translateX(-50%) scale(1.05); }
        }
        
        @keyframes successMessage {
          0% { 
            opacity: 0; 
            transform: translate(-50%, -50%) scale(0.8); 
          }
          20% { 
            opacity: 1; 
            transform: translate(-50%, -50%) scale(1.1); 
          }
          80% { 
            opacity: 1; 
            transform: translate(-50%, -50%) scale(1); 
          }
          100% { 
            opacity: 0; 
            transform: translate(-50%, -50%) scale(0.9); 
          }
        }
      `}</style>
    </div>
  );
};

export default RandomCardDraw;