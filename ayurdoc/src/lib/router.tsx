import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
  type MouseEvent,
  type AnchorHTMLAttributes,
} from "react";

/* -------------------------------------------------------------------------
 * Minimal client-side router for the static single-file build.
 * Uses hash-based routing (#/path) so every route works when dist/index.html
 * is served from any static host with no server rewrites.
 * ---------------------------------------------------------------------- */

type RouterValue = {
  path: string;
  navigate: (to: string, opts?: { replace?: boolean }) => void;
};

const RouterContext = createContext<RouterValue>({
  path: "/",
  navigate: () => {},
});

function currentPath(): string {
  if (typeof window !== "undefined" && window.location.hash.startsWith("#/")) {
    return window.location.hash.slice(1).split(/[?#]/)[0];
  }
  if (typeof window !== "undefined") {
    const p = window.location.pathname;
    if (p && p !== "/") return p;
  }
  return "/";
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState<string>(currentPath);

  useEffect(() => {
    const onChange = () => {
      setPath(currentPath());
      if (window.location.hash.startsWith("#/")) {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      } else {
        const target = window.location.hash.slice(1).split("?")[0];
        document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
      }
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  const navigate = useCallback((to: string, opts?: { replace?: boolean }) => {
    const target = to.startsWith("/") ? to : `/${to}`;
    const nextHash = `#${target}`;
    if (window.location.hash === nextHash) return;
    if (opts?.replace) {
      const url = `${window.location.pathname}${window.location.search}${nextHash}`;
      window.history.replaceState(null, "", url);
      setPath(target);
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    } else {
      window.location.hash = target;
    }
  }, []);

  return (
    <RouterContext.Provider value={{ path, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function usePathname(): string {
  return useContext(RouterContext).path;
}

export function useRouter() {
  const { navigate } = useContext(RouterContext);
  return {
    push: (to: string) => navigate(to),
    replace: (to: string) => navigate(to, { replace: true }),
  };
}

export function navigateTo(to: string) {
  const target = to.startsWith("/") ? to : `/${to}`;
  window.location.hash = target;
}

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  children: ReactNode;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
  ariaLabel?: string;
  target?: string;
  rel?: string;
};

export function Link({
  href,
  children,
  onClick,
  className,
  ariaLabel,
  target,
  rel,
  ...anchorProps
}: LinkProps) {
  const { navigate } = useContext(RouterContext);
  const isInternal =
    typeof href === "string" &&
    href.startsWith("/") &&
    !href.startsWith("//") &&
    !href.includes("://");

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);
    if (e.defaultPrevented) return;
    if (
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      target === "_blank"
    ) {
      return;
    }
    if (!isInternal) return;
    e.preventDefault();
    navigate(href);
  };

  const hrefAttr = isInternal ? `#${href}` : href;

  return (
    <a
      {...anchorProps}
      href={hrefAttr}
      onClick={handleClick}
      className={className}
      aria-label={ariaLabel ?? anchorProps["aria-label"]}
      target={target}
      rel={rel}
    >
      {children}
    </a>
  );
}


