"use client";

import { FormEvent, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Check,
  CheckIcon,
  ChevronDown,
  ChevronsUpDown,
  Loader2,
  Search,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";

type CreationContext = "person" | "project" | "entry";

type ContextCreateModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

function getCreationContext(pathname: string): CreationContext {
  if (pathname.startsWith("/people")) return "person";
  if (pathname.startsWith("/projects")) return "project";
  return "entry";
}

export function ContextCreateModal({ open, onOpenChange, }: ContextCreateModalProps) {

  const pathname = usePathname();
  const router = useRouter();
  const context = getCreationContext(pathname);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [assignedPeople, setAssignedPeople] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [entryType, setEntryType] = useState("decision");
  const [content, setContent] = useState("");
  const [project, setProject] = useState<{ name: string, uid: string }>();
  const [status, setStatus] = useState("open");
  const [involvedPeople, setInvolvedPeople] = useState<string[]>([]);
  const [involvedPeopleIds, setInvolvedPeopleIds] = useState<string[]>([]);
  const [peopleSearch, setPeopleSearch] = useState("");
  const [peopleOpen, setPeopleOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);

  const [people, setPeopleOptions] = useState<{ name: string, uid: string, role: string }[]>([]);

  const [projects, setProjects] = useState<{ name: string, uid: string }[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleGetPeopleInvolved = async () => {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL;
    try {
      const res = await fetch(`${API_BASE}/brain/api/people/`);
      if (res.ok) {
        const data = await res.json();

        // Standardize response into objects matching the state type
        const formattedPeople = data.map((item: any) => ({
          name: typeof item === "string" ? item : item.name || "",
          uid: item.uid || item.id || "",
          role: item.role || "Member",
        }));

        setPeopleOptions(formattedPeople);
      }
    } catch (err) {
      console.error("Failed to load people:", err);
    }
  };

  const handleGetProjects = async () => {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL;
    try {
      const res = await fetch(`${API_BASE}/brain/api/projects/`);
      if (res.ok) {
        const data = await res.json();

        // Standardize response into objects matching the state type
        const formattedProjects = data.projects.map((item: any) => ({
          name: typeof item === "string" ? item : item.name || "",
          uid: item.uid || item.id || "",
        }));

        setProjects(formattedProjects);
      }
    } catch (err) {
      console.error("Failed to load project:", err);
    }
  };

  useEffect(() => {
    if (!open) {
      setName("");
      setRole("");
      setProjectDescription("");
      setAssignedPeople([]);
      setTitle("");
      setEntryType("decision");
      setContent("");
      setProject({ name: "", uid: "" });
      setStatus("open");
      setInvolvedPeople([]);
      setInvolvedPeopleIds([]);
      setPeopleSearch("");
      setPeopleOpen(false);
      setProjectOpen(false);
      setSaved(false);
      setError("");
      handleGetPeopleInvolved();
      handleGetProjects();
    }
  }, [open]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    const payload =
      context === "person"
        ? { name: name.trim(), role: role.trim() }
        : context === "project"
          ? {
            name: name.trim(),
            description: projectDescription.trim(),
            assigned_people: assignedPeople,
          }
          : {
            title: title.trim(),
            type: entryType,
            content: content.trim(),
            projectId: project?.uid,
            status,
            involvedIds: involvedPeopleIds,
          };

    const endpoint = context === "person" ? "/brain/api/people/" : context === "project" ? "/brain/api/projects/" : "/brain/api/entries/";

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok)
        throw new Error("The server could not create this item.");
      setSaved(true);
      router.refresh();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  // title and description for forms
  const titleText = context === "person" ? "Create person" : context === "project" ? "Create project" : "Create knowledge entry";
  const description = context === "person" ? "Add a teammate to your workspace." : context === "project" ? "Create a new project node for your knowledge base." : "Capture a decision, task, risk, or fact for your team.";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto p-0 sm:max-w-2xl">
        {saved ? (
          <>
            <SheetHeader className="border-b px-6 py-5">
              <SheetTitle className="flex items-center gap-2">
                <Check className="text-primary" /> Created successfully
              </SheetTitle>
              <SheetDescription>
                Your new {context} is now available in the workspace.
              </SheetDescription>
            </SheetHeader>
            <SheetFooter>
              <Button type="button" onClick={() => onOpenChange(false)}>
                Done
              </Button>
            </SheetFooter>
          </>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-5">
            <SheetHeader className="border-b px-6 py-5">
              <SheetTitle>{titleText}</SheetTitle>
              <SheetDescription>{description}</SheetDescription>
            </SheetHeader>
            {context === "person" && (
              <div className="flex flex-col gap-3 px-6 py-2">
                <label
                  htmlFor="create-person-name"
                  className="text-sm font-medium"
                >
                  Name
                </label>
                <Input
                  id="create-person-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. Alex Morgan"
                  required
                />
                <label
                  htmlFor="create-person-role"
                  className="text-sm font-medium"
                >
                  Role
                </label>
                <Input
                  id="create-person-role"
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                  placeholder="e.g. Engineer"
                  required
                />
              </div>
            )}
            {context === "project" && (
              <div className="flex flex-col gap-6 px-6 py-2">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="create-project-name"
                    className="text-sm font-medium"
                  >
                    Project name
                  </label>
                  <Input
                    id="create-project-name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="e.g. Research Hub"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="create-project-description"
                    className="text-sm font-medium"
                  >
                    Project description
                  </label>
                  <textarea
                    id="create-project-description"
                    value={projectDescription}
                    onChange={(event) =>
                      setProjectDescription(event.target.value)
                    }
                    placeholder="What is this project about?"
                    className="min-h-28 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <fieldset className="flex flex-col gap-3">
                  <legend className="text-sm font-medium">
                    Assigned people
                  </legend>
                  <p className="text-xs text-muted-foreground">
                    Select the team members connected to this project.
                  </p>
                  <details className="group relative">
                    <summary className="flex min-h-10 cursor-pointer list-none items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
                      <span
                        className={
                          assignedPeople.length
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }
                      >
                        {assignedPeople.length
                          ? `${assignedPeople.length} ${assignedPeople.length === 1 ? "person" : "people"} selected`
                          : "Select people"}
                      </span>
                      <ChevronDown
                        className="size-4 text-muted-foreground transition-transform group-open:rotate-180"
                        aria-hidden="true"
                      />
                    </summary>
                    <div className="absolute inset-x-0 top-full z-10 mt-2 flex flex-col gap-1 rounded-lg border border-border bg-popover p-2 text-popover-foreground shadow-lg">
                      {[
                        "Pritam Gurung",
                        "Alex Morgan",
                        "Maya Shrestha",
                        "Samir Thapa",
                      ].map((person) => {
                        const selected = assignedPeople.includes(person);
                        return (
                          <label
                            key={person}
                            className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-muted"
                          >
                            <input
                              type="checkbox"
                              checked={selected}
                              onChange={() =>
                                setAssignedPeople((current) =>
                                  selected
                                    ? current.filter((name) => name !== person)
                                    : [...current, person],
                                )
                              }
                              className="size-4 accent-primary"
                            />
                            {person}
                          </label>
                        );
                      })}
                    </div>
                  </details>
                  {assignedPeople.length > 0 && (
                    <div
                      className="flex flex-wrap gap-2"
                      aria-label="Selected people"
                    >
                      {assignedPeople.map((person) => (
                        <span
                          key={person}
                          className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                        >
                          {person}
                        </span>
                      ))}
                    </div>
                  )}
                </fieldset>
              </div>
            )}
            {context === "entry" && (
              <div className="grid gap-4 px-6 py-2 sm:grid-cols-2">
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label
                    htmlFor="create-entry-title"
                    className="text-sm font-medium"
                  >
                    Title
                  </label>
                  <Input
                    id="create-entry-title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="What should the team remember?"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="create-entry-type"
                    className="text-sm font-medium"
                  >
                    Entry type
                  </label>
                  <select
                    id="create-entry-type"
                    value={entryType}
                    onChange={(event) => setEntryType(event.target.value)}
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="decision">Decision</option>
                    <option value="task">Task</option>
                    <option value="risk">Risk</option>
                    <option value="fact">Fact</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="create-entry-status"
                    className="text-sm font-medium"
                  >
                    Status
                  </label>
                  <div className="relative">
                    <select
                      id="create-entry-status"
                      value={status}
                      onChange={(event) => setStatus(event.target.value)}
                      className="h-10 w-full appearance-none rounded-md border border-input bg-background px-3 pr-9 text-sm transition-all duration-200 hover:bg-muted/40"
                    >
                      <option value="open">Proposed</option>
                      <option value="in_progress">In Progress</option>
                      <option value="done">Completed</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-3.5 size-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label
                    htmlFor="create-entry-content"
                    className="text-sm font-medium"
                  >
                    Content
                  </label>
                  <textarea
                    id="create-entry-content"
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    placeholder="Add useful context..."
                    className="min-h-28 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="create-entry-project"
                    className="text-sm font-medium"
                  >
                    Project
                  </label>
                  <details
                    id="create-entry-project"
                    className="group relative"
                    open={projectOpen}
                    onToggle={(event) =>
                      setProjectOpen(event.currentTarget.open)
                    }
                  >
                    <summary className="flex h-10 cursor-pointer list-none items-center justify-between rounded-md border border-input bg-background px-3 text-sm transition-all duration-200 hover:bg-muted/40 [&::-webkit-details-marker]:hidden">
                      <span
                        className={
                          project ? "text-foreground" : "text-muted-foreground"
                        }
                      >
                        {project?.name || "Select project"}
                      </span>
                      <ChevronDown
                        className="size-4 text-muted-foreground transition-transform group-open:rotate-180"
                        aria-hidden="true"
                      />
                    </summary>
                    <div className="absolute inset-x-0 top-full z-20 mt-2 flex flex-col gap-1 rounded-lg border border-border bg-popover p-2 text-popover-foreground shadow-lg">
                      {projects.map((projectOption) => (
                        <button
                          type="button"
                          key={projectOption.name}
                          onClick={() => {
                            setProject(projectOption);
                            setProjectOpen(false);
                          }}
                          className="flex items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-all duration-200 hover:bg-muted"
                        >
                          <span>{projectOption.name}</span>
                          {project === projectOption && (
                            <CheckIcon
                              className="text-primary"
                              aria-hidden="true"
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </details>
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="create-entry-people"
                    className="text-sm font-medium"
                  >
                    Involved people
                  </label>
                  <div className="relative">
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => setPeopleOpen((open) => !open)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ")
                          setPeopleOpen((open) => !open);
                      }}
                      className="flex min-h-10 w-full cursor-pointer items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-left text-sm transition-all duration-200 hover:bg-muted/40"
                    >
                      <span className="flex flex-1 flex-wrap gap-1.5">
                        {involvedPeople.length ? (
                          involvedPeople.map((person) => (
                            <Badge
                              key={person}
                              variant="secondary"
                              className="gap-1 rounded-md"
                            >
                              {person}
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();

                                  const personObj = people.find((p) => p.name === person);

                                  // Remove name
                                  setInvolvedPeople((current) => current.filter((item) => item !== person));

                                  // Remove UID using matched object's uid
                                  if (personObj?.uid) {
                                    setInvolvedPeopleIds((current) => current.filter((id) => id !== personObj.uid));
                                  }
                                }}
                                aria-label={`Remove ${person}`
                                }
                              >
                                <X />
                              </button>
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground">
                            Select people
                          </span>
                        )}
                      </span>
                      <ChevronsUpDown className="ml-2 shrink-0 text-muted-foreground" />
                    </div>
                    {peopleOpen && (
                      <div className="absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-lg border border-border bg-popover shadow-lg">
                        <div className="flex items-center gap-2 border-b border-border px-3">
                          <Search className="text-muted-foreground" />
                          <input
                            value={peopleSearch}
                            onChange={(event) =>
                              setPeopleSearch(event.target.value)
                            }
                            placeholder="Search people..."
                            className="h-10 flex-1 bg-transparent text-sm outline-none"
                          />
                        </div>
                        <div className="max-h-56 overflow-y-auto p-2">
                          {people
                            .filter((person) =>
                              person.name
                                .toLowerCase()
                                .includes(peopleSearch.toLowerCase()),
                            )
                            .map((person) => {
                              const selected = involvedPeople.includes(
                                person.name,
                              );
                              return (
                                <button
                                  type="button"
                                  key={person.name}
                                  onClick={() => {
                                    setInvolvedPeople((current) =>
                                      selected
                                        ? current.filter(
                                          (item) => item !== person.name,
                                        )
                                        : [...current, person.name],
                                    )
                                    setInvolvedPeopleIds((current) =>
                                      selected
                                        ? current.filter(
                                          (item) => item !== person.uid,
                                        )
                                        : [...current, person.uid],
                                    )
                                  }
                                  }
                                  className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left transition-all duration-200 hover:bg-muted"
                                >
                                  <span>
                                    <span className="block font-medium">
                                      {person.name}
                                    </span>
                                    <span className="block text-xs text-muted-foreground">
                                      {person.role}
                                    </span>
                                  </span>
                                  {selected && (
                                    <CheckIcon className="text-primary" />
                                  )}
                                </button>
                              );
                            })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
            <SheetFooter className="flex-row gap-2 border-t bg-background">
              <Button
                className="flex-1"
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button className="flex-1" type="submit" disabled={saving}>
                {saving && (
                  <Loader2 className="animate-spin" data-icon="inline-start" />
                )}{" "}
                {saving ? "Creating..." : "Create"}
              </Button>
            </SheetFooter>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}

export type { CreationContext };