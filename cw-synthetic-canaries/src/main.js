//const { getEnvPath } = require('utils/env');
//const log = require('SyntheticsLogger');
//const login = require('login');
//const healthcheck = require('healthcheck');
//const api = require('api');
//
//exports.handler = async () => {
//  const ENV_PATH = await getEnvPath();
//  const DEFAULT_STEP_CONFIG = {
//    'continueOnStepFailure': false,
//    'screenshotOnStepStart': false,
//    'screenshotOnStepSuccess': true,
//    'screenshotOnStepFailure': true
//  };
//
//  await healthcheck.handler(ENV_PATH, DEFAULT_STEP_CONFIG);
//  log.debug('healthcheck passed');
//
//  await login.handler(ENV_PATH, DEFAULT_STEP_CONFIG);
//  log.debug('login passed');
//
//  await api.handler(ENV_PATH, DEFAULT_STEP_CONFIG);
//  log.debug('api passed');
//
//  return 'All checks completed';
//}