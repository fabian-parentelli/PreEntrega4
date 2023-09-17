const purchaseVew = document.querySelector('#purchaseVew');
const token = localStorage.getItem('token');

window.addEventListener('DOMContentLoaded', async () => {

    const result = await fetch('/api/users/current', {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (result.status === 401) window.location.href = '/login';

    const user = await result.json();
    vewPurchase(user.data.cart._id)
});

async function vewPurchase(cart) {

    const response = await fetch(`/api/carts/${cart}/purchase`, {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    const content = await response.json();

    if(content.data) {
        const { amount, code, purchase_datetime } = content.data.result.ticket;

        const div = document.createElement('div');
        div.innerHTML = `
            <h3>Numero de transacción: ${code}</h3>
            <p>Suma total de su compra: ${amount}</p>
            <p>Día y hora de su compra: ${purchase_datetime}</p>
        `;
       purchaseVew.appendChild(div);
    };
};
