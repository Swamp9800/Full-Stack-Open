const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(...params)
  } else {
    console.log('Test Log:', ...params)
  }
}

const error = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error(...params)
  } else {
    console.error('Test Error Log:', ...params)
  }
}

module.exports = {
  info, error
}