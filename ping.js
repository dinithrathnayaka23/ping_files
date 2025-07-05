const express = require('express');
const cors = require('cors');
const ping = require('ping');

const app = express();
const PORT = process.env.PORT || 5000; // 🔥 Important!

app.use(cors());

const SERVERS = [
  { name: 'Faculty Server', ip: '192.248.11.37' },
  { name: 'Cloudfire', ip: '1.1.1.1' },
  { name: 'Invalid', ip: '256.1.2.3' }
];

let serverStatus = {};

async function pingServers() {
  for (const server of SERVERS) {
    try {
      const res = await ping.promise.probe(server.ip, { timeout: 2 });
      serverStatus[server.ip] = res.alive ? 'up' : 'down';
    } catch (error) {
      console.error(`Error pinging ${server.ip}: ${error.message}`);
      serverStatus[server.ip] = 'down';
    }
  }
}

setInterval(pingServers, 2000);
pingServers();

app.get('/server-status', (req, res) => {
  const statuses = SERVERS.map(server => ({
    name: server.name,
    ip: server.ip,
    status: serverStatus[server.ip] || 'unknown'
  }));
  res.json(statuses);
});

app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
