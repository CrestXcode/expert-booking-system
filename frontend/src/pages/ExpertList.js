import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

const CATEGORIES = ['All', 'Technology', 'Finance', 'Health', 'Legal', 'Business', 'Education', 'Design', 'Marketing'];

export default function ExpertList() {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchExperts();
  }, [search, category, page]);

  const fetchExperts = async () => {
    try {
      setLoading(true);
      setError('');
      const params = { page, limit: 6 };
      if (search) params.search = search;
      if (category) params.category = category;

      const { data } = await API.get('/experts', { params });
      setExperts(data.experts);
      setPagination(data.pagination);
    } catch (err) {
      setError('Failed to load experts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCategory = (cat) => {
    setCategory(cat === 'All' ? '' : cat);
    setPage(1);
  };

  return (
    <div>
      <div className="expert-list-header">
        <h1>Find an Expert</h1>
        <p>Book a session with top professionals across industries</p>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={handleSearch}
        />
      </div>

      <div className="category-filters">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`filter-btn ${(category === cat || (cat === 'All' && !category)) ? 'active' : ''}`}
            onClick={() => handleCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading && <div className="loading">Loading experts...</div>}
      {error && <div className="error-box">{error}</div>}

      {!loading && !error && (
        <>
          {experts.length === 0 ? (
            <div className="loading">No experts found. Try a different search.</div>
          ) : (
            <div className="experts-grid">
              {experts.map((expert) => (
                <div key={expert._id} className="card expert-card">
                  <div className="expert-card-top">
                    <div className="expert-avatar">{expert.name.charAt(0)}</div>
                    <div className="expert-name-block">
                      <h3>{expert.name}</h3>
                      <span className="expert-category">{expert.category}</span>
                    </div>
                  </div>

                  <p className="expert-bio">{expert.bio}</p>

                  <div className="expert-meta">
                    <div className="meta-item">
                      <div className="meta-value">{expert.rating}</div>
                      <div className="meta-label">Rating</div>
                    </div>
                    <div className="meta-item">
                      <div className="meta-value">{expert.experience} yrs</div>
                      <div className="meta-label">Experience</div>
                    </div>
                    <div className="meta-item">
                      <div className="meta-value">₹{expert.hourlyRate}</div>
                      <div className="meta-label">Per Hour</div>
                    </div>
                  </div>

                  <button
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                    onClick={() => navigate(`/experts/${expert._id}`)}
                  >
                    View Profile
                  </button>
                </div>
              ))}
            </div>
          )}

          {pagination.pages > 1 && (
            <div className="pagination">
              <button
                className="btn btn-secondary"
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
              >
                Prev
              </button>
              <span>Page {page} of {pagination.pages}</span>
              <button
                className="btn btn-secondary"
                onClick={() => setPage((p) => p + 1)}
                disabled={page === pagination.pages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}