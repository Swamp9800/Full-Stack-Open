import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from '../components/BlogForm'

describe('<BlogForm />', () => {
  let container

  beforeEach(() => {
    container = vi.fn()
    render(<BlogForm createBlog={container} />)
  })

  test('creates new blog', async () => {
    const user = userEvent.setup()

    const titleInput = screen.getByLabelText(/Title/i)
    const authorInput = screen.getByLabelText(/author/i)
    const urlInput = screen.getByLabelText(/url/i)
    
    await user.type(titleInput, 'Testing a blog')
    await user.type(authorInput, 'me')
    await user.type(urlInput, 'none')

    const createButton = screen.getByText('create')
    await user.click(createButton)

    expect(container).toHaveBeenCalledWith({
      title: 'Testing a blog',
      author: 'me',
      url: 'none',
    })

    expect(titleInput.value).toBe('')
    expect(authorInput.value).toBe('')
    expect(urlInput.value).toBe('')
  })
})
