const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedReply =
    require('../../Domains/replies/entities/AddedReply');
const ReplyRepository =
    require('../../Domains/replies/ReplyRepository');
const AuthorizationError =
    require('../../Commons/exceptions/AuthorizationError');
const Reply = require('../../Domains/replies/entities/Reply');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(newReply) {
    const {content, threadId, commentId, owner} = newReply;
    const id = `replies-${this._idGenerator()}`;

    const query = `INSERT INTO replies (id, content, thread_id, 
                    comment_id, owner)
                    VALUES ($1, $2, $3, $4, $5) RETURNING id, content, owner`;
    const values = [id, content, threadId, commentId, owner];

    const {rows} = await this._pool.query(query, values);

    return new AddedReply({...rows[0]});
  }

  async getRepliesByCommentId(commentId) {
    const query = {
      text: `SELECT replies.*, users.username
            FROM replies JOIN users ON replies.owner = users.id
            WHERE replies.comment_id = $1 ORDER BY replies.date ASC`,
      values: [commentId],
    };

    const {rows} = await this._pool.query(query);

    return rows.map((row) => new Reply({...row}));
  }

  async deleteReplyById(id) {
    const query = {
      text: `UPDATE replies SET deleted = true WHERE id = $1
              RETURNING id`,
      values: [id],
    };

    const {rowCount} = await this._pool.query(query);

    if (rowCount === 0) {
      throw new NotFoundError(`reply is not found`);
    }
  }

  async verifyReply(id, userId, threadId, commentId) {
    const query = {
      text: `SELECT id, owner, thread_id, comment_id 
            FROM replies WHERE id = $1`,
      values: [id],
    };

    const {rowCount, rows} = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError(`reply is not found`);
    }

    const {owner,
      thread_id: otherThreadId,
      comment_id: otherCommentId,
    } = rows[0];

    if (threadId !== otherThreadId) {
      throw new NotFoundError(`thread is not found`);
    }

    if (commentId !== otherCommentId) {
      throw new NotFoundError(`comment is not found`);
    }

    if (owner !== userId) {
      throw new AuthorizationError('not reply\'s owner');
    }
  }
}

module.exports = ReplyRepositoryPostgres;
