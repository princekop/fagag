export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/50 backdrop-blur-sm py-3 px-4">
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <span>Made By</span>
        <img 
          src="https://i.postimg.cc/3wnmpM9m/avatar.png" 
          alt="Ishan" 
          className="size-3.5 rounded-full" 
        />
        <span className="font-semibold">Ishan</span>
        <span>© 2025</span>
      </div>
    </footer>
  )
}
