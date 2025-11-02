import express from 'express';
const hostname = '127.0.0.1';
const app = express();
const port = 3000;

// Set Pug as template engine
app.set('views', './src/views');
app.set('view engine', 'pug');

// Serve static files from the media folder
app.use('/media', express.static('media'));

// Middleware to parse JSON bodies (needed for POST later)
app.use(express.json());

// mock data
const media = [
  {
    media_id: 1,
    filename: 'couch.jpg',
    title: 'Couch',
    description: 'Nice couch',
    user_id: 101,
    media_type: 'image/jpeg',
    created_at: '2025-10-01T12:00:00Z',
  },
  {
    media_id: 2,
    filename: 'table.jpg',
    title: 'Table',
    description: 'Dining table',
    user_id: 102,
    media_type: 'image/jpeg',
    created_at: '2025-10-02T12:00:00Z',
  },
  {
    media_id: 3,
    filename: 'chair.jpg',
    title: 'Chair',
    description: 'Wooden chair',
    user_id: 103,
    media_type: 'image/jpeg',
    created_at: '2025-10-03T12:00:00Z',
  },
];

// GET / -> landing page using Pug
app.get('/', (req, res) => {
  res.render('index', {
    title: 'My Express API',
    message: 'Welcome to my simple REST API with Express!',
    media: media,
  });
});

// GET /items -> return list of items in JSON
app.get('/api/media', (req, res) => {
  res.status(200).json(media);
});

// GET /api/media/:id -> return one media item
app.get('/api/media/:id', (req, res) => {
  const id = Number(req.params.id);
  const item = media.find((m) => m.media_id === id);
  if (!item) {
    res.status(404).json({error: 'Media not found'});
  } else {
    res.status(200).json(item);
  }
});

// POST /api/media -> add new media
app.post('/api/media', (req, res) => {
  const newMedia = {
    media_id: Date.now(),
    created_at: new Date().toISOString(),
    ...req.body,
  };
  media.push(newMedia);
  res.status(201).json({message: 'Media added', media: newMedia});
});

// PUT /api/media/:id -> update existing media
app.put('/api/media/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = media.findIndex((m) => m.media_id === id);
  if (idx === -1) {
    res.status(404).json({error: 'Media not found'});
  } else {
    media[idx] = {...media[idx], ...req.body};
    res.status(200).json({message: 'Media updated', media: media[idx]});
  }
});

// DELETE /api/media/:id -> delete media
app.delete('/api/media/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = media.findIndex((m) => m.media_id === id);
  if (idx === -1) {
    res.status(404).json({error: 'Media not found'});
  } else {
    media.splice(idx, 1);
    res.status(204).send();
  }
});

// Start server
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
