const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedComment =
    require('../../Domains/comments/entities/AddedComment');
const CommentRepository =
    require('../../Domains/comments/CommentRepository');

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
      text: `SELECT * FROM comments WHERE thread_id = $1 ORDER BY date DESC`,
      values: [threadId],
    };

    const {rows} = await this._pool.query(query);

    return rows.map((row) => new AddedComment({...row}));
  }

  async deleteCommentById(id) {
    const query = {
      text: `DELETE FROM comments WHERE id = $1`,
      values: [id],
    };

    const {rowCount} = await this._pool.query(query);

    if (rowCount === 0) {
      throw new NotFoundError(`Comment not found`);
    }
  }
}

module.exports = CommentRepositoryPostgres;
