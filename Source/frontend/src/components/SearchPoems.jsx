import { useEffect, useState } from 'react';

function SearchPoems({ onSearch, onReset }) {
  const [search, setSearch] = useState(localStorage.getItem('lastSearch') || '');

  useEffect(() => {
    if (search) {
      onSearch(search);
    }
  }, []);

  function handleSearch() {
    localStorage.setItem('lastSearch', search);
    onSearch(search);
  }

  function handleReset() {
    setSearch('');
    localStorage.removeItem('lastSearch');
    onReset();
  }

  return (
    <section className="card">
      <h2>Поиск стихотворений</h2>

      <div className="search-row">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Введите название стихотворения"
        />

        <button onClick={handleSearch}>Найти</button>

        <button onClick={handleReset} className="secondary">
          Сбросить
        </button>
      </div>
    </section>
  );
}

export default SearchPoems;