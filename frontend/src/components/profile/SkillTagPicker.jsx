import { useState } from 'react';
import {
    addUserSkills,
    getMyProfile,
} from '../../services/userApi';

const availableSkills = [
    {
        id: 'fcff16b3-584f-422d-b013-ff5856ab6e55',
        name: 'Web Development',
    },
    {
        id: '8c3b5811-c5b8-4216-af2b-17f9c179503b',
        name: 'UI/UX Design',
    },
    {
        id: '6b1cee71-0fdf-4da1-a1c1-acdd028ad895',
        name: 'Graphic Design',
    },
    {
        id: 'd5c59574-c286-41be-93a2-b4cb1db23216',
        name: 'Programming',
    },
    {
        id: '431cce59-7640-4f93-81b4-2ff8d152dd37',
        name: 'Data Analysis',
    },
    {
        id: '08e7a2c4-dcbe-4e13-9d0e-b2fca5499ae0',
        name: 'Content Writing',
    },
    {
        id: 'ed541348-3583-4240-8651-9305d6062b87',
        name: 'Video Editing',
    },
    {
        id: '1bd0565c-df3d-4560-8208-7f44ee69ec17',
        name: 'Photography',
    },
    {
        id: 'b93b2c3e-1114-4e16-9190-e1bc29847065',
        name: 'Social Media',
    },
    {
        id: '89b4c4e1-0f97-4d7e-b653-5b7fb52c11bc',
        name: 'Marketing',
    },
    {
        id: 'c905055f-dc0c-427a-b091-7c6510a9cb70',
        name: 'Tutoring',
    },
    {
        id: 'ac303ebb-a039-46f9-8c74-eac9123e2c6d',
        name: 'Event Management',
    },
];

function SkillTagPicker({ profile, onUpdated }) {
    const [selectedSkillIds, setSelectedSkillIds] = useState(
        profile.skills.map((skill) => skill.id)
    );

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const toggleSkill = (skillId) => {
        setSelectedSkillIds((current) => {
            if (current.includes(skillId)) {
                return current.filter((id) => id !== skillId);
            }

            return [...current, skillId];
        });
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setError('');

            console.log('SELECTED SKILL IDS:', selectedSkillIds);

            const response = await addUserSkills(selectedSkillIds);

            console.log('POST RESPONSE:', response);

            const updatedProfile = await getMyProfile();

            console.log('UPDATED PROFILE:', updatedProfile);

            setSelectedSkillIds(
                updatedProfile.skills.map((skill) => skill.id)
            );

            onUpdated(updatedProfile);
        } catch (error) {
            console.error('SKILL SAVE ERROR:', error);

            setError(
                error.response?.data?.message ||
                'Failed to update skills.'
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <section>
            <h2>Select your skills</h2>

            <div>
                {availableSkills.map((skill) => {
                    const isSelected =
                        selectedSkillIds.includes(skill.id);

                    return (
                        <button
                            key={skill.id}
                            type="button"
                            onClick={() => toggleSkill(skill.id)}
                        >
                            {skill.name}
                            {isSelected ? ' ✓' : ''}
                        </button>
                    );
                })}
            </div>

            {error && <p>{error}</p>}

            <button
                type="button"
                onClick={() => {
                    handleSave();
                }}
                disabled={saving}
            >
                {saving ? 'Saving...' : 'Save Skills'}
            </button>
        </section>
    );
}

export default SkillTagPicker;