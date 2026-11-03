import { useEffect, useState } from "react";
import { Check, ChevronRight, Hash, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useJoinChannel, useSearchChannels } from "@/hooks/use-channels.ts";

export const ChannelSearch = ({ workspaceId }: { workspaceId: string }) => {
  const [open, setOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const { data: channels = [], isPending, isError } = useSearchChannels(workspaceId, search);
  const { mutate: joinChannelMutation, isPending: joinChannelIsPending } = useJoinChannel();

  const resetSearch = () => {
    setSearchInput("");
    setSearch("");
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) resetSearch();
  };

  const handleJoin = (channelId: string) => {
    if (joinChannelIsPending) return;

    joinChannelMutation(channelId, {
      onSuccess: () => {
        setOpen(false);
        resetSearch();
        navigate("/" + workspaceId + "/" + channelId);
      },
    });
  };

  const handleSelect = (channelId: string, isJoined: boolean) => {
    if (isJoined) {
      setOpen(false);
      resetSearch();
      navigate("/" + workspaceId + "/" + channelId);
      return;
    }

    handleJoin(channelId);
  };

  useEffect(() => {
    const timer = window.setTimeout(() => setSearch(searchInput.trim()), 250);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const tagName = target?.tagName?.toLowerCase();
      const isTyping =
        tagName === "input" ||
        tagName === "textarea" ||
        Boolean(target?.isContentEditable);

      if (event.key === "/" && !isTyping && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        setOpen(true);
      }

      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm" className="cote-search-trigger h-9 gap-2 px-3">
            <Search className="size-3.5" />
            <span>Search channels</span>
            <kbd className="ml-1 hidden rounded-md border border-border bg-muted px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground sm:inline">
              /
            </kbd>
          </Button>
        }
      />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Find a channel</DialogTitle>
          <DialogDescription>Search this workspace and join a conversation.</DialogDescription>
        </DialogHeader>

        <div className="relative mt-2">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            autoFocus
            placeholder="Search by channel name…"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            className="h-11 rounded-xl pl-10 pr-10 text-[13px]"
          />
          {searchInput && (
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label="Clear search"
              className="absolute right-2 top-1/2 size-7 -translate-y-1/2 text-muted-foreground"
              onClick={resetSearch}
            >
              <X className="size-3.5" />
            </Button>
          )}
        </div>

        <div className="mt-1 max-h-[340px] overflow-y-auto pr-1">
          {!search.trim() ? (
            <div className="flex flex-col items-center py-9 text-center">
              <div className="mb-3 flex size-11 items-center justify-center rounded-xl border border-border bg-muted/60 text-muted-foreground">
                <Hash className="size-5" />
              </div>
              <p className="text-[13px] font-medium text-foreground">Explore your workspace</p>
              <p className="mt-1 text-xs text-muted-foreground">Start typing to find a channel.</p>
            </div>
          ) : isPending ? (
            <p className="py-9 text-center text-xs text-muted-foreground">Searching channels…</p>
          ) : isError ? (
            <p className="py-9 text-center text-xs text-destructive">
              Couldn’t search channels. Try again.
            </p>
          ) : channels.length === 0 ? (
            <div className="py-9 text-center">
              <p className="text-[13px] font-medium text-foreground">No channels found</p>
              <p className="mt-1 text-xs text-muted-foreground">Try a different search term.</p>
            </div>
          ) : (
            <div className="space-y-1 py-1">
              {channels.map((channel) => (
                <button
                  key={channel.id}
                  type="button"
                  className="cote-search-result"
                  onClick={() => handleSelect(channel.id, channel.isJoined)}
                  disabled={!channel.isJoined && joinChannelIsPending}
                >
                  <span className="cote-search-result-icon">
                    <Hash className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-semibold text-foreground">
                      {channel.name}
                    </span>
                    <span className="mt-0.5 block text-[10px] text-muted-foreground">
                      {channel.isJoined ? "You’re a member" : "Join this channel"}
                    </span>
                  </span>
                  {channel.isJoined ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-[10px] font-medium text-muted-foreground">
                      <Check className="size-3" /> Joined
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
                      Join <ChevronRight className="size-3.5" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};