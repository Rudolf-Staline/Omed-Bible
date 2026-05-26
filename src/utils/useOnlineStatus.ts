import { useEffect, useState } from 'react';

const getOnlineStatus = () => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return true;
  }

  return navigator.onLine;
};

export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState<boolean>(getOnlineStatus);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);

    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);

    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  return isOnline;
};
