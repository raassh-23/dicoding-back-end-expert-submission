const Thread = require('../Thread');

describe('A AddedThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'thread-123',
      title: 'test',
      body: 'test',
      username: 'test',
    };

    expect(() => new Thread(payload))
        .toThrowError('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload ' +
  'did not meet data type specification', () => {
    const payload = {
      id: [],
      title: 123,
      body: true,
      username: false,
      date: 321,
    };

    expect(() => new Thread(payload))
        .toThrowError('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Thread object correctly when comments empty', () => {
    const payload = {
      id: 'thread-123',
      title: 'test title',
      body: 'test body',
      username: 'test username',
      date: 'test date',
    };

    const {id, title, body, username, date, comments} = new Thread(payload);

    expect(id).toBe(payload.id);
    expect(title).toBe(payload.title);
    expect(body).toBe(payload.body);
    expect(username).toBe(payload.username);
    expect(date).toBe(payload.date);
    expect(comments).toEqual([]);
  });

  it('should create Thread object correctly when comments not empty', () => {
    const payload = {
      id: 'thread-123',
      title: 'test title',
      body: 'test body',
      username: 'test username',
      date: 'test date',
      comments: [
        {
          id: 'comment-123',
          content: 'test content',
        },
        {
          id: 'comment-456',
          content: 'test content',
        },
      ],
    };

    const {id, title, body, username, date, comments} = new Thread(payload);

    expect(id).toBe(payload.id);
    expect(title).toBe(payload.title);
    expect(body).toBe(payload.body);
    expect(username).toBe(payload.username);
    expect(date).toBe(payload.date);
    expect(comments).toStrictEqual(payload.comments);
  });
});
