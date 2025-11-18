import { supabase } from '@/lib/supabase';
import { Order, ShippingAddress, CartItem, DraftOrder } from '@/types';

interface CreateOrderPayload {
  userId: string | undefined;
  total: number;
  shippingAddress: ShippingAddress;
  customerName: string;
  customerEmail: string;
  items: CartItem[];
}

export const createOrder = async (payload: CreateOrderPayload): Promise<number> => {
  const { data, error } = await supabase.rpc('create_order_with_items', {
    user_id_input: payload.userId,
    total_input: payload.total,
    shipping_address_input: payload.shippingAddress,
    customer_name_input: payload.customerName,
    customer_email_input: payload.customerEmail,
    items: payload.items.map(item => ({ id: item.id, quantity: item.quantity, price: item.price })),
  });

  if (error) {
    console.error('Error creating order:', error);
    throw new Error(`Falha ao criar pedido: ${error.message}`);
  }

  return data;
};

export const getMyOrders = async (userId: string): Promise<Order[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*, products(name, image))
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user orders:', error);
    throw new Error(error.message);
  }

  return data as Order[];
};

export const updateOrder = async (id: number, orderData: Partial<Order>) => {
  const { data, error } = await supabase.from('orders').update(orderData).eq('id', id).select();
  if (error) throw new Error(error.message);
  return data[0];
};

export const getOrderById = async (id: number): Promise<Order> => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*, products(name, image))
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching order:', error);
    throw new Error('Pedido não encontrado');
  }
  return data as Order;
};


export const getDraftOrderById = async (id: string): Promise<DraftOrder | null> => {
  const { data, error } = await supabase
    .from('pedidos')
    .select(`
      id,
      produto_id,
      tipo_personalizacao,
      products (name, price, image)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching draft order:', error);
    // Retorna null em vez de lançar erro para que a página de checkout possa lidar com isso
    return null;
  }

  return data;
};

export const getAllOrders = async (): Promise<Order[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*, products(name, image))
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all orders:', error);
    throw new Error(error.message);
  }

  return data as Order[];
};
