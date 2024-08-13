Functions
---------

### `sakshSendEmail(to, subject, message, config)`

Sends an email.

#### Parameters:

*   `to` (string): The recipient's email address.
*   `subject` (string): The subject of the email.
*   `message` (string): The body of the email.
*   `config` (object): The configuration object for the email service.

**Returns:** `Promise<void>`

### `sakshSendEmailsBatch(emailAddresses, subject, message, configs)`

Sends multiple emails in batch using one or multiple SMTP server configurations.

#### Parameters:

*   `emailAddresses` (Array<string>): Array of email addresses.
*   `subject` (string): The subject of the email.
*   `message` (string): The body of the email.
*   `configs` (object|Array<object>): A single configuration object or an array of configuration objects for the email service.

**Returns:** `Promise<void>`

### `sakshValidateEmail(email)`

Validates a single email address.

#### Parameters:

*   `email` (string): The email address to validate.

**Returns:** `object` - The validation result.

### `sakshValidateEmailsInBatches(emailAddresses, batchSize, callback)`

Validates emails in batches and informs the status to a callback function.

#### Parameters:

*   `emailAddresses` (Array<string>): Array of email addresses.
*   `batchSize` (number): The size of each batch.
*   `callback` (function): The callback function to inform the validation status.

**Returns:** `Promise<void>`

### `sakshProcessEmailsInBatches(emailAddresses, subject, message, configs, callback)`

Processes email sending in batches and updates the status via a callback.

#### Parameters:

*   `emailAddresses` (Array<string>): Array of email addresses.
*   `subject` (string): The subject of the email.
*   `message` (string): The body of the email.
*   `configs` (object|Array<object>): A single configuration object or an array of configuration objects for the email service.
*   `callback` (function): The callback function to update email statuses.

**Returns:** `Promise<void>`

Usage
-----

### Installation

    npm install nodemailer saksh-mailer
    

    const { sakshSendEmail, sakshSendEmailsBatch, sakshValidateEmailsInBatches, sakshProcessEmailsInBatches } = require('./index');
    
    // Configuration for the email service
    const emailConfig = {
        host: 'smtp.example.com',
        port: 587,
        secure: false,
        user: 'your_email@example.com',
    };
    
    // Sending a single email
    sakshSendEmail('recipient@example.com', 'Test Subject', 'Test Message', emailConfig)
        .then(() => console.log('Email sent successfully'))
        .catch(error => console.error('Error sending email:', error));
    
    // Sending multiple emails in batch
    const emailAddresses = ['recipient1@example.com', 'recipient2@example.com'];
    sakshSendEmailsBatch(emailAddresses, 'Batch Subject', 'Batch Message', emailConfig)
        .then(() => console.log('Batch emails sent successfully'))
        .catch(error => console.error('Error sending batch emails:', error));
    
    // Validating emails in batches
    const validateCallback = (email, validation) => {
        console.log(`Email: ${email}, Validation: ${validation}`);
    };
    sakshValidateEmailsInBatches(emailAddresses, 50, validateCallback)
        .then(() => console.log('Email validation completed'))
        .catch(error => console.error('Error validating emails:', error));
    
    // Processing email sending in batches
    const processCallback = (email, status) => {
        console.log(`Email: ${email}, Status: ${status}`);
    };
    sakshProcessEmailsInBatches(emailAddresses, 'Batch Subject', 'Batch Message', emailConfig, processCallback)
        .then(() => console.log('Email processing completed'))
        .catch(error => console.error('Error processing emails:', error));
    

### Support

susheel2339 at gmail.com
