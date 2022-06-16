/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns('comments', {
    like_count: {
      type: 'integer',
      default: 0,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('comments', ['like_count']);
};
