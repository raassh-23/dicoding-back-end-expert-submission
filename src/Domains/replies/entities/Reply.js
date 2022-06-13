class Reply {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.content = payload.deleted === true ?
        '**balasan telah dihapus**' : payload.content;
    this.username = payload.username;
    this.date = payload.date;
    this.commentId = payload.comment_id;
  }

  _verifyPayload(payload) {
    const {
      id, content, username, date,
      deleted, comment_id: commentId,
    } = payload;

    if (id == null || content == null || username == null ||
        date == null || deleted == null || commentId == null) {
      throw new Error('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof content !== 'string' ||
        typeof username !== 'string' || typeof date !== 'string' ||
        typeof deleted !== 'boolean' || typeof commentId !== 'string') {
      throw new Error('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  toJson() {
    return {
      id: this.id,
      content: this.content,
      username: this.username,
      date: this.date,
    };
  }
}

module.exports = Reply;
