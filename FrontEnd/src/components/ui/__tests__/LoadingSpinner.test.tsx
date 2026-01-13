/**
 * TESTS PARA COMPONENTE LOADING SPINNER
 * 
 * CONCEPTOS NUEVOS:
 * - render(): Monta el componente en un DOM virtual
 * - screen: Permite buscar elementos en el DOM renderizado
 * - getByText, getByRole, queryBy: Diferentes formas de buscar elementos
 * - container: Acceso al DOM raw del componente
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

describe('LoadingSpinner', () => {
  it('debe renderizar sin errores', () => {
    // Renderizamos el componente
    const { container } = render(<LoadingSpinner />);
    
    // Verificamos que el spinner está en el DOM
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('debe mostrar mensaje personalizado cuando se proporciona', () => {
    const customMessage = 'Espera un momento...';
    
    render(<LoadingSpinner message={customMessage} />);
    
    // Verificamos que el mensaje custom aparece
    expect(screen.getByText(customMessage)).toBeInTheDocument();
    
    // Y que el mensaje por defecto NO aparece
    expect(screen.queryByText('Cargando...')).not.toBeInTheDocument();
  });

  it('debe aplicar clase de tamaño pequeño', () => {
    const { container } = render(<LoadingSpinner size="sm" />);
    
    // Buscamos el spinner (primer div con la animación)
    const spinner = container.querySelector('.animate-spin');
    
    expect(spinner).toHaveClass('w-6', 'h-6');
  });

  it('debe aplicar clase de tamaño mediano por defecto', () => {
    const { container } = render(<LoadingSpinner />);
    
    const spinner = container.querySelector('.animate-spin');
    
    expect(spinner).toHaveClass('w-12', 'h-12');
  });

  it('debe aplicar clase de tamaño grande', () => {
    const { container } = render(<LoadingSpinner size="lg" />);
    
    const spinner = container.querySelector('.animate-spin');
    
    expect(spinner).toHaveClass('w-16', 'h-16');
  });

  it('debe usar color personalizado en el borde', () => {
    const customColor = 'rgb(255, 87, 51)';
    const { container } = render(<LoadingSpinner color={customColor} />);
    
    const spinner = container.querySelector('.animate-spin');
    
    // Verificamos que el style inline incluye nuestro color en borderColor
    expect(spinner).toHaveStyle({ borderColor: customColor });
  });

  it('debe renderizar en modo fullScreen con fondo gradiente', () => {
    const { container } = render(<LoadingSpinner fullScreen />);
    
    // El wrapper principal debe tener min-h-screen
    const wrapper = container.firstChild;
    
    expect(wrapper).toHaveClass('min-h-screen', 'flex');
    
    // Debe tener un fondo con gradiente (la clase bg-gradient-to-br)
    expect(container.innerHTML).toContain('bg-gradient-to-br');
  });

  it('debe combinar fullScreen con mensaje personalizado', () => {
    render(<LoadingSpinner fullScreen message="Procesando pago..." />);
    
    expect(screen.getByText('Procesando pago...')).toBeInTheDocument();
  });

  it('debe renderizar sin mensaje si se pasa message vacío', () => {
    const { container } = render(<LoadingSpinner message="" />);
    
    // No debería haber ningún texto
    const textElements = container.querySelectorAll('p');
    expect(textElements).toHaveLength(0);
  });
});

/**
 * ¿QUÉ APRENDIMOS?
 * 
 * 1. render(): Monta componentes React en un DOM de testing
 * 2. screen.getByText(): Busca elementos por su texto (lanza error si no existe)
 * 3. screen.queryByText(): Busca pero retorna null si no existe (no lanza error)
 * 4. toBeInTheDocument(): Verifica que un elemento está en el DOM
 * 5. toHaveClass(): Verifica que un elemento tiene ciertas clases CSS
 * 6. toHaveStyle(): Verifica estilos inline
 * 7. container.querySelector(): Acceso directo al DOM cuando queries estándar no funcionan
 * 8. not.toBeInTheDocument(): Verifica que algo NO está presente
 */
