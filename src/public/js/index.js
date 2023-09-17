const products = document.querySelector('.products');
const token = localStorage.getItem('token');
const perfil = document.querySelector('#perfil');
const cartVew = document.querySelector('#cartVew');
const salir = document.querySelector('.salir');

window.addEventListener('DOMContentLoaded', async () => {

    const result = await fetch('/api/users/current', {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if(result.status === 401) window.location.href = '/login';

    const user = await result.json();
    const cart = user.data.cart._id;

    if (user.error || user.data.role === 'admin') {
        window.location.href = '/login';
    };

    printPerfil(user.data);

    products.addEventListener('click', (e) => addToCart(e, cart));
    products.addEventListener('click', (e) => deleteProduct(e, cart));

    if (cartVew) cartVew.addEventListener('click', () => window.location.href = `/carts/${cart}`);
    if (salir) salir.addEventListener('click', logoutUser);
});

async function addToCart(e, cart) {

    if (e.target.classList.contains('btn')) {
        const btn = e.target.parentElement;
        const pid = btn.querySelector("button").getAttribute("data-id");
        const title = btn.querySelector('h2').textContent;

        const result = await fetch(`/api/carts/${cart}/products/${pid}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const message = await result.json();

        if(message.error) {
            Swal.fire({
                text: message.error,
                toast: true,
                position: "top-right",
            });
        };

        if (message.data) {
            Swal.fire({
                text: `The product ${title} was added to the cart`,
                toast: true,
                position: "top-right",
            });
        };
    };
};

function printPerfil(user) {
    if (perfil) {
        const div = document.createElement('div');
        div.innerHTML = `
            <p>Bienvenido: ${user.first_name} ${user.last_name}</p>
        `;
        perfil.appendChild(div);
    };
};

async function logoutUser() {

    const response = await fetch('/api/users', {
        method: 'PUT',
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    const content = await response.json();
    if(content.data.status === 'success') {
        window.location.href = '/';
        localStorage.removeItem('token');
    };
};

async function deleteProduct(e, cart) {

    if (e.target.classList.contains('btnDelete')) {
        const prePid = e.target.getAttribute("data-eliminar");
        const pid = prePid.replace("eliminar-", "");
      
        const response = await fetch(`/api/carts/${cart}/products/${pid}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const content = await response.json();
        if(content.data) {
            window.location.reload();
        };
    };
};