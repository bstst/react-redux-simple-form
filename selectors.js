export const getForm = (state, form) => {
  return state.form[form] || {};
};

export const getFormFields = (state, form) => {
  return Object.values(getForm(state, form));
};

export const isFormPending = (state, form) => {
  return !!getFormFields(state, form).filter(field => field.pending).length;
};

export const isFormValid = (state, form) => {
  return !getFormFields(state, form).filter(field => field.error !== '').length;
};

export const serialize = (state, form) => {
  return getFormFields(state, form).reduce((acc, field) => {
    return {...acc, [field.name]: field.value};
  }, {});
};
