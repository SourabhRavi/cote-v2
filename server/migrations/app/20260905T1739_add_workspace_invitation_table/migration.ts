#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/30a6fc1bbef8d09e5444053d1670271e0cc3d0a2292cb2fb06703fa121d94d2d/contract';
import startContract from '../../snapshots/30a6fc1bbef8d09e5444053d1670271e0cc3d0a2292cb2fb06703fa121d94d2d/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/5d0df173f8f4cb2c8822de277c900d1cffc803433be294a5e0e4006e1c8666e6/contract';
import endContract from '../../snapshots/5d0df173f8f4cb2c8822de277c900d1cffc803433be294a5e0e4006e1c8666e6/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'WorkspaceInvitation',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'character(36)', {
            notNull: true,
            codecRef: { codecId: 'sql/char@1', typeParams: { length: 36 } },
          }),
          col('status', 'text', {
            notNull: true,
            default: lit('invited'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('userEmail', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('workspaceId', 'character(36)', {
            notNull: true,
            codecRef: { codecId: 'sql/char@1', typeParams: { length: 36 } },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'WorkspaceInvitation_status_check_d2a367f3',
            "\"status\" IN ('invited', 'accepted', 'declined')",
          ),
        ],
      }),
      this.createIndex({
        schema: 'public',
        table: 'WorkspaceInvitation',
        index: 'WorkspaceInvitation_workspaceId_idx_ba65f874',
        columns: ['workspaceId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'WorkspaceInvitation',
        index: 'WorkspaceInvitation_workspaceId_userEmail_key_42b21e23',
        columns: ['workspaceId', 'userEmail'],
        extras: { unique: true },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'WorkspaceInvitation',
        foreignKey: {
          name: 'WorkspaceInvitation_workspaceId_fKey',
          columns: ['workspaceId'],
          references: { schema: 'public', table: 'Workspace', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
