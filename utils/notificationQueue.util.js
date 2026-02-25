const User = require('../models/user.model'); 
const Queue = require('bull');
const admin = require('firebase-admin');
const path = require('path');
const sendMail = require('./sendMail.util');
const Redis = require('ioredis')

// Initialize Firebase Admin
const serviceAccount = require(path.join(__dirname, '../firebase-service-account.json'));
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Create a Bull queue
const notificationQueue = new Queue('notifications', {
  createClient: (type) => {
    const opts = {
      host: process.env.REDIS_HOST, // From Redis Labs dashboard
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
      maxRetriesPerRequest: null,
      enableReadyCheck: false 
    };
    switch (type) {
      case 'client':
        return new Redis(opts);
      case 'subscriber':
        return new Redis(opts);
      case 'bclient':
        return new Redis(opts);
    }
  }
});

// Processor for the queue jobs
notificationQueue.process(async (job) => {
  const { type, userId, details, fcmToken } = job.data;

  // Fetch user (for email/phone/etc.)
  
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  // 1. Send Email
  let emailMessage = '';
  switch (type) {
    case 'transfer':
      emailMessage = `Transaction Alert: You sent ${details.amount} ${details.currency} to ${details.recipient}. Ref: ${details.reference}.`;
      break;
    case 'deposit':
      emailMessage = `Deposit Alert: ${details.amount} ${details.currency} added to your wallet. New balance: ${details.newBalance}.`;
      break;
    // Add cases for withdrawal, reversal, etc.
    default:
      emailMessage = `Transaction Alert: ${details.description}`;
  }

  await sendMail({
    email: user.email,
    subject: `${type.charAt(0).toUpperCase() + type.slice(1)} Notification`,
    message: emailMessage
  });

  // 2. Send FCM Push (if token provided)
  if (fcmToken) {
    const pushMessage = {
      notification: {
        title: 'Transaction Alert',
        body: emailMessage
      },
      token: fcmToken
    };
    await admin.messaging().send(pushMessage);
  }
});

// Error handling
notificationQueue.on('failed', (job, err) => {
  console.error(`Notification job failed: ${err.message}`);
});

module.exports = notificationQueue;