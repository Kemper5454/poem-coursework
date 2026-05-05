function Statistics({ poems, authors, ratings, authorStats }) {
    const poemsCount = poems.length;
    const authorsCount = authors.length;
  
    const averageRating =
      ratings.length > 0
        ? (
            ratings.reduce((sum, item) => sum + Number(item.average_rating), 0) /
            ratings.length
          ).toFixed(2)
        : 0;
  
    return (
      <section className="card">
        <h2>Статистика</h2>
  
        <div className="stats">
          <div className="stat-item">
            <strong>{poemsCount}</strong>
            <span>Стихотворений</span>
          </div>
  
          <div className="stat-item">
            <strong>{authorsCount}</strong>
            <span>Авторов</span>
          </div>
  
          <div className="stat-item">
            <strong>{averageRating}</strong>
            <span>Средняя оценка</span>
          </div>
        </div>
  
        <h3>Рейтинг стихотворений</h3>
  
        <table className="table">
          <thead>
            <tr>
              <th>Название</th>
              <th>Оценка</th>
              <th>Количество оценок</th>
            </tr>
          </thead>
  
          <tbody>
            {ratings.map((item) => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>{Number(item.average_rating).toFixed(2)}</td>
                <td>{item.reviews_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
  
        <h3>Статистика авторов</h3>
  
        <table className="table">
          <thead>
            <tr>
              <th>Автор</th>
              <th>Количество стихотворений</th>
            </tr>
          </thead>
  
          <tbody>
            {authorStats.map((item) => (
              <tr key={item.id}>
                <td>{item.full_name}</td>
                <td>{item.poems_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    );
  }
  
  export default Statistics;