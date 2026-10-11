import api from './api';

export async function getMyProfile() {
    const response = await api.get('/users/me');
    return response.data;
}

export async function updateMyProfile(data) {
    const response = await api.patch('/users/me', data);
    return response.data;
}

export async function getUserProfile(userId) {
    const response = await api.get(`/users/${userId}`);
    return response.data;
}

export async function addUserSkills(skillIds) {
    const response = await api.post('/users/me/skills', {
        skillIds,
    });
    return response.data;
}