export async function withEnv(env: Record<string, string>, test: () => void | Promise<void>) {
  const original = process.env;
  process.env = { ...original, ...env }

  try {
    const result = await Promise.resolve(test());
  } catch (e) {
    throw e;
  } finally {
    process.env = original;
  }
}

export async function withArgv(argv: string[], test: () => void | Promise<void>) {
  const original = process.argv;
  process.argv = [ ...original.slice(0, 2), ...argv ];
  
  try {
    const result = await Promise.resolve(test());
  } catch (e) {
    throw e;
  } finally {
    process.argv = original;
  }
}
