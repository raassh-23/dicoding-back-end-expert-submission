const NotFoundError = require('../NotFoundError');

describe('NotFoundError', () => {
  it('should create a not found error correctly', () => {
    const error = new NotFoundError('a not found error occurs');

    expect(error.statusCode).toBe(404);
    expect(error.message).toBe('a not found error occurs');
    expect(error.name).toBe('NotFoundError');
  });
});
