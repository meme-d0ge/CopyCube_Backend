import * as process from 'node:process';

export default () => {
  return {
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
      type: process.env.DATABASE_TYPE,
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,

      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      name: process.env.DATABASE_NAME,
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
    jwt_refresh: {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    },
    aws: {
      region: process.env.AWS_REGION,
      endpoint: process.env.AWS_ENDPOINT,
      access_key_id: process.env.AWS_ACCESS_KEY_ID,
      secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
      bucket_avatars: process.env.AWS_BUCKET_AVATARS,
      bucket_posts: process.env.AWS_BUCKET_POSTS,
    },
  };
};
