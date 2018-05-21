const prefix = '@@react-redux-simple-form';

const name = (key) => `${prefix}/${key}`;

const INIT = name('INIT');
const TOUCH = name('TOUCH');
const CHANGE = name('CHANGE');
const DESTROY = name('DESTROY');
const VALIDATE_PENDING = name('VALIDATE_PENDING');
const VALIDATE_SUCCESS = name('VALIDATE_SUCCESS');
const VALIDATE_FAIL = name('VALIDATE_FAIL');

export {
  prefix,
  INIT,
  TOUCH,
  CHANGE,
  DESTROY,
  VALIDATE_PENDING,
  VALIDATE_SUCCESS,
  VALIDATE_FAIL,
};
