const nodemailer = require('nodemailer');
const { validate } = require('saksh-email-validator');

/**
 * Sends an email.
 * @param {string} to - The recipient's email address.
 * @param {string} subject - The subject of the email.
 * @param {string} message - The body of the email.
 * @param {object} config - The configuration object for the email service.
 * @returns {Promise<void>}
 */
async function sakshSendEmail(to, subject, message, config) {
    const transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: {
            user: config.user,
            pass: config.pass
        }
    });

    const mailOptions = {
        from: `"Sender Name" <${config.user}>`,
        to,
        subject,
        text: message,
        html: message
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

/**
 * Sends multiple emails in batch using one or multiple SMTP server configurations.
 * @param {Array<string>} emailAddresses - Array of email addresses.
 * @param {string} subject - The subject of the email.
 * @param {string} message - The body of the email.
 * @param {object|Array<object>} configs - A single configuration object or an array of configuration objects for the email service.
 * @returns {Promise<void>}
 */
async function sakshSendEmailsBatch(emailAddresses, subject, message, configs) {
    const isArray = Array.isArray(configs);
    for (let i = 0; i < emailAddresses.length; i++) {
        const email = emailAddresses[i];
        const config = isArray ? configs[i % configs.length] : configs;
        await sakshSendEmail(email, subject, message, config);
    }
}

/**
 * Validates a single email address.
 * @param {string} email - The email address to validate.
 * @returns {object} - The validation result.
 */
function sakshValidateEmail(email) {
    return validate(email);
}

/**
 * Validates emails in batches and informs the status to a callback function.
 * @param {Array<string>} emailAddresses - Array of email addresses.
 * @param {number} batchSize - The size of each batch.
 * @param {function} callback - The callback function to inform the validation status.
 * @returns {Promise<void>}
 */
async function sakshValidateEmailsInBatches(emailAddresses, batchSize, callback) {
    for (let i = 0; i < emailAddresses.length; i += batchSize) {
        const batch = emailAddresses.slice(i, i + batchSize);

        await Promise.all(batch.map(async email => {
            const validation = sakshValidateEmail(email);
            await callback(email, validation);
        }));

        console.log(`Processed validation batch ${i / batchSize + 1}`);
    }
}

/**
 * Processes email sending in batches and updates the status via a callback.
 * @param {Array<string>} emailAddresses - Array of email addresses.
 * @param {string} subject - The subject of the email.
 * @param {string} message - The body of the email.
 * @param {object|Array<object>} configs - A single configuration object or an array of configuration objects for the email service.
 * @param {function} callback - The callback function to update email statuses.
 * @returns {Promise<void>}
 */
async function sakshProcessEmailsInBatches(emailAddresses, subject, message, configs, callback) {
    const batchSize = 1000;

    for (let i = 0; i < emailAddresses.length; i += batchSize) {
        const batch = emailAddresses.slice(i, i + batchSize);

        try {
            const results = await Promise.all(batch.map(email => sakshSendEmailsBatch([email], subject, message, configs)));
            const flattenedResults = results.flat();

            await Promise.all(flattenedResults.map(result => callback(result.email, result.status)));

            console.log(`Processed batch ${i / batchSize + 1}`);
        } catch (error) {
            console.error(`Error processing batch ${i / batchSize + 1}:`, error);
            await Promise.all(batch.map(email => callback(email, 'error')));
        }
    }
}

module.exports = {
    sakshSendEmail,
    sakshSendEmailsBatch,
    sakshProcessEmailsInBatches,
    sakshValidateEmailsInBatches
};