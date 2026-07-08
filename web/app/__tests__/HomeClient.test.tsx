import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomeClient from '../components/HomeClient';

describe('HomeClient', () => {
  it('renders the version number', () => {
    render(<HomeClient />);
    expect(screen.getByText('v1.0.0')).toBeInTheDocument();
  });

  it('renders the CLI command', () => {
    render(<HomeClient />);
    expect(screen.getByText(/create-tcx-/)).toBeInTheDocument();
  });

  it('renders the docs link', () => {
    render(<HomeClient />);
    const docsLink = screen.getByRole('link', { name: /docs/i });
    expect(docsLink).toBeInTheDocument();
    expect(docsLink).toHaveAttribute('href', '/docs');
  });

  it('renders the "Create Now!" badge', () => {
    render(<HomeClient />);
    expect(screen.getByText('Create Now!')).toBeInTheDocument();
  });

  it('renders the full title across character spans', () => {
    const { container } = render(<HomeClient />);
    const titleContainer = container.querySelector('.text-3xl');
    expect(titleContainer).toBeInTheDocument();
    expect(titleContainer?.textContent).toContain('CreateYourBackendApp');
  });
});
