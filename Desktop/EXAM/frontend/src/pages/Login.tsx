import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const loginSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
	const { login, loading } = useAuth();
	const navigate = useNavigate();
	const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

	const onSubmit = async (data: LoginForm) => {
		await login(data.email, data.password);
		navigate('/tasks');
	};

return (
		<div className="login-page">
			<div className="login-split">
				<div className="login-card">
					<h2 className="login-title">LogIn</h2>
					<form onSubmit={handleSubmit(onSubmit)}>
						<label className="login-label">Email</label>
						<input className="login-input" type="email" {...register('email')} />
						{errors.email && <div className="login-error">{errors.email.message}</div>}

						<label className="login-label">Password</label>
						<input className="login-input" type="password" {...register('password')} />
						{errors.password && <div className="login-error">{errors.password.message}</div>}

						<button className="login-button" type="submit" disabled={loading}>
							{loading ? 'Signing in...' : 'LogIn'}
						</button>
					</form>
					<p className="login-link">No account? <Link to="/register">Create one</Link></p>
				</div>
			</div>
		</div>
);
};

export default LoginPage;


