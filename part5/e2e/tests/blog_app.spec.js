const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'luuk',
        username: 'tester',
        password: 'test'
      }
    })
    await request.post('/api/users', {
      data: {
        name: 'luuk',
        username: 'tester2',
        password: 'test'
      }
    })
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = await page.getByText('Bloglist App')
    await expect(locator).toBeVisible()
    await expect(page.getByText('Log in to application')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'tester', 'test')
      await expect(page.getByText('luuk logged-in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'tester', 'wrong')
      await expect(page.getByText('luuk logged-in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'tester', 'test')
    })

    describe('Blog functions', () => {
      beforeEach(async ({ page}) =>{
        await createBlog(page, 'test title', 'test author', 'test url')
      })

      test('a new blog can be created', async ({ page }) => {
        await expect(page.locator('.toggleOff')).toContainText('test titleView')
      })
  
      test('a blog can be liked', async ({page }) => {
        await page.getByRole('button', { name: 'View' }).click()
        await page.getByRole('button', { name: 'Like' }).click()

        const likes = await page.locator('.likes')
        await expect(likes).toContainText('1')
      })

      test('a blog can be removed by the correct user', async ({ page }) => {
        page.on('dialog', async (dialog) => {
          await dialog.accept() 
        });

        await page.getByRole('button', { name: 'View' }).click()
        await page.getByRole('button', { name: 'remove' }).click()

        const text = page.locator('.togglableContent')
        await expect(text).toHaveCount(0)
      })

      test('blog cannot be removed by other user', async ({ page }) => {
        await page.getByRole('button', { name: 'Logout' }).click()
        await loginWith(page, 'tester2', 'test')
        await expect(page.getByText('remove')).not.toBeVisible()
      })

      describe('Blog sorting', () =>  {
        beforeEach(async ({ page }) => {
          await createBlog(page, 'second note', 'by', 'likes')
        })

        test('sorting on like works', async ({ page }) => {
          await expect(page.locator('.toggleOff >> nth=1')).toContainText('second note')
          const firstNote = page.locator('text=test titleView')
          const secondNote = page.locator('text=second noteView')
          await expect(secondNote).toBeVisible()

          const firstNotePositionBefore = await firstNote.boundingBox()
          const secondNotePositionBefore = await secondNote.boundingBox()
          expect(firstNotePositionBefore.y).toBeLessThan(secondNotePositionBefore.y)

          await page.getByText('second noteView')
            .locator('..')
            .getByRole('button', { name: 'View'})
            .click()
          const button = await page.getByText('0Like')
            .locator('..')
            .getByRole('button', { name: 'Like'})
          await button.click()
          await button.click()

          const firstNoteAfter = page.locator('text=test titleView')
          const secondNoteAfter = page.locator('text=second noteHide')

          const firstNotePositionAfter = await firstNoteAfter.boundingBox()
          const secondNotePositionAfter = await secondNoteAfter.boundingBox()

          expect(secondNotePositionAfter.y).toBeLessThan(firstNotePositionAfter.y)
        })
      })
    })
    
  })
})