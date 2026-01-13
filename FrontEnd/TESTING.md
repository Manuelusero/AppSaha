# 🧪 Guía Completa de Testing - Proyecto Serco

Esta guía documenta todas las prácticas de testing implementadas en el proyecto. Úsala como referencia para escribir nuevos tests.

---

## 📦 Stack de Testing

- **Vitest**: Framework de testing (alternativa moderna a Jest)
- **React Testing Library**: Testing de componentes React
- **@testing-library/user-event**: Simulación de interacciones del usuario
- **jsdom**: Simulación del DOM del navegador
- **MSW (Mock Service Worker)**: Mocking de APIs (instalado, pendiente configurar)

---

## 🚀 Comandos Disponibles

```bash
# Ejecutar todos los tests una vez
npm test

# Ejecutar tests en modo watch (se re-ejecutan al guardar cambios)
npm run test:watch

# Ver interfaz visual de tests en el navegador
npm run test:ui

# Generar reporte de cobertura de código
npm run test:coverage
```

---

## 📁 Estructura de Archivos de Test

```
src/
├── components/
│   └── ui/
│       ├── LoadingSpinner.tsx
│       └── __tests__/
│           └── LoadingSpinner.test.tsx    ← Tests del componente
├── store/
│   ├── authStore.ts
│   └── __tests__/
│       └── authStore.test.ts              ← Tests del store
├── utils/
│   ├── api.ts
│   └── __tests__/
│       └── api.test.ts                    ← Tests de utilidades
└── tests/
    └── setup.ts                           ← Configuración global de tests
```

**Convención**: Los archivos de test van en una carpeta `__tests__/` junto al código que testean.

---

## 🎯 Patrón AAA (Arrange-Act-Assert)

Todos los tests siguen este patrón:

```typescript
it("debe hacer algo específico", () => {
  // ✅ ARRANGE: Preparar el escenario
  const mockData = { id: 1, name: "Test" };
  const mockFn = vi.fn();

  // ✅ ACT: Ejecutar la acción que queremos testear
  const result = someFunction(mockData);

  // ✅ ASSERT: Verificar que el resultado es el esperado
  expect(result).toBe(expectedValue);
  expect(mockFn).toHaveBeenCalled();
});
```

---

## 🧩 1. Testing de Funciones/Utilidades

### Ejemplo: Testing de funciones de API

```typescript
import { describe, it, expect, beforeEach, vi } from "vitest";
import { apiGet } from "../api";

// Mock de fetch global
const mockFetch = vi.fn();
global.fetch = mockFetch as any;

describe("apiGet", () => {
  beforeEach(() => {
    mockFetch.mockClear(); // Limpiar antes de cada test
  });

  it("debe retornar datos cuando la respuesta es exitosa", async () => {
    const mockData = { id: 1, name: "Test" };

    // Simular respuesta exitosa
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const result = await apiGet("/users/1");

    expect(result).toEqual(mockData);
  });

  it("debe lanzar error cuando la respuesta falla", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ error: "Not found" }),
    });

    await expect(apiGet("/users/999")).rejects.toThrow("Not found");
  });
});
```

### Conceptos Clave:

- **`vi.fn()`**: Crea una función mock para espiar llamadas
- **`mockResolvedValueOnce()`**: Simula una respuesta asíncrona exitosa
- **`mockRejectedValueOnce()`**: Simula una respuesta asíncrona con error
- **`beforeEach()`**: Se ejecuta antes de cada test (útil para limpieza)
- **`expect().rejects.toThrow()`**: Verifica que una promesa lanza error

---

## 🎨 2. Testing de Componentes React

### Ejemplo: Componente Simple

```typescript
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LoadingSpinner } from "../LoadingSpinner";

describe("LoadingSpinner", () => {
  it("debe renderizar correctamente", () => {
    render(<LoadingSpinner />);

    // Buscar por rol, texto, etc.
    const spinner = screen.getByRole("status"); // Elemento con role="status"
    expect(spinner).toBeInTheDocument();
  });

  it("debe mostrar mensaje personalizado", () => {
    render(<LoadingSpinner message="Cargando datos..." />);

    expect(screen.getByText("Cargando datos...")).toBeInTheDocument();
  });
});
```

### Queries más comunes:

```typescript
// Por texto
screen.getByText("Click me");

// Por rol (mejor para accesibilidad)
screen.getByRole("button");
screen.getByRole("textbox");

// Por label (para inputs)
screen.getByLabelText("Email");

// Por placeholder
screen.getByPlaceholderText("Enter your name");

// Por test-id (último recurso)
screen.getByTestId("custom-element");

// Versiones que NO lanzan error si no existe:
screen.queryByText("Might not exist"); // Retorna null
screen.findByText("Async element"); // Retorna Promise
```

---

## 🖱️ 3. Testing de Interacciones del Usuario

### Ejemplo: Click, Type, Hover

```typescript
import userEvent from "@testing-library/user-event";

describe("PasswordInput", () => {
  it("debe alternar visibilidad al hacer click", async () => {
    const user = userEvent.setup();

    render(<PasswordInput label="Password" value="" onChange={() => {}} />);

    const input = screen.getByPlaceholderText("Enter password");
    const toggleButton = screen.getByRole("button");

    // Inicialmente oculto
    expect(input).toHaveAttribute("type", "password");

    // Click en botón
    await user.click(toggleButton);

    // Ahora visible
    expect(input).toHaveAttribute("type", "text");
  });

  it("debe llamar onChange al escribir", async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();

    render(<PasswordInput value="" onChange={mockOnChange} />);

    const input = screen.getByRole("textbox");

    // Escribir texto
    await user.type(input, "abc");

    // onChange se llamó 3 veces (una por letra)
    expect(mockOnChange).toHaveBeenCalledTimes(3);
  });
});
```

### Interacciones disponibles:

```typescript
const user = userEvent.setup();

await user.click(element); // Click
await user.dblClick(element); // Doble click
await user.type(input, "text"); // Escribir
await user.clear(input); // Limpiar input
await user.hover(element); // Pasar mouse por encima
await user.tab(); // Navegar con Tab
await user.keyboard("{Enter}"); // Presionar tecla
```

---

## 🏪 4. Testing de Zustand Stores

### Ejemplo: Testing de Estado Global

```typescript
import { renderHook, act } from "@testing-library/react";
import { useAuthStore } from "../authStore";

describe("authStore", () => {
  beforeEach(() => {
    // Resetear store antes de cada test
    const { result } = renderHook(() => useAuthStore());
    act(() => {
      result.current.logout();
    });
    localStorage.clear();
  });

  it("debe hacer login correctamente", () => {
    const { result } = renderHook(() => useAuthStore());

    const mockUser = { id: "1", email: "test@test.com", name: "Test" };
    const mockToken = "abc123";

    // Ejecutar acción
    act(() => {
      result.current.login(mockUser, mockToken);
    });

    // Verificar estado
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(localStorage.getItem("token")).toBe(mockToken);
  });

  it("debe actualizar usuario parcialmente", () => {
    const { result } = renderHook(() => useAuthStore());

    // Setup inicial
    act(() => {
      result.current.login(mockUser, mockToken);
    });

    // Actualización parcial
    act(() => {
      result.current.updateUser({ name: "New Name" });
    });

    expect(result.current.user?.name).toBe("New Name");
    expect(result.current.user?.email).toBe(mockUser.email); // Sin cambios
  });
});
```

### Conceptos Clave:

- **`renderHook()`**: Permite usar hooks sin componentes
- **`act()`**: Envuelve actualizaciones de estado de React
- **`result.current`**: Acceso al valor actual del hook

---

## 📊 5. Matchers Útiles

### Comparaciones Básicas

```typescript
expect(value).toBe(5); // Igualdad estricta (===)
expect(value).toEqual({ id: 1 }); // Igualdad profunda (objetos/arrays)
expect(value).toBeTruthy(); // Cualquier valor truthy
expect(value).toBeFalsy(); // Cualquier valor falsy
expect(value).toBeNull(); // null
expect(value).toBeUndefined(); // undefined
expect(value).toBeDefined(); // No undefined
```

### DOM y Elementos

```typescript
expect(element).toBeInTheDocument(); // Elemento existe en el DOM
expect(element).toBeVisible(); // Elemento visible
expect(element).toBeDisabled(); // Input/button deshabilitado
expect(element).toHaveClass("active"); // Tiene clase CSS
expect(element).toHaveAttribute("type", "password");
expect(element).toHaveStyle({ color: "red" });
expect(element).toHaveTextContent("Hello");
```

### Arrays y Colecciones

```typescript
expect(array).toContain(item); // Incluye elemento
expect(array).toHaveLength(3); // Longitud específica
expect(string).toMatch(/regex/); // Match regex
```

### Funciones (Mocks)

```typescript
expect(mockFn).toHaveBeenCalled(); // Fue llamada
expect(mockFn).toHaveBeenCalledTimes(3); // Llamada 3 veces
expect(mockFn).toHaveBeenCalledWith(arg); // Llamada con argumento
expect(mockFn).toHaveBeenLastCalledWith(arg);
```

### Negación

```typescript
expect(value).not.toBe(5);
expect(element).not.toBeInTheDocument();
```

---

## 🎭 6. Mocking

### Mock de Funciones

```typescript
const mockFn = vi.fn(); // Función vacía
const mockFn = vi.fn(() => "result"); // Con retorno
const mockFn = vi.fn((x) => x * 2); // Con lógica

mockFn.mockReturnValue("value"); // Retornar valor
mockFn.mockResolvedValue("async"); // Promesa exitosa
mockFn.mockRejectedValue(new Error()); // Promesa con error
mockFn.mockReturnValueOnce("first"); // Solo primera llamada
```

### Mock de Módulos

```typescript
// Mock completo de un módulo
vi.mock("../api", () => ({
  apiGet: vi.fn(),
  apiPost: vi.fn(),
}));

// Mock parcial (mantiene el resto)
vi.mock("../api", async () => {
  const actual = await vi.importActual("../api");
  return {
    ...actual,
    apiGet: vi.fn(), // Solo mockear esto
  };
});
```

### Mock de localStorage

```typescript
// Ya está configurado en setup.ts, pero puedes extenderlo:
beforeEach(() => {
  localStorage.setItem("key", "value");
});

afterEach(() => {
  localStorage.clear();
});
```

---

## 🔥 7. Mejores Prácticas

### ✅ DO (Hacer)

```typescript
// ✅ Tests descriptivos y específicos
it("debe mostrar error cuando el email es inválido", () => {
  // test
});

// ✅ Usar queries por accesibilidad (role, label)
screen.getByRole("button", { name: "Submit" });

// ✅ Limpiar entre tests
beforeEach(() => {
  cleanup();
  localStorage.clear();
});

// ✅ Testear comportamiento, no implementación
expect(screen.getByText("Welcome")).toBeInTheDocument();

// ✅ Usar userEvent para interacciones
await user.click(button);
```

### ❌ DON'T (No hacer)

```typescript
// ❌ Tests vagos
it("funciona correctamente", () => {});

// ❌ Acceder directamente a implementación interna
expect(component.state.count).toBe(5);

// ❌ Tests dependientes entre sí
it("test 1", () => {
  globalVar = 5;
});
it("test 2", () => {
  expect(globalVar).toBe(5);
});

// ❌ Usar querySelector sin necesidad
container.querySelector(".my-class");

// ❌ Tests muy largos (dividir en múltiples)
it("hace 10 cosas diferentes", () => {
  // 100 líneas...
});
```

---

## 📈 8. Cobertura de Código

```bash
npm run test:coverage
```

Esto genera un reporte mostrando:

- **Líneas cubiertas**: % de líneas ejecutadas en tests
- **Ramas cubiertas**: % de if/else testeados
- **Funciones cubiertas**: % de funciones llamadas
- **Statements cubiertas**: % de declaraciones ejecutadas

**Meta recomendada**: 70-80% de cobertura (no obsesionarse con 100%)

---

## 🐛 9. Debugging de Tests

### Ver qué está renderizado

```typescript
import { screen } from "@testing-library/react";

// Ver todo el DOM
screen.debug();

// Ver un elemento específico
screen.debug(screen.getByRole("button"));

// Ver HTML completo
console.log(container.innerHTML);
```

### Modo interactivo

```bash
npm run test:ui
```

Abre interfaz visual en el navegador donde puedes:

- Ver tests en tiempo real
- Pausar ejecución
- Ver logs y errores
- Inspeccionar el DOM renderizado

---

## 📚 10. Recursos y Siguientes Pasos

### Documentación Oficial

- [Vitest](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library User Event](https://testing-library.com/docs/user-event/intro)

### Próximos Tests a Implementar

1. **Componentes de UI restantes**:

   - Modal
   - StarRating
   - StatusBadge

2. **Tests de integración**:

   - Flujos completos (login → dashboard)
   - Formularios complejos

3. **Tests E2E con Playwright** (opcional):

   - Pruebas en navegador real
   - Testing de flujos críticos de usuario

4. **Configurar MSW**:
   - Mock de toda la API REST
   - Tests más realistas sin dependencias del backend

---

## 🎓 Ejemplo Completo Comentado

```typescript
/**
 * Test completo que combina todos los conceptos
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "../LoginForm";

// Mock de la función de login
const mockLogin = vi.fn();

describe("LoginForm", () => {
  beforeEach(() => {
    mockLogin.mockClear();
  });

  it("debe hacer login cuando el formulario es válido", async () => {
    // ARRANGE: Setup
    const user = userEvent.setup();
    render(<LoginForm onLogin={mockLogin} />);

    // ACT: Interacciones del usuario
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: "Login" });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    // ASSERT: Verificaciones
    expect(mockLogin).toHaveBeenCalledTimes(1);
    expect(mockLogin).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
  });

  it("debe mostrar error cuando el email es inválido", async () => {
    const user = userEvent.setup();
    render(<LoginForm onLogin={mockLogin} />);

    const emailInput = screen.getByLabelText("Email");
    const submitButton = screen.getByRole("button", { name: "Login" });

    await user.type(emailInput, "invalid-email");
    await user.click(submitButton);

    // Verificar que aparece mensaje de error
    expect(screen.getByText(/email inválido/i)).toBeInTheDocument();

    // Y que NO se llamó la función de login
    expect(mockLogin).not.toHaveBeenCalled();
  });
});
```

---

## 🚦 Estado Actual del Proyecto

### ✅ Completado (51 tests)

- ✅ Tests de utilidades API (13 tests)
- ✅ Tests de componentes UI (21 tests)
- ✅ Tests de Zustand store (17 tests)

### 🔨 Pendiente

- ⏳ Tests de componentes Modal, StarRating, StatusBadge
- ⏳ Tests de formularios complejos
- ⏳ Configuración de MSW para mocks de API
- ⏳ Tests E2E con Playwright

---

## 💡 Tips Finales

1. **Escribe tests mientras desarrollas**, no al final
2. **Un test = una cosa**: Cada test debe verificar un comportamiento específico
3. **Tests como documentación**: Buenos tests explican cómo usar el código
4. **No testear detalles de implementación**: Testea el comportamiento del usuario
5. **Coverage no es todo**: 100% de coverage no significa 100% de calidad

---

**¿Preguntas? ¿Dudas?** Consulta esta guía o revisa los tests existentes en:

- `src/utils/__tests__/api.test.ts`
- `src/components/ui/__tests__/LoadingSpinner.test.tsx`
- `src/components/ui/__tests__/PasswordInput.test.tsx`
- `src/store/__tests__/authStore.test.ts`

¡Happy Testing! 🎉
