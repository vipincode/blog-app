'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start writing...',
  disabled = false,
  className,
}: RichTextEditorProps) {
  const editorRef = React.useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = React.useState(false)

  // Handle content changes
  const handleInput = React.useCallback(() => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML
      onChange(content)
    }
  }, [onChange])

  // Set initial content
  React.useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  // Format text functions
  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    handleInput()
  }

  const insertLink = () => {
    const url = prompt('Enter the URL:')
    if (url) {
      formatText('createLink', url)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault()
          formatText('bold')
          break
        case 'i':
          e.preventDefault()
          formatText('italic')
          break
        case 'u':
          e.preventDefault()
          formatText('underline')
          break
        case 'k':
          e.preventDefault()
          insertLink()
          break
      }
    }
  }

  return (
    <div className={cn('border rounded-md', className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/50">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('bold')}
          disabled={disabled}
          className="h-8 w-8 p-0"
          title="Bold (Ctrl+B)"
        >
          <strong>B</strong>
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('italic')}
          disabled={disabled}
          className="h-8 w-8 p-0"
          title="Italic (Ctrl+I)"
        >
          <em>I</em>
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('underline')}
          disabled={disabled}
          className="h-8 w-8 p-0"
          title="Underline (Ctrl+U)"
        >
          <u>U</u>
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('insertUnorderedList')}
          disabled={disabled}
          className="h-8 px-2"
          title="Bullet List"
        >
          • List
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('insertOrderedList')}
          disabled={disabled}
          className="h-8 px-2"
          title="Numbered List"
        >
          1. List
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={insertLink}
          disabled={disabled}
          className="h-8 px-2"
          title="Insert Link (Ctrl+K)"
        >
          🔗 Link
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('formatBlock', 'h2')}
          disabled={disabled}
          className="h-8 px-2"
          title="Heading"
        >
          H2
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('formatBlock', 'h3')}
          disabled={disabled}
          className="h-8 px-2"
          title="Subheading"
        >
          H3
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('removeFormat')}
          disabled={disabled}
          className="h-8 px-2"
          title="Clear Formatting"
        >
          Clear
        </Button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable={!disabled}
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        className={cn(
          'min-h-[300px] p-4 focus:outline-none',
          'prose prose-sm max-w-none',
          'prose-headings:font-semibold prose-headings:text-foreground',
          'prose-p:text-foreground prose-p:leading-relaxed',
          'prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
          'prose-strong:text-foreground prose-em:text-foreground',
          'prose-ul:text-foreground prose-ol:text-foreground',
          'prose-li:text-foreground',
          disabled && 'opacity-50 cursor-not-allowed',
          isFocused && 'ring-2 ring-ring ring-offset-2',
        )}
        style={{
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
        }}
        suppressContentEditableWarning={true}
      >
        {!value && <div className="text-muted-foreground pointer-events-none">{placeholder}</div>}
      </div>

      {/* Footer with character count */}
      <div className="flex justify-between items-center px-4 py-2 text-xs text-muted-foreground border-t bg-muted/30">
        <span>Use the toolbar above to format your text</span>
        <span>{value.replace(/<[^>]*>/g, '').length} characters</span>
      </div>
    </div>
  )
}
