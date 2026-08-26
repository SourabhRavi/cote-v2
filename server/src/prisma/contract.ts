import { defineContract } from "@prisma/orm-postgres/contract-builder";

export const contract = defineContract({}, ({ field, model, rel }) => {
  const User = model("User", {
    fields: {
      id: field.id.uuidv7String(),
      googleId: field.text().unique(),
      email: field.text().unique(),
      name: field.text().optional(),
      avatarUrl: field.text().optional(),
      createdAt: field.temporal.createdAtString(),
      updatedAt: field.temporal.updatedAtString(),
    },
  });

  const Session = model("Session", {
    fields: {
      id: field.id.uuidv7String(),
      tokenHash: field.text().unique(),
      userId: field.uuidString(),
      createdAt: field.temporal.createdAtString(),
      expiresAt: field.temporal.timestamptzString(),
    },
  });

  // const Post = model("Post", {
  //   fields: {
  //     id: field.id.uuidv7String(),
  //     title: field.text(),
  //     content: field.text().optional(),
  //     authorId: field.uuidString(),
  //     createdAt: field.temporal.createdAtString(),
  //     updatedAt: field.temporal.updatedAtString(),
  //   },
  // });

  // return {
  //   models: {
  //     User: User.relations({
  //       posts: rel.hasMany(Post, { by: "authorId" }),
  //     }),
  //     Post: Post.relations({
  //       author: rel.belongsTo(User, { from: "authorId", to: "id" }),
  //     }),
  //   },
  // };

  return {
    models: {
      User: User.relations({
        sessions: rel.hasMany(Session, { by: "userId" }),
      }),
      Session: Session.relations({
        user: rel.belongsTo(User, { from: "userId", to: "id" }),
      }).sql(({ cols, constraints }) => ({
        table: "Session",
        foreignKeys: [
          constraints.foreignKey(cols.userId, User.refs.id, {
            name: "Session_userId_fkey",
          }),
        ],
      })),
    },
  };
});
