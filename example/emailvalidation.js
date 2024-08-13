const { MongoClient } = require('mongodb');
const { sakshValidateEmail, sakshSendEmail } = require('./index'); // Updated import to use new functions

const uri = 'your_mongodb_connection_string';

async function connectToDatabase() {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const database = client.db('your_database_name');
    return { client, database };
}

async function fetchAndValidateEmails() {
    const { client, database } = await connectToDatabase();
    try {
        const emailsCollection = database.collection('emails');
        const validationResultsCollection = database.collection('validationResults');

        // Fetch email addresses
        const emailAddresses = await emailsCollection.find({}).toArray();

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

        console.log('Email validation completed and results stored.');
    } catch (error) {
        console.error('Error occurred:', error);
    } finally {
        await client.close();
    }
}

async function sendBulkMessages() {
    const { client, database } = await connectToDatabase();
    try {
        const validationResultsCollection = database.collection('validationResults');

        // Fetch valid email addresses
        const validEmails = await validationResultsCollection.find({ validation: true }).toArray();

        // Send bulk messages
        const emailPromises = validEmails.map(async (emailDoc) => {
            await sakshSendEmail(emailDoc.email, 'Bulk Message Subject', 'This is a bulk message.', {
                host: 'smtp.example.com',
                port: 587,
                secure: false,
                user: 'your_email@example.com',
                pass: 'your_email_password'
            });
        });

        await Promise.all(emailPromises);

        console.log('Bulk messages sent to valid emails.');
    } catch (error) {
        console.error('Error occurred:', error);
    } finally {
        await client.close();
    }
}

async function main() {
    await fetchAndValidateEmails();
    await sendBulkMessages();
}

main();