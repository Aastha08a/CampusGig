import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Navbar from '../components/home/Navbar';

import GigForm from '../components/gig/GigForm';
import { getGig, updateGig } from '../services/gigApi';

import './Gig.css';


function EditGigPage() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [gig, setGig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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

    async function handleUpdate(data) {
        await updateGig(id, data);
        navigate('/gigs/my');
    }

    if (loading) {
        return (
            <div className="gig-page">
                <div className="gig-page-container">
                    <p>Loading gig...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="gig-page">
                <div className="gig-page-container">
                    <div className="gig-error">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="gig-page">
            <div className="gig-page-container">

                <div className="gig-breadcrumb">
                    <span>Home</span>
                    <span className="gig-breadcrumb-arrow">›</span>
                    <span>My Gigs</span>
                    <span className="gig-breadcrumb-arrow">›</span>
                    <span className="gig-breadcrumb-current">
                        Edit Gig
                    </span>
                </div>

                <div className="gig-page-header">
                    <div>
                        <h1>Edit Gig</h1>
                        <p>
                            Update the details of your gig.
                        </p>
                    </div>
                </div>

                <div className="gig-form-layout">
                    <GigForm
                        initialData={gig}
                        onSubmit={handleUpdate}
                        submitText="Save Changes"
                    />

                    <aside className="gig-form-sidebar">
                        <h3>✏️ Editing your gig</h3>

                        <p>
                            Make sure the title, description and budget accurately reflect what you're looking for.
                        </p>

                        <div className="gig-tip">
                            <span className="gig-tip-icon">✓</span>
                            <span>
                                Keep your description clear and specific.
                            </span>
                        </div>

                        <div className="gig-tip">
                            <span className="gig-tip-icon">₹</span>
                            <span>
                                Update the budget if the project requirements change.
                            </span>
                        </div>
                    </aside>
                </div>

            </div>
        </div>
    );
}

export default EditGigPage;