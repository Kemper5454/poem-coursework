function PoemsList({ poems, isAdmin, onEdit, onDelete }) {
    return (
      <section className="card">
        <h2>Список стихотворений</h2>
  
        {!isAdmin && (
          <p className="hint">
            Вы вошли как пользователь. Доступен только просмотр и поиск стихотворений.
          </p>
        )}
  
        <div className="poems-list">
          {poems.map((poem) => (
            <div className="poem-card" key={poem.id}>
              <h3>{poem.title}</h3>
  
              <p className="meta">
                Автор: {poem.author || '—'} | Жанр: {poem.genre || '—'} | Оценка:{' '}
                {poem.rating || '—'}
              </p>
  
              <p>{poem.text}</p>
  
              {isAdmin && (
                <div className="actions">
                  <button onClick={() => onEdit(poem)}>Редактировать</button>
  
                  <button onClick={() => onDelete(poem.id)} className="danger">
                    Удалить
                  </button>
                </div>
              )}
            </div>
          ))}
  
          {poems.length === 0 && <p>Стихотворения не найдены.</p>}
        </div>
      </section>
    );
  }
  
  export default PoemsList;