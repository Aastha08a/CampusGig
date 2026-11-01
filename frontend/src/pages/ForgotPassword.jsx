
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword, resetPassword } from '../services/authApi';
import './ForgotPassword.css';

function ForgotPassword() {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            const result = await forgotPassword(email);
            setMessage(result.message);
            setStep(2);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);

        try {
            const result = await resetPassword({
                email,
                otp,
                newPassword,
            });

            setMessage(result.message);

            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="forgot-page">
            <section className="forgot-card">
                <Link to="/login" className="forgot-back">
                    ← Back to login
                </Link>

                <div className="forgot-brand">
                    <span className="forgot-logo">C</span>
                    <span>CampusGig</span>
                </div>

                {step === 1 ? (
                    <>
                        <h1>Forgot password?</h1>
                        <p className="forgot-description">
                            Enter your registered college email and
                            we'll send you a password reset code.
                        </p>

                        <form onSubmit={handleRequestOtp}>
                            <label htmlFor="reset-email">
                                College email
                            </label>

                            <input
                                id="reset-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@chitkara.edu.in"
                                required
                            />

                            <button type="submit" disabled={loading}>
                                {loading ? 'Sending...' : 'Send reset code'}
                            </button>
                        </form>
                    </>
                ) : (
                    <>
                        <h1>Reset your password</h1>
                        <p className="forgot-description">
                            Enter the six-digit code sent to {email},
                            then choose a new password.
                        </p>

                        <form onSubmit={handleResetPassword}>
                            <label htmlFor="reset-otp">Email OTP</label>

                            <input
                                id="reset-otp"
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]{6}"
                                maxLength={6}
                                value={otp}
                                onChange={(e) =>
                                    setOtp(e.target.value.replace(/\D/g, ''))
                                }
                                placeholder="Enter 6-digit code"
                                required
                            />

                            <label htmlFor="new-password">New password</label>

                            <input
                                id="new-password"
                                type="password"
                                minLength={8}
                                value={newPassword}
                                onChange={(e) =>
                                    setNewPassword(e.target.value)
                                }
                                placeholder="At least 8 characters"
                                required
                            />

                            <label htmlFor="confirm-password">
                                Confirm new password
                            </label>

                            <input
                                id="confirm-password"
                                type="password"
                                minLength={8}
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                placeholder="Re-enter new password"
                                required
                            />

                            <button type="submit" disabled={loading}>
                                {loading ? 'Resetting...' : 'Reset password'}
                            </button>
                            
                        </form>
                    </>
                )}

                {message && (
                    <p className="forgot-message" role="status">
                        {message}
                    </p>
                )}

                {error && (
                    <p className="forgot-error" role="alert">
                        {error}
                    </p>
                )}

                <p className="forgot-footer">
                    Remembered your password? <Link to="/login">Log in</Link>
                </p>
            </section>
        </main>
    );
}

export default ForgotPassword;
