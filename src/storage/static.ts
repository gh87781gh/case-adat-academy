// Globally but updated only once time
export default class StaticService {
  static apiUrl: string = `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_VERSION}`
  static tablePageSize: number = 15
  static deviceType: { A: string; B: string } = {
    A: 'textA',
    B: 'textB'
  }
}
