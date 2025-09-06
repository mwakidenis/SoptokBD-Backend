import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './app/config';

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);

    server = app.listen(config.port, () => {
      console.log(`SoptokBD server running on port http://localhost:${5000}`);
    });
  } catch (error) {
    console.log(error);
  }
}



process.on('unhandledRejection', () => {
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
});

process.on('unhandledRejection', () => {
  process.exit(1);
});


main();