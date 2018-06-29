import {
  getFormFields,
  isFormValid,
  serialize,
} from '../selectors';

import {
  INIT,
  TOUCH,
  CHANGE,
  DESTROY,
  VALIDATE_PENDING,
  VALIDATE_SUCCESS,
  VALIDATE_FAIL,
} from '../constants';

const validateField = (form, name, touched = true) => {
  return (dispatch, getState) => {
    const field = getState().form[form][name];
    dispatch({
      type: VALIDATE_PENDING,
      payload: { form, name },
    });
    return new Promise((resolve, reject) => {
      Promise.all((field.validators || []).map(validator => {
        return Promise.resolve(validator(field.value));
      })).then(data => {
        const errors = data.filter(error => error !== undefined);
        if (errors.length) {
          dispatch(fail(form, name, errors[0], touched));
          reject(errors[0]);
        } else {
          dispatch({
            type: VALIDATE_SUCCESS,
            payload: { form, name, touched },
          });
          resolve();
        }
      }).catch(err => reject(err));
    });
  };
};

const init = (form, name, value, validators) => {
  return (dispatch) => {
    return dispatch({
      type: INIT,
      payload: { form, name, value, validators },
    });
  };
};

const change = (form, name, value, touched) => {
  return (dispatch) => {
    dispatch({
      type: CHANGE,
      payload: { form, name, value, touched },
    });
    return dispatch(validateField(form, name, touched)).then(() => {}).catch(() => {});
  };
};

const touch = (form, name) => {
  return (dispatch) => {
    dispatch({
      type: TOUCH,
      payload: { form, name },
    });
    return dispatch(validateField(form, name)).then(() => {}).catch(() => {});
  };
};

const destroy = (form, name) => {
  return (dispatch) => {
    return dispatch({
      type: DESTROY,
      payload: { form, name },
    });
  };
};

const validate = (form, touched = true) => {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      Promise.all(getFormFields(getState(), form).map(field => {
        return dispatch(validateField(form, field.name, touched));
      })).then(data => {
        const state = getState();
        if (!isFormValid(state, form)) {
          reject(data);
        } else {
          resolve(serialize(state, form));
        }
      }).catch(() => reject(false));
    });
  };
};

const fail = (form, name, error, touched) => (dispatch) => {
  return dispatch({
    type: VALIDATE_FAIL,
    payload: { form, name, error, touched },
  });
};

export {
  init,
  change,
  touch,
  destroy,
  validate,
  validateField,
  fail,
};
