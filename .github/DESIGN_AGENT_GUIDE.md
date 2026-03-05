# 🎨 Design Specialist Agent & Figma MCP Integration

## 📋 Overview

Este documento explica cómo usar el **Design Specialist Agent** y el **servidor MCP de Figma** integrado con GitHub Copilot en VS Code.

## 🤖 Design Specialist Agent

### Ubicación

`.github/agents/design-specialist.agent.md`

### ¿Qué hace?

El Design Specialist es un agente AI especializado en:

- ✅ **Revisión de diseño UX/UI** - Analiza componentes, páginas y layouts
- 🎨 **Gestión de Design Tokens** - Mantiene consistencia visual
- ♿ **Accesibilidad (WCAG 2.1)** - Verifica contraste, navegación, ARIA
- 📱 **Diseño Responsivo** - Mobile-first, breakpoints, touch targets
- 🔗 **Integración Figma-Código** - Traduce diseños a componentes React
- 📐 **Sistemas de Diseño** - Mantiene y evoluciona el design system

### Cómo usarlo

1. **Menciona al agente** en GitHub Copilot Chat:

   ```
   @design-specialist revisa este componente
   ```

2. **Tareas comunes:**

   ```
   @design-specialist revisa la accesibilidad de este botón

   @design-specialist cómo implemento este diseño de Figma?

   @design-specialist este componente se ve raro, qué está mal?

   @design-specialist necesito agregar un nuevo color al design system

   @design-specialist verifica que esto sea responsive
   ```

3. **El agente te dará:**
   - ✅ Análisis detallado del diseño
   - ⚠️ Issues encontrados con severidad
   - 🎯 Recomendaciones priorizadas
   - 📝 Código de ejemplo para implementar

### Ejemplo de Uso

**Tú:**

```
@design-specialist revisa este componente Button
```

**El agente responderá con:**

````markdown
## Design Review: Button Component

### ✅ Strengths

- Usa design tokens correctamente
- Tiene múltiples variantes (primary, secondary)

### ⚠️ Issues Found

1. **Contraste de color**: El botón secondary no cumple WCAG AA
   - Severity: High
   - Recommendation: Cambiar color de #BFC6EE a #244C87

2. **Touch target**: Botón size="sm" es de 36x36px
   - Severity: Medium
   - Recommendation: Mínimo 44x44px para mobile

### 🎯 Recommendations

1. Actualizar color secondary para accesibilidad
2. Incrementar padding en size="sm"
3. Agregar focus indicator visible

### 📝 Implementation Notes

```tsx
// Actualizar Button.tsx
const sizeClasses = {
  sm: "px-4 py-3", // 44x44px mínimo
  md: "px-6 py-3",
  lg: "px-8 py-4",
};
```
````

```

## 🔗 Servidor MCP de Figma

### ¿Qué es?

El **Model Context Protocol (MCP)** de Figma permite que GitHub Copilot acceda directamente a tus diseños de Figma y los use como contexto en la conversación.

### Configuración

✅ **Ya está configurado!** El archivo se creó en:
```

~/Library/Application Support/Code/User/globalStorage/github.copilot-chat/mcpServers.json

```

### Cómo funciona

1. **Reinicia VS Code** para que GitHub Copilot cargue la configuración MCP

2. **Verifica la conexión**:
   - Abre GitHub Copilot Chat
   - Deberías ver el servidor "figma" disponible

3. **Usa Figma directamente en Copilot**:

```

@design-specialist usando Figma, muéstrame todos los componentes de botón

@design-specialist desde Figma, cuáles son los colores primarios?

@design-specialist implementa el componente Card de Figma

@design-specialist compara el diseño de Figma con mi código actual

````

### Capacidades del MCP Figma

El servidor MCP de Figma puede:

- 📋 **Listar componentes** del archivo de diseño
- 🎨 **Extraer estilos** (colores, tipografía, spacing)
- 📐 **Obtener medidas** exactas de elementos
- 🖼️ **Exportar assets** en diferentes formatos
- 🔍 **Buscar componentes** por nombre o tipo
- 📊 **Analizar estructura** del diseño

### Configuración del MCP

```json
{
"mcpServers": {
 "figma": {
   "command": "npx",
   "args": ["-y", "@modelcontextprotocol/server-figma"],
   "env": {
     "FIGMA_PERSONAL_ACCESS_TOKEN": "figd_iYd..."
   }
 }
}
}
````

**Variables configuradas:**

- `FIGMA_PERSONAL_ACCESS_TOKEN`: Tu token de acceso personal de Figma
- File Key: `641V0jz66WQSmdDqCN8KXV` (configurado en el agent)

## 🚀 Flujo de Trabajo Recomendado

### 1. Diseño en Figma → Código

```
Paso 1: Diseñar en Figma
        ↓
Paso 2: Preguntar a @design-specialist
        "@design-specialist desde Figma, implementa el componente Card"
        ↓
Paso 3: El agente usa el MCP para:
        - Obtener estilos del diseño
        - Extraer design tokens
        - Generar código React
        ↓
Paso 4: Revisar y ajustar el código generado
```

### 2. Revisión de Diseño

```
Paso 1: Desarrollas un componente
        ↓
Paso 2: Pides revisión
        "@design-specialist revisa este componente"
        ↓
Paso 3: El agente analiza:
        - Uso de design tokens
        - Accesibilidad
        - Responsive design
        - Consistencia visual
        ↓
Paso 4: Implementas las recomendaciones
```

### 3. Sincronización Figma ↔ Código

```
Paso 1: Cambios en Figma
        ↓
Paso 2: Verificar tokens
        "@design-specialist compara los colores de Figma con tokens.ts"
        ↓
Paso 3: Actualizar design tokens si es necesario
        ↓
Paso 4: Actualizar componentes afectados
```

## 🎯 Casos de Uso Comunes

### Implementar un nuevo componente desde Figma

```
@design-specialist usando Figma, implementa el componente "Hero Section"
siguiendo nuestro design system. Asegúrate de usar design tokens y que sea
accesible y responsive.
```

### Revisar accesibilidad

```
@design-specialist revisa la accesibilidad de la página de login.
Verifica contraste de colores, navegación con teclado y lectores de pantalla.
```

### Actualizar design tokens

```
@design-specialist desde Figma, extrae todos los colores y compáralos con
nuestro tokens.ts. Identifica diferencias y sugiere actualizaciones.
```

### Optimizar responsive

```
@design-specialist este layout se ve mal en mobile.
Analiza el diseño y sugiere mejoras para pantallas pequeñas.
```

### Crear variantes de componentes

```
@design-specialist el componente Button necesita una variante "ghost".
Diseña la variante considerando accesibilidad y consistencia con el sistema.
```

## 📚 Recursos

### Documentación del Proyecto

- [DESIGN_TOKENS.md](../FrontEnd/DESIGN_TOKENS.md) - Sistema de tokens completo
- [tokens.ts](../FrontEnd/src/styles/tokens.ts) - Definiciones de tokens
- [UI Components](../FrontEnd/src/components/ui/) - Biblioteca de componentes

### Referencias Externas

- [Figma API](https://www.figma.com/developers/api)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

## 🔧 Troubleshooting

### El servidor MCP de Figma no funciona

1. **Verifica el archivo de configuración:**

   ```bash
   cat ~/Library/Application\ Support/Code/User/globalStorage/github.copilot-chat/mcpServers.json
   ```

2. **Reinicia VS Code completamente** (Quit y vuelve a abrir)

3. **Verifica que npx esté disponible:**

   ```bash
   npx --version
   ```

4. **Revisa los logs de VS Code:**
   - Abre: `Help > Toggle Developer Tools > Console`
   - Busca errores relacionados con "MCP" o "Figma"

### El agente no responde correctamente

1. **Usa el @ correcto**: `@design-specialist` (con guión)

2. **Sé específico** en tu pregunta:
   - ❌ "revisa esto"
   - ✅ "revisa la accesibilidad del componente Button"

3. **Proporciona contexto** si es necesario:
   - Menciona el archivo: `@design-specialist revisa Button.tsx`
   - Incluye código en tu pregunta

### El token de Figma expiró

1. **Genera un nuevo token** en Figma:
   - Figma > Settings > Personal Access Tokens > Generate new token

2. **Actualiza la configuración MCP:**

   ```bash
   nano ~/Library/Application\ Support/Code/User/globalStorage/github.copilot-chat/mcpServers.json
   ```

3. **Reemplaza el token** y reinicia VS Code

## 🎉 ¡Listo!

Ahora tienes:

✅ **Design Specialist Agent** - Tu experto en UX/UI disponible 24/7  
✅ **Servidor MCP de Figma** - Acceso directo a tus diseños  
✅ **Workflow integrado** - Diseño → Código sin fricción  
✅ **Consistencia garantizada** - Design tokens sincronizados

**¡Empieza a diseñar!** 🚀
