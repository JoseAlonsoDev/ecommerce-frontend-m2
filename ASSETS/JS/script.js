document.addEventListener('DOMContentLoaded', () => {
    actualizarBadge(); 

    if (window.location.pathname.includes('cart.html')) {
        renderizarCarrito();
    }

    const botonesAgregar = document.querySelectorAll('.btn-add-cart');
    botonesAgregar.forEach(boton => {
        boton.addEventListener('click', (e) => {
            agregarProducto(e);
        });
    });
});

function agregarProducto(e) {
    e.preventDefault();
    const boton = e.target;
    
    const producto = {
        id: boton.dataset.id,
        titulo: boton.dataset.titulo,
        precio: parseInt(boton.dataset.precio),
        imagen: boton.dataset.imagen,
        cantidad: 1 
    };

    const inputCantidad = document.querySelector('input[type="number"]');
    if (inputCantidad) {
        producto.cantidad = parseInt(inputCantidad.value);
    }

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    const existe = carrito.find(item => item.id === producto.id);
    if (existe) {
        existe.cantidad += producto.cantidad;
    } else {
        carrito.push(producto);
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    actualizarBadge();
    const toastEl = document.getElementById('add-toast');
    const toastBody = document.getElementById('add-toast-body');
    if (toastEl && toastBody) {
        toastBody.textContent = `${producto.titulo} añadido al carrito.`;
        try {
            const toast = new bootstrap.Toast(toastEl);
            toast.show();
        } catch (err) {
            alert('¡Producto añadido al carrito!');
        }
    } else {
        alert('¡Producto añadido al carrito!');
    }
}

function renderizarCarrito() {
    const contenedor = document.getElementById('carrito-items');
    const totalElemento = document.getElementById('carrito-total');
    const subtotalElemento = document.getElementById('carrito-subtotal'); 

    if (!contenedor) return; 

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    contenedor.innerHTML = ''; 

    let total = 0;

    if (carrito.length === 0) {
        contenedor.innerHTML = '<p class="text-muted text-center">Tu carrito está vacío.</p>';
    } else {
        carrito.forEach((producto, index) => {
            const precio = producto.precio || 0;
            const cantidad = producto.cantidad || 0;
            const subtotalProducto = precio * cantidad;
            total += subtotalProducto;

            const html = `
            <div class="row align-items-center border-bottom pb-3 mb-3">
                <div class="col-3 col-md-2">
                    <img src="${producto.imagen}" class="img-fluid rounded" alt="${producto.titulo}">
                </div>
                <div class="col-9 col-md-5">
                    <h5 class="mb-1">${producto.titulo}</h5>
                    <p class="text-muted small mb-0">Precio unitario: $${precio.toLocaleString('es-CL')}</p>
                </div>
                <div class="col-6 col-md-3 mt-2 mt-md-0">
                    <div class="d-flex align-items-center">
                        <span class="me-2 text-muted">Cantidad:</span>
                        <input type="number" class="form-control form-control-sm" value="${cantidad}" min="1" onchange="cambiarCantidad(${index}, this.value)">
                    </div>
                </div>
                <div class="col-6 col-md-2 text-end mt-2 mt-md-0">
                    <span class="fw-bold">$${subtotalProducto.toLocaleString('es-CL')}</span>
                    <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${index})">Eliminar</button>
                </div>
            </div>
            `;
            contenedor.innerHTML += html;
        });
    }

    if(totalElemento) totalElemento.innerText = `$${total.toLocaleString('es-CL')}`;
    if(subtotalElemento) subtotalElemento.innerText = `$${total.toLocaleString('es-CL')}`;
}

function eliminarProducto(index) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.splice(index, 1); 
    localStorage.setItem('carrito', JSON.stringify(carrito));
    renderizarCarrito();
    actualizarBadge();
}

function cambiarCantidad(index, nuevaCantidad) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    if (nuevaCantidad < 1) {
        nuevaCantidad = 1;
    }
    carrito[index].cantidad = parseInt(nuevaCantidad);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    renderizarCarrito();
}

function actualizarBadge() {
    const badge = document.getElementById('cart-count');
    if (badge) {
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
        badge.innerText = totalItems;
    }
}