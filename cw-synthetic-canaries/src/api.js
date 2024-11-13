const synthetics = require('Synthetics');
const oidc = require('utils/oidc');
const log = require('SyntheticsLogger');

const apiCallback = function (response) {
  return new Promise((resolve, reject) => {
    log.info('statusCode:', response.statusCode);
    if (response.statusCode !== 200) {
      throw `API call did not return a 200. It's statusCode was "${response.statusCode}" with "${response.statusMessage}" as the statusMessage.`;
    }

    let responseBody = '';
    response.on('data', (data) => {
      responseBody += data;
    });

    response.on('end', () => {
      log.info('responseBody:', responseBody);
      resolve('Successfully completed api check');
    });
  });
}

exports.handler = async (ENV_PATH, DEFAULT_STEP_CONFIG) => {

  const token = await oidc.handler();

  const api = {
    hostname: `ngp-api${ENV_PATH}.av.ge.com`,
    method: 'GET',
    path: '/api/v2/site',
    port: 443,
    protocol: 'https:',
    headers: {
      Authorization : `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    rejectUnauthorized: false,
  }

  await synthetics.executeHttpStep('Test oidc token with api endpoint', api, apiCallback, DEFAULT_STEP_CONFIG);

  return 'API checks finished'

}