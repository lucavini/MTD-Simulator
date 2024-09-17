import cron from 'node-cron';
import debug from '@Lib/Debug';
import * as path from 'path';
import startNewMigration, { listAllVMsName } from '../controller/tasks/createNewMigration';
import migrationState from '../controller/classes/MigrationState';
import checkRunningVMs from '../controller/tasks/getRunningVMName';
import VMState, { Status } from '../controller/classes/VMState';

const delay = migrationState.TimeBetweenMigrations;
const directoryPath = path.resolve(__dirname, '../controller/image');

class TimeModule {
  public static instance: TimeModule;

  public static cronJob: cron.ScheduledTask;

  public static timer: NodeJS.Timeout;

  public static globalTimer: NodeJS.Timeout;

  public static arrayVMS: VMState[];

  public static currentVm: VMState;

  private constructor() {
    debug.info('TimeModule', 'instance created');
    TimeModule.arrayVMS = [];
  }

  public static Instance(): TimeModule {
    if (!TimeModule.instance) {
      TimeModule.instance = new TimeModule();
    }
    return TimeModule.instance;
  }

  public async canStartMigration() {
    const runningVm = !!(await checkRunningVMs());

    return (
      !migrationState.MigrationIsRunning &&
      migrationState.AppIsRunning &&
      runningVm &&
      !TimeModule.currentVm.status.isVMCompromised
    );
  }

  public async startMigration() {
    const isEnabled = await this.canStartMigration();

    if (isEnabled) {
      debug.info('⏰ TimeModule', 'starting new migration');
      TimeModule.currentVm?.setVMLogService(Status.Down);
      clearInterval(TimeModule.globalTimer);
      startNewMigration();
    }
  }

  public stopSystem() {
    debug.error('timeModule', `${TimeModule.currentVm.Id} sucessfully compromised`);

    clearTimeout(TimeModule.timer);
    clearInterval(TimeModule.globalTimer);

    TimeModule.currentVm.status.setIsVMCompromised();
    TimeModule.arrayVMS.forEach((vm) => vm.stopAllLogging());
  }

  public logAttackProgress() {
    TimeModule.currentVm?.status.increateCurrentAttackTime();

    const attackTime = TimeModule.currentVm?.status.currentAttackTime;
    const stageTime = TimeModule.currentVm?.status.timePerStage;

    if (attackTime >= stageTime) {
      TimeModule.currentVm.status.increaseAttackStage();
      TimeModule.currentVm.status.resetCurrentAttackTime();
    }

    const attackStages = TimeModule.currentVm?.status.attackStages;
    const currentAttackStage = TimeModule.currentVm?.status.currentAttackStage;

    debug.warn(`Attack on ${TimeModule.currentVm.Id}`, `progress: ${attackTime} timePerStage: ${stageTime} | currentStage: ${currentAttackStage}`);

    if (currentAttackStage >= attackStages) {
      this.stopSystem();
    }
  }

  public async start() {
    debug.warn('⏰ TimeModule', ' Time-based migration has been started');

    const vmsList = await listAllVMsName(directoryPath);
    TimeModule.arrayVMS = vmsList.map((vmID) => new VMState(vmID));
  }

  public async schedule() {
    if (TimeModule.currentVm?.status?.isVMCompromised) {
      return;
    }

    debug.info('⏰ TimeModule', 'new migration scheduled');

    const runningVm = await checkRunningVMs();
    TimeModule.currentVm = TimeModule.arrayVMS.find((vm) => vm.Id === runningVm)!;
    TimeModule.currentVm?.setVMLogService(Status.Up);

    clearTimeout(TimeModule.timer);
    clearInterval(TimeModule.globalTimer);

    TimeModule.timer = setTimeout(async () => {
      await this.startMigration();
    }, delay);

    TimeModule.globalTimer = setInterval(async () => {
      this.logAttackProgress();
    }, 1000);
  }
}

export default TimeModule;
