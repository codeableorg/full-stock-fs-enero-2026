# Full stock

Esta web app sigue un arquitectura en capas. El principio es que cada capa sabe solo una cosa.

## Recorrido de una petición

El diagrama se lee en dos sentidos:

- **Flechas continuas (azules)** → el viaje de **ida**: la _petición_ (`req`) bajando por el pipeline hasta los datos.
- **Flechas punteadas (naranjas)** → el viaje de **vuelta**: la _respuesta_ (`res`) subiendo hasta el navegador.
- **Flechas punteadas (rojas)** → los **desvíos**: rutas no encontradas y errores.

```mermaid
graph TD
    C(["🌐 Cliente / Navegador"])

    subgraph GLOBAL["app.ts · middlewares globales (se ejecutan en este orden)"]
        direction TB
        ST["express.static<br/>sirve public/"]
        UE["express.urlencoded<br/>llena req.body"]
        LAY["express-ejs-layouts<br/>prepara el layout"]
        CK["cookieParser<br/>llena req.signedCookies"]
        AU["authContext<br/>añade req.user y res.locals.user"]
        CA["cartContext<br/>añade req.cart y res.locals.cartItemsCount"]
    end

    R["routes/<br/>router → setupRouter → *.routes"]
    CTRL["controllers/<br/>lee la req, orquesta, responde"]
    SRV["services/<br/>reglas de negocio"]
    REPO["repositories/<br/>acceso a datos"]
    DB[("db.ts → data/data.json")]

    V["views/ EJS<br/>res.render con res.locals"]
    NF["notFoundHandler<br/>404"]
    EH["errorHandler<br/>(err, req, res, next)"]

    C -->|"1 · petición HTTP"| ST
    ST -.->|"si es un archivo estático,<br/>responde y termina aquí"| C
    ST --> UE
    UE --> LAY
    LAY --> CK
    CK --> AU
    AU --> CA
    CA -->|"req ya viene enriquecida"| R

    R -->|"la ruta coincide"| CTRL
    R -.->|"ninguna ruta coincide"| NF

    CTRL -->|"qué hay que hacer"| SRV
    SRV -->|"qué hay que leer/escribir"| REPO
    REPO --> DB

    DB -.->|"registros"| REPO
    REPO -.->|"entidades"| SRV
    SRV -.->|"datos ya procesados"| CTRL
    CTRL -.->|"res.render(vista, datos)"| V
    V -.->|"HTML"| C

    NF -.->|"HTML de error 404"| C
    CTRL -.->|"next(err)"| EH
    SRV -.->|"throw new AppError(...)"| EH
    EH -.->|"HTML de error + status"| C

    linkStyle 0,2,3,4,5,6,7,8,10,11,12 stroke:#2563eb,stroke-width:2px
    linkStyle 1,13,14,15,16,17 stroke:#ea580c,stroke-width:2px
    linkStyle 9,18,19,20,21 stroke:#dc2626,stroke-width:2px

    classDef mw fill:#eef2ff,stroke:#6366f1,color:#1e1b4b
    classDef layer fill:#ecfdf5,stroke:#10b981,color:#064e3b
    classDef out fill:#fef2f2,stroke:#ef4444,color:#7f1d1d
    class ST,UE,LAY,CK,AU,CA mw
    class R,CTRL,SRV,REPO,DB layer
    class NF,EH out
```

## Notas sobre el pipeline

**El orden de `app.use()` es el orden de ejecución.** Cada middleware recibe `(req, res, next)` y decide si
enriquece la petición y la pasa (`next()`) o si corta el flujo respondiendo él mismo.

| Middleware | Qué añade a la petición | Por qué va en esa posición |
| --- | --- | --- |
| `express.static` | — | Va primero para no gastar trabajo en peticiones de CSS/JS/imágenes. |
| `express.urlencoded` | `req.body` | Los controladores de formularios lo necesitan. |
| `express-ejs-layouts` | — | Debe estar antes de cualquier `res.render`. |
| `cookieParser` | `req.cookies`, `req.signedCookies` | `authContext` y `cartContext` leen cookies firmadas. |
| `authContext` | `req.user`, `res.locals.user` | Necesita las cookies ya parseadas. |
| `cartContext` | `req.cart`, `req.cartId`, `res.locals.cartItemsCount` | Necesita saber si hay usuario: si lo hay busca el carrito por `userId`, si no por la cookie `cartId`. |

**`res.locals` es el puente hacia las vistas.** Lo que un middleware deja en `res.locals` (el usuario logueado,
el contador del carrito) está disponible en todas las plantillas EJS sin que el controlador tenga que pasarlo.
Por eso el header puede pintar el usuario y el carrito en cualquier página.

**Los dos últimos middlewares son las salidas de emergencia**, y por eso se registran después del router:

- `notFoundHandler` solo se ejecuta si ninguna ruta anterior respondió → renderiza un 404.
- `errorHandler` tiene 4 parámetros (`err, req, res, next`), que es como Express reconoce un manejador de
  errores. Recoge cualquier `AppError` (o error inesperado) y lo convierte en una vista de error con su status.
