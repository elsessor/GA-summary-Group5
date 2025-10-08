import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';

type Task = {
	id: string;
	title: string;
	description?: string;
	done: boolean;
};

type TaskForm = {
	title: string;
	description?: string;
};

const TasksPage: React.FC = () => {
	const { api, user, logout } = useAuth();
	const { register, handleSubmit, reset } = useForm<TaskForm>();
	const [tasks, setTasks] = useState<Task[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

	const canUse = useMemo(() => Boolean(user), [user]);

	const loadTasks = async () => {
		setLoading(true);
		try {
			const res = await api.get('/tasks');
			setTasks(res.data as Task[]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (canUse) void loadTasks();
	}, [canUse]);

	const onCreate = async (data: TaskForm) => {
		const res = await api.post('/tasks', data);
		setTasks((prev) => [res.data as Task, ...prev]);
		reset();
	};

	const onToggle = async (task: Task) => {
		const res = await api.put(`/tasks/${task.id}`, { ...task, done: !task.done });
		const updated = res.data as Task;
		setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
	};

	const onDelete = async (taskId: string) => {
		await api.delete(`/tasks/${taskId}`);
		setTasks((prev) => prev.filter((t) => t.id !== taskId));
	};

	if (!user) {
		return (
			<div style={{ maxWidth: 720, margin: '40px auto', padding: 24 }}>
				<p>You need to log in to manage tasks.</p>
			</div>
		);
	}

	return (
		<div style={{ maxWidth: 720, margin: '40px auto', padding: 24 }}>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<h2>Tasks</h2>
				<div>
					<span style={{ marginRight: 12 }}>{user.email}</span>
					<button onClick={logout}>Logout</button>
				</div>
			</div>

			<form onSubmit={handleSubmit(onCreate)} style={{ marginBottom: 16 }}>
				<input placeholder="Title" {...register('title', { required: true })} style={{ width: '100%', marginBottom: 8 }} />
				<textarea placeholder="Description (optional)" {...register('description')} style={{ width: '100%', marginBottom: 8 }} />
				<button type="submit">Add Task</button>
			</form>

			{loading ? (
				<p>Loading...</p>
			) : tasks.length === 0 ? (
				<p>No tasks yet.</p>
			) : (
				<ul style={{ listStyle: 'none', padding: 0 }}>
					{tasks.map((task) => (
						<li key={task.id} style={{ border: '1px solid #ddd', padding: 12, marginBottom: 8 }}>
							<div style={{ display: 'flex', justifyContent: 'space-between' }}>
								<div>
									<label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
										<input type="checkbox" checked={task.done} onChange={() => void onToggle(task)} />
										<strong style={{ textDecoration: task.done ? 'line-through' : 'none' }}>{task.title}</strong>
									</label>
									{task.description && <p style={{ margin: '6px 0 0 24px' }}>{task.description}</p>}
								</div>
								<button onClick={() => void onDelete(task.id)}>Delete</button>
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default TasksPage;


