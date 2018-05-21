import { getFormFields, isFormValid, serialize } from './selectors';

export const prefix = '@@react-redux-simple-form';

const name = (key) => `${prefix}/${key}`;

export const INIT = name('INIT');
export const FOCUS = name('FOCUS');
export const BLUR = name('BLUR');
export const TOUCH = name('TOUCH');
export const UNTOUCH = name('UNTOUCH');
export const CHANGE = name('CHANGE');
export const DESTROY = name('DESTROY');
export const VALIDATE_PENDING = name('VALIDATE_PENDING');
export const VALIDATE_SUCCESS = name('VALIDATE_SUCCESS');
export const VALIDATE_FAIL = name('VALIDATE_FAIL');
export const SUBMIT = name('SUBMIT');

export const validateField = (form, name, touched = true) => {
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

export const init = (props = {}) => {
  return (dispatch) => {
    const { form, name, validate, value } = props;
    return dispatch({
      type: INIT,
      payload: { form, name, validate, value },
    });
  };
};

export const change = (form, name, value, touched) => {
  return (dispatch) => {
    dispatch({
      type: CHANGE,
      payload: { form, name, value, touched },
    });
    return dispatch(validateField(form, name)).then(() => {}).catch(() => {});
  };
};

export const touch = (form, name) => {
  return (dispatch) => {
    dispatch({
      type: TOUCH,
      payload: { form, name },
    });
    return dispatch(validateField(form, name)).then(() => {}).catch(() => {});
  };
};

export const destroy = (form, name) => {
  return (dispatch) => {
    return dispatch({
      type: DESTROY,
      payload: { form, name },
    });
  };
};

export const validate = (form, touched = true) => {
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
