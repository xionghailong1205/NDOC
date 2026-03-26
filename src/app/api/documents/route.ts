import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db";
import { documents, categories } from "@/db/schema";
import { eq, ilike, or, and, isNull } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const categoryId = searchParams.get("categoryId");

    const conditions = [];

    if (search) {
      conditions.push(
        or(
          ilike(documents.title, `%${search}%`),
          ilike(documents.content, `%${search}%`)
        )
      );
    }

    if (categoryId === "uncategorized") {
      conditions.push(isNull(documents.categoryId));
    } else if (categoryId && categoryId !== "all") {
      conditions.push(eq(documents.categoryId, parseInt(categoryId)));
    }

    const rows = await db
      .select({
        id: documents.id,
        title: documents.title,
        content: documents.content,
        categoryId: documents.categoryId,
        tags: documents.tags,
        createdAt: documents.createdAt,
        updatedAt: documents.updatedAt,
        categoryName: categories.name,
      })
      .from(documents)
      .leftJoin(categories, eq(documents.categoryId, categories.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(documents.updatedAt);

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();
    const { title, content, categoryId, tags } = body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const [doc] = await db
      .insert(documents)
      .values({
        title: title.trim(),
        content: content || "",
        categoryId: categoryId ? parseInt(categoryId) : null,
        tags: Array.isArray(tags) ? tags : [],
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json(doc, { status: 201 });
  } catch (error) {
    console.error("Error creating document:", error);
    return NextResponse.json(
      { error: "Failed to create document" },
      { status: 500 }
    );
  }
}
