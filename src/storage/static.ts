// Globally but updated only once time
export default class StaticService {
  static apiUrl: string = `${
    process.env.REACT_APP_ENV === 'PROD'
      ? window.location.origin
      : process.env.REACT_APP_API_URL // TODO local?
  }${process.env.REACT_APP_API_VERSION}`

  static countryCodeOption: any = [
    { country: '台灣', code: '+886' },
    { country: '英國', code: '+44' },
    { country: '芬蘭', code: '+358' },
    { country: '荷蘭', code: '+31' },
    { country: '挪威', code: '+47' }
  ]

  static msgFrontend: any = {
    loginSuccessfully: 'Login successfully',
    signUpCheckUserId: 'User ID existed. Please try another one.',
    signUpCheckEmail: 'Email existed. Please try to login.'
  }

  static placeholder: any = {
    input: 'Please input',
    password: '****************',
    select: 'Please select',
    SearchUserID: 'Search User ID'
  }

  static format: any = {
    date: 'YYYY/MM/DD'
  }

  static uploadFailedMsg: string = 'Upload failed.'
  static uploadImgMaxSize: number = 5000000 //bytes
  static uploadImgTimeout: number = 60000 //ms
  static uploadVideoMaxSize: number = 300000000 //bytes
  static uploadVideoTimeout: number = 120000 //ms

  // TODO 等著拿掉
  static tablePageSize: number = 10
  static deviceType: { A: string; B: string } = {
    A: 'textA',
    B: 'textB'
  }
  static chapterContentType: any = {
    title: 'title',
    picture: 'picture',
    video: 'video',
    paragraph: 'paragraph'
  }
}
