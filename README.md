# 🎾 Anotador de Tenis

PWA para llevar el marcador de un partido de tenis: **puntos** (0 · 15 · 30 · 40 · deuce · ventaja), **games** y **sets**, con cronómetro, deshacer y compartir resultado. Fondo de **cancha de polvo de ladrillo**. Single-file, vanilla HTML/CSS/JS, sin frameworks, lista para GitHub Pages.

---

## Qué hace

- Elegís el **nombre de los dos jugadores** y la **cantidad de sets** (1, al mejor de 3, o al mejor de 5).
- Antes de arrancar, pregunta **¿quién saca primero?** y desde ahí marca el saque (alterna game a game).
- **Puntos grandes** y botones **+ / −** grandes por jugador, sobre paneles opacos para máxima legibilidad sobre la cancha.
- **Marcador tipo scoreboard**: columna de SETS ganados, los games de cada set ya cerrado y el set en curso resaltado en amarillo. De un vistazo ves cómo viene el partido.
- **Cartel central** que muestra el estado del game: *Saca Fulano*, *Deuce · Iguales*, *Ventaja Fulano* o *Tie-break*.
- **Cronómetro** del partido con botón **Iniciar / Pausar / Seguir**.
- **Deshacer** robusto: si el último punto cerró un game o un set y lo anotaste mal, volvés atrás y el resultado se reacomoda solo.
- Al terminar, **compartir el resultado** (ganador, sets y tiempo jugado) por el menú nativo del celular o copiándolo.
- Funciona **offline** (service worker) y se **guarda sola** (localStorage): si cerrás y volvés, el partido sigue donde estaba.

---

## Reglas de scoring implementadas

- **Game**: 0 → 15 → 30 → 40. Se gana llegando a 40 con 2 puntos de diferencia.
  - 40-40 = **Deuce / Iguales**. El siguiente punto da **Ventaja**; si la confirma gana el game, si la pierde vuelve a Deuce.
- **Set**: primero en llegar a **6 games con 2 de diferencia** (6-4, 6-3…). A 5-5 sigue hasta 7-5; a **6-6 se juega tie-break**.
- **Tie-break**: a 7 puntos con 2 de diferencia. Quien lo gana cierra el set **7-6**.
- **Partido**: termina cuando un jugador alcanza los sets necesarios según el formato.

---

## Cómo funciona el "Deshacer"

La app guarda una **foto (snapshot) del marcador completo antes de cada punto** (puntos, games, sets, historial y tie-break). Deshacer no resta 15: **restaura la foto anterior**, así si el punto había cerrado un game o un set, todo el conteo vuelve solo.

- **Deshacer punto**: revierte el último punto, sea de quien sea (sirve también para cuando le cargaste el punto al jugador equivocado).
- **Botón − de cada jugador**: deshace **su** último punto, si fue el último jugado.

El cronómetro corre aparte del marcador; solo si deshacés el punto que ganó el partido, el reloj vuelve a correr.

---

## Cronómetro

- Botón **▶ Iniciar** → arranca el reloj. Después alterna entre **⏸ Pausar** y **▶ Seguir**.
- Si te olvidás de iniciarlo y anotás un punto, arranca solo.
- Al terminar el partido, el tiempo **se congela** y es el que se incluye al compartir.
- Formato `M:SS`, o `H:MM:SS` si supera la hora.

---

## Archivos del repo

| Archivo | Qué es |
|---|---|
| `index.html` | Toda la app (HTML + CSS + JS en un solo archivo). |
| `manifest.json` | Metadatos PWA (nombre, colores, íconos). |
| `sw.js` | Service worker: cachea el shell para uso offline. |
| `Logo.png` | Logo en pantalla y `apple-touch-icon`. |
| `icon-192.png`, `icon-512.png` | Íconos PWA (`purpose: any`). |
| `icon-maskable-512.png` | Ícono adaptable de Android (raqueta dentro de la zona segura). |

---

## Deploy en GitHub Pages

1. Subí todos los archivos a la raíz del repo (o a la carpeta que uses para Pages).
2. **Settings → Pages →** rama `main`, carpeta `/root` (o `/docs`).
3. Entrá a `https://<usuario>.github.io/<repo>/`.
4. En el celu: **Compartir → Agregar a inicio** (iOS) o **Instalar app** (Android/Chrome).

> Si actualizás `index.html`, subí la versión de cache en `sw.js` (`const CACHE = "tenis-v3"`, etc.) para que el service worker traiga la versión nueva en vez de la cacheada.

---

## Notas técnicas

- **Stack**: HTML/CSS/JS vanilla, un solo archivo, sin dependencias en runtime (la única fuente externa es Google Fonts *Oswald*, con fallback a fuentes del sistema sin red).
- **Compartir**: usa la Web Share API (`navigator.share`) cuando está disponible; si no, ofrece copiar el texto. Requiere https — funciona en GitHub Pages.
- **iOS**: viewport con `maximum-scale` + `touch-action: manipulation` y guarda anti-doble-tap; inputs a 18px para evitar el auto-zoom; `safe-area-inset` respetado.
- **Persistencia**: `localStorage` con la clave `tenis_estado_v1`.
- **Paleta**: cancha terracota `#bf4f41`, paneles ladrillo oscuro `#4f241c`, tiza `#fbf6f1` y amarillo pelota `#e2e85a`.
