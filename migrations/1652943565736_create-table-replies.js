/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('replies', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    thread_id: {
      type: 'VARCHAR(50)',
      references: 'threads(id)',
      onDelete: 'CASCADE',
      notNull: true,
    },
    comment_id: {
      type: 'VARCHAR(50)',
      references: 'comments(id)',
      onDelete: 'CASCADE',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      references: 'users(id)',
      onDelete: 'CASCADE',
      notNull: true,
    },
    date: {
      type: 'VARCHAR',
      notNull: true,
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
    deleted: {
      type: 'BOOLEAN',
      notNull: true,
      default: false,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('replies');
};
