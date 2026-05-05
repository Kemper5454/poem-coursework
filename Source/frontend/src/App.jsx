import { useEffect, useState } from 'react';
import { api } from './api';
import LoginPage from './components/LoginPage';
import SearchPoems from './components/SearchPoems';
import PoemsList from './components/PoemsList';
import PoemForm from './components/PoemForm';
import AuthorForm from './components/AuthorForm';
import Statistics from './components/Statistics';
import UsersBlock from './components/UsersBlock';
import './App.css';

function App() {
  const [poems, setPoems] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [authorStats, setAuthorStats] = useState([]);

  const [editingPoem, setEditingPoem] = useState(null);
  const [editingAuthor, setEditingAuthor] = useState(null);

  const [role, setRole] = useState(localStorage.getItem('role') || '');
  const [username, setUsername] = useState(localStorage.getItem('username') || '');

  const isAdmin = role === 'admin';

  async function loadData() {
    const poemsResponse = await api.get('/poems');
    const authorsResponse = await api.get('/authors');
    const genresResponse = await api.get('/genres');
    const ratingsResponse = await api.get('/poems/rating');
    const authorStatsResponse = await api.get('/authors/stats');

    setPoems(poemsResponse.data);
    setAuthors(authorsResponse.data);
    setGenres(genresResponse.data);
    setRatings(ratingsResponse.data);
    setAuthorStats(authorStatsResponse.data);
  }

  useEffect(() => {
    if (role) {
      loadData();
    }
  }, [role]);

  function login(name, selectedRole) {
    setUsername(name);
    setRole(selectedRole);
  }

  function logout() {
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('lastSearch');

    setUsername('');
    setRole('');
  }

  async function searchPoems(title) {
    if (!title.trim()) {
      loadData();
      return;
    }

    localStorage.setItem('lastSearch', title);

    const response = await api.get(`/poems/search?title=${title}`);
    setPoems(response.data);
  }

  async function deletePoem(id) {
    await api.delete(`/poems/${id}`);
    loadData();
  }

  async function deleteAuthor(id) {
    await api.delete(`/authors/${id}`);
    loadData();
  }

  if (!role) {
    return <LoginPage onLogin={login} />;
  }

  return (
    <div className="page">
      <header className="header">
        <h1>Каталог стихотворений</h1>
        <p>Клиент-серверное приложение на React, NestJS и PostgreSQL</p>

        <div className="user-panel">
          <span>
            Пользователь: <strong>{username}</strong>
          </span>

          <span>
            Роль: <strong>{isAdmin ? 'Администратор' : 'Пользователь'}</strong>
          </span>

          <button onClick={logout} className="secondary">
            Выйти
          </button>
        </div>
      </header>

      <main className="content">
        <SearchPoems onSearch={searchPoems} onReset={loadData} />

        <PoemsList
          poems={poems}
          isAdmin={isAdmin}
          onEdit={setEditingPoem}
          onDelete={deletePoem}
        />

        {isAdmin && (
          <>
            <PoemForm
              authors={authors}
              genres={genres}
              editingPoem={editingPoem}
              setEditingPoem={setEditingPoem}
              onSaved={loadData}
            />

            <AuthorForm
              authors={authors}
              editingAuthor={editingAuthor}
              setEditingAuthor={setEditingAuthor}
              onSaved={loadData}
              onEdit={setEditingAuthor}
              onDelete={deleteAuthor}
            />

            <UsersBlock />

            <Statistics
              poems={poems}
              authors={authors}
              ratings={ratings}
              authorStats={authorStats}
            />
          </>
        )}
      </main>
    </div>
  );
}

export default App;