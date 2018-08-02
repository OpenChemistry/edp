export function validationFactory(fields) {

  return function validation(values) {
    let errors = {};
    for (let name in fields) {
      let val = values[name];
      if (fields[name].validate) {
        for (let fn of fields[name].validate) {
          let err = fn(val);
          if (err) {
            errors[name] = err;
            break;
          }
        }
      }
    }
    return errors;
  }

}

export let required = (val) => {
  let msg = '* field is required'
  if (!val) {
    return msg
  }
  if (val === '') {
    return msg
  } 
  return null;
}
