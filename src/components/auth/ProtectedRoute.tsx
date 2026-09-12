import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { selectIsAuthenticated } from '../../store/selectors';
import { checkTokenValidity } from '../../store/slices/authSlice';
import { LoginPage } from './LoginPage';
import { RegisterPage } from './RegisterPage';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [authView, setAuthView] = React.useState<'login' | 'register'>('login');

  useEffect(() => {
    dispatch(checkTokenValidity());
  }, [dispatch]);

  if (!isAuthenticated) {
    if (authView === 'register') {
      return <RegisterPage onSwitchToLogin={() => setAuthView('login')} />;
    }
    return <LoginPage onSwitchToRegister={() => setAuthView('register')} />;
  }

  return <>{children}</>;
};
