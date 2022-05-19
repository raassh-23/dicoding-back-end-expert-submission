const InvariantError = require('../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
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

    const {rowCount} = await this._pool.query(query);

    if (rowCount) {
      throw new InvariantError('username tidak tersedia');
    }
  }

  async addUser(registerUser) {
    const {username, password, fullname} = registerUser;
    const id = `users-${this._idGenerator()}`;

    const query = {
      text: `INSERT INTO users (id, username, password, fullname) 
              VALUES ($1, $2, $3, $4) returning id, username, fullname`,
      values: [id, username, password, fullname],
    };

    const {rows} = await this._pool.query(query);

    return new RegisteredUser({...rows[0]});
  }

  async getPasswordByUsername(username) {
    const query = {
      text: 'SELECT password FROM users WHERE username = $1',
      values: [username],
    };

    const {rowCount, rows} = await this._pool.query(query);

    if (!rowCount) {
      throw new InvariantError('username is not found');
    }

    return rows[0].password;
  }

  async getIdByUsername(username) {
    const query = {
      text: 'SELECT id FROM users WHERE username = $1',
      values: [username],
    };

    const {rowCount, rows} = await this._pool.query(query);

    if (!rowCount) {
      throw new InvariantError('username is not found');
    }

    const {id} = rows[0];

    return id;
  }

  async verifyUserExistsById(id) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id],
    };

    const {rowCount} = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('user is not found');
    }
  }
}

module.exports = UserRepositoryPostgres;
