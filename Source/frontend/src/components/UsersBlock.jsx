import { useEffect, useState } from 'react';
import { api } from '../api';

function UsersBlock() {
  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({
    login: '',
    password: '',
    role: 'user',
    name: '',
    email: '',
    age: '',
  });

  async function loadUsers() {
    const response = await api.get('/users');
    setUsers(response.data);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm({
      ...form,
      [name]: value,
    });
  }

  async function createUser(event) {
    event.preventDefault();

    const data = {
      login: form.login,
      password: form.password,
      role: form.role,
      name: form.name || undefined,
      email: form.email || undefined,
      age: form.age ? Number(form.age) : undefined,
    };

    try {
      await api.post('/users', data);

      setForm({
        login: '',
        password: '',
        role: 'user',
        name: '',
        email: '',
        age: '',
      });

      loadUsers();
    } catch {
      alert('Ошибка при создании пользователя. Проверьте логин и email.');
    }
  }

  return (
    <section className="card">
      <h2>Пользователи</h2>

      <p className="hint">
        Администратор может создавать пользователей для входа в приложение.
      </p>

      <form onSubmit={createUser} className="form">
        <input
          name="login"
          value={form.login}
          onChange={handleChange}
          placeholder="Логин"
          required
        />

        <input
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Пароль"
          required
        />

        <select name="role" value={form.role} onChange={handleChange}>
          <option value="user">Пользователь</option>
          <option value="admin">Администратор</option>
        </select>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Имя"
        />

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
        />

        <input
          name="age"
          value={form.age}
          onChange={handleChange}
          placeholder="Возраст"
        />

        <button type="submit">Создать пользователя</button>
      </form>

      <h3>Список пользователей</h3>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Логин</th>
            <th>Роль</th>
            <th>Имя</th>
            <th>Email</th>
            <th>Возраст</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.login}</td>
              <td>{user.role}</td>
              <td>{user.name || '—'}</td>
              <td>{user.email || '—'}</td>
              <td>{user.age || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default UsersBlock;