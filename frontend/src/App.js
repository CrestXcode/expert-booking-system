import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';
import ExpertList from './pages/ExpertList';
import ExpertDetail from './pages/ExpertDetail';
import BookingPage from './pages/BookingPage';
import MyBookings from './pages/MyBookings';
import './App.css';

function App() {
  return (
    <SocketProvider>
      <BrowserRouter>
        <nav className="navbar">
          <div className="nav-brand">Expert<span>Connect</span></div>
          <div className="nav-links">
            <NavLink to="/">Experts</NavLink>
            <NavLink to="/my-bookings">My Bookings</NavLink>
          </div>
        </nav>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<ExpertList />} />
            <Route path="/experts/:id" element={<ExpertDetail />} />
            <Route path="/booking/:id" element={<BookingPage />} />
            <Route path="/my-bookings" element={<MyBookings />} />
          </Routes>
        </main>
      </BrowserRouter>
    </SocketProvider>
  );
}

export default App;
