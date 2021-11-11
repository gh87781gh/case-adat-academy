// Globally but updated only once time
export default class StaticService {
  static apiUrl: string = `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_VERSION}`
  static tablePageSize: number = 10
  static uploadImgMaxSize: number = 5000000
  static deviceType: { A: string; B: string } = {
    A: 'textA',
    B: 'textB'
  }
}
