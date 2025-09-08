import type { DashboardStatsData } from '../types/DashboardStatsData';
import axios from 'axios';

const API_URL = 'http://localhost:8088/api/dashboard';

export const getDashboardStats = async (): Promise<DashboardStatsData> => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('No auth token found');

    const response = await axios.get(`${API_URL}/stats`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};