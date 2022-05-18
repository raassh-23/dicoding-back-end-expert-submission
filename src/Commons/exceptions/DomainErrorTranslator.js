const InvariantError = require('./InvariantError');

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
      'can not create user because needed property is missing',
  ),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
      'can not create user because data specification is not met',
  ),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError(
      'can not create user because username exceed 50 characters',
  ),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError(
      'can not create user because ' +
    'username have restricted characters',
  ),

  'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
      'must contain username and password',
  ),
  'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
      'username and password must be string',
  ),

  'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN':
    new InvariantError('must contain refresh token'),
  'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION':
    new InvariantError('refresh token must be string'),

  'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN':
    new InvariantError('must contain refresh token'),
  'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION':
    new InvariantError('refresh token must be string'),

  'NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
      'can not create thread because needed property is missing',
  ),
  'NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
      'can not create thread because data specification is not met',
  ),

  'NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
      'can not create comment because needed property is missing',
  ),
  'NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
      'can not create comment because data specification is not met',
  ),
};

module.exports = DomainErrorTranslator;
