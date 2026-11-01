import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SignupPage from './pages/SignupPage';
import VerifyOtpPage from './pages/VerifyOtpPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ForgotPassword from './pages/ForgotPassword';
import MyApplicationsPage from './pages/MyApplicationsPage';
import GigApplicantsPage from './pages/GigApplicantsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/my-applications" element={ <MyApplicationsPage />} />
        <Route path="/gigs/:id/applications" element={ <GigApplicantsPage /> } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;