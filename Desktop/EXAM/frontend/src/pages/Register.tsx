import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const registerSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(6, 'Password must be at least 6 characters'),
	confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
	message: 'Passwords do not match',
	path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

const RegisterPage: React.FC = () => {
	const { register: registerUser, loading } = useAuth();
	const navigate = useNavigate();
	const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

	const onSubmit = async (data: RegisterForm) => {
		await registerUser(data.email, data.password);
		navigate('/tasks');
	};

return (
		<div className="login-page">
			<div className="login-split">
				<div className="login-card">
					<h2 className="login-title">Register</h2>
					<form onSubmit={handleSubmit(onSubmit)}>
						<label className="login-label">Email</label>
						<input className="login-input" type="email" {...register('email')} />
						{errors.email && <div className="login-error">{errors.email.message}</div>}

						<label className="login-label">Password</label>
						<input className="login-input" type="password" {...register('password')} />
						{errors.password && <div className="login-error">{errors.password.message}</div>}

						<label className="login-label">Confirm password</label>
						<input className="login-input" type="password" {...register('confirmPassword')} />
						{errors.confirmPassword && <div className="login-error">{errors.confirmPassword.message}</div>}

						<button className="login-button" type="submit" disabled={loading}>
							{loading ? 'Creating account...' : 'Register'}
						</button>
					</form>
					<p className="login-link">Already have an account? <Link to="/login">Login</Link></p>
				</div>
			</div>
		</div>
);
};

export default RegisterPage;


