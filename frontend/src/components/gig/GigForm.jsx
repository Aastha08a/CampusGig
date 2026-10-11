import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getSkills } from '../../services/gigApi';

import {
    faBrush,
    faCode,
    faPenToSquare,
    faBookOpen,
    faLocationArrow,
    faBars,
} from '@fortawesome/free-solid-svg-icons';

import { faCalendar } from '@fortawesome/free-regular-svg-icons';

const categories = [
    {
        value: 'DESIGN',
        label: 'Design',
        icon: faBrush,
    },
    {
        value: 'CODING',
        label: 'Coding',
        icon: faCode,
    },
    {
        value: 'CONTENT',
        label: 'Content',
        icon: faPenToSquare,
    },
    {
        value: 'EVENTS',
        label: 'Events',
        icon: faCalendar,
    },
    {
        value: 'TUTORING',
        label: 'Tutoring',
        icon: faBookOpen,
    },
    {
        value: 'MARKETING',
        label: 'Marketing',
        icon: faLocationArrow,
    },
    {
        value: 'OTHER',
        label: 'Other',
        icon: faBars,
    },
];

const workModes = [
    {
        value: 'ONLINE',
        label: 'Online',
        icon: '◎',
    },
    {
        value: 'ON_CAMPUS',
        label: 'On Campus',
        icon: '⌂',
    },
    {
        value: 'HYBRID',
        label: 'Hybrid',
        icon: '< >',
    },
];

function GigForm({
    initialData = null,
    onSubmit,
    submitText = 'Create Gig',
}) {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [whatYoullDo, setWhatYoullDo] = useState('');
    const [budget, setBudget] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [workMode, setWorkMode] = useState('');
    const [duration, setDuration] = useState('');

    const [skills, setSkills] = useState([]);
    const [skillIds, setSkillIds] = useState([]);

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [skillsLoading, setSkillsLoading] = useState(true);

    useEffect(() => {
        async function loadSkills() {
            try {
                const data = await getSkills();
                setSkills(data);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    'Failed to load skills.'
                );
            } finally {
                setSkillsLoading(false);
            }
        }

        loadSkills();
    }, []);

    useEffect(() => {
        if (!initialData) {
            return;
        }

        setTitle(initialData.title || '');
        setCategory(initialData.category || '');
        setDescription(initialData.description || '');
        setWhatYoullDo(initialData.whatYoullDo || '');
        setBudget(initialData.budget ?? '');
        setWorkMode(initialData.workMode || '');
        setDuration(initialData.duration || '');

        if (initialData.dueDate) {
            setDueDate(
                initialData.dueDate.split('T')[0]
            );
        }

        setSkillIds(
            initialData.skills?.map(
                (gigSkill) => gigSkill.skill.id
            ) || []
        );
    }, [initialData]);

    function toggleSkill(skillId) {
        setSkillIds((currentIds) => {
            if (currentIds.includes(skillId)) {
                return currentIds.filter(
                    (id) => id !== skillId
                );
            }

            return [...currentIds, skillId];
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        setError('');

        if (!title.trim()) {
            setError('Please enter a gig title.');
            return;
        }

        if (!category) {
            setError('Please select a category.');
            return;
        }

        if (!description.trim()) {
            setError('Please enter a description.');
            return;
        }

        if (budget === '' || Number(budget) < 0) {
            setError('Please enter a valid budget.');
            return;
        }

        if (!dueDate) {
            setError('Please select an application deadline.');
            return;
        }

        try {
            setLoading(true);

            await onSubmit({
                title: title.trim(),
                category,
                description: description.trim(),
                whatYoullDo: whatYoullDo.trim() || null,
                budget: Number(budget),
                dueDate,
                workMode: workMode || null,
                duration: duration.trim() || null,
                skillIds,
            });
        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Something went wrong.'
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="gig-form"
        >

            {/* =========================
                01 THE BASICS
            ========================== */}

            <section className="gig-form-card">

                <div className="gig-form-section-header">
                    <span className="gig-form-number">
                        01
                    </span>

                    <h2>
                        The basics
                    </h2>
                </div>


                {/* TITLE */}

                <div className="gig-form-field">

                    <label htmlFor="gig-title">
                        Gig title
                        <span className="required-star">
                            *
                        </span>
                    </label>

                    <input
                        id="gig-title"
                        type="text"
                        value={title}
                        onChange={(e) =>
                            setTitle(e.target.value)
                        }
                        placeholder="e.g. Design posters for Spring Fest"
                    />

                </div>


                {/* CATEGORY */}

                <div className="gig-form-field">

                    <label>
                        Category
                        <span className="required-star">
                            *
                        </span>
                    </label>

                    <div className="category-options">

                        {categories.map((item) => (

                            <button
                                key={item.value}
                                type="button"
                                className={`category-option ${
                                    category === item.value
                                        ? 'selected'
                                        : ''
                                }`}
                                onClick={() =>
                                    setCategory(item.value)
                                }
                            >
                                <span className="category-option-icon">
                                    <FontAwesomeIcon icon={item.icon} />
                                </span>

                                {item.label}
                            </button>

                        ))}

                    </div>

                </div>

            </section>


            {/* =========================
                02 TELL STUDENTS WHAT TO DO
            ========================== */}

            <section className="gig-form-card">

                <div className="gig-form-section-header">
                    <span className="gig-form-number">
                        02
                    </span>

                    <h2>
                        Tell students what to do
                    </h2>
                </div>


                {/* DESCRIPTION */}

                <div className="gig-form-field">

                    <div className="gig-form-label-row">
                        <label htmlFor="gig-description">
                            Description
                            <span className="required-star">
                                *
                            </span>
                        </label>

                        <span className="character-count">
                            {description.length}/600
                        </span>
                    </div>

                    <textarea
                        id="gig-description"
                        value={description}
                        maxLength={600}
                        onChange={(e) =>
                            setDescription(e.target.value)
                        }
                        placeholder="Describe what the gig involves, what you're looking for, and what the student will work on..."
                        rows="7"
                    />

                </div>


                {/* WHAT YOU'LL DO */}

                <div className="gig-form-field">

                    <div className="gig-form-label-row">

                        <label htmlFor="gig-what-youll-do">
                            What you'll do
                        </label>

                        <span className="character-count">
                            {whatYoullDo.length}/1000
                        </span>

                    </div>

                    <textarea
                        id="gig-what-youll-do"
                        value={whatYoullDo}
                        maxLength={1000}
                        onChange={(e) =>
                            setWhatYoullDo(e.target.value)
                        }
                        placeholder="List the main tasks, deliverables, or expectations..."
                        rows="6"
                    />

                </div>


                {/* SKILLS */}

                <div className="gig-form-field">

                    <div className="gig-form-label-row">

                        <label>
                            Skills required
                        </label>

                        <span className="skill-helper">
                            Select all that apply
                        </span>

                    </div>


                    {skillsLoading ? (

                        <p className="skills-loading">
                            Loading skills...
                        </p>

                    ) : (

                        <div className="skill-options">

                            {skills.map((skill) => {

                                const selected =
                                    skillIds.includes(skill.id);

                                return (
                                    <button
                                        key={skill.id}
                                        type="button"
                                        className={`skill-option ${
                                            selected
                                                ? 'selected'
                                                : ''
                                        }`}
                                        onClick={() =>
                                            toggleSkill(skill.id)
                                        }
                                    >
                                        {skill.name}
                                    </button>
                                );
                            })}

                        </div>

                    )}

                </div>

            </section>


            {/* =========================
                03 LOGISTICS
            ========================== */}

            <section className="gig-form-card">

                <div className="gig-form-section-header">

                    <span className="gig-form-number">
                        03
                    </span>

                    <h2>
                        Logistics
                    </h2>

                </div>


                {/* BUDGET + DEADLINE */}

                <div className="gig-form-two-column">

                    <div className="gig-form-field">

                        <label htmlFor="gig-budget">
                            Budget / Payment
                            <span className="required-star">
                                *
                            </span>
                        </label>

                        <div className="budget-input">

                            <span className="currency-symbol">
                                ₹
                            </span>

                            <input
                                id="gig-budget"
                                type="number"
                                min="0"
                                value={budget}
                                onChange={(e) =>
                                    setBudget(e.target.value)
                                }
                                placeholder="e.g. 3500"
                            />

                        </div>

                    </div>


                    <div className="gig-form-field">

                        <label htmlFor="gig-due-date">
                            Application deadline
                            <span className="required-star">
                                *
                            </span>
                        </label>

                        <input
                            id="gig-due-date"
                            type="date"
                            value={dueDate}
                            onChange={(e) =>
                                setDueDate(e.target.value)
                            }
                        />

                    </div>

                </div>


                {/* WORK MODE */}

                <div className="gig-form-field">

                    <label>
                        Work mode
                    </label>

                    <div className="work-mode-options">

                        {workModes.map((mode) => (

                            <button
                                key={mode.value}
                                type="button"
                                className={`work-mode-option ${
                                    workMode === mode.value
                                        ? 'selected'
                                        : ''
                                }`}
                                onClick={() =>
                                    setWorkMode(mode.value)
                                }
                            >
                                <span>
                                    {mode.icon}
                                </span>

                                {mode.label}
                            </button>

                        ))}

                    </div>

                </div>


                {/* DURATION */}

                <div className="gig-form-field">

                    <label htmlFor="gig-duration">
                        Duration
                    </label>

                    <input
                        id="gig-duration"
                        type="text"
                        value={duration}
                        onChange={(e) =>
                            setDuration(e.target.value)
                        }
                        placeholder="e.g. 5–7 days"
                    />

                </div>

            </section>


            {/* ERROR */}

            {error && (
                <p className="gig-form-error">
                    {error}
                </p>
            )}


            {/* SUBMIT */}

            <div className="gig-form-footer">

                <button
                    type="submit"
                    className="gig-form-submit"
                    disabled={loading}
                >
                    {loading
                        ? 'Saving...'
                        : submitText}
                </button>

            </div>

        </form>
    );
}

export default GigForm;