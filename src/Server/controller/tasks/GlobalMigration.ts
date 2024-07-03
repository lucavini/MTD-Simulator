import debug from '@Lib/Debug';

class GlobalMigration {
  private static migrationIsRunning: boolean;

  private static currentRunningVM: string | undefined;

  private static instance: GlobalMigration;

  private constructor() {
    debug.info('TimeModule', 'instance created');
  }

  public static Instance(): GlobalMigration {
    if (!GlobalMigration.instance) {
      GlobalMigration.instance = new GlobalMigration();
      GlobalMigration.migrationIsRunning = false;
      GlobalMigration.currentRunningVM = undefined;
    }

    return GlobalMigration.instance;
  }

  public get MigrationIsRunning() {
    return GlobalMigration.migrationIsRunning;
  }

  public setMigrationIsRunning(state: boolean) {
    GlobalMigration.migrationIsRunning = state;
  }

  public get currentRunningVM() {
    return GlobalMigration.currentRunningVM;
  }

  public setCurrentRunningVM(vmName: string | undefined) {
    GlobalMigration.currentRunningVM = vmName;
  }
}

const globalMigration = GlobalMigration.Instance();

export default globalMigration;
