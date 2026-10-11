import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar">
            <Link to="/dashboard" className="navbar-logo">
                <span className="logo-icon">C</span>
                <span>CampusGig</span>
            </Link>

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
                <button className="logout-btn" onClick={logout}>
    <FontAwesomeIcon icon={faRightFromBracket} />
</button>
            </div>
        </nav>
    );
}

export default Navbar;