const InvariantError = require('../InvariantError');

describe('InvariantError', () => {
  it('should create an invariant error correctly', () => {
    const error = new InvariantError('an error occurs');

    expect(error.statusCode).toBe(400);
    expect(error.message).toBe('an error occurs');
    expect(error.name).toBe('InvariantError');
  });
});
