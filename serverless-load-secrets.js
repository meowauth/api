const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');
const client = new SecretsManagerClient({ region: 'ap-northeast-2' });

const STATIC_ENV = {
  NODE_ENV: 'development',
  SERVERLESS: '1',
};

module.exports = async ({ options, resolveVariable }) => {
  const { SecretString } = await client.send(
    new GetSecretValueCommand({
      SecretId: `/meowauth/dev/api`,
      WithDecryption: true,
    }),
  );
  const secretEnvs = JSON.parse(SecretString);
  return {
    ...STATIC_ENV,
    ...secretEnvs,
  };
};
