import {
  defineContract,
  enumType,
  member,
} from "@prisma/orm-postgres/contract-builder";

const Role = enumType(
  "Role",
  { codecId: "pg/text@1", nativeType: "text" } as const,
  member("OWNER", "owner"),
  member("ADMIN", "admin"),
  member("MEMBER", "member"),
);

export const contract = defineContract({}, ({ field, model, rel }) => {
  // user
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

  // session
  const Session = model("Session", {
    fields: {
      id: field.id.uuidv7String(),
      tokenHash: field.text().unique(),
      userId: field.uuidString(),
      createdAt: field.temporal.createdAtString(),
      expiresAt: field.temporal.timestamptzString(),
    },
  });

  // workspace
  const Workspace = model("Workspace", {
    fields: {
      id: field.id.uuidv7String(),
      name: field.text(),
      createdByUserId: field.uuidString(),
      createdAt: field.temporal.createdAtString(),
      updatedAt: field.temporal.updatedAtString(),
    },
  });

  const WorkspaceMember = model("WorkspaceMember", {
    fields: {
      id: field.id.uuidv7String(),
      userId: field.uuidString(),
      workspaceId: field.uuidString(),
      role: field.namedType(Role).default(Role.members.MEMBER),
      createdAt: field.temporal.createdAtString(),
      updatedAt: field.temporal.updatedAtString(),
    },
  });

  return {
    enums: { Role },
    models: {
      User: User.relations({
        sessions: rel.hasMany(Session, { by: "userId" }),
        workspaceMembers: rel.hasMany(WorkspaceMember, { by: "userId" }),
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
      Workspace: Workspace.relations({
        workspaceMembers: rel.hasMany(WorkspaceMember, { by: "workspaceId" }),
        createdByUser: rel.belongsTo(User, {
          from: "createdByUserId",
          to: "id",
        }),
      }).sql(({ cols, constraints }) => ({
        table: "Workspace",
        foreignKeys: [
          constraints.foreignKey(cols.createdByUserId, User.refs.id, {
            name: "Workspace_createdByUserId_fKey",
          }),
        ],
      })),
      WorkspaceMember: WorkspaceMember.relations({
        workspace: rel.belongsTo(Workspace, { from: "workspaceId", to: "id" }),
        user: rel.belongsTo(User, { from: "userId", to: "id" }),
      }).sql(({ cols, constraints }) => ({
        table: "WorkspaceMember",
        indexes: [
          constraints.index([cols.userId, cols.workspaceId], {
            name: "WorkspaceMember_userId_workspaceId_key",
            unique: true,
          }),
        ],
        foreignKeys: [
          constraints.foreignKey(cols.userId, User.refs.id, {
            name: "WorkspaceMember_userId_fKey",
          }),
          constraints.foreignKey(cols.workspaceId, Workspace.refs.id, {
            name: "WorkspaceMember_workspaceId_fKey",
          }),
        ],
      })),
    },
  };
});
