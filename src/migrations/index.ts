import * as migration_20260223_042923 from './20260223_042923';
import * as migration_20260226_213612 from './20260226_213612';

export const migrations = [
  {
    up: migration_20260223_042923.up,
    down: migration_20260223_042923.down,
    name: '20260223_042923',
  },
  {
    up: migration_20260226_213612.up,
    down: migration_20260226_213612.down,
    name: '20260226_213612'
  },
];
