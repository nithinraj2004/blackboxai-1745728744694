const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const app = express();
const port = 3000;

// In-memory data storage for demo purposes
const users = {
  doctors: [
    { id: 'doc1', username: 'doctor1', password: 'password1' }
  ],
  patients: [
    { id: 'pat1', username: 'patient1', password: 'password1', data: null }
  ]
};

// Encryption key (in a real app, store securely)
const ENCRYPTION_KEY = crypto.randomBytes(32);
const IV_LENGTH = 16;

app.use(bodyParser.json());

// Simple authentication middleware
function authenticate(role) {
  return (req, res, next) => {
    const { username, password } = req.headers;
    if (!username || !password) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    const user = users[role].find(u => u.username === username && u.password === password);
    if (!user) {
      return res.status(403).json({ error: 'Invalid credentials' });
    }
    req.user = user;
    next();
  };
}

// Encryption function
function encrypt(text) {
  let iv = crypto.randomBytes(IV_LENGTH);
  let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// Decryption function
function decrypt(text) {
  let textParts = text.split(':');
  let iv = Buffer.from(textParts.shift(), 'hex');
  let encryptedText = Buffer.from(textParts.join(':'), 'hex');
  let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

// Doctor adds or updates patient data
app.post('/doctor/patient-data', authenticate('doctors'), (req, res) => {
  const { patientId, data } = req.body;
  const patient = users.patients.find(p => p.id === patientId);
  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }
  const encryptedData = encrypt(JSON.stringify(data));
  patient.data = encryptedData;
  res.json({ message: 'Patient data saved securely' });
});

// Patient views their data
app.get('/patient/data', authenticate('patients'), (req, res) => {
  const patient = req.user;
  if (!patient.data) {
    return res.json({ data: null });
  }
  const decryptedData = decrypt(patient.data);
  res.json({ data: JSON.parse(decryptedData) });
});

// Patient shares data (returns encrypted data for sharing)
app.get('/patient/share-data', authenticate('patients'), (req, res) => {
  const patient = req.user;
  if (!patient.data) {
    return res.status(404).json({ error: 'No data to share' });
  }
  res.json({ encryptedData: patient.data });
});

app.listen(port, () => {
  console.log('Healthcare management system server running on port ' + port);
});
