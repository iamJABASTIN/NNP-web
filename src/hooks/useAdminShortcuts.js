import { useEffect } from 'react';

export const useAdminShortcuts = (setActiveTab) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Mapping function keys to tabs
      const shortcuts = {
        F1: 'dashboard',
        F2: 'quick-pos',
        F3: 'menu',
        F4: 'orders',
        F5: 'customers',
        F6: 'analytics',
        F7: 'reviews',
        F8: 'settings',
      };

      if (shortcuts[e.key]) {
        e.preventDefault(); // Prevent browser defaults (e.g., F1 Help, F5 Refresh)
        setActiveTab(shortcuts[e.key]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveTab]);
};
