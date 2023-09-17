const token = localStorage.getItem('token');

window.addEventListener('DOMContentLoaded', async () => {

    const result = await fetch('/api/users/current', {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    user = await result.json();

    if (user.error || user.data.role !== 'admin') {
        window.location.href = 'http://localhost:8080/login';
    };
});

document.querySelectorAll('.role-change').forEach(button => {
    button.addEventListener('click', async () => {
        const userId = button.getAttribute('data-id');
        const response = await fetch(`/api/users/${userId}`, {
            method: 'PUT',
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        const content = await response.json();
        if(content) window.location.reload();
    });
});

document.querySelectorAll('.delete-user').forEach(button => {
    button.addEventListener('click', async () => {
        const userId = button.getAttribute('data-id');
        const response = await fetch(`/api/users/${userId}`, {
            method: 'DELETE',
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        const content = await response.json();
        if(content) window.location.reload();
    });
});

