const { sakshSendEmailsBatch } = require('../index'); // Adjust the path as necessary

const smtpConfigs = [
    {
        host: 'smtp1.example.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'your-email1@example.com',
            pass: 'your-email-password1'
        }
    },
    {
        host: 'smtp2.example.com',
        port: 587,
        secure: false,
        auth: {
            user: 'your-email2@example.com',
            pass: 'your-email-password2'
        }
    },
    {
        host: 'smtp3.example.com',
        port: 587,
        secure: false,
        auth: {
            user: 'your-email3@example.com',
            pass: 'your-email-password3'
        }
    },
    {
        host: 'smtp4.example.com',
        port: 587,
        secure: false,
        auth: {
            user: 'your-email4@example.com',
            pass: 'your-email-password4'
        }
    },
    {
        host: 'smtp5.example.com',
        port: 587,
        secure: false,
        auth: {
            user: 'your-email5@example.com',
            pass: 'your-email-password5'
        }
    }
];

const emailAddresses = [];
for (let i = 1; i <= 1000000; i++) {
    emailAddresses.push(`recipient${i}@example.com`);
}

const subject = 'Test Email';
const message = 'This is a test email.';

async function sendEmailsInBatches(emailAddresses, batchSize, subject, message, smtpConfigs) {
    for (let i = 0; i < emailAddresses.length; i += batchSize) {
        const batch = emailAddresses.slice(i, i + batchSize);
        const config = smtpConfigs[(i / batchSize) % smtpConfigs.length];
        try {
            await sakshSendEmailsBatch(batch, subject, message, config);
            console.log(`Batch ${i / batchSize + 1} sent successfully using ${config.host}`);
        } catch (error) {
            console.error(`Error sending batch ${i / batchSize + 1} using ${config.host}:`, error);
        }
    }
}

sendEmailsInBatches(emailAddresses, 100, subject, message, smtpConfigs)
    .then(() => {
        console.log('All emails sent successfully');
    })
    .catch(error => {
        console.error('Error sending emails:', error);
    });