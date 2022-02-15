const isEngInt = /^[A-Za-z0-9]+$/
const isEmailEngIntSymbol = /^[A-Za-z0-9.@]+$/
const isEmail = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/

const isInt = /^[0-9]+$/
const isSymbol = /[-=/()_+{}[\]`~|:;*&^%$#@<>$\\]/
const isUserName = /^[A-Za-z0-9@.]+$/

export function ValidateStr(type: string, value: string) {
  switch (type) {
    case 'isEngInt':
      return !isEngInt.test(value)
    case 'isEmailEngIntSymbol':
      return !isEmailEngIntSymbol.test(value)
    case 'isEmail':
      return isEmail.test(value)
    // case 'isInt':
    //   return isInt.test(value)
    // case 'isSymbol':
    //   return isSymbol.test(value)
    // case 'isUserName':
    //   return isUserName.test(value)
    default:
      return false
  }
}

export const schema: any = {
  user_id: {
    max: 50,
    validateStr: (val: any) => ValidateStr('isEngInt', val)
  },
  password: {
    min: 8,
    max: 16,
    validateStr: (val: any) => ValidateStr('isEngInt', val)
  },
  email: {
    max: 200,
    validateStr: (val: any) => ValidateStr('isEmailEngIntSymbol', val),
    validateFormat: (val: any) => ValidateStr('isEmail', val)
  }
}
export default schema
