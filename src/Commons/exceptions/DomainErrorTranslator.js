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
      'can not create user because username have restricted characters',
  ),
};

module.exports = DomainErrorTranslator;