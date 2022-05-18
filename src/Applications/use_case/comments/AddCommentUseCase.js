const NewComment = require('../../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
  constructor({userRepository, threadRepository, commentRepository}) {
    this._userRepository = userRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(payload, threadId, userId) {
    await this._threadRepository.verifyThreadExistsById(threadId);
    await this._userRepository.verifyUserExistsById(userId);

    payload.threadId = threadId;
    payload.owner = userId;

    const newComment = new NewComment({...payload});

    return this._commentRepository.addComment(newComment);
  }
}

module.exports = AddCommentUseCase;
