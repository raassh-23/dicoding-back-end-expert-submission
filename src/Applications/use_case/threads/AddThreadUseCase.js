const NewThread = require('../../../Domains/threads/entities/NewThread');

class AddThreadUseCase {
  constructor({userRepository, threadRepository}) {
    this._userRepository = userRepository;
    this._threadRepository = threadRepository;
  }

  async execute(payload, userId) {
    await this._userRepository.verifyUserExistsById(userId);

    payload.owner = userId;

    const newThread = new NewThread({...payload, owner: userId});
    return this._threadRepository.addThread(newThread);
  }
}

module.exports = AddThreadUseCase;
