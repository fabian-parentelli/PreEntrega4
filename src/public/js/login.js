const form = document.getElementById('loginForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    let userinfo = Object.fromEntries(new FormData(form));
    
    const response = await fetch('/api/users/login', {
        method: 'POST',
        body: JSON.stringify(userinfo),
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
        }
    });

    const data = await response.json();

    if(data.error) {
        Swal.fire({
            text: data.error,
            toast: true,
            position: "top-right",
            showConfirmButton: false
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