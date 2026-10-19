import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

function Navbar() {
    const { user, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

    const handleLogoutClick = () => {
        setLogoutConfirmOpen(true);
    };

    const confirmLogout = () => {
        setLogoutConfirmOpen(false);
        logout();
    };

    const cancelLogout = () => {
        setLogoutConfirmOpen(false);
    };

    return (
        <nav className="navbar navbar-expand-lg">
            <Link to="/dashboard" className="navbar-logo">
                <span className="logo-icon">C</span>
                <span>CampusGig</span>
            </Link>

            <div
                className={`collapse navbar-collapse ${
                    menuOpen ? 'show' : ''
                }`}
                id="navbarContent"
            >
                <div className="navbar-links">
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            isActive ? 'active' : ''
                        }
                    >
                        Home
                    </NavLink>

                    <NavLink
                        to="/browse"
                        className={({ isActive }) =>
                            isActive ? 'active' : ''
                        }
                    >
                        Browse Gigs
                    </NavLink>

                    <NavLink
                        to="/gigs/my"
                        className={({ isActive }) =>
                            isActive ? 'active' : ''
                        }
                    >
                        My Gigs
                    </NavLink>

                    <NavLink
                        to="/applications"
                        className={({ isActive }) =>
                            isActive ? 'active' : ''
                        }
                    >
                        Applications
                    </NavLink>

                    <button
                        className="mobile-logout-btn"
                        onClick={handleLogoutClick}
                    >
                        Logout
                    </button>
                </div>
            </div>

            <div className="navbar-actions">
                <Link
                    to="/gigs/create"
                    className="icon-button"
                    aria-label="Post a Gig"
                >
                    + Post a gig
                </Link>

                <Link
                    to="/profile"
                    className="profile-button"
                    aria-label="Profile"
                >
                    <span className="profile-avatar">
                        {user?.name?.charAt(0).toUpperCase() || '?'}
                    </span>
                </Link>

                <div className="desktop-logout-wrapper">
                    <button
                        className="logout-btn desktop-logout-btn"
                        onClick={handleLogoutClick}
                        aria-label="Logout"
                    >
                        <FontAwesomeIcon icon={faRightFromBracket} />
                    </button>

                    {logoutConfirmOpen && (
                        <div className="logout-confirm desktop-logout-confirm">
                            <p>Are you sure you want to logout?</p>
                            <button onClick={confirmLogout}>Yes</button>
                            <button onClick={cancelLogout}>Cancel</button>
                        </div>
                    )}
                </div>

                <button
                    className={`navbar-toggler ${menuOpen ? 'menu-open' : ''}`}
                    type="button"
                    aria-expanded={menuOpen}
                    aria-label="Toggle navigation"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? '×' : <span className="navbar-toggler-icon" />}
                </button>
            </div>

            {logoutConfirmOpen && (
                <div
                    className="logout-confirm-overlay"
                    onClick={cancelLogout}
                >
                    <div
                        className="logout-confirm mobile-logout-confirm"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3>Are you sure you want to logout?</h3>

                        <button onClick={confirmLogout}>
                            Yes
                        </button>

                        <button onClick={cancelLogout}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}

        </nav>
    );
}

export default Navbar;