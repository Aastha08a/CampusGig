import { Link } from 'react-router-dom';
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

import './CategorySection.css';

const categories = [
    {
        name: 'Design',
        value: 'DESIGN',
        icon: faBrush,
        className: 'design',
    },
    {
        name: 'Coding',
        value: 'CODING',
        icon: faCode,
        className: 'coding',
    },
    {
        name: 'Content',
        value: 'CONTENT',
        icon: faPenToSquare,
        className: 'content',
    },
    {
        name: 'Events',
        value: 'EVENTS',
        icon: faCalendar,
        className: 'events',
    },
    {
        name: 'Tutoring',
        value: 'TUTORING',
        icon: faBookOpen,
        className: 'tutoring',
    },
    {
        name: 'Marketing',
        value: 'MARKETING',
        icon: faLocationArrow,
        className: 'marketing',
    },
    {
        name: 'Other',
        value: 'OTHER',
        icon: faBars,
        className: 'other',
    },
];

function CategorySection() {
    return (
        <section className="category-section">
            <h2>Explore by category</h2>

            <div className="category-grid">
                {categories.map((category) => (
                    <Link
                        to={`/browse?category=${category.value}`}
                        className={`category-card ${category.className}`}
                        key={category.name}
                    >
                        <span
                            className="category-icon"
                        >
                            <FontAwesomeIcon icon={category.icon} />
                        </span>

                        <span className="category-name">
                            {category.name}
                        </span>
                    </Link>
                ))}
            </div>
        </section>
    );
}

export default CategorySection;