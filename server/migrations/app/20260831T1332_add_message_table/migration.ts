#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/492a64751c5432b8a417c1bb1bbd69138c0e60d5510ffe2f9d6efa5501e474e5/contract';
import endContract from '../../snapshots/492a64751c5432b8a417c1bb1bbd69138c0e60d5510ffe2f9d6efa5501e474e5/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/f2d4496a8584d851e6941bf6631d8254b73262b486eaf9273b2b90b208c6fcd3/contract';
import startContract from '../../snapshots/f2d4496a8584d851e6941bf6631d8254b73262b486eaf9273b2b90b208c6fcd3/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'Message',
        columns: [
          col('authorId', 'character(36)', {
            notNull: true,
            codecRef: { codecId: 'sql/char@1', typeParams: { length: 36 } },
          }),
          col('channelId', 'character(36)', {
            notNull: true,
            codecRef: { codecId: 'sql/char@1', typeParams: { length: 36 } },
          }),
          col('content', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('deletedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-string@1' } }),
          col('id', 'character(36)', {
            notNull: true,
            codecRef: { codecId: 'sql/char@1', typeParams: { length: 36 } },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Message',
        index: 'Message_authorId_idx_e47547ed',
        columns: ['authorId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Message',
        index: 'Message_channelId_idx_166d3598',
        columns: ['channelId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Message',
        foreignKey: {
          name: 'Message_channelId_fKey',
          columns: ['channelId'],
          references: { schema: 'public', table: 'Channel', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Message',
        foreignKey: {
          name: 'Message_authorId_fKey',
          columns: ['authorId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
