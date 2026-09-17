import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const onSubmit = async (formData) => {
    setServerError('');
    try {
      await login(formData.emailOrUsername, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setServerError(err?.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit(onSubmit)}>
        <h1>Log in to CodeFolio</h1>

        <label>Email or username</label>
        <input {...register('emailOrUsername', { required: true })} />
        {errors.emailOrUsername && <span className="field-error">Required</span>}

        <label>Password</label>
        <input type="password" {...register('password', { required: true })} />
        {errors.password && <span className="field-error">Required</span>}

        {serverError && <p className="server-error">{serverError}</p>}

        <button type="submit">Log in</button>
        <p>
          New here? <Link to="/register">Create an account</Link>
        </p>
        <p className="hint">Try the demo: demo1 / demo1234 or demo2 / demo1234</p>
      </form>
    </div>
  );
}
