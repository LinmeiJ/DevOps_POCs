//const { getEnvPath } = require('utils/env');
//const log = require('SyntheticsLogger');
//const login = require('login');
//const healthcheck = require('heartbeat');
////const api = require('api');
//
//exports.handler = async () => {
//  const URL = await getURL();
//  const DEFAULT_STEP_CONFIG = {
//    'continueOnStepFailure': false,
//    'screenshotOnStepStart': false,
//    'screenshotOnStepSuccess': true,
//    'screenshotOnStepFailure': true
//  };
//
//  await heartbeat.handler(URL, DEFAULT_STEP_CONFIG);
//  log.debug('healthcheck passed');
//
//  await login.handler(URL, DEFAULT_STEP_CONFIG);
//  log.debug('login passed');
//
//  await api.handler(URL, DEFAULT_STEP_CONFIG);
//  log.debug('api passed');
//
//  return 'All checks completed';
//}
