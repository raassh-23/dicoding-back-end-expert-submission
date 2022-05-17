const bcrypt = require('bcrypt');
const BcryptPasswordHash = require('../BcryptPasswordHash');
const AuthenticationError =
    require('../../../Commons/exceptions/AuthenticationError');

describe('BcryptPasswordHash', () => {
  describe('hash function', () => {
    it('should encrypt password correctly', async () => {
      const spyHash = jest.spyOn(bcrypt, 'hash');
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

      const encryptedPassword = await bcryptPasswordHash.hash('plain_password');

      expect(typeof encryptedPassword).toBe('string');
      expect(encryptedPassword).not.toEqual('plain_password');
      expect(spyHash).toHaveBeenCalledWith('plain_password', 10);
    });
  });

  describe('comparePassword function', () => {
    it('should throw AuthenticationError if password not match', async () => {
      // Arrange
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

      // Act & Assert
      await expect(bcryptPasswordHash
          .comparePassword('plain_password', 'encrypted_password')).rejects
          .toThrow(AuthenticationError);
    });

    it('should not return AuthenticationError if password match', async () => {
      // Arrange
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);
      const plainPassword = 'secret';
      const encryptedPassword = await bcryptPasswordHash
          .hash(plainPassword);

      // Act & Assert
      await expect(bcryptPasswordHash
          .comparePassword(plainPassword, encryptedPassword))
          .resolves.not.toThrow(AuthenticationError);
    });
  });
});
