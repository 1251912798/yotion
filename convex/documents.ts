import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { Doc, Id } from './_generated/dataModel';

export const archive = mutation({
  args: { id: v.id('documents') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error('未登录...');
    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error('文档不存在');
    }

    if (existingDocument.userId !== userId) {
      throw new Error('权限不足');
    }

    const recursiveArchived = async (
      documentId: Id<'documents'>
    ) => {
      const children = await ctx.db
        .query('documents')
        .withIndex('by_user_parent', q =>
          q
            .eq('userId', userId)
            .eq('parentDocument', documentId)
        )
        .collect();

      for (const child of children) {
        await ctx.db.patch(child._id, {
          isArchived: true,
        });
        await recursiveArchived(child._id);
      }
    };

    const document = await ctx.db.patch(args.id, {
      isArchived: true,
    });

    recursiveArchived(args.id);
    return document;
  },
});

// 获取侧边栏信息
export const getSidebar = query({
  args: {
    parentDocument: v.optional(v.id('documents')),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error('未登录...');

    const userId = identity.subject;

    const document = await ctx.db
      .query('documents')
      .withIndex('by_user_parent', q =>
        q
          .eq('userId', userId)
          .eq('parentDocument', args.parentDocument)
      )
      .filter(q => q.eq(q.field('isArchived'), false))
      .order('desc')
      .collect();

    return document;
  },
});

// 获取笔记列表
export const get = query({
  handler: async ctx => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error('未登录...');

    const document = await ctx.db
      .query('documents')
      .collect(); // 获取所有文档

    return document;
  },
});

// 创建笔记Api
export const create = mutation({
  args: {
    title: v.string(),
    parentDocument: v.optional(v.id('documents')),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error('未登录...');

    const userId = identity.subject;

    const document = await ctx.db.insert('documents', {
      title: args.title,
      parentDocument: args.parentDocument,
      userId,
      isArchived: false,
      isPublished: false,
    });

    return document;
  },
});

// 获取回收站
export const getTrash = query({
  handler: async ctx => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error('未登录...');

    const userId = identity.subject;
    const document = await ctx.db
      .query('documents')
      .withIndex('by_user', q => q.eq('userId', userId))
      .filter(q => q.eq(q.field('isArchived'), true))
      .order('desc')
      .collect(); // 获取所有文档

    return document;
  },
});

// 恢复文件
export const restore = mutation({
  args: { id: v.id('documents') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error('未登录...');

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error('文档不存在...');
    }

    if (existingDocument.userId !== userId) {
      throw new Error('无权限...');
    }

    const recursiveRestore = async (
      documentId: Id<'documents'>
    ) => {
      const children = await ctx.db
        .query('documents')
        .withIndex('by_user_parent', q =>
          q
            .eq('userId', userId)
            .eq('parentDocument', documentId)
        )
        .collect();
      for (const child of children) {
        await ctx.db.patch(child._id, {
          isArchived: false,
        });

        await recursiveRestore(child._id);
      }
    };

    const options: Partial<Doc<'documents'>> = {
      isArchived: false,
    };

    if (existingDocument.parentDocument) {
      const parent = await ctx.db.get(
        existingDocument.parentDocument
      );
      if (parent?.isArchived) {
        options.parentDocument = undefined;
      }
    }
    const document = await ctx.db.patch(args.id, options);

    recursiveRestore(args.id);

    return document;
  },
});

// 彻底删除
export const remove = mutation({
  args: { id: v.id('documents') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error('未登录...');

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error('文档不存在...');
    }

    if (existingDocument.userId !== userId) {
      throw new Error('无权限...');
    }

    const document = await ctx.db.delete(args.id);

    return document;
  },
});

//

export const getSearch = query({
  handler: async ctx => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error('未登录...');

    const userId = identity.subject;

    const documents = await ctx.db
      .query('documents')
      .withIndex('by_user', q => q.eq('userId', userId))
      .filter(q => q.eq(q.field('isArchived'), false))
      .order('desc')
      .collect();

    return documents;
  },
});

// 文档查询
export const getDocumentById = query({
  args: { documentId: v.id('documents') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    const document = await ctx.db.get(args.documentId);

    if (!document) {
      throw new Error('文档不存在');
    }

    if (document.isPublished && !document.isArchived) {
      return document;
    }

    if (!identity) {
      throw new Error('未登录');
    }

    const userId = identity.subject;

    if (document.userId !== userId) {
      throw new Error('未经授权');
    }

    return document;
  },
});

// 文档更新
export const update = mutation({
  args: {
    id: v.id('documents'),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('未登录');
    }

    const userId = identity.subject;

    const { id, ...rest } = args;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error('文档不存在');
    }

    if (existingDocument.userId !== userId) {
      throw new Error('未经授权');
    }

    const document = await ctx.db.patch(args.id, {
      ...rest,
    });

    return document;
  },
});

// 删除图标
export const removeIcon = mutation({
  args: { id: v.id('documents') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('未登录');
    }

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error('文档不存在');
    }

    if (existingDocument.userId !== userId) {
      throw new Error('未经授权');
    }

    const document = await ctx.db.patch(args.id, {
      icon: undefined,
    });

    return document;
  },
});

// 删除封面
export const reomveCoverImage = mutation({
  args: { id: v.id('documents') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('未登录');
    }

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error('文档不存在');
    }

    if (existingDocument.userId !== userId) {
      throw new Error('未经授权');
    }

    const document = await ctx.db.patch(args.id, {
      coverImage: undefined,
    });

    return document;
  },
});
