const AuthenticationError = require('../AuthenticationError');

describe('AuthenticationError', () => {
  it('should create an authentication error correctly', () => {
    const error = new AuthenticationError('an authenticaton error occurs');

    expect(error.statusCode).toBe(401);
    expect(error.message).toBe('an authenticaton error occurs');
    expect(error.name).toBe('AuthenticationError');
  });
});
