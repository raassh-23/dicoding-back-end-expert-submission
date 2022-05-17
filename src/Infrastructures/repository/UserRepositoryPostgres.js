const InvariantError = require('../../Commons/exceptions/InvariantError');
const RegisteredUser = require('../../Domains/users/entities/RegisteredUser');
const UserRepository = require('../../Domains/users/UserRepository');

class UserRepositoryPostgres extends UserRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async verifyAvailableUsername(username) {
    const query = {
      text: 'SELECT * FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (result.rowCount) {
      throw new InvariantError('username is unavailable');
    }
  }

  async addUser(registerUser) {
    const {username, password, fullname} = registerUser;
    const id = `user-${this._idGenerator()}`;

    const query = {
      text: `INSERT INTO users (id, username, password, fullname) 
              VALUES ($1, $2, $3, $4) returning id, username, fullname`,
      values: [id, username, password, fullname],
    };

    const result = await this._pool.query(query);

    return new RegisteredUser({...result.rows[0]});
  }

  async getPasswordByUsername(username) {
    const query = {
      text: 'SELECT password FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('username is not found');
    }

    return result.rows[0].password;
  }

  async getIdByUsername(username) {
    const query = {
      text: 'SELECT id FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('username is not found');
    }

    const {id} = result.rows[0];

    return id;
  }
}

module.exports = UserRepositoryPostgres;
