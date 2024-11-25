const _ = require('lodash')

const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum+item.likes
  }
  return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, 0)
}

const maxLikes = (blogs) => {
  const reducer = (accumulator, item) => {
    return item.likes > accumulator.likes ? item : accumulator
  }
  return blogs.length === 0
    ? null
    : blogs.reduce(reducer, blogs[0])
}

const mostBlogs = (blogs) => {
  const groupedByAuthor = _.groupBy(blogs, 'author')
  const authorsBlogCount = _.map(groupedByAuthor, (blogs, author) => ({
    author,
    blogs: blogs.length
  }))
  const topAuthor = _.maxBy(authorsBlogCount, 'blogs')

  return topAuthor || { author: null, blogs: 0 }
}

const mostLikes = (blogs) => {
  const groupedByAuthor = _.groupBy(blogs, 'author')

  const authorsLikeCount = _.map(groupedByAuthor, (blogs, author) => ({
    author,
    likes: _.sumBy(blogs, 'likes')
  }))
  const topAuthor = _.maxBy(authorsLikeCount, 'likes')

  return topAuthor || { author: null, blogs: 0 }
}

module.exports = {
  dummy,
  totalLikes,
  maxLikes,
  mostBlogs,
  mostLikes,
}