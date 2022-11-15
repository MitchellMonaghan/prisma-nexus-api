import { join } from 'path'

export const getConfig = async <T> (configPath: string): Promise<T|undefined> => {
  try {
    const projectRoot = process.cwd()
    const fullConfigPath = join(projectRoot, configPath)

    const userConfig = await import(fullConfigPath)

    return userConfig?.default ?? userConfig as T
  } catch (error: any) {
    return undefined
  }
}
