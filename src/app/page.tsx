import type { Metadata } from "next";

import Image from "next/image";

import { Shoe, ShoeRow, Wordmark } from "@/components/brand";
import LegalView from "@/components/legal-view";

const TITLE = "Sprint";
const DESCRIPTION = "Start your fitness journey";

// PLACEHOLDER. Intended domain: sprint.antosocial (spelling unconfirmed). Replace before launch.
const SITE_URL = "https://example.invalid";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  metadataBase: SITE_URL,
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: TITLE,
    description: DESCRIPTION,
    siteName: "Sprint",
    images: [
      {
        url: "/illustration-m-equipment.png",
        width: 1440,
        height: 1120,
        alt: "Sprint",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: "/illustration-m-equipment.png",
  },
};

export default function Home() {
  return (
    <div className="screen">
      <div className="content">
        <header className="topbar">
          <Wordmark className="brand-wordmark logo-bold" />
          <ShoeRow className="brand-shoe-row" />
        </header>
        <a className="label-large btn-get-started" href="/signup">
          Get Started
        </a>
        <div className="headline-group">
          <h1 className="display-large hero-display">
            Start your fitness journey
          </h1>
          <p className="body-large sentence">
            {"Ask Sprint about opening hours, sessions, programmes, rules and your attendance, any time. Every answer comes from your gym's own records."}
          </p>
        </div>

        <div className="hero-art">
          <Image
            className="hero-art-image"
            src="/illustration-m-equipment.png"
            width={1440}
            height={1120}
            loading="eager"
            alt=""
          />
        </div>

        <div className="bottom-group">
          <p className="body-large member-line">
            New to Sprint? Create your account to stay connected with your gym and see what it offers.
          </p>
          <a className="cta-button" href="/signup">
            <span className="cta-badge" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
            <span className="label-large cta-label">Get Started</span>
            <Shoe className="brand-shoe" />
          </a>
          <p className="login-line">
            Already have an account? <a className="inline-link login-link" href="/login">Log in</a>
          </p>
          <LegalView />
        </div>

        <section className="qa-section" aria-label="What you can ask Sprint">
          <h2 className="title-large qa-heading">What you can ask Sprint</h2>
          <div className="chip-group">
            <span className="label-large chip">Opening hours</span>
            <span className="label-large chip">Sessions</span>
            <span className="label-large chip">Programmes</span>
            <span className="label-large chip">Gym rules</span>
            <span className="label-large chip">Guest rules</span>
            <span className="label-large chip">My gym records</span>
          </div>
        </section>
      </div>
    </div>
  );
}