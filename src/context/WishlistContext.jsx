// WishlistContext — manages wishlist state with localStorage persistence

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const WishlistContext = createContext(null);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = useCallback((product) => {
    setWishlist((prev) => {
      if (prev.find((item) => item._id === product._id)) return prev;
      return [...prev, product];
    });
  }, []);

  const removeFromWishlist = useCallback((productId) => {
    setWishlist((prev) => prev.filter((item) => item._id !== productId));
  }, []);

  const isInWishlist = useCallback(
    (productId) => wishlist.some((item) => item._id === productId),
    [wishlist]
  );

  const toggleWishlist = useCallback(
    (product) => {
      if (isInWishlist(product._id)) {
        removeFromWishlist(product._id);
      } else {
        addToWishlist(product);
      }
    },
    [isInWishlist, addToWishlist, removeFromWishlist]
  );

  const value = {
    wishlist,
    wishlistCount: wishlist.length,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export default WishlistContext;
