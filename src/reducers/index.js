import {
  prefix,
  INIT,
  CHANGE,
  TOUCH,
  VALIDATE_PENDING,
  VALIDATE_FAIL,
  VALIDATE_SUCCESS,
  DESTROY,
} from '../constants';

const isApplicable = (action) => {
  return action && action.type && (String(action.type)).substring(0, prefix.length) === prefix;
};

const initialFormState = {};

const initialFieldState = {
  form: null,
  value: null,
  touched: false,
  valid: true,
  error: '',
  validate: [],
};

const form = (state = {}, action) => {
  if (isApplicable(action)) {
    const { type, payload: { form, name, value, validate, error, touched } } = action;
    const formState = state[form] || {...initialFormState};
    const fieldState = formState[name] || {...initialFieldState};
    switch (type) {
      case INIT:
        return {...state, [form]: {...formState, [name]: {...fieldState, form, name, validate, value}}};
      case CHANGE:
        return {...state, [form]: {...formState, [name]: {...fieldState, value, touched}}};
      case TOUCH:
        return {...state, [form]: {...formState, [name]: {...fieldState, touched: true}}};
      case VALIDATE_PENDING:
        return {...state, [form]: {...formState, [name]: {...fieldState, pending: true, error: ''}}};
      case VALIDATE_FAIL:
        return {...state, [form]: {...formState, [name]: {...fieldState, pending: false, error, touched}}};
      case VALIDATE_SUCCESS:
        return {...state, [form]: {...formState, [name]: {...fieldState, pending: false, error: '', touched}}};
      case DESTROY:
        return {...state, [form]: {...formState, [name]: {}}};
    }
  }
  return state;
};

export { form };
