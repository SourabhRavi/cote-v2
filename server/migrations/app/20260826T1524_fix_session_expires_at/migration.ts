#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/bb948c6f5dc7cc05acb40522849fdfee20c77ca727e1b85cf509706450a9ecb3/contract';
import endContract from '../../snapshots/bb948c6f5dc7cc05acb40522849fdfee20c77ca727e1b85cf509706450a9ecb3/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/cb358aa50306cef94b894f9235986d470f28ee8ff0f6371ae7bf1379bfef3908/contract';
import startContract from '../../snapshots/cb358aa50306cef94b894f9235986d470f28ee8ff0f6371ae7bf1379bfef3908/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [];
  }
}

MigrationCLI.run(import.meta.url, M);
