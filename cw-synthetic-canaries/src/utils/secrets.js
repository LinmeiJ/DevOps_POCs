const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');

exports.getSecrets = async (SecretId) => {
  const client = new SecretsManagerClient({
    region: 'us-east-2',
  });

  const command = new GetSecretValueCommand({
    SecretId,
  });

  const secrets = await client.send(command);

  console.log(`Retrieving secret: ${SecretId}`);

  return JSON.parse(secrets.SecretString);
};
