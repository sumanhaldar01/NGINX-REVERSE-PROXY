document.addEventListener('DOMContentLoaded', function() {
    // Fetch main API data
    fetch('/')
        .then(response => {
            if (!response.ok) {
                throw new Error('API response was not ok');
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('app-status').textContent = data.status;
            document.getElementById('app-message').textContent = data.message;
            
            // Format the timestamp for better readability
            const timestamp = new Date(data.timestamp);
            document.getElementById('app-timestamp').textContent = timestamp.toLocaleString();
            
            // Update the status badge
            document.getElementById('status-text').textContent = 'Online';
            
            // Add success class to the status badge
            document.querySelector('.status-badge').classList.add('healthy');
        })
        .catch(error => {
            console.error('Error fetching API data:', error);
            document.getElementById('app-status').textContent = 'Error';
            document.getElementById('app-message').textContent = 'Could not load application data';
            document.getElementById('app-timestamp').textContent = 'N/A';
            
            // Update the status badge
            document.getElementById('status-text').textContent = 'Offline';
            document.querySelector('.status-badge').classList.add('unhealthy');
        });

    // Fetch health check data
    fetch('/health')
        .then(response => {
            if (!response.ok) {
                throw new Error('Health check failed');
            }
            return response.json();
        })
        .then(data => {
            const healthStatus = document.getElementById('health-status');
            healthStatus.innerHTML = '';
            
            if (data.status === 'healthy') {
                healthStatus.classList.add('healthy');
                healthStatus.innerHTML = `
                    <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span>System Healthy</span>
                `;
            } else {
                healthStatus.classList.add('unhealthy');
                healthStatus.innerHTML = `
                    <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                    <span>System Unhealthy</span>
                `;
            }
        })
        .catch(error => {
            console.error('Error fetching health data:', error);
            const healthStatus = document.getElementById('health-status');
            healthStatus.innerHTML = '';
            healthStatus.classList.add('unhealthy');
            healthStatus.innerHTML = `
                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
                <span>Connection Error</span>
            `;
        });
});