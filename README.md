# Workflow Automation System

Digital approval workflow: **Request → Review → Approve → Archive**

## Quick Start

```bash
cd workflow-app
npm install
npm start
# Open http://localhost:3001
```

## Project Structure

```
workflow-app/
├── server.js          # Node.js/Express backend + workflow engine
├── package.json
└── public/
    └── index.html     # React + Tailwind frontend (CDN, no build step)
```

## Roles & Permissions

| Role       | Actor              | Can Do                                      |
|------------|--------------------|---------------------------------------------|
| Requester  | Alice (Requester)  | Submit new requests                         |
| Reviewer   | Carol (Reviewer)   | Pick up submitted requests → In Review      |
| Approver   | David (Approver)   | Approve or Reject requests in review        |
| Admin      | Eve (Admin)        | Archive approved requests, full visibility  |

## Workflow States

```
submitted ──► in_review ──► approved ──► archived
                        └──► rejected
```

## REST API

| Method  | Endpoint                        | Description                   |
|---------|---------------------------------|-------------------------------|
| GET     | /api/requests                   | List all requests             |
| GET     | /api/requests/:id               | Get single request            |
| POST    | /api/requests                   | Create & submit request       |
| PATCH   | /api/requests/:id/action        | Advance workflow              |
| DELETE  | /api/requests/:id               | Admin hard-delete             |
| GET     | /api/stats                      | Dashboard summary counts      |

### POST /api/requests
```json
{
  "title": "Budget Request Q3",
  "description": "15% increase for marketing",
  "requester": "Alice (Requester)",
  "priority": "high",
  "category": "Finance"
}
```

### PATCH /api/requests/:id/action
```json
{
  "role": "reviewer",
  "targetStatus": "in_review",
  "actor": "Carol (Reviewer)",
  "comment": "Starting review now"
}
```
