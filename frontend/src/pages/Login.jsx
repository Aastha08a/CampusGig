import './Login.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authApi';
import { useAuth } from '../context/AuthContext';

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = e.target;

        const email = form.email.value;
        const password = form.password.value;

        try {
            setError('');

            const data = await loginUser({
                email,
                password,
            });

            login(data.user, data.accessToken);

            navigate('/dashboard');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <main className="login-page">

            <div className="login-container">

                {/* LEFT SIDE */}
                <section className="login-visual">

                    <div className="login-brand">
                        <div className="brand-logo">C</div>
                        <span>CampusGig</span>
                    </div>

                    <div className="visual-content">

                        <span className="visual-badge">
                            ✦ Made for campus life
                        </span>

                        <h1>
                            Find gigs.
                            <br />
                            Build skills.
                            <br />
                            Grow together.
                        </h1>

                        <p>
                            Discover flexible opportunities on campus
                            and turn your skills into real experience.
                        </p>

                    </div>

                    <div className="visual-decoration decoration-one"></div>
                    <div className="visual-decoration decoration-two"></div>
                    <div className="visual-decoration decoration-three"></div>

                </section>


                {/* RIGHT SIDE */}
                <section className="login-form-section">

                    <div className="login-form-container">

                        <div className="login-heading">

                            <h2>
                                Log in to CampusGig
                            </h2>

                            <p>
                                Continue where you left off.
                            </p>

                        </div>


                        <form className="login-form" onSubmit={handleSubmit}>

                            <div className="form-group">

                                <label htmlFor="email">
                                    College email
                                </label>

                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="you@chitkara.edu.in"
                                />

                            </div>


                            <div className="form-group">

                                <div className="label-row">

                                    <label htmlFor="password">
                                        Password
                                    </label>

                                    <button
                                        type="button"
                                        className="forgot-password"
                                    >
                                        Forgot password?
                                    </button>

                                </div>

                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Enter your password"
                                />

                            </div>

                            {error && (
                                <p className="login-error">
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                className="login-button"
                            >
                                Log In
                            </button>

                        </form>


                        <div className="login-divider">
                            <span>or</span>
                        </div>


                        <button className="google-button">
                            <span>G</span>
                            Continue with Google
                        </button>


                        <p className="signup-text">
                            Don't have an account?
                            <a href="/signup"> Sign Up</a>
                        </p>

                    </div>

                </section>

            </div>

        </main>
    );
}

export default Login;