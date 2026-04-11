import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const NetworkStatusBanner = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setTimeout(() => setShowBanner(false), 3000);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setShowBanner(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          exit={{ y: -50 }}
          className={`fixed top-0 left-0 right-0 z-[100] px-4 py-2 text-center text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 ${
            isOnline ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'
          }`}
        >
          {isOnline ? (
            <>
              <Wifi className="w-3 h-3" />
              Back Online
            </>
          ) : (
            <>
              <WifiOff className="w-3 h-3" />
              You are offline. Showing cached data.
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NetworkStatusBanner;
