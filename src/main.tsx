import { StrictMode, Component, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

class ErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: 'white', padding: '20px', fontFamily: 'monospace' }}>
          <h2>Something went wrong.</h2>
          <pre style={{ whiteSpace: 'pre-wrap', color: 'red' }}>
            {this.state.error?.toString()}
          </pre>
          <pre style={{ whiteSpace: 'pre-wrap', color: 'yellow', marginTop: '20px' }}>
            ENV VARS:
            {JSON.stringify({
              API_KEY: import.meta.env.VITE_FIREBASE_API_KEY ? 'exists' : 'missing',
              DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? 'exists' : 'missing',
              PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID ? 'exists' : 'missing',
            }, null, 2)}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
