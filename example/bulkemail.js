const fs = require('fs');
const { sakshSendEmailsBatch, sakshValidateEmail } = require('./index'); // Updated import to use new functions
const { MongoClient } = require('mongodb');

// Read email addresses from JSON file
const emailAddresses = JSON.parse(fs.readFileSync('emailAddresses.json', 'utf8'));

const emailConfig = {
    host: 'smtp.example.com',
    port: 587,
    secure: false, // true for 465, for other ports
    user: 'your-email@example.com',
    pass: 'your-email-password'
};

const emailConfigs = [
    {
        host: 'smtp1.example.com',
        port: 587,
        secure: false, // true for 465, for other ports
        user: 'your-email1@example.com',
        pass: 'your-email-password1'
    },
    {
        host: 'smtp2.example.com',
        port: 587,
        secure: false, // true for 465, for other ports
        user: 'your-email2@example.com',
        pass: 'your-email-password2'
    }
];

const subject = 'Test Subject';
const message = 'Test Message';
const batchSize = 1000; // Number of emails to process in each batch

async function fetchEmailAddresses() {
    const client = new MongoClient('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        const db = client.db('emailDB');
        const collection = db.collection('emailAddresses');
        const emailAddresses = await collection.find({}).toArray();
        return emailAddresses.map(doc => doc.email); // Assuming each document has an 'email' field
    } finally {
        await client.close();
    }
}

async function updateEmailStatus(email, status) {
    const client = new MongoClient('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        const db = client.db('emailDB');
        const collection = db.collection('emailAddresses');
        await collection.updateOne({ email }, { $set: { status } });
    } finally {
        await client.close();
    }
}

async function processEmailsInBatches(emailAddresses, subject, message, configs) {
    for (let i = 0; i < emailAddresses.length; i += batchSize) {
        const batch = emailAddresses.slice(i, i + batchSize);
        const validEmails = batch.filter(email => sakshValidateEmail(email).valid);
        const results = await sakshSendEmailsBatch(validEmails, subject, message, configs);
        for (const result of results) {
            await updateEmailStatus(result.email, result.status);
        }
        console.log(`Processed batch ${i / batchSize + 1}`);
    }
}

async function main() {
    try {
        const emailAddresses = await fetchEmailAddresses();
        console.log(`Fetched ${emailAddresses.length} email addresses from the database`);

        // Using a single configuration
        await processEmailsInBatches(emailAddresses, subject, message, emailConfig);
        console.log('All emails sent successfully with single config');

        // Using multiple configurations
        await processEmailsInBatches(emailAddresses, subject, message, emailConfigs);
        console.log('All emails sent successfully with multiple configs');
    } catch (error) {
        console.error('Error:', error);
    }
}

main();