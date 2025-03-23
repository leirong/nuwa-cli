#!/usr/bin/env node
import create from '@nuwa-cli/create'
import { Command } from 'commander'
import fs from 'fs-extra'
import path from 'node:path'

const pkgJson = fs.readJsonSync(path.join(import.meta.dirname, '../package.json'))

const program = new Command()

program.name(pkgJson.name).version(pkgJson.version).description(pkgJson.description)

program
  .command('create')
  .description('创建项目')
  .action(() => {
    create()
  })

program.parse()
