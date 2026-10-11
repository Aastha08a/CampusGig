import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllGigs } from '../../services/gigApi';
import { useAuth } from '../../context/AuthContext';
import './RecommendedGigs.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
    faBrush,
    faCode,
    faPenToSquare,
    faBookOpen,
    faLocationArrow,
    faBars,
} from '@fortawesome/free-solid-svg-icons';

import { faCalendar } from '@fortawesome/free-regular-svg-icons';

function RecommendedGigs() {
    const categoryIcons = {
        DESIGN: faBrush,
        CODING: faCode,
        CONTENT: faPenToSquare,
        EVENTS: faCalendar,
        TUTORING: faBookOpen,
        MARKETING: faLocationArrow,
        OTHER: faBars,
    };
    const [gigs, setGigs] = useState([]);
    const [loading, setLoading] = useState(true);

    const {
        accessToken,
        loading: authLoading,
    } = useAuth();

    useEffect(() => {
        if (authLoading || !accessToken) {
            return;
        }

        async function loadGigs() {
            try {
                const data = await getAllGigs();

                console.log('REAL GIGS:', data);

                setGigs(data);
            } catch (error) {
                console.error(
                    'Failed to load gigs:',
                    error
                );
            } finally {
                setLoading(false);
            }
        }

        loadGigs();
    }, [accessToken, authLoading]);

    if (loading) {
        return (
            <section className="recommended-section">
                <div className="section-header">
                    <div>
                        <h2>Recommended for you</h2>
                        <p>
                            Gigs that match your interests and skills.
                        </p>
                    </div>
                </div>

                <p>Loading gigs...</p>
            </section>
        );
    }

    return (
        <section className="recommended-section">
            <div className="section-header">
                <div>
                    <h2>Recommended for you</h2>
                    <p>
                        Discover gigs from students across campus.
                    </p>
                </div>

                <Link
                    to="/browse"
                    className="view-all-btn"
                >
                    Browse all gigs ⟶
                </Link>
            </div>

            <div className="gig-grid">
                {gigs.slice(0, 3).map((gig) => (
                    <article
                        className="gig-card"
                        key={gig.id}
                    >
                        <div className="gig-card-top">
                            <span
                                className={`gig-category gig-category-${gig.category?.toLowerCase()}`}
                            >
                                <span className="gig-category-icon">
                                    <FontAwesomeIcon icon={categoryIcons[gig.category]} />
                                </span>

                                <span>
                                    {gig.category
                                        ? gig.category.charAt(0) +
                                        gig.category.slice(1).toLowerCase()
                                        : 'Category not set'}
                                </span>
                            </span>

                            <span className="gig-deadline">
                                {gig.dueDate
                                    ? `Apply by ${new Date(
                                          gig.dueDate
                                      ).toLocaleDateString('en-IN', {
                                          day: 'numeric',
                                          month: 'short',
                                      })}`
                                    : 'No deadline'}
                            </span>
                        </div>

                        <h3>{gig.title}</h3>

                        <p className="gig-description">
                            {gig.description}
                        </p>

                        <div className="gig-tags">
                            {gig.skills?.map((item) => (
                                <span
                                    className="gig-tag"
                                    key={item.skill.id}
                                >
                                    {item.skill.name}
                                </span>
                            ))}
                        </div>

                        <div className="gig-card-bottom">
                            <div>
                                <span className="gig-payment">
                                    ₹{gig.budget}
                                </span>

                                <span className="gig-poster">
                                    by {gig.postedBy?.name}
                                </span>
                            </div>

                            <Link
                                to={`/gigs/${gig.id}`}
                                className="view-gig-btn"
                            >
                                View gig →
                            </Link>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}

export default RecommendedGigs;