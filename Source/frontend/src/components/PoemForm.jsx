import { useEffect, useState } from 'react';
import { api } from '../api';

function PoemForm({ authors, genres, editingPoem, setEditingPoem, onSaved }) {
  const [form, setForm] = useState({
    title: '',
    text: '',
    author_id: '',
    genre_id: '',
    rating: '',
  });

  useEffect(() => {
    if (editingPoem) {
      const author = authors.find((item) => item.full_name === editingPoem.author);
      const genre = genres.find((item) => item.name === editingPoem.genre);

      setForm({
        title: editingPoem.title,
        text: editingPoem.text,
        author_id: author ? author.id : '',
        genre_id: genre ? genre.id : '',
        rating: editingPoem.rating || '',
      });
    }
  }, [editingPoem, authors, genres]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm({
      ...form,
      [name]: value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const data = {
      title: form.title,
      text: form.text,
      author_id: Number(form.author_id),
      genre_id: Number(form.genre_id),
      rating: form.rating ? Number(form.rating) : undefined,
    };

    if (editingPoem) {
      await api.patch(`/poems/${editingPoem.id}`, data);
    } else {
      await api.post('/poems', data);
    }

    setForm({
      title: '',
      text: '',
      author_id: '',
      genre_id: '',
      rating: '',
    });

    setEditingPoem(null);
    onSaved();
  }

  function cancelEdit() {
    setForm({
      title: '',
      text: '',
      author_id: '',
      genre_id: '',
      rating: '',
    });

    setEditingPoem(null);
  }

  return (
    <section className="card">
      <h2>{editingPoem ? 'Редактирование стихотворения' : 'Добавление стихотворения'}</h2>

      <form onSubmit={handleSubmit} className="form">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Название"
          required
        />

        <textarea
          name="text"
          value={form.text}
          onChange={handleChange}
          placeholder="Текст стихотворения"
          required
        />

        <select name="author_id" value={form.author_id} onChange={handleChange} required>
          <option value="">Выберите автора</option>
          {authors.map((author) => (
            <option key={author.id} value={author.id}>
              {author.full_name}
            </option>
          ))}
        </select>

        <select name="genre_id" value={form.genre_id} onChange={handleChange} required>
          <option value="">Выберите жанр</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>

        <select name="rating" value={form.rating} onChange={handleChange}>
          <option value="">Оценка не указана</option>
          <option value="1">1 — плохо</option>
          <option value="2">2 — слабо</option>
          <option value="3">3 — нормально</option>
          <option value="4">4 — хорошо</option>
          <option value="5">5 — отлично</option>
        </select>

        <div className="actions">
          <button type="submit">
            {editingPoem ? 'Сохранить изменения' : 'Добавить стихотворение'}
          </button>

          {editingPoem && (
            <button type="button" onClick={cancelEdit} className="secondary">
              Отмена
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

export default PoemForm;