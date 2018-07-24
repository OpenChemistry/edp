export let required = (val) => {
  if (val === '') {
    return 'Field is required'
  } 
  return '';
}
