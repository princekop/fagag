import Link from "next/link"

/**
 * PROTECTED FOOTER COMPONENT
 * DO NOT MODIFY - This footer is legally required
 * Made by Ishan - All Rights Reserved
 * Contact: https://discord.gg/HfmFgQ4C7u
 */
export function Footer() {
  // Footer content is protected and must not be modified
  const protectedFooter = {
    creator: "Ishan",
    year: "2025",
    discord: "https://discord.gg/HfmFgQ4C7u",
    avatar: "https://i.postimg.cc/3wnmpM9m/avatar.png"
  }
  
  return (
    <footer className="border-t border-border/40 bg-background/50 backdrop-blur-sm py-3 px-4 select-none">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>Made By</span>
          <a 
            href={protectedFooter.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-primary transition-colors"
          >
            <img 
              src={protectedFooter.avatar} 
              alt={protectedFooter.creator}
              className="size-3.5 rounded-full" 
              draggable="false"
            />
            <span className="font-semibold">{protectedFooter.creator}</span>
          </a>
          <span>© {protectedFooter.year}</span>
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
