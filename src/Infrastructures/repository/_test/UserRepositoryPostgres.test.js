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

      const user = await UsersTableTestHelper.findUserById('user-123');
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
        id: 'user-123',
        username: 'dicoding',
        fullname: 'Dicoding Indonesia',
      }));
    });
  });
});