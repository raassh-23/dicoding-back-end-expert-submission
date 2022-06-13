class GetThreadUseCase {
  constructor({threadRepository, commentRepository, replyRepository}) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);
    thread.comments = await this._commentRepository
        .getCommentsByThreadId(threadId);

    const commentsId = thread.comments.map((comment) => comment.id);
    const replies = await this._replyRepository
        .getRepliesByCommentsId(commentsId);

    thread.comments.forEach((comment) => {
      const commentReplies = replies
          .filter((reply) => reply.commentId === comment.id);
      comment.replies = commentReplies.map((reply) => reply.toJson());
    });

    return thread;
  }
}

module.exports = GetThreadUseCase;
