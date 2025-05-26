import api from '.';

export const fetchMe = async () => (await api.get('auth/me')).data;
