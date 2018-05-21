const getForm = (state, form) => {
  return state.form[form] || {};
};

const getFormFields = (state, form) => {
  return Object.values(getForm(state, form));
};

const isFormPending = (state, form) => {
  return !!getFormFields(state, form).filter(field => field.pending).length;
};

const isFormValid = (state, form) => {
  return !getFormFields(state, form).filter(field => field.error !== '').length;
};

const serialize = (state, form) => {
  return getFormFields(state, form).reduce((acc, field) => {
    return {...acc, [field.name]: field.value};
  }, {});
};

export {
  getForm,
  getFormFields,
  isFormPending,
  isFormValid,
  serialize,
};
