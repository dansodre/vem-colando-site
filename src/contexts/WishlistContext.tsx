import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Product } from '@/types';
import { useAuth } from './AuthContext';
import { getWishlist, addToWishlist, removeFromWishlist } from '@/services/wishlistApi';

interface WishlistContextType {
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<Product[]>([]);

  useEffect(() => {
    if (user) {
      getWishlist(user.id).then(setWishlist);
    }
  }, [user]);

  const isInWishlist = (productId: number) => wishlist.some(item => item.id === productId);

  const toggleWishlist = async (product: Product) => {
    if (!user) return; // Idealmente, pedir para fazer login

    if (isInWishlist(product.id)) {
      await removeFromWishlist(user.id, product.id);
      setWishlist(prev => prev.filter(item => item.id !== product.id));
    } else {
      await addToWishlist(user.id, product.id);
      setWishlist(prev => [...prev, product]);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
