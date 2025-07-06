import app from './infrastructure/server';
import logger from './infrastructure/logger';
import { connect } from './infrastructure/database';

import { connectionOptions, MONGO_URI } from './infrastructure/config/mongo';
const { APP_PORT = 3000 } = process.env;

async function main() {
  try {
    await Promise.all([connect(MONGO_URI, connectionOptions)]);
    app.listen(APP_PORT, () => {
      logger.info(`App is running at http://localhost:${APP_PORT}`);
    });
  } catch (error) {
    logger.info('--App Error--', error);
    process.exit(1);
  }
}

main();
