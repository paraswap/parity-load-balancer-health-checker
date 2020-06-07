const http = require('http');

const HOSTNAME = process.env.HC_HOSTNAME || '127.0.0.1';
const PORT = process.env.PORT || 4444;

const RESPONSE_TIMEOUT = process.env.HC_RESPONSE_TIMEOUT || 5 * 1000;

const ETH_NODE_HOST = process.env.HC_ETH_NODE_HOST || 'localhost';
const ETH_NODE_PORT = process.env.HC_ETH_NODE_PORT || 8545;

async function checkHealth() {
  return new Promise((resolve, reject) => {
    let done = false;

    setTimeout(() => {
      if (!done) {
        done = true;
        reject(new Error("Timeout"));
      }
    }, RESPONSE_TIMEOUT);

    const data = JSON.stringify({
      jsonrpc: "2.0",
      method: "eth_syncing",
      params: [],
      id: "checkHealth"
    });

    const options = {
      hostname: ETH_NODE_HOST,
      port: ETH_NODE_PORT,
      path: '/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = http.request(options, (res) => {
      res.on('data', (d) => {
        const response = JSON.parse(d.toString());

        if (!response.result) {
          resolve();
        } else {
          reject(new Error("node_syncing..."));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(error));
    });

    req.write(data);
    req.end();
  })
}

const server = http.createServer(async (req, res) => {
  try {
    await checkHealth();
    res.statusCode = 200;
    res.end();

  } catch (e) {
    console.error('error...', e.message);
    res.statusCode = 403;
    res.end(e.message);
  }
});

server.listen(PORT, HOSTNAME, () => {
  console.log(`pid: ${process.pid} Server running at http://${HOSTNAME}:${PORT}/`);
});
