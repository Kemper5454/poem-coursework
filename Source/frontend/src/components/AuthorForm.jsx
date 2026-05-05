import { useEffect, useState } from 'react';
import { api } from '../api';

function AuthorForm({
  authors,
  editingAuthor,
  setEditingAuthor,
  onSaved,
  onEdit,
  onDelete,
}) {
  const [authorForm, setAuthorForm] = useState({
    full_name: '',
    birth_year: '',
    country: '',
  });

  useEffect(() => {
    if (editingAuthor) {
      setAuthorForm({
        full_name: editingAuthor.full_name,
        birth_year: editingAuthor.birth_year || '',
        country: editingAuthor.country || '',
      });
    }
  }, [editingAuthor]);

  function handleAuthorChange(event) {
    const { name, value } = event.target;

    setAuthorForm({
      ...authorForm,
      [name]: value,
    });
  }

  async function submitAuthor(event) {
    event.preventDefault();

    const data = {
      full_name: authorForm.full_name,
      birth_year: authorForm.birth_year ? Number(authorForm.birth_year) : null,
      country: authorForm.country,
    };

    if (editingAuthor) {
      await api.patch(`/authors/${editingAuthor.id}`, data);
    } else {
      await api.post('/authors', data);
    }

    setAuthorForm({
      full_name: '',
      birth_year: '',
      country: '',
    });

    setEditingAuthor(null);
    onSaved();
  }

  function cancelEdit() {
    setAuthorForm({
      full_name: '',
      birth_year: '',
      country: '',
    });

    setEditingAuthor(null);
  }

  return (
    <section className="card">
      <h2>{editingAuthor ? 'Редактирование автора' : 'Добавление автора'}</h2>

      <form onSubmit={submitAuthor} className="form">
        <input
          name="full_name"
          value={authorForm.full_name}
          onChange={handleAuthorChange}
          placeholder="ФИО автора"
          required
        />

        <input
          name="birth_year"
          value={authorForm.birth_year}
          onChange={handleAuthorChange}
          placeholder="Год рождения"
        />

        <input
          name="country"
          value={authorForm.country}
          onChange={handleAuthorChange}
          placeholder="Страна"
        />

        <div className="actions">
          <button type="submit">
            {editingAuthor ? 'Сохранить автора' : 'Добавить автора'}
          </button>

          {editingAuthor && (
            <button type="button" onClick={cancelEdit} className="secondary">
              Отмена
            </button>
          )}
        </div>
      </form>

      <h3>Список авторов</h3>

      <div className="poems-list">
        {authors.map((author) => (
          <div className="poem-card" key={author.id}>
            <h3>{author.full_name}</h3>

            <p>
              Год рождения: {author.birth_year || '—'} | Страна: {author.country || '—'}
            </p>

            <div className="actions">
              <button onClick={() => onEdit(author)}>Редактировать</button>

              <button onClick={() => onDelete(author.id)} className="danger">
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AuthorForm;