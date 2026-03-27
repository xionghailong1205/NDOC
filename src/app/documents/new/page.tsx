"use client";

import { useState } from "react";
import Link from "next/link";
import { DocSidebar } from "@/components/doc-sidebar";
import { TiptapEditor } from "@/components/tiptap-editor";
import { normalizeTag } from "@/lib/tags";
import { Save, Tag, FolderTree } from "lucide-react";

export default function NewDocumentPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [parentDocId, setParentDocId] = useState<string | null>(null);
  const [parentDocPath, setParentDocPath] = useState<string[]>([]);

  const addTag = () => {
    const normalized = normalizeTag(tagInput);
    if (normalized && !tags.includes(normalized)) {
      setTags((prev) => [...prev, normalized]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* 侧边栏 - 文档树 */}
      <DocSidebar
        activeDocId={parentDocId ?? undefined}
        onSelectDoc={(id, path) => {
          setParentDocId(id);
          setParentDocPath(path);
        }}
      />

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部栏 */}
        <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-card shrink-0">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back
            </Link>
            <div className="w-px h-5 bg-border" />
            {/* <span className="text-sm font-medium text-foreground">New Document</span> */}
            <span className="font-medium text-sm text-foreground flex items-center gap-1">
              {parentDocPath.map((segment, i) => (
                <span key={i} className="flex items-center gap-1">
                  {i > 0 && <span className="text-muted-foreground">/</span>}
                  {segment}
                </span>
              ))}
            </span>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
        </header>

        {/* 编辑区域 */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-6 space-y-5">
            {/* 父文档指示 */}
            {/* {parentDocId && (
              <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 border border-border rounded-md text-sm">
                <FolderTree className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">Parent document:</span>
                <span className="font-medium text-foreground flex items-center gap-1">
                  {parentDocPath.map((segment, i) => (
                    <span key={i} className="flex items-center gap-1">
                      {i > 0 && <span className="text-muted-foreground">/</span>}
                      {segment}
                    </span>
                  ))}
                </span>
                <button
                  onClick={() => {
                    setParentDocId(null);
                    setParentDocPath([]);
                  }}
                  className="ml-auto text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Remove
                </button>
              </div>
            )} */}

            {/* 标题输入 */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Untitled document"
              className="w-full text-3xl font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground/40 text-foreground"
            />

            {/* 标签区域 */}
            <div className="flex items-start gap-2">
              <Tag className="w-4 h-4 text-muted-foreground mt-2 shrink-0" />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-secondary text-secondary-foreground rounded-md"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-muted-foreground hover:text-foreground ml-0.5"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    placeholder={tags.length === 0 ? "Add tags..." : ""}
                    className="flex-1 min-w-30 text-sm bg-transparent border-none outline-none placeholder:text-muted-foreground/40 py-1"
                  />
                </div>
              </div>
            </div>

            {/* 分割线 */}
            <div className="border-t border-border" />

            {/* Tiptap 编辑器 */}
            <TiptapEditor
              content={content}
              onChange={setContent}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
