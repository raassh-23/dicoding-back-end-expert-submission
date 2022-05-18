const AddedComment =
  require('../../../../Domains/comments/entities/AddedComment');
const CommentRepository =
    require('../../../../Domains/comments/CommentRepository');
const ThreadRepository =
    require('../../../../Domains/threads/ThreadRepository');
const UserRepository =
    require('../../../../Domains/users/UserRepository');
const AddCommentUseCase = require('../AddCommentUseCase');
const NewComment = require('../../../../Domains/comments/entities/NewComment');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    const newCommentPayload = {
      content: 'test content',
    };

    const threadId = 'threads-123';
    const userId = 'users-123';

    const expected = new AddedComment({
      id: 'comments-123',
      content: newCommentPayload.content,
      owner: userId,
    });

    const mockCommentRepo = new CommentRepository();
    const mockThreadRepo = new ThreadRepository();
    const mockUserRepo = new UserRepository();

    mockCommentRepo.addComment = jest.fn()
        .mockImplementation(() => Promise.resolve(new AddedComment({
          id: 'comments-123',
          content: newCommentPayload.content,
          owner: userId,
        })));
    mockUserRepo.verifyUserExistsById = jest.fn()
        .mockImplementation(() => Promise.resolve());
    mockThreadRepo.verifyThreadExistsById = jest.fn()
        .mockImplementation(() => Promise.resolve());


    const addCommentUseCase = new AddCommentUseCase({
      userRepository: mockUserRepo,
      threadRepository: mockThreadRepo,
      commentRepository: mockCommentRepo,
    });

    const addedComment = await addCommentUseCase
        .execute(newCommentPayload, threadId, userId);

    expect(addedComment).toStrictEqual(expected);
    expect(mockUserRepo.verifyUserExistsById)
        .toBeCalledWith(userId);
    expect(mockThreadRepo.verifyThreadExistsById)
        .toBeCalledWith(threadId);
    expect(mockCommentRepo.addComment)
        .toBeCalledWith(new NewComment({
          content: newCommentPayload.content,
          threadId,
          owner: userId,
        }));
  });
});
