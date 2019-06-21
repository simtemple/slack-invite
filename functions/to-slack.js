const axios = require('axios');

exports.handler = async function(event, context) {
  const method = event.httpMethod;

  if (method !== 'POST') {
    return {
      statusCode: 405,
      body: "Method not allowed"
    };
  }

  const body = JSON.parse(event.body);
  const { email, captcha } = body;

  console.log(body);

  if (!email || email.length === 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 100,
        message: 'No email provided'
      })
    };
  }

  if (!captcha || captcha.length === 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 200,
        message: 'No captcha provided'
      })
    };
  }

  const captchaRes = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_KEY}&response=${captcha}`);

  console.log(captchaRes);

  const captchaSucceeded = captchaRes.data.success;

  if (captchaSucceeded === false) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 201,
        message: 'Invalid captcha'
      })
    };
  }

  try {
    const slackRes = await axios.post(
      'https://rangerstudio.slack.com/api/users.admin.invite', 
      `email=${email}&token=${process.env.SLACK_KEY}&set_active=true`
    );

    return {
      statusCode: 200,
      body: email || ""
    };
  } catch(error) {
    return {
      statusCode: 400,
      body: JSON.stringify(error)
    };
  }
}
