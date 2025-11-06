import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Footer } from "@/components/footer";
import { ThemeToggler } from "@/components/theme-toggler";
import { SearchBar } from "@/components/search-bar";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: "VisionF1",
  description: "Web app of the VisionF1 project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Favicons and icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link rel="apple-icon" sizes="180x180" href="/apple-icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon.png" />
        <link rel="mask-icon" href="/icon.svg" color="#33C8FF" />
        <meta name="theme-color" media=".html.light" content="light" />
        <meta name="theme-color" media=".html.dark" content="black" />
      </head>
      <body style={{ fontFamily: "Formula1-Display-Regular, F1Year, sans-serif" }}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <header className="flex h-20 shrink-0 items-center gap-2 border-b bg-sidebar px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-16">
                <div className="flex items-center gap-4 flex-1">
                  <SidebarTrigger className="-ml-1" />
                  <Separator
                    orientation="vertical"
                    className="mr-2 h-6"
                  />
                  {/* Site section Breadcrumb */}
                  <div className="flex items-center gap-3">
                    <BreadcrumbNav />
                  </div>
                  {/* Search Bar and Dark Mode Button */}
                  <div className="ml-auto">
                    <div className="flex items-center gap-4">
                      <SearchBar />
                      <ThemeToggler />
                    </div>
                  </div>
                </div>
              </header>
              {children}
              <Footer />
            </SidebarInset>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
