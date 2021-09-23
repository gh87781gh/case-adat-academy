const isEngInt = /^[A-Za-z0-9]+$/
const isInt = /[0-9]/
const isSymbol = /[-=/()_+{}[\]`~|:;*&^%$#@<>$\\]/
const isUserName = /^[A-Za-z0-9@.]+$/
const isEmail = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/

export function ValidateStr(type: string, value: string) {
  switch (type) {
    case 'isInt':
      return isInt.test(value)
    case 'isEngInt':
      return isEngInt.test(value)
    case 'isSymbol':
      return isSymbol.test(value)
    case 'isEmail':
      return isEmail.test(value)
    case 'isUserName':
      return isUserName.test(value)
    default:
      return false
  }
}

export const Validation = {
  input_placeholder: 'Clear hint for the input',
  input_name_max: 50,
  input_email_max: 200,
  errMsg_email_format_wrong: 'The Email format is not correct.',
  input_password_max: 16,
  input_password_min: 8,
  errMsg_password_not_match: 'Passwords do not match.',
  errMsg_password_tooShort: 'Password is too short' //TOCHECK
}
