/**
 * TESTS PARA COMPONENTE PASSWORD INPUT
 * 
 * CONCEPTOS NUEVOS:
 * - userEvent: Simula interacciones del usuario (click, type, etc.)
 * - getByRole: Busca elementos por su rol de accesibilidad
 * - getByLabelText: Busca inputs por su label asociado
 * - toHaveAttribute: Verifica atributos HTML
 * - onChange events: Verifica que los callbacks se ejecutan
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PasswordInput } from '@/components/ui/PasswordInput';

describe('PasswordInput', () => {
  it('debe renderizar con tipo password por defecto', () => {
    render(
      <PasswordInput
        label="Contraseña"
        value=""
        onChange={() => {}}
      />
    );

    // Buscamos el input por type
    const input = screen.getByPlaceholderText('Ingresa tu contraseña');
    
    // El input debe tener type="password" inicialmente (oculto)
    expect(input).toHaveAttribute('type', 'password');
  });

  it('debe mostrar el label proporcionado', () => {
    const labelText = 'Ingresa tu contraseña';
    
    render(
      <PasswordInput
        label={labelText}
        value=""
        onChange={() => {}}
      />
    );

    expect(screen.getByText(labelText)).toBeInTheDocument();
  });

  it('debe alternar entre mostrar/ocultar password al hacer click en el botón', async () => {
    // Setup de userEvent para simular interacciones
    const user = userEvent.setup();
    
    render(
      <PasswordInput
        label="Contraseña"
        value="mipassword123"
        onChange={() => {}}
      />
    );

    const input = screen.getByPlaceholderText('Ingresa tu contraseña');
    const toggleButton = screen.getByRole('button');

    // Inicialmente debe estar oculto (type="password")
    expect(input).toHaveAttribute('type', 'password');

    // Click en el botón para mostrar
    await user.click(toggleButton);
    expect(input).toHaveAttribute('type', 'text');

    // Click de nuevo para ocultar
    await user.click(toggleButton);
    expect(input).toHaveAttribute('type', 'password');
  });

  it('debe llamar onChange cuando el usuario escribe', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    
    render(
      <PasswordInput
        label="Contraseña"
        value=""
        onChange={mockOnChange}
      />
    );

    const input = screen.getByPlaceholderText('Ingresa tu contraseña');

    // Escribimos en el input
    await user.type(input, 'abc');

    // onChange debe haberse llamado 3 veces (una por cada letra)
    expect(mockOnChange).toHaveBeenCalledTimes(3);
  });

  it('debe mostrar mensaje de error cuando se proporciona', () => {
    const errorMessage = 'La contraseña debe tener al menos 6 caracteres';
    
    render(
      <PasswordInput
        label="Contraseña"
        value="abc"
        onChange={() => {}}
        error={errorMessage}
      />
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('debe aplicar estilos de error cuando hay error', () => {
    render(
      <PasswordInput
        label="Contraseña"
        value=""
        onChange={() => {}}
        error="Error"
      />
    );

    const input = screen.getByPlaceholderText('Ingresa tu contraseña');
    
    // Verificamos que tiene estilo de error (border-color rojo en inline style)
    expect(input).toHaveStyle({ borderColor: 'rgb(220, 38, 38)' });
  });

  it('debe estar deshabilitado cuando disabled=true', () => {
    render(
      <PasswordInput
        label="Contraseña"
        value=""
        onChange={() => {}}
        disabled
      />
    );

    const input = screen.getByPlaceholderText('Ingresa tu contraseña');
    const toggleButton = screen.getByRole('button');
    
    expect(input).toBeDisabled();
    expect(toggleButton).toBeDisabled();
  });

  it('debe aplicar placeholder cuando se proporciona', () => {
    const placeholder = 'Escribe tu contraseña aquí';
    
    render(
      <PasswordInput
        label="Contraseña"
        value=""
        onChange={() => {}}
        placeholder={placeholder}
      />
    );

    const input = screen.getByPlaceholderText(placeholder);
    
    expect(input).toHaveAttribute('placeholder', placeholder);
  });

  it('debe aplicar name e id al input', () => {
    render(
      <PasswordInput
        label="Contraseña"
        name="user-password"
        id="pwd-input"
        value=""
        onChange={() => {}}
      />
    );

    const input = screen.getByPlaceholderText('Ingresa tu contraseña');
    
    expect(input).toHaveAttribute('name', 'user-password');
    expect(input).toHaveAttribute('id', 'pwd-input');
  });

  it('debe mostrar icono SVG cuando password está oculto', () => {
    const { container } = render(
      <PasswordInput
        label="Contraseña"
        value=""
        onChange={() => {}}
      />
    );

    // Buscamos el SVG - cuando está oculto muestra el ojo
    const svgIcon = container.querySelector('svg');
    
    expect(svgIcon).toBeInTheDocument();
  });

  it('debe mantener icono SVG visible cuando password se muestra', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <PasswordInput
        label="Contraseña"
        value=""
        onChange={() => {}}
      />
    );

    const toggleButton = screen.getByRole('button');
    
    // Click para mostrar password
    await user.click(toggleButton);

    // El SVG sigue presente
    const svgIcon = container.querySelector('svg');
    
    expect(svgIcon).toBeInTheDocument();
  });

  it('debe mantener el valor cuando se alterna visibilidad', async () => {
    const user = userEvent.setup();
    const password = 'secretPassword123';
    
    render(
      <PasswordInput
        label="Contraseña"
        value={password}
        onChange={() => {}}
      />
    );

    const input = screen.getByPlaceholderText('Ingresa tu contraseña') as HTMLInputElement;
    const toggleButton = screen.getByRole('button');

    // Valor inicial
    expect(input.value).toBe(password);

    // Alternar visibilidad
    await user.click(toggleButton);
    expect(input.value).toBe(password); // Debe mantener el valor

    await user.click(toggleButton);
    expect(input.value).toBe(password); // Debe mantener el valor
  });
});

/**
 * ¿QUÉ APRENDIMOS?
 * 
 * 1. userEvent.setup(): Inicializa la simulación de eventos del usuario
 * 2. user.click(): Simula un click del mouse
 * 3. user.type(): Simula escritura en un input
 * 4. getByRole('button'): Busca elementos por su rol ARIA
 * 5. getByLabelText(): Encuentra inputs por su label asociado
 * 6. toHaveAttribute(): Verifica atributos HTML como type, name, id
 * 7. toBeDisabled(): Verifica que un input está deshabilitado
 * 8. vi.fn(): Crea funciones mock para verificar que fueron llamadas
 * 9. toHaveBeenCalledTimes(): Cuenta cuántas veces se llamó una función
 * 10. Testing de interacciones: Cómo simular clicks y escritura
 * 
 * PATRÓN AAA EN ACTION:
 * - Arrange: Setup de userEvent y render del componente
 * - Act: user.click() o user.type()
 * - Assert: expect() para verificar el resultado
 */
