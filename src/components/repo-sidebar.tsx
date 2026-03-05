"use client"

import { useCallback, useEffect, useState } from "react"

import { Box, Loader2, Search } from "lucide-react"

import { fetchRepositoriesAction } from "~/app/actions"
import { Input } from "~/components/ui/input"
import { ScrollArea } from "~/components/ui/scroll-area"
import { Skeleton } from "~/components/ui/skeleton"
import { cn } from "~/lib/utils"

interface RepoSidebarProps {
  selectedRepo: string | null
  onSelectRepo: (repo: string) => void
}

export function RepoSidebar({ selectedRepo, onSelectRepo }: RepoSidebarProps) {
  const [repositories, setRepositories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [hasMore, setHasMore] = useState(false)
  const [lastRepo, setLastRepo] = useState<string | undefined>()
  const [error, setError] = useState<string | null>(null)

  const loadRepositories = useCallback(async (last?: string) => {
    try {
      if (last) {
        setLoadingMore(true)
      } else {
        setLoading(true)
      }

      const result = await fetchRepositoriesAction(last)
      setRepositories((prev) =>
        last ? [...prev, ...result.repositories] : result.repositories,
      )
      setHasMore(result.hasMore)
      setLastRepo(result.last)
      setError(null)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load repositories",
      )
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  useEffect(() => {
    void loadRepositories()
  }, [loadRepositories])

  const filteredRepos = searchQuery
    ? repositories.filter((repo) =>
        repo.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : repositories

  if (loading) {
    return (
      <div className="flex h-full flex-col gap-3 p-3">
        <Skeleton className="h-9 w-full" />
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center">
        <p className="text-destructive text-sm">{error}</p>
        <button
          onClick={() => void loadRepositories()}
          className="text-primary text-sm underline underline-offset-2 hover:no-underline"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="p-3 pb-2">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
          <Input
            placeholder="Search repositories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="px-2 pb-2">
          {filteredRepos.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
              <Box className="text-muted-foreground h-8 w-8" />
              <p className="text-muted-foreground text-sm">
                {searchQuery
                  ? "No matching repositories"
                  : "No repositories found"}
              </p>
            </div>
          ) : (
            <>
              {filteredRepos.map((repo) => (
                <button
                  key={repo}
                  onClick={() => onSelectRepo(repo)}
                  className={cn(
                    "hover:bg-accent flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors",
                    selectedRepo === repo &&
                      "bg-accent text-accent-foreground font-medium",
                  )}
                >
                  <Box className="text-muted-foreground h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{repo}</span>
                </button>
              ))}
              {hasMore && !searchQuery && (
                <button
                  onClick={() => void loadRepositories(lastRepo)}
                  disabled={loadingMore}
                  className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex w-full items-center justify-center gap-2 rounded-md px-3 py-2 text-sm transition-colors"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Load more"
                  )}
                </button>
              )}
            </>
          )}
        </div>
      </ScrollArea>
      <div className="border-border border-t px-3 py-2">
        <p className="text-muted-foreground text-xs">
          {repositories.length} repositor
          {repositories.length === 1 ? "y" : "ies"}
        </p>
      </div>
    </div>
  )
}
