const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedThread =
    require('../../Domains/threads/entities/AddedThread');
const Thread =
    require('../../Domains/threads/entities/Thread');
const ThreadRepository =
    require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(newThread) {
    const {title, body, owner} = newThread;
    const id = `threads-${this._idGenerator()}`;

    const query = {
      text: `INSERT INTO threads (id, title, body, owner)
              VALUES ($1, $2, $3, $4) returning id, title, owner`,
      values: [id, title, body, owner],
    };

    const result = await this._pool.query(query);

    return new AddedThread({...result.rows[0]});
  }

  async getThreadById(id) {
    const query = {
      text: `SELECT threads.*, users.username
            FROM threads JOIN users on threads.owner = users.id
            WHERE threads.id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread is not found');
    }

    return new Thread({...result.rows[0]});
  }

  async verifyThreadExistsById(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread is not found');
    }
  }
}

module.exports = ThreadRepositoryPostgres;
