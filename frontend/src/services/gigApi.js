import api from './api';

export async function createGig(data) {
    const response = await api.post('/gigs', data);
    return response.data;
}

export async function getGig(gigId) {
    const response = await api.get(`/gigs/${gigId}`);
    return response.data;
}

export async function updateGig(gigId, data) {
    const response = await api.patch(`/gigs/${gigId}`, data);
    return response.data;
}

export async function deleteGig(gigId) {
    const response = await api.delete(`/gigs/${gigId}`);
    return response.data;
}

export async function getMyGigs() {
    const response = await api.get('/gigs/my');
    return response.data;
}

export async function getSkills() {
    const response = await api.get('/skills');
    return response.data;
}

export async function getAllGigs(filters = {}) {
    const response = await api.get('/gigs', {
        params: filters,
    });

    return response.data;
}