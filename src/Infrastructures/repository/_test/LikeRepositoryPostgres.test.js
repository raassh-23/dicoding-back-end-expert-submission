const ThreadsTableTestHelper =
    require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper =
    require('../../../../tests/UsersTableTestHelper');
const CommentsTableHelper =
    require('../../../../tests/CommentsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const pool = require('../../database/postgres/pool');
const LikeRepositoryPostgres =
    require('../LikeRepositoryPostgres');

describe('LikeRepositoryPostgres', () => {
  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
    await CommentsTableHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  beforeEach(async () => {
    await UsersTableTestHelper.addUser({id: 'users-123'});
    await ThreadsTableTestHelper.addThread({
      id: 'threads-123',
      owner: 'users-123',
    });
    await CommentsTableHelper.addComment({
      id: 'comments-123',
      content: 'test content',
      threadId: 'threads-123',
      owner: 'users-123',
      date: '2022-05-18T15:26:50.713Z',
    });
  });

  describe('verifyLikeExists', () => {
    it('should return false if like does not exist', async () => {
      const commentId = 'comments-123';
      const owner = 'users-123';

      const likeRepository =
          new LikeRepositoryPostgres(pool);

      const haveLiked = await likeRepository
          .verifyLikeExists(commentId, owner);

      expect(haveLiked).toBe(false);
    });

    it('should return true if like exists', async () => {
      const commentId = 'comments-123';
      const owner = 'users-123';

      await LikesTableTestHelper.addLike({
        commentId,
        owner,
      });

      const likeRepository =
          new LikeRepositoryPostgres(pool);

      const haveLiked = await likeRepository
          .verifyLikeExists(commentId, owner);

      expect(haveLiked).toBe(true);
    });
  });

  describe('addLikeToComment', () => {
    it('should add like to comment', async () => {
      const commentId = 'comments-123';
      const owner = 'users-123';

      const likeRepository =
          new LikeRepositoryPostgres(pool);

      await likeRepository.addLikeToComment(commentId, owner);

      const likes = await LikesTableTestHelper
          .findLikeByCommentAndOwner(commentId, owner);

      expect(likes).toHaveLength(1);
      expect(likes[0].comment_id).toBe(commentId);
      expect(likes[0].owner).toBe(owner);
    });
  });

  describe('removeLikeFromComment', () => {
    it('should remove like from comment', async () => {
      const commentId = 'comments-123';
      const owner = 'users-123';

      await LikesTableTestHelper.addLike({
        commentId,
        owner,
      });

      const likeRepository =
          new LikeRepositoryPostgres(pool);

      await likeRepository.removeLikeFromComment(commentId, owner);

      const likes = await LikesTableTestHelper
          .findLikeByCommentAndOwner(commentId, owner);

      expect(likes).toHaveLength(0);
    });
  });
});
