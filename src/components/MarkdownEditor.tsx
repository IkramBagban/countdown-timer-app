import { useRef, useState, useEffect } from 'react'
import { SettingsInputFrame, SettingsTextAreaFrame } from '@telemetryos/sdk/react'
import { createPortal } from 'react-dom'

interface MarkdownEditorProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    multiline?: boolean
    rows?: number
    disabled?: boolean
}

type HeaderLevel = 0 | 1 | 2; // 0=Normal, 1=#, 2=##

export function MarkdownEditor({
    value,
    onChange,
    placeholder,
    multiline = false,
    rows = 3,
    disabled = false
}: MarkdownEditorProps) {
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    // Floating Menu State
    const [selectionRect, setSelectionRect] = useState<DOMRect | null>(null)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [menuView, setMenuView] = useState<'main' | 'size'>('main')

    // Handle Selection
    const handleSelect = () => {
        const el = inputRef.current
        if (!el || disabled) return

        const start = el.selectionStart || 0
        const end = el.selectionEnd || 0

        if (start !== end) {
            // Text is selected, calculate position
            const rect = el.getBoundingClientRect()
            setSelectionRect(rect)
            setIsMenuOpen(true)
            setMenuView('main') // Reset to main view on new selection
        } else {
            setIsMenuOpen(false)
        }
    }

    const applyStyle = (type: 'bold' | 'italic' | 'header-1' | 'header-2' | 'normal') => {
        const el = inputRef.current
        if (!el) return

        const start = el.selectionStart || 0
        const end = el.selectionEnd || 0
        const text = value || ''

        const before = text.substring(0, start)
        const selected = text.substring(start, end)
        const after = text.substring(end)

        let newText = ''

        if (type === 'bold') {
            newText = `${before}**${selected}**${after}`
        } else if (type === 'italic') {
            newText = `${before}*${selected}*${after}`
        } else if (type === 'header-1') {
            // Remove existing hashes if any, then add #
            const clean = selected.replace(/^#+\s/, '')
            newText = `${before}# ${clean}${after}`
        } else if (type === 'header-2') {
            const clean = selected.replace(/^#+\s/, '')
            newText = `${before}## ${clean}${after}`
        } else if (type === 'normal') {
            const clean = selected.replace(/^#+\s/, '')
            newText = `${before}${clean}${after}`
        }

        onChange(newText)
        setIsMenuOpen(false)
        setMenuView('main')

        // Restore focus
        setTimeout(() => {
            el.focus()
        }, 0)
    }

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const FloatingMenu = () => {
        if (!isMenuOpen || !selectionRect) return null

        // Position above the input field
        const style: React.CSSProperties = {
            position: 'absolute',
            top: `${selectionRect.top + window.scrollY - 55}px`, // Slight adjustment for larger menu
            left: `${selectionRect.left + (selectionRect.width / 2)}px`,
            transform: 'translateX(-50%)',
            background: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: '8px',
            padding: '6px',
            display: 'flex',
            gap: '8px',
            zIndex: 9999,
            boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
            pointerEvents: 'auto' // Explicitly enable pointer events
        }

        return createPortal(
            <div
                style={style}
                onMouseDown={(e) => {
                    e.preventDefault(); // Critical: prevents input blur
                    e.stopPropagation();
                }}
            >
                {menuView === 'main' ? (
                    <>
                        <MenuButton label="Bold" onClick={() => applyStyle('bold')} />
                        <MenuButton label="Italic" onClick={() => applyStyle('italic')} />
                        <MenuButton label="Size ›" onClick={() => setMenuView('size')} />
                    </>
                ) : (
                    <>
                        <MenuButton label="H1" onClick={() => applyStyle('header-1')} />
                        <MenuButton label="H2" onClick={() => applyStyle('header-2')} />
                        <MenuButton label="Normal" onClick={() => applyStyle('normal')} />
                    </>
                )}
            </div>,
            document.body
        )
    }

    const MenuButton = ({ label, onClick }: { label: string, onClick: () => void }) => (
        <button
            type="button"
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
            style={{
                background: '#333',
                border: 'none',
                color: 'white',
                padding: '8px 12px',      // Larger hit area
                fontSize: '0.9rem',     // Larger text
                cursor: 'pointer',
                fontWeight: 600,
                borderRadius: '6px',
                minWidth: '60px',       // Ensure enough width
                transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#444'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#333'}
        >
            {label}
        </button>
    )

    return (
        <div ref={containerRef} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <FloatingMenu />

            {multiline ? (
                <SettingsTextAreaFrame>
                    <textarea
                        ref={inputRef as any}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onSelect={handleSelect}
                        placeholder={placeholder}
                        rows={rows}
                        disabled={disabled}
                    />
                </SettingsTextAreaFrame>
            ) : (
                <SettingsInputFrame>
                    <input
                        ref={inputRef as any}
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onSelect={handleSelect}
                        placeholder={placeholder}
                        disabled={disabled}
                    />
                </SettingsInputFrame>
            )}

            <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>
                Select text to format
            </div>
        </div>
    )
}
