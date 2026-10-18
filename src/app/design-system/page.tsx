"use client";

import {
  AlertCircle,
  ArrowRight,
  Check,
  ChevronRight,
  CircleHelp,
  Download,
  Film,
  Info,
  Moon,
  Play,
  Search,
  Sparkles,
  Sun,
  Terminal,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { SiteNavbar } from "@/components/site-navbar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchForm } from "@/components/search-form";

const buttonVariants = [
  { name: "default", label: "Primary", variant: "default" as const },
  { name: "outline", label: "Outline", variant: "outline" as const },
  { name: "secondary", label: "Secondary", variant: "secondary" as const },
  { name: "ghost", label: "Ghost", variant: "ghost" as const },
  { name: "destructive", label: "Destructive", variant: "destructive" as const },
  { name: "link", label: "Link", variant: "link" as const },
  { name: "torzoPill", label: "Torzo pill", variant: "torzoPill" as const },
];

const buttonSizes = [
  { name: "xs", label: "XS" },
  { name: "sm", label: "SM" },
  { name: "default", label: "MD" },
  { name: "lg", label: "LG" },
  { name: "icon-xs", label: "Icon XS" },
  { name: "icon-sm", label: "Icon SM" },
  { name: "icon", label: "Icon" },
  { name: "icon-lg", label: "Icon LG" },
] as const;

const badgeVariants = [
  { name: "default", label: "Default", variant: "default" as const },
  { name: "secondary", label: "Secondary", variant: "secondary" as const },
  { name: "success", label: "Success", variant: "success" as const },
  { name: "warning", label: "Warning", variant: "warning" as const },
  { name: "destructive", label: "Destructive", variant: "destructive" as const },
  { name: "outline", label: "Outline", variant: "outline" as const },
  { name: "ghost", label: "Ghost", variant: "ghost" as const },
  { name: "link", label: "Link", variant: "link" as const },
];

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-8 max-w-2xl">
      <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-extrabold tracking-[-0.04em] text-text-primary md:text-4xl">
        {title}
      </h2>
      <p className="mt-3 text-sm leading-6 text-text-muted md:text-base">
        {description}
      </p>
    </div>
  );
}

function TokenSwatch({
  name,
  value,
  className,
}: {
  name: string;
  value: string;
  className: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border-subtle bg-bg-card">
      <div className={`h-20 ${className}`} />
      <div className="p-3">
        <p className="text-xs font-bold text-text-primary">{name}</p>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-wide text-text-muted">
          {value}
        </p>
      </div>
    </div>
  );
}

export default function DesignSystemPage() {
  const [selectedValue, setSelectedValue] = useState("movie");
  const [checked, setChecked] = useState(true);

  return (
    <main className="min-h-dvh bg-bg-canvas text-text-primary">
      <SiteNavbar />

      <div className="mx-auto max-w-[1440px] px-4 pb-24 pt-12 md:px-10 md:pt-20">
        <header className="relative mb-20 overflow-hidden rounded-[32px] border border-border-subtle bg-bg-card px-6 py-10 md:px-12 md:py-16">
          <div className="pointer-events-none absolute -right-16 -top-24 size-72 rounded-full bg-bg-secondary blur-3xl" />
          <div className="relative z-10 max-w-4xl">
            <div className="mb-8 flex flex-wrap items-center gap-2">
              <Badge variant="outline" dot>
                Torzo system / v1
              </Badge>
              <Badge variant="secondary" icon={Sparkles}>
                Pencil-aligned
              </Badge>
            </div>
            <h1 className="max-w-4xl text-5xl font-extrabold tracking-[-0.065em] text-text-primary md:text-7xl">
              A quiet system for finding what to watch.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-text-muted md:text-lg">
              The complete Torzo visual language: semantic colors, typography,
              controls, feedback states, and the reusable components that make
              every screen feel like the same product.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg">
                Browse components <ArrowRight />
              </Button>
              <Button size="lg" variant="outline">
                <Terminal /> Usage notes
              </Button>
            </div>
          </div>
        </header>

        <section className="mb-24" id="foundations">
          <SectionHeading
            eyebrow="01 / Foundations"
            title="The visual grammar"
            description="Soft surfaces, graphite type, restrained borders, and one consistent typographic voice. These tokens are the base layer for every component below."
          />

          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <Card className="border-border-subtle bg-bg-card p-2">
              <CardHeader className="px-5 pt-5">
                <CardTitle>Color tokens</CardTitle>
                <CardDescription>Light-mode semantic palette from the Torzo canvas.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3 p-5 pt-2 sm:grid-cols-4">
                <TokenSwatch name="Canvas" value="#F8F8F9" className="bg-bg-canvas" />
                <TokenSwatch name="Card" value="#FCFCFD" className="bg-bg-card" />
                <TokenSwatch name="Secondary" value="#F2F3F4" className="bg-bg-secondary" />
                <TokenSwatch name="Primary text" value="#515257" className="bg-text-primary" />
                <TokenSwatch name="Muted text" value="#898B91" className="bg-text-muted" />
                <TokenSwatch name="Subtle border" value="#E6E7E9" className="bg-border-subtle" />
                <TokenSwatch name="Primary button" value="#3C424A" className="bg-bg-button-primary" />
                <TokenSwatch name="Black button" value="#515257" className="bg-bg-black-button" />
              </CardContent>
            </Card>

            <Card className="border-border-subtle bg-bg-card p-2">
              <CardHeader className="px-5 pt-5">
                <CardTitle>Type scale</CardTitle>
                <CardDescription>Plus Jakarta Sans, with weight doing the hierarchy work.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 p-5 pt-2">
                <div className="flex items-baseline justify-between gap-4 border-b border-border-subtle pb-4">
                  <span className="text-4xl font-extrabold tracking-[-0.06em]">Display</span>
                  <span className="text-xs text-text-muted">56–125 / 800</span>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-b border-border-subtle pb-4">
                  <span className="text-2xl font-bold tracking-[-0.04em]">Heading</span>
                  <span className="text-xs text-text-muted">24–48 / 700</span>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-b border-border-subtle pb-4">
                  <span className="text-base font-semibold">Label / body</span>
                  <span className="text-xs text-text-muted">14–16 / 500–600</span>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-text-muted">Metadata</span>
                  <span className="text-xs text-text-muted">11–12 / 700</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-24" id="buttons">
          <SectionHeading
            eyebrow="02 / Actions"
            title="Buttons, from quiet to decisive"
            description="Every button is pill-shaped, center-origin, keyboard-visible, and uses the shared spring interaction layer for hover and press feedback."
          />

          <Card className="border-border-subtle bg-bg-card p-2">
            <CardContent className="space-y-8 p-5 md:p-8">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {buttonVariants.map((item) => (
                  <div key={item.name} className="rounded-2xl bg-bg-canvas p-5">
                    <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-text-muted">
                      variant=&quot;{item.name}&quot;
                    </p>
                    <Button variant={item.variant} className="w-full">
                      {item.label} <ArrowRight />
                    </Button>
                  </div>
                ))}
              </div>

              <div>
                <p className="mb-4 text-sm font-bold text-text-primary">Sizes</p>
                <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-bg-canvas p-5">
                  {buttonSizes.map((item) => (
                    <Button
                      key={item.name}
                      size={item.name}
                      variant={item.name.startsWith("icon") ? "secondary" : "default"}
                      aria-label={item.name}
                    >
                      {item.name.startsWith("icon") ? <Zap /> : item.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Button disabled>Disabled</Button>
                <Button variant="outline" aria-pressed>
                  <Check /> Pressed state
                </Button>
                <Button variant="secondary">
                  <Download /> With icon
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-24" id="badges">
          <SectionHeading
            eyebrow="03 / Status"
            title="Badges and signals"
            description="Badges stay compact and pill-shaped. Use them for state, taxonomy, media type, or a small piece of metadata—not for primary actions."
          />

          <Card className="border-border-subtle bg-bg-card p-2">
            <CardContent className="p-5 md:p-8">
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {badgeVariants.map((item) => (
                  <div key={item.name} className="flex min-h-28 flex-col justify-between rounded-2xl bg-bg-canvas p-5">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
                      variant=&quot;{item.name}&quot;
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={item.variant}>{item.label}</Badge>
                      <Badge variant={item.variant} dot>
                        Live
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-2 rounded-2xl border border-border-subtle p-5">
                <Badge variant="success" icon={Check}>Ready</Badge>
                <Badge variant="warning" icon={AlertCircle}>Pending</Badge>
                <Badge variant="secondary" icon={Film}>Movie</Badge>
                <Badge variant="outline" icon={Play}>Series</Badge>
                <Badge variant="default" icon={Zap}>4K</Badge>
                <Badge variant="destructive" icon={AlertCircle}>Unavailable</Badge>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-24" id="forms">
          <SectionHeading
            eyebrow="04 / Inputs"
            title="Forms with a soft landing"
            description="Inputs use borderless surfaces by default and a clear secondary-border focus state. Selects and checkboxes share the same semantic palette."
          />

          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <Card className="border-border-subtle bg-bg-card p-2">
              <CardHeader className="px-5 pt-5">
                <CardTitle>Input variants</CardTitle>
                <CardDescription>Use surface for hero and elevated contexts.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-5 pt-2">
                <label className="block space-y-2 text-xs font-bold text-text-primary">
                  Default
                  <Input placeholder="Search for a title" />
                </label>
                <label className="block space-y-2 text-xs font-bold text-text-primary">
                  Surface
                  <Input variant="surface" placeholder="Paste a magnet link" />
                </label>
                <label className="block space-y-2 text-xs font-bold text-text-primary">
                  Invalid
                  <Input aria-invalid="true" defaultValue="Something went wrong" />
                </label>
                <label className="block space-y-2 text-xs font-bold text-text-muted">
                  Disabled
                  <Input disabled placeholder="Unavailable field" />
                </label>
              </CardContent>
            </Card>

            <Card className="border-border-subtle bg-bg-card p-2">
              <CardHeader className="px-5 pt-5">
                <CardTitle>Selection controls</CardTitle>
                <CardDescription>Compact controls for filters and preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-5 pt-2">
                <div className="space-y-2">
                  <p className="text-xs font-bold text-text-primary">Select</p>
                  <Select value={selectedValue} onValueChange={setSelectedValue}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose a format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="movie">Movie</SelectItem>
                      <SelectItem value="series">Series</SelectItem>
                      <SelectItem value="documentary">Documentary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <label className="flex items-center gap-3 text-sm font-semibold text-text-primary">
                  <Checkbox checked={checked} onCheckedChange={(value) => setChecked(value === true)} />
                  Include cached results
                </label>
                <div className="flex items-center gap-3 text-xs text-text-muted">
                  <CircleHelp className="size-4" />
                  Selected value: <span className="font-bold text-text-primary">{selectedValue}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-24" id="feedback">
          <SectionHeading
            eyebrow="05 / Feedback"
            title="Feedback that stays useful"
            description="Alerts carry meaning through color and icon while preserving the quiet Torzo surface language."
          />

          <div className="grid gap-5 md:grid-cols-2">
            <Alert>
              <Info />
              <AlertTitle>Connection ready</AlertTitle>
              <AlertDescription>Your TorBox account is connected and ready to use.</AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <AlertCircle />
              <AlertTitle>Connection failed</AlertTitle>
              <AlertDescription>Check the API key and try connecting again.</AlertDescription>
            </Alert>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <Card className="border-border-subtle bg-bg-card p-2">
              <CardHeader className="px-5 pt-5">
                <CardTitle>Loading state</CardTitle>
                <CardDescription>Skeletons preserve layout while data arrives.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-5 pt-2">
                <Skeleton className="h-5 w-2/5" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-28 w-full rounded-2xl" />
              </CardContent>
            </Card>
            <Card className="border-border-subtle bg-bg-card p-2">
              <CardHeader className="px-5 pt-5">
                <CardTitle>Empty state</CardTitle>
                <CardDescription>A clear next step beats a blank screen.</CardDescription>
              </CardHeader>
              <CardContent className="flex min-h-40 flex-col items-center justify-center p-5 text-center">
                <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-bg-secondary text-text-muted">
                  <Search className="size-4" />
                </div>
                <p className="text-sm font-bold text-text-primary">No results yet</p>
                <p className="mt-1 max-w-xs text-xs leading-5 text-text-muted">Try a title, actor, or keyword to start discovering.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-24" id="surfaces">
          <SectionHeading
            eyebrow="06 / Surfaces"
            title="Cards, disclosure, navigation"
            description="The structural pieces that hold content together: cards for grouping, collapsibles for density, and pagination for long result sets."
          />

          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <Card className="border-border-subtle bg-bg-card p-2">
              <CardHeader className="px-5 pt-5">
                <CardTitle>Card anatomy</CardTitle>
                <CardDescription>Default and compact card density.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 p-5 pt-2 sm:grid-cols-2">
                <Card size="sm" className="border-border-subtle bg-bg-canvas">
                  <CardHeader>
                    <CardTitle>Compact card</CardTitle>
                    <CardDescription>Small supporting content.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs leading-5 text-text-muted">Use for dense lists and metadata groups.</p>
                  </CardContent>
                </Card>
                <Card className="border-border-subtle bg-bg-canvas">
                  <CardHeader>
                    <CardTitle>Default card</CardTitle>
                    <CardDescription>Primary content container.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs leading-5 text-text-muted">Use for sections that need breathing room.</p>
                  </CardContent>
                  <CardFooter>
                    <Badge variant="secondary">Footer</Badge>
                  </CardFooter>
                </Card>
              </CardContent>
            </Card>

            <Collapsible defaultOpen>
              <CollapsibleTrigger>
                <span className="flex items-center gap-3 text-sm font-bold">
                  <span className="flex size-8 items-center justify-center rounded-full bg-bg-secondary">
                    <ChevronRight className="size-4" />
                  </span>
                  Collapsible content
                </span>
                <Badge variant="outline">Open</Badge>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="space-y-3 py-4 text-sm leading-6 text-text-muted">
                  <p>Use disclosure when the content is useful but secondary.</p>
                  <p className="font-semibold text-text-primary">The section keeps its state and animates height with the shared motion language.</p>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          <Card className="mt-5 border-border-subtle bg-bg-card p-2">
            <CardHeader className="px-5 pt-5">
              <CardTitle>Pagination</CardTitle>
              <CardDescription>Compact navigation for result collections.</CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-2">
              <Pagination>
                <PaginationContent>
                  <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
                  <PaginationItem><PaginationLink href="#" isActive>1</PaginationLink></PaginationItem>
                  <PaginationItem><PaginationLink href="#">2</PaginationLink></PaginationItem>
                  <PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem>
                  <PaginationItem><PaginationEllipsis /></PaginationItem>
                  <PaginationItem><PaginationNext href="#" /></PaginationItem>
                </PaginationContent>
              </Pagination>
            </CardContent>
          </Card>
        </section>

        <section className="mb-24" id="search">
          <SectionHeading
            eyebrow="07 / Signature"
            title="The Torzo search bar"
            description="The signature interaction: a wide search surface with a focus stroke, a centered action, and room for discovery suggestions."
          />
          <div className="rounded-[32px] border border-border-subtle bg-bg-card px-5 py-12 md:px-12">
            <div className="mx-auto max-w-[780px]">
              <p className="mb-4 text-center text-xs font-bold uppercase tracking-[0.18em] text-text-muted">
                Search component / idle
              </p>
              <SearchForm id="design-system-search" variant="hero" />
            </div>
          </div>
        </section>

        <footer className="flex flex-col justify-between gap-5 border-t border-border-subtle pt-6 text-xs text-text-muted md:flex-row md:items-center">
          <p>Torzo Design System / semantic, calm, discoverable.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5"><Sun className="size-3.5" /> Light</span>
            <span className="inline-flex items-center gap-1.5"><Moon className="size-3.5" /> Dark-ready</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
