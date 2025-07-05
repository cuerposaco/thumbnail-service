import app from './infrastructure/server';

const { APP_PORT = 3000 } = process.env;

async function main() {
  app.listen(APP_PORT, () => {
    console.log(`App is running at http://localhost:${APP_PORT}`);
  });
}

main();
