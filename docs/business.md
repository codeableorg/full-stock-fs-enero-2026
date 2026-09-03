# Full stock

Es un web app de venta de ropa y accesorios en línea que permite a los usuarios explorar y ordenar productos.

Es una tienda web renderizada en el servidor. Por que se arma en el servidor, es más rápido para el cliente y de esta manera no ve una pantalla en blanco.


## Reglas

1. Los usuarios no deben registrarse para poder realizar compras. (Regla de negocio)
 - Mejora la UX pero afecta decisiones de marketing y fidelización. Se mitiga con enlazamiento de compras por correo electrónico y seguimiento de pedidos. 
 - Las compras deben aceptar tener un user nulo. (Diseño de BD)
 - La identidad de un usuario sin cuenta estará representada por una cookie de carrito.  (Diseño de auth)
 - Si el visitante borra la cookie o cambia de navegador, su carrito se perderá. (Diseño de UX)

2. El carrito del visitante sobrevive al signup y al login(Regla de negocio)
 - Mejora la UX y permite que el usuario pueda comprar sin perder su carrito después del sign up/ login.
 - Destruir el carrito del visitante al hacer login o signup. (Diseño de BD)
 - La suma es siempre hacia arriba. Si el cliente ya tenia 2 polos guardados en su carrito la semana pasada, luego de un login/signup, el carrito del visitante se suma al carrito del usuario. (Diseño de BD / UX);

3. El dinero vive en centavos, siempre. (Regla de negocio, afecta la BD y la UX)
 - Evita problemas de redondeo y errores de precisión en cálculos financieros.
 - Todos los precios y transacciones deben almacenarse y procesarse en centavos. (Diseño de BD / UX)
 - Dos unidades de precio conviviendo en el mismo sistema. Cada cliente deberia ver los precios en soles y por lo tanto, puede ser sujeto de error de UI.