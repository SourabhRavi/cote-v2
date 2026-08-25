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

  return {
    models: {
      User: User,
    },
  };
});
