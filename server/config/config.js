const path = require('path');

const env = process.env.NODE_ENV || "development";

if(env === 'development' || env === 'test') {
  const config = require(path.join(__dirname, 'config.json'));

  Object.keys(config[env]).forEach((k) => {
    process.env[k] = config[env][k];
  });
}
