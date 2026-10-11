import hero from '../../assets/hero.png';

import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import './Hero.css';

function Hero() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [search, setSearch] = useState('');

    return (
        <section className="hero">
            <div className="hero-content">
                <span className="greeting">
                    Hey, {user?.name || 'there'}
                </span>

                <h1>Find something worth doing on campus.</h1>

                <p>
                    Discover flexible gigs, build real skills, and earn alongside your classes.
                </p>

                <form
                    className="search-box"
                    onSubmit={(event) => {
                        event.preventDefault();

                        if (search.trim()) {
                            navigate(
                                `/browse?q=${encodeURIComponent(search.trim())}`
                            );
                        } else {
                            navigate('/browse');
                        }
                    }}
                >
                    <input
                        placeholder="Search gigs, skills or clubs..."
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                    />

                    <button type="submit">
                        Search
                    </button>
                </form>
            </div>

            <div className="hero-illustration">
                <img src={hero} alt="" />
            </div>
        </section>
    );
}

export default Hero;