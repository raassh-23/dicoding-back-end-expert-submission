const AddedReply =
  require('../../../../Domains/replies/entities/AddedReply');
const NewReply = require('../../../../Domains/replies/entities/NewReply');
const ReplyRepository =
    require('../../../../Domains/replies/ReplyRepository');
const CommentRepository =
    require('../../../../Domains/comments/CommentRepository');
const ThreadRepository =
    require('../../../../Domains/threads/ThreadRepository');
const UserRepository =
    require('../../../../Domains/users/UserRepository');
const AddReplyUseCase = require('../AddReplyUseCase');

describe('AddReplyUseCase', () => {
  it('should orchestrating the add reply action correctly', async () => {
    const newReplyPayload = {
      content: 'test content',
    };

    const threadId = 'threads-123';
    const commentId = 'comments-123';
    const userId = 'users-123';

    const expected = new AddedReply({
      id: 'replies-123',
      content: newReplyPayload.content,
      owner: userId,
    });

    const mockReplyRepo = new ReplyRepository();
    const mockCommentRepo = new CommentRepository();
    const mockThreadRepo = new ThreadRepository();
    const mockUserRepo = new UserRepository();

    mockReplyRepo.addReply = jest.fn(() => Promise.resolve(
        new AddedReply({
          id: 'replies-123',
          content: newReplyPayload.content,
          owner: userId,
        }),
    ));
    mockCommentRepo.verifyCommentExistsById = jest.fn(() => Promise.resolve());
    mockUserRepo.verifyUserExistsById = jest.fn(() => Promise.resolve());
    mockThreadRepo.verifyThreadExistsById = jest.fn(() => Promise.resolve());


    const addReplyUseCase = new AddReplyUseCase({
      userRepository: mockUserRepo,
      threadRepository: mockThreadRepo,
      commentRepository: mockCommentRepo,
      replyRepository: mockReplyRepo,
    });

    const addedReply = await addReplyUseCase
        .execute(newReplyPayload, threadId, commentId, userId);

    expect(addedReply).toStrictEqual(expected);
    expect(mockUserRepo.verifyUserExistsById)
        .toBeCalledWith(userId);
    expect(mockThreadRepo.verifyThreadExistsById)
        .toBeCalledWith(threadId);
    expect(mockCommentRepo.verifyCommentExistsById)
        .toBeCalledWith(commentId);
    expect(mockReplyRepo.addReply)
        .toBeCalledWith(new NewReply({
          content: newReplyPayload.content,
          threadId,
          commentId,
          owner: userId,
        }));
  });
});
