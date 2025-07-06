import app from './infrastructure/server';
import { connect } from './infrastructure/database';
import logger from './infrastructure/logger';

const { APP_PORT = 3000 } = process.env;

async function main() {
  try {
    await Promise.all([connect()]);
    app.listen(APP_PORT, () => {
      logger.info(`App is running at http://localhost:${APP_PORT}`);
    });
  } catch (error) {
    logger.info('--App Error--', error);
    process.exit(1);
  }
}

main();
