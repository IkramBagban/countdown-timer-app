import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
    children: ReactNode
    location?: string
}

interface State {
    hasError: boolean
    error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    }

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo)
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    padding: '2rem',
                    textAlign: 'center',
                    fontFamily: 'sans-serif',
                    color: '#fff',
                    backgroundColor: '#000',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <h2 style={{ marginBottom: '1rem', color: '#ff6b6b' }}>Something went wrong</h2>
                    <p style={{ maxWidth: '400px', margin: '0 auto', opacity: 0.8 }}>
                        {this.props.location ? `Error in ${this.props.location}: ` : ''}
                        Unable to load content. Please verify your settings.
                    </p>

                </div>
            )
        }

        return this.props.children
    }
}
