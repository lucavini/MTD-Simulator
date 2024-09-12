import debug from '@Lib/Debug';

class MigrationState {
  private static migrationIsRunning: boolean;

  private static appIsRunning: boolean;

  private static currentRunningVM: string | undefined;

  private static instance: MigrationState;

  private constructor() {
    debug.info('TimeModule', 'instance created');
  }

  public static Instance(): MigrationState {
    if (!MigrationState.instance) {
      MigrationState.instance = new MigrationState();
      MigrationState.migrationIsRunning = false;
      MigrationState.appIsRunning = false;
      MigrationState.currentRunningVM = undefined;
    }

    return MigrationState.instance;
  }

  public get AppIsRunning() {
    return MigrationState.appIsRunning;
  }

  public setAppIsRunning(state: boolean) {
    MigrationState.appIsRunning = state;
  }

  public get MigrationIsRunning() {
    return MigrationState.migrationIsRunning;
  }

  public setMigrationIsRunning(state: boolean) {
    MigrationState.migrationIsRunning = state;
  }

  public get currentRunningVM() {
    return MigrationState.currentRunningVM;
  }

  public setCurrentRunningVM(vmName: string | undefined) {
    MigrationState.currentRunningVM = vmName;
  }
}

const migrationState = MigrationState.Instance();

export default migrationState;