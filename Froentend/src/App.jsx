import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { SocketProvider } from './context/SocketContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';
import PageProgress from './components/common/PageProgress.jsx';
import ChatBot from './components/common/ChatBot.jsx';
import AppRoutes from './routes/AppRoutes';
import './assets/styles/global.css';

export default function App() {
    return (
        <ErrorBoundary>
            <BrowserRouter>
                <PageProgress />
                <ThemeProvider>
                    <ToastProvider>
                        <AuthProvider>
                            <SocketProvider>
                                <AppRoutes />
                                <ChatBot />
                            </SocketProvider>
                        </AuthProvider>
                    </ToastProvider>
                </ThemeProvider>
            </BrowserRouter>
        </ErrorBoundary>
    );
}