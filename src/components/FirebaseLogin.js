import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import '../styles/FirebaseLogin.css';
import { useAuth } from '../context/AuthProvider';

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { error, setError, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 6000); // Clear error message after 2 seconds

      return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }
  }, [error, setError]);

  const signInWithEmail = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      setError("Please enter all fields");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/chatbot'); // Redirect to chatbot after successful sign-in
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate('/chatbot'); // Redirect to chatbot after successful sign-in
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container">
      <form onSubmit={signInWithEmail} className="auth-form">
        <input
          className="auth-input"
          placeholder="Email..."
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="auth-input"
          placeholder="Password..."
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="auth-remember">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
          />
          <label>Remember Me</label>
        </div>
        <button className="auth-button" type="submit">Sign In</button>
        <a href="/forgot-password" className="auth-forgot">Forgot Password?</a>
        <button type="button" onClick={handleGoogleSignIn} className="auth-button google-btn">
          <FontAwesomeIcon icon={faGoogle} /> Sign In with Google
        </button>
        {error && <p className={`error ${error ? 'fade-out' : ''}`}>{error}</p>}
      </form>
    </div>
  );
};

export default Auth;
