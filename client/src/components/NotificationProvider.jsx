import React from 'react';
import { useSelector } from 'react-redux';
import useSocket from '@/hooks/useSocket';

const NotificationProvider = ({ children }) => {
  const { user, token } = useSelector((state) => state.auth);
  const { socket, isConnected } = useSocket();

  // The useSocket hook automatically handles socket initialization
  // when user and token are available, so no manual initialization needed

  return <>{children}</>;
};

export default NotificationProvider; 