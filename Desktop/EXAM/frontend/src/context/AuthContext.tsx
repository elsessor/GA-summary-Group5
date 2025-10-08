import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { createApiClient, ApiClient } from '../api/client';

type AuthUser = {
	id: string;
	email: string;
};

type AuthContextValue = {
	user: AuthUser | null;
	loading: boolean;
	login: (email: string, password: string) => Promise<void>;
	register: (email: string, password: string) => Promise<void>;
	logout: () => void;
	api: ApiClient;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getStoredToken(): string | null {
	return localStorage.getItem('auth_token');
}

function setStoredToken(token: string | null): void {
	if (token) {
		localStorage.setItem('auth_token', token);
	} else {
		localStorage.removeItem('auth_token');
	}
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [token, setToken] = useState<string | null>(() => getStoredToken());
	const [user, setUser] = useState<AuthUser | null>(null);
	const [loading, setLoading] = useState<boolean>(false);

	const api = useMemo(() => createApiClient(() => token), [token]);

	useEffect(() => {
		setStoredToken(token);
	}, [token]);

	const fetchMe = useCallback(async () => {
		if (!token) {
			setUser(null);
			return;
		}
		try {
			const res = await api.get('/auth/me');
			setUser(res.data);
		} catch {
			setUser(null);
		}
	}, [api, token]);

	useEffect(() => {
		void fetchMe();
	}, [fetchMe]);

	const login = useCallback(async (email: string, password: string) => {
		setLoading(true);
		try {
			const res = await api.post('/auth/login', { email, password });
			setToken(res.data?.token ?? null);
			await fetchMe();
		} finally {
			setLoading(false);
		}
	}, [api, fetchMe]);

	const register = useCallback(async (email: string, password: string) => {
		setLoading(true);
		try {
			const res = await api.post('/auth/register', { email, password });
			setToken(res.data?.token ?? null);
			await fetchMe();
		} finally {
			setLoading(false);
		}
	}, [api, fetchMe]);

	const logout = useCallback(() => {
		setToken(null);
		setUser(null);
	}, []);

	const value = useMemo<AuthContextValue>(() => ({ user, loading, login, register, logout, api }), [user, loading, login, register, logout, api]);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error('useAuth must be used within AuthProvider');
	return ctx;
}


