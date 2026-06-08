import { Component } from 'react';

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
    }

    static getDerivedStateFromError(error) {
        return { error };
    }

    render() {
        if (this.state.error) {
            return (
                <div style={{ padding: 40, fontFamily: 'monospace', background: '#fff0f0', minHeight: '100vh' }}>
                    <h2 style={{ color: '#dc2626' }}>App Error</h2>
                    <pre style={{ background: '#fee2e2', padding: 20, borderRadius: 8, fontSize: 13, overflow: 'auto', whiteSpace: 'pre-wrap' }}>
                        {this.state.error.toString()}
                        {'\n\n'}
                        {this.state.error.stack}
                    </pre>
                    <button onClick={() => this.setState({ error: null })} style={{ marginTop: 16, padding: '8px 16px', background: '#dc2626', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
                        Try Again
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}
