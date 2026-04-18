import React from "react";
import { Link, useLocation } from "wouter";
import { Leaf, LayoutDashboard, ScanLine, History, BookOpen, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/scan", label: "New Scan", icon: ScanLine },
    { href: "/history", label: "History", icon: History },
    { href: "/diseases", label: "Disease Library", icon: BookOpen },
  ];

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center gap-3 px-6 border-b border-sidebar-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
          <Leaf className="h-5 w-5" />
        </div>
        <span className="font-serif font-bold text-lg">AgriScan</span>
      </div>
      <div className="flex-1 px-4 py-6">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"}`}>
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="p-6 text-xs text-sidebar-foreground/50 border-t border-sidebar-border">
        &copy; {new Date().getFullYear()} AgriScan
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-background">
      {/* Mobile Header */}
      <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b bg-background px-4 md:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Leaf className="h-5 w-5" />
          </div>
          <span className="font-serif font-bold text-lg">AgriScan</span>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72 border-r-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r md:block">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-4 md:p-8 max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  );
}
