
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Navbar from '../components/home/Navbar';

import {
    getGigApplications,
    updateApplicationStatus,
} from '../services/applicationApi';

import './GigApplicantsPage.css';

function GigApplicantsPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [gig, setGig] = useState(null);
    const [applications, setApplications] = useState([]);
    const [activeFilter, setActiveFilter] = useState('ALL');
    const [selectedPitch, setSelectedPitch] = useState(null);

    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    async function loadApplications() {
        try {
            setLoading(true);
            setError('');

            const data = await getGigApplications(id);

            setGig(data.gig);
            setApplications(data.applications);
        } catch (error) {
            console.error(error);
            setError(
                error.response?.data?.message ||
                'Failed to load applicants.'
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadApplications();
    }, [id]);

    async function handleDecision(applicationId, status) {
        try {
            setUpdatingId(applicationId);
            setError('');
            setSuccess('');

            const updatedApplication = await updateApplicationStatus(
                applicationId,
                status
            );

            setApplications((current) =>
                current.map((application) =>
                    application.id === applicationId
                        ? { ...application, ...updatedApplication }
                        : application
                )
            );

            setSuccess(
                status === 'ACCEPTED'
                    ? 'Applicant accepted successfully.'
                    : 'Applicant rejected successfully.'
            );

            // Refresh to reflect automatic rejections and gig status changes.
            await loadApplications();
        } catch (error) {
            console.error(error);
            setError(
                error.response?.data?.message ||
                'Failed to update application.'
            );
        } finally {
            setUpdatingId(null);
        }
    }

    const counts = {
        ALL: applications.length,
        PENDING: applications.filter((a) => a.status === 'PENDING').length,
        ACCEPTED: applications.filter((a) => a.status === 'ACCEPTED').length,
        REJECTED: applications.filter((a) => a.status === 'REJECTED').length,
    };

    const filteredApplications =
        activeFilter === 'ALL'
            ? applications
            : applications.filter((a) => a.status === activeFilter);

    const acceptedCount = counts.ACCEPTED;
    const spots = gig?.spots ?? 1;
    const remainingSpots = Math.max(0, spots - acceptedCount);
    const gigIsClosed = ['IN_PROGRESS', 'COMPLETED', 'CANCELLED'].includes(
        gig?.status
    );

    if (loading && !gig) {
        return (
            <>
                <Navbar />
                <main className="my-applications-page">
                    <p>Loading applicants...</p>
                </main>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <main className="my-applications-page">
                <div className="my-applications-header">
                    <span className="my-applications-label">
                        Your gig · Gig Applicants
                    </span>

                    <h1>{gig?.title || 'Gig Applicants'}</h1>

                    {gig && (
                        <p>
                            {counts.ALL} applications · {acceptedCount} positions filled
                            {remainingSpots > 0
                                ? ` · ${remainingSpots} ${remainingSpots === 1 ? 'position' : 'positions'} remaining`
                                : ' · All positions filled'}
                        </p>
                    )}
                </div>

                {error && (
                    <p className="form-error" role="alert">
                        {error}
                    </p>
                )}

                {success && (
                    <p role="status">
                        {success}
                    </p>
                )}

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
                                activeFilter === value ? 'active' : ''
                            }`}
                            onClick={() => setActiveFilter(value)}
                        >
                            {label}
                            <span>{counts[value]}</span>
                        </button>
                    ))}
                </div>

                {filteredApplications.length === 0 ? (
                    <div className="my-applications-empty">
                        <h2>
                            {activeFilter === 'ALL'
                                ? 'No applicants yet'
                                : `No ${activeFilter.toLowerCase()} applicants`}
                        </h2>

                        <p>
                            {activeFilter === 'ALL'
                                ? 'Applications for this gig will appear here.'
                                : 'There are no applicants in this category.'}
                        </p>
                    </div>
                ) : (
                    <div className="applications-grid">
                        {filteredApplications.map((application) => {
                            const applicant = application.applicant;
                            const category = 'OTHER';

                            const applicantSkills = applicant?.skills || [];

                            const skillNames = applicantSkills
                                .map((item) => item.skill?.name)
                                .filter(Boolean);

                            const isPending = application.status === 'PENDING';
                            const isUpdating = updatingId === application.id;

                            return (
                                <article
                                    className={`application-card application-card-${application.status.toLowerCase()}`}
                                    key={application.id}
                                >
                                    <div className="application-card-top">
                                        <span
                                            className={`application-category application-category-${category.toLowerCase()}`}
                                        >
                                            Applicant
                                        </span>

                                        <span
                                            className={`application-status application-status-${application.status.toLowerCase()}`}
                                        >
                                            ● {application.status.charAt(0) +
                                                application.status.slice(1).toLowerCase()}
                                        </span>
                                    </div>

                                    <h2>
                                        {applicant?.name || 'Unknown applicant'}
                                    </h2>

                                    {/* <p>
                                        {applicant?.university || 'University not provided'}
                                    </p> */}

                                    {applicant?.bio && (
                                        <p className="applicant-bio">
                                            {applicant.bio}
                                        </p>
                                    )}

                                    <div className="application-details">
                                      <span>
                                          Applied{' '}
                                          {new Date(application.createdAt).toLocaleDateString('en-IN', {
                                              day: 'numeric',
                                              month: 'short',
                                          })}
                                      </span>
                                    </div>

                                    <div className="applicant-card-actions">
                                        <button
                                            className="application-pitch-button"
                                            onClick={() => setSelectedPitch(application)}
                                        >
                                            View Pitch
                                        </button>

                                        <button
                                            className="application-view-button"
                                            onClick={() =>
                                                navigate(`/users/${applicant?.id}`)
                                            }
                                        >
                                            View Profile
                                        </button>

                                        {isPending && !gigIsClosed && (
                                            <div className="applicant-decision-actions">
                                                <button
                                                    className="applicant-accept-button"
                                                    disabled={isUpdating}
                                                    onClick={() =>
                                                        handleDecision(
                                                            application.id,
                                                            'ACCEPTED'
                                                        )
                                                    }
                                                >
                                                    {isUpdating ? 'Updating...' : 'Accept'}
                                                </button>

                                                <button
                                                    className="applicant-reject-button"
                                                    disabled={isUpdating}
                                                    onClick={() =>
                                                        handleDecision(
                                                            application.id,
                                                            'REJECTED'
                                                        )
                                                    }
                                                >
                                                    {isUpdating ? 'Updating...' : 'Reject'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}

                {selectedPitch && (
                    <div
                        className="pitch-modal-overlay"
                        onClick={() => setSelectedPitch(null)}
                    >
                        <div
                            className="pitch-modal"
                            onClick={(event) => event.stopPropagation()}
                        >
                            <button
                                className="pitch-modal-close"
                                onClick={() => setSelectedPitch(null)}
                                aria-label="Close pitch"
                            >
                                ×
                            </button>

                            <span className="my-applications-label">
                                Applicant pitch
                            </span>

                            <h2>
                                {selectedPitch.applicant?.name || 'Applicant'}
                            </h2>

                            <h3>Why they want this gig</h3>

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

export default GigApplicantsPage;
