import { useEffect, useState } from 'react';
import { getMyProfile } from '../../services/userApi';
import Navbar from '../home/Navbar';
import EditProfileForm from '../profile/EditProfileForm';
import SkillTagPicker from '../profile/SkillTagPicker';
import './Profile.css';

function ProfilePage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [isEditing, setIsEditing] = useState(false);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError('');

            const data = await getMyProfile();
            setProfile(data);
        } catch (error) {
            console.error(error);
            setError('Failed to load profile.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const openEditProfile = () => {
        setIsEditing(true);
    };

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
        return <p className="profile-loading">Loading profile...</p>;
    }

    if (error) {
        return <p className="profile-error">{error}</p>;
    }

    return (
        <div className="profile-page">
            <Navbar />

            <main className="profile-container">

                {/* Breadcrumb */}
                {/* <div className="profile-breadcrumb">
                    <span>Home</span>
                    <span className="breadcrumb-arrow">›</span>
                    <strong>My Profile</strong>
                </div> */}

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

                        <div className="profile-actions">
                            <button
                                type="button"
                                className="edit-profile-button"
                                onClick={openEditProfile}
                            >
                                ✎&nbsp; Edit Profile
                            </button>
                        </div>

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

                                {profile.stats.rating !== null && (
                                    <span>
                                        ⭐ {profile.stats.rating.toFixed(1)} rating
                                    </span>
                                )}
                            </div>

                            <p className="profile-email">
                                {profile.email}
                            </p>
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

                            {profile.skills.length === 0 ? (
                                <p className="empty-state">
                                    No skills added yet.
                                </p>
                            ) : (
                                <div className="skill-tags">
                                    {profile.skills.map((skill) => (
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

                                {/* LEFT: Reviews */}
                                <div className="reviews-main">

                                    <div className="reviews-heading">
                                        <div className="section-title">
                                            <span>☆</span>
                                            <h2>Reviews & Ratings</h2>
                                        </div>
                                    </div>

                                    {profile.reviews.length === 0 ? (
                                        <div className="no-reviews">
                                            {/* <span className="no-reviews-star">☆</span> */}

                                            <p>No reviews yet</p>

                                            <small>
                                                Reviews will appear here after
                                                completed gigs.
                                            </small>
                                        </div>
                                    ) : (
                                        <div className="reviews-list">

                                            {profile.reviews.map((review) => (
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


                                {/* RIGHT: Rating */}
                                <div className="review-rating-box">

                                    <span className="review-rating-icon">
                                        ☆
                                    </span>

                                    {profile.stats.rating !== null ? (
                                        <>
                                            <strong>
                                                {profile.stats.rating.toFixed(1)}
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
                                    {/* <span>📊</span> */}
                                    <h2>Gig Activity</h2>
                                </div>
                            </div>

                            <div className="activity-grid">

                                <div className="activity-stat completed-stat">
                                    <span className="activity-icon">✓</span>

                                    <strong>
                                        {profile.stats.completedGigs}
                                    </strong>

                                    <span>Completed</span>
                                </div>

                                <div className="activity-stat posted-stat">
                                    <span className="activity-icon">▣</span>

                                    <strong>
                                        {profile.stats.postedGigs}
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

                            {profile.recentGigs.length === 0 ? (
                                <div className="empty-gigs">
                                    <span>📦</span>
                                    <p>No gigs yet</p>
                                    <small>
                                        Your posted gigs will appear here.
                                    </small>
                                </div>
                            ) : (
                                <div className="recent-gigs-list">
                                    {profile.recentGigs.map((gig) => (
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

                {/* Edit Profile */}

                {isEditing && (
                    <div
                        className="edit-modal-overlay"
                        onClick={() => setIsEditing(false)}
                    >
                        <div
                            className="edit-modal"
                            onClick={(e) => e.stopPropagation()}
                        >

                            <div className="edit-modal-header">
                                <div>
                                    <span className="edit-modal-label">
                                        Profile
                                    </span>

                                    <h2>Edit Profile</h2>
                                </div>

                                <button
                                    type="button"
                                    className="close-edit-button"
                                    onClick={() => setIsEditing(false)}
                                >
                                    ×
                                </button>
                            </div>

                            <div className="edit-modal-body">

                                <EditProfileForm
                                    profile={profile}
                                    onUpdated={(updatedProfile) => {
                                        setProfile((currentProfile) => ({
                                            ...currentProfile,
                                            ...updatedProfile,
                                        }));
                                    }}
                                />

                                <div className="profile-divider" />

                                <SkillTagPicker
                                    profile={profile}
                                    onUpdated={(updatedProfile) => {
                                        setProfile(updatedProfile);
                                    }}
                                />

                            </div>

                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}

export default ProfilePage;