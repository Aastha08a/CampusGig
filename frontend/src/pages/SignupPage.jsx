import './Signup.css';
import { useNavigate } from 'react-router-dom';
import { signupUser } from '../services/authApi';

function SignupPage() {
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = e.target;

        const name = form.name.value;
        const email = form.email.value;
        const password = form.password.value;
        const stream = form.stream.value;
        const year = Number(form.year.value);
        const city = form.city.value;

        try {
            await signupUser({
                name,
                email,
                password,
                stream,
                year,
                city,
            });

            navigate(
                `/verify-otp?email=${encodeURIComponent(email)}`
            );
        } catch (error) {
            alert(
                error.response?.data?.message ||
                error.message ||
                'Signup failed.'
            );
        }
    };

    return (
        <div className="signup-page">
            <div className="signup-container">

                {/* LEFT SIDE */}
                <section className="signup-left">
                    <div className="signup-brand">
                        <div className="brand-icon">C</div>
                        <span>CampusGig</span>
                    </div>

                    <div className="signup-left-content">
                        <span className="signup-badge">
                            ✦ Made for campus life
                        </span>

                        <h1>
                            Find gigs.<br />
                            Build skills.<br />
                            Grow together.
                        </h1>

                        <p>
                            Discover flexible opportunities on campus and
                            turn your skills into real experience.
                        </p>
                    </div>

                    <div className="signup-decoration decoration-one"></div>
                    <div className="signup-decoration decoration-two"></div>
                    <div className="signup-decoration decoration-three"></div>
                </section>

                {/* RIGHT SIDE */}
                <section className="signup-form-section">
                    <div className="signup-form-wrapper">

                        <div className="signup-heading">
                            <span>Join CampusGig 🎓</span>

                            <h2>Create your account</h2>
                        </div>

                        <form
                            className="signup-form"
                            onSubmit={handleSubmit}
                        >

                            <div className="form-group">
                                <label htmlFor="name">
                                    Full Name
                                </label>

                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="e.g. Aastha Saini"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">
                                    College Email
                                </label>

                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="you@chitkara.edu.in"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">
                                    Password
                                </label>

                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Minimum 8 characters"
                                    required
                                />
                            </div>

                            <div className="form-row">

                                <div className="form-group">
                                    <label htmlFor="stream">
                                        Stream
                                    </label>

                                    <select
                                        id="stream"
                                        name="stream"
                                        defaultValue=""
                                        required
                                    >
                                        <option value="" disabled>
                                            Select
                                        </option>

                                        <option value="Computer Science Engineering">
                                            Computer Science Engineering
                                        </option>

                                        <option value="Electronics Engineering">
                                            Electronics Engineering
                                        </option>

                                        <option value="Mechanical Engineering">
                                            Mechanical Engineering
                                        </option>

                                        <option value="Civil Engineering">
                                            Civil Engineering
                                        </option>

                                        <option value="Other">
                                            Other
                                        </option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="year">
                                        Year
                                    </label>

                                    <select
                                        id="year"
                                        name="year"
                                        defaultValue=""
                                        required
                                    >
                                        <option value="" disabled>
                                            Select
                                        </option>

                                        <option value="1">
                                            1st Year
                                        </option>

                                        <option value="2">
                                            2nd Year
                                        </option>

                                        <option value="3">
                                            3rd Year
                                        </option>

                                        <option value="4">
                                            4th Year
                                        </option>
                                    </select>
                                </div>

                            </div>

                            <div className="form-group">
                                <label htmlFor="city">
                                    City
                                </label>

                                <input
                                    id="city"
                                    name="city"
                                    type="text"
                                    placeholder="e.g. Chandigarh"
                                    required
                                />
                            </div>

                            <label className="terms">
                                <input
                                    type="checkbox"
                                    required
                                />

                                <span>
                                    I agree to CampusGig's{' '}
                                    <a href="#">
                                        Terms of Service
                                    </a>
                                    {' '}and{' '}
                                    <a href="#">
                                        Privacy Policy
                                    </a>.
                                </span>
                            </label>

                            <button
                                type="submit"
                                className="create-account-btn"
                            >
                                Create Account
                            </button>

                        </form>

                        <div className="signup-login-link">
                            Already have an account?{' '}
                            <a href="/login">
                                Log in
                            </a>
                        </div>

                    </div>
                </section>

            </div>
        </div>
    );
}

export default SignupPage;