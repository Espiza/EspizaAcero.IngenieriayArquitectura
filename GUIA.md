# Web Espiza Acero — guía rápida

## Qué contiene
- `index.html`, `producto.html`, `proyectos.html` → las 3 plantillas de la web (no hace falta tocarlas).
- `data/` → **aquí está todo el contenido** (textos, nombres, rutas de fotos). El panel edita estos archivos.
- `img/` → **aquí van tus fotos**. Copia tu carpeta `img` completa encima de esta (ventanas, mamparas, puertas, ducha, melamina, proyectos, hero-slide-1..4.jpg, nosotros.jpg, sede.jpg).
- `.pages.yml` → configuración del panel de edición.

## 1. Probar en tu computadora
Abrir `index.html` con doble clic **no funciona** (el navegador bloquea la lectura de `data/`). Desde la carpeta:

    python3 -m http.server 8000

y abre http://localhost:8000

## 2. Subir a GitHub
1. Crea una cuenta en github.com y un repositorio nuevo (ej. `espiza-acero`).
2. Sube TODO el contenido de esta carpeta (incluida la carpeta `img` con tus fotos y el archivo `.pages.yml`, que empieza con punto).

## 3. Publicar la web (elige una)
**Cloudflare Pages** (el repositorio puede ser privado)
- dash.cloudflare.com → Workers & Pages → Create → Pages → Connect to Git → elige el repositorio.
- Build command: *(vacío)*. Build output directory: `/`. Deploy.

**GitHub Pages** (repositorio público)
- En el repositorio: Settings → Pages → Branch `main` / carpeta `/ (root)` → Save.

Cada vez que se guarda un cambio en GitHub, la web se actualiza sola en 1–2 minutos.

## 4. Panel de edición
1. Entra a **app.pagescms.org** e inicia sesión con GitHub.
2. Autoriza la app en tu repositorio y ábrelo.
3. Verás las secciones: Datos de la empresa, Menú, Página de inicio, Proyectos y Páginas de productos.
4. Cambia textos o fotos y pulsa **Save**.

Si el panel muestra un error de configuración, revisa `.pages.yml` contra la documentación de Pages CMS (pagescms.org/docs). Esa parte no pude probarla desde aquí.

## Trucos de edición
- **Negrita** en los párrafos de "Sobre nosotros": escribe `**así**`.
- **Cambiar una foto**: sube la foto nueva desde el campo de imagen y elígela.
- **Agregar otra foto a una galería**: Páginas de productos → la página → Fotos de la galería → Add.
- **Crear una página de producto nueva**: (1) en Páginas de productos crea un archivo nuevo; el nombre del archivo sin `.json` es el código de la página. (2) En Menú, añade el nombre y ese código dentro del grupo que corresponda.
- Los códigos solo pueden llevar letras, números y guiones (sin ñ, sin espacios).
