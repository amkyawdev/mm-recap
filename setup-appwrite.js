/**
 * Appwrite Backend Setup Script
 * 
 * Usage:
 *   APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1 \
 *   APPWRITE_PROJECT_ID=your-project-id \
 *   APPWRITE_API_KEY=your-api-key \
 *   node setup-appwrite.js
 */

const https = require('https');

const ENDPOINT = process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const PROJECT_ID = process.env.APPWRITE_PROJECT_ID;
const API_KEY = process.env.APPWRITE_API_KEY;

if (!PROJECT_ID || !API_KEY) {
  console.error('Error: APPWRITE_PROJECT_ID and APPWRITE_API_KEY are required');
  process.exit(1);
}

async function appwriteRequest(method, path, body = null) {
  const url = new URL(ENDPOINT + path);
  const options = {
    hostname: url.hostname,
    path: url.pathname,
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'X-Appwrite-Project': PROJECT_ID,
      'X-Appwrite-Key': API_KEY
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          resolve(data);
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function setup() {
  console.log('🚀 Setting up AmkyawDev Recap Backend...\n');

  // 1. Create Database
  console.log('📦 Creating Database...');
  try {
    const dbResult = await appwriteRequest('POST', '/databases', {
      name: 'recap',
      databaseId: 'recap'
    });
    console.log('✓ Database created:', dbResult.name || dbResult.$id);
  } catch (e) {
    if (e.message.includes('already exists')) {
      console.log('✓ Database already exists');
    } else {
      console.log('⚠ Database:', e.message);
    }
  }

  // 2. Create Collections
  const collections = [
    {
      id: 'projects',
      name: 'Projects',
      attributes: [
        { key: 'name', type: 'string', size: 255, required: true },
        { key: 'userId', type: 'string', size: 255, required: true },
        { key: 'status', type: 'string', size: 50, required: true },
        { key: 'thumbnail', type: 'string', size: 255, required: false }
      ]
    },
    {
      id: 'videos',
      name: 'Videos',
      attributes: [
        { key: 'projectId', type: 'string', size: 255, required: true },
        { key: 'storageId', type: 'string', size: 255, required: true },
        { key: 'duration', type: 'integer', required: false },
        { key: 'type', type: 'string', size: 50, required: true }
      ]
    },
    {
      id: 'subtitles',
      name: 'Subtitles',
      attributes: [
        { key: 'videoId', type: 'string', size: 255, required: true },
        { key: 'segments', type: 'string', size: 10000, required: true },
        { key: 'language', type: 'string', size: 10, required: true }
      ]
    },
    {
      id: 'settings',
      name: 'User Settings',
      attributes: [
        { key: 'userId', type: 'string', size: 255, required: true },
        { key: 'openaiKey', type: 'string', size: 255, required: false },
        { key: 'geminiKey', type: 'string', size: 255, required: false },
        { key: 'elevenlabsKey', type: 'string', size: 255, required: false }
      ]
    }
  ];

  for (const col of collections) {
    console.log('\n   Creating collection:', col.name);
    try {
      const result = await appwriteRequest('POST', '/databases/recap/collections', {
        name: col.name,
        collectionId: col.id
      });
      console.log('   ✓', col.name, 'created');

      // Add attributes
      for (const attr of col.attributes) {
        try {
          await appwriteRequest('POST', '/databases/recap/collections/' + col.id + '/attributes', {
            key: attr.key,
            type: attr.type,
            size: attr.size,
            required: attr.required
          });
          console.log('     ✓ Attribute:', attr.key);
        } catch (e) {
          console.log('     ⚠ Attribute', attr.key + ':', e.message);
        }
      }
    } catch (e) {
      console.log('   ⚠', col.name + ':', e.message);
    }
  }

  // 3. Create Storage Bucket
  console.log('\n📁 Creating Storage Bucket...');
  try {
    await appwriteRequest('POST', '/storage/buckets', {
      name: 'videos',
      bucketId: 'videos',
      permissions: ['read("any")', 'write("users")'],
      fileSecurity: true
    });
    console.log('✓ Videos bucket created');
  } catch (e) {
    console.log('⚠ Videos bucket:', e.message);
  }

  console.log('\n✅ Backend setup complete!');
  console.log('\nNext steps:');
  console.log('1. Deploy Appwrite Functions manually via console');
  console.log('2. Or use the deploy scripts in .github/workflows/');
}

setup().catch(console.error);
