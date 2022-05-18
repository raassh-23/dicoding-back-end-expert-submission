const Thread =
  require('../../../../Domains/threads/entities/Thread');
const Comment =
  require('../../../../Domains/comments/entities/Comment');
const ThreadRepository =
  require('../../../../Domains/threads/ThreadRepository');
const CommentRepository =
  require('../../../../Domains/comments/CommentRepository');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadUseCase', () => {
  it('should orchestrating the get thread action correctly', async () => {
    const threadId = 'threads-123';

    const expected = new Thread({
      id: threadId,
      title: 'test title',
      body: 'test body',
      username: 'user',
      date: 'test date',
      comments: [
        new Comment({
          id: 'comments-123',
          content: 'test comment body',
          username: 'user1',
          date: 'test date1',
        }),
        new Comment({
          id: 'comments-456',
          content: 'test comment body 2',
          username: 'user2',
          date: 'test date2',
        }),
      ],
    });

    const mockThreadRepo = new ThreadRepository();
    const mockCommentRepo = new CommentRepository();

    mockThreadRepo.getThreadById = jest.fn()
        .mockImplementation(() => Promise.resolve(new Thread({
          id: threadId,
          title: 'test title',
          body: 'test body',
          username: 'user',
          date: 'test date',
        })));
    mockCommentRepo.getCommentsByThreadId = jest.fn()
        .mockImplementation(() => Promise.resolve([
          new Comment({
            id: 'comments-123',
            content: 'test comment body',
            username: 'user1',
            date: 'test date1',
          }),
          new Comment({
            id: 'comments-456',
            content: 'test comment body 2',
            username: 'user2',
            date: 'test date2',
          }),
        ]));


    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepo,
      commentRepository: mockCommentRepo,
    });

    const getThread = await getThreadUseCase
        .execute(threadId);

    expect(getThread).toStrictEqual(expected);
    expect(mockThreadRepo.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepo.getCommentsByThreadId).toBeCalledWith(threadId);
  });
});
