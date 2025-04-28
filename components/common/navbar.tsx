"use client";

import Link from "next/link";
import { ModeToggle } from "../home/mode-toggle";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Upload, BarChart3, Shield } from "lucide-react";
// import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export function Navbar() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">TrueMeds</span>
          </Link>
          {isAdmin && (
            <span className="ml-2 rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
              Admin
            </span>
          )}
        </div>

        <nav className="flex items-center gap-4">
          {!isAdmin ? (
            <>
              <Link
                href="/upload"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === "/upload"
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                <span className="hidden sm:inline-flex items-center gap-1">
                  <Upload className="h-4 w-4" />
                  Verify Drug
                </span>
                <Upload className="h-5 w-5 sm:hidden" />
              </Link>
              <Link
                href="/admin/login"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Admin
              </Link>
            </>
          ) : (
            <Link
              href="/admin/dashboard"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/admin/dashboard"
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <span className="hidden sm:inline-flex items-center gap-1">
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </span>
              <BarChart3 className="h-5 w-5 sm:hidden" />
            </Link>
          )}
          <ModeToggle />
        </nav>
      </div>
    </header>
  );
}
