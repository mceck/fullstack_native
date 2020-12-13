export const API_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:9000'
    : 'http://localhost:9000';

export const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
