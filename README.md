# Cotizador WH 💜

**Cotizador WH** es una calculadora web progresiva (PWA) de comisiones ultra-rápida, responsive y moderna, diseñada específicamente para mejorar la experiencia móvil de simulaciones financieras que antes se realizaban en AppSheet.

Funciona de manera **100% offline** (sin conexión a internet) e implementa una interfaz premium de estilo móvil ("mobile first") con soporte completo de modo claro y oscuro.

---

## 🎨 Características de Diseño
* **Diseño Premium:** Estética moderna neo-glassmorphic, con transiciones fluidas, animaciones suaves y tipografía elegante basada en la fuente *Outfit*.
* **Mobile First:** En dispositivos móviles se ve y se comporta como una app nativa, con tarjetas limpias, botones táctiles grandes y espaciados optimizados.
* **Layout Adaptable (PC):** En computadoras se despliega automáticamente en dos columnas ordenadas (formulario de entrada a la izquierda y recibo digital de resultados a la derecha).
* **Modo Claro / Oscuro:** Selector inteligente con persistencia de preferencia en almacenamiento local (`localStorage`).
* **Branding:** Integración de logos e iconos vectoriales premium en color morado real y violeta brillante.

---

## ⚙️ Funciones Principales
1. **Lógica Desacoplada:** Todo el procesamiento matemático y las reglas condicionales se ejecutan localmente en JavaScript sin depender de servidores o bases de datos.
2. **Entrada Flexible:** Admite montos con comas o puntos decimales (ej. `32,57` o `32.57`) y los procesa con total precisión.
3. **Control de Envíos:** Selector táctil del 1 al 10 para cotizar comisiones adicionales progresivas.
4. **Cálculo Explícito:** La cotización solo se ejecuta al presionar el botón "Cotizar" para evitar parpadeos y retrasos mientras se escribe.
5. **Copiado de Resultados exacto:** Un solo clic copia el desglose del recibo digital respetando exactamente los saltos de línea y formatos numéricos visibles en pantalla.
6. **Historial de Cálculos:** Almacenamiento local de las cotizaciones realizadas directamente en el navegador, **sin registrar fecha ni hora** para mantener el historial limpio de datos innecesarios. Permite recuperar cálculos con un solo toque o eliminarlos selectivamente.
7. **PWA Instalable:** Permite instalar la aplicación en la pantalla de inicio de tu celular (Android o iOS) o computadora y cargarla instantáneamente sin internet.
8. **Exportación Premium:**
   * **WhatsApp:** Genera una imagen PNG del recibo digital y la comparte por WhatsApp usando la Web Share API (o enlace directo con texto en navegadores de escritorio).
   * **Descarga directa:** Permite descargar el recibo directamente como imagen PNG de alta calidad.

---

## 🧪 Fórmulas y Casos de Prueba obligatorios Validados

Todas las complejas fórmulas de comisiones (comisión normal, porcentaje de comisión, y comisión adicional progresiva por cantidad de envíos) fueron implementadas y validadas con un script de verificación automatizado.

### Casos de Prueba Cumplidos:
1. **Monto: $8.00, Envíos: 1** ➔ Comisión final: $1.70, Monto final: $6.30, Efectivo móvil: $5.94.
2. **Monto: $32.57, Envíos: 1** ➔ Comisión final: $3.26, Monto final: $29.31, Efectivo móvil: $28.95.
3. **Monto: $107.68, Envíos: 1** ➔ Comisión final: $9.20, Monto final: $98.48, Efectivo móvil: $98.12.
4. **Monto: $15.00, Envíos: 4** ➔ Comisión normal: $1.97, Adicional: $1.20, Comisión final: `$1,97 + $1,20`, Monto final: $11.83, Efectivo móvil: $11.47.
5. **Monto: $32.57, Envíos: 10** ➔ Porcentaje comisión: 10.000%, Comisión normal: $3.26, Adicional: $2.60, Comisión final: `$3,26 + $2,60`, Monto final: $26.71, Efectivo móvil: $26.35.
6. **Monto: $107.68, Envíos: 3** ➔ Porcentaje comisión: 8.500%, Comisión normal: $9.20, Adicional: $0.85, Comisión final: `$9,20 + $0,85`, Monto final: $97.63, Efectivo móvil: $97.27.

---

## 🛠️ Instrucciones de Desarrollo, Build y Despliegue

### 1. Requisitos Previos
* Tener instalado **Node.js** (versión 18 o superior recomendada).
* Gestor de paquetes **npm**.

### 2. Clonación e Instalación
Clona el repositorio e instala las dependencias de producción y desarrollo:
```bash
git clone https://github.com/jesuszunap/cotizador-wh.git
cd cotizador-wh
npm install
```

### 3. Servidor de Desarrollo
Para levantar el servidor de desarrollo local con recarga en caliente (HMR):
```bash
npm run dev
```
Abre en tu navegador la dirección indicada, comúnmente [http://localhost:5173/cotizador-wh/](http://localhost:5173/cotizador-wh/).

### 4. Construcción para Producción
Para compilar la aplicación optimizada para producción con precaché PWA offline:
```bash
npm run build
```
Esto generará los archivos finales listos para servir en la carpeta `/dist`.

### 5. Despliegue en GitHub Pages (Manual)
Dado que la aplicación está configurada con `base: "/cotizador-wh/"` en `vite.config.js` para servirse desde `https://jesuszunap.github.io/cotizador-wh/`, puedes subirla de la siguiente manera:

1. Instala el paquete de ayuda `gh-pages` como dependencia de desarrollo:
   ```bash
   npm install -D gh-pages
   ```
2. Agrega los scripts de deploy en el archivo `package.json`:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
3. Ejecuta el comando de despliegue:
   ```bash
   npm run deploy
   ```

*(Alternativamente, puedes configurar una GitHub Action simple para desplegar automáticamente al empujar a la rama `main`).*
