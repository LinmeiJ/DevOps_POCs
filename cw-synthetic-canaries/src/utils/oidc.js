const synthetics = require('Synthetics');
const log = require('SyntheticsLogger');
const queryString = require('querystring');

const { getSecrets } = require('./secrets');

let token;

const callback = function (response) {
  return new Promise((resolve, reject) => {
    if (response.statusCode !== 200) {
      throw `API call did not return a 200. It's statusCode was "${response.statusCode}" with "${response.statusMessage}" as the statusMessage.`;
    }

    let responseBody = '';
    response.on('data', (data) => {
      responseBody += data;
    });

    response.on('end', () => {
      const parsedResponseBody = JSON.parse(responseBody);
      token = parsedResponseBody.access_token;
      resolve('Successfully fetched a token');
    });
  });
};

exports.handler = async () => {
  const stepConfig = {
    includeRequestHeaders: true,
    includeResponseHeaders: true,
    restrictedHeaders: ['X-Amz-Security-Token', 'Authorization'],
    includeRequestBody: true,
    includeResponseBody: true,
  };
  const secrets = await getSecrets(`sc-quality-insight-${process.env.NODE_ENV}-node-backend-vue/app`);
  const clientID = secrets['QUALITYINSIGHT_API_PROFILES_UAA_CLIENTID'];
  const clientSecret = secrets['QUALITYINSIGHT_API_PROFILES_UAA_CLIENTSECRET'];
  // const url = new URL('https://fssfed.ge.com/fss/as/token.oauth2');
  const oidcQueryParams = {
    'grant_type': 'client_credentials',
    'scope': 'openid api profile',
    'client_id': `${clientID}`,
    'client_secret': `${clientSecret}`,
  };
  // Object.entries(oidcQueryParams).forEach((key, value) => url.searchParams.append(key, value));

  // const oidcRequestOptions = {
  //   url: url.toString(),
  //   // hostname: 'fssfed.ge.com',
  //   method: 'POST',
  //   // path: '/fss/as/token.oauth2',
  //   port: 443,
  //   // protocol: 'https:',
  //   // body: 'grant_type=client_credentials',
  // };

  const oidcRequestOptions = {
    hostname: 'fssfed.ge.com',
    // url: url.toString(),
    method: 'POST',
    // path: `/fss/as/token.oauth2?grant_type=client_credentials&scope=openid api profile&client_id=${clientID}&client_secret=${clientSecret}`,
    path: '/fss/as/token.oauth2',
    port: 443,
    protocol: 'https:',
    body: queryString.stringify(oidcQueryParams),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  await synthetics.executeHttpStep('Fetch Valid OIDC Token', oidcRequestOptions, callback, stepConfig);
  return token;
};