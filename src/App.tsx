import { useState, useRef, useEffect } from "react"

// ──────────────────────────────────────────────────────────────────────────────
// UTILITY
// ──────────────────────────────────────────────────────────────────────────────
function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ")
}

// ──────────────────────────────────────────────────────────────────────────────
// ICONS — minimal inline SVG, no icon-library dependency
// ──────────────────────────────────────────────────────────────────────────────
type IP = { className?: string; size?: number }
const sv = ({ className, size = 16 }: IP, children: React.ReactNode) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
    className={cn("shrink-0", className)}>{children}</svg>
)

const IGrid      = (p: IP) => sv(p, <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></>)
const IUsers     = (p: IP) => sv(p, <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>)
const IDollar    = (p: IP) => sv(p, <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>)
const IClock     = (p: IP) => sv(p, <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>)
const IUserPlus  = (p: IP) => sv(p, <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></>)
const IBarChart  = (p: IP) => sv(p, <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>)
const ISettings  = (p: IP) => sv(p, <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>)
const IShield    = (p: IP) => sv(p, <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>)
const IBell      = (p: IP) => sv(p, <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>)
const ISearch    = (p: IP) => sv(p, <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>)
const IChevDown  = (p: IP) => sv(p, <polyline points="6 9 12 15 18 9"/>)
const IChevUp    = (p: IP) => sv(p, <polyline points="18 15 12 9 6 15"/>)
const IChevRight = (p: IP) => sv(p, <polyline points="9 18 15 12 9 6"/>)
const IMore      = (p: IP) => sv(p, <><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></>)
const ISort      = (p: IP) => sv(p, <><path d="m3 16 4 4 4-4"/><path d="M7 20V4"/><path d="m21 8-4-4-4 4"/><path d="M17 4v16"/></>)
const ICheck     = (p: IP) => sv(p, <polyline points="20 6 9 17 4 12"/>)
const IPlus      = (p: IP) => sv(p, <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>)
const ITrash     = (p: IP) => sv(p, <><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></>)
const IEdit      = (p: IP) => sv(p, <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>)
const IEye       = (p: IP) => sv(p, <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>)
const ILogout    = (p: IP) => sv(p, <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>)
const IUser      = (p: IP) => sv(p, <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>)
const ITrendUp   = (p: IP) => sv(p, <><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></>)
const ITrendDown = (p: IP) => sv(p, <><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/></>)
const IInbox     = (p: IP) => sv(p, <><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></>)
const ILayers    = (p: IP) => sv({ ...p, size: p.size ?? 40 }, <><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></>)
const ISpinner   = (p: IP) => (
  <svg width={p.size ?? 14} height={p.size ?? 14} viewBox="0 0 24 24" fill="none" className={cn("animate-spin shrink-0", p.className)}>
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
  </svg>
)

// ──────────────────────────────────────────────────────────────────────────────
// BUTTON
// ──────────────────────────────────────────────────────────────────────────────
type BtnVariant = "primary" | "secondary" | "destructive" | "ghost" | "outline"
type BtnSize    = "sm" | "md" | "lg" | "icon"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant
  size?: BtnSize
  loading?: boolean
}

function Button({ variant = "primary", size = "md", loading, disabled, children, className, ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center gap-1.5 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer"
  const variants: Record<BtnVariant, string> = {
    primary:     "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
    secondary:   "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border shadow-sm",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
    ghost:       "hover:bg-accent hover:text-accent-foreground",
    outline:     "border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-sm",
  }
  const sizes: Record<BtnSize, string> = {
    sm:   "h-7 px-2.5 text-xs rounded-md",
    md:   "h-9 px-4 text-sm rounded-md",
    lg:   "h-10 px-6 text-sm rounded-lg",
    icon: "h-9 w-9 rounded-md",
  }
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} disabled={disabled || loading} {...props}>
      {loading && <ISpinner />}
      {children}
    </button>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// BADGE — semantic + HCM status variants
// ──────────────────────────────────────────────────────────────────────────────
type BadgeVariant = "default" | "secondary" | "success" | "warning" | "destructive" | "info"
type HCMStatus    = "active" | "pending" | "revoked" | "expired" | "on-leave" | "terminated"

function Badge({ variant = "default", children, className }: { variant?: BadgeVariant; children: React.ReactNode; className?: string }) {
  const base = "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium leading-none"
  const variants: Record<BadgeVariant, string> = {
    default:     "bg-primary-subtle text-primary-text",
    secondary:   "bg-secondary text-secondary-foreground border border-border",
    success:     "bg-success-subtle text-success-text",
    warning:     "bg-warning-subtle text-warning-text",
    destructive: "bg-destructive-subtle text-destructive-text",
    info:        "bg-info-subtle text-info-text",
  }
  return <span className={cn(base, variants[variant], className)}>{children}</span>
}

function StatusBadge({ status }: { status: HCMStatus }) {
  const base = "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium leading-none"
  type Cfg = { cls: string; dot: string; label: string }
  const configs: Record<HCMStatus, Cfg> = {
    "active":     { cls: "bg-status-active text-status-active-fg",         dot: "bg-status-active-fg",         label: "Active" },
    "pending":    { cls: "bg-status-pending text-status-pending-fg",       dot: "bg-status-pending-fg",         label: "Pending" },
    "revoked":    { cls: "bg-status-revoked text-status-revoked-fg",       dot: "bg-status-revoked-fg",         label: "Revoked" },
    "expired":    { cls: "bg-status-expired text-status-expired-fg",       dot: "bg-status-expired-fg",         label: "Expired" },
    "on-leave":   { cls: "bg-status-onleave text-status-onleave-fg",       dot: "bg-status-onleave-fg",         label: "On Leave" },
    "terminated": { cls: "bg-status-terminated text-status-terminated-fg", dot: "bg-status-terminated-fg",     label: "Terminated" },
  }
  const { cls, dot, label } = configs[status]
  return (
    <span className={cn(base, cls)}>
      <span className={cn("w-1.5 h-1.5 rounded-full", dot)} />
      {label}
    </span>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// FORM ELEMENTS
// ──────────────────────────────────────────────────────────────────────────────
const inputBase = "w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:border-ring disabled:cursor-not-allowed disabled:opacity-50"

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  error?: string
  prefix?: React.ReactNode
}

function Input({ error, prefix, className, ...props }: InputProps) {
  if (prefix) {
    return (
      <div className="relative flex items-center">
        <span className="absolute left-3 text-muted-foreground pointer-events-none">{prefix}</span>
        <input className={cn(inputBase, "pl-9", error && "border-destructive focus:ring-destructive", className)} {...props} />
      </div>
    )
  }
  return <input className={cn(inputBase, error && "border-destructive focus:ring-destructive", className)} {...props} />
}

function Select({ options, error, className, ...props }: { options: { value: string; label: string }[]; error?: string } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select className={cn(inputBase, "appearance-none pr-8 cursor-pointer", error && "border-destructive focus:ring-destructive", className)} {...props}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <IChevDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={13} />
    </div>
  )
}

function FormField({ label, helper, error, required, children }: { label: string; helper?: string; error?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground">
        {label}{required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      {children}
      {error   && <p className="text-xs text-destructive-text">{error}</p>}
      {!error && helper && <p className="text-xs text-muted-foreground">{helper}</p>}
    </div>
  )
}

function Checkbox({ label, className, ...props }: { label?: string } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
      <input type="checkbox" className={cn("h-4 w-4 rounded border-input accent-primary cursor-pointer", className)} {...props} />
      {label && <span className="text-sm text-foreground">{label}</span>}
    </label>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// TABS
// ──────────────────────────────────────────────────────────────────────────────
interface TabItem { id: string; label: string; badge?: number }

function Tabs({ tabs, active, onChange, variant = "underline" }: { tabs: TabItem[]; active: string; onChange: (id: string) => void; variant?: "underline" | "pill" }) {
  if (variant === "pill") {
    return (
      <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
        {tabs.map(t => (
          <button key={t.id} onClick={() => onChange(t.id)}
            className={cn("px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
              active === t.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
            {t.label}
            {t.badge !== undefined && (
              <span className={cn("ml-1.5 rounded-full px-1.5 py-0.5 text-xs", active === t.id ? "bg-primary text-primary-foreground" : "bg-border text-muted-foreground")}>
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    )
  }
  return (
    <div className="flex border-b border-border">
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)}
          className={cn("px-4 py-2.5 text-sm font-medium transition-colors relative",
            active === t.id
              ? "text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary"
              : "text-muted-foreground hover:text-foreground")}>
          {t.label}
          {t.badge !== undefined && (
            <span className="ml-1.5 rounded-full bg-muted px-1.5 text-xs text-muted-foreground">{t.badge}</span>
          )}
        </button>
      ))}
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// MODAL
// ──────────────────────────────────────────────────────────────────────────────
function Modal({ open, onClose, title, description, children, footer, size = "md" }: {
  open: boolean; onClose: () => void; title: string; description?: string;
  children: React.ReactNode; footer?: React.ReactNode; size?: "sm" | "md" | "lg"
}) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    if (open) document.addEventListener("keydown", h)
    return () => document.removeEventListener("keydown", h)
  }, [open, onClose])

  if (!open) return null
  const sizeMap = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl" }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      <div className={cn("relative bg-card rounded-xl shadow-xl border border-border w-full", sizeMap[size])}>
        <div className="flex items-start justify-between p-6 pb-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">{title}</h2>
            {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors ml-4 mt-0.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="px-6 pb-4">{children}</div>
        {footer && <div className="flex justify-end gap-2 px-6 py-4 border-t border-border bg-muted/30 rounded-b-xl">{footer}</div>}
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// DROPDOWN MENU
// ──────────────────────────────────────────────────────────────────────────────
interface MenuItem { label: string; icon?: React.ReactNode; onClick?: () => void; variant?: "default" | "destructive"; divider?: boolean }

function DropdownMenu({ trigger, items, align = "right" }: { trigger: React.ReactNode; items: MenuItem[]; align?: "left" | "right" }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener("mousedown", h)
    return () => document.removeEventListener("mousedown", h)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setOpen(o => !o)}>{trigger}</div>
      {open && (
        <div className={cn("absolute top-full mt-1.5 z-50 min-w-[168px] bg-popover border border-border rounded-lg shadow-lg py-1",
          align === "right" ? "right-0" : "left-0")}>
          {items.map((item, i) => (
            <div key={i}>
              {item.divider && <div className="my-1 border-t border-border" />}
              <button
                className={cn("flex w-full items-center gap-2.5 px-3 py-1.5 text-sm transition-colors text-left",
                  item.variant === "destructive"
                    ? "text-destructive-text hover:bg-destructive-subtle"
                    : "text-foreground hover:bg-accent")}
                onClick={() => { item.onClick?.(); setOpen(false) }}>
                {item.icon && <span className="opacity-60">{item.icon}</span>}
                {item.label}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// CARD + STAT CARD + EMPTY STATE
// ──────────────────────────────────────────────────────────────────────────────
function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("bg-card border border-border rounded-lg shadow-sm", className)}>{children}</div>
}

function StatCard({ label, value, delta, trend, icon, sub }: {
  label: string; value: string | number; delta?: string;
  trend?: "up" | "down" | "neutral"; icon: React.ReactNode; sub?: string
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
          <p className="mt-1.5 text-2xl font-semibold text-foreground tabular-nums font-mono">{value}</p>
          {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-subtle text-primary-text">{icon}</div>
      </div>
      {delta && (
        <div className={cn("mt-3 flex items-center gap-1 text-xs font-medium",
          trend === "up" ? "text-success-text" : trend === "down" ? "text-destructive-text" : "text-muted-foreground")}>
          {trend === "up"   && <ITrendUp size={12} />}
          {trend === "down" && <ITrendDown size={12} />}
          {delta}
        </div>
      )}
    </Card>
  )
}

function EmptyState({ icon, title, description, action }: { icon?: React.ReactNode; title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 px-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted text-muted-foreground">{icon ?? <ILayers size={28} />}</div>
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description && <p className="mt-1 text-sm text-muted-foreground max-w-xs">{description}</p>}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// DATA TABLE — sortable, selectable, paginated, with row actions
// ──────────────────────────────────────────────────────────────────────────────
interface Employee {
  id: string; name: string; email: string; initials: string
  role: string; department: string; status: HCMStatus
  startDate: string; salary: number; location: string
}

const EMPLOYEES: Employee[] = [
  { id: "E001", name: "Sarah Chen",        email: "s.chen@workr.io",      initials: "SC", role: "Sr. Software Engineer",  department: "Engineering", status: "active",     startDate: "2021-03-15", salary: 145000, location: "San Francisco" },
  { id: "E002", name: "Marcus Williams",   email: "m.williams@workr.io",  initials: "MW", role: "HR Business Partner",    department: "People Ops",  status: "active",     startDate: "2020-07-22", salary: 98500,  location: "New York" },
  { id: "E003", name: "Priya Patel",       email: "p.patel@workr.io",     initials: "PP", role: "Product Manager",        department: "Product",     status: "on-leave",   startDate: "2019-11-08", salary: 128000, location: "Austin" },
  { id: "E004", name: "James Rodriguez",   email: "j.rodriguez@workr.io", initials: "JR", role: "DevOps Engineer",        department: "Engineering", status: "active",     startDate: "2022-01-10", salary: 132000, location: "Seattle" },
  { id: "E005", name: "Amara Johnson",     email: "a.johnson@workr.io",   initials: "AJ", role: "Payroll Specialist",     department: "Finance",     status: "pending",    startDate: "2023-04-01", salary: 78000,  location: "Chicago" },
  { id: "E006", name: "David Kim",         email: "d.kim@workr.io",       initials: "DK", role: "UX Designer",           department: "Design",      status: "active",     startDate: "2021-08-30", salary: 115000, location: "San Francisco" },
  { id: "E007", name: "Rachel Torres",     email: "r.torres@workr.io",    initials: "RT", role: "Data Analyst",          department: "Analytics",   status: "expired",    startDate: "2018-06-14", salary: 95000,  location: "Boston" },
  { id: "E008", name: "Omar Hassan",       email: "o.hassan@workr.io",    initials: "OH", role: "Security Engineer",     department: "Engineering", status: "active",     startDate: "2022-11-20", salary: 138000, location: "Austin" },
  { id: "E009", name: "Lin Wei",           email: "l.wei@workr.io",       initials: "LW", role: "Compensation Analyst",  department: "People Ops",  status: "active",     startDate: "2020-03-01", salary: 102000, location: "Denver" },
  { id: "E010", name: "Fatima Al-Rashid",  email: "f.alrashid@workr.io",  initials: "FA", role: "Compliance Manager",    department: "Legal",       status: "terminated", startDate: "2017-09-12", salary: 118000, location: "New York" },
  { id: "E011", name: "Thomas Brennan",    email: "t.brennan@workr.io",   initials: "TB", role: "Benefits Admin",        department: "People Ops",  status: "revoked",    startDate: "2021-05-17", salary: 82000,  location: "Chicago" },
  { id: "E012", name: "Yuki Tanaka",       email: "y.tanaka@workr.io",    initials: "YT", role: "Engineering Manager",   department: "Engineering", status: "active",     startDate: "2019-08-05", salary: 168000, location: "San Francisco" },
]

type SortKey = "name" | "department" | "startDate" | "salary"

function DataTable() {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [sortKey, setSortKey]   = useState<SortKey>("name")
  const [sortDir, setSortDir]   = useState<"asc" | "desc">("asc")
  const [page, setPage]         = useState(0)
  const pageSize = 6

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc")
    else { setSortKey(key); setSortDir("asc") }
  }

  const sorted = [...EMPLOYEES].sort((a, b) => {
    const av = typeof a[sortKey] === "string" ? (a[sortKey] as string).toLowerCase() : a[sortKey]
    const bv = typeof b[sortKey] === "string" ? (b[sortKey] as string).toLowerCase() : b[sortKey]
    return sortDir === "asc" ? (av < bv ? -1 : av > bv ? 1 : 0) : (av > bv ? -1 : av < bv ? 1 : 0)
  })

  const totalPages = Math.ceil(sorted.length / pageSize)
  const paged      = sorted.slice(page * pageSize, (page + 1) * pageSize)
  const allSel     = paged.every(e => selected.has(e.id))

  const toggleAll = () => setSelected(prev => {
    const next = new Set(prev)
    if (allSel) paged.forEach(e => next.delete(e.id))
    else paged.forEach(e => next.add(e.id))
    return next
  })

  const toggleRow = (id: string) => setSelected(prev => {
    const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next
  })

  const SH = ({ col, label }: { col: SortKey; label: string }) => (
    <th className="h-10 px-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide cursor-pointer select-none hover:text-foreground transition-colors"
      onClick={() => toggleSort(col)}>
      <div className="flex items-center gap-1">
        {label}
        {sortKey === col ? sortDir === "asc" ? <IChevUp size={11} /> : <IChevDown size={11} /> : <ISort size={11} className="opacity-30" />}
      </div>
    </th>
  )

  const fmtSalary = (n: number) => `$${n.toLocaleString()}`
  const fmtDate   = (s: string) => new Date(s).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })

  return (
    <div>
      {selected.size > 0 && (
        <div className="mb-2 flex items-center gap-3 rounded-md bg-primary-subtle border border-primary/20 px-4 py-2">
          <span className="text-sm font-medium text-primary-text">{selected.size} selected</span>
          <div className="flex gap-2 ml-auto">
            <Button variant="secondary" size="sm">Export</Button>
            <Button variant="destructive" size="sm">Terminate</Button>
          </div>
        </div>
      )}
      <div className="rounded-lg border border-border overflow-hidden bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 border-b border-border">
              <tr>
                <th className="w-10 px-3 py-2"><Checkbox checked={allSel} onChange={toggleAll} /></th>
                <SH col="name" label="Employee" />
                <SH col="department" label="Dept." />
                <th className="h-10 px-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</th>
                <SH col="startDate" label="Start date" />
                <SH col="salary" label="Salary" />
                <th className="h-10 px-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Location</th>
                <th className="h-10 w-10 px-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paged.map(e => (
                <tr key={e.id} className={cn("transition-colors hover:bg-muted/30", selected.has(e.id) && "bg-primary-subtle/50")}>
                  <td className="px-3 py-3"><Checkbox checked={selected.has(e.id)} onChange={() => toggleRow(e.id)} /></td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-subtle text-primary-text text-xs font-semibold">{e.initials}</div>
                      <div>
                        <p className="font-medium text-foreground">{e.name}</p>
                        <p className="text-xs text-muted-foreground">{e.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground text-xs">{e.department}</td>
                  <td className="px-3 py-3"><StatusBadge status={e.status} /></td>
                  <td className="px-3 py-3 font-mono text-xs text-muted-foreground">{fmtDate(e.startDate)}</td>
                  <td className="px-3 py-3 font-mono text-sm">{fmtSalary(e.salary)}</td>
                  <td className="px-3 py-3 text-muted-foreground text-xs">{e.location}</td>
                  <td className="px-3 py-3">
                    <DropdownMenu
                      trigger={<Button variant="ghost" size="icon" className="h-7 w-7"><IMore size={14} /></Button>}
                      items={[
                        { label: "View profile", icon: <IEye size={13} /> },
                        { label: "Edit details", icon: <IEdit size={13} /> },
                        { label: "Terminate",    icon: <ITrash size={13} />, variant: "destructive", divider: true },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20">
          <span className="text-xs text-muted-foreground">{sorted.length} employees · page {page + 1} of {totalPages}</span>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            </Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setPage(i)}
                className={cn("h-7 w-7 rounded text-xs font-medium transition-colors",
                  i === page ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground")}>
                {i + 1}
              </button>
            ))}
            <Button variant="ghost" size="icon" className="h-7 w-7" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>
              <IChevRight size={13} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// TOP BAR
// ──────────────────────────────────────────────────────────────────────────────
function TopBar({ title, onMenuToggle }: { title: string; onMenuToggle?: () => void }) {
  const [notifOpen, setNotifOpen] = useState(false)
  const [userOpen, setUserOpen]   = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)
  const userRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false)
      if (userRef.current  && !userRef.current.contains(e.target as Node))  setUserOpen(false)
    }
    document.addEventListener("mousedown", h)
    return () => document.removeEventListener("mousedown", h)
  }, [])

  return (
    <header className="h-14 flex items-center gap-3 px-4 border-b border-border bg-card shrink-0 z-10">
      <button className="md:hidden text-muted-foreground hover:text-foreground" onClick={onMenuToggle}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
      <h1 className="text-sm font-semibold text-foreground shrink-0">{title}</h1>
      <div className="hidden sm:flex flex-1 max-w-xs ml-3">
        <Input prefix={<ISearch size={13} />} placeholder="Search employees, reports…" className="h-8 text-xs" />
      </div>
      <div className="flex items-center gap-1 ml-auto">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button onClick={() => setNotifOpen(o => !o)}
            className="relative flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
            <IBell size={16} />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-destructive" />
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-lg border border-border bg-popover shadow-lg z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">Notifications</span>
                <Badge variant="destructive">3 new</Badge>
              </div>
              {[
                { text: "July 2026 payroll run completed", time: "2 min ago", type: "success" as BadgeVariant },
                { text: "Priya Patel's leave request approved", time: "1 hr ago", type: "info" as BadgeVariant },
                { text: "Thomas Brennan's contract expires in 7 days", time: "3 hr ago", type: "warning" as BadgeVariant },
              ].map((n, i) => (
                <div key={i} className="flex gap-3 px-4 py-3 hover:bg-accent cursor-pointer transition-colors border-b border-border last:border-0">
                  <Badge variant={n.type} className="mt-0.5 shrink-0 opacity-80">&nbsp;</Badge>
                  <div>
                    <p className="text-xs text-foreground">{n.text}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
              <div className="px-4 py-2.5">
                <button className="text-xs text-primary hover:underline">View all notifications</button>
              </div>
            </div>
          )}
        </div>
        {/* User menu */}
        <div className="relative" ref={userRef}>
          <button onClick={() => setUserOpen(o => !o)}
            className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-accent transition-colors">
            <div className="h-7 w-7 rounded-full bg-primary-subtle flex items-center justify-center text-primary-text text-xs font-semibold">AP</div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-medium text-foreground leading-none">Alex Park</p>
              <p className="text-xs text-muted-foreground leading-none mt-0.5">HR Admin</p>
            </div>
            <IChevDown size={12} className="text-muted-foreground hidden sm:block" />
          </button>
          {userOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 rounded-lg border border-border bg-popover shadow-lg z-50 py-1">
              <div className="px-3 py-2.5 border-b border-border mb-1">
                <p className="text-xs font-semibold text-foreground">Alex Park</p>
                <p className="text-xs text-muted-foreground">a.park@workr.io</p>
              </div>
              {[{ label: "Profile", icon: <IUser size={13} /> }, { label: "Settings", icon: <ISettings size={13} /> }].map((item, i) => (
                <button key={i} className="flex w-full items-center gap-2.5 px-3 py-1.5 text-sm text-foreground hover:bg-accent transition-colors">
                  <span className="opacity-60">{item.icon}</span>{item.label}
                </button>
              ))}
              <div className="border-t border-border mt-1 pt-1">
                <button className="flex w-full items-center gap-2.5 px-3 py-1.5 text-sm text-destructive-text hover:bg-destructive-subtle transition-colors">
                  <span className="opacity-60"><ILogout size={13} /></span>Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// SIDEBAR NAV
// ──────────────────────────────────────────────────────────────────────────────
interface NavItem { id: string; label: string; icon: React.ReactNode; badge?: number }

const NAV_MAIN: NavItem[] = [
  { id: "dashboard",  label: "Dashboard",        icon: <IGrid size={15} /> },
  { id: "workforce",  label: "Workforce",         icon: <IUsers size={15} />, badge: 847 },
  { id: "payroll",    label: "Payroll",           icon: <IDollar size={15} /> },
  { id: "time",       label: "Time & Attendance", icon: <IClock size={15} /> },
  { id: "onboarding", label: "Onboarding",        icon: <IUserPlus size={15} />, badge: 3 },
  { id: "benefits",   label: "Benefits",          icon: <IInbox size={15} /> },
  { id: "reports",    label: "Reports",           icon: <IBarChart size={15} /> },
]

const NAV_BOTTOM: NavItem[] = [
  { id: "admin",    label: "Admin",    icon: <IShield size={15} /> },
  { id: "settings", label: "Settings", icon: <ISettings size={15} /> },
]

function Sidebar({ active, onSelect, mobileOpen }: { active: string; onSelect: (id: string) => void; mobileOpen?: boolean }) {
  return (
    <>
      {mobileOpen && <div className="fixed inset-0 bg-foreground/40 z-30 md:hidden" />}
      <aside className={cn(
        "fixed md:static inset-y-0 left-0 z-40 flex flex-col w-56 bg-sidebar border-r border-sidebar-border transition-transform duration-200 shrink-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        {/* Logo */}
        <div className="flex items-center gap-2.5 h-14 px-4 border-b border-sidebar-border shrink-0">
          <div className="h-7 w-7 rounded-lg bg-sidebar-active flex items-center justify-center shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-sm font-semibold text-sidebar-accent-foreground tracking-tight">WorkR HCM</span>
        </div>
        {/* Main nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          <p className="px-2 mb-2 text-xs font-medium uppercase tracking-wider" style={{ color: "oklch(0.55 0.012 258)" }}>Main</p>
          {NAV_MAIN.map(item => (
            <button key={item.id} onClick={() => onSelect(item.id)}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
                active === item.id
                  ? "bg-sidebar-active text-primary-foreground font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-hover hover:text-sidebar-accent-foreground"
              )}>
              <span className={active === item.id ? "opacity-100" : "opacity-60"}>{item.icon}</span>
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge !== undefined && (
                <span className={cn("rounded-full px-1.5 py-0.5 text-xs leading-none",
                  active === item.id ? "bg-white/20 text-white" : "bg-sidebar-hover text-sidebar-foreground")}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
        {/* Bottom nav + user */}
        <div className="px-2 py-3 border-t border-sidebar-border space-y-0.5">
          {NAV_BOTTOM.map(item => (
            <button key={item.id} onClick={() => onSelect(item.id)}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
                active === item.id
                  ? "bg-sidebar-active text-primary-foreground font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-hover hover:text-sidebar-accent-foreground"
              )}>
              <span className="opacity-60">{item.icon}</span>
              {item.label}
            </button>
          ))}
          <div className="mt-2 flex items-center gap-2.5 px-2.5 py-2">
            <div className="h-7 w-7 rounded-full bg-sidebar-active/30 flex items-center justify-center text-xs font-semibold text-sidebar-accent-foreground shrink-0">AP</div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-sidebar-accent-foreground truncate">Alex Park</p>
              <p className="text-xs truncate" style={{ color: "oklch(0.55 0.012 258)" }}>HR Admin</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// SECTION SCAFFOLDING
// ──────────────────────────────────────────────────────────────────────────────
function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
    </div>
  )
}

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-7">
      <div className="flex-1 h-px bg-border" />
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
      <div className="flex-1 h-px bg-border" />
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// SECTION: FOUNDATIONS (Dashboard nav item)
// ──────────────────────────────────────────────────────────────────────────────
function FoundationsSection() {
  const semanticTokens = [
    { name: "background",         var: "--background" },
    { name: "card",               var: "--card" },
    { name: "muted",              var: "--muted" },
    { name: "primary",            var: "--primary" },
    { name: "primary-subtle",     var: "--primary-subtle" },
    { name: "success",            var: "--success" },
    { name: "success-subtle",     var: "--success-subtle" },
    { name: "warning",            var: "--warning" },
    { name: "warning-subtle",     var: "--warning-subtle" },
    { name: "destructive",        var: "--destructive" },
    { name: "destructive-subtle", var: "--destructive-subtle" },
    { name: "info",               var: "--info" },
    { name: "info-subtle",        var: "--info-subtle" },
    { name: "border",             var: "--border" },
    { name: "foreground",         var: "--foreground" },
    { name: "muted-foreground",   var: "--muted-foreground" },
  ]
  const statusSwatches = [
    { label: "Active",     bg: "--status-active",     fg: "--status-active-fg" },
    { label: "Pending",    bg: "--status-pending",    fg: "--status-pending-fg" },
    { label: "On Leave",   bg: "--status-onleave",    fg: "--status-onleave-fg" },
    { label: "Expired",    bg: "--status-expired",    fg: "--status-expired-fg" },
    { label: "Revoked",    bg: "--status-revoked",    fg: "--status-revoked-fg" },
    { label: "Terminated", bg: "--status-terminated", fg: "--status-terminated-fg" },
  ]
  const chartSwatches = [
    { name: "--chart-1", note: "Slate-blue · primary" },
    { name: "--chart-2", note: "Sage-green" },
    { name: "--chart-3", note: "Teal" },
    { name: "--chart-4", note: "Amber" },
    { name: "--chart-5", note: "Muted violet" },
  ]

  return (
    <div>
      <SectionHeader title="Foundations" description="All token values — color, typography, radius, and elevation" />

      <h3 className="text-sm font-semibold text-foreground mb-3">Semantic color tokens</h3>
      <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2 mb-6">
        {semanticTokens.map(c => (
          <div key={c.name} className="flex flex-col gap-1.5">
            <div className="h-10 rounded-md border border-border/50 shadow-sm" style={{ background: `var(${c.var})` }} />
            <p className="text-xs text-muted-foreground leading-tight break-all">{c.name}</p>
          </div>
        ))}
      </div>

      <h3 className="text-sm font-semibold text-foreground mb-3">HCM status token pairs</h3>
      <div className="flex flex-wrap gap-2 mb-6">
        {statusSwatches.map(s => (
          <div key={s.label} className="flex items-center gap-2 rounded-md border border-border px-3 py-2 bg-card">
            <div className="h-5 w-5 rounded-md shrink-0" style={{ background: `var(${s.bg})` }} />
            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
              style={{ background: `var(${s.bg})`, color: `var(${s.fg})` }}>
              {s.label}
            </span>
            <code className="text-xs text-muted-foreground font-mono">{s.bg.replace("--", "")} / {s.fg.replace("--", "")}</code>
          </div>
        ))}
      </div>

      <h3 className="text-sm font-semibold text-foreground mb-3">Chart palette (5-series)</h3>
      <div className="flex gap-3 mb-6 flex-wrap">
        {chartSwatches.map((c, i) => (
          <div key={c.name} className="flex items-center gap-2.5 bg-card border border-border rounded-lg px-3 py-2.5">
            <div className="h-8 w-8 rounded-md shrink-0" style={{ background: `var(${c.name})` }} />
            <div>
              <p className="text-xs font-mono font-medium text-foreground">chart-{i + 1}</p>
              <p className="text-xs text-muted-foreground">{c.note}</p>
            </div>
          </div>
        ))}
      </div>

      <Divider label="Typography" />
      <Card className="p-5 mb-6">
        <div className="space-y-4">
          {[
            { label: "Display  24 / 600",          cls: "text-2xl font-semibold",                                                sample: "Workforce Analytics Q3 2026" },
            { label: "Heading  18 / 600",           cls: "text-lg font-semibold",                                                 sample: "Payroll Run Summary" },
            { label: "Subhead  14 / 600",           cls: "text-sm font-semibold",                                                 sample: "Employee Profile" },
            { label: "Body     14 / 400",           cls: "text-sm",                                                               sample: "Manage workforce, payroll, and HR operations from a single platform." },
            { label: "Caption  12 / 400",           cls: "text-xs text-muted-foreground",                                         sample: "Last synced · 3 minutes ago · by Alex Park" },
            { label: "Label    12 / 500 uppercase", cls: "text-xs font-medium uppercase tracking-wide text-muted-foreground",     sample: "Department · Location · Status" },
            { label: "Mono     DM Mono tabular",    cls: "font-mono text-sm",                                                     sample: "$145,000 · 2021-03-15 · E001 · 94.6%" },
          ].map(t => (
            <div key={t.label} className="flex items-baseline gap-4 flex-wrap sm:flex-nowrap">
              <span className="w-52 shrink-0 text-xs text-muted-foreground font-mono">{t.label}</span>
              <span className={t.cls}>{t.sample}</span>
            </div>
          ))}
        </div>
      </Card>

      <Divider label="Radii & Elevation" />
      <div className="flex flex-wrap gap-6 mb-6">
        {[
          { label: "sm · 4px",    r: "0.25rem",  note: "tight inputs" },
          { label: "md · 6px",    r: "0.375rem", note: "buttons, badges" },
          { label: "lg · 8px",    r: "0.5rem",   note: "cards, popovers" },
          { label: "xl · 12px",   r: "0.75rem",  note: "modals" },
          { label: "full · pill", r: "9999px",   note: "status chips" },
        ].map(s => (
          <div key={s.label} className="flex flex-col items-center gap-2">
            <div className="h-12 w-16 border-2 border-primary bg-primary-subtle" style={{ borderRadius: s.r }} />
            <p className="text-xs font-mono text-foreground text-center">{s.label}</p>
            <p className="text-xs text-muted-foreground text-center">{s.note}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-5">
        {[
          { label: "shadow-sm", cls: "shadow-sm",  note: "cards, inputs" },
          { label: "shadow-md", cls: "shadow-md",  note: "dropdowns" },
          { label: "shadow-lg", cls: "shadow-lg",  note: "modals" },
          { label: "shadow-xl", cls: "shadow-xl",  note: "overlays" },
        ].map(s => (
          <div key={s.label} className="flex flex-col items-center gap-2">
            <div className={cn("h-12 w-20 bg-card border border-border rounded-lg", s.cls)} />
            <p className="text-xs font-mono text-foreground">{s.label}</p>
            <p className="text-xs text-muted-foreground">{s.note}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// SECTION: COMPONENTS (Workforce nav item)
// ──────────────────────────────────────────────────────────────────────────────
function ComponentsSection() {
  const [loading, setLoading]     = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [tab1, setTab1]           = useState("all")
  const [tab2, setTab2]           = useState("month")
  const [selectVal, setSelectVal] = useState("")

  const handleLoad = () => { setLoading(true); setTimeout(() => setLoading(false), 1800) }

  return (
    <div>
      <SectionHeader title="Components" description="Buttons, badges, forms, tabs, modal, and dropdown — all variants and states" />

      <h3 className="text-sm font-semibold text-foreground mb-3">Buttons — variants</h3>
      <div className="flex flex-wrap gap-2 mb-4">
        <Button variant="primary">Primary action</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
      </div>

      <h3 className="text-sm font-semibold text-foreground mb-3">Buttons — sizes</h3>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
        <Button variant="outline" size="icon"><IPlus size={14} /></Button>
        <Button variant="secondary" size="icon"><IEdit size={14} /></Button>
      </div>

      <h3 className="text-sm font-semibold text-foreground mb-3">Buttons — states</h3>
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <Button disabled>Disabled primary</Button>
        <Button variant="secondary" disabled>Disabled secondary</Button>
        <Button loading={loading} onClick={handleLoad}>{loading ? "Processing…" : "Run payroll"}</Button>
        <Button variant="outline" loading={loading} onClick={handleLoad}>{loading ? "Exporting…" : "Export CSV"}</Button>
      </div>

      <Divider label="Badges" />
      <h3 className="text-sm font-semibold text-foreground mb-3">Semantic</h3>
      <div className="flex flex-wrap gap-2 mb-4">
        <Badge variant="default">Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="success">Completed</Badge>
        <Badge variant="warning">Review needed</Badge>
        <Badge variant="destructive">Error</Badge>
        <Badge variant="info">Info</Badge>
      </div>
      <h3 className="text-sm font-semibold text-foreground mb-3">HCM status</h3>
      <div className="flex flex-wrap gap-2 mb-6">
        <StatusBadge status="active" />
        <StatusBadge status="pending" />
        <StatusBadge status="on-leave" />
        <StatusBadge status="expired" />
        <StatusBadge status="revoked" />
        <StatusBadge status="terminated" />
      </div>

      <Divider label="Form Elements" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 max-w-2xl">
        <FormField label="Employee ID" helper="System-generated identifier">
          <Input value="E-00847" readOnly className="font-mono bg-muted/30" />
        </FormField>
        <FormField label="Full name" required>
          <Input placeholder="Sarah Chen" />
        </FormField>
        <FormField label="Department" required>
          <Select value={selectVal} onChange={e => setSelectVal(e.target.value)}
            options={[
              { value: "", label: "Select department" },
              { value: "eng", label: "Engineering" },
              { value: "people", label: "People Ops" },
              { value: "finance", label: "Finance" },
              { value: "product", label: "Product" },
            ]} />
        </FormField>
        <FormField label="Annual salary" error="Must be within band $80,000–$200,000">
          <Input prefix={<span className="text-xs font-medium">$</span>} type="number" placeholder="145,000" error="required" />
        </FormField>
        <FormField label="Work email" helper="Used for system access and notifications">
          <Input prefix={<ISearch size={13} />} type="email" placeholder="s.chen@company.com" />
        </FormField>
        <FormField label="Notes">
          <textarea className={cn(inputBase, "resize-none h-20")} placeholder="Optional onboarding notes…" />
        </FormField>
      </div>
      <div className="flex flex-wrap gap-5 mb-6">
        <Checkbox label="Send welcome email" defaultChecked />
        <Checkbox label="Enroll in benefits" />
        <Checkbox label="Add to org chart" defaultChecked />
        <Checkbox label="Grant admin access" disabled />
      </div>

      <Divider label="Tabs" />
      <div className="space-y-6 mb-6">
        <div>
          <p className="text-xs text-muted-foreground mb-3 font-medium">Underline variant</p>
          <Tabs tabs={[
            { id: "all", label: "All employees", badge: 847 },
            { id: "active", label: "Active", badge: 801 },
            { id: "onleave", label: "On Leave", badge: 23 },
            { id: "offboarding", label: "Offboarding", badge: 5 },
          ]} active={tab1} onChange={setTab1} />
          <div className="mt-3 p-3 bg-muted/30 rounded-md text-sm text-muted-foreground border border-border">
            Active tab: <strong className="text-foreground">{tab1}</strong>
          </div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-3 font-medium">Pill variant</p>
          <Tabs tabs={[
            { id: "week", label: "Week" }, { id: "month", label: "Month" },
            { id: "quarter", label: "Quarter" }, { id: "ytd", label: "YTD" },
          ]} active={tab2} onChange={setTab2} variant="pill" />
        </div>
      </div>

      <Divider label="Modal & Dropdown" />
      <div className="flex flex-wrap gap-3 items-start">
        <Button onClick={() => setModalOpen(true)}>Open modal</Button>
        <DropdownMenu
          trigger={<Button variant="outline">Actions <IChevDown size={13} /></Button>}
          items={[
            { label: "Export CSV",      icon: <IBarChart size={13} /> },
            { label: "Bulk update",     icon: <IEdit size={13} /> },
            { label: "Generate report", icon: <IBarChart size={13} /> },
            { label: "Delete selected", icon: <ITrash size={13} />, variant: "destructive", divider: true },
          ]}
        />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}
        title="Terminate employment"
        description="This will revoke all system access and archive the employee record."
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => setModalOpen(false)}>Confirm termination</Button>
          </>
        }>
        <div className="space-y-4">
          <FormField label="Reason" required>
            <Select options={[
              { value: "", label: "Select reason" },
              { value: "voluntary", label: "Voluntary resignation" },
              { value: "involuntary", label: "Involuntary termination" },
              { value: "contract", label: "Contract end" },
              { value: "retirement", label: "Retirement" },
            ]} />
          </FormField>
          <FormField label="Effective date" required>
            <Input type="date" defaultValue="2026-09-30" />
          </FormField>
          <FormField label="Internal notes">
            <textarea className={cn(inputBase, "resize-none h-16")} placeholder="Optional context for HR records…" />
          </FormField>
        </div>
      </Modal>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// SECTION: DATA DISPLAY (Payroll nav item)
// ──────────────────────────────────────────────────────────────────────────────
function DataDisplaySection() {
  return (
    <div>
      <SectionHeader title="Data Display" description="Stat cards, sortable/selectable data table with row actions, and empty states" />

      <h3 className="text-sm font-semibold text-foreground mb-3">KPI stat cards</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total headcount"  value="847"      delta="+12 this month"   trend="up"      icon={<IUsers size={16} />}    sub="As of Sep 2026" />
        <StatCard label="Active employees" value="801"      delta="94.6% of total"   trend="neutral" icon={<ICheck size={16} />}    sub="23 on leave" />
        <StatCard label="Open positions"   value="23"       delta="+5 vs last month" trend="down"    icon={<IBarChart size={16} />} sub="5 urgent hires" />
        <StatCard label="Avg. tenure"      value="3.2 yrs"  delta="+0.3 yrs YoY"    trend="up"      icon={<IClock size={16} />}    sub="All departments" />
      </div>

      <h3 className="text-sm font-semibold text-foreground mb-3">Employee data table</h3>
      <DataTable />

      <Divider label="Empty States" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <EmptyState icon={<IUsers size={24} />} title="No employees found"
            description="Try adjusting your search terms or active filters."
            action={<Button variant="secondary" size="sm">Clear filters</Button>} />
        </Card>
        <Card>
          <EmptyState icon={<IDollar size={24} />} title="No payroll runs"
            description="Run your first payroll cycle to see it here."
            action={<Button size="sm"><IPlus size={13} /> New payroll run</Button>} />
        </Card>
        <Card>
          <EmptyState icon={<IInbox size={24} />} title="All caught up"
            description="No pending approvals at this time." />
        </Card>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// SECTION: LAYOUT REFERENCE (Reports nav item)
// ──────────────────────────────────────────────────────────────────────────────
function LayoutSection() {
  return (
    <div>
      <SectionHeader title="Layout Shell" description="The sidebar and top bar you see now are the live components. Reference below." />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-foreground mb-2">Sidebar</h3>
          <p className="text-xs text-muted-foreground mb-3">Width: 224px · Background: <code className="font-mono bg-muted px-1 rounded text-xs">--sidebar</code></p>
          <ul className="text-xs space-y-2">
            {[
              ["bg-sidebar",                   "shell background"],
              ["text-sidebar-foreground",      "default item text"],
              ["hover:bg-sidebar-hover",        "hover state"],
              ["bg-sidebar-active",            "active item fill"],
              ["text-sidebar-accent-foreground","active + header text"],
              ["border-sidebar-border",        "dividers"],
            ].map(([cls, desc]) => (
              <li key={cls}><code className="font-mono text-primary-text bg-primary-subtle px-1 rounded">{cls}</code><span className="text-muted-foreground ml-2">{desc}</span></li>
            ))}
          </ul>
        </Card>
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-foreground mb-2">Top Bar</h3>
          <p className="text-xs text-muted-foreground mb-3">Height: 56px · Background: <code className="font-mono bg-muted px-1 rounded text-xs">--card</code></p>
          <ul className="text-xs space-y-2 text-muted-foreground">
            <li>Page title · <code className="font-mono text-foreground">text-sm font-semibold</code></li>
            <li>Global search · <code className="font-mono text-foreground">Input</code> with prefix icon</li>
            <li>Notification bell · live unread indicator + panel</li>
            <li>User avatar chip · initials + name + role + dropdown</li>
            <li>Hamburger toggle · visible at ≤ <code className="font-mono text-foreground">md</code> breakpoint</li>
          </ul>
        </Card>
      </div>

      <Card className="p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Token quick-reference</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-2 pr-6 font-medium text-muted-foreground uppercase tracking-wide">Tailwind class</th>
                <th className="pb-2 pr-6 font-medium text-muted-foreground uppercase tracking-wide">CSS variable</th>
                <th className="pb-2 font-medium text-muted-foreground uppercase tracking-wide">Intended use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-mono">
              {[
                ["bg-primary",             "--primary",           "CTA buttons, active nav, focus ring"],
                ["bg-primary-subtle",      "--primary-subtle",    "Selected row tint, icon bg chips"],
                ["text-primary-text",      "--primary-text",      "Text on primary-subtle surfaces"],
                ["bg-success-subtle",      "--success-subtle",    "Success badge background"],
                ["text-success-text",      "--success-text",      "Success badge foreground text"],
                ["bg-status-active",       "--status-active",     "Active employee badge bg"],
                ["text-status-active-fg",  "--status-active-fg",  "Active employee badge text"],
                ["bg-sidebar",             "--sidebar",           "Sidebar shell background"],
                ["border-sidebar-border",  "--sidebar-border",    "Sidebar internal dividers"],
                ["bg-chart-1",             "--chart-1",           "Primary dataviz series (blue)"],
                ["bg-chart-2",             "--chart-2",           "Secondary series (green)"],
                ["font-mono",              "--font-mono",         "DM Mono · salaries, IDs, dates"],
              ].map(([cls, cssVar, use]) => (
                <tr key={cls}>
                  <td className="py-1.5 pr-6 text-primary-text">{cls}</td>
                  <td className="py-1.5 pr-6 text-muted-foreground">{cssVar}</td>
                  <td className="py-1.5 text-foreground font-sans">{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// APP ROOT
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_MAP: Record<string, string> = {
  dashboard:  "foundations",
  admin:      "foundations",
  settings:   "foundations",
  workforce:  "components",
  onboarding: "components",
  benefits:   "components",
  payroll:    "data",
  time:       "data",
  reports:    "layout",
}

const PAGE_TITLES: Record<string, string> = {
  dashboard:  "Design System — Foundations",
  workforce:  "Design System — Components",
  payroll:    "Design System — Data Display",
  time:       "Design System — Data Display",
  onboarding: "Design System — Components",
  benefits:   "Design System — Components",
  reports:    "Design System — Layout",
  admin:      "Design System — Foundations",
  settings:   "Design System — Foundations",
}

export default function App() {
  const [activeNav, setActiveNav]   = useState("dashboard")
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleNav = (id: string) => { setActiveNav(id); setMobileOpen(false) }

  const renderSection = () => {
    const section = SECTION_MAP[activeNav] ?? "foundations"
    if (section === "components")  return <ComponentsSection />
    if (section === "data")        return <DataDisplaySection />
    if (section === "layout")      return <LayoutSection />
    return <FoundationsSection />
  }

  return (
    <div className="flex h-full bg-background overflow-hidden">
      <Sidebar active={activeNav} onSelect={handleNav} mobileOpen={mobileOpen} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar title={PAGE_TITLES[activeNav] ?? "WorkR HCM"} onMenuToggle={() => setMobileOpen(o => !o)} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto">
            {renderSection()}
          </div>
        </main>
      </div>
    </div>
  )
}
