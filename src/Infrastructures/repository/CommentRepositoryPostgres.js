const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedComment =
    require('../../Domains/comments/entities/AddedComment');
const CommentRepository =
    require('../../Domains/comments/CommentRepository');
const AuthorizationError =
    require('../../Commons/exceptions/AuthorizationError');
const Comment = require('../../Domains/comments/entities/Comment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment) {
    const {content, threadId, owner} = newComment;
    const id = `comments-${this._idGenerator()}`;

    const query = `INSERT INTO comments (id, content, thread_id, owner)
                    VALUES ($1, $2, $3, $4) RETURNING id, content, owner`;
    const values = [id, content, threadId, owner];

    const {rows} = await this._pool.query(query, values);

    return new AddedComment({...rows[0]});
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT comments.*, users.username,
            count(likes.owner) as like_count
            FROM comments
            JOIN users ON comments.owner = users.id
            LEFT JOIN likes ON comments.id = likes.comment_id
            WHERE comments.thread_id = $1
            GROUP BY comments.id, users.username
            ORDER BY comments.date ASC`,
      values: [threadId],
    };

    const {rows} = await this._pool.query(query);

    return rows.map((row) => new Comment({...row}));
  }

  async deleteCommentById(id) {
    const query = {
      text: `UPDATE comments SET deleted = true WHERE id = $1
              RETURNING id`,
      values: [id],
    };

    const {rowCount} = await this._pool.query(query);

    if (rowCount === 0) {
      throw new NotFoundError(`comment is not found`);
    }
  }

  async verifyComment(id, userId, threadId) {
    const query = {
      text: `SELECT id, owner, thread_id FROM comments WHERE id = $1`,
      values: [id],
    };

    const {rowCount, rows} = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError(`comment is not found`);
    }

    const {owner, thread_id: otherThreadId} = rows[0];

    if (threadId !== otherThreadId) {
      throw new NotFoundError(`thread is not found`);
    }

    if (owner !== userId) {
      throw new AuthorizationError('not comment\'s owner');
    }
  }

  async verifyCommentExistsById(id) {
    const query = {
      text: `SELECT id FROM comments WHERE id = $1`,
      values: [id],
    };

    const {rowCount} = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError(`comment is not found`);
    }
  }
}

module.exports = CommentRepositoryPostgres;
