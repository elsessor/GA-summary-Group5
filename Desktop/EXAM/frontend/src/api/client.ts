import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export function createApiClient(getToken: () => string | null): AxiosInstance {
	const instance = axios.create({
		baseURL: API_BASE_URL,
		headers: {
			'Content-Type': 'application/json',
		},
	});

	instance.interceptors.request.use((config: AxiosRequestConfig) => {
		const token = getToken();
		if (token) {
			config.headers = config.headers || {};
			(config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
		}
		return config;
	});

	return instance;
}

export type ApiClient = ReturnType<typeof createApiClient>;


