# Rate The Landlord

A simple website for Renter's to rate their Landlord

## Getting Started

Copy the `.env.example` in a new `.env` file.

If you are working with the backend, make sure you have that forked and setup
first so you can pass the url to the `.env` file.

Set the environment to `development`

Then run the following commands:

- Install Packages `npm install`

- Start Dev Mode `npm run dev`

The project should not be running at `http://localhost:3000` and pick up changes
you make in you IDE

## Creating a Database

Download pgAdmin4 - https://www.postgresql.org/download/

Install and complete the setup process.

REMEMBER THE PASSWORD YOU SET DURING THE INSTALL PROCESS!

### Step 1: Create a New Database

Open PgAdmin 4 in your web browser.

In the left sidebar, navigate to "Servers" and expand your PostgreSQL server.

Right-click on "Databases" and choose "Create > Database."

In the "Database" tab, provide a name for your new database. You can also
configure other settings such as the owner, encoding, and template if needed.

Click the "Save" button to create the new database.

### Step 2: Connect to the New Database

In the left sidebar, under "Servers," find and expand your PostgreSQL server.

Right-click on "Databases" and choose "Refresh" to make sure the new database
appears.

Right-click on the newly created database and choose "Connect."

### Step 3: Find Connection String

After connecting to the database, you can find the connection string details in
PgAdmin 4.

Right-click on the database in the left sidebar, select "Properties," and go to
the "Connection" tab.

On the "Connection" tab, you'll see various details, including the connection
string. The connection string typically looks like:

```
Copy code
postgresql://username:password@host:port/database_name
Replace username with your PostgreSQL username.
Replace password with your PostgreSQL password.
Replace host with the address where PostgreSQL is running.
Replace port with the port number (default is 5432).
Replace database_name with the name of your newly created database.
Step 4: Use Connection String
```

You can use the obtained connection string in your applications, scripts, or
tools that require a PostgreSQL connection. Replace the placeholders with your
actual credentials and connection details.

For example:

```
plaintext
Copy code
postgresql://myuser:mypassword@localhost:5432/mydatabase
Make sure to secure your credentials and use appropriate connection methods based on the security requirements of your application.
```

Remember to adjust the connection details based on your specific setup and
configuration. If you encounter any issues, double-check your PostgreSQL server
settings, firewall rules, and authentication configurations.

You can also create a database with a service like Supabase and use the
connection string from there. The service is free.

### Step 5: Run migrations

Run "npm run migrate:up" in order to create the necessary tables in your postgres instance.

## Troubleshooting

#### Auth0

Create an account with Auth0 and follow their setup process. It's free and will
allow you to test admin functionality.

#### Captcha Not Working

If you are trying to submit a review locally, you will need to set up [recaptcha on google](https://www.google.com/recaptcha/about/), and populate the
.env file with the values.

You will also need to edit your hosts file to get this to work.
to allow Captcha to work. Follow These guides:

- [Hcaptcha Local Development](https://docs.hcaptcha.com/#local-development)

- [Editing a Hosts file on Windows](https://techcult.com/fix-access-denied-when-editing-hosts-file/#:~:text=In%20order%20to%20fix%20Access%20denied%20when%20editing,3.In%20the%20attribute%20section%2C%20uncheck%20the%20Read-only%20box.)

#### ESLint Parsing Error with JetBrains IDE in WSL

- [How to use WSL development environment in WebStorm](https://www.jetbrains.com/help/webstorm/how-to-use-wsl-development-environment-in-product.html)

#### Unable to Commit

This project uses Husky to run a pre-commit check to make sure the project
passes tests and linting. It also formats the files to prettier standard we have
set.

If it fails, then there is a chance that your changes have linting errors, or
broke some tests.

You may get this error: `/usr/bin/env: ‘sh\r’: No such file or directory`

If you encounter this error, you'll need to install `dos2unix` in your terminal.
Then run `sudo dos2unix .husky/pre-commit`.

## Contributing

Contributions are always welcome!

See `contributing.md` for ways to get started.

Please adhere to this project's `code of conduct`.
