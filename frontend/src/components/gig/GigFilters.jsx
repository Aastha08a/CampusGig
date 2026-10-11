import { useState } from 'react';

function GigFilters({ filters, onChange }) {
    const [filterOpen, setFilterOpen] = useState(false);
    const [selectedMinPay, setSelectedMinPay] = useState(
        filters.minPay || ''
    );

    const [selectedMaxPay, setSelectedMaxPay] = useState(
        filters.maxPay || ''
    );

    function handleSearchChange(event) {
        onChange({
            ...filters,
            q: event.target.value,
        });
    }

    function handleCategory(category) {
        onChange({
            ...filters,
            category,
        });
    }

    function applyMinPay() {
        onChange({
            ...filters,
            minPay: selectedMinPay,
            maxPay: selectedMaxPay,
        });

        setFilterOpen(false);
    }

    function handleSort(event) {
        onChange({
            ...filters,
            sort: event.target.value,
        });
    }

    return (
        <>
            {/* Search */}
            <div className="browse-search">
                <span className="browse-search-icon">⌕</span>

                <input
                    type="text"
                    placeholder="Search gigs, skills, categories..."
                    value={filters.q}
                    onChange={handleSearchChange}
                />

                <button type="button">
                    Search
                </button>
            </div>

            {/* Categories + Controls */}
            <div className="browse-toolbar">

                <div className="browse-categories">

                    <button
                        className={!filters.category ? 'active' : ''}
                        onClick={() => handleCategory('')}
                    >
                        All
                    </button>

                    <button
                        className={filters.category === 'DESIGN' ? 'active' : ''}
                        onClick={() => handleCategory('DESIGN')}
                    >
                        Design
                    </button>

                    <button
                        className={filters.category === 'CODING' ? 'active' : ''}
                        onClick={() => handleCategory('CODING')}
                    >
                        Coding
                    </button>

                    <button
                        className={filters.category === 'CONTENT' ? 'active' : ''}
                        onClick={() => handleCategory('CONTENT')}
                    >
                        Content
                    </button>

                    <button
                        className={filters.category === 'EVENTS' ? 'active' : ''}
                        onClick={() => handleCategory('EVENTS')}
                    >
                        Events
                    </button>

                    <button
                        className={filters.category === 'TUTORING' ? 'active' : ''}
                        onClick={() => handleCategory('TUTORING')}
                    >
                        Tutoring
                    </button>

                    <button
                        className={filters.category === 'MARKETING' ? 'active' : ''}
                        onClick={() => handleCategory('MARKETING')}
                    >
                        Marketing
                    </button>

                    <button
                        className={filters.category === 'OTHER' ? 'active' : ''}
                        onClick={() => handleCategory('OTHER')}
                    >
                        Other
                    </button>

                </div>

                <div className="browse-actions">

                    {/* Filter */}
                    <div className="browse-filter-wrapper">

                        <button
                            type="button"
                            className={`browse-control ${
                                filterOpen ? 'active' : ''
                            }`}
                            onClick={() => {
                                setSelectedMinPay(filters.minPay || '');
                                setSelectedMaxPay(filters.maxPay || '');
                                setFilterOpen(!filterOpen);
                            }}
                        >
                            ☷&nbsp; Filter
                        </button>

                        {filterOpen && (
                            <div className="browse-filter-menu">

                                <h4>PAYMENT</h4>

                                <label>
                                    <input
                                        type="radio"
                                        name="payRange"
                                        checked={
                                            selectedMinPay === '' &&
                                            selectedMaxPay === ''
                                        }
                                        onChange={() => {
                                            setSelectedMinPay('');
                                            setSelectedMaxPay('');
                                        }}
                                    />
                                    <span>Any amount</span>
                                </label>

                                <label>
                                    <input
                                        type="radio"
                                        name="payRange"
                                        checked={
                                            selectedMinPay === '100' &&
                                            selectedMaxPay === '200'
                                        }
                                        onChange={() => {
                                            setSelectedMinPay('100');
                                            setSelectedMaxPay('200');
                                        }}
                                    />
                                    <span>₹100–₹200</span>
                                </label>

                                <label>
                                    <input
                                        type="radio"
                                        name="payRange"
                                        checked={
                                            selectedMinPay === '200' &&
                                            selectedMaxPay === '500'
                                        }
                                        onChange={() => {
                                            setSelectedMinPay('200');
                                            setSelectedMaxPay('500');
                                        }}
                                    />
                                    <span>₹200–₹500</span>
                                </label>

                                <label>
                                    <input
                                        type="radio"
                                        name="payRange"
                                        checked={
                                            selectedMinPay === '500' &&
                                            selectedMaxPay === '1000'
                                        }
                                        onChange={() => {
                                            setSelectedMinPay('500');
                                            setSelectedMaxPay('1000');
                                        }}
                                    />
                                    <span>₹500–₹1,000</span>
                                </label>

                                <label>
                                    <input
                                        type="radio"
                                        name="payRange"
                                        checked={
                                            selectedMinPay === '1001' &&
                                            selectedMaxPay === ''
                                        }
                                        onChange={() => {
                                            setSelectedMinPay('1001');
                                            setSelectedMaxPay('');
                                        }}
                                    />
                                    <span>Over ₹1,000</span>
                                </label>

                                <button
                                    type="button"
                                    className="apply-filter-button"
                                    onClick={applyMinPay}
                                >
                                    Apply filters
                                </button>
                            </div>
                        )}

                    </div>

                    {/* Sort */}
                    <select
                        className="browse-sort"
                        value={filters.sort}
                        onChange={handleSort}
                    >
                        <option value="latest">Latest</option>
                        <option value="highestPay">
                            Highest Pay
                        </option>
                        <option value="deadlineSoon">
                            Deadline Soon
                        </option>
                        <option value="relevant">
                            Most Relevant
                        </option>
                    </select>

                </div>

            </div>
        </>
    );
}

export default GigFilters;