const { sakshSendEmailsBatch } = require('./index'); // Adjust the path as necessary

const subject = 'Test Email';
const message = 'This is a test email.';


const emailAddresses = [
    'recipient1@example.com',
    'recipient2@example.com',
    'recipient3@example.com',
    // Add more email addresses up to 50
    'recipient50@example.com'
];



sakshSendEmailsBatch(emailAddresses, subject, message, config)
    .then(() => {
        console.log('All emails sent successfully');
    })
    .catch(error => {
        console.error('Error sending emails:', error);
    });