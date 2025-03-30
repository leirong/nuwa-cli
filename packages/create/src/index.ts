import { confirm, input, select } from '@inquirer/prompts'
import { NpmPackage } from '@nuwa-cli/utils'
import path from 'node:path'
import os from 'node:os'
import ora from 'ora'
import fse from 'fs-extra'
import { glob } from 'glob'
import ejs from 'ejs'

const defaultProjectNameMap: Record<string, string> = {
  '@nuwa-cli/template-react': 'react-demo',
  '@nuwa-cli/template-vue': 'vue-demo',
  '@nuwa-cli/template-react-ts': 'react-ts-demo',
  '@nuwa-cli/template-vue-ts': 'vue-ts-demo',
}

async function create() {
  const template = await select({
    message: '请选择模板',
    choices: [
      {
        name: 'react',
        value: '@nuwa-cli/template-react',
      },
      {
        name: 'vue',
        value: '@nuwa-cli/template-vue',
      },
      {
        name: 'react-ts',
        value: '@nuwa-cli/template-react-ts',
      },
      {
        name: 'vue-ts',
        value: '@nuwa-cli/template-vue-ts',
      },
    ],
  })
  const projectName = await input({
    message: '请输入项目名称',
    default: defaultProjectNameMap[template],
  })

  const templatePath = path.join(os.homedir(), 'template')

  const npmPackage = new NpmPackage({
    name: template,
    targetPath: templatePath,
  })

  const downloadSpinner = ora('下载模板中...').start()

  await npmPackage.install()

  downloadSpinner.succeed('下载模板成功🎉🎉🎉')

  const targetDir = path.join(process.cwd(), projectName)

  if (fse.existsSync(targetDir)) {
    const flag = await confirm({
      message: `${projectName}项目已存在，是否覆盖？`,
    })
    if (!flag) {
      process.exit(0)
    }
    fse.removeSync(targetDir)
  }

  const copySpinner = ora('创建项目中...').start()

  fse.copySync(path.join(npmPackage.npmFilePath(), 'template'), targetDir)

  copySpinner.succeed('创建项目成功🎉🎉🎉')

  const ejsData: Record<string, any> = {
    projectName,
  }
  const deleteFiles = []

  const questionsFilepath = path.join(npmPackage.npmFilePath(), 'questions.json')

  if (fse.existsSync(questionsFilepath)) {
    const questions = fse.readJSONSync(questionsFilepath)
    for (const question in questions) {
      const res = await confirm({
        message: `是否启用${question}`,
      })

      ejsData[question] = res
      if (!res) {
        deleteFiles.push(...questions[question].files)
      }
    }
  }

  const files = await glob('**', {
    cwd: targetDir,
    nodir: true,
    ignore: ['node_modules/**'],
  })

  for (const file of files) {
    const filePath = path.join(targetDir, file)
    const res = await ejs.renderFile(filePath, ejsData)
    fse.writeFileSync(filePath, res)
  }

  for (const file of deleteFiles) {
    fse.removeSync(path.join(targetDir, file))
  }
}

create()

export default create
