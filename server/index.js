const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/collaborative-editor', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Document Schema
const documentSchema = new mongoose.Schema({
  title: { type: String, default: 'Untitled Document' },
  content: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Document = mongoose.model('Document', documentSchema);

// Socket.IO Connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-document', async (documentId) => {
    socket.join(documentId);
    const document = await Document.findById(documentId);
    if (document) {
      socket.emit('load-document', document.content);
    }
  });

  socket.on('send-changes', (delta) => {
    socket.broadcast.emit('receive-changes', delta);
  });

  socket.on('save-document', async (data) => {
    const { documentId, content } = data;
    await Document.findByIdAndUpdate(documentId, { content, updatedAt: Date.now() });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// API Routes
app.get('/api/documents', async (req, res) => {
  try {
    console.log('Fetching all documents...');
    const documents = await Document.find().sort({ updatedAt: -1 });
    console.log('Documents found:', documents.length);
    console.log('Documents:', documents.map(doc => ({ id: doc._id, title: doc.title, updatedAt: doc.updatedAt })));
    res.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/documents', async (req, res) => {
  try {
    const { title, content } = req.body;
    console.log('Creating new document:', { title, content: content ? content.substring(0, 50) + '...' : 'empty' });
    const document = new Document({ title, content });
    await document.save();
    console.log('Document created successfully:', document._id);
    res.json(document);
  } catch (error) {
    console.error('Error creating document:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/documents/:id', async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    res.json(document);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/documents/:id', async (req, res) => {
  try {
    const { content } = req.body;
    console.log('Updating document:', req.params.id, { content: content ? content.substring(0, 50) + '...' : 'empty' });
    const document = await Document.findByIdAndUpdate(
      req.params.id, 
      { content, updatedAt: Date.now() },
      { new: true }
    );
    if (!document) {
      console.log('Document not found:', req.params.id);
      return res.status(404).json({ error: 'Document not found' });
    }
    console.log('Document updated successfully:', document._id);
    res.json(document);
  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 