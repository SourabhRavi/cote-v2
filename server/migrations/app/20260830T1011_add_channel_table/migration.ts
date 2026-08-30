#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/9836518226604754184b5f9d5c12f881324a7624263c46c4a6b5d007d22f30c5/contract';
import startContract from '../../snapshots/9836518226604754184b5f9d5c12f881324a7624263c46c4a6b5d007d22f30c5/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/f2d4496a8584d851e6941bf6631d8254b73262b486eaf9273b2b90b208c6fcd3/contract';
import endContract from '../../snapshots/f2d4496a8584d851e6941bf6631d8254b73262b486eaf9273b2b90b208c6fcd3/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'Channel',
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
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('workspaceId', 'character(36)', {
            notNull: true,
            codecRef: { codecId: 'sql/char@1', typeParams: { length: 36 } },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Channel',
        index: 'Channel_workspaceId_idx_ba65f874',
        columns: ['workspaceId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Channel',
        foreignKey: {
          name: 'Channel_workspaceId_fKey',
          columns: ['workspaceId'],
          references: { schema: 'public', table: 'Workspace', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
