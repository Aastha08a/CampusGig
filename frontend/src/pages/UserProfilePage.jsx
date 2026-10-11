import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserProfile } from '../services/userApi';

function UserProfilePage() {
    const { id } = useParams();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchProfile() {
            try {
                setLoading(true);
                setError('');

                const data = await getUserProfile(id);

                setProfile(data);
            } catch (error) {
                console.error(error);

                setError(
                    error.response?.data?.message ||
                    'Failed to load profile.'
                );
            } finally {
                setLoading(false);
            }
        }

        fetchProfile();
    }, [id]);

    if (loading) {
        return <p>Loading profile...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <main>
            <section>
                <h1>{profile.name}</h1>

                <p>
                    {profile.bio || 'No bio added yet.'}
                </p>
            </section>

            <section>
                <h2>Skills</h2>

                {profile.skills.length === 0 ? (
                    <p>No skills added yet.</p>
                ) : (
                    <div>
                        {profile.skills.map((skill) => (
                            <span key={skill.id}>
                                {skill.name}
                            </span>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}

export default UserProfilePage;