const RegisteredUser = require('../RegisteredUser');

describe('A RegisteredUser entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      username: 'dicoding',
      fullname: 'Dicoding Indonesia',
    };

    expect(() => new RegisteredUser(payload))
        .toThrowError('REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data specification', () => {
    const payload = {
      id: 123,
      username: 'dicoding',
      fullname: 'Dicoding Indonesia',
    };

    expect(() => new RegisteredUser(payload))
        .toThrowError('REGISTERED_USER.NOT_MEET_DATA_SPECIFICATION');
  });

  it('should create RegisteredUser correctly', () => {
    const payload = {
      id: 'users-123',
      username: 'dicoding',
      fullname: 'Dicoding Indonesia',
    };

    const registeredUser = new RegisteredUser(payload);

    expect(registeredUser.id).toBe(payload.id);
    expect(registeredUser.username).toBe(payload.username);
    expect(registeredUser.fullname).toBe(payload.fullname);
  });
});
