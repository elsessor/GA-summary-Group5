import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type Props = {
	children: React.ReactNode;
};

const ProtectedRoute: React.FC<Props> = ({ children }) => {
	const { user } = useAuth();
	const location = useLocation();
	if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
	return <>{children}</>;
};

export default ProtectedRoute;


