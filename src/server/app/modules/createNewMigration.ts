/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';

const vms: string[] = [];
let currentVMIndex = 0;

const listFileNamesRecursive = async (dirPath: string): Promise<string[]> => {
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

      console.log(`Shutting down ${currentVM}...`);
      resolve(); // Resolve the promise once the VM is shut down
    });
  });
};

// Function to start the next VM
const startNextVM = (): Promise<void> => {
  const nextVMIndex = (currentVMIndex + 1) % vms.length;
  const nextVM = vms[nextVMIndex];

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

      console.log(`Starting ${nextVM}...`);
      currentVMIndex = nextVMIndex; // Update current VM index
      resolve(); // Resolve the promise once the VM is started
    });
  });
};

async function startNewMigration() {
  const directoryPath = path.resolve(
    __dirname,
    '../../../Coordinator/migation_image',
  );

  // Get all VMs in migation_image folder
  await listFileNamesRecursive(directoryPath)
    .then(() => {
    //   console.log('CurrentVMs:', fileNames);
    })
    .catch((error) => {
      console.error('Error on list all VMs:', error);
    });

  // Get the current running VM
  await getRunningVMName()
    .then((vmName) => {
      console.log('Current running VM:', vmName);
    })
    .catch((error) => {
      console.error('Error on get current running VM:', error);
    });

  // Migrate to the next VM
  try {
    await shutDownCurrentVM(); // Wait until the current VM is shut down
    await startNextVM(); // Wait until the next VM is started
    console.log('Operation completed successfully.');
  } catch (error) {
    console.error('Error:', error);
  }
}

export default startNewMigration;
