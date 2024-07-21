import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, firestore } from 'config';

const useAuth = (handleUserInfo) => {

  useEffect(() => {
    let unsubscribeFromSnapshot = () => {};

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        const documentRef = doc(firestore, 'User-Data', user.uid);

        unsubscribeFromSnapshot = onSnapshot(documentRef, (snapshot) => {
          if (snapshot.exists()) {
            handleUserInfo(snapshot.data());
          } else {
            handleUserInfo({});
          }
        }, (error) => {
          console.error('Error listening to Firestore changes: ', error);
          handleUserInfo({});
        });
      } else {
        handleUserInfo({});
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeFromSnapshot();
    };
  }, []);

  return
};

export default useAuth;
