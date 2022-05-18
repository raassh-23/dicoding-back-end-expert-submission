class Comment {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.content = payload.deleted === true ?
        '**komentar telah dihapus**' : payload.content;
    this.username = payload.username;
    this.date = payload.date;
  }

  _verifyPayload(payload) {
    const {id, content, username, date} = payload;

    if (!id || !content || !username || !date) {
      throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof content !== 'string' ||
        typeof username !== 'string' || typeof date !== 'string') {
      throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Comment;
