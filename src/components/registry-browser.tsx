"use client"

import { useState } from "react"

import { Box, Menu } from "lucide-react"

import { ManifestDetail } from "~/components/manifest-detail"
import { RepoSidebar } from "~/components/repo-sidebar"
import { TagList } from "~/components/tag-list"
import { Button } from "~/components/ui/button"
import { ScrollArea } from "~/components/ui/scroll-area"
import { Separator } from "~/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet"

export function RegistryBrowser() {
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const handleSelectRepo = (repo: string) => {
    setSelectedRepo(repo)
    setSelectedTag(null)
    setSheetOpen(false)
  }

  const handleSelectTag = (tag: string) => {
    setSelectedTag(tag)
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="border-border hidden w-72 shrink-0 border-r md:block">
        <RepoSidebar
          selectedRepo={selectedRepo}
          onSelectRepo={handleSelectRepo}
        />
      </aside>

      {/* Mobile sidebar trigger */}
      <div className="fixed bottom-4 left-4 z-40 md:hidden">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button size="icon" className="h-12 w-12 rounded-full shadow-lg">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open repositories</span>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Repositories</SheetTitle>
              <SheetDescription>Select a repository to browse</SheetDescription>
            </SheetHeader>
            <div className="mt-4 h-[calc(100vh-8rem)]">
              <RepoSidebar
                selectedRepo={selectedRepo}
                onSelectRepo={handleSelectRepo}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 md:p-6">
            {!selectedRepo ? (
              <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
                <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full">
                  <Box className="text-muted-foreground h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Select a Repository</h2>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Choose a repository from the sidebar to view its tags and
                    manifests
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <TagList
                  repoName={selectedRepo}
                  selectedTag={selectedTag}
                  onSelectTag={handleSelectTag}
                />
                {selectedTag && (
                  <>
                    <Separator />
                    <ManifestDetail repoName={selectedRepo} tag={selectedTag} />
                  </>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </main>
    </div>
  )
}
