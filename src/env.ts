import fs from 'node:fs'
import path from 'node:path'
import { parse } from 'dotenv'
import { expand } from 'dotenv-expand'

/** 同步读取文件 */
function tryStatSync(file: string): fs.Stats | undefined {
  try {
    return fs.statSync(file, { throwIfNoEntry: false })
  } catch {}
}
/** 获取env文件列表 */
function getEnvFilesForMode(mode: string): string[] {
  return [
    /** default file */ `.env`,
    /** local file */ `.env.local`,
    /** mode file */ `.env.${mode}`,
    /** mode local file */ `.env.${mode}.local`,
  ]
}

/** 加载环境变量 */
function loadEnv(envDir: string) {
  const envFiles = getEnvFilesForMode(process.env.NODE_ENV ?? 'development')
  const parsed = Object.fromEntries(
    envFiles.flatMap((file) => {
      const filePath = path.join(envDir, file)
      if (!tryStatSync(filePath)?.isFile()) return []
      return Object.entries(parse(fs.readFileSync(filePath)))
    })
  )
  expand({ parsed })
  return parsed
}
loadEnv(path.resolve(__dirname, '../'))
