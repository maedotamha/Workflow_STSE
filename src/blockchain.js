/**
 * Blockchain Engine
 * Immutable audit ledger using SHA-256 chained blocks with proof-of-work.
 */

const crypto = require('crypto');

class Block {
  constructor(index, data, previousHash = '0000000000000000') {
    this.index        = index;
    this.timestamp    = new Date().toISOString();
    this.data         = data; // { requestId, action, actor, fromStatus, toStatus, comment }
    this.previousHash = previousHash;
    this.nonce        = 0;
    this.hash         = this.mine(); // proof-of-work: hash must start with '00'
  }

  // SHA-256 hash of this block's contents
  computeHash() {
    const str = JSON.stringify({
      index:        this.index,
      timestamp:    this.timestamp,
      data:         this.data,
      previousHash: this.previousHash,
      nonce:        this.nonce,
    });
    return crypto.createHash('sha256').update(str).digest('hex');
  }

  // Proof-of-work: increment nonce until hash starts with '00' (difficulty 2)
  mine(difficulty = 2) {
    const target = '0'.repeat(difficulty);
    let hash = this.computeHash();
    while (!hash.startsWith(target)) {
      this.nonce++;
      hash = this.computeHash();
    }
    return hash;
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesis()];
  }

  createGenesis() {
    return new Block(0, {
      requestId:  'GENESIS',
      action:     'genesis',
      actor:      'System',
      fromStatus: null,
      toStatus:   null,
      comment:    'FlowDesk Workflow Ledger — Genesis Block',
    }, '0000000000000000');
  }

  getLatest() {
    return this.chain[this.chain.length - 1];
  }

  // Add a new block recording a workflow action
  addBlock(data) {
    const block = new Block(this.chain.length, data, this.getLatest().hash);
    this.chain.push(block);
    return block;
  }

  // Verify the entire chain — checks hash integrity and chain linkage
  verify() {
    const issues = [];
    for (let i = 1; i < this.chain.length; i++) {
      const current  = this.chain[i];
      const previous = this.chain[i - 1];

      const recomputed = current.computeHash();
      if (current.hash !== recomputed) {
        issues.push({ block: i, reason: 'Hash mismatch — block data was altered' });
      }
      if (current.previousHash !== previous.hash) {
        issues.push({ block: i, reason: 'Chain broken — previousHash does not match' });
      }
    }
    return {
      valid:      issues.length === 0,
      blockCount: this.chain.length,
      issues,
      verifiedAt: new Date().toISOString(),
    };
  }

  // Get all blocks for a specific request
  getByRequest(requestId) {
    return this.chain.filter(b => b.data.requestId === requestId);
  }
}

// Single shared blockchain instance
const ledger = new Blockchain();

/**
 * Record a workflow event on the blockchain.
 * @returns {Block} the newly mined block
 */
function recordOnChain(requestId, action, actor, fromStatus, toStatus, comment = '') {
  return ledger.addBlock({ requestId, action, actor, fromStatus, toStatus, comment });
}

module.exports = { ledger, recordOnChain };
