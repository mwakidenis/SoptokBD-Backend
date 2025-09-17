import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  node_dev: process.env.NODE_DEV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  cloud_name: process.env.CLOUD_NAME,
  cloud_api_key: process.env.CLOUD_API_KEY,
  cloud_api_secret: process.env.CLOUD_API_SECRET,

  ssl_store_id: process.env.SSL_STORE_ID || '',
  ssl_store_password: process.env.SSL_STORE_PASSWORD || '',
  ssl_is_live: process.env.SSL_IS_LIVE === 'true',

  ssl_success_url: process.env.SSL_SUCCESS_URL,
  ssl_failed_url: process.env.SSL_FAILED_URL,
  ssl_cancel_url: process.env.SSL_CANCEL_URL,
  ssl_ipn_url: process.env.SSL_IPN_URL,

  password: process.env.PASSWORD,
  gemini_api_key: process.env.GEMINI_API_KEY,
};
