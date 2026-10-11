import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { verifyOtp } from '../services/authApi';
import './VerifyOtp.css';

function VerifyOtpPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const email = searchParams.get('email');

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');

    const handleOtpChange = (value, index) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            document.querySelectorAll('.otp-input')[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.querySelectorAll('.otp-input')[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        const otpValue = otp.join('');

        if (otpValue.length !== 6) {
            setError('Please enter the complete 6-digit OTP.');
            return;
        }

        try {
            setError('');

            await verifyOtp({
                email,
                otp: otpValue,
            });

            alert('Email verified successfully!');

            navigate('/login');

        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="otp-page">
            <div className="otp-card">

                <button
                    className="otp-back-button"
                    onClick={() => navigate('/signup')}
                >
                    ←
                </button>

                <div className="otp-heading">
                    <h1>Sign Up</h1>

                    <p>
                        Enter the OTP we sent to your email{' '}
                        <strong>{email}</strong>
                    </p>
                </div>

                <div className="otp-section">
                    <h2>Enter OTP</h2>

                    <div className="otp-inputs">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                className="otp-input"
                                type="text"
                                inputMode="numeric"
                                maxLength="1"
                                value={digit}
                                onChange={(e) =>
                                    handleOtpChange(e.target.value, index)
                                }
                                onKeyDown={(e) =>
                                    handleKeyDown(e, index)
                                }
                            />
                        ))}
                    </div>

                    <p className="otp-validity">
                        Valid upto 11:00 AM
                    </p>

                    {error && (
                        <p className="otp-error">
                            {error}
                        </p>
                    )}
                </div>

                <button
                    className="verify-otp-btn"
                    onClick={handleVerify}
                >
                    Verify OTP
                </button>

            </div>
        </div>
    );
}

export default VerifyOtpPage;