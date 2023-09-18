const form = document.getElementById('loginForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    let userinfo = Object.fromEntries(new FormData(form));
    
    const response = await fetch('/api/users/login', {
        method: 'POST',
        body: JSON.stringify(userinfo),
        headers: { "Content-type": "application/json; charset=UTF-8" },
    });

    const data = await response.json();
    console.log(data);

    if(data.error) {
        console.log('entra al error');
        Swal.fire({
            text: data.error,
            toast: true,
            position: "top-right",
        });

        setTimeout(() => {
            window.location.reload();
        }, 3000);
    };

    if(data.data.accesToken) {
        localStorage.setItem('token', data.data.accesToken);
        window.location.href = '/products';
    };
});