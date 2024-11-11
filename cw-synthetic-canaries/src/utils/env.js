exports.getEnvPath = async () => {
  // Set url path per environment
  let envPath = '';
  switch (process.env.NODE_ENV) {
    case 'dev':
      envPath = 'ngp.dev.geaerospace.net';
      break;
    case 'qa':
      envPath = 'ngp.qa.geaerospace.com';
      break;
    case 'prod':
      envPath = 'ngp.geaerospace.com';
      break;
  }

  return envPath;
}