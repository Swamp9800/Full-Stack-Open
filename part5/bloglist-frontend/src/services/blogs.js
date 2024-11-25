import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token },
  }
  console.log(config)
  const response = await axios.post(baseUrl, newObject, config)
  console.log(response)
  return response.data
}

const update = async (id, newObject) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token },
  }
  console.log(config)
  const response = await axios.put(`${baseUrl}/${id}`, newObject, config)
  console.log(response)
  return response.data
}

const remove = async (id) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token },
  }
  console.log(config)
  const response = await axios.delete(`${baseUrl}/${id}`, config)
  console.log(response)
  return response.data
}

export default {
  getAll,
  create,
  setToken,
  update,
  remove,
}