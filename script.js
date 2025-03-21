document.getElementById('detail-request').addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form values
    const carMake = document.getElementById('car-make').value;
    const service = document.getElementById('service').value;
    const location = document.getElementById('location').value;

    // Display confirmation
    document.getElementById('form-message').textContent = `Request submitted! Detailers in ${location} will quote for your ${carMake} - ${service}.`;

    // Add job to detailer dashboard (mock)
    const jobList = document.getElementById('job-list');
    const jobItem = document.createElement('li');
    jobItem.textContent = `${carMake} - ${service} in ${location} - Quote Now`;
    jobList.appendChild(jobItem);

    // Reset form
    this.reset();
});