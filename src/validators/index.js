const required = (message = 'Required') => (value) => {
  return (value instanceof Array ? value.length : value) ? undefined : message;
};

export {
  required,
};
