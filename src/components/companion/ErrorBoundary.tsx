import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('App crash:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            minHeight: '100vh',
            padding: '2rem',
            background: '#0b1220',
            color: '#f3e6cf',
            fontFamily: 'Segoe UI, Microsoft YaHei, sans-serif',
          }}
        >
          <h1>页面出了一点问题</h1>
          <p style={{ opacity: 0.8 }}>{this.state.error.message}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              marginTop: '1rem',
              padding: '0.7rem 1.2rem',
              borderRadius: 999,
              border: 'none',
              background: 'linear-gradient(135deg, #d7b36a, #a86b3c)',
              color: '#1a1208',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            刷新重试
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
