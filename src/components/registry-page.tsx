"use client"

import { useCallback, useState } from "react"

import { useRouter } from "next/navigation"

import { WifiOff } from "lucide-react"

import { getRegistryStatusAction, logoutAction } from "~/app/actions"
import { Header } from "~/components/header"
import { LoginForm } from "~/components/login-form"
import { RegistryBrowser } from "~/components/registry-browser"
import type { RegistryStatus } from "~/lib/registry"

interface RegistryPageProps {
  initialStatus: RegistryStatus
  registryUrl: string
}

export function RegistryPage({
  initialStatus,
  registryUrl,
}: RegistryPageProps) {
  const [status, setStatus] = useState<RegistryStatus>(initialStatus)
  const router = useRouter()

  const handleLoginSuccess = useCallback(async () => {
    const newStatus = await getRegistryStatusAction()
    setStatus(newStatus)
    router.refresh()
  }, [router])

  const handleLogout = useCallback(async () => {
    await logoutAction()
    const newStatus = await getRegistryStatusAction()
    setStatus(newStatus)
    router.refresh()
  }, [router])

  // Registry not connected
  if (!status.connected) {
    return (
      <div className="flex h-screen flex-col">
        <Header registryUrl={registryUrl} isAuthenticated={false} />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4 text-center">
          <div className="bg-destructive/10 flex h-16 w-16 items-center justify-center rounded-full">
            <WifiOff className="text-destructive h-8 w-8" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">
              Cannot Connect to Registry
            </h2>
            <p className="text-muted-foreground mt-1 max-w-md text-sm">
              {status.error ?? `Unable to reach ${registryUrl}`}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Requires auth and not authenticated
  if (status.requiresAuth && !status.authenticated) {
    return (
      <div className="flex h-screen flex-col">
        <Header registryUrl={registryUrl} isAuthenticated={false} />
        <LoginForm
          registryUrl={registryUrl}
          onSuccess={() => void handleLoginSuccess()}
        />
      </div>
    )
  }

  // Authenticated or no auth required
  return (
    <div className="flex h-screen flex-col">
      <Header
        registryUrl={registryUrl}
        isAuthenticated={status.requiresAuth}
        onLogout={status.requiresAuth ? () => void handleLogout() : undefined}
      />
      <RegistryBrowser />
    </div>
  )
}
