const express = require('express');
const cors    = require('cors');
const path    = require('path');

const requestRoutes    = require('./src/routes/requests');
const blockchainRoutes = require('./src/routes/blockchain');
const { ledger }       = require('./src/blockchain');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/requests',    requestRoutes);
app.use('/api/blockchain',  blockchainRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  const v = ledger.verify();
  console.log(`FlowDesk running at http://localhost:${PORT}`);
  console.log(`Blockchain ledger ready — ${ledger.chain.length} blocks, integrity: ${v.valid ? 'valid' : 'compromised'}`);
  console.log(`API: http://localhost:${PORT}/api/requests`);
  console.log(`Ledger: http://localhost:${PORT}/api/blockchain/ledger\n`);
});

