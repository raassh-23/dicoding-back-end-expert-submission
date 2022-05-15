const RegisterUser = require('../RegisterUser');

describe('A RegisterUser entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      username: 'abc',
      password: '123',
    };

    expect(() => new RegisterUser(payload))
        .toThrowError('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload ' +
  'did not meet data type specification', () => {
    const payload = {
      username: 123,
      fullname: true,
      password: 'abc',
    };

    expect(() => new RegisterUser(payload))
        .toThrowError('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when username contains more than 50 chars', () => {
    const payload = {
      username: 'dicodingindonesiadicodingindonesiadicodingindonesiadicoding',
      fullname: 'Dicoding Indonesia',
      password: 'abc',
    };

    expect(() => new RegisterUser(payload))
        .toThrowError('REGISTER_USER.USERNAME_LIMIT_CHAR');
  });

  it('should throw error when username contains restricted chars', () => {
    const payload = {
      username: 'dico ding',
      fullname: 'dicoding',
      password: 'abc',
    };

    expect(() => new RegisterUser(payload))
        .toThrowError('REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER');
  });

  it('should create RegisterObject correctly', () => {
    const payload = {
      username: 'dicoding',
      fullname: 'Dicoding Indonesia',
      password: 'abc',
    };

    const {username, fullname, password} = new RegisterUser(payload);

    expect(username).toBe(payload.username);
    expect(fullname).toBe(payload.fullname);
    expect(password).toBe(payload.password);
  });
});
