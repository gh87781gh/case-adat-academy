import { users, apiResTime } from '../support/constant'

const msg = {
  accountError: 'The Email format is not correct.',
  loginError: 'Your user ID or password is incorrect.'
}

// describe('Sign up flow', () => {
//   context('初次造訪Sign up頁面', () => {
//     it('點擊Sign up，應導向Sign up頁面，應可導回Log in頁面', () => {
//       cy.visit('/login')
//       cy.eventClick('Sign up')
//       cy.checkUrl('/login/signUp1')
//       cy.checkTitle('SIGN UP')
//     })
//     it('點擊Log in，應導回Log in頁面', () => {
//       cy.eventClick('Log in')
//       cy.checkUrl('/login')
//       cy.checkTitle('LOG IN')
//     })
//   })
//   context('填寫Sign up第一頁', () => {
//     it('正確填寫Sign up1，API檢查後應導向Sign up2', () => {
//       cy.eventClick('Sign up')
//       cy.eventType('User ID', users.test1.account)
//       cy.eventType('Password', users.test1.password)
//       cy.eventType('Password again', users.test1.password)
//       cy.eventType('Email', users.test1.email)
//       cy.eventClick('Next')
//       cy.checkUrl('/login/signUp2')
//     })
//     it('正確填寫Sign up2，', () => {
//       cy.eventType('Full name', users.test1.account)
//       cy.eventSelect('Industry', users.test1.industry)
//       cy.eventType('Position', users.test1.position)
//       cy.eventSelect('Experience level', users.test1.experience_level)
//       cy.eventType('Current Company', users.test1.company)
//       cy.eventCheck('SOP editing')
//       cy.eventCheck('AI training')
//       cy.eventClick('Sign up')
//       cy.checkUrl('/login/signUpConfirm')
//       cy.checkTitle('Confirmation needed')
//     })
//   })
//   context('登入test001信箱', () => {
//     it('登入test001信箱，應收到驗證信', () => {
//       cy.visit(
//         'https://accounts.google.com/v3/signin/identifier?dsh=S1879144514%3A1679557192270386&continue=https%3A%2F%2Fwww.google.com%2F&ec=GAZAmgQ&hl=zh-TW&ifkv=AQMjQ7QGQsmNhUEnQ4TajmtauwuCJfJ74qZP_olRW0NDaL7ZRIrM6JkXpw54AjyNDNT3On2965lGpw&passive=true&flowName=GlifWebSignIn&flowEntry=ServiceLogin'
//       )
//       cy.get('[name="identifier"]').type('123')
//     })
//   })
// })

describe('Login page', () => {
  context('Login flow', () => {
    it('登入，輸入錯誤的admin account：應報錯', () => {
      cy.visit('/login')
      cy.eventType('User ID or Email', 'admin1234')
      cy.eventType('Password', users.admin.password)
      cy.eventClick('Log in')
      cy.wait(apiResTime)
      cy.checkLoginPrompt(msg.loginError)
      cy.eventType('User ID or Email', '')
      cy.eventType('Password', '')
    })
    it('登入，輸入錯誤的admin password：應報錯', () => {
      cy.visit('/login')
      cy.eventType('User ID or Email', users.admin.account)
      cy.eventType('Password', '123456')
      cy.eventClick('Log in')
      cy.wait(apiResTime)
      cy.checkLoginPrompt(msg.loginError)
      cy.eventType('User ID or Email', '')
      cy.eventType('Password', '')
    })
  })
  context('Sign up flow', () => {})
  // context('初次造訪登入頁面，localStorage 應清空', () => {
  //   it('造訪登入頁面，應顯示正確 page title', () => {
  //     cy.visit('/login', {
  //       onBeforeLoad(win) {
  //         if (win.localStorage.getItem('LOGIN_USERNAME'))
  //           win.localStorage.clear('LOGIN_USERNAME')
  //       }
  //     })
  //     cy.checkTitle('LOG IN')
  //   })
  //   // TODO 無憑證被導入此頁面
  //   // TODO 有憑證被導入此頁面
  //   // TODO 網址錯誤被導致此頁面
  // })
  // context('錯誤Log in', () => {
  //   it('輸入錯誤的帳號(email)，應報欄位錯誤，且 Log in 按鈕為不可點擊', () => {
  //     cy.visit('/login')
  //     cy.eventType('User ID or Email', 'admin12@gmail')
  //     cy.eventType('Password', users.admin.password)
  //     cy.checkBtnStatus('Log in', 'disabled')
  //     cy.checkFormAlert(
  //       'User ID or Email',
  //       'error',
  //       'The Email format is not correct.'
  //     )
  //     cy.visit('/')
  //   })
  //   it('輸入錯誤的帳號(user ID)，應報錯', () => {
  //     cy.visit('/login')
  //     cy.eventType('User ID or Email', 'admin1234')
  //     cy.eventType('Password', users.admin.password)
  //     cy.checkBtnStatus('Log in', 'enabled')
  //     cy.eventClick('Log in')
  //     cy.checkLoginPrompt(msg.loginError)
  //     cy.checkUrl('/login')
  //     cy.visit('/')
  //   })
  //   it('輸入錯誤的密碼，應報錯', () => {
  //     cy.visit('/login')
  //     cy.eventType('User ID or Email', users.admin.account)
  //     cy.eventType('Password', '123456')
  //     cy.eventClick('Log in')
  //     cy.checkLoginPrompt(msg.loginError)
  //     cy.checkUrl('/login')
  //     cy.visit('/')
  //   })
  // })
  // context('正確Log in', () => {
  //   it('輸入正確的帳號密碼，登入後，應顯示正確的登入成功訊息', () => {
  //     cy.visit('/login')
  //     cy.eventType('User ID or Email', users.admin.account)
  //     cy.eventType('Password', users.admin.password)
  //     cy.eventClick('Log in')
  //     cy.checkMessage('Login successfully')
  //     cy.checkUrl('/course')
  //   })
  //   it('回到登入頁面，account及password應為空', () => {
  //     cy.visit('/login')
  //     cy.get('label')
  //       .contains('User ID or Email')
  //       .parent('.aa-form-group')
  //       .find('.ant-input')
  //       .should('be.empty')
  //     cy.get('label')
  //       .contains('Password')
  //       .parent('.aa-form-group')
  //       .find('.ant-input')
  //       .should('be.empty')
  //   })
  //   it('勾選 Remember my user ID，登入成功', () => {
  //     cy.visit('/login')
  //     cy.eventCheck('Remember my user ID')
  //     cy.eventType('User ID or Email', users.admin.account)
  //     cy.eventType('Password', users.admin.password)
  //     cy.eventClick('Log in')
  //     cy.checkMessage('Login successfully')
  //     cy.checkUrl('/course')
  //   })
  //   it('回到登入頁面，account應有值，password應為空，account資料應被記錄至localStorage', () => {
  //     cy.visit('/login')
  //     cy.get('label')
  //       .contains('User ID or Email')
  //       .parent('.aa-form-group')
  //       .find('.ant-input')
  //       .invoke('val')
  //       .should('not.be.empty')
  //     cy.get('label')
  //       .contains('Password')
  //       .parent('.aa-form-group')
  //       .find('.ant-input')
  //       .invoke('val')
  //       .should('be.empty')
  //     cy.getAllLocalStorage().then((result) => {
  //       expect(result).to.deep.equal({
  //         'http://localhost:3000': {
  //           LOGIN_USERNAME: users.admin.account
  //         }
  //       })
  //     })
  //   })
  // })
})
