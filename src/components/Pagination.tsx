import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage
}) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // 生成页码数组
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // 如果总页数小于等于最大显示页数，显示所有页码
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 复杂的页码显示逻辑
      if (currentPage <= 3) {
        // 当前页在前面
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // 当前页在后面
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // 当前页在中间
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="pagination-container animate-fadeIn">
      {/* 分页信息 */}
      <div 
        style={{
          textAlign: 'center',
          marginBottom: 'var(--space-4)',
          fontSize: 'var(--text-sm)',
          color: 'var(--gray-600)'
        }}
      >
        显示第 <span style={{ fontWeight: 'var(--font-semibold)', color: 'var(--primary-blue)' }}>
          {startItem}
        </span> - <span style={{ fontWeight: 'var(--font-semibold)', color: 'var(--primary-blue)' }}>
          {endItem}
        </span> 项，共 <span style={{ fontWeight: 'var(--font-semibold)', color: 'var(--primary-blue)' }}>
          {totalItems}
        </span> 项
      </div>

      {/* 分页控件 */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 'var(--space-2)',
          flexWrap: 'wrap'
        }}
      >
        {/* 上一页按钮 */}
        <button 
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="pagination-button"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-1)',
            padding: 'var(--space-2) var(--space-3)',
            borderRadius: 'var(--radius-lg)',
            border: 'none',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-medium)',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            transition: 'all var(--transition-fast)',
            background: currentPage === 1 ? 'var(--gray-100)' : 'var(--bg-white)',
            color: currentPage === 1 ? 'var(--gray-400)' : 'var(--gray-700)',
            boxShadow: currentPage === 1 ? 'none' : 'var(--shadow-sm)',
            opacity: currentPage === 1 ? 0.5 : 1
          }}
        >
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="m15 18-6-6 6-6"/>
          </svg>
          <span>上一页</span>
        </button>

        {/* 页码按钮 */}
        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <span 
                key={`ellipsis-${index}`}
                style={{
                  padding: 'var(--space-2)',
                  color: 'var(--gray-400)',
                  fontSize: 'var(--text-sm)'
                }}
              >
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <button 
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`pagination-button ${isActive ? 'active' : ''}`}
              style={{
                minWidth: '40px',
                height: '40px',
                borderRadius: 'var(--radius-lg)',
                border: 'none',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-medium)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                position: 'relative',
                overflow: 'hidden',
                background: isActive 
                  ? 'linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-blue-light) 100%)'
                  : 'var(--bg-white)',
                color: isActive ? 'white' : 'var(--gray-700)',
                boxShadow: isActive 
                  ? 'var(--shadow-md)' 
                  : 'var(--shadow-sm)',
                transform: isActive ? 'translateY(-1px)' : 'translateY(0)'
              }}
            >
              <span style={{ position: 'relative', zIndex: 1 }}>
                {pageNum}
              </span>
              {isActive && (
                <div 
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(255, 255, 255, 0.1)',
                    animation: 'pulse 2s infinite'
                  }}
                />
              )}
            </button>
          );
        })}

        {/* 下一页按钮 */}
        <button 
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="pagination-button"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-1)',
            padding: 'var(--space-2) var(--space-3)',
            borderRadius: 'var(--radius-lg)',
            border: 'none',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-medium)',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            transition: 'all var(--transition-fast)',
            background: currentPage === totalPages ? 'var(--gray-100)' : 'var(--bg-white)',
            color: currentPage === totalPages ? 'var(--gray-400)' : 'var(--gray-700)',
            boxShadow: currentPage === totalPages ? 'none' : 'var(--shadow-sm)',
            opacity: currentPage === totalPages ? 0.5 : 1
          }}
        >
          <span>下一页</span>
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </button>
      </div>

      {/* 快速跳转 */}
      {totalPages > 10 && (
        <div 
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 'var(--space-2)',
            marginTop: 'var(--space-4)',
            fontSize: 'var(--text-sm)',
            color: 'var(--gray-600)'
          }}
        >
          <span>跳转到</span>
          <input 
            type="number"
            min="1"
            max={totalPages}
            placeholder={currentPage.toString()}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                const value = parseInt((e.target as HTMLInputElement).value);
                if (value >= 1 && value <= totalPages) {
                  onPageChange(value);
                  (e.target as HTMLInputElement).value = '';
                }
              }
            }}
            style={{
              width: '60px',
              padding: 'var(--space-1) var(--space-2)',
              border: '1px solid var(--gray-300)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-sm)',
              textAlign: 'center',
              outline: 'none',
              transition: 'border-color var(--transition-fast)'
            }}
          />
          <span>页</span>
        </div>
      )}

      {/* 动画样式 */}
      <style>{`
        .pagination-button:hover:not(:disabled):not(.active) {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
          background: var(--primary-blue);
          color: white;
        }
        
        .pagination-button:active {
          transform: translateY(0);
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        input:focus {
          border-color: var(--primary-blue);
          box-shadow: 0 0 0 3px rgba(67, 56, 202, 0.1);
        }
        
        @media (max-width: 768px) {
          .pagination-button {
            min-width: 36px;
            height: 36px;
            font-size: var(--text-xs);
          }
          
          .pagination-button span {
            display: none;
          }
          
          .pagination-button svg {
            width: 14px;
            height: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default Pagination;