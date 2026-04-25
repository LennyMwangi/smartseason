import { useState } from 'react';
import API from '../api/axios';

function Login({ setUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setSuccess(false);

    try {
      if (isLogin) {
        const res = await API.post('/auth/login', { email, password });

        localStorage.setItem('token', res.data.token);
        const payload = JSON.parse(atob(res.data.token.split('.')[1]));
        setUser(payload);

      } else {
        await API.post('/auth/register', {
          name,
          email,
          password,
          role: 'agent'
        });

        setSuccess(true);
        setIsLogin(true);
      }

    } catch (err) {
      setError('Something went wrong');
      setShake(true);

      setTimeout(() => setShake(false), 400);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">

      <div className={`glass-card rounded-2xl p-10 w-full max-w-md shadow-xl transition-all duration-500 ${shake ? 'shake' : ''}`}>

        <h2 className="text-2xl text-white text-center mb-4">
          {isLogin ? 'Login' : 'Register'}
        </h2>

        {!isLogin && (
          <input
            placeholder="Name"
            className="glass-input w-full p-3 mb-3 rounded"
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <input
          placeholder="Email"
          className="glass-input w-full p-3 mb-3 rounded"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="glass-input w-full p-3 mb-4 rounded"
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-400 mb-2">{error}</p>}

        {success && (
          <p className="text-green-400 mb-2 animate-bounce">
            Registration successful!
          </p>
        )}

        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-gradient-to-r from-indigo-500 to-cyan-400 text-white rounded-lg"
        >
          {isLogin ? 'Sign In' : 'Register'}
        </button>

        <p className="text-white/70 text-center mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span
            onClick={() => setIsLogin(!isLogin)}
            className="text-cyan-300 cursor-pointer ml-2"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </span>
        </p>

      </div>
    </div>
  );
}

export default Login;