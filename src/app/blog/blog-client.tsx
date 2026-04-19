"use client";

import Image from "next/image";
import Link from "next/link";
import { track } from "@vercel/analytics";
import debounce from "lodash.debounce";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ArticleWithSlug } from "@/types";

type Variation = "A" | "B";
type SortKey = "newest" | "oldest";

interface BlogClientProps {
  articles: ArticleWithSlug[];
}

const KIND_LABEL: Record<string, string> = {
  blog: "Essay",
  video: "Video",
  demo: "Demo",
  course: "Course",
};

const THUMB_PATTERNS = ["t-grid", "t-dots", "t-rule", "t-diag"] as const;

const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const pad2 = (n: number) => String(n).padStart(2, "0");
const fmtMonYear = (iso: string) => {
  const d = new Date(iso);
  return `${MONTHS_SHORT[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
};
const fmtDayMon = (iso: string) => {
  const d = new Date(iso);
  return { day: pad2(d.getUTCDate()), mon: MONTHS_SHORT[d.getUTCMonth()].toUpperCase() };
};

function toRomanNumeral(year: number): string {
  const map: Array<[number, string]> = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
    [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];
  let out = "";
  let n = year;
  for (const [v, s] of map) {
    while (n >= v) { out += s; n -= v; }
  }
  return out;
}

function firstGlyph(title: string): string {
  const ch = title.trim().charAt(0).toUpperCase();
  return /[A-Z0-9]/.test(ch) ? ch : "§";
}

function resolveImageSrc(image: ArticleWithSlug["image"]): string | null {
  if (!image) return null;
  if (typeof image === "string") return image;
  if (typeof image === "object" && "src" in image && typeof image.src === "string") return image.src;
  return null;
}

export default function BlogClient({ articles }: BlogClientProps) {
  const [variation, setVariation] = useState<Variation>("A");
  const [search, setSearch] = useState("");
  const [kind, setKind] = useState<string>("All");
  const [tag, setTag] = useState<string>("All");
  const [sort, setSort] = useState<SortKey>("newest");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const debouncedTrack = useMemo(
    () =>
      debounce((q: string) => {
        if (q.trim()) track("blog-search", { term: q });
      }, 600),
    []
  );
  useEffect(() => () => debouncedTrack.cancel(), [debouncedTrack]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const { kindCounts, tagCounts } = useMemo(() => {
    const kindCounts: Record<string, number> = {};
    const tagCounts: Record<string, number> = {};
    for (const a of articles) {
      const k = a.type || "blog";
      kindCounts[k] = (kindCounts[k] || 0) + 1;
      for (const t of a.tags || []) tagCounts[t] = (tagCounts[t] || 0) + 1;
    }
    return { kindCounts, tagCounts };
  }, [articles]);

  const topTags = useMemo(
    () => Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a]).slice(0, 10),
    [tagCounts]
  );
  const kindOrder = useMemo(
    () => Object.keys(kindCounts).sort((a, b) => kindCounts[b] - kindCounts[a]),
    [kindCounts]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const out = articles.filter((a) => {
      if (kind !== "All" && (a.type || "blog") !== kind) return false;
      if (tag !== "All" && !(a.tags || []).includes(tag)) return false;
      if (q) {
        const hay = `${a.title} ${a.description} ${(a.tags || []).join(" ")} ${a.type || ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    out.sort((a, b) => {
      const da = new Date(a.date).getTime();
      const db = new Date(b.date).getTime();
      return sort === "oldest" ? da - db : db - da;
    });
    return out;
  }, [articles, search, kind, tag, sort]);

  const totalCount = articles.length;
  const thisYearCount = useMemo(() => {
    const y = new Date().getFullYear();
    return articles.filter((a) => new Date(a.date).getFullYear() === y).length;
  }, [articles]);
  const earliestYear = useMemo(() => {
    if (!articles.length) return new Date().getFullYear();
    return articles.reduce((min, a) => Math.min(min, new Date(a.date).getFullYear()), Number.POSITIVE_INFINITY);
  }, [articles]);
  const latestDate = useMemo(() => {
    if (!articles.length) return null;
    const latest = articles.reduce((m, a) => (new Date(a.date) > new Date(m.date) ? a : m), articles[0]);
    return latest.date;
  }, [articles]);

  const activeFilterCount =
    (kind !== "All" ? 1 : 0) + (tag !== "All" ? 1 : 0) + (sort !== "newest" ? 1 : 0);

  const handleSearch = (v: string) => {
    setSearch(v);
    debouncedTrack(v);
  };

  const clearAll = () => {
    setSearch("");
    setKind("All");
    setTag("All");
    setSort("newest");
    debouncedTrack.cancel();
  };

  const chooseVariation = (v: Variation) => {
    setVariation(v);
    track("blog-view-toggle", { variation: v });
  };

  const ledgerGroups = useMemo(() => {
    const byYear: Record<string, ArticleWithSlug[]> = {};
    for (const a of filtered) {
      const y = new Date(a.date).getUTCFullYear().toString();
      (byYear[y] ||= []).push(a);
    }
    const keys = Object.keys(byYear).sort((a, b) => (sort === "oldest" ? +a - +b : +b - +a));
    return keys.map((y) => ({ year: y, posts: byYear[y] }));
  }, [filtered, sort]);

  return (
    <div className="editorial-blog">
      <section className="eb-header">
        <div className="eb-container">
          <div className="eb-eyebrow">Writing · Essays · Field notes</div>
          <h1 className="eb-title">
            I write to learn, and <em>publish to share</em>.
          </h1>
          <p className="eb-dek">
            Technical tutorials, field notes on applied AI, and developer
            writing from a long stretch shipping production systems. Updated
            most weeks.
          </p>
          <div className="eb-rule">
            <span><b>{totalCount}</b> posts</span>
            <span>
              Since <span className="eb-dotted">{toRomanNumeral(earliestYear)}</span>
              {latestDate ? <> · Archive complete through <b>{fmtMonYear(latestDate)}</b></> : null}
            </span>
            <span>{thisYearCount} this year</span>
            <span>
              <Link href="/rss/feed.xml">RSS ↗</Link>
            </span>
          </div>
        </div>
      </section>

      <section className="eb-filter-bar">
        <div className="eb-container">
          <div className="eb-filter-row">
            <div className="eb-search">
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx={11} cy={11} r={8} />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                ref={searchInputRef}
                type="search"
                placeholder="Search…"
                aria-label="Search writing"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
              <span className="eb-kbd">⌘K</span>
            </div>

            <button
              type="button"
              className="eb-filters-toggle"
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen((v) => !v)}
            >
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1={4} y1={21} x2={4} y2={14} />
                <line x1={4} y1={10} x2={4} y2={3} />
                <line x1={12} y1={21} x2={12} y2={12} />
                <line x1={12} y1={8} x2={12} y2={3} />
                <line x1={20} y1={21} x2={20} y2={16} />
                <line x1={20} y1={12} x2={20} y2={3} />
                <line x1={1} y1={14} x2={7} y2={14} />
                <line x1={9} y1={8} x2={15} y2={8} />
                <line x1={17} y1={16} x2={23} y2={16} />
              </svg>
              Filter
              {activeFilterCount > 0 && (
                <span className="eb-filter-badge">{activeFilterCount}</span>
              )}
            </button>

            <span className="eb-results-count">
              <b>{filtered.length}</b>{" "}
              {filtered.length === totalCount
                ? `post${filtered.length === 1 ? "" : "s"}`
                : `of ${totalCount} posts`}
            </span>

            <div className="eb-view-toggle" role="tablist" aria-label="Layout">
              <button
                type="button"
                role="tab"
                aria-selected={variation === "A"}
                aria-label="Gallery"
                title="Gallery"
                className={variation === "A" ? "is-active" : ""}
                onClick={() => chooseVariation("A")}
              >
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <rect x={3} y={3} width={7} height={7} />
                  <rect x={14} y={3} width={7} height={7} />
                  <rect x={3} y={14} width={7} height={7} />
                  <rect x={14} y={14} width={7} height={7} />
                </svg>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={variation === "B"}
                aria-label="List"
                title="List"
                className={variation === "B" ? "is-active" : ""}
                onClick={() => chooseVariation("B")}
              >
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <line x1={3} y1={6} x2={21} y2={6} />
                  <line x1={3} y1={12} x2={21} y2={12} />
                  <line x1={3} y1={18} x2={21} y2={18} />
                </svg>
              </button>
            </div>
          </div>

          {drawerOpen && (
            <div className="eb-filter-drawer">
              <div className="eb-drawer-row">
                <span className="eb-drawer-label">Kind</span>
                <div className="eb-chip-group">
                  <button
                    type="button"
                    className={`eb-chip ${kind === "All" ? "is-active" : ""}`}
                    onClick={() => setKind("All")}
                  >
                    All<span className="eb-count">{totalCount}</span>
                  </button>
                  {kindOrder.map((k) => (
                    <button
                      key={k}
                      type="button"
                      className={`eb-chip ${kind === k ? "is-active" : ""}`}
                      onClick={() => setKind(k)}
                    >
                      {KIND_LABEL[k] ?? k}
                      <span className="eb-count">{kindCounts[k]}</span>
                    </button>
                  ))}
                </div>
              </div>
              {topTags.length > 0 && (
                <div className="eb-drawer-row">
                  <span className="eb-drawer-label">Tag</span>
                  <div className="eb-chip-group">
                    <button
                      type="button"
                      className={`eb-chip ${tag === "All" ? "is-active" : ""}`}
                      onClick={() => setTag("All")}
                    >
                      All tags<span className="eb-count">{totalCount}</span>
                    </button>
                    {topTags.map((t) => (
                      <button
                        key={t}
                        type="button"
                        className={`eb-chip ${tag === t ? "is-active" : ""}`}
                        onClick={() => setTag(t)}
                      >
                        #{t}
                        <span className="eb-count">{tagCounts[t]}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="eb-drawer-row">
                <span className="eb-drawer-label">Sort</span>
                <select
                  className="eb-sort-select"
                  aria-label="Sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                </select>
                <button type="button" className="eb-clear" onClick={clearAll}>
                  Clear all
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <main>
        <div className="eb-container">
          {filtered.length === 0 ? (
            <div className="eb-empty">
              <h3>No matches.</h3>
              <p>Try clearing a filter or searching with a different term.</p>
            </div>
          ) : variation === "A" ? (
            <Gallery
              posts={filtered}
              showLead={search === "" && kind === "All" && tag === "All" && sort === "newest"}
            />
          ) : (
            <Ledger groups={ledgerGroups} />
          )}

          <div className="eb-newsletter">
            <div>
              <h3>The Modern Coding letter.</h3>
              <p>
                Monthly. One essay on applied AI. No marketing, no spam.
              </p>
            </div>
            <form
              className="eb-newsletter-form"
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const email = String(fd.get("email") || "");
                if (!email) return;
                track("newsletter_subscribe_submit", { location: "blog-index" });
                window.location.href = `/subscribe?email=${encodeURIComponent(email)}`;
              }}
            >
              <input
                type="email"
                name="email"
                required
                placeholder="you@company.com"
                aria-label="Email"
              />
              <button type="submit" className="eb-btn-primary">
                Subscribe →
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

function Gallery({ posts, showLead }: { posts: ArticleWithSlug[]; showLead: boolean }) {
  return (
    <div className="eb-grid">
      {posts.map((post, i) => {
        const isLead = showLead && i === 0;
        const pattern = THUMB_PATTERNS[i % THUMB_PATTERNS.length];
        const kindKey = post.type || "blog";
        const imgSrc = resolveImageSrc(post.image);
        return (
          <Link
            key={post.slug ?? `${post.title}-${i}`}
            className={`eb-card${isLead ? " is-lead" : ""}`}
            href={`/blog/${post.slug}`}
          >
            <div className={`eb-thumb ${imgSrc ? "" : pattern}`}>
              {imgSrc ? (
                <Image
                  src={imgSrc}
                  alt=""
                  fill
                  sizes={isLead ? "(min-width:1000px) 520px, 100vw" : "(min-width:1000px) 380px, 100vw"}
                  style={{ objectFit: "cover" }}
                  unoptimized
                />
              ) : null}
              <span className="eb-thumb-num">
                {pad2(i + 1)} · {KIND_LABEL[kindKey] ?? kindKey}
              </span>
              {!imgSrc && <span className="eb-thumb-glyph">{firstGlyph(post.title)}</span>}
            </div>
            <div className="eb-card-body">
              <div className="eb-card-meta">
                <span className="eb-kind-pill">{KIND_LABEL[kindKey] ?? kindKey}</span>
                <span>{fmtMonYear(post.date)}</span>
              </div>
              <h3 className="eb-card-title">{post.title}</h3>
              <p className="eb-card-dek">{post.description}</p>
              <div className="eb-card-footer">
                <div className="eb-card-tags">
                  {(post.tags || []).slice(0, 3).map((t) => (
                    <span key={t}>#{t}</span>
                  ))}
                </div>
                <span>Read →</span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

function Ledger({ groups }: { groups: Array<{ year: string; posts: ArticleWithSlug[] }> }) {
  let running = 0;
  return (
    <div className="eb-ledger">
      {groups.map(({ year, posts }) => {
        const tagSet = new Set<string>();
        posts.forEach((p) => (p.tags || []).forEach((t) => tagSet.add(t)));
        return (
          <div key={year}>
            <header className="eb-year">
              <div className="eb-year-label">{year}</div>
              <div className="eb-year-meta">
                <b>{posts.length}</b> posts · {tagSet.size} tag{tagSet.size === 1 ? "" : "s"}
              </div>
            </header>
            {posts.map((post) => {
              running += 1;
              const { day, mon } = fmtDayMon(post.date);
              const kindKey = post.type || "blog";
              return (
                <Link
                  key={post.slug ?? `${post.title}-${running}`}
                  className="eb-row"
                  href={`/blog/${post.slug}`}
                >
                  <div className="eb-num">№ {pad2(running)}</div>
                  <div className="eb-mdate">
                    <span className="eb-day">{day}</span> {mon}
                  </div>
                  <div className="eb-title-wrap">
                    <h3 className="eb-row-title">{post.title}</h3>
                    <p className="eb-row-dek">{post.description}</p>
                  </div>
                  <div className="eb-kind">{KIND_LABEL[kindKey] ?? kindKey}</div>
                  <div className="eb-arrow">→</div>
                </Link>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
