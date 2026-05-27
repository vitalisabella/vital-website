const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(express.json());
app.use(express.static('public'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'public/uploads';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

const ADMIN_LOGIN = 'IsabellaVITAL7';
const ADMIN_PASSWORD = '18lolisabella';
const dataFile = 'data.json';

function loadData() {
  if (fs.existsSync(dataFile)) {
    return JSON.parse(fs.readFileSync(dataFile));
  }
  return {
    announcements: [],
    team: [],
    about: { title: 'Who Are We?', content: '', image: '' },
    resources: [],
    applications: [],
    schedule: []
  };
}

function saveData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_LOGIN && password === ADMIN_PASSWORD) {
    res.json({ success: true, token: 'admin_token_vital' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

function verifyAdmin(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (token === 'admin_token_vital') {
    next();
  } else {
    res.status(401).json({ success: false, message: 'Unauthorized' });
  }
}

app.get('/api/data', (req, res) => {
  res.json(loadData());
});

app.post('/api/admin/upload', verifyAdmin, upload.single('image'), (req, res) => {
  if (req.file) {
    res.json({ success: true, filename: req.file.filename });
  } else {
    res.status(400).json({ success: false, message: 'No file uploaded' });
  }
});

app.post('/api/admin/announcements', verifyAdmin, (req, res) => {
  const data = loadData();
  const announcement = {
    id: Date.now(),
    ...req.body,
    createdAt: new Date()
  };
  data.announcements.unshift(announcement);
  saveData(data);
  res.json({ success: true, announcement });
});

app.delete('/api/admin/announcements/:id', verifyAdmin, (req, res) => {
  const data = loadData();
  data.announcements = data.announcements.filter(a => a.id !== parseInt(req.params.id));
  saveData(data);
  res.json({ success: true });
});

app.post('/api/admin/team', verifyAdmin, (req, res) => {
  const data = loadData();
  const member = {
    id: Date.now(),
    ...req.body
  };
  data.team.push(member);
  saveData(data);
  res.json({ success: true, member });
});

app.delete('/api/admin/team/:id', verifyAdmin, (req, res) => {
  const data = loadData();
  data.team = data.team.filter(t => t.id !== parseInt(req.params.id));
  saveData(data);
  res.json({ success: true });
});

app.post('/api/admin/about', verifyAdmin, (req, res) => {
  const data = loadData();
  data.about = req.body;
  saveData(data);
  res.json({ success: true });
});

app.post('/api/admin/resources', verifyAdmin, (req, res) => {
  const data = loadData();
  const resource = {
    id: Date.now(),
    ...req.body
  };
  data.resources.push(resource);
  saveData(data);
  res.json({ success: true, resource });
});

app.delete('/api/admin/resources/:id', verifyAdmin, (req, res) => {
  const data = loadData();
  data.resources = data.resources.filter(r => r.id !== parseInt(req.params.id));
  saveData(data);
  res.json({ success: true });
});

app.post('/api/admin/schedule', verifyAdmin, (req, res) => {
  const data = loadData();
  const event = {
    id: Date.now(),
    ...req.body,
    interested: []
  };
  data.schedule.push(event);
  saveData(data);
  res.json({ success: true, event });
});

app.delete('/api/admin/schedule/:id', verifyAdmin, (req, res) => {
  const data = loadData();
  data.schedule = data.schedule.filter(s => s.id !== parseInt(req.params.id));
  saveData(data);
  res.json({ success: true });
});

app.post('/api/schedule/:id/interest', (req, res) => {
  const data = loadData();
  const event = data.schedule.find(e => e.id === parseInt(req.params.id));
  if (event) {
    const { name, email } = req.body;
    const exists = event.interested.some(i => i.email === email);
    if (!exists) {
      event.interested.push({ name, email, timestamp: new Date() });
    }
    saveData(data);
    res.json({ success: true, message: 'Interest marked!' });
  } else {
    res.status(404).json({ success: false, message: 'Event not found' });
  }
});

app.post('/api/applications', (req, res) => {
  const data = loadData();
  const application = {
    id: Date.now(),
    ...req.body,
    submittedAt: new Date()
  };
  data.applications.push(application);
  saveData(data);
  res.json({ success: true, message: 'Application submitted!' });
});

app.get('/api/admin/applications', verifyAdmin, (req, res) => {
  const data = loadData();
  res.json(data.applications);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`VITAL Website running on http://localhost:${PORT}`);
  console.log(`Admin login: IsabellaVITAL7 / 18lolisabella`);
});
