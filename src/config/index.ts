import { merge } from 'lodash';
import DefaultConfig from './default';

export default () => {
  let envConfig = {};
  const defaultConfig = DefaultConfig();
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const EnvConfig = require(`./${process.env.NODE_ENV}`);
    envConfig = EnvConfig.default();
  } catch (e) {
    console.log(
      'Failed to import env config file, using the default configurations',
      e,
    );
  }

  const config = merge(defaultConfig, envConfig);

  return config;
};
