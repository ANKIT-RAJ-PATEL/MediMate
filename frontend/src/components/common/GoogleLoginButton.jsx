import { useEffect, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import API from '../../config/api';
import toast from 'react-hot-toast';

export default function GoogleLoginButton({ text = 'Sign in with Google' }) {
  const btnRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCredentialResponse = useCallback(async (response) => {
    try {
      const { data } = await API.post('/auth/google-login', {
        credential: response.credential,
      });
      localStorage.setItem('accessToken', data.accessToken);

      // Manually dispatch to Redux store
      dispatch({ type: 'auth/login/fulfilled', payload: data });

      toast.success('Welcome!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Google login failed');
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    const initGoogle = () => {
      if (typeof window.google === 'undefined' || !window.google.accounts) {
        // Retry if Google SDK not loaded yet
        setTimeout(initGoogle, 200);
        return;
      }

      window.google.accounts.id.initialize({
        client_id: '148677677318-n0bu98q18jmh8hv50ol8fkvgcqrvp6d1.apps.googleusercontent.com',
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(btnRef.current, {
        theme: 'outline',
        size: 'large',
        width: btnRef.current?.parentElement?.offsetWidth || 400,
        text: text.includes('Sign up') ? 'signup_with' : 'signin_with',
        shape: 'rectangular',
      });
    };

    initGoogle();
  }, [text, handleCredentialResponse]);

  return <div ref={btnRef} className="w-full flex justify-center"></div>;
}
