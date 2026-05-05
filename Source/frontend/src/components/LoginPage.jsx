import { useState } from 'react';
import { api } from '../api';

function LoginPage({ onLogin }) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await api.post('/auth/login', {
        login,
        password,
      });

      const user = response.data;

      localStorage.setItem('username', user.login);
      localStorage.setItem('role', user.role);

      onLogin(user.login, user.role);
    } catch {
      setError('Неверный логин или пароль');
    }
  }

  return (
    <div className="login-page">
      <form onSubmit={handleSubmit} className="login-card">
        <h1>Вход</h1>

        <p className="hint">
          Администратор: admin / admin123. Пользователей создаёт администратор.
        </p>

        <input
          value={login}
          onChange={(event) => setLogin(event.target.value)}
          placeholder="Логин"
          required
        />

        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Пароль"
          required
        />

        {error && <p className="error">{error}</p>}

        <button type="submit">Войти</button>
      </form>
    </div>
  );
}

export default LoginPage;