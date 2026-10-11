import { useState } from 'react';
import { updateMyProfile } from '../../services/userApi';

function EditProfileForm({ profile, onUpdated }) {
    const [name, setName] = useState(profile.name);
    const [bio, setBio] = useState(profile.bio || '');
    const [stream, setStream] = useState(profile.stream || '');
    const [year, setYear] = useState(profile.year || '');
    const [city, setCity] = useState(profile.city || '');

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError('');

            const updatedProfile = await updateMyProfile({
                name,
                bio,
                stream,
                year: Number(year),
                city,
            });

            onUpdated(updatedProfile);
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                'Failed to update profile.'
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <form className="profile-form" onSubmit={handleSubmit}>
            <div className="profile-section-heading">
                <div className="section-title">
                    <span>✎</span>
                    <h2>Edit Profile</h2>
                </div>
            </div>

            <div className="form-field">
                <label htmlFor="profile-name">Name</label>

                <input
                    id="profile-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div className="form-field">
                <label htmlFor="profile-stream">Stream</label>

                <input
                    id="profile-stream"
                    type="text"
                    value={stream}
                    onChange={(e) => setStream(e.target.value)}
                />
            </div>

            <div className="form-field">
                <label htmlFor="profile-year">Year</label>

                <select
                    id="profile-year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                >
                    <option value="">Select year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                </select>
            </div>

            <div className="form-field">
                <label htmlFor="profile-city">City</label>

                <input
                    id="profile-city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Chandigarh"
                />
            </div>

            <div className="form-field">
                <label htmlFor="profile-bio">Bio</label>

                <textarea
                    id="profile-bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell people a little about yourself..."
                />
            </div>

            {error && (
                <p className="form-error">
                    {error}
                </p>
            )}

            <button
                className="primary-button"
                type="submit"
                disabled={saving}
            >
                {saving ? 'Saving...' : 'Save Changes'}
            </button>
        </form>
    );
}

export default EditProfileForm;