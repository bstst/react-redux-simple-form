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
      Promise.all((field.validate || []).map(validator => {
        return Promise.resolve(validator(field.value));
      })).then(data => {
        const errors = data.filter(error => error !== undefined);
        if (errors.length) {
          dispatch({
            type: VALIDATE_FAIL,
            payload: { form, name, error: errors[0], touched },
          });
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

const init = (props = {}) => {
  return (dispatch) => {
    const { form, name, validate, value } = props;
    return dispatch({
      type: INIT,
      payload: { form, name, validate, value },
    });
  };
};

const change = (form, name, value, touched) => {
  return (dispatch) => {
    dispatch({
      type: CHANGE,
      payload: { form, name, value, touched },
    });
    return dispatch(validateField(form, name)).then(() => {}).catch(() => {});
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

export {
  init,
  change,
  touch,
  destroy,
  validate,
  validateField,
};