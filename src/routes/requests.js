/**
 * Workflow Request Routes
 * GET/POST/PATCH/DELETE /api/requests  and GET /api/requests/stats
 *
 * IMPORTANT: /stats must be declared before /:id so Express treats
 * the literal segment 'stats' before the dynamic param fallback.
 */

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const store    = require('../store');
const { canTransition, statusToAction } = require('../workflow');
const { recordOnChain } = require('../blockchain');

const router = express.Router();

// GET /api/requests/stats  ← must come BEFORE /:id
router.get('/stats', (req, res) => {
  const all = store.getAll();
  res.json({
    total:     all.length,
    submitted: all.filter(r => r.status === 'submitted').length,
    in_review: all.filter(r => r.status === 'in_review').length,
    approved:  all.filter(r => r.status === 'approved').length,
    rejected:  all.filter(r => r.status === 'rejected').length,
    archived:  all.filter(r => r.status === 'archived').length,
  });
});

// GET /api/requests
router.get('/', (req, res) => {
  let result = [...store.getAll()].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  if (req.query.status) result = result.filter(r => r.status === req.query.status);
  res.json(result);
});

// GET /api/requests/:id
router.get('/:id', (req, res) => {
  const request = store.findById(req.params.id);
  if (!request) return res.status(404).json({ error: 'Request not found' });
  res.json(request);
});

// POST /api/requests — create & submit
router.post('/', (req, res) => {
  const { title, description, requester, priority, category } = req.body;
  if (!title || !description || !requester)
    return res.status(400).json({ error: 'title, description, and requester are required' });

  const newRequest = {
    id: uuidv4(),
    title,
    description,
    requester,
    status:    'submitted',
    priority:  priority || 'medium',
    category:  category || 'General',
    history:   [{ action: 'submitted', by: requester, at: new Date().toISOString(), comment: 'Request submitted for review' }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  store.add(newRequest);

  const block = recordOnChain(newRequest.id, 'submitted', requester, null, 'submitted', 'Request submitted for review');
  console.log(`⛓️  Block #${block.index} mined — [${newRequest.title}] submitted (hash: ${block.hash.slice(0, 16)}...)`);

  res.status(201).json(newRequest);
});

// PATCH /api/requests/:id/action — advance workflow
router.patch('/:id/action', (req, res) => {
  const { role, targetStatus, actor, comment } = req.body;
  if (!role || !targetStatus || !actor)
    return res.status(400).json({ error: 'role, targetStatus, and actor are required' });

  const request = store.findById(req.params.id);
  if (!request) return res.status(404).json({ error: 'Request not found' });

  if (!canTransition(request.status, role, targetStatus))
    return res.status(403).json({ error: `Role '${role}' cannot move from '${request.status}' to '${targetStatus}'` });

  const actionName = statusToAction(targetStatus);
  const fromStatus = request.status;

  request.history.push({ action: actionName, by: actor, at: new Date().toISOString(), comment: comment || '' });
  request.status    = targetStatus;
  request.updatedAt = new Date().toISOString();

  const block = recordOnChain(request.id, actionName, actor, fromStatus, targetStatus, comment || '');
  console.log(`⛓️  Block #${block.index} mined — [${request.title}] ${fromStatus} → ${targetStatus} (hash: ${block.hash.slice(0, 16)}...)`);

  res.json(request);
});

// DELETE /api/requests/:id
router.delete('/:id', (req, res) => {
  const { role } = req.body;
  if (role !== 'admin') return res.status(403).json({ error: 'Only admin can delete' });
  const removed = store.removeById(req.params.id);
  if (!removed) return res.status(404).json({ error: 'Request not found' });
  res.json({ message: 'Deleted' });
});



module.exports = router;
