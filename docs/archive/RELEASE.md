# Estrategia de versionado y releases automáticos

Este repositorio utiliza `semantic-release` para automatizar el versionado, generación de changelogs y la creación de Releases en GitHub.

Flujo resumido:
- Cada merge/push a la rama `main` disparará el workflow de GitHub Actions `.github/workflows/release.yml`.
- `semantic-release` analiza los commits (Convencional Commits) para decidir si subir un `patch`, `minor` o `major`.
- Se actualiza `CHANGELOG.md` y se crea una Release en GitHub con las notas.

Requisitos:
- Usar mensajes de commit siguiendo Conventional Commits (ej: `fix(...)`, `feat(...)`, `chore(...)`).
- Tener el secreto `GITHUB_TOKEN` estándar (proporcionado automáticamente por GitHub Actions).

Cómo probar localmente:
1. Crear una rama de prueba y hacer commits con mensajes convencionales.
2. Pushear a `main` o hacer merge a `main` en una PR para activar el workflow.
