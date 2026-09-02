#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/492a64751c5432b8a417c1bb1bbd69138c0e60d5510ffe2f9d6efa5501e474e5/contract';
import startContract from '../../snapshots/492a64751c5432b8a417c1bb1bbd69138c0e60d5510ffe2f9d6efa5501e474e5/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/50353af1b0228e0f529fccc3ec06e43874704c41e6157b43b90b670cf6c33814/contract';
import endContract from '../../snapshots/50353af1b0228e0f529fccc3ec06e43874704c41e6157b43b90b670cf6c33814/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'ChannelMember',
        columns: [
          col('channelId', 'character(36)', {
            notNull: true,
            codecRef: { codecId: 'sql/char@1', typeParams: { length: 36 } },
          }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'character(36)', {
            notNull: true,
            codecRef: { codecId: 'sql/char@1', typeParams: { length: 36 } },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('userId', 'character(36)', {
            notNull: true,
            codecRef: { codecId: 'sql/char@1', typeParams: { length: 36 } },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ChannelMember',
        index: 'ChannelMember_channelId_idx_166d3598',
        columns: ['channelId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ChannelMember',
        index: 'ChannelMember_userId_channelId_key_51e51f8c',
        columns: ['userId', 'channelId'],
        extras: { unique: true },
      }),
      this.createIndex({
        schema: 'public',
        table: 'ChannelMember',
        index: 'ChannelMember_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ChannelMember',
        foreignKey: {
          name: 'ChannelMember_userId_fKey',
          columns: ['userId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ChannelMember',
        foreignKey: {
          name: 'ChannelMember_channelId_fKey',
          columns: ['channelId'],
          references: { schema: 'public', table: 'Channel', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
