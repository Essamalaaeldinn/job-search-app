const emailTemplate = (firstName, otp, condation) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Account Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 450px;
            margin: 40px auto;
            background: #ffffff;
            padding: 25px;
            border-radius: 8px;
            text-align: center;
            border-top: 4px solid #007bff;
        }
        h2 {
            color: #333;
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 10px;
        }
        p {
            color: #555;
            font-size: 14px;
            line-height: 1.5;
            margin-bottom: 15px;
        }
        .otp-box {
            font-size: 24px;
            font-weight: bold;
            color: #007bff;
            padding: 12px;
            border: 1px dashed #007bff;
            display: inline-block;
            letter-spacing: 3px;
            border-radius: 5px;
            margin: 10px 0;
        }
        .note {
            font-size: 13px;
            color: #777;
        }
        .footer {
            font-size: 12px;
            color: #aaa;
            margin-top: 20px;
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }
        .footer a {
            color: #007bff;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <h2>${condation}</h2>
        <p>Hello <strong>${firstName}</strong>,</p>
        <p>Use the OTP below to ${condation}:</p>
        <div class="otp-box">${otp}</div>
        <p class="note">This OTP is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
        <p class="footer">If you did not request this, please ignore this email or <a href="#">contact support</a>.</p>
    </div>
</body>
</html>
`;

export default emailTemplate;
