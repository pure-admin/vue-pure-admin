import * as dotenv from 'dotenv';

export interface ViteEnv {
  VITE_PORT: number;
  VITE_OPEN: boolean;
  VITE_USE_MOCK: boolean;
  VITE_PUBLIC_PATH: string;
  VITE_PROXY: [string, string][];
}

export function loadEnv(): ViteEnv {
  const env = process.env.NODE_ENV;
  const ret: any = {};
  const envList = [`.env.${env}.local`, `.env.${env}`, '.env.local', '.env', ,]
  envList.forEach((e) => {
    dotenv.config({
      path: e,
    });
  });
  for (const envName of Object.keys(process.env)) {
    let realName = (process.env as any)[envName].replace(/\\n/g, '\n');
    realName = realName === 'true' ? true : realName === 'false' ? false : realName;
    if (envName === 'VITE_PORT') {
      realName = Number(realName);
    }
    if (envName === 'VITE_OPEN') {
      realName = Boolean(realName);
    }
    if (envName === 'VITE_PROXY') {
      try {
        realName = JSON.parse(realName);
      } catch (error) { }
    }
    ret[envName] = realName;
    process.env[envName] = realName;
  }
  return ret;
}
