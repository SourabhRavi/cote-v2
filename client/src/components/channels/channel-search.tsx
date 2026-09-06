import { useEffect, useState } from "react";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useJoinChannel, useSearchChannels } from "@/hooks/use-channels.ts";
import { useNavigate } from "react-router-dom";

export const ChannelSearch = ({ workspaceId }: { workspaceId: string }) => {
  const [open, setOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const { data: channels = [], isPending, isError } = useSearchChannels(workspaceId, search);

  const { mutate: joinChannelMutation, isPending: joinChannelIsPending } =
    useJoinChannel(workspaceId);

  const handleJoin = (channelId: string) => {
    joinChannelMutation(channelId, {
      onSuccess: () => {
        navigate(`/${workspaceId}/${channelId}`);
      },
    });

    console.log("clocked");

    navigate(`/${workspaceId}/${channelId}`);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [searchInput]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" className="h-8 gap-2 text-xs" />}>
        <Search className="size-3.5" />
        <span className="hidden sm:inline">Search channels</span>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Search channels</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            autoFocus
            placeholder="Search channels..."
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />

          <div className="max-h-80 overflow-y-auto">
            {!search.trim() ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Search for a channel to join.
              </p>
            ) : isPending ? (
              <p className="py-8 text-center text-sm text-muted-foreground">Searching...</p>
            ) : isError ? (
              <p className="py-8 text-center text-sm text-destructive">
                Failed to search channels.
              </p>
            ) : channels.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No channels found.</p>
            ) : (
              <div className="space-y-1">
                {channels.map((channel) => {
                  return (
                    <div
                      key={channel.id}
                      className="flex items-center justify-between gap-3 rounded-md px-3 py-2 hover:bg-muted"
                      onClick={() => {
                        navigate(`/${workspaceId}/${channel.id}`);
                        setSearch("");
                        setOpen(false);
                      }}
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium"># {channel.name}</p>
                      </div>

                      {channel.isJoined ? (
                        <span className="shrink-0 text-xs text-muted-foreground">Joined</span>
                      ) : (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleJoin(channel.id);
                          }}
                          disabled={joinChannelIsPending}
                        >
                          {joinChannelIsPending ? "Joining..." : "Join"}
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
