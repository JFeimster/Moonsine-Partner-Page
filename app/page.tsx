"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { track } from "@/lib/tracking";

const NAVY = "#1e40af";
const GREEN = "#10b981";
const GOLD = "#f59e0b";

function money(n: number) {
  return n.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function calcCommissionMonthly(dealsPerMonth: number, avgDealSize: number) {
  // Replace with your real payout math if you want.
  const commissionRate = 0.01;
  return dealsPerMonth * avgDealSize * commissionRate;
}

const faqs = [
  {
    q: "How much can I really earn?",
    a: "Your earnings depend on deal flow and follow-through. Partners commonly earn $500–$5K per deal. The calculator above gives a realistic range based on volume and average deal size.",
  },
  { q: "Are there any upfront costs?", a: "No. There are zero fees to apply and no upfront buy-in to start." },
  { q: "How long does approval take?", a: "Most applications are reviewed within 24–48 hours." },
  { q: "Do I need experience in finance?", a: "No. If you can communicate clearly and follow a process, training covers the rest." },
  {
    q: "Is this MLM or a pyramid scheme?",
    a: "No. Partners earn commissions based on real funded deals. If you choose the Agency Builder path, you can earn overrides based on team performance—still tied to actual production, not recruiting alone.",
  },
  { q: "How do I find clients?", a: "We give you scripts, positioning, and outreach playbooks. Your job is prospecting and guiding qualified business owners into the application flow." },
  { q: "What training do you provide?", a: "Free online modules, deal walkthroughs, and ongoing support so you can ramp fast." },
  { q: "How fast do I get paid?", a: "Daily payouts once deals fund and clear processing." },
  { q: "Can I do this part-time?", a: "Yes. Many partners start 5–10 hours/week and scale up once they see traction." },
  {
    q: "What’s the difference between affiliate and agent?",
    a: "Affiliates refer and earn a smaller commission. Agents (ISOs) actively source, qualify, and guide deals—higher commissions, higher control.",
  },
];

const tiers = [
  {
    id: "affiliate",
    title: "Affiliate Partner",
    commission: "10–15%",
    time: "Part-time (5–10 hrs/week)",
    bestFor: "Side hustle, passive income seekers",
    do: "Share referral links",
    cta: "Become Affiliate",
    featured: false,
  },
  {
    id: "agent",
    title: "Independent Agent (ISO)",
    commission: "20–40%",
    time: "Full-time or serious part-time",
    bestFor: "Sales professionals, entrepreneurs",
    do: "Source clients, guide applications",
    cta: "Apply as Agent",
    featured: true,
  },
  {
    id: "agency",
    title: "Agency Builder",
    commission: "Your deals + 5–10% team override",
    time: "Full-time business",
    bestFor: "Team builders, MLM veterans",
    do: "Build and train your own agency",
    cta: "Build Agency",
    featured: false,
  },
];

export default function Page() {
  const [videoOpen, setVideoOpen] = useState(false);
  const [exitOpen, setExitOpen] = useState(false);

  const [deals, setDeals] = useState(6);
  const [avgSize, setAvgSize] = useState(75000);

  const monthly = useMemo(() => calcCommissionMonthly(deals, avgSize), [deals, avgSize]);
  const annual = useMemo(() => monthly * 12, [monthly]);

  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [tier, setTier] = useState<"affiliate" | "agent" | "agency">("agent");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    occupation: "",
    why: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<null | "ok" | "err">(null);

  const appRef = useRef<HTMLDivElement | null>(null);

  function scrollToApplication() {
    const el = document.getElementById("application");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  useEffect(() => {
    const key = "moonshine_exit_shown";
    const already = typeof window !== "undefined" ? localStorage.getItem(key) : "1";
    if (already) return;

    function onMouseLeave(e: MouseEvent) {
      if (e.clientY <= 0) {
        localStorage.setItem(key, "1");
        setExitOpen(true);
        track("exit_intent_shown");
      }
    }
    window.addEventListener("mouseleave", onMouseLeave);
    return () => window.removeEventListener("mouseleave", onMouseLeave);
  }, []);

  async function submitApplication(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitted(null);

    track("form_submit", { tier });

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, tier, deals, avgSize }),
      });
      const data = await res.json();
      setSubmitted(data?.ok ? "ok" : "err");
      if (data?.ok) {
        setForm({ fullName: "", email: "", phone: "", occupation: "", why: "" });
      }
    } catch {
      setSubmitted("err");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div ref={appRef} className="min-h-screen bg-white text-slate-900">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-xl"
              style={{
                background: `linear-gradient(135deg, ${NAVY}, ${GOLD})`,
                boxShadow: "0 10px 30px rgba(30,64,175,.20)",
              }}
              aria-hidden
            />
            <div className="leading-tight">
              <div className="text-sm font-semibold">Moonshine Capital</div>
              <div className="text-xs text-slate-500">Partner Network • distilledfunding.com</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                track("schedule_call_click");
                window.open("https://calendly.com/", "_blank", "noopener,noreferrer");
              }}
              className="hidden rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 md:inline-flex"
            >
              Schedule Call
            </button>

            <button
              onClick={() => {
                track("cta_primary_click", { location: "header" });
                scrollToApplication();
              }}
              className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-bold text-white shadow-sm transition active:scale-[0.99]"
              style={{
                backgroundColor: GREEN,
                boxShadow: "0 12px 32px rgba(16,185,129,.25)",
              }}
            >
              Start Your Application
            </button>
          </div>
        </div>
      </header>

      {/* HERO (fixed fallback background) */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "radial-gradient(1200px 600px at 15% 20%, rgba(16,185,129,.22), transparent 55%), radial-gradient(900px 500px at 85% 30%, rgba(245,158,11,.18), transparent 60%), linear-gradient(135deg, rgba(2,6,23,1) 0%, rgba(15,23,42,1) 55%, rgba(3,7,18,1) 100%)",
        }}
      >
        {/* Optional video (can fail; UI still looks good) */}
        <div className="absolute inset-0 -z-10 opacity-35">
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/hero-poster.jpg"
          >
            <source src="/hero-loop.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: GOLD }} />
                Zero fees • Daily payouts • Training included
              </div>

              <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-white md:text-5xl">
                Build Your Funding Business.{" "}
                <span style={{ color: "#a7f3d0" }}>Earn Daily Commissions.</span>
              </h1>

              <p className="mt-4 text-lg text-white/85">
                Join 500+ independent agents earning{" "}
                <span className="font-semibold text-white">$500–$5K per deal</span> with{" "}
                <span className="font-semibold text-white">zero upfront costs</span>.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => {
                    track("cta_primary_click", { location: "hero" });
                    scrollToApplication();
                  }}
                  className="inline-flex items-center justify-center rounded-2xl px-6 py-3 text-base font-extrabold text-white transition active:scale-[0.99]"
                  style={{
                    backgroundColor: GREEN,
                    boxShadow: "0 18px 40px rgba(16,185,129,.30)",
                  }}
                >
                  Start Your Application
                </button>

                <button
                  onClick={() => {
                    track("cta_secondary_click", { location: "hero" });
                    setVideoOpen(true);
                  }}
                  className="inline-flex items-center justify-center rounded-2xl border border-white/25 bg-white/10 px-6 py-3 text-base font-bold text-white hover:bg-white/15"
                >
                  Watch 2-Min Explainer Video
                </button>
              </div>

              <div className="mt-7 grid grid-cols-3 gap-2 rounded-2xl border border-white/15 bg-white/10 p-3 text-center text-xs font-semibold text-white/90">
                <div>Zero Fees</div>
                <div>Daily Payouts</div>
                <div>Full Training Included</div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/15 bg-white/10 p-6 text-white backdrop-blur">
              <div className="text-sm font-semibold text-white/80">What partners like most</div>
              <ul className="mt-3 space-y-2 text-sm text-white/85">
                <li>• Fast approvals (24–48 hours)</li>
                <li>• Simple process, strong support</li>
                <li>• Repeatable system (scripts + training)</li>
                <li>• Scale to an agency if you want</li>
              </ul>

              <div className="mt-6 rounded-2xl bg-white/10 p-4">
                <div className="text-xs font-semibold text-white/70">Typical deal commission</div>
                <div className="mt-1 text-3xl font-extrabold">
                  $500–$5K <span className="text-sm font-semibold text-white/70">per deal</span>
                </div>
              </div>

              <button
                onClick={() => {
                  track("cta_primary_click", { location: "hero_card" });
                  scrollToApplication();
                }}
                className="mt-6 w-full rounded-2xl px-5 py-3 text-base font-extrabold text-white transition active:scale-[0.99]"
                style={{ backgroundColor: NAVY }}
              >
                Apply in 2 Minutes
              </button>

              <div className="mt-3 text-xs text-white/70">
                No fees. No fluff. Just production.{" "}
                <span className="font-semibold" style={{ color: GOLD }}>
                  Earn on funded deals.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section className="border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight">Calculate Your Earning Potential</h2>
              <p className="mt-3 text-slate-600">Slide the numbers. See what consistent deal flow can look like.</p>

              <div className="mt-7 space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div>
                  <div className="flex items-baseline justify-between">
                    <label className="text-sm font-bold text-slate-800">Deals per month</label>
                    <div className="text-sm font-extrabold" style={{ color: NAVY }}>
                      {deals}
                    </div>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={50}
                    value={deals}
                    onChange={(e) => setDeals(Number(e.target.value))}
                    className="mt-3 w-full"
                  />
                  <div className="mt-1 flex justify-between text-xs text-slate-500">
                    <span>1</span>
                    <span>50</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-baseline justify-between">
                    <label className="text-sm font-bold text-slate-800">Average deal size</label>
                    <div className="text-sm font-extrabold" style={{ color: NAVY }}>
                      ${money(avgSize)}
                    </div>
                  </div>
                  <input
                    type="range"
                    min={10000}
                    max={500000}
                    step={5000}
                    value={avgSize}
                    onChange={(e) => setAvgSize(Number(e.target.value))}
                    className="mt-3 w-full"
                  />
                  <div className="mt-1 flex justify-between text-xs text-slate-500">
                    <span>$10K</span>
                    <span>$500K</span>
                  </div>
                </div>

                <div className="grid gap-3 rounded-2xl bg-slate-50 p-4 sm:grid-cols-2">
                  <div>
                    <div className="text-xs font-semibold text-slate-500">Monthly Commission</div>
                    <div className="mt-1 text-2xl font-extrabold" style={{ color: GREEN }}>
                      ${money(monthly)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-500">Annual</div>
                    <div className="mt-1 text-2xl font-extrabold" style={{ color: GREEN }}>
                      ${money(annual)}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    track("calculator_cta_click");
                    scrollToApplication();
                  }}
                  className="w-full rounded-2xl px-5 py-3 text-base font-extrabold text-white transition active:scale-[0.99]"
                  style={{ backgroundColor: GREEN, boxShadow: "0 18px 40px rgba(16,185,129,.25)" }}
                >
                  Get Started for Free
                </button>

                <div className="text-xs text-slate-500">
                  Calculator is an estimate. Actual payouts depend on product, deal terms, and performance.
                </div>
              </div>
            </div>

            {/* Tier Cards */}
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight">Choose Your Partner Track</h2>
              <p className="mt-3 text-slate-600">Pick the model that matches your time and ambition.</p>

              <div className="mt-7 grid gap-4">
                {tiers.map((t) => (
                  <div
                    key={t.id}
                    className={`rounded-3xl border p-6 shadow-sm transition ${
                      t.featured ? "border-amber-200 bg-amber-50/40" : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-xl font-extrabold">{t.title}</div>
                        <div className="mt-1 text-sm text-slate-600">
                          <span className="font-semibold">Commission:</span> {t.commission}
                        </div>
                      </div>
                      {t.featured && (
                        <div className="rounded-full px-3 py-1 text-xs font-extrabold text-white" style={{ backgroundColor: GOLD }}>
                          Recommended
                        </div>
                      )}
                    </div>

                    <div className="mt-4 grid gap-2 text-sm text-slate-700">
                      <div>
                        <span className="font-semibold">Time:</span> {t.time}
                      </div>
                      <div>
                        <span className="font-semibold">Best for:</span> {t.bestFor}
                      </div>
                      <div>
                        <span className="font-semibold">What you do:</span> {t.do}
                      </div>
                    </div>

                    <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <button
                        onClick={() => {
                          track("tier_click", { tier: t.id });
                          setTier(t.id as any);
                          scrollToApplication();
                        }}
                        className="rounded-2xl px-5 py-3 text-sm font-extrabold text-white transition active:scale-[0.99]"
                        style={{ backgroundColor: t.featured ? NAVY : GREEN }}
                      >
                        {t.cta}
                      </button>
                      <div className="text-xs text-slate-500">No fees. Training included.</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight">How It Works</h2>
              <p className="mt-3 text-slate-600">Four steps. No mystery. Start earning fast.</p>
            </div>
            <button
              onClick={() => {
                track("cta_primary_click", { location: "how_it_works" });
                scrollToApplication();
              }}
              className="rounded-2xl px-5 py-3 text-sm font-extrabold text-white"
              style={{ backgroundColor: GREEN }}
            >
              Start Application
            </button>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {[
              { title: "1) Apply", desc: "2-minute application" },
              { title: "2) Get Approved", desc: "24–48 hour review" },
              { title: "3) Training", desc: "Free online modules" },
              { title: "4) Start Earning", desc: "Submit deals, get paid" },
            ].map((s, idx) => (
              <div key={idx} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-sm font-extrabold" style={{ color: NAVY }}>
                  {s.title}
                </div>
                <div className="mt-2 text-sm text-slate-600">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Income comparison */}
      <section className="border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-3xl font-extrabold tracking-tight">Compare Your Earning Potential</h2>
          <p className="mt-3 text-slate-600">Most people cap their income by design. This doesn’t.</p>

          <div className="mt-10 grid gap-4">
            {[
              { label: "Traditional Job", value: 50000, note: "$50K/year" },
              { label: "Other MLMs", value: 80000, note: "$30K–$80K/year (variable)" },
              { label: "Moonshine Partner", value: 250000, note: "$60K–$250K/year (unlimited)" },
            ].map((b) => {
              const max = 250000;
              const pct = clamp((b.value / max) * 100, 8, 100);
              return (
                <div key={b.label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-baseline justify-between">
                    <div className="text-sm font-extrabold">{b.label}</div>
                    <div className="text-xs font-semibold text-slate-500">{b.note}</div>
                  </div>
                  <div className="mt-4 h-3 w-full rounded-full bg-slate-100">
                    <div
                      className="h-3 rounded-full"
                      style={{
                        width: `${pct}%`,
                        background: b.label === "Moonshine Partner" ? GREEN : NAVY,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => {
              track("cta_primary_click", { location: "comparison" });
              scrollToApplication();
            }}
            className="mt-8 rounded-2xl px-6 py-3 text-base font-extrabold text-white"
            style={{ backgroundColor: NAVY }}
          >
            I Want Unlimited Earning Potential
          </button>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-3xl font-extrabold tracking-tight">Success Stories</h2>
          <p className="mt-3 text-slate-600">Real partners. Real numbers. Consistent execution.</p>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              { name: "Jordan M.", loc: "Tampa, FL", earn: "$18,400/mo", quote: "I quit my 9-5 after 6 months." },
              { name: "Samantha R.", loc: "Phoenix, AZ", earn: "$9,700/mo", quote: "The training + scripts made it plug-and-play." },
              { name: "DeShawn K.", loc: "Toronto, ON", earn: "$24,100/mo", quote: "Once I got deal flow, it scaled fast." },
            ].map((t) => (
              <div key={t.name} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-extrabold">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.loc}</div>
                  </div>
                  <div className="text-sm font-extrabold" style={{ color: GREEN }}>
                    {t.earn}
                  </div>
                </div>
                <div className="mt-4 text-sm text-slate-700">“{t.quote}”</div>
                <button
                  onClick={() => {
                    track("cta_primary_click", { location: "testimonials" });
                    scrollToApplication();
                  }}
                  className="mt-5 text-sm font-extrabold underline"
                  style={{ color: NAVY }}
                >
                  Read More Success Stories
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-3xl font-extrabold tracking-tight">Do You Qualify?</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-sm font-extrabold" style={{ color: GREEN }}>
                ✅ What we’re looking for
              </div>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                <li>• Age 18+ (21+ in some states)</li>
                <li>• Willingness to learn</li>
                <li>• Basic tech skills</li>
                <li>• Hustle mentality</li>
                <li>• Legal to work in US/Canada</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-sm font-extrabold text-slate-900">❌ Disqualifiers</div>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                <li>• Expecting instant riches without work</li>
                <li>• Unwilling to follow a proven system</li>
                <li>• No network or prospecting skills</li>
                <li>• Looking for guaranteed salary</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-14">
          <h2 className="text-3xl font-extrabold tracking-tight">FAQ</h2>

          <div className="mt-8 space-y-3">
            {faqs.map((f, idx) => {
              const open = faqOpen === idx;
              return (
                <div key={f.q} className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <button
                    onClick={() => {
                      const next = open ? null : idx;
                      setFaqOpen(next);
                      track("faq_open", { index: idx, open: !open });
                    }}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <div className="text-sm font-extrabold text-slate-900">{f.q}</div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-700" aria-hidden>
                      {open ? "–" : "+"}
                    </div>
                  </button>
                  {open && <div className="px-5 pb-5 text-sm text-slate-600">{f.a}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Application */}
      <section id="application" className="border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight">Your Application Takes 2 Minutes</h2>
              <p className="mt-3 text-slate-600">Submit once. We review within 24–48 hours. Training unlocks immediately after approval.</p>

              <div className="mt-7 rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <div className="text-sm font-extrabold" style={{ color: NAVY }}>
                  What you’ll submit
                </div>
                <ul className="mt-4 space-y-2 text-sm text-slate-700">
                  <li>• Full name</li>
                  <li>• Email</li>
                  <li>• Phone</li>
                  <li>• Current occupation</li>
                  <li>• Why you want to join</li>
                  <li>• Preferred partnership tier</li>
                </ul>

                <div className="mt-6 rounded-2xl bg-white p-4 text-sm text-slate-700">
                  <div className="font-extrabold">Selected tier:</div>
                  <div className="mt-1">
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold text-slate-900 shadow-sm">
                      {tier === "affiliate" ? "Affiliate Partner" : tier === "agent" ? "Independent Agent (ISO)" : "Agency Builder"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                <button
                  onClick={() => {
                    track("schedule_call_click");
                    window.open("https://calendly.com/", "_blank", "noopener,noreferrer");
                  }}
                  className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-extrabold text-slate-900 hover:bg-slate-50"
                >
                  Schedule Call with Recruiter
                </button>
                <div className="text-xs text-slate-500 sm:self-center">Want a quick walkthrough? Book a call.</div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-sm font-extrabold text-slate-900">Start Application</div>
              <p className="mt-2 text-sm text-slate-600">No fees. No fluff. Just a clear next step.</p>

              <form onSubmit={submitApplication} className="mt-6 space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700">Full name</label>
                  <input
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    required
                    className="mt-1 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-400"
                    placeholder="Your name"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-bold text-slate-700">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                      className="mt-1 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-400"
                      placeholder="you@domain.com"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700">Phone</label>
                    <input
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      required
                      className="mt-1 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-400"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Current occupation</label>
                  <input
                    value={form.occupation}
                    onChange={(e) => setForm({ ...form, occupation: e.target.value })}
                    className="mt-1 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-400"
                    placeholder="Sales, owner, student, etc."
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Why do you want to join?</label>
                  <textarea
                    value={form.why}
                    onChange={(e) => setForm({ ...form, why: e.target.value })}
                    className="mt-1 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-400"
                    rows={4}
                    placeholder="Be real. We read these."
                  />
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-xs font-bold text-slate-700">Preferred partnership tier</div>
                  <div className="mt-2 grid gap-2 sm:grid-cols-3">
                    {[
                      { id: "affiliate", label: "Affiliate" },
                      { id: "agent", label: "Agent (ISO)" },
                      { id: "agency", label: "Agency Builder" },
                    ].map((o) => (
                      <button
                        type="button"
                        key={o.id}
                        onClick={() => setTier(o.id as any)}
                        className={`rounded-xl px-3 py-2 text-xs font-extrabold transition ${
                          tier === (o.id as any) ? "text-white" : "border border-slate-300 bg-white text-slate-900"
                        }`}
                        style={tier === (o.id as any) ? { backgroundColor: NAVY } : {}}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  disabled={submitting}
                  className="w-full rounded-2xl px-5 py-3 text-base font-extrabold text-white transition active:scale-[0.99] disabled:opacity-70"
                  style={{ backgroundColor: GREEN, boxShadow: "0 18px 40px rgba(16,185,129,.25)" }}
                >
                  {submitting ? "Submitting..." : "Start Application Now"}
                </button>

                {submitted === "ok" && (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                    ✅ Submitted. Check your email for confirmation.
                  </div>
                )}
                {submitted === "err" && (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
                    Something went wrong. Please try again.
                  </div>
                )}

                <div className="text-xs text-slate-500">
                  By submitting, you agree to be contacted about your application. Message/data rates may apply for SMS.
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer trust */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="text-sm font-extrabold">Proof</div>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                <li>• 500+ Active Partners</li>
                <li>• $2M+ in Commissions Paid</li>
                <li>• BBB Accredited Business</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="text-sm font-extrabold">Funding Partners</div>
              <div className="mt-3 text-sm text-slate-700">Add logos here (e.g., David Allen Capital, etc.)</div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="text-sm font-extrabold">Final push</div>
              <div className="mt-3 text-sm text-slate-700">Your financial freedom starts when you stop waiting.</div>
              <button
                onClick={() => {
                  track("cta_primary_click", { location: "footer" });
                  scrollToApplication();
                }}
                className="mt-4 w-full rounded-2xl px-5 py-3 text-sm font-extrabold text-white"
                style={{ backgroundColor: NAVY }}
              >
                Apply Now (Free)
              </button>
            </div>
          </div>

          <div className="mt-10 text-xs text-slate-500">© {new Date().getFullYear()} Moonshine Capital • distilledfunding.com</div>
        </div>
      </footer>

      {/* Video Modal */}
      {videoOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <div className="text-sm font-extrabold">2-Minute Explainer</div>
              <button
                onClick={() => setVideoOpen(false)}
                className="rounded-xl border border-slate-300 px-3 py-1 text-sm font-bold hover:bg-slate-50"
              >
                Close
              </button>
            </div>
            <div className="aspect-video bg-black">
              <iframe
                className="h-full w-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Explainer Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* Exit Intent Popup */}
      {exitOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-lg font-extrabold">Before you go…</div>
                <div className="mt-2 text-sm text-slate-600">
                  Want the short version? Watch the 2-minute explainer or apply now (free).
                </div>
              </div>
              <button
                onClick={() => setExitOpen(false)}
                className="rounded-xl border border-slate-300 px-3 py-1 text-sm font-bold hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button
                onClick={() => {
                  track("cta_secondary_click", { location: "exit_intent" });
                  setExitOpen(false);
                  setVideoOpen(true);
                }}
                className="rounded-2xl border border-slate-300 px-4 py-3 text-sm font-extrabold text-slate-900 hover:bg-slate-50"
              >
                Watch Explainer
              </button>
              <button
                onClick={() => {
                  track("cta_primary_click", { location: "exit_intent" });
                  setExitOpen(false);
                  scrollToApplication();
                }}
                className="rounded-2xl px-4 py-3 text-sm font-extrabold text-white"
                style={{ backgroundColor: GREEN }}
              >
                Apply Now (Free)
              </button>
            </div>

            <div className="mt-4 text-xs text-slate-500">Optional: swap this for a “Free Guide” lead magnet if you want warmer leads.</div>
          </div>
        </div>
      )}
    </div>
  );
}
