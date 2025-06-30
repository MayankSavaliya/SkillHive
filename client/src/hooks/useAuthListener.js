import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { userLoggedIn, userLoggedOut, updateToken } from '@/features/authSlice';
import { useFirebaseAuthMutation, useLoadUserQuery } from '@/features/api/authApi';

const useAuthListener = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const [firebaseAuth] = useFirebaseAuthMutation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          const userData = {
            name: firebaseUser.displayName || 'User',
            email: firebaseUser.email,
            photoUrl: firebaseUser.photoURL
          };

          // Sync with backend
          const response = await firebaseAuth({
            idToken: token,
            userData
          });

          if (response.data?.success) {
            // Store both user data and Firebase token in Redux
            dispatch(userLoggedIn({ 
              user: response.data.user, 
              token: token 
            }));
          }
        } catch (error) {
          console.error('Auto-login failed:', error);
          dispatch(userLoggedOut());
        }
      } else {
        dispatch(userLoggedOut());
      }
      setLoading(false);
    });

    // Set up token refresh every 30 minutes
    const tokenRefreshInterval = setInterval(async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        try {
          const newToken = await currentUser.getIdToken(true); // Force refresh
          dispatch(updateToken(newToken));
        } catch (error) {
          console.error('Token refresh failed:', error);
        }
      }
    }, 30 * 60 * 1000); // 30 minutes

    return () => {
      unsubscribe();
      clearInterval(tokenRefreshInterval);
    };
  }, [dispatch, firebaseAuth]);

  return loading;
};

export default useAuthListener;
