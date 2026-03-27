"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { cn } from "@/lib/utils";
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    Code,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    ListTodo,
    Quote,
    Minus,
    Undo2,
    Redo2,
    Link as LinkIcon,
    ImageIcon,
    Code2,
    ChevronDown,
} from "lucide-react";
import { useCallback, useRef, useState, useEffect } from "react";

const lowlight = createLowlight(common);

const CODE_LANGUAGES = [
    { label: "Plain Text", value: "" },
    { label: "JavaScript", value: "javascript" },
    { label: "TypeScript", value: "typescript" },
    { label: "HTML", value: "xml" },
    { label: "CSS", value: "css" },
    { label: "JSON", value: "json" },
    { label: "Python", value: "python" },
    { label: "Java", value: "java" },
    { label: "C++", value: "cpp" },
    { label: "C", value: "c" },
    { label: "Go", value: "go" },
    { label: "Rust", value: "rust" },
    { label: "Ruby", value: "ruby" },
    { label: "PHP", value: "php" },
    { label: "Shell", value: "bash" },
    { label: "SQL", value: "sql" },
    { label: "Markdown", value: "markdown" },
    { label: "YAML", value: "yaml" },
    { label: "Diff", value: "diff" },
];

interface ToolbarButtonProps {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    title: string;
    children: React.ReactNode;
}

function ToolbarButton({ onClick, isActive, disabled, title, children }: ToolbarButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={cn(
                "p-1.5 rounded-md transition-colors",
                isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                disabled && "opacity-40 cursor-not-allowed"
            )}
        >
            {children}
        </button>
    );
}

function ToolbarDivider() {
    return <div className="w-px h-5 bg-border mx-0.5" />;
}

function CodeBlockToolbar({ editor }: { editor: ReturnType<typeof useEditor> }) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const isActive = editor?.isActive("codeBlock");

    const currentLanguage = isActive
        ? (editor?.getAttributes("codeBlock")?.language as string) || ""
        : "";

    const currentLabel =
        CODE_LANGUAGES.find((l) => l.value === currentLanguage)?.label || "Plain Text";

    const setLanguage = useCallback(
        (language: string) => {
            editor?.chain().focus().updateAttributes("codeBlock", { language }).run();
            setOpen(false);
        },
        [editor]
    );

    useEffect(() => {
        if (!open) return;
        const handleClick = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [open]);

    return (
        <div className="relative flex items-center" ref={dropdownRef}>
            <ToolbarButton
                onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
                isActive={!!isActive}
                title="Code block"
            >
                <Code2 className="w-4 h-4" />
            </ToolbarButton>
            {isActive && (
                <button
                    type="button"
                    onClick={() => setOpen(!open)}
                    className="flex items-center gap-0.5 px-1.5 py-1 rounded-md text-xs text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors"
                    title="Select language"
                >
                    <span className="max-w-20 truncate">{currentLabel}</span>
                    <ChevronDown className="w-3 h-3" />
                </button>
            )}
            {open && (
                <div className="absolute top-full left-0 mt-1 z-50 w-44 max-h-56 overflow-y-auto rounded-md border border-border bg-popover shadow-md">
                    {CODE_LANGUAGES.map((lang) => (
                        <button
                            key={lang.value}
                            type="button"
                            onClick={() => setLanguage(lang.value)}
                            className={cn(
                                "w-full text-left px-3 py-1.5 text-sm transition-colors hover:bg-accent",
                                currentLanguage === lang.value && "bg-accent text-accent-foreground font-medium"
                            )}
                        >
                            {lang.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

interface TiptapEditorProps {
    content?: string;
    onChange?: (html: string) => void;
    className?: string;
}

export function TiptapEditor({ content = "", onChange, className }: TiptapEditorProps) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
                codeBlock: false,
            }),
            CodeBlockLowlight.configure({
                lowlight,
                defaultLanguage: "",
            }),
            Placeholder.configure({
                placeholder: "Start writing...",
            }),
            Underline,
            TaskList,
            TaskItem.configure({ nested: true }),
            Link.configure({ openOnClick: false }),
            Image,
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class:
                    "prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[400px] px-6 py-4",
            },
        },
    });

    if (!editor) return null;

    const addLink = () => {
        if (editor.isActive("link")) {
            editor.chain().focus().unsetLink().run();
            return;
        }
        const url = window.prompt("Enter URL:");
        if (!url) return;
        const { from, to } = editor.state.selection;
        if (from === to) {
            editor
                .chain()
                .focus()
                .insertContent(`<a href="${url}">${url}</a>`)
                .run();
        } else {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    const addImage = () => {
        const url = window.prompt("Enter image URL:");
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    return (
        <div className={cn("border border-border rounded-lg bg-background overflow-hidden", className)}>
            {/* Toolbar */}
            <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-border bg-muted/30 flex-wrap">
                {/* Undo / Redo */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    title="Undo"
                >
                    <Undo2 className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    title="Redo"
                >
                    <Redo2 className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarDivider />

                {/* Headings */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    isActive={editor.isActive("heading", { level: 1 })}
                    title="Heading 1"
                >
                    <Heading1 className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive("heading", { level: 2 })}
                    title="Heading 2"
                >
                    <Heading2 className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    isActive={editor.isActive("heading", { level: 3 })}
                    title="Heading 3"
                >
                    <Heading3 className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarDivider />

                {/* Inline formatting */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive("bold")}
                    title="Bold"
                >
                    <Bold className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive("italic")}
                    title="Italic"
                >
                    <Italic className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    isActive={editor.isActive("underline")}
                    title="Underline"
                >
                    <UnderlineIcon className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    isActive={editor.isActive("strike")}
                    title="Strikethrough"
                >
                    <Strikethrough className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    isActive={editor.isActive("code")}
                    title="Inline code"
                >
                    <Code className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarDivider />

                {/* Lists */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive("bulletList")}
                    title="Bullet list"
                >
                    <List className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive("orderedList")}
                    title="Ordered list"
                >
                    <ListOrdered className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleTaskList().run()}
                    isActive={editor.isActive("taskList")}
                    title="Task list"
                >
                    <ListTodo className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarDivider />

                {/* Block elements */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    isActive={editor.isActive("blockquote")}
                    title="Blockquote"
                >
                    <Quote className="w-4 h-4" />
                </ToolbarButton>
                <CodeBlockToolbar editor={editor} />
                <ToolbarButton
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    title="Horizontal rule"
                >
                    <Minus className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarDivider />

                {/* Link & Image */}
                <ToolbarButton
                    onClick={addLink}
                    isActive={editor.isActive("link")}
                    title="Add link"
                >
                    <LinkIcon className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={addImage} title="Add image">
                    <ImageIcon className="w-4 h-4" />
                </ToolbarButton>
            </div>

            {/* Editor */}
            <EditorContent editor={editor} />
        </div>
    );
}
