module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testMatch: ['**/?(*.)+(spec|test).ts'],
  moduleNameMapper: {
    '^@enums/(.*)$': '<rootDir>/src/enums/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@exceptions/(.*)$': '<rootDir>/src/exceptions/$1',
    '^@models/(.*)$': '<rootDir>/src/models/$1',
    '^@modules/(.*)$': '<rootDir>/src/modules/$1',
  },
};
