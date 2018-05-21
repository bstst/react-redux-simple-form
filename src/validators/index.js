const required = (value, message = 'Required') => {
  return (value instanceof Array ? value.length : value) ? undefined : message;
};

export {
  required,
};
