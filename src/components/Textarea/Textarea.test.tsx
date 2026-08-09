import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('renders label and textarea', () => {
    render(
      <Textarea label="Description" />,
    );

    expect(
      screen.getByRole('textbox', {
        name: 'Description',
      }),
    ).toBeInTheDocument();
  });

  it('associates label with textarea', () => {
    render(
      <Textarea label="Description" />,
    );

    const textarea = screen.getByRole('textbox', {
      name: 'Description',
    });

    expect(textarea.id).not.toBe('');

    expect(
      document.querySelector(
        `label[for="${textarea.id}"]`,
      ),
    ).toBeInTheDocument();
  });

  it('supports custom id', () => {
    render(
      <Textarea
        id="description"
        label="Description"
      />,
    );

    expect(
      screen.getByRole('textbox', {
        name: 'Description',
      }),
    ).toHaveAttribute('id', 'description');
  });

  it('generates unique ids for multiple textareas', () => {
    render(
      <>
        <Textarea label="Description" />
        <Textarea label="Comment" />
      </>,
    );

    const description = screen.getByRole(
      'textbox',
      {
        name: 'Description',
      },
    );

    const comment = screen.getByRole(
      'textbox',
      {
        name: 'Comment',
      },
    );

    expect(description.id).not.toBe('');
    expect(comment.id).not.toBe('');
    expect(description.id).not.toBe(comment.id);
  });

  it('supports custom className', () => {
    render(
      <Textarea
        label="Description"
        className="custom-textarea"
      />,
    );

    expect(
      screen.getByRole('textbox', {
        name: 'Description',
      }),
    ).toHaveClass(
      'fq-textarea',
      'custom-textarea',
    );
  });

  it('supports placeholder', () => {
    render(
      <Textarea
        label="Description"
        placeholder="Write something..."
      />,
    );

    expect(
      screen.getByPlaceholderText(
        'Write something...',
      ),
    ).toBeInTheDocument();
  });

  it('supports required state', () => {
    render(
      <Textarea
        label="Description"
        required
      />,
    );

    expect(
      screen.getByRole('textbox', {
        name: 'Description',
      }),
    ).toBeRequired();
  });

  it('supports disabled state', () => {
    render(
      <Textarea
        label="Description"
        disabled
      />,
    );

    expect(
      screen.getByRole('textbox', {
        name: 'Description',
      }),
    ).toBeDisabled();
  });

  it('supports readOnly state', () => {
    render(
      <Textarea
        label="Description"
        readOnly
      />,
    );

    expect(
      screen.getByRole('textbox', {
        name: 'Description',
      }),
    ).toHaveAttribute('readonly');
  });

  it('supports helper text', () => {
    render(
      <Textarea
        label="Description"
        helperText="Maximum 500 characters."
      />,
    );

    const textarea = screen.getByRole(
      'textbox',
      {
        name: 'Description',
      },
    );

    const message = screen.getByText(
      'Maximum 500 characters.',
    );

    expect(message).toBeInTheDocument();

    expect(textarea).toHaveAttribute(
      'aria-describedby',
      message.id,
    );
  });

  it('exposes error state', () => {
    render(
      <Textarea
        label="Description"
        error="Description is required."
      />,
    );

    const textarea = screen.getByRole(
      'textbox',
      {
        name: 'Description',
      },
    );

    const message = screen.getByText(
      'Description is required.',
    );

    expect(textarea).toHaveAttribute(
      'aria-invalid',
      'true',
    );

    expect(textarea).toHaveAttribute(
      'aria-describedby',
      message.id,
    );
  });

  it('prioritizes error message over helper text', () => {
    render(
      <Textarea
        label="Description"
        helperText="Maximum 500 characters."
        error="Description is required."
      />,
    );

    expect(
      screen.getByText(
        'Description is required.',
      ),
    ).toBeInTheDocument();

    expect(
      screen.queryByText(
        'Maximum 500 characters.',
      ),
    ).not.toBeInTheDocument();
  });

  it('preserves custom aria-describedby', () => {
    render(
      <Textarea
        label="Description"
        aria-describedby="custom-description"
      />,
    );

    expect(
      screen.getByRole('textbox', {
        name: 'Description',
      }),
    ).toHaveAttribute(
      'aria-describedby',
      'custom-description',
    );
  });

  it('supports ReactNode label', () => {
    render(
      <Textarea
        label={
          <>
            Description <strong>details</strong>
          </>
        }
      />,
    );

    expect(
      screen.getByText('details'),
    ).toBeInTheDocument();
  });

  it('supports ReactNode helper text', () => {
    render(
      <Textarea
        label="Description"
        helperText={
          <>
            Maximum <strong>500</strong> characters.
          </>
        }
      />,
    );

    expect(
      screen.getByText('500'),
    ).toBeInTheDocument();
  });

  it('supports ReactNode error', () => {
    render(
      <Textarea
        label="Description"
        error={
          <>
            Description is invalid.{' '}
            <a href="/help">Learn more</a>
          </>
        }
      />,
    );

    expect(
      screen.getByRole('link', {
        name: 'Learn more',
      }),
    ).toBeInTheDocument();
  });

  it('forwards ref to the native textarea', () => {
    const ref = createRef<HTMLTextAreaElement>();

    render(
      <Textarea
        label="Description"
        ref={ref}
      />,
    );

    expect(ref.current).toBe(
      screen.getByRole('textbox', {
        name: 'Description',
      }),
    );
  });

  it('supports ReactNode label', () => {
    render(
      <Textarea
        label={
          <>
            Description <strong>details</strong>
          </>
        }
      />,
    );

    expect(
      screen.getByText('details'),
    ).toBeInTheDocument();
  });

  it('supports ReactNode helper text', () => {
    render(
      <Textarea
        label="Description"
        helperText={
          <>
            Maximum <strong>500</strong> characters.
          </>
        }
      />,
    );

    expect(
      screen.getByText('500'),
    ).toBeInTheDocument();
  });

  it('supports ReactNode error', () => {
    render(
      <Textarea
        label="Description"
        error={
          <>
            Description is required.{' '}
            <a href="/help">Learn more</a>
          </>
        }
      />,
    );

    expect(
      screen.getByRole('link', {
        name: 'Learn more',
      }),
    ).toBeInTheDocument();
  });

  it('forwards ref to the native textarea', () => {
    const ref = {
      current: null,
    } as {
      current: HTMLTextAreaElement | null;
    };

    render(
      <Textarea
        ref={ref}
        label="Description"
      />,
    );

    expect(ref.current).toBe(
      screen.getByRole('textbox', {
        name: 'Description',
      }),
    );
  });

  it('forwards onChange event', () => {
    const handleChange = vi.fn();

    render(
      <Textarea
        aria-label="Description"
        onChange={handleChange}
      />,
    );

    fireEvent.change(
      screen.getByRole('textbox'),
      {
        target: {
          value: 'hello',
        },
      },
    );

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          value: 'hello',
        }),
      }),
    );
  });

  it('forwards onBlur event', () => {
    const handleBlur = vi.fn();

    render(
      <Textarea
        aria-label="Description"
        onBlur={handleBlur}
      />,
    );

    fireEvent.blur(screen.getByRole('textbox'));

    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('forwards onFocus event', () => {
    const handleFocus = vi.fn();

    render(
      <Textarea
        aria-label="Description"
        onFocus={handleFocus}
      />,
    );

    fireEvent.focus(screen.getByRole('textbox'));

    expect(handleFocus).toHaveBeenCalledTimes(1);
  });


  it('supports defaultValue', () => {
    render(
      <Textarea
        aria-label="Description"
        defaultValue="Initial text"
      />,
    );

    expect(
      screen.getByRole('textbox'),
    ).toHaveValue('Initial text');
  });

  it('supports controlled value', () => {
    let changedValue = '';

    const handleChange = vi.fn((event) => {
      changedValue = event.target.value;
    });

    render(
      <Textarea
        aria-label="Description"
        value="Controlled text"
        onChange={handleChange}
      />,
    );

    const textarea = screen.getByRole('textbox');

    expect(textarea).toHaveValue('Controlled text');

    fireEvent.change(
      textarea,
      {
        target: {
          value: 'Changed text',
        },
      },
    );

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(changedValue).toBe('Changed text');

    expect(textarea).toHaveValue('Controlled text');
  });

});
