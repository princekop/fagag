import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/50 backdrop-blur-sm py-3 px-4">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>Made By</span>
          <img 
            src="https://i.postimg.cc/3wnmpM9m/avatar.png" 
            alt="Ishan" 
            className="size-3.5 rounded-full" 
          />
          <span className="font-semibold">Ishan</span>
          <span>© 2025</span>
        </div>
        <div className="hidden sm:block text-border">|</div>
        <div className="flex items-center gap-3">
          <Link href="/terms" className="hover:text-primary transition-colors">
            Terms
          </Link>
          <span className="text-border">•</span>
          <Link href="/privacy" className="hover:text-primary transition-colors">
            Privacy
          </Link>
          <span className="text-border">•</span>
          <Link href="/cookies" className="hover:text-primary transition-colors">
            Cookies
          </Link>
        </div>
      </div>
    </footer>
  )
}
