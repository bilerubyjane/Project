document.addEventListener('DOMContentLoaded', async function () {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const addItemForm = document.getElementById('addItemForm');
    const editItemForm = document.getElementById('editItemForm');
    const itemsList = document.getElementById('itemsList');
    const logoutLink = document.getElementById('logout');

    // Logika pengiriman data ke server untuk loginForm
    if (loginForm) {
        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (data.token) {
                localStorage.setItem('token', data.token);
                window.location.href = 'homepage.html';
            } else {
                alert(data.message);
            }
        });
    }

    // Logika pengiriman data ke server untuk registerForm
    if (registerForm) {
        registerForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const response = await fetch('/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (data.error) {
                alert(data.message);
            } else {
                window.location.href = 'index.html';
            }
        });
    }

    // Logika pengiriman data ke server untuk addItemForm
    if (addItemForm) {
        addItemForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const nama = document.getElementById('nama').value;
            const jumlah = document.getElementById('jumlah').value;
            const keterangan = document.getElementById('keterangan').value;
            const token = localStorage.getItem('token');
            const response = await fetch('/api/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ nama, jumlah, keterangan })
            });
            const data = await response.json();
            if (data.error) {
                alert(data.message);
            } else {
                window.location.href = 'homepage.html';
            }
        });
    }

    // Logika pengiriman data ke server untuk editItemForm
    if (editItemForm) {
        const urlParams = new URLSearchParams(window.location.search);
        const itemId = urlParams.get('id');
        fetchItem(itemId);
        editItemForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const nama = document.getElementById('nama').value;
            const jumlah = document.getElementById('jumlah').value;
            const keterangan = document.getElementById('keterangan').value;
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ nama, jumlah, keterangan })
            });
            const data = await response.json();
            if (data.error) {
                alert(data.message);
            } else {
                window.location.href = 'homepage.html';
            }
        });
    }

    // Logika pengambilan data dari server untuk menampilkan detail item pada form editItemForm
    function fetchItem(id) {
        const token = localStorage.getItem('token');
        fetch(`/api/${id}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('nama').value = data.nama;
            document.getElementById('jumlah').value = data.jumlah;
            document.getElementById('keterangan').value = data.keterangan;
        })
        .catch(error => console.error('Error:', error));
    }

    // Logika pengambilan data dari server untuk menampilkan daftar item
    async function fetchItems() {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        data.forEach(item => {
            const itemRow = document.createElement('tr');
            itemRow.innerHTML = `
                <td>${item.nama}</td>
                <td>${item.jumlah}</td>
                <td>${item.keterangan}</td>
                <td>
                    <button onclick="window.location.href='edit.html?id=${item.id}'">Edit</button>
                    <button class="delete-item" data-id="${item.id}">Delete</button>
                </td>
            `;
            itemsList.appendChild(itemRow);
        });
    }

    // Event delegation untuk tombol delete
    itemsList.addEventListener('click', async function (e) {
        if (e.target && e.target.matches('button.delete-item')) {
            const itemId = e.target.dataset.id;
            const confirmed = confirm('Are you sure you want to delete this item?');
            if (confirmed) {
                await deleteItem(itemId);
                // Reload halaman setelah item dihapus
                location.reload();
            }
        }
    });

    // Fungsi untuk menghapus item berdasarkan ID
    async function deleteItem(id) {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.error) {
            alert(data.message);
        }
    }

    // Panggil fungsi fetchItems untuk menampilkan daftar item saat halaman dimuat
    fetchItems();

    // Logika untuk logout
    if (logoutLink) {
        logoutLink.addEventListener('click', function () {
            localStorage.removeItem('token');
            window.location.href = 'index.html';
        });
    }
});
