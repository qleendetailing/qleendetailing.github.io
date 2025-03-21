// Customer Form Submission (index.html)
if (document.getElementById('detail-request')) {
    document.getElementById('detail-request').addEventListener('submit', async function(e) {
        e.preventDefault();

        const carMake = document.getElementById('car-make').value;
        const service = document.getElementById('service').value;
        const location = document.getElementById('location').value;

        const response = await fetch('/api/jobs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ carMake, service, location })
        });

        if (response.ok) {
            document.getElementById('form-message').textContent = `Success! Detailers in ${location} are quoting your ${carMake} - ${service}.`;
            this.reset();
        } else {
            document.getElementById('form-message').textContent = 'Oops, something went wrong. Try again!';
        }
    });
}

// Detailer Login (detailer-login.html)
if (document.getElementById('login-request')) {
    document.getElementById('login-request').addEventListener('submit', async function(e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();
        if (response.ok) {
            localStorage.setItem('token', result.token);
            window.location.href = 'detailer-dashboard.html';
        } else {
            document.getElementById('login-message').textContent = 'Invalid login. Try again!';
            document.getElementById('login-message').style.color = '#FF4500';
        }
    });
}

// Detailer Dashboard (detailer-dashboard.html)
if (document.getElementById('detailer-dashboard')) {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'detailer-login.html';
    } else {
        fetch('/api/jobs', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(response => response.json())
        .then(jobs => {
            const jobList = document.getElementById('job-list');
            jobs.forEach(job => {
                const jobItem = document.createElement('li');
                jobItem.textContent = `${job.carMake} - ${job.service} in ${job.location} - Quote Now`;
                jobList.appendChild(jobItem);
            });
            document.getElementById('detailer-name').textContent = 'Detailer'; // Replace with real username later
        })
        .catch(() => window.location.href = 'detailer-login.html');

        document.getElementById('logout').addEventListener('click', function() {
            localStorage.removeItem('token');
            window.location.href = 'detailer-login.html';
        });
    }
}