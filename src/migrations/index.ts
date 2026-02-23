import * as migration_20260223_042923 from './20260223_042923';

export const migrations = [
  {
    up: migration_20260223_042923.up,
    down: migration_20260223_042923.down,
    name: '20260223_042923'
  },
];
