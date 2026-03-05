"use server"

import {
  checkRegistryStatus,
  getManifest,
  listRepositories,
  listTags,
} from "~/lib/registry"
import type {
  CatalogResponse,
  ManifestResult,
  RegistryStatus,
  TagsResponse,
} from "~/lib/registry"
import { clearSession, getSession, setSession } from "~/lib/session"

export async function getRegistryStatusAction(): Promise<RegistryStatus> {
  const credentials = await getSession()
  return checkRegistryStatus(credentials)
}

export interface LoginResult {
  success: boolean
  error?: string
}

export async function loginAction(
  username: string,
  password: string,
): Promise<LoginResult> {
  const credentials = { username, password }
  const status = await checkRegistryStatus(credentials)

  if (status.authenticated) {
    await setSession(username, password)
    return { success: true }
  }

  return {
    success: false,
    error: status.error ?? "Authentication failed",
  }
}

export async function logoutAction(): Promise<void> {
  await clearSession()
}

export async function fetchRepositoriesAction(
  last?: string,
): Promise<CatalogResponse> {
  const credentials = await getSession()
  return listRepositories(credentials, 100, last)
}

export async function fetchTagsAction(repoName: string): Promise<TagsResponse> {
  const credentials = await getSession()
  return listTags(repoName, credentials)
}

export async function fetchManifestAction(
  repoName: string,
  reference: string,
): Promise<ManifestResult> {
  const credentials = await getSession()
  return getManifest(repoName, reference, credentials)
}
