import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import debug from '@Lib/Debug';

const vms: string[] = [];
let currentVMIndex = 0;
const directoryPath = path.resolve(__dirname, '../');

const listAllVMsName = async (dirPath: string): Promise<string[]> => {
  async function readDir(dir: string) {
    const files = await fs.promises.readdir(dir, { withFileTypes: true });

    for (const file of files) {
      const fullPath = path.join(dir, file.name);
      if (file.isDirectory()) {
        await readDir(fullPath);
      } else {
        vms.push(file.name.split('.')[0]);
      }
    }
  }

  vms.length = 0;
  await readDir(dirPath);
  return vms;
};

const getRunningVMName = (): Promise<string> => new Promise((resolve, reject) => {
  exec('virsh list', (error, stdout, stderr) => {
    if (error) {
      reject(error);
      return;
    }
    if (stderr) {
      reject(stderr);
      return;
    }

    const lines = stdout.trim().split('\n').slice(2);

    const runningVMNames = lines.map((line) => {
      const parts = line.trim().split(/\s+/);
      return parts[1];
    });

    vms.forEach((vm, index) => {
      if (vm === runningVMNames[0]) {
        currentVMIndex = index;
      }
    });

    resolve(runningVMNames[0]);
  });
});

// Function to shut down the current VM
const shutDownCurrentVM = (): Promise<void> => {
  const currentVM = vms[currentVMIndex];

  return new Promise((resolve, reject) => {
    // Shut down the current VM
    exec(`virsh shutdown ${currentVM}`, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      if (stderr) {
        reject(stderr);
        return;
      }

      debug.info('shutDownCurrentVM', `Shutting down ${currentVM}...`);
      resolve(); // Resolve the promise once the VM is shut down
    });
  });
};

const getNextVMInfo = () => {
  const nextVMIndex = (currentVMIndex + 1) % vms.length;
  const nextVM = vms[nextVMIndex];

  return { nextVM, nextVMIndex };
};

// Function to start the next VM
const startNextVM = (): Promise<void> => {
  const { nextVM, nextVMIndex } = getNextVMInfo();
  debug.info('startNextVM', `nextVM: ${nextVM}`);

  return new Promise((resolve, reject) => {
    // Start the next VM
    exec(`virsh start ${nextVM}`, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      if (stderr) {
        reject(stderr);
        return;
      }

      debug.info('startNextVM', `Starting ${nextVM}...`);
      currentVMIndex = nextVMIndex; // Update current VM index
      resolve(); // Resolve the promise once the VM is started
    });
  });
};

const runMigrateScript = (vmName: String): Promise<void> => {
  const vmOrigin: String = vmName.charAt(vmName.length - 1);
  const vmDestiny = getNextVMInfo().nextVM.charAt(vmName.length - 1);
  debug.info('runMigrateScript', `migrating ${vmOrigin} to ${vmDestiny}`);

  return new Promise((resolve, reject) => {
    // Start the next VM
    exec(`${directoryPath}/scripts/migrateVM.sh ${vmOrigin} ${vmDestiny} ${directoryPath}`, (error, stdout) => {
      if (error) {
        debug.error('runMigrateScript', `error: ${error}`);
        reject(error);
        return;
      }
      if (stdout) {
        debug.info('runMigrateScript', `stdout: ${stdout}`);
      }
      resolve(); // Resolve the promise once the VM is started
    });
  });
};

async function startNewMigration() {
  let vmName = '';

  // Get all VMs in migation_image folder
  await listAllVMsName(`${directoryPath}/migation_image`)
    .then((allCurrentVMs) => {
      debug.info('listAllVMsName', `all current VMs: ${allCurrentVMs}`);
    })
    .catch((error) => {
      debug.error('listAllVMsName', `Error on list all VMs: ${error}`);
    });

  // Get the current running VM
  await getRunningVMName()
    .then((vm) => {
      vmName = vm;
      debug.info('getRunningVMName', `Current running VM: ${vmName}`);
    })
    .catch((error) => {
      debug.error('getRunningVMName', `Error on get current running VM: ${error}`);
    });

  // Migrate to the next VM
  try {
    await shutDownCurrentVM(); // Wait until the current VM is shut down
    await runMigrateScript(vmName);
    await startNextVM(); // Wait until the next VM is started
    debug.info('startNewMigration', 'Operation completed successfully');
  } catch (error) {
    debug.error('startNewMigration', `Error: ${error}`);
  }
}

export default startNewMigration;
