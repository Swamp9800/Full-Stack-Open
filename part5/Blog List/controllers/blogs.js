const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogRouter.get('/', async (req, res) => {
  const blog = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  res.json(blog)
})

blogRouter.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id)
  if (blog) {
    res.status(200).json(blog)
  } else {
    res.status(404).end()
  }
})

blogRouter.post('/', middleware.userExtractor, async (request, res) => {
  const body = request.body

  const user = request.user

  if (!user) {
    return res.status(400).json({ error: 'User not authenticated' })
  }

  const blog = new Blog ({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id,
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  const populatedBlog = await Blog.findById(savedBlog._id).populate('user', { username: 1, name: 1 })

  res.status(201).json(populatedBlog)

})

blogRouter.delete('/:id', middleware.userExtractor, async (req, res) => {
  const user = req.user

  const blog = await Blog.findById(req.params.id)
  if (!blog) {
    return res.status(404).json({ error: 'blog not found' })
  }

  if (blog.user.toString() !== user.id.toString()) {
    return res.status(403).json({ error: 'you do not have permission to delete this blog' })
  }

  await Blog.findByIdAndDelete(req.params.id)

  res.status(204).end()
})

blogRouter.put('/:id', async (req, res) => {
  const { title, author, url, likes } = req.body

  const updatedBlog = await Blog.findByIdAndUpdate(
    req.params.id,
    { title, author, url, likes },
    { new: true, runValidators: true, context: 'query' }
  )

  if (updatedBlog) {
    res.status(200).json(updatedBlog)
  } else {
    res.status(404).end()
  }
})


module.exports = blogRouter