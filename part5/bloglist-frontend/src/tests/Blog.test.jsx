import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from '../components/Blog'

describe('<Blog />', () => {
  let container
  const addLike = vi.fn() 
  const removeBlog = vi.fn()

  const blog = {
    title: 'Test Blog',
    url: 'https://testblog.com',
    likes: 0,
    author: 'me'
  }

  beforeEach(() => {
    container = render(<Blog blog={blog} addLike={addLike} removeBlog={removeBlog}/>).container
  })

  test('renders title', () => {
    const element = screen.getByText('Test Blog')
    expect(element).toBeDefined()
  })
  
  test('other text is not displayed', () => {
    const div = container.querySelector('.togglableContent')
    expect(div).not.toBeInTheDocument()

    // The 'View' button should be displayed
    const viewButton = screen.getByText('View')
    expect(viewButton).toBeInTheDocument()
  })

  test('other text is displayed on click', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('View')
    await user.click(button)

    const div = container.querySelector('.togglableContent')
    expect(div).toBeInTheDocument()

    const hideButton = screen.getByText('Hide')
    expect(hideButton).toBeInTheDocument()
  })

  test('like twice',async () => {
    
    const user = userEvent.setup()
    const viewButton = screen.getByText('View')
    await user.click(viewButton)
    const likeButton = screen.getByText('Like')
    await user.click(likeButton)
    await user.click(likeButton)

    const div = container.querySelector('.togglableContent')
    expect(div).toBeInTheDocument()

    const hideButton = screen.getByText('Hide')
    expect(hideButton).toBeInTheDocument()

    expect(addLike.mock.calls).toHaveLength(2)
  })
})

