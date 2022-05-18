const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const RegisteredUser =
    require('../../../Domains/users/entities/RegisteredUser');
const pool = require('../../database/postgres/pool');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');

describe('UserRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyAvailableUsername', () => {
    it('should throw InvariantError when username not available', async () => {
      await UsersTableTestHelper.addUser({username: 'dicoding'});
      const userRepository = new UserRepositoryPostgres(pool, {});

      await expect(userRepository.verifyAvailableUsername('dicoding')).rejects
          .toThrow(InvariantError);
    });

    it('should not throw InvariantError when username available', async () => {
      const userRepository = new UserRepositoryPostgres(pool, {});

      await expect(userRepository.verifyAvailableUsername('dicoding')).resolves
          .not.toThrow(InvariantError);
    });
  });

  describe('addUser', () => {
    it('should persist register user', async () => {
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const fakeIdGenerator = () => '123';
      const userRepository = new UserRepositoryPostgres(pool, fakeIdGenerator);

      await userRepository.addUser(registerUser);

      const user = await UsersTableTestHelper.findUserById('users-123');
      expect(user).toHaveLength(1);
    });

    it('should return registered user', async () => {
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const fakeIdGenerator = () => '123';
      const userRepository = new UserRepositoryPostgres(pool, fakeIdGenerator);

      const registeredUser = await userRepository.addUser(registerUser);

      expect(registeredUser).toStrictEqual(new RegisteredUser({
        id: 'users-123',
        username: 'dicoding',
        fullname: 'Dicoding Indonesia',
      }));
    });
  });

  describe('getPasswordByUsername', () => {
    it('should throw InvariantError when user not found', () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(userRepositoryPostgres.getPasswordByUsername('dicoding'))
          .rejects.toThrowError(InvariantError);
    });

    it('should return username password when user is found', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({
        username: 'dicoding',
        password: 'secret_password',
      });

      // Action & Assert
      const password = await userRepositoryPostgres
          .getPasswordByUsername('dicoding');
      expect(password).toBe('secret_password');
    });
  });

  describe('getIdByUsername', () => {
    it('should throw InvariantError when user not found', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(userRepositoryPostgres.getIdByUsername('dicoding'))
          .rejects
          .toThrowError(InvariantError);
    });

    it('should return user id correctly', async () => {
      // Arrange
      await UsersTableTestHelper
          .addUser({id: 'users-321', username: 'dicoding'});
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action
      const userId = await userRepositoryPostgres.getIdByUsername('dicoding');

      // Assert
      expect(userId).toEqual('users-321');
    });
  });

  describe('verifyUserExistsById', () => {
    it('should throw InvariantError when id does not exists', async () => {
      const userRepository = new UserRepositoryPostgres(pool, {});

      await expect(userRepository.verifyUserExistsById('test-123')).rejects
          .toThrow(InvariantError);
    });

    it('should not throw InvariantError when id exists', async () => {
      await UsersTableTestHelper.addUser({
        id: 'test-123',
      });

      const userRepository = new UserRepositoryPostgres(pool, {});

      await expect(userRepository.verifyUserExistsById('test-123')).resolves
          .not.toThrow(InvariantError);
    });
  });
});
