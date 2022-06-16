const ThreadsTableTestHelper =
    require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper =
    require('../../../../tests/UsersTableTestHelper');
const CommentsTableHelper =
    require('../../../../tests/CommentsTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError =
    require('../../../Commons/exceptions/AuthorizationError');
const NewComment =
    require('../../../Domains/comments/entities/NewComment');
const AddedComment =
    require('../../../Domains/comments/entities/AddedComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const Comment = require('../../../Domains/comments/entities/Comment');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment', () => {
    it('should persist new comment', async () => {
      await UsersTableTestHelper.addUser({id: 'users-123'});
      await ThreadsTableTestHelper.addThread({
        id: 'threads-123',
        owner: 'users-123',
      });

      const newComment = new NewComment({
        content: 'test content',
        threadId: 'threads-123',
        owner: 'users-123',
      });

      const fakeIdGenerator = () => '123';
      const commentRepository =
          new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await commentRepository.addComment(newComment);

      const comments = await CommentsTableHelper
          .findCommentById('comments-123');
      expect(comments).toHaveLength(1);
    });

    it('should return added comment', async () => {
      await UsersTableTestHelper.addUser({id: 'users-123'});
      await ThreadsTableTestHelper.addThread({
        id: 'threads-123',
        owner: 'users-123',
      });

      const newComment = new NewComment({
        content: 'test content',
        threadId: 'threads-123',
        owner: 'users-123',
      });

      const fakeIdGenerator = () => '123';
      const commentRepository =
          new CommentRepositoryPostgres(pool, fakeIdGenerator);

      const addedComment = await commentRepository.addComment(newComment);

      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comments-123',
        content: 'test content',
        owner: 'users-123',
      }));
    });
  });

  describe('getCommentsByThreadId', () => {
    it('should return empty array if no comments', async () => {
      const commentRepository = new CommentRepositoryPostgres(pool, {});

      const comments = await commentRepository
          .getCommentsByThreadId('threads-123');

      expect(comments).toHaveLength(0);
    });

    it('should return comments if there are comments', async () => {
      await UsersTableTestHelper.addUser({id: 'users-123', username: 'user'});
      await ThreadsTableTestHelper.addThread({
        id: 'threads-123',
        owner: 'users-123',
      });
      await CommentsTableHelper.addComment({
        id: 'comments-1',
        content: 'test content',
        threadId: 'threads-123',
        owner: 'users-123',
        date: '2022-05-18T15:26:50.713Z',
      });
      await CommentsTableHelper.addComment({
        id: 'comments-2',
        content: 'test content',
        threadId: 'threads-123',
        owner: 'users-123',
        date: '2022-05-18T15:27:50.713Z',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      const expectedFirstComment = new Comment({
        id: 'comments-1',
        content: 'test content',
        username: 'user',
        date: '2022-05-18T15:26:50.713Z',
        deleted: false,
        like_count: 0,
      });

      const expectedSecondComment = new Comment({
        id: 'comments-2',
        content: 'test content',
        username: 'user',
        date: '2022-05-18T15:27:50.713Z',
        deleted: false,
        like_count: 0,
      });

      const comments = await commentRepositoryPostgres
          .getCommentsByThreadId('threads-123');

      expect(comments).toHaveLength(2);
      expect(comments[0]).toStrictEqual(expectedFirstComment);
      expect(comments[1]).toStrictEqual(expectedSecondComment);
    });
  });

  describe('deleteCommentById', () => {
    it('should throw NotFoundError if comment not found', async () => {
      const commentRepository = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepository.deleteCommentById('comments-123'))
          .rejects.toThrow(NotFoundError);
    });

    it('should delete comment if found', async () => {
      await UsersTableTestHelper.addUser({id: 'users-123'});
      await ThreadsTableTestHelper.addThread({
        id: 'threads-123',
        owner: 'users-123',
      });
      await CommentsTableHelper.addComment({
        id: 'comments-123',
        threadId: 'threads-123',
        owner: 'users-123',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await commentRepositoryPostgres.deleteCommentById('comments-123');

      const comments = await CommentsTableHelper
          .findCommentById('comments-123');
      expect(comments[0].deleted).toEqual(true);
    });
  });

  describe('verifyCommentOwner', () => {
    it('should throw NotFoundError if comment not found', async () => {
      const commentRepository = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepository
          .verifyComment('comments-123', 'users-123', 'threads-123'))
          .rejects.toThrow(NotFoundError);
    });

    it('should throw AuthorizationError if not the owner', async () => {
      await UsersTableTestHelper.addUser({id: 'users-123'});
      await ThreadsTableTestHelper.addThread({
        id: 'threads-123',
        owner: 'users-123',
      });
      await CommentsTableHelper.addComment({
        id: 'comments-123',
        threadId: 'threads-123',
        owner: 'users-123',
      });

      const commentRepository = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepository
          .verifyComment('comments-123', 'users-999', 'threads-123'))
          .rejects.toThrow(AuthorizationError);
    });

    it('should throw NotFoundError if not the thread', async () => {
      await UsersTableTestHelper.addUser({id: 'users-123'});
      await ThreadsTableTestHelper.addThread({
        id: 'threads-123',
        owner: 'users-123',
      });
      await CommentsTableHelper.addComment({
        id: 'comments-123',
        threadId: 'threads-123',
        owner: 'users-123',
      });

      const commentRepository = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepository
          .verifyComment('comments-123', 'users-123', 'threads-999'))
          .rejects.toThrow(NotFoundError);
    });

    it('should not throw any error ' +
        'if is the correct owner and thread', async () => {
      await UsersTableTestHelper.addUser({id: 'users-123'});
      await ThreadsTableTestHelper.addThread({
        id: 'threads-123',
        owner: 'users-123',
      });
      await CommentsTableHelper.addComment({
        id: 'comments-123',
        threadId: 'threads-123',
        owner: 'users-123',
      });

      const commentRepository = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepository
          .verifyComment('comments-123', 'users-123', 'threads-123'))
          .resolves.not.toThrow();
    });
  });

  describe('verifyCommentExistsById', () => {
    it('should throw NotFoundError when id does not exists', async () => {
      const commentRepository = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepository.verifyCommentExistsById('comments-123'))
          .rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError when id exists', async () => {
      await UsersTableTestHelper.addUser({id: 'users-123'});
      await ThreadsTableTestHelper.addThread({
        id: 'threads-123',
        owner: 'users-123',
      });
      await CommentsTableHelper.addComment({
        id: 'comments-123',
        threadId: 'threads-123',
        owner: 'users-123',
      });

      const commentRepository = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepository.verifyCommentExistsById('comments-123'))
          .resolves.not.toThrow(NotFoundError);
    });
  });
});
