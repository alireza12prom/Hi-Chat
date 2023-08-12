<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

<h1 align="center"> Express Chat App </h1>

<p> 
  A simple chat application that is based on <a href="https://expressjs.com/"><strong>Express</strong></a> and <a href="https://socket.io/"><strong>Socket.io</strong></a>. In this project, I used <a href="https://www.mongodb.com/">MongoDB</a> which is a great NoSQL database and <a href="https://mongoosejs.com/"><strong>Mongoose</strong></a>. The structure of the project is very similar to <a href="https://nestjs.com/"><strong>Nestjs</strong></a> applications because I wanted to create a new method for developing Express apps and I think this structure is one of the best approaches if you want to have a maintainable and testable code.
  <br>
  To log in to this app, we have passwordless authentication. For doing so I used <a href="https://nodemailer.com/"><strong>Nodemailer</strong></a>. If you want to use another service to send authentication code you can implement the base class that is there.
  <br>
  We can just have a private chat for now. But for the future, I'll add a group chat.
</p>

<h2>Install</h2>

Clone the repository and execute below command.

```
npm install
```

<h2>Set some environment variables!</h2>

In the root of the project, create a file called `.env-cmd.json` and set below variables in it.

```
{
  "development": {
    "MONGO_URL": <mongodb uri>,
    "SERVER_PORT": <port>,
    "NODEMAILER_EMAIL": <the sender>,
    "NODEMAILER_USER": <nodemailer user>,
    "NODEMAILER_PASS": <nodemailer pass>,
    "JWT_SECRET": <jwt secret>,
    "SESSION_EXPIRE_DAY": <number>,
    "MAX_REQUEST_FOR_LOGIN": <number>,
    "VERIFY_MESSAGE_EXPIRE_SEC": <number>,
    "MAX_ACTIVE_SESSION": <number>,
    "ACCESS_TOKEN_EXPIRE_DAY": <number>
  }
}
```

> NOTE: You can create a nodemailer `user` and `password` <a href="https://ethereal.email/">there<a>.

<h2>Run</h2>
To run the application in development environment run this command.

```
npm run start:dev
```

> For setting environment variables I used `env-cmd` package. So to run the app in another way you have to use it to set environment variables before running the app.
