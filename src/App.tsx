import React, { useState } from 'react';
// 移除CSS导入，完全使用内联样式

// 卡片类型定义
interface Card {
  id: string;
  name: string;
  region: string;
  category: string;
  subcategory: string;
  frontImage: string;
  backImage: string;
}

// 卡片组件
const CardComponent: React.FC<{ card: Card, isFlipped: boolean, onClick: () => void }> = ({ card, isFlipped, onClick }) => {
  return (
    <div 
      style={{ 
        position: 'relative',
        width: '16rem',
        height: '24rem',
        borderRadius: '0.5rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        cursor: 'pointer',
        transform: 'scale(1)',
        transition: 'transform 0.5s',
        perspective: '1000px'
      }}
      onClick={onClick}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      <div 
        style={{ 
          position: 'relative',
          width: '100%',
          height: '100%',
          transition: 'transform 0.5s',
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg) rotate(90deg)' : 'rotateY(0deg)'
        }}
      >
        {/* 卡片正面 */}
        <div 
          style={{ 
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '0.5rem',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden'
          }}
        >
          <img 
            src={card.frontImage} 
            alt={card.name} 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '0.5rem'
            }}
          />
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '0.5rem',
            borderBottomLeftRadius: '0.5rem',
            borderBottomRightRadius: '0.5rem'
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>{card.name}</h3>
            <p style={{ fontSize: '0.875rem' }}>{card.region} - {card.category} - {card.subcategory}</p>
          </div>
        </div>
        
        {/* 卡片背面 */}
        <div 
          style={{ 
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '0.5rem',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <img 
            src={card.backImage} 
            alt={`${card.name} 背面`} 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '0.5rem'
            }}
          />
        </div>
      </div>
    </div>
  );
};

// 自动生成卡片数据的函数
const generateCardData = (): Card[] => {
  // 这里是我们的卡片数据
  return [
    {
      id: "0013",
      name: "南马都尔遗迹",
      region: "太平洋岛",
      category: "宗教",
      subcategory: "筑",
      frontImage: "/卡牌图片/0013太平洋岛-宗教-筑-南马都尔遗迹（正）.jpg",
      backImage: "/卡牌图片/0013太平洋岛-宗教-筑-南马都尔遗迹（反）.jpg"
    },
    {
      id: "0036",
      name: "抹香鲸",
      region: "西欧",
      category: "生物",
      subcategory: "水生",
      frontImage: "/卡牌图片/0036西欧-生物-水生-抹香鲸（正）.jpg",
      backImage: "/卡牌图片/0036西欧-生物-水生-抹香鲸（反）.jpg"
    },
    {
      id: "0037",
      name: "蓝鲸",
      region: "非洲南",
      category: "生物",
      subcategory: "水生",
      frontImage: "/卡牌图片/0037非洲南-生物-水生-蓝鲸（正）.jpg",
      backImage: "/卡牌图片/0037非洲南-生物-水生-蓝鲸（反）.jpg"
    },
    {
      id: "0050",
      name: "伊利亚特",
      region: "东欧",
      category: "财宝",
      subcategory: "经典",
      frontImage: "/卡牌图片/0050东欧-财宝-经典-伊利亚特（正）.jpg",
      backImage: "/卡牌图片/0050东欧-财宝-经典-伊利亚特（反）.jpg"
    },
    {
      id: "0079",
      name: "吉萨金字塔",
      region: "非洲北",
      category: "宗教",
      subcategory: "筑",
      frontImage: "/卡牌图片/0079非洲北-宗教-筑-吉萨金字塔（正）.jpg",
      backImage: "/卡牌图片/0079非洲北-宗教-筑-吉萨金字塔（反）.jpg"
    },
    {
      id: "0107",
      name: "巴别塔",
      region: "东欧",
      category: "美术",
      subcategory: "艺术",
      frontImage: "/卡牌图片/0107东欧-美术-艺术-巴别塔（正）.jpg",
      backImage: "/卡牌图片/0107东欧-美术-艺术-巴别塔（反）.jpg"
    },
    {
      id: "0109",
      name: "通天塔",
      region: "东欧",
      category: "美术",
      subcategory: "艺术",
      frontImage: "/卡牌图片/0109东欧-美术-艺术-通天塔（正）.jpg",
      backImage: "/卡牌图片/0109东欧-美术-艺术-通天塔（反）.jpg"
    },
    {
      id: "0136",
      name: "帝汶岛",
      region: "东南亚",
      category: "地理",
      subcategory: "地",
      frontImage: "/卡牌图片/0136东南亚-地理-地-帝汶岛（正）.jpg",
      backImage: "/卡牌图片/0136东南亚-地理-地-帝汶岛（反）.jpg"
    },
    {
      id: "0138",
      name: "帕劳群岛",
      region: "东南亚",
      category: "地理",
      subcategory: "地",
      frontImage: "/卡牌图片/0138东南亚-地理-地-帕劳群岛（正）.jpg",
      backImage: "/卡牌图片/0138东南亚-地理-地-帕劳群岛（反）.jpg"
    },
    {
      id: "0139",
      name: "塔斯马尼亚岛",
      region: "澳洲",
      category: "地理",
      subcategory: "地",
      frontImage: "/卡牌图片/0139澳洲-地理-地-塔斯马尼亚岛（正）.jpg",
      backImage: "/卡牌图片/0139澳洲-地理-地-塔斯马尼亚岛（反）.jpg"
    },
    {
      id: "0142",
      name: "斐济群岛",
      region: "太平洋岛",
      category: "地理",
      subcategory: "地",
      frontImage: "/卡牌图片/0142太平洋岛-地理-地-斐济群岛（正）.jpg",
      backImage: "/卡牌图片/0142太平洋岛-地理-地-斐济群岛（反）.jpg"
    },
    {
      id: "0143",
      name: "塔希提岛",
      region: "太平洋岛",
      category: "地理",
      subcategory: "地",
      frontImage: "/卡牌图片/0143太平洋岛-地理-地-塔希提岛（正）.jpg",
      backImage: "/卡牌图片/0143太平洋岛-地理-地-塔希提岛（反）.jpg"
    },
    {
      id: "0144",
      name: "复活节岛",
      region: "太平洋岛",
      category: "地理",
      subcategory: "地",
      frontImage: "/卡牌图片/0144太平洋岛-地理-地-复活节岛（正）.jpg",
      backImage: "/卡牌图片/0144太平洋岛-地理-地-复活节岛（反）.jpg"
    },
    {
      id: "0146",
      name: "阿基维祭坛的摩艾",
      region: "太平洋岛",
      category: "宗教",
      subcategory: "筑",
      frontImage: "/卡牌图片/0146太平洋岛-宗教-筑-阿基维祭坛的摩艾（正）.jpg",
      backImage: "/卡牌图片/0146太平洋岛-宗教-筑-阿基维祭坛的摩艾（反）.jpg"
    },
    {
      id: "0147",
      name: "霍图∙玛图阿王的摩艾",
      region: "太平洋岛",
      category: "宗教",
      subcategory: "筑",
      frontImage: "/卡牌图片/0147太平洋岛-宗教-筑-霍图∙玛图阿王的摩艾（正）.jpg",
      backImage: "/卡牌图片/0147太平洋岛-宗教-筑-霍图∙玛图阿王的摩艾（反）.jpg"
    },
    {
      id: "0148",
      name: "东加历奇的摩艾",
      region: "太平洋岛",
      category: "宗教",
      subcategory: "筑",
      frontImage: "/卡牌图片/0148太平洋岛-宗教-筑-东加历奇的摩艾（正）.jpg",
      backImage: "/卡牌图片/0148太平洋岛-宗教-筑-东加历奇的摩艾（反）.jpg"
    },
    {
      id: "0151",
      name: "太平洋",
      region: "太平洋岛",
      category: "地理",
      subcategory: "地",
      frontImage: "/卡牌图片/0151太平洋岛-地理-地-太平洋（正）.jpg",
      backImage: "/卡牌图片/0151太平洋岛-地理-地-太平洋（反）.jpg"
    },
    {
      id: "0152",
      name: "宿雾岛",
      region: "东南亚",
      category: "地理",
      subcategory: "地",
      frontImage: "/卡牌图片/0152东南亚-地理-地-宿雾岛（正）.jpg",
      backImage: "/卡牌图片/0152东南亚-地理-地-宿雾岛（反）.jpg"
    },
    {
      id: "0171",
      name: "波纳佩岛",
      region: "太平洋岛",
      category: "地理",
      subcategory: "地",
      frontImage: "/卡牌图片/0171太平洋岛-地理-地-波纳佩岛（正）.jpg",
      backImage: "/卡牌图片/0171太平洋岛-地理-地-波纳佩岛（反）.jpg"
    },
    {
      id: "0174",
      name: "安赫尔瀑布",
      region: "南美",
      category: "地理",
      subcategory: "地",
      frontImage: "/卡牌图片/0174南美-地理-地-安赫尔瀑布（正）.jpg",
      backImage: "/卡牌图片/0174南美-地理-地-安赫尔瀑布（反）.jpg"
    }
  ];
};

// 获取卡片数据
const cards = generateCardData();

function App() {
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const cardsPerPage = 6; // 每页显示6张卡牌

  const handleCardClick = (cardId: string) => {
    setFlippedCardId(flippedCardId === cardId ? null : cardId);
  };

  // 获取所有地区
  const regions = Array.from(new Set(cards.map(card => card.region)));
  
  // 根据筛选条件过滤卡牌
  const filteredCards = filter === 'all' 
    ? cards 
    : cards.filter(card => card.region === filter);
    
  // 计算总页数
  const totalPages = Math.ceil(filteredCards.length / cardsPerPage);
  
  // 获取当前页的卡牌
  const currentCards = filteredCards.slice(
    (currentPage - 1) * cardsPerPage,
    currentPage * cardsPerPage
  );
  
  // 切换页面时重置翻转状态
  const handlePageChange = (page: number) => {
    setFlippedCardId(null);
    setCurrentPage(page);
  };
  
  // 当筛选条件改变时，重置页码
  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    setCurrentPage(1);
    setFlippedCardId(null);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #e0f2fe, #bfdbfe)'
    }}>
      <header style={{
        backgroundColor: '#4338ca',
        color: 'white',
        padding: '1rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>贝贝鲁地球百科卡片</h1>
          <nav>
            <ul style={{ display: 'flex', gap: '1rem' }}>
              <li><a href="#" style={{ color: 'white', textDecoration: 'none' }}>首页</a></li>
              <li><a href="#" style={{ color: 'white', textDecoration: 'none' }}>探索</a></li>
              <li><a href="#" style={{ color: 'white', textDecoration: 'none' }}>收藏</a></li>
              <li><a href="#" style={{ color: 'white', textDecoration: 'none' }}>关于</a></li>
            </ul>
          </nav>
        </div>
      </header>
      
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1rem'
      }}>
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ 
            fontSize: '1.875rem', 
            fontWeight: 'bold', 
            textAlign: 'center', 
            marginBottom: '2rem' 
          }}>
            东方传说卡片集
          </h2>
          <p style={{ 
            fontSize: '1.125rem', 
            textAlign: 'center', 
            maxWidth: '42rem', 
            margin: '0 auto 1rem auto' 
          }}>
            探索东方传说中的神秘地理、宗教建筑和文化遗产。点击卡片可以查看详细信息！
          </p>
          
          {/* 地区筛选器 */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '0.5rem',
            marginBottom: '2rem'
          }}>
            <button 
              onClick={() => handleFilterChange('all')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.25rem',
                border: 'none',
                backgroundColor: filter === 'all' ? '#4338ca' : '#e0e7ff',
                color: filter === 'all' ? 'white' : '#4338ca',
                fontWeight: filter === 'all' ? 'bold' : 'normal',
                cursor: 'pointer'
              }}
            >
              全部
            </button>
            {regions.map(region => (
              <button 
                key={region}
                onClick={() => handleFilterChange(region)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.25rem',
                  border: 'none',
                  backgroundColor: filter === region ? '#4338ca' : '#e0e7ff',
                  color: filter === region ? 'white' : '#4338ca',
                  fontWeight: filter === region ? 'bold' : 'normal',
                  cursor: 'pointer'
                }}
              >
                {region}
              </button>
            ))}
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {currentCards.map(card => (
              <CardComponent 
                key={card.id} 
                card={card} 
                isFlipped={flippedCardId === card.id}
                onClick={() => handleCardClick(card.id)}
              />
            ))}
          </div>
          
          {/* 分页控件 */}
          {totalPages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '2rem',
              gap: '0.5rem'
            }}>
              <button 
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.25rem',
                  border: 'none',
                  backgroundColor: currentPage === 1 ? '#e0e7ff' : '#4338ca',
                  color: currentPage === 1 ? '#a5b4fc' : 'white',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                }}
              >
                上一页
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button 
                  key={page}
                  onClick={() => handlePageChange(page)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.25rem',
                    border: 'none',
                    backgroundColor: currentPage === page ? '#4338ca' : '#e0e7ff',
                    color: currentPage === page ? 'white' : '#4338ca',
                    fontWeight: currentPage === page ? 'bold' : 'normal',
                    cursor: 'pointer'
                  }}
                >
                  {page}
                </button>
              ))}
              
              <button 
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.25rem',
                  border: 'none',
                  backgroundColor: currentPage === totalPages ? '#e0e7ff' : '#4338ca',
                  color: currentPage === totalPages ? '#a5b4fc' : 'white',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                }}
              >
                下一页
              </button>
            </div>
          )}
        </section>
      </main>
      
      <footer style={{
        backgroundColor: '#1f2937',
        color: 'white',
        padding: '1.5rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ textAlign: 'center' }}>© 2025 贝贝鲁地球百科卡片 - 为6-12岁儿童打造的地理知识探索游戏</p>
        </div>
      </footer>
    </div>
  );
}

export default App;