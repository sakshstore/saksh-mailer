const { sakshSendEmail } = require('./index'); // Adjust the path as necessary

const recipient = 'recipient@example.com';
const subject = 'Test Email';
const message = 'This is a test email.';

sakshSendEmail(recipient, subject, message, config)
    .then(() => {
        console.log('Email sent successfully');
    })
    .catch(error => {
        console.error('Error sending email:', error);
    });