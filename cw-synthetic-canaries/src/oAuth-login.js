const synthetics = require('Synthetics');
const { setTimeout } = require('node:timers/promises');
const log = require('SyntheticsLogger');
const { getSecrets } = require('./utils/secrets');

exports.handler = async (ENV_PATH, DEFAULT_STEP_CONFIG) => {

  const secrets = await getSecrets(`sc-quality-insight-${process.env.NODE_ENV}-node-backend-vue/app`);
  const username = secrets.USER_USERNAME;
  const password = secrets.USER_PASSWORD;


  // Ensure username and password are strings
  if (typeof username !== 'string' || typeof password !== 'string') {
    throw new Error('Username and password must be strings');
  }

  // Launch the browser with the ignoreHTTPSErrors option
  await synthetics.launch({
    ignoreHTTPSErrors: true,
    defaultViewport: {
      "width": 1080,
      "height": 1024
    }
  });

  const page = await synthetics.getPage();
  // Set protocol timeout
  await page.setDefaultNavigationTimeout(60000); // 60 seconds

  try {
      await synthetics.executeStep('Navigate to Homepage', async function (timeoutInMillis = 120000) {
   //      await page.goto(`https://qi${ENV_PATH}.av.ge.com/login`, {waitUntil: ['load', 'networkidle2'], timeout: timeoutInMillis});
      await page.goto(`https://ngp.qa.apps.geaerospace.com`, {waitUntil: ['load', 'networkidle2'], timeout: timeoutInMillis});
   //      await synthetics.takeScreenshot("start", "loaded");

      log.info('landed on web server. Start to log in...');

      try {
//          await page.waitForSelector('#identifierInput', { timeout: 6000, visible: true });
          await page.waitForSelector('#dHome > div > div > div.v-col-sm-6.v-col-12.pa-0.white > div > div > div.v-container.v-locale--is-ltr.mb-6.form-container > div > div > div.access-btn > button', { timeout: 3000, visible: true });
          log.info("got selector...");
          await page.click('#dHome > div > div > div.v-col-sm-6.v-col-12.pa-0.white > div > div > div.v-container.v-locale--is-ltr.mb-6.form-container > div > div > div.access-btn > button > span.v-btn__content');
          log.info('Identifier input found.');
      } catch (error) {
          log.error('Identifier input not found within timeout.');
          throw error;
      }

     // Ensure the element is interactable
      log.info('waiting for input to be ready');
      await page.waitForFunction(() => {
        const input = document.querySelector('#identifierInput');
        return input && input.offsetParent !== null && !input.disabled;
      }, { timeout: 10000 });

      log.info('Clicking into indentifier input...');
      await page.click('#identifierInput');

       // Focus and type the username
      log.info('Entering username...');
      await page.evaluate(() => document.querySelector('#identifierInput').focus());
      await page.type('#identifierInput', username, { delay: 100 });

      log.info('Hitting "Next" button...');
      await page.click('#post-button');

      log.info('wait and enter password');
      await page.waitForSelector('#password');
      await page.click('#password');
      await page.locator('#password').fill(password);

      await synthetics.takeScreenshot("sso-page", "filled-out");

       // click login button
      log.info('click login')
      await page.click('#remember-me-login-button');

      log.info('Waiting for 30 seconds before taking the screenshot...');
      await setTimeout(30000);


      // verify we are on the homepage
      await synthetics.takeScreenshot("home-page-after-login", "loaded");

// // NOTE - Do NOT close the page - synthetics handles this natively for you
// //      - If closed prematurely, it will cause an error for synthetics during execution
// await synthetics.executeStep('Close page', async function () {
//   await page.close();
// });
    }, DEFAULT_STEP_CONFIG);
  } catch (error) {
    log.error('Error during navigation and interaction steps:', error);
    throw error;
  }

  return 'Login Checks finished';
};