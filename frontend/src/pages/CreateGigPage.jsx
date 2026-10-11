import { useNavigate } from 'react-router-dom';

import Navbar from '../components/home/Navbar';
import GigForm from '../components/gig/GigForm';
import { createGig } from '../services/gigApi';

import './gig.css';

function CreateGigPage() {
    const navigate = useNavigate();

    async function handleCreateGig(data) {
        const gig = await createGig(data);

        navigate(`/gigs/${gig.id}`);
    }

    return (
        <div className="gig-page">

            <Navbar />

            <main className="gig-page-container">

                <div className="gig-breadcrumb">
                    <span>Home</span>
                    <span className="gig-breadcrumb-arrow">›</span>
                    <span className="gig-breadcrumb-current">
                        Post a Gig
                    </span>
                </div>

                <div className="gig-page-header">
                    <div>
                        <h1>Post a Gig</h1>
                        <p>
                            Find the right student for your project.
                        </p>
                    </div>
                </div>

                <div className="gig-form-layout">

                    <GigForm
                        onSubmit={handleCreateGig}
                        submitText="Post Gig"
                    />

                    <aside className="gig-form-sidebar">

                        <h3>💡 Tips for a great post</h3>

                        <div className="gig-tip">
                            <span className="gig-tip-icon">
                                🎯
                            </span>

                            <span>
                                Be specific about what you need
                                and what the student will deliver.
                            </span>
                        </div>

                        <div className="gig-tip">
                            <span className="gig-tip-icon">
                                💰
                            </span>

                            <span>
                                A clear and fair budget helps
                                attract better applicants.
                            </span>
                        </div>

                        <div className="gig-tip">
                            <span className="gig-tip-icon">
                                🛠️
                            </span>

                            <span>
                                Mention the skills or tools
                                required for the work.
                            </span>
                        </div>

                    </aside>

                </div>

            </main>

        </div>
    );
}

export default CreateGigPage;