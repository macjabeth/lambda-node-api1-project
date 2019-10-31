const express = require('express');
const cors = require('cors');
const server = express();
const db = require('./data/db');

server.use(express.json());
server.use(cors());

server.post('/api/users', async (req, res) => {
  const changes = req.body;

  if (!changes.name || !changes.bio) {
    return res.status(400).json({
      errorMessage: 'Please provide name and bio for the user.'
    });
  }

  try {
    const id = await db.insert(req.body);
    const user = await db.findById(id);
    console.log(user);
    return res.status(201).json(user);
  } catch {
    return res.status(500).json({
      error: 'There was an error while saving the user to the database.'
    });
  }
});

server.get('/api/users', async (req, res) => {
  try {
    const users = await db.find();
    return res.status(200).json(users);
  } catch {
    return res.status(500).json({
      error: 'The users information could not be retrieved.'
    });
  }
});

server.get('/api/users/:id', async (req, res) => {
  try {
    const user = await db.findById(req.params.id);
    if (!user)
      return res.status(404).json({
        message: 'The user with the specified ID does not exist.'
      });
    return res.status(200).json(user);
  } catch {
    return res.status(500).json({
      error: 'The user information could be retrieved.'
    });
  }
});

server.delete('/api/users/:id', async (req, res) => {
  try {
    const user = db.findById(req.params.id);
    if (!user)
      return res.status(404).json({
        message: 'The user with the specified ID does not exist.'
      });
    await db.remove(req.params.id);
    return res.status(204).end();
  } catch {
    return res.status(500).json({
      error: 'The user could not be removed.'
    });
  }
});

server.put('/api/users/:id', async (req, res) => {
  const userId = req.params.id,
    changes = req.body;

  if (!changes.name || !changes.bio) {
    return res.status(400).json({
      errorMessage: 'Please provide name and bio for the user.'
    });
  }

  try {
    const user = db.findById(userId);
    if (!user)
      return res.status(404).json({
        message: 'The user with the specified ID does not exist.'
      });
    await db.update(userId, changes);
    return res.status(200).json(await db.findById(userId));
  } catch {
    return res.status(500).json({
      error: 'The user information could not be modified.'
    });
  }
});

const port = 4000;
server.listen(port, () => {
  console.log(`** Listening on port ${port} **`);
});
