import type {Config} from 'jest';

const config: Config = {
  verbose: true,
  testMatch: [
    "**/application/**/*.spec.(ts|js)",
    "**/test/**/*.spec.(ts|js)"
  ],
  transform: {
    '\\.[jt]sx?$': 'babel-jest',
  }
};

export default config;