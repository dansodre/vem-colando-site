import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Product } from "@/types";

// A interface CartItem foi movida para types/index.ts, aqui usamos a importada
import { CartItem } from "@/types";
import { supabase } from '@/lib/supabase';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, customization?: any) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  totalPrice: number;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  appliedCoupon: any | null;
  discount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [appliedCoupon, setAppliedCoupon] = useState<any | null>(null);
  const [discount, setDiscount] = useState(0);
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product) => {
    setCartItems(prevItems => {
      // Para produtos sem personalização, um ID de produto é suficiente para identificação
      const existingItem = prevItems.find(item => item.id === product.id);

      if (existingItem) {
        // Se o item já existe, apenas incrementa a quantidade
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Adiciona o novo produto ao carrinho
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.cartItemId === cartItemId ? { ...item, quantity } : item
        )
      );
    }
  };

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  useEffect(() => {
    if (appliedCoupon) {
      calculateDiscount(appliedCoupon, subtotal);
    } else {
      setDiscount(0);
    }
  }, [appliedCoupon, cartItems]);

  const calculateDiscount = (coupon: any, currentSubtotal: number) => {
    let newDiscount = 0;
    if (coupon.type === 'PERCENTAGE') {
      newDiscount = currentSubtotal * (coupon.value / 100);
    } else if (coupon.type === 'FIXED_AMOUNT') {
      newDiscount = coupon.value;
    }
    // FREE_SHIPPING será tratado no checkout
    setDiscount(newDiscount > currentSubtotal ? currentSubtotal : newDiscount);
  };

  const applyCoupon = async (code: string) => {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .single();

    if (error || !data) {
      return { success: false, message: 'Cupom inválido.' };
    }

    if (!data.is_active) {
      return { success: false, message: 'Este cupom não está mais ativo.' };
    }

    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return { success: false, message: 'Este cupom expirou.' };
    }

    setAppliedCoupon(data);
    calculateDiscount(data, subtotal);
    return { success: true, message: 'Cupom aplicado com sucesso!' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
  };

  const totalPrice = subtotal - discount;

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, totalPrice, applyCoupon, removeCoupon, appliedCoupon, discount }}>
      {children}
    </CartContext.Provider>
  );
};
