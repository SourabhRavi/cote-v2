#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/30a6fc1bbef8d09e5444053d1670271e0cc3d0a2292cb2fb06703fa121d94d2d/contract';
import endContract from '../../snapshots/30a6fc1bbef8d09e5444053d1670271e0cc3d0a2292cb2fb06703fa121d94d2d/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/97998584b543972ddc946bf45be6b17295cdd1e5b841fa8899eea7131b250a7a/contract';
import startContract from '../../snapshots/97998584b543972ddc946bf45be6b17295cdd1e5b841fa8899eea7131b250a7a/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropColumn({ schema: 'public', table: 'ChannelMember', column: 'lastReatAt' }),
      this.addColumn({
        schema: 'public',
        table: 'ChannelMember',
        column: col('lastReadAt', 'timestamptz', {
          codecRef: { codecId: 'pg/timestamptz-string@1' },
        }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
