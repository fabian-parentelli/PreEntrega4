const form = document.getElementById('registerForm');

form.addEventListener('submit', async (e) => {

    e.preventDefault();

    const user = Object.fromEntries(new FormData(form));

    const response = await fetch('/api/users/register', {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });

    const content = await response.json();
    if(content.data) {
        Swal.fire({
            text: `Bienvenido ${content.data.first_name}`,
            toast: true,
            position: "top-right",
        });
        setTimeout(() => {
            window.location.replace('/');
        }, 3000);
    };
});