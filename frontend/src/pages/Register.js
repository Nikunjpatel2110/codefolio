import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const onSubmit = async (formData) => {
    setServerError('');
    try {
      await registerUser(formData);
      navigate('/dashboard');
    } catch (err) {
      setServerError(err?.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit(onSubmit)}>
        <h1>Create your CodeFolio</h1>

        <label>Username (this becomes your URL)</label>
        <input
          placeholder="jane-dev"
          {...register('username', {
            required: true,
            pattern: /^[a-z0-9-]+$/,
          })}
        />
        {errors.username && (
          <span className="field-error">Lowercase letters, numbers, hyphens only</span>
        )}

        <label>Full name</label>
        <input {...register('name', { required: true })} />

        <label>Email</label>
        <input type="email" {...register('email', { required: true })} />

        <label>Password</label>
        <input type="password" {...register('password', { required: true, minLength: 6 })} />
        {errors.password && <span className="field-error">At least 6 characters</span>}

        {serverError && <p className="server-error">{serverError}</p>}

        <button type="submit">Create account</button>
        <p>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}
