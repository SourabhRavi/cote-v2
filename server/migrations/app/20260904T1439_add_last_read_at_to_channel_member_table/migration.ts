#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/50353af1b0228e0f529fccc3ec06e43874704c41e6157b43b90b670cf6c33814/contract';
import startContract from '../../snapshots/50353af1b0228e0f529fccc3ec06e43874704c41e6157b43b90b670cf6c33814/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/97998584b543972ddc946bf45be6b17295cdd1e5b841fa8899eea7131b250a7a/contract';
import endContract from '../../snapshots/97998584b543972ddc946bf45be6b17295cdd1e5b841fa8899eea7131b250a7a/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'ChannelMember',
        column: col('lastReatAt', 'timestamptz', {
          codecRef: { codecId: 'pg/timestamptz-string@1' },
        }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
