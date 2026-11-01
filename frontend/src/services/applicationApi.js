import api from './api';

export async function applyToGig(gigId, pitchMessage) {
    const response = await api.post(
        `/gigs/${gigId}/applications`,
        {
            pitchMessage,
        }
    );

    return response.data;
}

export async function getMyApplications() {
    const response = await api.get('/users/me/applications');

    return response.data;
}

export async function getGigApplications(gigId) {
    const response = await api.get(
        `/gigs/${gigId}/applications`
    );

    return response.data;
}

export async function updateApplicationStatus(applicationId, status) {
    const response = await api.patch(
        `/applications/${applicationId}`,
        { status }
    );

    return response.data;
}

export async function withdrawApplication(applicationId) {
    const response = await api.delete(
        `/applications/${applicationId}`
    );

    return response.data;
}