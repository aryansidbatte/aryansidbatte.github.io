import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProjectModal from '../src/components/ProjectModal'
import type { Project } from '../src/content/projects'

const mockProject: Project = {
  id: 'test-project',
  title: 'Test Project',
  description: 'A test project description.',
  outcome: 'The outcome was good.',
  stack: ['React', 'TypeScript'],
  github: 'https://github.com/test/test',
  featured: false,
}

describe('ProjectModal', () => {
  it('renders nothing when no project is selected', () => {
    const { container } = render(
      <ProjectModal project={null} onClose={() => {}} />
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('renders modal when project is provided', () => {
    render(<ProjectModal project={mockProject} onClose={() => {}} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Test Project')).toBeInTheDocument()
    expect(screen.getByText('The outcome was good.')).toBeInTheDocument()
  })

  it('shows all stack tags', () => {
    render(<ProjectModal project={mockProject} onClose={() => {}} />)
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
  })

  it('shows GitHub link', () => {
    render(<ProjectModal project={mockProject} onClose={() => {}} />)
    const link = screen.getByRole('link', { name: /github/i })
    expect(link).toHaveAttribute('href', 'https://github.com/test/test')
  })

  it('does not show demo link when demo is undefined', () => {
    render(<ProjectModal project={mockProject} onClose={() => {}} />)
    expect(screen.queryByRole('link', { name: /live demo/i })).not.toBeInTheDocument()
  })

  it('shows demo link when demo is provided', () => {
    const projectWithDemo = { ...mockProject, demo: 'https://demo.example.com' }
    render(<ProjectModal project={projectWithDemo} onClose={() => {}} />)
    expect(screen.getByRole('link', { name: /live demo/i })).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<ProjectModal project={mockProject} onClose={onClose} />)
    await user.click(screen.getByRole('button', { name: /close/i }))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose when ESC is pressed', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<ProjectModal project={mockProject} onClose={onClose} />)
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose when backdrop is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<ProjectModal project={mockProject} onClose={onClose} />)
    await user.click(screen.getByTestId('modal-backdrop'))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('has aria-modal and role=dialog', () => {
    render(<ProjectModal project={mockProject} onClose={() => {}} />)
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
  })

  it('focuses close button when modal opens', () => {
    render(<ProjectModal project={mockProject} onClose={() => {}} />)
    expect(screen.getByRole('button', { name: /close/i })).toHaveFocus()
  })

  it('locks body scroll when open and restores on close', () => {
    const { rerender } = render(<ProjectModal project={mockProject} onClose={() => {}} />)
    expect(document.body.style.overflow).toBe('hidden')
    rerender(<ProjectModal project={null} onClose={() => {}} />)
    expect(document.body.style.overflow).toBe('')
  })
})
