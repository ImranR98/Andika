# Andika

Simple Note taking Application made with Angular, Node.js and PostgreSQL.

## Getting Started

Install Angular and Node.js, and set up a PostgreSQL database.

### Prerequisites

A .env file, described below, is needed at the root directory that will contain environment variables. This file contains sensitive data and should not be removed from .gitignore.

```
DATABASE_URL - The URL of the Postgres database.
NODEMAILER_EMAIL - The email address emails from the App will be sent from using nodemailer
NODEMAILER_NAME - The name of the sender for above emails
NODEMAILER_TRANSPORT_STRING - The string used to create the NodeMailer transporter, usually something like smtps://<email>:<password>@<smtp-server>
EXPIRES_IN - The number of seconds a client session lasts
RSA_PRIVATE_KEY - The private RSA key used to protect client sessions
RSA_PUBLIC_KEY - The public key corresponding to the above private key
```

The Database will need specific tables. SQL Commands to create them are listed below:
```
CREATE TABLE USERS (
    USER_ID INT GENERATED BY DEFAULT AS IDENTITY,
    EMAIL VARCHAR(100) NOT NULL UNIQUE,
    FIRST_NAME VARCHAR(100) NOT NULL,
    LAST_NAME VARCHAR(100) NOT NULL,
    PASSWORD VARCHAR(200) NOT NULL,
    REGISTRATION_STATUS VARCHAR(10) NOT NULL,
    REGISTRATION_KEY VARCHAR(100) NOT NULL,
    REGISTRATION_START_DATE TIMESTAMP NOT NULL,
    REGISTRATION_COMPLETE_DATE TIMESTAMP,
    USER_TYPE VARCHAR(100) NOT NULL,
    PRIMARY KEY(USER_ID)
);

CREATE TABLE NOTES (
    NOTE_ID INT GENERATED BY DEFAULT AS IDENTITY,
    USER_ID INT NOT NULL,
    TITLE VARCHAR(100) NOT NULL,
    NOTE VARCHAR(10485760),
    TAGS VARCHAR(10485760),
    ARCHIVED BOOLEAN NOT NULL,
    PINNED BOOLEAN NOT NULL,
    CREATED_DATE TIMESTAMP NOT NULL,
    MODIFIED_DATE TIMESTAMP NOT NULL,
    IMAGE_TYPE VARCHAR(100),
    IMAGE_BASE_64 VARCHAR(10485760),
    FOREIGN KEY (USER_ID) REFERENCES USERS(USER_ID)
  );

  CREATE TABLE PASSWORD_RESETS (
    USER_ID INT,
    NEW_PASSWORD VARCHAR(200) NOT NULL,
    RESET_KEY VARCHAR(100) NOT NULL,
    PRIMARY KEY (USER_ID),
    FOREIGN KEY (USER_ID) REFERENCES USERS(USER_ID)
);
```

Note:
 - Valid user types are REGULAR and ADMIN, and users must be changed to ADMIN manually (no in-app way to do so)
 - Valid registration statuses are PENDING and COMPLETE

## Deployment
- Configure a PostgreSQL database with the tables defined above.
- Copy the DB connection string into a .env file.
- Fill in the remaining variables in the .env file as described above.
- Run `npm start` to start the application (runs on port 8080 by default).