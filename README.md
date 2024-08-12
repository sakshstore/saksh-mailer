# Email Utility Package

This package provides utility functions for sending and validating emails in batches using Node.js and `nodemailer`.

## Functions

### `sendEmail(to, subject, message, config)`

Sends an email.

- **Parameters:**
  - `to` (string): The recipient's email address.
  - `subject` (string): The subject of the email.
  - `message` (string): The body of the email.
  - `config` (object): The configuration object for the email service.
    - `host` (string): The SMTP server host.
    - `port` (number): The SMTP server port.
    - `secure` (boolean): Whether to use SSL.
    - `user` (string): The SMTP server username.
    - `pass` (string): The SMTP server password.

- **Returns:** `Promise<void>`

### `sendEmailsBatch(emailAddresses, subject, message, configs)`

Sends multiple emails in batch using one or multiple SMTP server configurations.

- **Parameters:**
  - `emailAddresses` (Array<string>): Array of email addresses.
  - `subject` (string): The subject of the email.
  - `message` (string): The body of the email.
  - `configs` (object|Array<object>): A single configuration object or an array of configuration objects for the email service.

- **Returns:** `Promise<void>`

### `validateEmail(email)`

Validates a single email address.

- **Parameters:**
  - `email` (string): The email address to validate.

- **Returns:** `object` - The validation result.

### `validateEmailsInBatches(emailAddresses, batchSize, callback)`

Validates emails in batches and informs the status to a callback function.

- **Parameters:**
  - `emailAddresses` (Array<string>): Array of email addresses.
  - `batchSize` (number): The size of each batch.
  - `callback` (function): The callback function to inform the validation status.

- **Returns:** `Promise<void>`

### `processEmailsInBatches(emailAddresses, subject, message, configs, callback)`

Processes email sending in batches and updates the status via a callback.

- **Parameters:**
  - `emailAddresses` (Array<string>): Array of email addresses.
  - `subject` (string): The subject of the email.
  - `message` (string): The body of the email.
  - `configs` (object|Array<object>): A single configuration object or an array of configuration objects for the email service.
  - `callback` (function): The callback function to update email statuses.

- **Returns:** `Promise<void>`

## Usage

### Installation

```bash
npm install nodemailer saksh-email-validator
