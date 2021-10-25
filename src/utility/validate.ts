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
