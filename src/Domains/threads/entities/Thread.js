class Thread {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.title = payload.title;
    this.body = payload.body;
    this.username = payload.username;
    this.date = payload.date;
    this.comments = payload.comments || [];
  }

  _verifyPayload(payload) {
    const {id, title, body, username, date} = payload;

    if (id == null || title == null || body == null ||
        username == null || date == null) {
      throw new Error('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof title !== 'string' ||
        typeof body !== 'string' || typeof username !== 'string' ||
        typeof date !== 'string') {
      throw new Error('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Thread;
