const verifyEmailTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Email Verification</title>
<style>
  body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    margin: 0;
    padding: 0;
  }

  .container {
    max-width: 600px;
    margin: 50px auto;
    background-color: #fff;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  h1 {
    color: #333;
    text-align: center;
  }

  p {
    color: #666;
    font-size: 16px;
    line-height: 1.5;
    margin-bottom: 20px;
  }

  .button {
    display: inline-block;
    padding: 10px 20px;
    background-color: #007bff;
    color: #fff;
    text-decoration: none;
    border-radius: 5px;
  }

  .button:hover {
    background-color: #0056b3;
  }

  .footer {
    text-align: center;
    margin-top: 30px;
    color: #888;
  }
</style>
</head>
<body>
<div class="container">
  <h1>Email Verification</h1>
  <p>Hi there,</p>
  <p>Thank you for registering Freejoas.com. Please verify your email address by clicking the button below:</p>
  <a class="button" href="https://example.com/verify">Verify Email Address</a>
  <p>If you did not register for an account, you can safely ignore this email.</p>
  <p class="footer">This email was sent by the developer of Freejoas.com. Please do not reply to this email.</p>
</div>
</body>
</html>`;

module.exports = {
    verifyEmailTemplate,
    };