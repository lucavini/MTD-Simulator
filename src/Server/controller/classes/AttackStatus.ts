import debug from '@Lib/Debug';

class AttackStatus {
  private static attackStages: number;

  private static attackProgress: number;

  private static isVMCompromised: boolean;

  public constructor(attackProgress: number) {
    AttackStatus.attackProgress = attackProgress;
    AttackStatus.attackStages = Number(process.env.ATTACK_STAGES);
    AttackStatus.isVMCompromised = false;
    debug.info('AttackStatus', 'instance created');
  }

  public get attackStages() {
    return AttackStatus.attackStages;
  }

  public get isVMCompromised() {
    return AttackStatus.isVMCompromised;
  }

  public get attackProgress() {
    return AttackStatus.attackProgress;
  }

  public set increateAttackProgress(progress: number) {
    AttackStatus.attackProgress += progress;
  }
}

export default AttackStatus;
