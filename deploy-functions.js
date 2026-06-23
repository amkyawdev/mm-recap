/**
 * Appwrite Functions Deployment Script
 * 
 * Usage:
 *   APPWRITE_ENDPOINT=https://nyc.cloud.appwrite.io/v1 \
 *   APPWRITE_PROJECT_ID=6a3a3edf0035c552d046 \
 *   APPWRITE_API_KEY=your-api-key \
 *   node deploy-functions.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const ENDPOINT = process.env.APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = process.env.APPWRITE_PROJECT_ID || '6a3a3edf0035c552d046';
const API_KEY = process.env.APPWRITE_API_KEY;

if (!API_KEY) {
  console.error('Error: APPWRITE_API_KEY is required');
  process.exit(1);
}

async function appwriteRequest(method, pathUrl, body = null) {
  const url = new URL(ENDPOINT + pathUrl);
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

const functions = [
  { id: 'video-processor', name: 'Video Processor', runtime: 'node-18', entrypoint: 'src/index.js' },
  { id: 'subtitle-generator', name: 'Subtitle Generator', runtime: 'node-18', entrypoint: 'src/index.js' },
  { id: 'ai-orchestrator', name: 'AI Orchestrator', runtime: 'node-18', entrypoint: 'src/index.js' },
  { id: 'social-publisher', name: 'Social Publisher', runtime: 'node-18', entrypoint: 'src/index.js' }
];

async function deployFunction(func) {
  console.log('\n📦 Creating:', func.name);
  try {
    await appwriteRequest('POST', '/functions', {
      name: func.name,
      functionId: func.id,
      runtime: func.runtime,
      entrypoint: func.entrypoint,
      execute: [],
      events: [],
      schedule: '',
      timeout: 300
    });
    console.log('   ✓ Created:', func.name);
  } catch (e) {
    if (e.message && e.message.includes('already exists')) {
      console.log('   ✓ Already exists:', func.name);
    } else {
      console.log('   ⚠', e.message);
    }
  }
}

async function deploy() {
  console.log('🚀 Deploying Appwrite Functions...\n');
  
  for (const func of functions) {
    await deployFunction(func);
  }

  console.log('\n✅ Functions created!');
  console.log('\nNext steps:');
  console.log('1. Install Appwrite CLI: npm i -g appwrite');
  console.log('2. Login: appwrite login --key YOUR_API_KEY');
  console.log('3. Deploy code to each function via Appwrite Console');
}

deploy().catch(console.error);
