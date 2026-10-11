import { useState } from 'react';
import { applyToGig } from '../../services/applicationApi';

import './ApplyModal.css';

function ApplyModal({ gig, onClose, onSuccess }) {
    const [pitchMessage, setPitchMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(event) {
        event.preventDefault();

        if (!pitchMessage.trim()) {
            setError('Please write a short pitch before applying.');
            return;
        }

        try {
            setLoading(true);
            setError('');

            await applyToGig(
                gig.id,
                pitchMessage
            );

            onSuccess();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Failed to submit application.'
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="apply-modal-overlay">
            <div className="apply-modal">

                <div className="apply-modal-header">
                    <div>
                        <span className="apply-modal-label">
                            Apply to gig
                        </span>

                        <h2>{gig.title}</h2>
                    </div>

                    <button
                        type="button"
                        className="apply-modal-close"
                        onClick={onClose}
                        disabled={loading}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit}>

                    <div className="form-field">
                        <label htmlFor="pitchMessage">
                            Your pitch
                        </label>

                        <textarea
                            id="pitchMessage"
                            value={pitchMessage}
                            onChange={(event) =>
                                setPitchMessage(event.target.value)
                            }
                            placeholder="Tell the client why you're a good fit for this gig..."
                            rows={6}
                            disabled={loading}
                        />
                    </div>

                    {error && (
                        <p className="form-error">
                            {error}
                        </p>
                    )}

                    <div className="apply-modal-actions">

                        <button
                            type="button"
                            className="secondary-button"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="primary-button"
                            disabled={loading}
                        >
                            {loading
                                ? 'Applying...'
                                : 'Submit Application'}
                        </button>

                    </div>

                </form>

            </div>
        </div>
    );
}

export default ApplyModal;