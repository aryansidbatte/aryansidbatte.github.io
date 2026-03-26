import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NavDrawer from '../src/components/NavDrawer'

describe('NavDrawer', () => {
  it('renders hamburger button', () => {
    render(<NavDrawer />)
    expect(screen.getByRole('button', { name: /open menu/i })).toBeInTheDocument()
  })

  it('drawer is closed by default', () => {
    render(<NavDrawer />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('opens drawer on hamburger click', async () => {
    const user = userEvent.setup()
    render(<NavDrawer />)
    await user.click(screen.getByRole('button', { name: /open menu/i }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Projects')).toBeInTheDocument()
    expect(screen.getByText('Skills')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()
  })

  it('closes drawer on close button click', async () => {
    const user = userEvent.setup()
    render(<NavDrawer />)
    await user.click(screen.getByRole('button', { name: /open menu/i }))
    await user.click(screen.getByRole('button', { name: /close menu/i }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes drawer on ESC key', async () => {
    const user = userEvent.setup()
    render(<NavDrawer />)
    await user.click(screen.getByRole('button', { name: /open menu/i }))
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
