 import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Navbar from '../components/home/Navbar';
import { getGig } from '../services/gigApi';

import './gigDetail.css';

import ApplyModal from '../components/application/ApplyModal';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
    faBrush,
    faCode,
    faPenToSquare,
    faBookOpen,
    faLocationArrow,
    faBars,
    faWallet,
    faUserGroup,
    faLightbulb,
} from '@fortawesome/free-solid-svg-icons';

import { faCalendar } from '@fortawesome/free-regular-svg-icons';

const categoryLabels = {
    DESIGN: 'Design',
    CODING: 'Coding',
    CONTENT: 'Content',
    EVENTS: 'Events',
    TUTORING: 'Tutoring',
    MARKETING: 'Marketing',
    OTHER: 'Other',
};

const categoryIcons = {
    DESIGN: faBrush,
    CODING: faCode,
    CONTENT: faPenToSquare,
    EVENTS: faCalendar,
    TUTORING: faBookOpen,
    MARKETING: faLocationArrow,
    OTHER: faBars,
};

const workModeLabels = {
    ONLINE: 'Online',
    ON_CAMPUS: 'On Campus',
    HYBRID: 'Hybrid',
};

function formatDate(date) {
    if (!date) {
        return 'Not set';
    }

    return new Date(date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

function formatShortDate(date) {
    if (!date) {
        return 'No deadline';
    }

    return new Date(date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
    });
}

function getStatusClass(status) {
    if (status === 'OPEN') {
        return 'gig-status-open';
    }

    if (status === 'CANCELLED') {
        return 'gig-status-cancelled';
    }

    if (status === 'COMPLETED') {
        return 'gig-status-completed';
    }

    return 'gig-status-progress';
}

function GigDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [gig, setGig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showApplyModal, setShowApplyModal] = useState(false);

    useEffect(() => {
        async function loadGig() {
            try {
                const data = await getGig(id);
                setGig(data);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    'Failed to load gig.'
                );
            } finally {
                setLoading(false);
            }
        }

        loadGig();
    }, [id]);

    if (loading) {
        return (
            <div className="gig-page">
                <Navbar />

                <main className="gig-page-container">
                    <p>Loading gig...</p>
                </main>
            </div>
        );
    }

    if (error || !gig) {
        return (
            <div className="gig-page">
                <Navbar />

                <main className="gig-page-container">

                    <div className="gig-error">
                        {error || 'Gig not found.'}
                    </div>

                    <button
                        className="gig-secondary-button"
                        onClick={() => navigate(-1)}
                    >
                        ← Go Back
                    </button>

                </main>
            </div>
        );
    }

    const categoryName =
        categoryLabels[gig.category] || 'Category not set';

    const categoryIcon =
        categoryIcons[gig.category] || faBars;

    const workMode =
        workModeLabels[gig.workMode] || 'Not specified';

    const applicantCount =
        gig._count?.applications || 0;

    const skills =
        gig.skills?.map(
            (gigSkill) => gigSkill.skill
        ) || [];

    const tasks =
        gig.whatYoullDo
            ?.split('\n')
            .map((item) => item.trim())
            .filter(Boolean) || [];

    const isCancelled =
        gig.status === 'CANCELLED';

    return (
        <div className="gig-page">

            <Navbar />

            <main className="gig-page-container">

                {/* BREADCRUMB */}

                <div className="gig-breadcrumb">

                    <button
                        type="button"
                        className="gig-breadcrumb-back"
                        onClick={() => navigate(-1)}
                    >
                        Home
                    </button>

                    <span className="gig-breadcrumb-arrow">
                        ›
                    </span>

                    <span className="gig-breadcrumb-current">
                        {gig.title}
                    </span>

                </div>


                {/* HERO */}

                <section className="gig-detail-hero">

                    <div className="gig-detail-category-row">

                        <span
                            className={`gig-detail-category gig-category-${gig.category?.toLowerCase()}`}
                        >
                            <span className="gig-detail-category-icon">
                                <FontAwesomeIcon icon={categoryIcon} />
                            </span>

                            {categoryName}
                        </span>

                        <span className="gig-detail-posted">

                            Posted {formatDate(gig.createdAt)}

                        </span>

                    </div>


                    <h1 className="gig-detail-title">
                        {gig.title}
                    </h1>


                    <div className="gig-detail-summary">

                        <div className="gig-detail-summary">

                            <span>
                                ₹{gig.budget}
                            </span>

                            <span>
                                <FontAwesomeIcon
                                    icon={faCalendar}
                                    className="gig-detail-meta-icon"
                                />
                                Deadline: {formatShortDate(gig.dueDate)}
                            </span>

                            <span>
                                <FontAwesomeIcon
                                    icon={faUserGroup}
                                    className="gig-detail-meta-icon"
                                />
                                {applicantCount} applicants
                            </span>

                        </div>

                    </div>

                </section>


                {/* MAIN CONTENT */}

                <div className="gig-detail-layout">

                    <div className="gig-detail-main">


                        {/* ABOUT */}

                        <section className="gig-detail-section">

                            <h2>
                                About this gig
                            </h2>

                            <p className="gig-detail-description">
                                {gig.description}
                            </p>

                        </section>


                        {/* WHAT YOU'LL DO */}

                        {tasks.length > 0 && (

                            <section className="gig-detail-section">

                                <h2>
                                    What you'll do
                                </h2>

                                <div className="gig-task-list">

                                    {tasks.map(
                                        (task, index) => (
                                            <div
                                                key={index}
                                                className="gig-task"
                                            >
                                                <span className="gig-task-check">
                                                    ✓
                                                </span>

                                                <span>
                                                    {task}
                                                </span>
                                            </div>
                                        )
                                    )}

                                </div>

                            </section>

                        )}


                        {/* SKILLS */}

                        {skills.length > 0 && (

                            <section className="gig-detail-section">

                                <h2>
                                    Skills needed
                                </h2>

                                <div className="gig-detail-skills">

                                    {skills.map((skill) => (
                                        <span
                                            key={skill.id}
                                            className="gig-detail-skill"
                                        >
                                            {skill.name}
                                        </span>
                                    ))}

                                </div>

                            </section>

                        )}

                    </div>


                    {/* SIDEBAR */}

                    <aside className="gig-detail-sidebar">


                        {/* PAYMENT */}

                        <section className="gig-detail-side-card">

                            <span className="gig-detail-side-label">
                                Total payment
                            </span>

                            <strong className="gig-detail-payment">
                                ₹{gig.budget}
                            </strong>

                            <span className="gig-detail-side-subtext">
                                Fixed payment
                            </span>


                            <div className="gig-detail-info-list">

                                <div>
                                    <span>
                                        Deadline
                                    </span>

                                    <strong>
                                        {formatShortDate(gig.dueDate)}
                                    </strong>
                                </div>


                                <div>
                                    <span>
                                        Duration
                                    </span>

                                    <strong>
                                        {gig.duration || 'Not specified'}
                                    </strong>
                                </div>


                                <div>
                                    <span>
                                        Work mode
                                    </span>

                                    <strong>
                                        {workMode}
                                    </strong>
                                </div>


                                <div>
                                    <span>
                                        Applicants
                                    </span>

                                    <strong>
                                        {applicantCount} so far
                                    </strong>
                                </div>

                            </div>


                            <button
                                className="gig-dark-button gig-detail-apply-button"
                                disabled={
                                    isCancelled ||
                                    gig.status !== 'OPEN'
                                }
                                onClick={() => setShowApplyModal(true)}
                            >
                                {isCancelled
                                    ? 'Gig Cancelled'
                                    : gig.status === 'OPEN'
                                    ? 'Apply Now'
                                    : gig.status}
                            </button>

                        </section>


                        {/* POSTED BY */}

                        <section className="gig-detail-side-card">

                            <span className="gig-detail-side-label">
                                Posted by
                            </span>

                            <div className="gig-detail-user">

                                <div className="gig-detail-avatar">
                                    {gig.postedBy?.name
                                        ?.charAt(0)
                                        ?.toUpperCase()}
                                </div>

                                <div>

                                    <strong>
                                        {gig.postedBy?.name}
                                    </strong>

                                    <span>
                                        {gig.postedBy?.university}
                                    </span>

                                </div>

                            </div>

                        </section>


                        {/* QUICK INFO */}

                        <section className="gig-detail-tip">

                            <span className="gig-detail-tip-icon">
                                <FontAwesomeIcon icon={faLightbulb} />
                            </span>

                            <div>

                                <strong>
                                    Quick tip
                                </strong>

                                <p>
                                    Mention a relevant project or
                                    skill when you apply.
                                </p>

                            </div>

                        </section>

                    </aside>

                </div>

            </main>

            {showApplyModal && (
                <ApplyModal
                    gig={gig}
                    onClose={() => setShowApplyModal(false)}
                    onSuccess={() => {
                        setShowApplyModal(false);

                        setGig((currentGig) => ({
                            ...currentGig,
                            _count: {
                                ...currentGig._count,
                                applications:
                                    (currentGig._count?.applications || 0) + 1,
                            },
                        }));
                    }}
                />
            )}

        </div>
    );
}

export default GigDetailPage;