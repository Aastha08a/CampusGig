import { useEffect, useState } from 'react';

import Navbar from '../components/home/Navbar';

import GigCard from '../components/gig/GigCard';
import GigFilters from '../components/gig/GigFilters';

import { getAllGigs } from '../services/gigApi';

import { useSearchParams } from 'react-router-dom';

import './Gig.css';

function BrowseGigsPage() {
    const [gigs, setGigs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [searchParams] = useSearchParams();

    const [filters, setFilters] = useState({
        q: searchParams.get('q') || '',
        category: searchParams.get('category') || '',
        skill: '',
        workMode: '',
        minPay: '',
        maxPay: '',
        sort: 'latest',
    });

    useEffect(() => {
        async function loadGigs() {
            try {
                setLoading(true);
                setError('');

                const cleanFilters = Object.fromEntries(
                    Object.entries(filters).filter(
                        ([, value]) => value !== ''
                    )
                );

                const data = await getAllGigs(cleanFilters);

                setGigs(data);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    'Failed to load gigs.'
                );
            } finally {
                setLoading(false);
            }
        }

        loadGigs();
    }, [filters]);

    function handleReset() {
        setFilters({
            q: '',
            category: '',
            skill: '',
            workMode: '',
            minPay: '',
            maxPay: '',
            sort: 'latest',
        });
    }

    return (
        <div className="gig-page">
            <Navbar />

            <main className="gig-page-container">

                <div className="gig-page-header">
                    <div>
                        <h1>Find your next gig</h1>
                        {!loading && !error && gigs.length > 0 && (
                            <p className="browse-results-count">
                                Showing <strong>{gigs.length}</strong> gigs
                            </p>
                        )}
                    </div>
                </div>

                <GigFilters
                    filters={filters}
                    onChange={setFilters}
                    onReset={handleReset}
                />

                {loading && (
                    <p>Loading gigs...</p>
                )}

                {error && (
                    <p className="gig-error">
                        {error}
                    </p>
                )}

                {!loading && !error && gigs.length === 0 && (
                    <div className="gig-empty">
                        <h3>No gigs found</h3>
                        <p>Try changing your filters.</p>
                    </div>
                )}

                {!loading && !error && gigs.length > 0 && (
                    <div className="browse-gigs-grid">
                        {gigs.map((gig) => (
                            <GigCard
                                key={gig.id}
                                gig={gig}
                            />
                        ))}
                    </div>
                )}

            </main>
        </div>
    );
}

export default BrowseGigsPage;