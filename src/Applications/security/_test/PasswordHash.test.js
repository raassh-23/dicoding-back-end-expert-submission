const PasswordHash = require('../PasswordHash');

describe('PasswordHash interface', () => {
  it('should throw error when invoke abstract behaviour', async () => {
    const passwordHash = new PasswordHash();

    await expect(passwordHash.hash('dummy'))
        .rejects.toThrowError('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED');
  });
});
