class AttackStatus {
  private static attackStages: number;

  private CurrentAttackStage: number;

  private static TimePerStage: number;

  private CurrentAttackTime: number;

  private static isVMCompromised: boolean;

  public constructor() {
    AttackStatus.attackStages = Number(process.env.ATTACK_STAGES);
    this.CurrentAttackStage = 0;
    AttackStatus.TimePerStage = Number(process.env.TIME_PER_STAGE);
    this.CurrentAttackTime = 0;
    AttackStatus.isVMCompromised = false;
  }

  public get attackStages() {
    return AttackStatus.attackStages;
  }

  public get currentAttackStage() {
    return this.CurrentAttackStage;
  }

  public increaseAttackStage() {
    this.CurrentAttackStage += 1;
  }

  public get timePerStage() {
    return AttackStatus.TimePerStage;
  }

  public get currentAttackTime() {
    return this.CurrentAttackTime;
  }

  public increateCurrentAttackTime() {
    this.CurrentAttackTime += 1;
  }

  public resetCurrentAttackTime() {
    this.CurrentAttackTime = 0;
  }

  public get isVMCompromised() {
    return AttackStatus.isVMCompromised;
  }

  public setIsVMCompromised() {
    AttackStatus.isVMCompromised = true;
  }
}

export default AttackStatus;
