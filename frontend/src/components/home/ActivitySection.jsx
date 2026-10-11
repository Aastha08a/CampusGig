import './ActivitySection.css';

function ActivitySection() {
    return (
        <section className="activity-section">

            <div className="activity-heading">
                <h2>Your activity</h2>
                <p>Keep track of your gigs and applications.</p>
            </div>

            <div className="activity-grid">

                {/* Applications */}
                <div className="activity-card applications-card">

                    <div className="activity-main">
                        <div className="activity-icon">
                            ✓
                        </div>

                        <div className="activity-info">
                            <span className="activity-label">
                                My Applications
                            </span>

                            <strong>
                                4 active
                            </strong>

                            <span className="activity-subtitle">
                                2 viewed this week
                            </span>
                        </div>
                    </div>

                    <a href="/applications" className="activity-link">
                        View applications →
                    </a>

                </div>


                {/* Posted Gigs */}
                <div className="activity-card posted-card">

                    <div className="activity-main">
                        <div className="activity-icon">
                            +
                        </div>

                        <div className="activity-info">
                            <span className="activity-label">
                                My Posted Gigs
                            </span>

                            <strong>
                                2 live gigs
                            </strong>

                            <span className="activity-subtitle">
                                12 new applicants
                            </span>
                        </div>
                    </div>

                    <a href="/my-gigs" className="activity-link">
                        View my gigs →
                    </a>

                </div>


                {/* Saved Gigs */}
                <div className="activity-card saved-card">

                    <div className="activity-main">
                        <div className="activity-icon">
                            ♡
                        </div>

                        <div className="activity-info">
                            <span className="activity-label">
                                Saved Gigs
                            </span>

                            <strong>
                                5 saved
                            </strong>

                            <span className="activity-subtitle">
                                Discover later
                            </span>
                        </div>
                    </div>

                    <a href="/saved-gigs" className="activity-link">
                        View saved gigs →
                    </a>

                </div>

            </div>

        </section>
    );
}

export default ActivitySection;