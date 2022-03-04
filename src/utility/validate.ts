const isEngInt = /^[A-Za-z0-9]+$/
const isEmailEngIntSymbol = /^[A-Za-z0-9.@]+$/
const isEmail = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/
const isInt = /^[0-9]+$/

const isSymbol = /[-=/()_+{}[\]`~|:;*&^%$#@<>$\\.]/
const isSymbolStrict = /[-=/()_+{}[\]`~|*&^%$#@<>$]/
// const isUserName = /^[A-Za-z0-9@.]+$/

export function ValidateStr(type: string, value: string) {
  switch (type) {
    case 'isEngInt':
      return !isEngInt.test(value)
    case 'isEmailEngIntSymbol':
      return !isEmailEngIntSymbol.test(value)
    case 'isEmail':
      return isEmail.test(value)
    case 'isInt':
      return isInt.test(value)
    case 'isNoSymbol':
      return isSymbol.test(value)
    case 'isSymbolStrict':
      return isSymbolStrict.test(value)
    // case 'isUserName':
    //   return isUserName.test(value)
    default:
      return false
  }
}
export const schema: any = {
  user_id: {
    info: 'User ID is your unique identifier as a member in AIR academy',
    max: 50,
    validateStr: (val: any) => ValidateStr('isEngInt', val)
  },
  password: {
    info: 'At least 8 characters. A mixture of letters and numbers.',
    info2: 'Please confirm by typing password again.',
    min: 8,
    max: 16,
    validateStr: (val: any) => ValidateStr('isEngInt', val),
    errTooShort: 'Password is too short',
    errNotMatch: 'Passwords do not match.'
  },
  email: {
    info: 'Please enter the authorized email.',
    max: 200,
    validateStr: (val: any) => ValidateStr('isEmailEngIntSymbol', val),
    validateFormat: (val: any) => ValidateStr('isEmail', val),
    errFormat: 'The Email format is not correct.'
  },
  name: {
    max: 100,
    validateStr: (val: any) => ValidateStr('isNoSymbol', val)
  },
  position: {
    max: 200,
    validateStr: (val: any) => ValidateStr('isNoSymbol', val)
  },
  current_company: {
    max: 200,
    validateStr: (val: any) => ValidateStr('isNoSymbol', val)
  },
  purchase_number: {
    max: 50,
    validateStr: (val: any) => ValidateStr('isEngInt', val)
  },
  quata: {
    min: 1,
    max: 100,
    validateStr: (val: any) => ValidateStr('isInt', val)
  },
  course_name: {
    max: 50,
    validateStr: (val: any) => ValidateStr('isNoSymbol', val)
  },
  section_name: {
    max: 50,
    validateStr: (val: any) => ValidateStr('isNoSymbol', val)
  },
  description: {
    max: 200,
    validateStr: (val: any) => ValidateStr('isSymbolStrict', val)
  },

  xxx1: {
    validateStr: (val: any) => ValidateStr('isNoSymbol', val)
  },
  xxx2: {
    validateStr: (val: any) => ValidateStr('isNoSymbol', val)
  }
}
export default schema
