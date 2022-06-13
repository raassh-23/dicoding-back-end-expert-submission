const ReplyRepository =
    require('../../../../Domains/replies/ReplyRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should orchestrating the delete reply action correctly', async () => {
    const threadId = 'threads-123';
    const userId = 'users-123';
    const commentId = 'comments-123';
    const replyId = 'replies-123';

    const mockReplyRepo = new ReplyRepository();

    mockReplyRepo.deleteReplyById = jest.fn(() => Promise.resolve());
    mockReplyRepo.verifyReply = jest.fn(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepo,
    });

    await deleteReplyUseCase
        .execute(replyId, userId, threadId, commentId);

    expect(mockReplyRepo.verifyReply)
        .toBeCalledWith(replyId, userId, threadId, commentId);
    expect(mockReplyRepo.deleteReplyById)
        .toBeCalledWith(replyId);
  });
});
