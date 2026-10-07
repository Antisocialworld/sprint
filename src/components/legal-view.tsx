"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from "react";

import {
  PRIVACY_POLICY,
  TERMS_OF_SERVICE,
  type LegalDocument,
  type LegalDocumentId,
} from "./legal-views";

const DOCUMENTS: Record<LegalDocumentId, LegalDocument> = {
  privacy: PRIVACY_POLICY,
  terms: TERMS_OF_SERVICE,
};

const viewStyle: CSSProperties = {
  position: "fixed",
  top: "0",
  right: "0",
  bottom: "0",
  left: "0",
  overflowY: "auto",
  overscrollBehavior: "contain",
  backgroundColor: "var(--color-surface)",
  color: "var(--color-on-surface)",
};

const innerStyle: CSSProperties = {
  maxWidth: "var(--layout-content-max-width)",
  margin: "0 auto",
  padding: "0 var(--spacing-base-spacing) var(--spacing-base-spacing)",
  overflowWrap: "break-word",
};

/* Back + title stick to the top of the dialog while the document
   scrolls under them. The header carries the inner padding-top so the
   16px inset above Back is identical at scroll 0 and while stuck, and
   the opaque background covers passing text the whole way. */
const headerStyle: CSSProperties = {
  position: "sticky",
  top: "0",
  backgroundColor: "var(--color-surface)",
  borderBottom: "1px solid var(--color-outline-variant)",
  paddingTop: "var(--spacing-base-spacing)",
};

const backStyle: CSSProperties = {
  cursor: "pointer",
  border: "none",
  borderRadius: "var(--radius-full)",
  backgroundColor: "var(--color-surface-container-high)",
  color: "var(--color-on-surface)",
  padding: "var(--spacing-small-spacing) var(--spacing-base-spacing)",
  marginBottom: "var(--spacing-extra-large-spacing)",
};

const titleStyle: CSSProperties = {
  margin: "0",
  fontFamily: "var(--font-title-large-fontfamily)",
  fontSize: "var(--font-title-large-fontsize)",
  lineHeight: "var(--font-title-large-lineheight)",
  fontWeight: "var(--font-title-large-fontweight)",
  letterSpacing: "var(--font-title-large-letterspacing)",
};

const metaStyle: CSSProperties = {
  margin: "0",
  marginBottom: "var(--spacing-extra-large-spacing)",
  fontFamily: "var(--font-body-small-fontfamily)",
  fontSize: "var(--font-body-small-fontsize)",
  lineHeight: "var(--font-body-small-lineheight)",
  fontWeight: "var(--font-body-small-fontweight)",
  letterSpacing: "var(--font-body-small-letterspacing)",
};

const sectionStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--spacing-base-spacing)",
  marginBottom: "var(--spacing-extra-large-spacing)",
};

const headingStyle: CSSProperties = {
  margin: "0",
  fontFamily: "var(--font-title-small-fontfamily)",
  fontSize: "var(--font-title-small-fontsize)",
  lineHeight: "var(--font-title-small-lineheight)",
  fontWeight: "var(--font-title-small-fontweight)",
  letterSpacing: "var(--font-title-small-letterspacing)",
};

const paragraphStyle: CSSProperties = {
  margin: "0",
};

const footerStyle: CSSProperties = {
  marginTop: "var(--spacing-extra-large-spacing)",
  marginBottom: "var(--spacing-base-spacing)",
};

const linkButtonStyle: CSSProperties = {
  border: "none",
  backgroundColor: "transparent",
  padding: "0",
  margin: "0",
  font: "inherit",
  textAlign: "inherit",
  display: "inline",
  cursor: "pointer",
};

function isDocumentId(value: unknown): value is LegalDocumentId {
  return value === "privacy" || value === "terms";
}

export default function LegalView() {
  const [view, setView] = useState<LegalDocumentId | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const backButtonRef = useRef<HTMLButtonElement | null>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const pushedRef = useRef(false);
  const closingRef = useRef(false);

  const close = useCallback(() => {
    if (closingRef.current) {
      return;
    }
    if (pushedRef.current) {
      closingRef.current = true;
      window.history.back();
      return;
    }
    setView(null);
  }, []);

  const openFromLegalLine = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const id = event.currentTarget.dataset.legalId;
      if (!isDocumentId(id)) {
        return;
      }
      openerRef.current = event.currentTarget;
      window.history.pushState({ legal: id }, "");
      pushedRef.current = true;
      closingRef.current = false;
      setView(id);
    },
    [],
  );

  const switchTo = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    const id = event.currentTarget.dataset.legalId;
    if (!isDocumentId(id)) {
      return;
    }
    window.history.replaceState({ legal: id }, "");
    pushedRef.current = true;
    closingRef.current = false;
    setView(id);
  }, []);

  useEffect(() => {
    const onPopState = (event: PopStateEvent) => {
      const state = event.state as { legal?: unknown } | null;
      const next = state && isDocumentId(state.legal) ? state.legal : null;
      pushedRef.current = next !== null;
      closingRef.current = false;
      setView(next);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (view) {
      if (containerRef.current) {
        containerRef.current.scrollTop = 0;
      }
      const active = document.activeElement;
      if (!active || !containerRef.current?.contains(active)) {
        backButtonRef.current?.focus();
      }
    } else if (openerRef.current) {
      openerRef.current.focus();
      openerRef.current = null;
    }
  }, [view]);

  useEffect(() => {
    if (!view) {
      return undefined;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [view]);

  useEffect(() => {
    if (!view) {
      return undefined;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [view, close]);

  useEffect(() => {
    if (!view) {
      return undefined;
    }
    const container = containerRef.current;
    if (!container) {
      return undefined;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") {
        return;
      }
      const focusables = Array.from(
        container.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusables.length === 0) {
        event.preventDefault();
        container.focus();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (event.shiftKey) {
        if (active === first || !container.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last || !container.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [view]);

  const doc = view ? DOCUMENTS[view] : null;

  return (
    <>
      <p className="body-small legal-line">
        By continuing, you agree to Sprint&apos;s{" "}
        <button
          type="button"
          className="inline-link"
          style={linkButtonStyle}
          data-legal-id="terms"
          onClick={openFromLegalLine}
        >
          Terms of Service
        </button>{" "}
        and{" "}
        <button
          type="button"
          className="inline-link"
          style={linkButtonStyle}
          data-legal-id="privacy"
          onClick={openFromLegalLine}
        >
          Privacy Policy
        </button>
        .
      </p>
      {doc && (
        <div
          ref={containerRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="legal-view-title"
          tabIndex={-1}
          style={viewStyle}
        >
          <div style={innerStyle}>
            <div style={headerStyle}>
              <button
                ref={backButtonRef}
                type="button"
                className="label-large"
                style={backStyle}
                onClick={close}
              >
                Back
              </button>
              <h2 id="legal-view-title" style={titleStyle}>
                {doc.title}
              </h2>
            </div>
            <p style={metaStyle}>{doc.meta}</p>
            {doc.sections.map((section) => (
              <section key={section.heading} style={sectionStyle}>
                <h3 style={headingStyle}>{section.heading}</h3>
                {section.paragraphs.map((paragraph, index) => (
                  <p key={index} className="body-medium" style={paragraphStyle}>
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
            <footer className="body-medium" style={footerStyle}>
              {doc.id === "terms" ? (
                <span>Terms of Service</span>
              ) : (
                <button
                  type="button"
                  className="inline-link"
                  style={linkButtonStyle}
                  data-legal-id="terms"
                  onClick={switchTo}
                >
                  Terms of Service
                </button>
              )}
              {" \u00B7 "}
              {doc.id === "privacy" ? (
                <span>Privacy Policy</span>
              ) : (
                <button
                  type="button"
                  className="inline-link"
                  style={linkButtonStyle}
                  data-legal-id="privacy"
                  onClick={switchTo}
                >
                  Privacy Policy
                </button>
              )}
            </footer>
          </div>
        </div>
      )}
    </>
  );
}
