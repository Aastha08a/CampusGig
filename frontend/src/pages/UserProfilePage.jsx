
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserProfile } from '../services/userApi';
import Navbar from '../components/home/Navbar';
import '../components/profile/Profile.css';

function UserProfilePage() {
    const { id } = useParams();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchProfile() {
            try {
                setLoading(true);
                setError('');

                const data = await getUserProfile(id);
                setProfile(data);
            } catch (error) {
                console.error(error);

                setError(
                    error.response?.data?.message ||
                    'Failed to load profile.'
                );
            } finally {
                setLoading(false);
            }
        }

        fetchProfile();
    }, [id]);

    const formatJoinedDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            month: 'long',
            year: 'numeric',
        });
    };

    const formatYear = (year) => {
        if (!year) return '';

        const suffix =
            year === 1 ? 'st' :
            year === 2 ? 'nd' :
            year === 3 ? 'rd' :
            'th';

        return `${year}${suffix} Year`;
    };

    const getStatusLabel = (status) => {
        return status.charAt(0) + status.slice(1).toLowerCase();
    };

    if (loading) {
        return (
            <div className="profile-page">
                <Navbar />
                <p className="profile-loading">Loading profile...</p>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="profile-page">
                <Navbar />
                <p className="profile-error">
                    {error || 'Profile not found.'}
                </p>
            </div>
        );
    }

    const skills = profile.skills || [];
    const reviews = profile.reviews || [];
    const recentGigs = profile.recentGigs || [];
    const stats = profile.stats || {};

    return (
        <div className="profile-page">
            <Navbar />

            <main className="profile-container">

                {/* Profile Hero */}
                <section className="profile-hero-card">

                    <div className="profile-cover">
                        <div className="cover-decoration cover-decoration-one" />
                        <div className="cover-decoration cover-decoration-two" />
                        <div className="cover-dot cover-dot-one" />
                        <div className="cover-dot cover-dot-two" />
                        <div className="cover-plus">+</div>
                    </div>

                    <div className="profile-hero-content">

                        <div className="profile-avatar-wrapper">
                            <div className="profile-avatar-large">
                                {profile.name.charAt(0).toUpperCase()}
                            </div>

                            <span className="profile-online-dot" />
                        </div>

                        {/* Keeps the original header spacing */}
                        <div className="profile-actions" />

                        <div className="profile-identity">
                            <h1>{profile.name}</h1>

                            <p className="profile-academic">
                                {profile.stream || 'Student'}

                                {profile.year && (
                                    <>
                                        <span> · </span>
                                        {formatYear(profile.year)}
                                    </>
                                )}

                                <span> · </span>
                                {profile.university}
                            </p>

                            <div className="profile-meta">
                                {profile.city && (
                                    <span>
                                        📍 {profile.city}, India
                                    </span>
                                )}

                                <span>
                                    🎓 Joined{' '}
                                    {formatJoinedDate(profile.createdAt)}
                                </span>

                                {stats.rating != null && (
                                    <span>
                                        ⭐ {Number(stats.rating).toFixed(1)} rating
                                    </span>
                                )}
                            </div>
                        </div>

                    </div>
                </section>

                {/* Two-column content */}
                <div className="profile-grid">

                    {/* LEFT COLUMN */}
                    <div className="profile-left-column">

                        {/* About */}
                        <section className="profile-card">
                            <div className="profile-section-heading">
                                <div className="section-title">
                                    <span>👤</span>
                                    <h2>About Me</h2>
                                </div>
                            </div>

                            <p className="profile-bio">
                                {profile.bio || 'No bio added yet.'}
                            </p>
                        </section>

                        {/* Skills */}
                        <section className="profile-card">
                            <div className="profile-section-heading">
                                <div className="section-title">
                                    <span>🛠</span>
                                    <h2>Skills</h2>
                                </div>
                            </div>

                            {skills.length === 0 ? (
                                <p className="empty-state">
                                    No skills added yet.
                                </p>
                            ) : (
                                <div className="skill-tags">
                                    {skills.map((skill) => (
                                        <span
                                            key={skill.id}
                                            className="skill-tag"
                                        >
                                            {skill.name}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Reviews */}
                        <section className="profile-card reviews-card">

                            <div className="reviews-content">

                                <div className="reviews-main">

                                    <div className="reviews-heading">
                                        <div className="section-title">
                                            <span>☆</span>
                                            <h2>Reviews & Ratings</h2>
                                        </div>
                                    </div>

                                    {reviews.length === 0 ? (
                                        <div className="no-reviews">
                                            <p>No reviews yet</p>

                                            <small>
                                                Reviews will appear here after
                                                completed gigs.
                                            </small>
                                        </div>
                                    ) : (
                                        <div className="reviews-list">

                                            {reviews.map((review) => (
                                                <article
                                                    key={review.id}
                                                    className="review-item"
                                                >
                                                    <div className="review-top">
                                                        <strong>
                                                            {review.raterName}
                                                        </strong>

                                                        <span className="review-score">
                                                            {'★'.repeat(review.score)}
                                                        </span>
                                                    </div>

                                                    {review.review && (
                                                        <p>
                                                            {review.review}
                                                        </p>
                                                    )}
                                                </article>
                                            ))}

                                        </div>
                                    )}

                                </div>

                                {/* Rating box */}
                                <div className="review-rating-box">

                                    <span className="review-rating-icon">
                                        ☆
                                    </span>

                                    {stats.rating != null ? (
                                        <>
                                            <strong>
                                                {Number(stats.rating).toFixed(1)}
                                            </strong>

                                            <span>
                                                Average Rating
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <strong>—</strong>

                                            <span>
                                                No rating yet
                                            </span>
                                        </>
                                    )}

                                </div>

                            </div>
                        </section>

                    </div>

                    {/* RIGHT COLUMN */}
                    <aside className="profile-right-column">

                        {/* Gig Activity */}
                        <section className="profile-card activity-card">
                            <div className="profile-section-heading">
                                <div className="section-title">
                                    <h2>Gig Activity</h2>
                                </div>
                            </div>

                            <div className="activity-grid">

                                <div className="activity-stat completed-stat">
                                    <span className="activity-icon">✓</span>

                                    <strong>
                                        {stats.completedGigs ?? 0}
                                    </strong>

                                    <span>Completed</span>
                                </div>

                                <div className="activity-stat posted-stat">
                                    <span className="activity-icon">▣</span>

                                    <strong>
                                        {stats.postedGigs ?? 0}
                                    </strong>

                                    <span>Posted</span>
                                </div>

                            </div>
                        </section>

                        {/* Recent Gigs */}
                        <section className="profile-card recent-gigs-card">
                            <div className="profile-section-heading">
                                <div className="section-title">
                                    <span>📦</span>
                                    <h2>Recent Gigs</h2>
                                </div>
                            </div>

                            {recentGigs.length === 0 ? (
                                <div className="empty-gigs">
                                    <span>📦</span>
                                    <p>No gigs yet</p>
                                    <small>
                                        Their posted gigs will appear here.
                                    </small>
                                </div>
                            ) : (
                                <div className="recent-gigs-list">
                                    {recentGigs.map((gig) => (
                                        <div
                                            key={gig.id}
                                            className="recent-gig"
                                        >
                                            <div className="recent-gig-icon">
                                                ✦
                                            </div>

                                            <div className="recent-gig-info">
                                                <strong>{gig.title}</strong>
                                                <span>
                                                    ₹{gig.budget}
                                                </span>
                                            </div>

                                            <span
                                                className={`gig-status status-${gig.status.toLowerCase()}`}
                                            >
                                                {getStatusLabel(gig.status)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                    </aside>
                </div>
            </main>
        </div>
    );
}

export default UserProfilePage;
