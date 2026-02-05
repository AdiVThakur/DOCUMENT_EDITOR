const mongoose = require('mongoose');
require('dotenv').config();

// Document Schema
const documentSchema = new mongoose.Schema({
  title: { type: String, default: 'Untitled Document' },
  content: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Document = mongoose.model('Document', documentSchema);

async function testDatabase() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/collaborative-editor', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB successfully!');

    // Check if there are any documents
    const documents = await Document.find();
    console.log(`Found ${documents.length} documents in database:`);
    documents.forEach(doc => {
      console.log(`- ID: ${doc._id}, Title: ${doc.title}, Updated: ${doc.updatedAt}`);
    });

    // Create a test document
    console.log('\nCreating a test document...');
    const testDoc = new Document({
      title: 'Test Document',
      content: 'This is a test document to verify the database is working.'
    });
    await testDoc.save();
    console.log('Test document created successfully!');

    // Check again
    const updatedDocuments = await Document.find();
    console.log(`\nNow found ${updatedDocuments.length} documents in database:`);
    updatedDocuments.forEach(doc => {
      console.log(`- ID: ${doc._id}, Title: ${doc.title}, Updated: ${doc.updatedAt}`);
    });

  } catch (error) {
    console.error('Database test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

testDatabase();
