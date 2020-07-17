export async function withEnv<T>(env: Record<string, string>, test: () => T | PromiseLike<T>) : Promise<T> {
  const original = process.env;
  process.env = { ...original, ...env }

  try {
    return await test();
  } catch (e) {
    throw e;
  } finally {
    process.env = original;
  }
}

export async function withArgv<T>(argv: string[], test: () => T | PromiseLike<T>) : Promise<T> {
  const original = process.argv;
  process.argv = [ ...original.slice(0, 2), ...argv ];
  
  try {
    return await test();
  } catch (e) {
    throw e;
  } finally {
    process.argv = original;
  }
}

export async function withArgvAndEnv<T>(argv: string[], env: Record<string, string>, test: () => T | PromiseLike<T>) : Promise<T> {
  const originalArgv = process.argv;
  process.argv = [ ...originalArgv.slice(0, 2), ...argv ];

  const originalEnv = process.env;
  process.env = { ...originalEnv, ...env }
  
  try {
    return await test();
  } catch (e) {
    throw e;
  } finally {
    process.argv = originalArgv;
    process.env = originalEnv;
  }
}
