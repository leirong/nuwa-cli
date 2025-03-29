import axios from 'axios'

import urlJoin from 'url-join'

export const npmRegistry = 'https://registry.npmmirror.com'

export async function getNpmInfo(pkgName: string, registry?: string) {
  if (!pkgName) {
    return null
  }
  const url = urlJoin(registry || npmRegistry, pkgName)
  const res = await axios.get(url)
  if (res.status === 200) {
    return res.data
  }
  return null
}

export async function getLatestVersion(pkgName: string) {
  const url = urlJoin(npmRegistry, pkgName)
  const res = await axios.get(url)
  return res.data['dist-tags'].latest
}

export async function getVersions(pkgName: string) {
  const npmInfo = await getNpmInfo(pkgName)
  if (!npmInfo) {
    return []
  }
  return Object.keys(npmInfo.versions)
}
