import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from './pages/Register';
import LoginPage from './pages/Login';
import TasksPage from './pages/Tasks';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Navigate to="/tasks" replace />} />
				<Route path="/register" element={<RegisterPage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route
					path="/tasks"
					element={(
						<ProtectedRoute>
							<TasksPage />
						</ProtectedRoute>
					)}
				/>
				<Route path="*" element={<Navigate to="/tasks" replace />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
