describe('Testing blog application', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'APP USER 1',
      username: 'app-user-1',
      password: 'WERWWERWER-1'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('At first we see login-form', function() {
    cy.get('#username')
    cy.get('#password')
  })

  describe('Login tests',function() {
    it('We can login succesfully', function() {
      cy.get('#username').type('app-user-1')
      cy.get('#password').type('WERWWERWER-1')
      cy.contains('Login').click()

      cy.get('.success').should('contain', 'Login was successful')
      cy.get('.success').should('have.css', 'color', 'rgb(1, 61, 58)')
    })

    it('Login fails when it should and warning is displayed in red', function() {
      cy.get('#username').type('app-user-1')
      cy.get('#password').type('THIS-IS-NOT-CORRECT')
      cy.contains('Login').click()

      cy.get('.warning').should('contain', 'Could not login with given credentials')
      cy.get('.warning').should('have.css', 'color', 'rgb(136, 9, 26)')
    })
  })

  describe('Logged in', function() {
    beforeEach(function() {
      cy.login_user({ username: 'app-user-1', password: 'WERWWERWER-1' })
    })

    it('We can create a blog', function() {
      cy.contains('Add new blog').click()
      cy.get('#blog-form-title').type('Dance like a swan')
      cy.get('#blog-form-author').type('Dr. Susan Copper')
      cy.get('#blog-form-url').type('/lifestyle/inner-peace/movement-of-cosmos')
      cy.get('#blog-form-likes').type('120000000')
      cy.contains('Add blog').click()

      cy.get('.simple-container').should('contain', 'Dance like a swan')
    })

    it('We can add likes to a blog', function() {
      cy.create_blog({
        title: 'TEST-TITLE',
        author: 'TEST-AUTHOR',
        url: '/TEST-URL',
        likes: 1000
      })

      cy.get('.simple-container')
        .should('contain', 'TEST-TITLE')
        .contains('View').click()

      cy.get('.simple-container')
        .should('contain', 'TEST-TITLE')
        .contains('Like').click()

      cy.get('.simple-container')
        .should('contain', 'TEST-TITLE')
        .should('contain', '1001')
    })

    it('User who created blog can remove it', function() {
      cy.create_blog({
        title: 'TEST-TITLE',
        author: 'TEST-AUTHOR',
        url: '/TEST-URL',
        likes: 1000
      })

      cy.get('.simple-container')
        .should('contain', 'TEST-TITLE')
        .contains('View').click()

      cy.get('.simple-container')
        .should('contain', 'TEST-TITLE')
        .contains('Delete').click()
        .then(() => {
          cy.get('.simple-container')
            .should('not.exist')
        })
    })

    it('Blog can be deleted only by the user who created it', function() {
      cy.create_blog({
        title: 'CANNOT-BE-REMOVED-BY-ANOTHER-USER',
        author: 'TEST-AUTHOR',
        url: '/TEST-URL',
        likes: 1000
      })

      cy.get('.simple-container')
        .should('contain', 'CANNOT-BE-REMOVED-BY-ANOTHER-USER')
        .contains('View').click()

      cy.get('.simple-container')
        .should('contain', 'CANNOT-BE-REMOVED-BY-ANOTHER-USER')
        .should('contain', 'Delete')

      cy.contains('Logout').click()

      const user = {
        name: 'ANOTHER USER',
        username: 'app-user-2',
        password: 'WERWWERWER-2'
      }
      cy.request('POST', 'http://localhost:3003/api/users/', user)
      cy.visit('http://localhost:3000')

      cy.login_user({ username: 'app-user-2', password: 'WERWWERWER-2' })

      cy.get('.simple-container')
        .should('contain', 'CANNOT-BE-REMOVED-BY-ANOTHER-USER')
        .contains('View').click()
        .then(() => {
          cy.get('.simple-container')
            .should('contain', 'CANNOT-BE-REMOVED-BY-ANOTHER-USER')
            .should('not.contain', 'Delete')
        })
    })

    it('Blogs are ordered by likes', function() {
      const addLike = function(blog, amount, total) {
        cy.wrap(blog).contains('Like').click()
        total = total+1
        cy.wrap(blog).contains(total).then(() => {
          let subtracted = amount-1
          if(subtracted >= 1) addLike(blog, subtracted, total)
          else return true
        })
      }

      cy.create_blog({
        title: 'TEST-TITLE_1',
        author: 'TEST-AUTHOR_1',
        url: '/TEST-URL_1',
        likes: 1000
      })
      cy.create_blog({
        title: 'TEST-TITLE_2',
        author: 'TEST-AUTHOR_2',
        url: '/TEST-URL_2',
        likes: 1000
      })
      cy.create_blog({
        title: 'TEST-TITLE_3',
        author: 'TEST-AUTHOR_3',
        url: '/TEST-URL_3',
        likes: 1000
      })

      cy.get('.simple-container').eq(0).as('element1')
      cy.get('.simple-container').eq(1).as('element2')
      cy.get('.simple-container').eq(2).as('element3')

      cy.get('@element1').contains('View').click()
      cy.get('@element1').then(($element) => {
        addLike($element, 1, 1000)
      })

      cy.get('@element2').contains('View').click()
      cy.get('@element2').then(($element) => {
        addLike($element, 2, 1000)
      })

      cy.get('@element3').contains('View').click()
      cy.get('@element3').then(($element) => {
        addLike($element, 3, 1000)
      })

      cy.get('@element1').contains(1001)
      cy.get('@element2').contains(1002)
      cy.get('@element3').contains(1003)

      cy.get('.simple-container').eq(0).contains(1003)
      cy.get('.simple-container').eq(1).contains(1002)
      cy.get('.simple-container').eq(2).contains(1001)
    })
  })
})