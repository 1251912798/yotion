import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  documents: defineTable({
    title: v.string(),
    userId: v.string(),
    isArchived: v.boolean(), // 是否存档
    parentDocument: v.optional(v.id('documents')), // 父节点
    content: v.optional(v.string()), // 内容
    coverImage: v.optional(v.string()), // 封面图片
    icon: v.optional(v.string()), // 图标
    isPublished: v.boolean(), // 是否发布
  })
    .index('by_user', ['userId'])
    .index('by_user_parent', ['userId', 'parentDocument']),
});
