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

## Troubleshooting

#### Captcha Not Working

If you are trying to submit a review locally, you need to edit your hosts file
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
