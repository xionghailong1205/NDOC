"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
    ChevronRight,
    ChevronDown,
    FileText,
    FolderOpen,
    Plus,
    MoreHorizontal,
    Search,
    PanelLeftClose,
    PanelLeft,
} from "lucide-react";

export interface DocTreeItem {
    id: string;
    title: string;
    children?: DocTreeItem[];
}

// -- 静态示例数据 (后续替换为真实数据) --
const MOCK_TREE: DocTreeItem[] = [
    {
        id: "1",
        title: "Getting Started",
        children: [
            { id: "1-1", title: "Installation" },
            { id: "1-2", title: "Quick Start Guide" },
            {
                id: "1-3",
                title: "Configuration",
                children: [
                    { id: "1-3-1", title: "Environment Variables" },
                    { id: "1-3-2", title: "Database Setup" },
                ],
            },
        ],
    },
    {
        id: "2",
        title: "API Reference",
        children: [
            { id: "2-1", title: "Authentication" },
            { id: "2-2", title: "Endpoints" },
        ],
    },
    { id: "3", title: "Changelog" },
    { id: "4", title: "Contributing" },
];

interface TreeNodeProps {
    item: DocTreeItem;
    depth: number;
    activeId?: string;
    parentPath?: string[];
    onSelect?: (id: string, path: string[]) => void;
}

function TreeNode({ item, depth, activeId, parentPath = [], onSelect }: TreeNodeProps) {
    const [expanded, setExpanded] = useState(true);
    const hasChildren = item.children && item.children.length > 0;
    const isActive = activeId === item.id;
    const currentPath = [...parentPath, item.title];

    return (
        <div>
            <div
                className={cn(
                    "group flex items-center gap-1 px-2 py-1.5 rounded-md text-sm cursor-pointer select-none",
                    "hover:bg-accent/50 transition-colors",
                    isActive && "bg-accent text-accent-foreground font-medium"
                )}
                style={{ paddingLeft: `${depth * 12 + 8}px` }}
                onClick={() => onSelect?.(item.id, currentPath)}
            >
                {/* 展开/折叠按钮 */}
                <button
                    className={cn(
                        "flex items-center justify-center w-4 h-4 shrink-0",
                        hasChildren ? "opacity-60 hover:opacity-100" : "opacity-0"
                    )}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (hasChildren) setExpanded(!expanded);
                    }}
                >
                    {hasChildren &&
                        (expanded ? (
                            <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                            <ChevronRight className="w-3.5 h-3.5" />
                        ))}
                </button>

                {/* 图标 */}
                {hasChildren ? (
                    <FolderOpen className="w-4 h-4 shrink-0 text-muted-foreground" />
                ) : (
                    <FileText className="w-4 h-4 shrink-0 text-muted-foreground" />
                )}

                {/* 标题 */}
                <span className="truncate flex-1">{item.title}</span>

                {/* 操作按钮 */}
                <div className="hidden group-hover:flex items-center gap-0.5 shrink-0">
                    {hasChildren && (
                        <button
                            className="p-0.5 rounded hover:bg-accent"
                            title="Add sub-document"
                            onClick={(e) => {
                                e.stopPropagation();
                                // TODO: 添加子文档
                            }}
                        >
                            <Plus className="w-3 h-3" />
                        </button>
                    )}
                    <button
                        className="p-0.5 rounded hover:bg-accent"
                        title="More actions"
                        onClick={(e) => {
                            e.stopPropagation();
                            // TODO: 更多操作
                        }}
                    >
                        <MoreHorizontal className="w-3 h-3" />
                    </button>
                </div>
            </div>

            {/* 子节点 */}
            {hasChildren && expanded && (
                <div>
                    {item.children!.map((child) => (
                        <TreeNode
                            key={child.id}
                            item={child}
                            depth={depth + 1}
                            activeId={activeId}
                            parentPath={currentPath}
                            onSelect={onSelect}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

interface DocSidebarProps {
    activeDocId?: string;
    onSelectDoc?: (id: string, path: string[]) => void;
    className?: string;
}

export function DocSidebar({ activeDocId, onSelectDoc, className }: DocSidebarProps) {
    const [collapsed, setCollapsed] = useState(false);
    const [search, setSearch] = useState("");

    // 简单过滤（后续替换为真实搜索逻辑）
    const filterTree = (items: DocTreeItem[], query: string): DocTreeItem[] => {
        if (!query.trim()) return items;
        const q = query.toLowerCase();
        return items.reduce<DocTreeItem[]>((acc, item) => {
            const childMatches = item.children ? filterTree(item.children, query) : [];
            if (item.title.toLowerCase().includes(q) || childMatches.length > 0) {
                acc.push({
                    ...item,
                    children: childMatches.length > 0 ? childMatches : item.children,
                });
            }
            return acc;
        }, []);
    };

    const filteredTree = filterTree(MOCK_TREE, search);

    if (collapsed) {
        return (
            <div className={cn("w-10 border-r border-border bg-card flex flex-col items-center py-3 gap-2", className)}>
                <button
                    onClick={() => setCollapsed(false)}
                    className="p-1.5 rounded-md hover:bg-accent transition-colors"
                    title="Expand sidebar"
                >
                    <PanelLeft className="w-4 h-4 text-muted-foreground" />
                </button>
            </div>
        );
    }

    return (
        <div className={cn("w-64 border-r border-border bg-card flex flex-col shrink-0", className)}>
            {/* 头部 */}
            <div className="flex items-center justify-between px-3 py-3 border-b border-border">
                <span className="text-sm font-semibold text-foreground">Documents</span>
                <div className="flex items-center gap-1">
                    <button
                        className="p-1 rounded-md hover:bg-accent transition-colors"
                        title="New document"
                    >
                        <Plus className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button
                        onClick={() => setCollapsed(true)}
                        className="p-1 rounded-md hover:bg-accent transition-colors"
                        title="Collapse sidebar"
                    >
                        <PanelLeftClose className="w-4 h-4 text-muted-foreground" />
                    </button>
                </div>
            </div>

            {/* 搜索 */}
            <div className="px-3 py-2">
                <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search docs..."
                        className="w-full pl-7 pr-2 py-1.5 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
                    />
                </div>
            </div>

            {/* 文档树 */}
            <div className="flex-1 overflow-y-auto px-1 py-1">
                {filteredTree.length === 0 ? (
                    <div className="px-3 py-4 text-sm text-muted-foreground text-center">
                        No documents found
                    </div>
                ) : (
                    filteredTree.map((item) => (
                        <TreeNode
                            key={item.id}
                            item={item}
                            depth={0}
                            activeId={activeDocId}
                            onSelect={onSelectDoc}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
