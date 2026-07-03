"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  Briefcase,
  MessageSquare,
  User2,
  Link2,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Search,
  Star,
  Eye,
  EyeOff,
  X,
  Menu,
  CalendarDays,
  Upload,
} from "lucide-react";
import {
  usePortfolio,
  newProject,
  newExperience,
  type Project,
  type Experience,
  formatMonth,
  experienceDuration,
} from "@/lib/portfolio-store";
import { TechBadge } from "@/components/site/TechBadge";

type Tab = "dashboard" | "projects" | "experience" | "messages" | "social" | "profile";

export default function AdminPage() {
  const auth = usePortfolio((s) => s.auth);
  const loading = usePortfolio((s) => s.loading);
  const checkSession = usePortfolio((s) => s.checkSession);
  const sessionChecked = useRef(false);

  useEffect(() => {
    if (sessionChecked.current) return;
    sessionChecked.current = true;
    void checkSession();
  }, [checkSession]);

  if (loading) {
    return (
      <div className="relative grid min-h-screen place-items-center px-4">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-grid" />
        <div className="font-display text-sm text-muted-foreground">Loading admin...</div>
      </div>
    );
  }

  if (!auth) return <LoginScreen />;
  return <AdminShell />;
}

function LoginScreen() {
  const login = usePortfolio((s) => s.login);
  const [u, setU] = useState("admin");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!(await login(u, p))) setErr("Invalid credentials.");
  }

  return (
    <div className="relative grid min-h-screen place-items-center px-4">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[500px] bg-hero-glow" />

      <form
        onSubmit={submit}
        className="glow-border w-full max-w-sm rounded-3xl border border-border/60 bg-card/70 p-8 backdrop-blur"
      >
        <div className="mb-6 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/30">
            <User2 className="h-6 w-6" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold">Admin access</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to manage your portfolio</p>
        </div>

        <label className="block">
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Username
          </span>
          <input value={u} onChange={(e) => setU(e.target.value)} className="admin-input mt-1.5" />
        </label>
        <label className="mt-4 block">
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Password
          </span>
          <input
            type="password"
            value={p}
            onChange={(e) => setP(e.target.value)}
            className="admin-input mt-1.5"
          />
        </label>
        {err && <p className="mt-3 text-sm text-destructive">{err}</p>}
        <button
          type="submit"
          className="mt-6 w-full rounded-full bg-gradient-to-r from-primary to-primary/70 py-2.5 text-sm font-medium text-primary-foreground shadow-[var(--shadow-glow)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_0_60px_-10px_var(--neon)]"
        >
          Sign in
        </button>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Use the admin credentials configured in your environment.
        </p>
      </form>

      <AdminStyles />
    </div>
  );
}

function AdminShell() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const logout = usePortfolio((s) => s.logout);
  const error = usePortfolio((s) => s.error);

  async function handleLogout() {
    await logout();
    router.push("/");
    router.refresh();
  }

  const nav: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "projects", label: "Projects", icon: FolderKanban },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "profile", label: "Profile", icon: User2 },
    { id: "social", label: "Social", icon: Link2 },
  ];

  return (
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-grid" />
      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-border/50 bg-card/80 backdrop-blur-xl transition-transform md:sticky md:top-0 md:h-screen md:translate-x-0 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-16 items-center justify-between px-5">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-primary/50 text-primary-foreground">
                <LayoutDashboard className="h-4 w-4" />
              </span>
              <span className="font-display text-sm font-semibold">Admin</span>
            </div>
            <button
              className="md:hidden"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="mt-4 px-3">
            {nav.map((n) => (
              <button
                key={n.id}
                onClick={() => {
                  setTab(n.id);
                  setMobileOpen(false);
                }}
                className={`mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-300 ease-out ${
                  tab === n.id
                    ? "bg-primary/15 text-primary ring-1 ring-primary/30"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <n.icon className="h-4 w-4" />
                {n.label}
              </button>
            ))}
          </nav>

          <div className="absolute inset-x-3 bottom-4">
            <button
              type="button"
              onClick={() => {
                router.push("/");
                router.refresh();
              }}
              className="mb-2 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-muted-foreground transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-muted hover:text-foreground"
            >
              <Eye className="h-4 w-4" /> View site
            </button>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-muted hover:text-foreground"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </aside>

        {mobileOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Main */}
        <div className="flex-1 min-w-0">
          <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border/50 bg-background/70 px-4 backdrop-blur-xl md:px-8">
            <button
              className="md:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="font-display text-lg font-semibold capitalize">{tab}</h1>
          </header>

          <div className="p-4 md:p-8">
            {error && (
              <div className="mb-4 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}
            {tab === "dashboard" && <DashboardView setTab={setTab} />}
            {tab === "projects" && <ProjectsAdmin />}
            {tab === "experience" && <ExperienceAdmin />}
            {tab === "messages" && <MessagesAdmin />}
            {tab === "profile" && <ProfileAdmin />}
            {tab === "social" && <SocialAdmin />}
          </div>
        </div>
      </div>
      <AdminStyles />
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  onClick,
}: {
  label: string;
  value: number | string;
  icon: typeof LayoutDashboard;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="glow-border card-hover flex items-center justify-between rounded-2xl border border-border/60 bg-card/60 p-5 text-left backdrop-blur"
    >
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
        <p className="mt-2 font-display text-3xl font-bold">{value}</p>
      </div>
      <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/30">
        <Icon className="h-5 w-5" />
      </div>
    </button>
  );
}

function DashboardView({ setTab }: { setTab: (t: Tab) => void }) {
  const projects = usePortfolio((s) => s.projects);
  const experiences = usePortfolio((s) => s.experiences);
  const messages = usePortfolio((s) => s.messages);
  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Projects"
          value={projects.length}
          icon={FolderKanban}
          onClick={() => setTab("projects")}
        />
        <StatCard
          label="Experience"
          value={experiences.length}
          icon={Briefcase}
          onClick={() => setTab("experience")}
        />
        <StatCard
          label="Messages"
          value={messages.length}
          icon={MessageSquare}
          onClick={() => setTab("messages")}
        />
        <StatCard
          label="Unread"
          value={unread}
          icon={MessageSquare}
          onClick={() => setTab("messages")}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glow-border rounded-2xl border border-border/60 bg-card/60 p-6">
          <h3 className="font-display text-base font-semibold">Recent messages</h3>
          <ul className="mt-4 space-y-3">
            {messages.slice(0, 5).map((m) => (
              <li
                key={m.id}
                className="flex items-start justify-between gap-3 border-b border-border/50 pb-3 last:border-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{m.subject}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {m.name} · {m.email}
                  </p>
                </div>
                {!m.read && (
                  <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] text-primary">
                    new
                  </span>
                )}
              </li>
            ))}
            {messages.length === 0 && (
              <li className="text-sm text-muted-foreground">No messages yet.</li>
            )}
          </ul>
        </div>

        <div className="glow-border rounded-2xl border border-border/60 bg-card/60 p-6">
          <h3 className="font-display text-base font-semibold">Featured projects</h3>
          <ul className="mt-4 space-y-3">
            {projects
              .filter((p) => p.featured)
              .map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between gap-3 border-b border-border/50 pb-3 last:border-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{p.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {p.tech.slice(0, 4).join(" · ")}
                    </p>
                  </div>
                  <Star className="h-4 w-4 fill-primary text-primary" />
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ------------- PROJECTS ------------- */
function ProjectsAdmin() {
  const projects = usePortfolio((s) => s.projects);
  const upsert = usePortfolio((s) => s.upsertProject);
  const del = usePortfolio((s) => s.deleteProject);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Project | null>(null);

  const filtered = useMemo(
    () => projects.filter((p) => p.name.toLowerCase().includes(q.toLowerCase())),
    [projects, q],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="admin-input pl-9"
            placeholder="Search projects..."
          />
        </div>
        <button
          onClick={() => setEditing(newProject())}
          className="ml-auto inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-[var(--shadow-glow)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_0_60px_-10px_var(--neon)]"
        >
          <Plus className="h-4 w-4" /> Add project
        </button>
      </div>

      <div className="glow-border overflow-hidden rounded-2xl border border-border/60 bg-card/60">
        <table className="w-full text-sm">
          <thead className="border-b border-border/50 text-left text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4 hidden md:table-cell">Tech</th>
              <th className="p-4 hidden sm:table-cell">Order</th>
              <th className="p-4">Featured</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-border/40 last:border-0">
                <td className="p-4 font-medium">{p.name}</td>
                <td className="p-4 hidden md:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {p.tech.slice(0, 3).map((t) => (
                      <TechBadge key={t}>{t}</TechBadge>
                    ))}
                    {p.tech.length > 3 && (
                      <span className="text-xs text-muted-foreground">+{p.tech.length - 3}</span>
                    )}
                  </div>
                </td>
                <td className="p-4 hidden sm:table-cell text-muted-foreground">{p.order}</td>
                <td className="p-4">
                  {p.featured ? (
                    <Star className="h-4 w-4 fill-primary text-primary" />
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setEditing(p)} className="rounded-md p-2 hover:bg-muted">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => confirm(`Delete "${p.name}"?`) && del(p.id)}
                      className="rounded-md p-2 hover:bg-muted hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                  No projects.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <ProjectEditor
          initial={editing}
          onClose={() => setEditing(null)}
          onSave={async (p) => {
            await upsert(p);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function ProjectEditor({
  initial,
  onClose,
  onSave,
}: {
  initial: Project;
  onClose: () => void;
  onSave: (p: Project) => Promise<void>;
}) {
  const [p, setP] = useState<Project>(initial);
  const [techInput, setTechInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const uploadImage = usePortfolio((s) => s.uploadImage);

  function addTech() {
    const t = techInput.trim();
    if (t && !p.tech.includes(t)) setP({ ...p, tech: [...p.tech, t] });
    setTechInput("");
  }
  function addFeature() {
    const t = featureInput.trim();
    if (t) setP({ ...p, features: [...(p.features ?? []), t] });
    setFeatureInput("");
  }

  async function saveProject() {
    setError("");
    if (!p.name.trim()) {
      setError("Project name is required.");
      return;
    }
    if (!p.description.trim()) {
      setError("Short description is required.");
      return;
    }

    try {
      setSaving(true);
      await onSave(p);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save project.");
    } finally {
      setSaving(false);
    }
  }

  async function uploadProjectImage(file: File | undefined) {
    if (!file) return;

    try {
      setError("");
      setUploading(true);
      const url = await uploadImage(file, "projects");
      setP({ ...p, image: url });
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Could not upload image.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <Modal onClose={onClose} title={initial.name ? "Edit project" : "New project"}>
      <div className="grid gap-4 sm:grid-cols-2">
        <AdminField label="Name">
          <input
            className="admin-input"
            value={p.name}
            onChange={(e) => setP({ ...p, name: e.target.value })}
          />
        </AdminField>
        <AdminField label="Display order">
          <input
            type="number"
            className="admin-input admin-number-input"
            value={p.order}
            onChange={(e) => setP({ ...p, order: Number(e.target.value) || 0 })}
          />
        </AdminField>
      </div>

      <AdminField label="Short description" className="mt-4">
        <input
          className="admin-input"
          value={p.description}
          onChange={(e) => setP({ ...p, description: e.target.value })}
        />
      </AdminField>

      <AdminField label="Long description" className="mt-4">
        <textarea
          className="admin-input min-h-[100px]"
          value={p.longDescription}
          onChange={(e) => setP({ ...p, longDescription: e.target.value })}
        />
      </AdminField>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <AdminField label="Preview image URL">
          <div className="flex gap-2">
            <input
              className="admin-input min-w-0 flex-1"
              value={p.image}
              onChange={(e) => setP({ ...p, image: e.target.value })}
              placeholder="https://..."
            />
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 text-sm text-foreground transition-colors hover:bg-muted">
              <Upload className="h-4 w-4" />
              {uploading ? "Uploading..." : "Upload"}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                disabled={uploading}
                className="sr-only"
                onChange={(event) => {
                  void uploadProjectImage(event.target.files?.[0]);
                  event.target.value = "";
                }}
              />
            </label>
          </div>
        </AdminField>
        <AdminField label="Live URL">
          <input
            className="admin-input"
            value={p.liveUrl ?? ""}
            onChange={(e) => setP({ ...p, liveUrl: e.target.value })}
            placeholder="https://..."
          />
        </AdminField>
        <AdminField label="GitHub URL">
          <input
            className="admin-input"
            value={p.githubUrl ?? ""}
            onChange={(e) => setP({ ...p, githubUrl: e.target.value })}
            placeholder="https://github.com/..."
          />
        </AdminField>
        <label className="mt-6 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={p.featured}
            onChange={(e) => setP({ ...p, featured: e.target.checked })}
          />
          Featured project
        </label>
      </div>

      <AdminField label="Tech stack" className="mt-4">
        <div className="flex gap-2">
          <input
            className="admin-input flex-1"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTech();
              }
            }}
            placeholder="Add tech and press Enter"
          />
          <button
            type="button"
            onClick={addTech}
            className="rounded-md border border-border px-3 text-sm"
          >
            Add
          </button>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {p.tech.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setP({ ...p, tech: p.tech.filter((x) => x !== t) })}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-2.5 py-0.5 text-xs"
            >
              {t} <X className="h-3 w-3" />
            </button>
          ))}
        </div>
      </AdminField>

      <AdminField label="Key features" className="mt-4">
        <div className="flex gap-2">
          <input
            className="admin-input flex-1"
            value={featureInput}
            onChange={(e) => setFeatureInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addFeature();
              }
            }}
            placeholder="Add a feature and press Enter"
          />
          <button
            type="button"
            onClick={addFeature}
            className="rounded-md border border-border px-3 text-sm"
          >
            Add
          </button>
        </div>
        <ul className="mt-2 space-y-1 text-sm">
          {(p.features ?? []).map((f, i) => (
            <li
              key={i}
              className="flex items-center justify-between gap-2 rounded-md border border-border/50 px-3 py-1.5"
            >
              <span className="min-w-0 break-words">{f}</span>
              <button
                type="button"
                onClick={() => setP({ ...p, features: p.features!.filter((_, idx) => idx !== i) })}
                className="shrink-0 text-muted-foreground hover:text-destructive"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      </AdminField>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
      <ModalActions
        onCancel={onClose}
        onSave={saveProject}
        disabled={saving || !p.name.trim() || !p.description.trim()}
        saving={saving}
      />
    </Modal>
  );
}

/* ------------- EXPERIENCE ------------- */
function ExperienceAdmin() {
  const list = usePortfolio((s) => s.experiences);
  const upsert = usePortfolio((s) => s.upsertExperience);
  const del = usePortfolio((s) => s.deleteExperience);
  const [editing, setEditing] = useState<Experience | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <button
          onClick={() => setEditing(newExperience())}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-[var(--shadow-glow)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_0_60px_-10px_var(--neon)]"
        >
          <Plus className="h-4 w-4" /> Add experience
        </button>
      </div>

      <div className="grid gap-3">
        {list.map((e) => (
          <div
            key={e.id}
            className="glow-border rounded-2xl border border-border/60 bg-card/60 p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-base font-semibold">{e.position}</h3>
                <p className="text-sm text-muted-foreground">{e.company}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatMonth(e.startDate)} — {e.current ? "Present" : formatMonth(e.endDate)} ·{" "}
                  {experienceDuration(e)}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditing(e)} className="rounded-md p-2 hover:bg-muted">
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => confirm("Delete experience?") && del(e.id)}
                  className="rounded-md p-2 hover:bg-muted hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{e.description}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {e.tech.map((t) => (
                <TechBadge key={t}>{t}</TechBadge>
              ))}
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <ExperienceEditor
          initial={editing}
          onClose={() => setEditing(null)}
          onSave={async (e) => {
            await upsert(e);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function ExperienceEditor({
  initial,
  onClose,
  onSave,
}: {
  initial: Experience;
  onClose: () => void;
  onSave: (e: Experience) => Promise<void>;
}) {
  const [e, setE] = useState<Experience>(initial);
  const [techInput, setTechInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function saveExperience() {
    setError("");
    if (!e.company.trim()) {
      setError("Company is required.");
      return;
    }
    if (!e.position.trim()) {
      setError("Position is required.");
      return;
    }
    if (!e.description.trim()) {
      setError("Description is required.");
      return;
    }

    try {
      setSaving(true);
      await onSave(e);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save experience.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal onClose={onClose} title={initial.company ? "Edit experience" : "New experience"}>
      <div className="grid gap-4 sm:grid-cols-2">
        <AdminField label="Company">
          <input
            className="admin-input"
            value={e.company}
            onChange={(v) => setE({ ...e, company: v.target.value })}
          />
        </AdminField>
        <AdminField label="Position">
          <input
            className="admin-input"
            value={e.position}
            onChange={(v) => setE({ ...e, position: v.target.value })}
          />
        </AdminField>
        <AdminField label="Start date">
          <MonthInput value={e.startDate} onChange={(value) => setE({ ...e, startDate: value })} />
        </AdminField>
        <AdminField label="End date">
          <MonthInput
            disabled={e.current}
            value={e.endDate ?? ""}
            onChange={(value) => setE({ ...e, endDate: value })}
          />
        </AdminField>
      </div>
      <label className="mt-3 flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={e.current}
          onChange={(v) =>
            setE({
              ...e,
              current: v.target.checked,
              endDate: v.target.checked ? undefined : e.endDate,
            })
          }
        />
        I currently work here
      </label>

      <AdminField label="Description" className="mt-4">
        <textarea
          className="admin-input min-h-[120px]"
          value={e.description}
          onChange={(v) => setE({ ...e, description: v.target.value })}
        />
      </AdminField>

      <AdminField label="Technologies used" className="mt-4">
        <div className="flex gap-2">
          <input
            className="admin-input flex-1"
            value={techInput}
            onChange={(v) => setTechInput(v.target.value)}
            onKeyDown={(v) => {
              if (v.key === "Enter") {
                v.preventDefault();
                const t = techInput.trim();
                if (t && !e.tech.includes(t)) setE({ ...e, tech: [...e.tech, t] });
                setTechInput("");
              }
            }}
            placeholder="Add tech and press Enter"
          />
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {e.tech.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setE({ ...e, tech: e.tech.filter((x) => x !== t) })}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-2.5 py-0.5 text-xs"
            >
              {t} <X className="h-3 w-3" />
            </button>
          ))}
        </div>
      </AdminField>

      <ModalActions
        onCancel={onClose}
        onSave={saveExperience}
        disabled={saving || !e.company.trim() || !e.position.trim() || !e.description.trim()}
        saving={saving}
      />
      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
    </Modal>
  );
}

/* ------------- MESSAGES ------------- */
function MessagesAdmin() {
  const messages = usePortfolio((s) => s.messages);
  const toggle = usePortfolio((s) => s.toggleRead);
  const del = usePortfolio((s) => s.deleteMessage);
  const [open, setOpen] = useState<string | null>(null);
  const [q, setQ] = useState("");

  const filtered = messages.filter(
    (m) =>
      !q ||
      m.name.toLowerCase().includes(q.toLowerCase()) ||
      m.subject.toLowerCase().includes(q.toLowerCase()) ||
      m.email.toLowerCase().includes(q.toLowerCase()),
  );
  const selected = messages.find((m) => m.id === open);

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="admin-input pl-9"
          placeholder="Search messages..."
        />
      </div>

      <div className="glow-border overflow-hidden rounded-2xl border border-border/60 bg-card/60">
        <table className="w-full text-sm">
          <thead className="border-b border-border/50 text-left text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="p-4">From</th>
              <th className="p-4 hidden sm:table-cell">Subject</th>
              <th className="p-4 hidden md:table-cell">Received</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <tr
                key={m.id}
                className={`border-b border-border/40 last:border-0 ${!m.read ? "bg-primary/[0.03]" : ""}`}
              >
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {!m.read && <span className="h-2 w-2 rounded-full bg-primary" />}
                    <div>
                      <p className="font-medium">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{m.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 hidden sm:table-cell">{m.subject}</td>
                <td className="p-4 hidden md:table-cell text-muted-foreground text-xs">
                  {new Date(m.createdAt).toLocaleString()}
                </td>
                <td className="p-4">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => {
                        setOpen(m.id);
                        if (!m.read) toggle(m.id);
                      }}
                      className="rounded-md p-2 hover:bg-muted"
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => toggle(m.id)}
                      className="rounded-md p-2 hover:bg-muted"
                      title={m.read ? "Mark unread" : "Mark read"}
                    >
                      {m.read ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => confirm("Delete message?") && del(m.id)}
                      className="rounded-md p-2 hover:bg-muted hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-muted-foreground">
                  No messages.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <Modal onClose={() => setOpen(null)} title={selected.subject}>
          <p className="text-sm text-muted-foreground">
            From <span className="text-foreground">{selected.name}</span> ·{" "}
            <a href={`mailto:${selected.email}`} className="text-primary hover:underline">
              {selected.email}
            </a>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {new Date(selected.createdAt).toLocaleString()}
          </p>
          <div className="mt-4 whitespace-pre-line rounded-xl border border-border/50 bg-surface/50 p-4 text-sm">
            {selected.message}
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ------------- PROFILE ------------- */
function ProfileAdmin() {
  const profile = usePortfolio((s) => s.profile);
  const save = usePortfolio((s) => s.saveProfile);
  const uploadImage = usePortfolio((s) => s.uploadImage);
  const [f, setF] = useState(profile);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setF(profile);
  }, [profile]);

  async function saveProfile() {
    try {
      setError("");
      setSaving(true);
      await save(f);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save profile.");
    } finally {
      setSaving(false);
    }
  }

  async function uploadAvatar(file: File | undefined) {
    if (!file) return;

    try {
      setError("");
      setUploading(true);
      const url = await uploadImage(file, "profile");
      setF({ ...f, avatar: url });
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Could not upload avatar.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="glow-border max-w-2xl rounded-2xl border border-border/60 bg-card/60 p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <AdminField label="Name">
          <input
            className="admin-input"
            value={f.name}
            onChange={(e) => setF({ ...f, name: e.target.value })}
          />
        </AdminField>
        <AdminField label="Title">
          <input
            className="admin-input"
            value={f.title}
            onChange={(e) => setF({ ...f, title: e.target.value })}
          />
        </AdminField>
      </div>
      <AdminField label="Short intro" className="mt-4">
        <textarea
          className="admin-input min-h-[80px]"
          value={f.intro}
          onChange={(e) => setF({ ...f, intro: e.target.value })}
        />
      </AdminField>
      <AdminField label="About text" className="mt-4">
        <textarea
          className="admin-input min-h-[160px]"
          value={f.about}
          onChange={(e) => setF({ ...f, about: e.target.value })}
        />
      </AdminField>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <AdminField label="CV URL">
          <input
            className="admin-input"
            value={f.cvUrl}
            onChange={(e) => setF({ ...f, cvUrl: e.target.value })}
            placeholder="https://..."
          />
        </AdminField>
        <AdminField label="Avatar URL">
          <div className="flex gap-2">
            <input
              className="admin-input min-w-0 flex-1"
              value={f.avatar}
              onChange={(e) => setF({ ...f, avatar: e.target.value })}
              placeholder="https://..."
            />
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 text-sm text-foreground transition-colors hover:bg-muted">
              <Upload className="h-4 w-4" />
              {uploading ? "Uploading..." : "Upload"}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                disabled={uploading}
                className="sr-only"
                onChange={(event) => {
                  void uploadAvatar(event.target.files?.[0]);
                  event.target.value = "";
                }}
              />
            </label>
          </div>
        </AdminField>
      </div>
      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={saveProfile}
          disabled={saving}
          className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-[var(--shadow-glow)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_0_60px_-10px_var(--neon)] disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
        {saved && <span className="text-sm text-primary">Saved ✓</span>}
        {error && <span className="text-sm text-destructive">{error}</span>}
      </div>
    </div>
  );
}

/* ------------- SOCIAL ------------- */
function SocialAdmin() {
  const social = usePortfolio((s) => s.social);
  const save = usePortfolio((s) => s.saveSocial);
  const [f, setF] = useState(social);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setF(social);
  }, [social]);

  async function saveSocial() {
    try {
      setError("");
      setSaving(true);
      await save(f);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save social links.");
    } finally {
      setSaving(false);
    }
  }

  const fields: { key: keyof typeof f; label: string; placeholder: string }[] = [
    { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/..." },
    { key: "github", label: "GitHub", placeholder: "https://github.com/..." },
    { key: "email", label: "Email", placeholder: "you@example.com" },
    { key: "website", label: "Portfolio / other", placeholder: "https://..." },
  ];

  return (
    <div className="glow-border max-w-2xl rounded-2xl border border-border/60 bg-card/60 p-6">
      <div className="grid gap-4">
        {fields.map((fd) => (
          <AdminField key={fd.key} label={fd.label}>
            <input
              className="admin-input"
              value={f[fd.key]}
              onChange={(e) => setF({ ...f, [fd.key]: e.target.value })}
              placeholder={fd.placeholder}
            />
          </AdminField>
        ))}
      </div>
      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={saveSocial}
          disabled={saving}
          className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-[var(--shadow-glow)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_0_60px_-10px_var(--neon)] disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
        {saved && <span className="text-sm text-primary">Saved ✓</span>}
        {error && <span className="text-sm text-destructive">{error}</span>}
      </div>
    </div>
  );
}

/* ------------- shared ------------- */
function Modal({
  children,
  title,
  onClose,
}: {
  children: React.ReactNode;
  title: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[70] grid place-items-center bg-black/70 p-4 backdrop-blur"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-fade-up glow-border relative max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto overscroll-contain rounded-3xl border border-border/60 bg-card p-6 sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
        <h2 className="font-display text-xl font-semibold">{title}</h2>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

function ModalActions({
  onCancel,
  onSave,
  disabled,
  saving = false,
}: {
  onCancel: () => void;
  onSave: () => void | Promise<void>;
  disabled?: boolean;
  saving?: boolean;
}) {
  return (
    <div className="mt-6 flex justify-end gap-2">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-full border border-border px-4 py-2 text-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-primary/50 hover:bg-surface"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={onSave}
        disabled={disabled}
        className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_0_60px_-10px_var(--neon)]"
      >
        {saving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}

function MonthInput({
  value,
  onChange,
  disabled = false,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="relative">
      <input
        type="month"
        disabled={disabled}
        className="admin-input admin-date-input pr-10 disabled:opacity-50"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <CalendarDays className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/80" />
    </div>
  );
}

function AdminField({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

function AdminStyles() {
  return (
    <style>{`
      .admin-input {
        width: 100%;
        border-radius: 0.65rem;
        background: color-mix(in oklch, var(--surface) 60%, transparent);
        border: 1px solid var(--color-border);
        padding: 0.55rem 0.75rem;
        font-size: 0.9rem;
        color: var(--color-foreground);
        color-scheme: dark;
        outline: none;
        transition: border-color .2s, box-shadow .2s;
      }
      .admin-input::placeholder {
        color: var(--color-muted-foreground);
      }
      .admin-input:disabled {
        color: color-mix(in oklch, var(--color-foreground) 70%, transparent);
        background: color-mix(in oklch, var(--surface) 35%, transparent);
      }
      .admin-input:focus {
        border-color: color-mix(in oklch, var(--color-primary) 60%, transparent);
        box-shadow: 0 0 0 3px color-mix(in oklch, var(--color-primary) 15%, transparent);
      }
      input[type="checkbox"] {
        width: 1rem;
        height: 1rem;
        accent-color: var(--color-primary);
        color-scheme: dark;
      }
      .admin-input[type="date"],
      .admin-input[type="month"],
      .admin-input[type="time"],
      .admin-input[type="datetime-local"],
      .admin-input[type="number"],
      .admin-input[type="search"] {
        color-scheme: dark;
      }
      .admin-input::-webkit-calendar-picker-indicator,
      .admin-input::-webkit-search-cancel-button,
      .admin-input::-webkit-clear-button,
      .admin-input::-webkit-inner-spin-button,
      .admin-input::-webkit-outer-spin-button {
        cursor: pointer;
        filter: invert(1) brightness(1.4) opacity(.8);
      }
      .admin-input::-webkit-calendar-picker-indicator:hover,
      .admin-input::-webkit-search-cancel-button:hover,
      .admin-input::-webkit-clear-button:hover,
      .admin-input::-webkit-inner-spin-button:hover,
      .admin-input::-webkit-outer-spin-button:hover {
        opacity: 1;
      }
      .admin-date-input::-webkit-calendar-picker-indicator {
        opacity: 0;
        width: 2rem;
        height: 100%;
        margin-right: -.5rem;
      }
      .admin-number-input {
        appearance: textfield;
        -moz-appearance: textfield;
      }
      .admin-number-input::-webkit-inner-spin-button,
      .admin-number-input::-webkit-outer-spin-button {
        appearance: none;
        margin: 0;
      }
      button svg {
        color: currentColor;
      }
    `}</style>
  );
}
