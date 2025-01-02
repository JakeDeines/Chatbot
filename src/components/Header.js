import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import '../styles/Header.css'; // Import the CSS file for styling

const Header = () => {
  const { error, setError } = useAuth();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 6000); // Clear error message after 2 seconds

      return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }
  }, [error, setError]);

  return (
    <header className="navbar">
      <h1>Chatbot App</h1>
      <nav>
        <Link to="/login">Login</Link>
        <Link to="/chatbot">Chatbot</Link>
      </nav>
      {error && <p className={`error ${error ? 'fade-out' : ''}`}>{error}</p>}
    </header>
  );
}

export default Header;
