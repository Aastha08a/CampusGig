import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Navbar from '../components/home/Navbar';

import {
    getMyApplications,
    withdrawApplication,
} from '../services/applicationApi';

import './MyApplicationsPage.css';

function MyApplicationsPage() {
    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);
    const [activeFilter, setActiveFilter] = useState('ALL');
    const [selectedPitch, setSelectedPitch] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    async function loadApplications() {
        try {
            setLoading(true);
            setError('');

            const data = await getMyApplications();

            setApplications(data);
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                'Failed to load applications.'
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadApplications();
    }, []);

    async function handleWithdraw(applicationId) {
        try {
            await withdrawApplication(applicationId);

            setApplications((currentApplications) =>
                currentApplications.filter(
                    (application) =>
                        application.id !== applicationId
                )
            );
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                'Failed to withdraw application.'
            );
        }
    }

    const filteredApplications =
        activeFilter === 'ALL'
            ? applications
            : applications.filter(
                (application) =>
                    application.status === activeFilter
            );

    const counts = {
        ALL: applications.length,

        PENDING: applications.filter(
            (application) =>
                application.status === 'PENDING'
        ).length,

        ACCEPTED: applications.filter(
            (application) =>
                application.status === 'ACCEPTED'
        ).length,

        REJECTED: applications.filter(
            (application) =>
                application.status === 'REJECTED'
        ).length,
    };

    if (loading) {
        return (
            <>
                <Navbar />

                <main className="my-applications-page">
                    <p>Loading applications...</p>
                </main>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <main className="my-applications-page">

                {/* HEADER */}

                <div className="my-applications-header">
                    <span className="my-applications-label">
                        Your activity
                    </span>

                    <h1>My Applications</h1>

                    <p>
                        Keep track of the gigs you've applied to.
                    </p>
                </div>


                {/* STATUS FILTERS */}

                <div className="application-filters">

                    {[
                        ['ALL', 'All'],
                        ['PENDING', 'Pending'],
                        ['ACCEPTED', 'Accepted'],
                        ['REJECTED', 'Rejected'],
                    ].map(([value, label]) => (
                        <button
                            key={value}
                            className={`application-filter ${
                                activeFilter === value
                                    ? 'active'
                                    : ''
                            }`}
                            onClick={() =>
                                setActiveFilter(value)
                            }
                        >
                            {label}

                            <span>
                                {counts[value]}
                            </span>
                        </button>
                    ))}

                </div>


                {/* ERROR */}

                {error && (
                    <p className="form-error">
                        {error}
                    </p>
                )}


                {/* APPLICATIONS */}

                {filteredApplications.length === 0 ? (

                    <div className="my-applications-empty">
                        <h2>
                            {activeFilter === 'ALL'
                                ? 'No applications yet'
                                : `No ${activeFilter.toLowerCase()} applications`}
                        </h2>

                        <p>
                            {activeFilter === 'ALL'
                                ? 'Applications you submit will appear here.'
                                : 'There are no applications in this category.'}
                        </p>
                    </div>

                ) : (

                    <div className="applications-grid">

                        {filteredApplications.map(
                            (application) => {

                                const gig =
                                    application.gig;

                                const category =
                                    gig?.category || 'OTHER';

                                return (
                                    <div
                                        className={`application-card application-card-${application.status.toLowerCase()}`}
                                        key={application.id}
                                    >

                                        {/* TOP */}

                                        <div className="application-card-top">

                                            <span
                                                className={`application-category application-category-${category.toLowerCase()}`}
                                            >
                                                {category
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    category
                                                        .slice(1)
                                                        .toLowerCase()}
                                            </span>

                                            <span
                                                className={`application-status application-status-${application.status.toLowerCase()}`}
                                            >
                                                ●{' '}
                                                {application.status
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    application.status
                                                        .slice(1)
                                                        .toLowerCase()}
                                            </span>

                                        </div>


                                        {/* TITLE */}

                                        <h2>
                                            {gig?.title ||
                                                'Gig unavailable'}
                                        </h2>


                                        {/* PITCH */}

                                        <div className="application-pitch">

                                            <span>
                                                Your pitch
                                            </span>

                                            <p>
                                                {application.message ||
                                                    'No pitch provided.'}
                                            </p>

                                        </div>


                                        {/* DETAILS */}

                                        <div className="application-details">

                                            <span>
                                                ₹{gig?.budget}
                                            </span>

                                            {gig?.dueDate && (
                                                <span>
                                                    Apply by{' '}
                                                    {new Date(
                                                        gig.dueDate
                                                    ).toLocaleDateString(
                                                        'en-IN',
                                                        {
                                                            day: 'numeric',
                                                            month: 'long',
                                                        }
                                                    )}
                                                </span>
                                            )}

                                            <span>
                                                Applied{' '}
                                                {new Date(
                                                    application.createdAt
                                                ).toLocaleDateString(
                                                    'en-IN',
                                                    {
                                                        day: 'numeric',
                                                        month: 'short',
                                                    }
                                                )}
                                            </span>

                                        </div>


                                        {/* ACTIONS */}

                                        <div className="application-card-actions">

                                            <button
                                                className="application-view-button"
                                                onClick={() =>
                                                    navigate(
                                                        `/gigs/${gig.id}`
                                                    )
                                                }
                                            >
                                                View Gig
                                            </button>

                                            <button
                                                className="application-pitch-button"
                                                onClick={() => setSelectedPitch(application)}
                                            >
                                                View Pitch
                                            </button>

                                            {application.status ===
                                                'PENDING' && (
                                                <button
                                                    className="application-withdraw-button"
                                                    onClick={() =>
                                                        handleWithdraw(
                                                            application.id
                                                        )
                                                    }
                                                >
                                                    Withdraw
                                                </button>
                                            )}

                                        </div>

                                    </div>
                                );
                            }
                        )}

                    </div>
                )}
                {selectedPitch && (
                    <div
                        className="pitch-modal-overlay"
                        onClick={() => setSelectedPitch(null)}
                    >
                        <div
                            className="pitch-modal"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className="pitch-modal-close"
                                onClick={() => setSelectedPitch(null)}
                                aria-label="Close pitch"
                            >
                                ×
                            </button>

                            <span className="my-applications-label">
                                Your application
                            </span>

                            <h2>{selectedPitch.gig?.title || 'Gig unavailable'}</h2>

                            <h3>Your pitch</h3>

                            <p className="pitch-modal-message">
                                {selectedPitch.message || 'No pitch provided.'}
                            </p>
                        </div>
                    </div>
                )}

            </main>
        </>
    );
}

export default MyApplicationsPage;