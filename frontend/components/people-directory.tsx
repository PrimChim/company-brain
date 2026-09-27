"use client";

import { useMemo, useState } from "react";
import {
  Archive,
  ArchiveX,
  Bell,
  Briefcase,
  Check,
  Loader2,
  MoreHorizontal,
  Search,
  BriefcaseBusiness,
  Edit2,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Plus,
  Trash2,
  UserPlus,
  Users,
  X,
  } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  } from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { WorkspaceBrand, WorkspaceNav } from "@/components/workspace-nav";
import { ProfileMenu } from "@/components/profile-menu";
import { ApiError } from "next/dist/server/api-utils";

type Person = {
  uid: string;
  name: string;
  role: string;
  assignedEntries?: number;
  projects?: string[];
};

const fallbackPeople: Person[] = [
  {
    uid: "noah-lee",
    name: "Noah Lee",
    role: "Operations",
    assignedEntries: 9,
    projects: ["Identity"],
  },
];

const roleStyles: Record<string, string> = {
  Founder:
    "bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/20",
  Engineer:
    "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
  Operations:
    "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
  Designer:
    "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
};

export function PeopleDirectory({
  initialPeople = [],
}: {
  initialPeople?: Person[];
}) {
  const [people, setPeople] = useState<Person[]>(
    initialPeople.length ? initialPeople : fallbackPeople,
  );
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Person | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Person | null>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  const filtered = useMemo(
    () =>
      people.filter((person) =>
        `${person.name} ${person.role}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [people, query],
  );
  const initials = (person: Person) =>
    person.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  const addPerson = async () => {
    if (!name.trim() || !role.trim()) return;
    setSaving(true);
    const person = {
      uid: `${name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
      name: name.trim(),
      role: role.trim(),
    };
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${API_BASE}/brain/api/people/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: person.name, role: person.role }),
      });
      if (response.ok) {
        const created = await response.json();
        setPeople((current) => [...current, { ...person, ...created }]);
      } else setPeople((current) => [...current, person]);
    } catch {
      setPeople((current) => [...current, person]);
    }
    setName("");
    setRole("");
    setSaving(false);
    setAddOpen(false);
  };
  const deletePerson = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL;

      await fetch(
        `${API_BASE}/brain/api/people/${encodeURIComponent(deleteTarget.uid)}/`,
        { method: "DELETE" },
      );
    } finally {
      setPeople((current) =>
        current.filter((person) => person.uid !== deleteTarget.uid),
      );
      setSelected(null);
      setDeleteTarget(null);
      setDeleting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-360 items-center justify-between px-5 py-4 lg:px-10">
          <WorkspaceBrand subtitle="Team workspace" />
          <div className="flex items-center gap-3">
            <WorkspaceNav />
            <ProfileMenu />
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-360 px-5 py-8 lg:px-10 lg:py-12">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Workspace / people
            </p>
            <h1 className="text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
              People directory
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Manage the people who contribute context, decisions, and momentum
              across your projects.
            </p>
          </div>
          <Button onClick={() => setAddOpen(true)}>
            <Plus data-icon="inline-start" /> Add person
          </Button>
        </div>
        <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-3">
          <Stat label="Team members" value={people.length} icon={<Users />} />
          <Stat
            label="Roles represented"
            value={new Set(people.map((person) => person.role)).size}
            icon={<BriefcaseBusiness />}
          />
          <Stat
            label="Assigned entries"
            value={people.reduce(
              (total, person) => total + (person.assignedEntries || 0),
              0,
            )}
            icon={<Check />}
          />
        </div>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search people or roles..."
              className="h-11 pl-10 pr-10"
            />
            {query && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2"
                onClick={() => setQuery("")}
                aria-label="Clear search"
              >
                <X />
              </Button>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {filtered.length}
            </span>{" "}
            people
          </p>
        </div>
        {filtered.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((person) => (
              <PersonCard
                key={person.uid}
                person={person}
                initials={initials(person)}
                onOpen={() => setSelected(person)}
                onDelete={() => setDeleteTarget(person)}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center gap-2 py-16 text-center">
              <Search className="text-muted-foreground" />
              <p className="font-medium">No people found</p>
              <p className="text-sm text-muted-foreground">
                Try a different name or role.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
      <Sheet
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
      >
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          <SheetHeader className="border-b pb-6">
            <div className="flex items-center gap-4">
              <Avatar className="size-14">
                <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
                  {selected && initials(selected)}
                </AvatarFallback>
              </Avatar>
              <div>
                <SheetTitle className="text-2xl tracking-tight">
                  {selected?.name}
                </SheetTitle>
                <SheetDescription className="mt-1">
                  {selected?.role}
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>
          {selected && (
            <div className="flex flex-col gap-7 py-6 pl-6">
              <div className="grid grid-cols-2 gap-4">
                <Detail label="Member ID" value={selected.uid} />
                <Detail label="Role" value={selected.role} />
              </div>
              <Separator />
              <div>
                <h3 className="mb-3 text-sm font-semibold">Assigned entries</h3>
                <div className="rounded-xl border bg-muted/30 p-5">
                  <p className="text-3xl font-semibold tracking-tight">
                    {selected.assignedEntries || 0}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Knowledge entries owned by {selected.name.split(" ")[0]}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-semibold">
                  Connected projects
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(selected.projects || ["No projects yet"]).map((project) => (
                    <Badge key={project} variant="secondary">
                      {project}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button
                variant="destructive"
                onClick={() => setDeleteTarget(selected)}
              >
                <Trash2 data-icon="inline-start" /> Delete person
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a person</DialogTitle>
            <DialogDescription>
              Add a teammate to the Atlas workspace.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <label
              className="flex flex-col gap-2 text-sm font-medium"
              htmlFor="person-name"
            >
              Full name
              <Input
                id="person-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Alex Morgan"
              />
            </label>
            <label
              className="flex flex-col gap-2 text-sm font-medium"
              htmlFor="person-role"
            >
              Role
              <Input
                id="person-role"
                value={role}
                onChange={(event) => setRole(event.target.value)}
                placeholder="e.g. Engineer"
              />
            </label>
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button
              onClick={addPerson}
              disabled={saving || !name.trim() || !role.trim()}
            >
              {saving && (
                <Loader2 className="animate-spin" data-icon="inline-start" />
              )}{" "}
              Add person
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {deleteTarget?.name}?</DialogTitle>
            <DialogDescription>
              This will remove this person from the directory. This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button
              variant="destructive"
              onClick={deletePerson}
              disabled={deleting}
            >
              {deleting && (
                <Loader2 className="animate-spin" data-icon="inline-start" />
              )}{" "}
              Delete person
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}

function PersonCard({
  person,
  initials,
  onOpen,
  onDelete,
}: {
  person: Person;
  initials: string;
  onOpen: () => void;
  onDelete: () => void;
}) {
  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(event) =>
        (event.key === "Enter" || event.key === " ") && onOpen()
      }
      className="group cursor-pointer transition-shadow hover:shadow-md"
    >
      <CardContent className="flex items-start gap-4 p-5">
        <Avatar className="size-12">
          <AvatarFallback className="bg-primary/10 font-semibold text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="truncate font-semibold">{person.name}</h2>
              <Badge
                variant="outline"
                className={cn("mt-2", roleStyles[person.role] || "")}
              >
                {person.role}
              </Badge>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Actions for ${person.name}`}
                    onClick={(event) => event.stopPropagation()}
                  />
                }
              >
                <MoreHorizontal />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  variant="destructive"
                  onClick={(event) => {
                    event.stopPropagation();
                    onDelete();
                  }}
                >
                  <Trash2 data-icon="inline-start" /> Delete person
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            {person.assignedEntries || 0} assigned entries
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4 lg:p-5">
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
        </div>
        <div className="text-muted-foreground">{icon}</div>
      </CardContent>
    </Card>
  );
}
function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 truncate text-sm font-medium">{value}</p>
    </div>
  );
}
