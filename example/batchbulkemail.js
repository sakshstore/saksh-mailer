const { MongoClient } = require('mongodb');
const { sakshValidateEmail, sakshSendEmail } = require('./index'); // Updated import to use new functions
const nodemailer = require('nodemailer');

const uri = 'your_mongodb_connection_string';

async function connectToDatabase() {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const database = client.db('your_database_name');
    return { client, database };
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchAndValidateEmails(batchSize = 50) {
    const { client, database } = await connectToDatabase();
    try {
        const emailsCollection = database.collection('emails');
        const validationResultsCollection = database.collection('validationResults');

        let skip = 0;
        let emailAddresses;

        do {
            // Fetch email addresses in batches
            emailAddresses = await emailsCollection.find({}).skip(skip).limit(batchSize).toArray();

            // Validate emails and store results
            const validationPromises = emailAddresses.map(async (emailDoc) => {
                const email = emailDoc.email;
                const validation = sakshValidateEmail(email);

                await validationResultsCollection.insertOne({
                    email: email,
                    validation: validation,
                    validatedAt: new Date()
                });
            });

            await Promise.all(validationPromises);

            skip += batchSize;

            // Sleep for 1 minute after processing each batch
            await sleep(60000);
        } while (emailAddresses.length === batchSize);

        console.log('Email validation completed and results stored.');
    } catch (error) {
        console.error('Error occurred:', error);
    } finally {
        await client.close();
    }
}

async function sendBulkMessages(batchSize = 50) {
    const { client, database } = await connectToDatabase();
    try {
        const validationResultsCollection = database.collection('validationResults');

        let skip = 0;
        let validEmails;

        // Setup nodemailer transporter
        let transporter = nodemailer.createTransport({
            service: 'your_email_service_provider', // e.g., 'gmail'
            auth: {
                user: 'your_email@example.com',
                pass: 'your_email_password'
            }
        });

        do {
            // Fetch valid email addresses in batches
            validEmails = await validationResultsCollection.find({ validation: true }).skip(skip).limit(batchSize).toArray();

            // Send bulk messages
            const emailPromises = validEmails.map(async (emailDoc) => {
                let mailOptions = {
                    from: 'your_email@example.com',
                    to: emailDoc.email,
                    subject: 'Bulk Message Subject',
                    text: 'This is a bulk message.'
                };

                await sakshSendEmail(emailDoc.email, 'Bulk Message Subject', 'This is a bulk message.', {
                    host: 'smtp.example.com',
                    port: 587,
                    secure: false,
                    user: 'your_email@example.com',
                    pass: 'your_email_password'
                });
            });

            await Promise.all(emailPromises);

            skip += batchSize;

            // Sleep for 1 minute after processing each batch
            await sleep(60000);
        } while (validEmails.length === batchSize);

        console.log('Bulk messages sent to valid emails.');
    } catch (error) {
        console.error('Error occurred:', error);
    } finally {
        await client.close();
    }
}

async function main() {
    await fetchAndValidateEmails();
    await sleep(120000);

    await sendBulkMessages();
}

main();