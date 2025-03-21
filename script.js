// Customer Form Submission (index.html)
if (document.getElementById('detail-request')) {
    document.getElementById('detail-request').addEventListener('submit', function(e) {
        e.preventDefault();

        const carMake = document.getElementById('car-make').value;
        const service = document.getElementById('service').value;
        const location = document.getElementById('location').value;

        // Store job in localStorage (mock database)
        const job = { carMake, service, location, timestamp: Date.now() };
        let jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
        jobs.push(job);
        localStorage.setItem('jobs', JSON.stringify(jobs));

        document.getElementById('form-message').textContent = `Request submitted! Detailers in ${location} will quote for your ${carMake} - ${service}.`;
        this.reset();
    });
}

// Detailer Login (detailer-login.html)
if (document.getElementById('login-request')) {
    document.getElementById('login-request').addEventListener('submit', function(e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Mock authentication (replace with real back-end later)
        const mockUsers = {
            'detailer1': 'password123',
            'detailer2': 'secure456'
        };

        if (mockUsers[username] && mockUsers[username] === password) {
            localStorage.setItem('loggedInUser', username);
            window.location.href = 'detailer-dashboard.html';
        } else {
            document.getElementById('login-message').textContent = 'Invalid username or password.';
            document.getElementById('login-message').style.color = 'red';
        }
    });
}

// Detailer Dashboard (detailer-dashboard.html)
if (document.getElementById('detailer-dashboard')) {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser) {
        window.location.href = 'detailer-login.html'; // Redirect if not logged in
    } else {
        document.getElementById('detailer-name').textContent = loggedInUser;

        // Load jobs from localStorage
        const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
        const jobList = document.getElementById('job-list');
        jobs.forEach(job => {
            const jobItem = document.createElement('li');
            jobItem.textContent = `${job.carMake} - ${job.service} in ${job.location} - Quote Now`;
            jobList.appendChild(jobItem);
        });

        // Logout
        document.getElementById('logout').addEventListener('click', function() {
            localStorage.removeItem('loggedInUser');
            window.location.href = 'detailer-login.html';
        });
    }
}
