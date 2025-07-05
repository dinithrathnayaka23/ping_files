const express = require('express');
const cors = require('cors');
const ping = require('ping');

const app = express();
const PORT = 5000;

app.use(cors()); // Enable CORS

// List of servers to monitor
const SERVERS = [
  { name: 'Faculty Server', ip: '192.248.11.37' },
  { name: 'Cloudfire', ip: '1.1.1.1' },
  { name: 'Invalid', ip: '256.1.2.3' }
];

// Object to hold server status
let serverStatus = {};

// Function to ping servers and update status
async function pingServers() {
  for (const server of SERVERS) {
    try {
      const res = await ping.promise.probe(server.ip, {
        timeout: 2,
      });
      serverStatus[server.ip] = res.alive ? 'up' : 'down';
    } catch (error) {
      console.error(`Error pinging ${server.ip}: ${error.message}`);
      serverStatus[server.ip] = 'down';
    }
  }
}

// Start pinging every 2 seconds
setInterval(pingServers, 2000);
pingServers(); // Initial run

// API endpoint
app.get('/server-status', (req, res) => {
  const statuses = SERVERS.map(server => ({
    name: server.name,
    ip: server.ip,
    status: serverStatus[server.ip] || 'unknown'
  }));
  res.json(statuses);
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
