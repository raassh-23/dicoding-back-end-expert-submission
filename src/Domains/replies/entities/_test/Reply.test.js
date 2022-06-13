const Reply = require('../Reply');

describe('A Reply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'replies-123',
      content: 'test title',
      username: 'test username',
    };

    expect(() => new Reply(payload))
        .toThrowError('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload ' +
  'did not meet data type specification', () => {
    const payload = {
      id: ['replies-123'],
      content: 123,
      username: true,
      date: 321,
      deleted: 'false',
      comment_id: {},
    };

    expect(() => new Reply(payload))
        .toThrowError('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Reply object correctly when not deleted', () => {
    const payload = {
      id: 'replies-123',
      content: 'test title',
      username: 'test username',
      date: 'test date',
      deleted: false,
      comment_id: 'comments-123',
    };

    const {id, content, username, date} = new Reply(payload);

    expect(id).toBe(payload.id);
    expect(content).toBe(payload.content);
    expect(username).toBe(payload.username);
    expect(date).toBe(payload.date);
  });

  it('should create Reply object correctly when deleted', () => {
    const payload = {
      id: 'replies-123',
      content: 'test title',
      username: 'test username',
      date: 'test date',
      deleted: true,
      comment_id: 'comments-123',
    };

    const {id, content, username, date} = new Reply(payload);

    expect(id).toBe(payload.id);
    expect(content).toBe('**balasan telah dihapus**');
    expect(username).toBe(payload.username);
    expect(date).toBe(payload.date);
  });

  describe('toJson', () => {
    it('should return correct json object', () => {
      const payload = {
        id: 'replies-123',
        content: 'test title',
        username: 'test username',
        date: 'test date',
        deleted: false,
        comment_id: 'comments-123',
      };

      const expected = {
        id: payload.id,
        content: payload.content,
        username: payload.username,
        date: payload.date,
      };

      const reply = new Reply(payload);

      expect(reply.toJson()).toStrictEqual(expected);
    });
  });
});
