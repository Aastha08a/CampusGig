import './Gig.css';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Navbar from '../components/home/Navbar';
import { getMyGigs, deleteGig } from '../services/gigApi';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
    faWallet,
    faUserGroup,
} from '@fortawesome/free-solid-svg-icons';

import {
    faBrush,
    faCode,
    faPenToSquare,
    faBookOpen,
    faLocationArrow,
    faBars,
} from '@fortawesome/free-solid-svg-icons';

import { faCalendar } from '@fortawesome/free-regular-svg-icons';

function MyGigsPage() {
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
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('ALL');

    const navigate = useNavigate();

    useEffect(() => {
        async function loadGigs() {
            try {
                const data = await getMyGigs();
                setGigs(data);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    'Failed to load your gigs.'
                );
            } finally {
                setLoading(false);
            }
        }

        loadGigs();
    }, []);

    async function handleDelete(gigId) {
        const confirmed = window.confirm(
            'Are you sure you want to cancel this gig?'
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteGig(gigId);

            setGigs((currentGigs) =>
                currentGigs.map((gig) =>
                    gig.id === gigId
                        ? { ...gig, status: 'CANCELLED' }
                        : gig
                )
            );
        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Failed to cancel gig.'
            );
        }
    }

    if (loading) {
        return (
            <div className="gig-page">
                <Navbar />

                <main className="gig-page-container">
                    <p>Loading your gigs...</p>
                </main>
            </div>
        );
    }

    const totalPosted = gigs.length;

    const activeGigs = gigs.filter(
        (gig) => gig.status === 'OPEN'
    );

    const completedGigs = gigs.filter(
        (gig) => gig.status === 'COMPLETED'
    );

    const deletedGigs = gigs.filter(
        (gig) => gig.status === 'CANCELLED'
    );

    let filteredGigs = gigs;

    if (activeTab === 'ACTIVE') {
        filteredGigs = activeGigs;
    }

    if (activeTab === 'COMPLETED') {
        filteredGigs = completedGigs;
    }

    if (activeTab === 'DELETED') {
        filteredGigs = deletedGigs;
    }

    const totalApplicants = gigs.reduce(
        (total, gig) =>
            total + (gig.applications?.length || 0),
        0
    );

    return (
        <div className="gig-page">

            <Navbar />

            <main className="gig-page-container">

                {/* PAGE HEADER */}
                <div className="gig-page-header">

                    <div>
                        <h1>My Gigs</h1>

                        <p>
                            Manage your posted gigs and track incoming applications.
                        </p>
                    </div>

                    <button
                        className="gig-primary-button"
                        onClick={() => navigate('/gigs/create')}
                    >
                        + Post a Gig
                    </button>

                </div>


                {/* ERROR */}
                {error && (
                    <div className="gig-error">
                        {error}
                    </div>
                )}


                {/* STATS */}
                <div className="gig-stats">

                    <div className="gig-stat gig-stat-yellow">
                        <span className="gig-stat-number">
                            {totalPosted}
                        </span>

                        <span className="gig-stat-label">
                            Total Posted
                        </span>
                    </div>


                    <div className="gig-stat gig-stat-green">
                        <span className="gig-stat-number">
                            {activeGigs.length}
                        </span>

                        <span className="gig-stat-label">
                            Active Gigs
                        </span>
                    </div>


                    <div className="gig-stat gig-stat-purple">
                        <span className="gig-stat-number">
                            {totalApplicants}
                        </span>

                        <span className="gig-stat-label">
                            Total Applicants
                        </span>
                    </div>

                </div>


                {/* FILTER TABS */}
                <div className="gig-tabs">

                    <button
                        className={
                            activeTab === 'ALL'
                                ? 'active'
                                : ''
                        }
                        onClick={() => setActiveTab('ALL')}
                    >
                        All
                        <span>{totalPosted}</span>
                    </button>


                    <button
                        className={
                            activeTab === 'ACTIVE'
                                ? 'active'
                                : ''
                        }
                        onClick={() => setActiveTab('ACTIVE')}
                    >
                        Active
                        <span>{activeGigs.length}</span>
                    </button>


                    <button
                        className={
                            activeTab === 'COMPLETED'
                                ? 'active'
                                : ''
                        }
                        onClick={() => setActiveTab('COMPLETED')}
                    >
                        Completed
                        <span>{completedGigs.length}</span>
                    </button>


                    <button
                        className={
                            activeTab === 'DELETED'
                                ? 'active'
                                : ''
                        }
                        onClick={() => setActiveTab('DELETED')}
                    >
                        Deleted
                        <span>{deletedGigs.length}</span>
                    </button>

                </div>


                {/* GIG LIST */}
                {filteredGigs.length === 0 ? (

                    <div className="gig-empty-state">

                        <div className="gig-empty-icon">
                            ✦
                        </div>

                        <h2>
                            No gigs here yet
                        </h2>

                        <p>
                            You don't have any gigs in this category.
                        </p>

                    </div>

                ) : (

                    <div className="my-gigs-list">

                        {filteredGigs.map((gig) => {

                            const isCancelled =
                                gig.status === 'CANCELLED';

                            return (

                                <div
                                    key={gig.id}
                                    className={`gig-card ${
                                        isCancelled ? 'cancelled' : ''
                                    }`}
                                >

                                    <div className="gig-card-header">

                                        <div className="gig-card-title-area">

                                            <div
                                                className={`gig-category gig-category-${gig.category?.toLowerCase()}`}
                                            >
                                                <span className="gig-category-icon">
                                                    <FontAwesomeIcon
                                                        icon={categoryIcons[gig.category]}
                                                    />
                                                </span>

                                                <span>
                                                    {gig.category
                                                        ? gig.category.charAt(0) +
                                                        gig.category.slice(1).toLowerCase()
                                                        : 'Category not set'}
                                                </span>
                                            </div>

                                            <h2>{gig.title}</h2>

                                        </div>

                                        <span
                                            className={`gig-status ${
                                                gig.status === 'OPEN'
                                                    ? 'gig-status-open'
                                                    : gig.status === 'CANCELLED'
                                                    ? 'gig-status-cancelled'
                                                    : gig.status === 'COMPLETED'
                                                    ? 'gig-status-completed'
                                                    : 'gig-status-progress'
                                            }`}
                                        >
                                            {gig.status === 'OPEN'
                                                ? 'Active'
                                                : gig.status === 'CANCELLED'
                                                ? 'Deleted'
                                                : gig.status.replace('_', ' ')}
                                        </span>

                                    </div>

                                    <p className="gig-card-description">
                                        {gig.description}
                                    </p>

                                    <div className="gig-card-details">

                                        <span>
                                            <FontAwesomeIcon
                                                icon={faWallet}
                                                className="gig-meta-icon"
                                            />{' '}
                                            <strong>₹{gig.budget}</strong>
                                        </span>

                                        <span>
                                            <FontAwesomeIcon
                                                icon={faCalendar}
                                                className="gig-meta-icon"
                                            />{' '}
                                            {gig.dueDate
                                                ? `Due ${new Date(
                                                    gig.dueDate
                                                ).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                })}`
                                                : 'No deadline'}
                                        </span>

                                        <span>
                                            <FontAwesomeIcon
                                                icon={faUserGroup}
                                                className="gig-meta-icon"
                                            />{' '}
                                            <strong>
                                                {gig._count?.applications || 0}
                                            </strong>{' '}
                                            applicants
                                        </span>

                                    </div>

                                    <div className="gig-card-divider" />

                                    <div className="gig-card-posted">
                                        Posted{' '}
                                        {new Date(
                                            gig.createdAt
                                        ).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </div>

                                    <div className="gig-card-actions">

                                        <button
                                            className="gig-secondary-button"
                                            onClick={() =>
                                                navigate(`/gigs/${gig.id}`)
                                            }
                                        >
                                            View
                                        </button>

                                        <button
                                            className="gig-secondary-button"
                                            onClick={() =>
                                                navigate(`/gigs/${gig.id}/edit`)
                                            }
                                            disabled={isCancelled}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="gig-danger-button"
                                            onClick={() =>
                                                handleDelete(gig.id)
                                            }
                                            disabled={isCancelled}
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>
                            );
                        })}

                    </div>
                )}

            </main>

        </div>
    );
}

export default MyGigsPage;