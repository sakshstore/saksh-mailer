const { sakshSendEmailsBatch } = require('./index'); // Adjust the path as necessary

const config = {
    host: 'smtp.example.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'your-email@example.com',
        pass: 'your-email-password'
    }
};

const emailAddresses = [];
for (let i = 1; i <= 1000000; i++) {
    emailAddresses.push(`recipient${i}@example.com`);
}

const subject = 'Test Email';
const message = 'This is a test email.';

async function sendEmailsInBatches(emailAddresses, batchSize, subject, message, config) {
    for (let i = 0; i < emailAddresses.length; i += batchSize) {
        const batch = emailAddresses.slice(i, i + batchSize);
        try {
            await sakshSendEmailsBatch(batch, subject, message, config);
            console.log(`Batch ${i / batchSize + 1} sent successfully`);
        } catch (error) {
            console.error(`Error sending batch ${i / batchSize + 1}:`, error);
        }
    }
}

sendEmailsInBatches(emailAddresses, 100, subject, message, config)
    .then(() => {
        console.log('All emails sent successfully');
    })
    .catch(error => {
        console.error('Error sending emails:', error);
    });