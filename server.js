const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('public'));

const DB_FILE = path.join(__dirname, 'db.json');

const DEFAULT_LINKS = [
  {id:1, name:'BoldNet',    url:'https://boldnet6705.b-cdn.net/',    emoji:'🌐'},
  {id:2, name:'QuickDash',  url:'https://quickdash7898.b-cdn.net/',  emoji:'⚡'},
  {id:3, name:'CleanNode',  url:'https://cleannode3460.b-cdn.net/',  emoji:'✨'},
  {id:4, name:'FastNet',    url:'https://fastnet7903.b-cdn.net/',    emoji:'🚀'},
  {id:5, name:'RapidWeb',   url:'https://rapidweb2947.b-cdn.net/',   emoji:'💨'},
  {id:6, name:'BrightWeb',  url:'https://brightweb9616.b-cdn.net/',  emoji:'💡'},
  {id:7, name:'RapidWeb 2', url:'https://rapidweb7445.b-cdn.net/',   emoji:'🔥'},
  {id:8, name:'SharpWave',  url:'https://sharpwave1928.b-cdn.net/',  emoji:'〽️'},
  {id:9, name:'LiteFlux',   url:'https://liteflux9331.b-cdn.net/',   emoji:'⚗️'},
  {id:10,name:'PrimeWave',  url:'https://primewave9672.b-cdn.net/',  emoji:'🌊'},
  {id:11,name:'SharpHub',   url:'https://sharphub5245.b-cdn.net/',   emoji:'🔷'},
  {id:12,name:'HyperBeam',  url:'https://hyperbeam8456.b-cdn.net/',  emoji:'🔆'},
  {id:13,name:'UltraVolt',  url:'https://ultravolt9483.b-cdn.net/',  emoji:'⚡'},
  {id:14,name:'UltraLink',  url:'https://ultralink4225.b-cdn.net/',  emoji:'🔗'},
  {id:15,name:'PrimeCache', url:'https://primecache2259.b-cdn.net/', emoji:'💾'},
  {id:16,name:'ApexCDN',    url:'https://apexcdn8606.b-cdn.net/',    emoji:'🏔️'},
  {id:17,name:'QuickCDN',   url:'https://quickcdn7334.b-cdn.net/',   emoji:'📡'},
  {id:18,name:'Vapor',      url:'https://ess-education.org/',        emoji:'🌫️'},
];

function readDB() {
  if (!fs.existsSync(DB_FILE)) {
    const init = { users: {}, links: DEFAULT_LINKS, nextId: 19 };
    fs.writeFileSync(DB_FILE, JSON.stringify(init, null, 2));
    return init;
  }
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

const INVITE_PASSWORDS = ['tejushasnoaura', 'Jay'];
const ADMIN_PASSWORD = 'messi2be';

app.post('/api/signup', (req, res) => {
  const { username, password } = req.body;
  if (!INVITE_PASSWORDS.includes(password))
    return res.json({ ok: false, error: 'Wrong invite password.' });
  const db = readDB();
  if (!username || username.trim().length < 2)
    return res.json({ ok: false, error: 'Username too short.' });
  if (db.users[username])
    return res.json({ ok: false, error: 'Username already taken.' });
  db.users[username] = password;
  writeDB(db);
  res.json({ ok: true, username });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const db = readDB();
  if (db.users[username] && db.users[username] === password) {
    res.json({ ok: true, username });
  } else {
    res.json({ ok: false, error: 'Wrong username or password.' });
  }
});

app.get('/api/links', (req, res) => {
  const db = readDB();
  res.json(db.links);
});

app.post('/api/links', (req, res) => {
  const { adminPassword, name, url, emoji } = req.body;
  if (adminPassword !== ADMIN_PASSWORD)
    return res.json({ ok: false, error: 'Wrong admin password.' });
  if (!name || !url)
    return res.json({ ok: false, error: 'Name and URL required.' });
  const db = readDB();
  const link = { id: db.nextId++, name, url, emoji: emoji || '🔗' };
  db.links.push(link);
  writeDB(db);
  res.json({ ok: true, link });
});

app.delete('/api/links/:id', (req, res) => {
  const { adminPassword } = req.body;
  if (adminPassword !== ADMIN_PASSWORD)
    return res.json({ ok: false, error: 'Wrong admin password.' });
  const db = readDB();
  const id = parseInt(req.params.id);
  db.links = db.links.filter(l => l.id !== id);
  writeDB(db);
  res.json({ ok: true });
});

app.get('/api/users', (req, res) => {
  const { adminPassword } = req.query;
  if (adminPassword !== ADMIN_PASSWORD)
    return res.json({ ok: false, error: 'Unauthorized.' });
  const db = readDB();
  res.json({ ok: true, users: Object.keys(db.users) });
});

app.delete('/api/users/:username', (req, res) => {
  const { adminPassword } = req.body;
  if (adminPassword !== ADMIN_PASSWORD)
    return res.json({ ok: false, error: 'Unauthorized.' });
  const db = readDB();
  delete db.users[req.params.username];
  writeDB(db);
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Jay's OS running on port ${PORT}`));
