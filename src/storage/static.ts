// Globally but updated only once time
export default class StaticService {
  static apiUrl: string = `${
    process.env.REACT_APP_CUSTOM_HOSTNAME === 'true'
      ? window.location.origin
      : process.env.REACT_APP_API_URL
  }${process.env.REACT_APP_API_VERSION}`
  static tablePageSize: number = 10
  static uploadImgMaxSize: number = 5000000
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
  static countryCodeOption: any = [
    { country: '台灣', code: '+886' },
    { country: '英國', code: '+44' },
    { country: '芬蘭', code: '+358' },
    { country: '荷蘭', code: '+31' },
    { country: '挪威', code: '+47' }
  ]
}
