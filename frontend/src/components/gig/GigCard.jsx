import { useNavigate } from 'react-router-dom';

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

function GigCard({ gig }) {
    const categoryIcons = {
        DESIGN: faBrush,
        CODING: faCode,
        CONTENT: faPenToSquare,
        EVENTS: faCalendar,
        TUTORING: faBookOpen,
        MARKETING: faLocationArrow,
        OTHER: faBars,
    };
    const navigate = useNavigate();

    return (
        <div className="browse-gig-card">

            <div className="browse-gig-card-top">
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

                <span className="browse-gig-budget">
                    ₹{gig.budget}
                </span>
            </div>

            <h3>{gig.title}</h3>

            <p className="browse-gig-description">
                {gig.description}
            </p>

            <div className="browse-gig-meta">
                {gig.workMode && (
                    <span>
                        {gig.workMode.replace('_', ' ')}
                    </span>
                )}

                {gig.dueDate && (
                    <span>
                        Apply by{' '}
                        {new Date(gig.dueDate).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                        })}
                    </span>
                )}
            </div>

            <div className="browse-gig-skills">
                {gig.skills?.map((item) => (
                    <span key={item.skillId}>
                        {item.skill.name}
                    </span>
                ))}
            </div>

            <div className="browse-gig-footer">
                <span>
                    Posted by {gig.postedBy?.name || 'Unknown'}
                </span>

                <span>
                    {gig._count?.applications || 0} applications
                </span>
            </div>

            <button
                className="browse-view-button"
                onClick={() => navigate(`/gigs/${gig.id}`)}
            >
                View Gig
            </button>

        </div>
    );
}

export default GigCard;