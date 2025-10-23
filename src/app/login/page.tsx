import { GalleryVerticalEnd } from "lucide-react"

import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh overflow-hidden lg:grid-cols-2">
      <div className="flex flex-col gap-4 bg-background/80 p-6 backdrop-blur-sm md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex size-9 items-center justify-center rounded-2xl overflow-hidden">
              <img 
                src="https://i.postimg.cc/tCyDLdDB/IMG-0100.png" 
                alt="Sjnodes Logo" 
                className="size-9 object-contain"
              />
            </div>
            <span className="text-lg tracking-tight">Sjnodes Dashboard</span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <LoginForm />
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-foreground/70">
          <span>Made By</span>
          <img src="https://i.postimg.cc/3wnmpM9m/avatar.png" alt="Ishan" className="size-4 rounded-full" />
          <span className="font-bold">Ishan</span>
          <span>© 2025</span>
        </div>
      </div>
      <div className="relative hidden overflow-hidden lg:block">
        <iframe
          title="Sjnodes dashboard"
          src="https://www.youtube.com/embed/CiQJSR4mYJ4?autoplay=1&mute=1&loop=1&controls=0&rel=0&modestbranding=1&playlist=CiQJSR4mYJ4&vq=hd2160"
          allow="autoplay; fullscreen; picture-in-picture"
          loading="lazy"
          allowFullScreen
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/20 to-background/80 backdrop-blur-sm" />
        <div className="pointer-events-none absolute bottom-6 left-6 right-6">
          <div className="rounded-2xl border border-white/20 bg-white/10 p-6 text-white shadow-2xl backdrop-blur-md">
            <p className="text-sm uppercase tracking-[0.35em] text-white/70">Command Center</p>
            <h2 className="text-2xl font-semibold">Manage servers effortlessly</h2>
            <p className="text-sm text-white/75">
              Real-time status, instant controls, and insights tailored for your Minecraft community.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
