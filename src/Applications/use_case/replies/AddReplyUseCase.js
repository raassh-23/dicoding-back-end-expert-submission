const NewReply = require('../../../Domains/replies/entities/NewReply');

class AddReplyUseCase {
  constructor({
    userRepository,
    threadRepository,
    commentRepository,
    replyRepository,
  }) {
    this._userRepository = userRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(payload, threadId, commentId, userId) {
    await this._threadRepository.verifyThreadExistsById(threadId);
    await this._commentRepository.verifyCommentExistsById(commentId);
    await this._userRepository.verifyUserExistsById(userId);

    payload.threadId = threadId;
    payload.commentId = commentId;
    payload.owner = userId;

    const newReply = new NewReply({...payload});

    return this._replyRepository.addReply(newReply);
  }
}

module.exports = AddReplyUseCase;
