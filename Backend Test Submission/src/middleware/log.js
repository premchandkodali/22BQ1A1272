const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

let cachedToken = null;

async function getAccessToken() {
  if (cachedToken) return cachedToken;
  const clientID = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  if (!clientID || !clientSecret) throw new Error('Missing clientID or clientSecret in .env');
  const response = await axios.post('http://20.244.56.144/evaluation-service/auth', {
    clientID,
    clientSecret
  });
  cachedToken = response.data.access_token;
  return cachedToken;
}

async function Log(stack, level, packageName, message) {
  const token = await getAccessToken();
  await axios.post(
    'http://20.244.56.144/evaluation-service/logs',
    {
      stack,
      level,
      package: packageName,
      message
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
}

module.exports = { Log };
