// import { createServer, Response } from 'miragejs'
// import { v4 as uuidv4 } from 'uuid'
const fakeServer = ()=>{}
// const fakeServer = () => {
//   return createServer({
//     routes() {
//       this.post('/api/v1/login', (schema, request) => {
//         const requestData = JSON.parse(request.requestBody)
//         const { username, password } = requestData

//         // error
//         const errLogin = () => {
//           return new Response(
//             401,
//             {},
//             {
//               code: 'WRONG_LOGIN_AUTH',
//               msg: 'Your user ID or password is incorrect.',
//             }
//           )
//         }

//         // response
//         switch (username) {
//           case 'admin':
//           case 'admin@gmail.com':
//           case '3cd8585c-e551-40df-92ed-507cfd76c8ad':
//             return password === '1234567890'
//               ? {
//                   uuid: '3cd8585c-e551-40df-92ed-507cfd76c8ad',
//                   userId: 'admin',
//                   email: 'admin@gmail.com',
//                   status: '',
//                 }
//               : errLogin()
//           case 'admin2':
//           case 'admin2@gmail.com':
//           case '7d3f71c2-4efa-4509-a8e2-3b623c1ee17a':
//             return password === '1234567890'
//               ? {
//                   uuid: '7d3f71c2-4efa-4509-a8e2-3b623c1ee17a',
//                   userId: 'admin2',
//                   email: 'admin2@gmail.com',
//                   status: 'CHANGED_EMAIL',
//                 }
//               : errLogin()
//           case 'admin3':
//           case 'admin3@gmail.com':
//           case 'a2ceb3b8-81e6-48b2-869e-81cb5627aa5e':
//             return password === '1234567890'
//               ? {
//                   uuid: 'a2ceb3b8-81e6-48b2-869e-81cb5627aa5e',
//                   userId: 'admin3',
//                   email: 'admin3@gmail.com',
//                   status: 'TEMP_PASSWORD',
//                 }
//               : errLogin()
//         }

//         // unexpected error
//         return errLogin()
//       })
//       this.post('/api/v1/create/check', (schema, request) => {
//         const requestData = JSON.parse(request.requestBody)
//         const { userId, email } = requestData

//         // response
//         if (userId === 'admin' || userId === 'admin2' || userId === 'admin3') {
//           return new Response(
//             409,
//             {},
//             {
//               code: 'WRONG_AUTH',
//               msg: 'User ID existed. Please try another one.',
//             }
//           )
//         } else if (
//           email === 'admin@gmail.com' ||
//           email === 'admin2@gmail.com' ||
//           email === 'admin3@gmail.com'
//         ) {
//           return new Response(
//             409,
//             {},
//             {
//               code: 'WRONG_AUTH',
//               msg: 'Email existed. Please try to login.',
//             }
//           )
//         } else {
//           return new Response(200, {}, {})
//         }
//       })
//       this.post('/api/v1/create', (schema, request) => {
//         return new Response(200, {}, {})
//       })
//       this.post('/api/v1/password/recover', (schema, request) => {
//         const requestData = JSON.parse(request.requestBody)
//         const { username } = requestData

//         if (
//           username === 'admin' ||
//           username === 'admin2' ||
//           username === 'admin3' ||
//           username === 'admin@gmail.com' ||
//           username === 'admin2@gmail.com' ||
//           username === 'admin3@gmail.com'
//         ) {
//           return new Response(200, {}, {})
//         } else {
//           return new Response(
//             401,
//             {},
//             {
//               code: 'AUTH_NOT_FOUND',
//               msg: 'The user ID or password is not found.',
//             }
//           )
//         }
//       })
//       this.get(
//         '/api/v1/password/temp/3cd8585c-e551-40df-92ed-507cfd76c8ad',
//         (schema, request) => {
//           return new Response(
//             200,
//             {},
//             {
//               userId: 'admin',
//               tempPassword: 'J35K4558HG',
//             }
//           )
//         }
//       )
//       this.post('/api/v1/contact', (schema, request) => {
//         // response
//         return new Response(200, {}, {})
//       })

//       this.get('/api/v1/option/industry', (schema, request) => {
//         return new Response(200, {}, [
//           {
//             value: 'INDUSTRY_A',
//             name: 'IndustryA',
//           },
//           {
//             value: 'INDUSTRY_B',
//             name: 'IndustryB',
//           },
//           {
//             value: 'INDUSTRY_C',
//             name: 'IndustryC',
//           },
//         ])
//       })
//       this.get('/api/v1/option/level', (schema, request) => {
//         return new Response(200, {}, [
//           {
//             value: 'LEVEL_1',
//             name: 'level1',
//           },
//           {
//             value: 'LEVEL_2',
//             name: 'level2',
//           },
//           {
//             value: 'LEVEL_3',
//             name: 'level3',
//           },
//         ])
//       })
//     },
//   })
// }
// const globalError = (httpCode: number) => {
//   switch (httpCode) {
//     case 400:
//     default:
//       return new Response(
//         httpCode,
//         {},
//         {
//           code: 'UNEXPECTED_ERROR',
//           msg: 'Unexpected error 400.',
//         }
//       )
//   }
// }
export default fakeServer
