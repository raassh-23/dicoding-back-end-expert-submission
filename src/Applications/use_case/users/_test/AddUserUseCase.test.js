const RegisterUser =
  require('../../../../Domains/users/entities/RegisterUser');
const RegisteredUser =
  require('../../../../Domains/users/entities/RegisteredUser');
const UserRepository = require('../../../../Domains/users/UserRepository');
const PasswordHash = require('../../../security/PasswordHash');
const AddUserUseCase = require('../AddUserUseCase');

describe('AddUserUseCase', () => {
  it('should orchestrating the add user action correctly', async () => {
    const useCasePayload = {
      username: 'dicoding',
      password: 'secret',
      fullname: 'Dicoding Indonesia',
    };

    const expectedRegisteredUser = new RegisteredUser({
      id: 'users-123',
      username: useCasePayload.username,
      fullname: useCasePayload.fullname,
    });

    const mockUserRepo = new UserRepository();
    const mockPasswordHash = new PasswordHash();

    mockUserRepo.verifyAvailableUsername = jest.fn()
        .mockImplementation(() => Promise.resolve());
    mockPasswordHash.hash = jest.fn()
        .mockImplementation(() => Promise.resolve('encrypted_password'));
    mockUserRepo.addUser = jest.fn()
        .mockImplementation(() => Promise.resolve(new RegisteredUser({
          id: 'users-123',
          username: useCasePayload.username,
          fullname: useCasePayload.fullname,
        })));

    const addUserUseCase = new AddUserUseCase({
      userRepository: mockUserRepo,
      passwordHash: mockPasswordHash,
    });

    const registeredUser = await addUserUseCase.execute(useCasePayload);

    expect(registeredUser).toStrictEqual(expectedRegisteredUser);
    expect(mockUserRepo.verifyAvailableUsername)
        .toBeCalledWith(useCasePayload.username);
    expect(mockPasswordHash.hash)
        .toBeCalledWith(useCasePayload.password);
    expect(mockUserRepo.addUser)
        .toBeCalledWith(new RegisterUser({
          username: useCasePayload.username,
          password: 'encrypted_password',
          fullname: useCasePayload.fullname,
        }));
  });
});
