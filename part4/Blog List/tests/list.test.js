const { test, describe, after, beforeEach } = require('node:test')
const Blog = require('../models/blog')
const assert = require('node:assert')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const listHelper = require('../utils/list_helper')



describe('when there are initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    await Blog.insertMany(helper.initialBlogs)
  })

  test('all blogs', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('specific blog using id, not _id', async () => {
    const blogs = await helper.blogsInDb()

    const specificBlog = blogs[0]

    const resultBlog = await api
      .get(`/api/blogs/${specificBlog.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.deepStrictEqual(resultBlog.body, specificBlog)
  })

  describe('addition of a new blog', () => {
    test('Post request works', async () => {
      const newBlog = {
        title: 'new note addition',
        author: 'rin phos',
        url: 'discord.gg',
        likes: 647,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length+1)

      const titles = blogsAtEnd.map(n => n.title)
      assert(titles.includes('new note addition'))
    })

    test('Likes default to 0', async () => {
      const newBlog = {
        title: 'new note addition',
        author: 'rin phos',
        url: 'discord.gg',
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length+1)

      const returnedBlog = blogsAtEnd[blogsAtEnd.length-1]
      assert(returnedBlog.likes === 0)
    })

    test('title missing = 400 bad request', async () => {
      const newBlog = {
        author: 'rin phos',
        url: 'discord.gg',
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('url missing = 400 bad request', async () => {
      const newBlog = {
        title: 'new note addition',
        author: 'rin phos',
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })
  describe('deletion of note', () => {
    test('Deletion of blog succeeds with code 204', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      const titles = blogsAtEnd.map(b => b.title)
      assert(!titles.includes(blogToDelete.title))

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })
  })

  describe('Updating blogs', () => {
    test('Blog update succeeds with status code 200', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const updatedBlog = {
        title: 'update',
        author: 'me',
        url: 'cool',
        likes: 5,
      }

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)

      const blogsAtEnd = await helper.blogsInDb()

      const updatedBlogFromDb = blogsAtEnd.find(b => b.id === blogToUpdate.id)

      assert(updatedBlogFromDb)
      assert.strictEqual(updatedBlogFromDb.title, updatedBlog.title)
      assert.strictEqual(updatedBlogFromDb.author, updatedBlog.author)
      assert.strictEqual(updatedBlogFromDb.url, updatedBlog.url)
    })

  })
  describe('List operations', () => {
    test('when list has many blogs, equals the likes of that', () => {
      const result = listHelper.totalLikes(helper.initialBlogs)
      assert.strictEqual(result, 36)
    })
    test('most likes', () => {
      const result = listHelper.maxLikes(helper.initialBlogs)
      assert.deepStrictEqual(result, helper.initialBlogs[2])
    })
    describe('Grouped by author', () => {
      test('most blogs', () => {
        const result = listHelper.mostBlogs(helper.initialBlogs)
        assert.deepStrictEqual(result, {
          author: 'Robert C. Martin',
          blogs: 3
        })
      })

      test('most likes', () => {
        const result = listHelper.mostLikes(helper.initialBlogs)
        assert.deepStrictEqual(result, {
          author: 'Edsger W. Dijkstra',
          likes: 17
        })
      })
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})