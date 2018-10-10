export const required = (val) => {
  let msg = '* field is required'
  if (!val) {
    return msg
  }
  if (val === '') {
    return msg
  } 
  return null;
}
