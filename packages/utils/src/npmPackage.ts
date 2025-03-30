import fse from 'fs-extra'
// @ts-ignore
import npminstall from 'npminstall'
import path from 'node:path'
import { getLatestVersion, npmRegistry } from './versionUtils.js'

export class NpmPackage {
  name: string
  targetPath: string
  storeDir: string
  version: string = ''

  constructor(options: { name: string; targetPath: string }) {
    const { name, targetPath } = options
    this.name = name
    this.targetPath = targetPath
    this.storeDir = path.resolve(targetPath, 'node_modules')
  }

  async prepare() {
    if (!fse.existsSync(this.storeDir)) {
      fse.mkdirpSync(this.storeDir)
    }
    const version = await getLatestVersion(this.name)
    this.version = version
  }

  async install() {
    await this.prepare()
    await npminstall({
      pkgs: [
        {
          name: this.name,
          version: this.version,
        },
      ],
      root: this.targetPath,
      registry: npmRegistry,
    })
  }

  async update() {
    await this.prepare()
    return npminstall({
      pkgs: [
        {
          name: this.name,
          version: this.version,
        },
      ],
      root: this.targetPath,
      registry: npmRegistry,
    })
  }

  async getLatestVersion() {
    return getLatestVersion(this.name)
  }

  npmFilePath() {
    return path.resolve(
      this.storeDir,
      `.store/${this.name.replace('/', '+')}@${this.version}/node_modules/${this.name}`,
    )
  }

  async getPackageJson() {
    await this.prepare()
    const npmFile = this.npmFilePath()
    if (fse.existsSync(npmFile)) {
      return fse.readJsonSync(path.resolve(npmFile, 'package.json'))
    }
    return null
  }
}
