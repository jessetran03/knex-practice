const { expect } = require('chai')
const ArticlesService = require('../src/articles-service')
const knex = require('knex')

describe(`Articles service object`, function () {
  let db
  let testArticles = [
    {
      id: 1,
      date_published: new Date('2029-01-22T16:28:32.615Z'),
      title: 'First test post!',
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?'
    },
    {
      id: 2,
      date_published: new Date('2100-05-22T16:28:32.615Z'),
      title: 'Second test post!',
      content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, exercitationem cupiditate dignissimos est perspiciatis, nobis commodi alias saepe atque facilis labore sequi deleniti. Sint, adipisci facere! Velit temporibus debitis rerum.'
    },
    {
      id: 3,
      date_published: new Date('1919-12-22T16:28:32.615Z'),
      title: 'Third test post!',
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Possimus, voluptate? Necessitatibus, reiciendis? Cupiditate totam laborum esse animi ratione ipsa dignissimos laboriosam eos similique cumque. Est nostrum esse porro id quaerat.'
    },
  ]

  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
  })

  before(() => db('blogful_articles').truncate())

  afterEach(() => db('blogful_articles').truncate())

  after(() => db.destroy())

  context(`Given 'blogful_articles' has data`, () => {
    beforeEach(() => {
      return db
        .into('blogful_articles')
        .insert(testArticles)
    })

    it(`getAllArticles() resolves all articles from 'blogful_articles' table`, () => {
      // test that ArticleService.getAllArticles gets data from table
      return ArticlesService.getAllArticles(db)
        .then(actual => {
          expect(actual).to.eql(testArticles)
        })
    })
    
    it(`getById() resolves an article by id from 'blogful_articles' table`, () => {
      const thirdId = 3
      const thirdTestArticle = testArticles[thirdId - 1]
      return ArticlesService.getById(db, thirdId)
        .then(actual => {
          expect(actual).to.eql({
            id: thirdId,
            title: thirdTestArticle.title,
            content: thirdTestArticle.content,
            date_published: thirdTestArticle.date_published,
          })
        })
    })

    it(`deleteArticle() removes an article by id from 'blogful_articles' table`, () => {
      const articleId = 3
      return ArticlesService.deleteArticle(db, articleId)
        .then(() => ArticlesService.getAllArticles(db))
        .then(allArticles => {
          // copy the test articles array without the "deleted" article
          const expected = testArticles.filter(article => article.id !== articleId)
          expect(allArticles).to.eql(expected)
        })
    })

    it(`updateArticle() updates an article from the 'blogful_articles' table`, () => {
      const idOfArticleToUpdate = 3
      const newArticleData = {
        title: 'updated title',
        content: 'updated content',
        date_published: new Date(),
      }
      return ArticlesService.updateArticle(db, idOfArticleToUpdate, newArticleData)
        .then(() => ArticlesService.getById(db, idOfArticleToUpdate))
        .then(article => {
          expect(article).to.eql({
            id: idOfArticleToUpdate,
            ...newArticleData,
          })
        })
    })
  })

  context(`Given 'blogful_articles' has no data`, () => {
    it(`getAllArticles() resolves an empty array`, () => {
      return ArticlesService.getAllArticles(db)
        .then(actual => {
          expect(actual).to.eql([])
        })
    })

    it(`insertArticle() inserts an article and resolves the article with an 'id'`, () => {
      const newArticle = {
        title: 'Test new title',
        content: 'Test new content',
        date_published: new Date('2020-01-01T00:00:00.000Z'),
      }
      return ArticlesService.insertArticle(db, newArticle)
        .then(actual => {
          expect(actual).to.eql({
            id: 1,
            title: newArticle.title,
            content: newArticle.content,
            date_published: new Date(newArticle.date_published),
          })
        })
    })
    
  })
})