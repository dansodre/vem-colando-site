import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Header from './Header';

// Mock do useCart para evitar erros de contexto
vi.mock('@/contexts/CartContext', () => ({
  useCart: () => ({ cartCount: 3 }),
}));

// Mock do useAuth para evitar erros de contexto
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({ user: null }),
}));

describe('Header Component', () => {
  it('should render the logo and navigation links', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    // Verifica se o logo está presente (pelo alt text da imagem)
    expect(screen.getByAltText(/Vem Colando/i)).toBeInTheDocument();

    // Verifica se os links de navegação principais estão presentes
    expect(screen.getByRole('link', { name: /Nossa Loja/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Sobre/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Contato/i })).toBeInTheDocument();

    // Verifica se o ícone do carrinho está presente
    expect(screen.getByLabelText(/Abrir carrinho/i)).toBeInTheDocument();
  });
});
