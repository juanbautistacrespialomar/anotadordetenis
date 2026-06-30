# 🎾 Anotador de Tenis

PWA para llevar el marcador de un partido de tenis: **puntos** (0 · 15 · 30 · 40 · ventaja), **games** y **sets**, con un sistema de **deshacer** que reacomoda todo solo. Single-file, vanilla HTML/CSS/JS, sin frameworks, lista para GitHub Pages.

---

## Qué hace

- Elegís el **nombre de los dos jugadores**.
- Elegís la **cantidad de sets**: a 1 set, al mejor de 3 (gana 2) o al mejor de 5 (gana 3).
- **Puntos grandes** en el centro y botones **+ / −** grandes para cada jugador.
- Lleva la cuenta de **games del set en curso** y de **sets ganados**, con el line score de los sets cerrados abajo (ej.: `6-4  3-6  7-6`).
- Indica **a quién le toca sacar** (punto amarillo) y el estado del game: *En juego*, *Iguales (deuce)*, *Ventaja Fulano* o *Tie-break*.
- **Deshacer** robusto: si el último punto cerró un game o un set y lo anotaste mal, volvés atrás y **el resultado del set se reacomoda automáticamente**.
- Funciona **offline** (service worker) y se **guarda sola** (localStorage): si cerrás y volvés a abrir, el partido sigue donde estaba.

---

## Reglas de scoring implementadas

- **Game**: 0 → 15 → 30 → 40. Para ganarlo hay que llegar a 40 y sacar 2 puntos de diferencia.
  - 40-40 = **Iguales (deuce)**. El que mete el siguiente punto queda en **Ventaja**; si lo confirma, gana el game; si lo pierde, vuelve a Iguales.
- **Set**: primero en llegar a **6 games con 2 de diferencia** (6-4, 6-3…). A 5-5 sigue hasta 7-5; a **6-6 se juega tie-break**.
- **Tie-break**: a 7 puntos con 2 de diferencia. Quien lo gana cierra el set **7-6**.
- **Partido**: termina cuando un jugador alcanza los sets necesarios según el formato elegido.

> El saque alterna por game y cada 2 puntos dentro del tie-break (solo es informativo, no cambia el cálculo).

---

## Cómo funciona el "Deshacer" (la parte importante)

En lugar de intentar "restar 15" y adivinar cómo desarmar un game o un set, la app guarda una **foto (snapshot) del marcador completo antes de cada punto**: puntos, games, sets, historial de sets y estado del tie-break.

- **Deshacer punto**: restaura la última foto → vuelve atrás el último punto *sea de quien sea*. Si ese punto había cerrado un game o un set, todo el conteo vuelve solo a como estaba. Es la red de seguridad para cuando anotaste el punto al jugador equivocado (deshacés y se lo cargás al que va).
- **Botón − de cada jugador**: deshace **el último punto de ese jugador**, siempre que haya sido el último punto jugado. Si el último punto fue del rival, su botón − está atenuado (usás el − del otro o "Deshacer punto").

Esto hace que la corrección sea siempre correcta, sin recalcular nada a mano. La lógica está cubierta por un set de tests (game simple, deuce/ventaja, 6-0, 7-5, 6-6→tie-break 7-6, y deshacer a través de los límites de game y set).

---

## Archivos del repo

| Archivo | Qué es |
|---|---|
| `index.html` | Toda la app (HTML + CSS + JS en un solo archivo). |
| `manifest.json` | Metadatos PWA (nombre, colores, íconos). |
| `sw.js` | Service worker: cachea el shell para uso offline. |
| `Logo.png` | Logo en pantalla y `apple-touch-icon`. |
| `icon-192.png`, `icon-512.png` | Íconos PWA (`purpose: any`). |
| `icon-maskable-512.png` | Ícono adaptable de Android (la raqueta queda dentro de la zona segura). |

---

## Deploy en GitHub Pages

1. Subí todos los archivos a la raíz del repo (o a la carpeta que uses para Pages).
2. **Settings → Pages →** rama `main`, carpeta `/root` (o `/docs`).
3. Entrá a la URL `https://<usuario>.github.io/<repo>/`.
4. En el celu: **Compartir → Agregar a inicio** (iOS) o el menú **Instalar app** (Android/Chrome).

> Si actualizás `index.html`, subí el número de versión de la cache en `sw.js` (`const CACHE = "tenis-v2"`, etc.) para que el service worker traiga la versión nueva en vez de la cacheada.

---

## Notas técnicas

- **Stack**: HTML/CSS/JS vanilla, un solo archivo, sin dependencias en runtime (la única fuente externa es Google Fonts *Oswald*, con fallback a fuentes del sistema si no hay red).
- **iOS**: viewport con `maximum-scale` + `touch-action: manipulation` y guarda anti-doble-tap para que no haga zoom al tocar rápido los botones; inputs a 18px para evitar el auto-zoom al tipear; `safe-area-inset` respetado arriba y abajo.
- **Persistencia**: `localStorage` con la clave `tenis_estado_v1`.
- **Paleta**: terracota `#c05143` (polvo de ladrillo), tiza `#fbf6f1` y amarillo pelota `#dbe35a` como acento.
