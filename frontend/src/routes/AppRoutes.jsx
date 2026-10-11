import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import ProtectedRoute from '../components/auth/ProtectedRoute';

import Home from '../pages/Home';
import Login from '../pages/Login';
import SignupPage from '../pages/SignupPage';
import VerifyOtpPage from '../pages/VerifyOtpPage';

import ProfilePage from '../components/profile/ProfilePage';
import UserProfilePage from '../pages/UserProfilePage';

import CreateGigPage from '../pages/CreateGigPage';
import MyGigsPage from '../pages/MyGigsPage';
import EditGigPage from '../pages/EditGigPage';
import GigDetailPage from '../pages/GigDetailPage';

import BrowseGigsPage from '../pages/BrowseGigsPage';

import MyApplicationsPage from '../pages/MyApplicationsPage';

function PublicRoute({ children }) {
    const { user } = useAuth();

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}


function AppRoutes() {
    return (
        <Routes>

            {/* Public */}
            <Route
                path="/"
                element={<Home />}
            />

            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                }
            />

            <Route
                path="/signup"
                element={
                    <PublicRoute>
                        <SignupPage />
                    </PublicRoute>
                }
            />

            <Route
                path="/verify-otp"
                element={
                    <PublicRoute>
                        <VerifyOtpPage />
                    </PublicRoute>
                }
            />

            {/* Protected */}
            <Route element={<ProtectedRoute />}>
                <Route
                    path="/dashboard"
                    element={<Home />}
                />
                <Route
                    path="/profile"
                    element={<ProfilePage />}
                />
                <Route
                    path="/users/:id"
                    element={<UserProfilePage />}
                />
                <Route
                    path="/gigs/create"
                    element={<CreateGigPage />}
                />
                <Route
                    path="/gigs/my"
                    element={<MyGigsPage />}
                />
                <Route
                    path="/gigs/:id/edit"
                    element={<EditGigPage />}
                />
                <Route
                    path="/gigs/:id"
                    element={<GigDetailPage />}
                />
                <Route
                    path="/browse"
                    element={<BrowseGigsPage />}
                />
                <Route
                    path="/my-applications"
                    element={<MyApplicationsPage />}
                />
            </Route>

            {/* Unknown route */}
            <Route
                path="*"
                element={<Navigate to="/" replace />}
            />

        </Routes>
    );
}

export default AppRoutes;