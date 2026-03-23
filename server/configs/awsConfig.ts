require("dotenv").config();

interface AwsConfig {
  accessKeyId: string | undefined;
  secretAccessKey: string | undefined;
}

const config: AwsConfig = {
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
};

module.exports = config;
