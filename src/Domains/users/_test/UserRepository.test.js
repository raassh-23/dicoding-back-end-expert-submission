const UserRepository = require('../UserRepository');

describe('UserRepository interface', () => {
  it('should throw error when invoke abstract behaviour', async () => {
    const userRepository = new UserRepository();

    await expect(userRepository.addUser({}))
        .rejects.toThrowError('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(userRepository.verifyAvailableUsername(''))
        .rejects.toThrowError('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(userRepository.getPasswordByUsername(''))
        .rejects.toThrowError('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(userRepository.getIdByUsername(''))
        .rejects.toThrowError('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(userRepository.verifyUserExistsById(''))
        .rejects.toThrowError('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
