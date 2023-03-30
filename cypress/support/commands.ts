/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

// NOTE event
Cypress.Commands.add('eventClick', (content: string) => {
  cy.get('button').contains(content).click()
})
Cypress.Commands.add('eventCheck', (content: string) => {
  cy.get('.ant-checkbox-wrapper').contains(content).click()
})
Cypress.Commands.add('eventType', (target: string, content: string) => {
  if (content) {
    cy.get('label')
      .contains(target)
      .parent('.aa-form-group')
      .find('.ant-input')
      .type(content)
  } else {
    cy.get('label')
      .contains(target)
      .parent('.aa-form-group')
      .find('.ant-input')
      .clear()
  }
})
Cypress.Commands.add('eventSelect', (target: string, content: string) => {
  cy.get('label')
    .contains(target)
    .parent('.aa-form-group')
    .find('.ant-select')
    .click()
  cy.get('.ant-select-item').contains(content).click()
})

// NOTE check
Cypress.Commands.add('checkUrl', (url: string) => {
  cy.url().should('include', url)
})
Cypress.Commands.add('checkTitle', (title: string) => {
  cy.get('h1').should('include.text', title)
})
Cypress.Commands.add('checkMessage', (content: string) => {
  cy.get('.ant-message').should('contain.text', content)
})
Cypress.Commands.add('checkLoginPrompt', (content: string) => {
  cy.get('.aa-login-prompt').should('contain.text', content)
})
Cypress.Commands.add(
  'checkFormAlert',
  (target: string, type: string, content: string) => {
    cy.get('label')
      .contains(target)
      .parent('.aa-form-group')
      .get('.aa-form-group-msg')
      .should('contain.text', content)
      .should('have.class', type)
  }
)
Cypress.Commands.add('checkBtnStatus', (content: string, status: string) => {
  if (status === 'enabled') {
    cy.get('button')
      .contains(content)
      .parent('button')
      .should('have.not.attr', 'disabled')
  } else if (status === 'disabled') {
    cy.get('button')
      .contains(content)
      .parent('button')
      .should('have.attr', status)
  }
})

// NOTE special action
Cypress.Commands.add('login', (account: string, password: string) => {
  cy.get('[data-cy="login-account"]').find('.ant-input').type(account)
  cy.get('[data-cy="login-password"]').find('.ant-input').type(password)
})
