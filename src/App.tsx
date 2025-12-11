import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import CompleteProfilePage from './pages/CompleteProfilePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import OTPTestPage from './pages/OTPTestPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <AuthProvider>
            <AppProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/mechanic/:id" element={<ProfilePage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<OTPTestPage />} />
                        <Route path="/complete-profile" element={<CompleteProfilePage />} />
                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute requiredRole="ADMIN">
                                    <AdminPage />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </BrowserRouter>
            </AppProvider>
        </AuthProvider>
    );
}

export default App;
