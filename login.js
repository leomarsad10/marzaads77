let isLogin = true;

document.getElementById('toggle-mode').addEventListener('click', () => {
    isLogin = !isLogin;
    document.getElementById('auth-title').innerHTML = isLogin ? 'Admin <span class="highlight">Login</span>' : 'Register <span class="highlight">User</span>';
    document.getElementById('auth-submit').textContent = isLogin ? 'Login' : 'Register';
    document.getElementById('toggle-mode').textContent = isLogin ? 'Need to register? Click here' : 'Already have an account? Login here';
});

document.getElementById('auth-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;
    const errorEl = document.getElementById('auth-error');
    errorEl.style.display = 'none';

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    try {
        const res = await fetch(endpoint, {
            method: 'POST',
            headers:{ 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: u, password: p })
        });
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error || 'Request failed');
        
        if (isLogin) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            if (data.role === 'admin') window.location.href = 'admin.html';
            else window.location.href = 'index.html';
        } else {
            errorEl.style.display = 'block';
            errorEl.style.color = '#00ff00';
            errorEl.textContent = 'Registration successful! You can now login.';
            isLogin = true;
            document.getElementById('toggle-mode').click(); 
        }
    } catch (err) {
        errorEl.style.display = 'block';
        errorEl.style.color = 'var(--color-primary)';
        errorEl.textContent = err.message;
    }
});
