"use client"

import { Card } from "@/components/ui/card"
import { IconServer, IconRocket, IconSettings, IconPlayerPlay } from "@tabler/icons-react"

export default function CreatingServersPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm font-medium">
          <IconServer className="size-4" />
          Guide
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
          Creating Your First Server
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl">
          Step-by-step guide to deploying your game server on Sjnodes in minutes.
        </p>
      </div>

      {/* Step-by-Step Guide */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-white">Step-by-Step Guide</h2>
        
        {/* Step 1 */}
        <Card className="border-white/10 bg-white/5 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-white font-bold text-xl">
              1
            </div>
            <h3 className="text-2xl font-bold text-white">Navigate to Create Server</h3>
          </div>
          <p className="text-gray-300 leading-relaxed pl-15">
            From your dashboard, click on the "Create Server" button in the sidebar or quick actions card. This will take you to the server creation page.
          </p>
          <div className="rounded-lg bg-black/50 border border-white/10 p-4">
            <code className="text-sm text-green-400">Dashboard → Create Server</code>
          </div>
        </Card>

        {/* Step 2 */}
        <Card className="border-white/10 bg-white/5 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-white font-bold text-xl">
              2
            </div>
            <h3 className="text-2xl font-bold text-white">Choose Your Game</h3>
          </div>
          <p className="text-gray-300 leading-relaxed pl-15">
            Select from our wide range of supported games and server types. Popular options include:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pl-15">
            <div className="rounded-lg bg-gradient-to-br from-green-500/20 to-transparent border border-green-500/20 p-3 text-center">
              <div className="font-bold text-white">Minecraft</div>
              <div className="text-xs text-gray-400">Java & Bedrock</div>
            </div>
            <div className="rounded-lg bg-gradient-to-br from-blue-500/20 to-transparent border border-blue-500/20 p-3 text-center">
              <div className="font-bold text-white">Discord Bots</div>
              <div className="text-xs text-gray-400">Node.js / Python</div>
            </div>
            <div className="rounded-lg bg-gradient-to-br from-purple-500/20 to-transparent border border-purple-500/20 p-3 text-center">
              <div className="font-bold text-white">FiveM</div>
              <div className="text-xs text-gray-400">GTA V Roleplay</div>
            </div>
            <div className="rounded-lg bg-gradient-to-br from-red-500/20 to-transparent border border-red-500/20 p-3 text-center">
              <div className="font-bold text-white">Rust</div>
              <div className="text-xs text-gray-400">Survival Game</div>
            </div>
            <div className="rounded-lg bg-gradient-to-br from-amber-500/20 to-transparent border border-amber-500/20 p-3 text-center">
              <div className="font-bold text-white">ARK</div>
              <div className="text-xs text-gray-400">Survival Evolved</div>
            </div>
            <div className="rounded-lg bg-gradient-to-br from-cyan-500/20 to-transparent border border-cyan-500/20 p-3 text-center">
              <div className="font-bold text-white">Terraria</div>
              <div className="text-xs text-gray-400">Adventure Game</div>
            </div>
          </div>
        </Card>

        {/* Step 3 */}
        <Card className="border-white/10 bg-white/5 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-white font-bold text-xl">
              3
            </div>
            <h3 className="text-2xl font-bold text-white">Configure Server Settings</h3>
          </div>
          <p className="text-gray-300 leading-relaxed pl-15">
            Customize your server with the following options:
          </p>
          <div className="space-y-3 pl-15">
            <div className="rounded-lg bg-black/50 border border-white/10 p-4">
              <div className="font-bold text-white mb-2">Server Name</div>
              <div className="text-sm text-gray-400">Choose a unique name for your server (visible to others)</div>
            </div>
            <div className="rounded-lg bg-black/50 border border-white/10 p-4">
              <div className="font-bold text-white mb-2">Server Location</div>
              <div className="text-sm text-gray-400">Select the nearest region for best performance</div>
            </div>
            <div className="rounded-lg bg-black/50 border border-white/10 p-4">
              <div className="font-bold text-white mb-2">Server Version</div>
              <div className="text-sm text-gray-400">Choose the game version you want to run</div>
            </div>
            <div className="rounded-lg bg-black/50 border border-white/10 p-4">
              <div className="font-bold text-white mb-2">Resource Allocation</div>
              <div className="text-sm text-gray-400">Allocate RAM, CPU, and storage based on your available resources</div>
            </div>
          </div>
        </Card>

        {/* Step 4 */}
        <Card className="border-white/10 bg-white/5 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-white font-bold text-xl">
              4
            </div>
            <h3 className="text-2xl font-bold text-white">Deploy Your Server</h3>
          </div>
          <p className="text-gray-300 leading-relaxed pl-15">
            Click the "Create Server" button and wait for the deployment to complete. This usually takes 30-60 seconds.
          </p>
          <div className="rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/20 p-4 pl-15">
            <div className="flex items-center gap-3">
              <IconRocket className="size-6 text-green-400" />
              <div>
                <div className="font-bold text-white">Instant Deployment</div>
                <div className="text-sm text-gray-300">Your server will be ready in under a minute!</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Step 5 */}
        <Card className="border-white/10 bg-white/5 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-white font-bold text-xl">
              5
            </div>
            <h3 className="text-2xl font-bold text-white">Start Playing</h3>
          </div>
          <p className="text-gray-300 leading-relaxed pl-15">
            Once deployed, your server will appear in your server list. Click on it to:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-15">
            <div className="rounded-lg bg-black/50 border border-white/10 p-4 flex items-center gap-3">
              <IconPlayerPlay className="size-5 text-green-400" />
              <div>
                <div className="font-semibold text-white">Start Server</div>
                <div className="text-xs text-gray-400">Power on your server</div>
              </div>
            </div>
            <div className="rounded-lg bg-black/50 border border-white/10 p-4 flex items-center gap-3">
              <IconSettings className="size-5 text-blue-400" />
              <div>
                <div className="font-semibold text-white">Configure</div>
                <div className="text-xs text-gray-400">Manage server settings</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Resource Requirements */}
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-white">Resource Requirements</h2>
        <Card className="border-white/10 bg-white/5 p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="pb-3 text-gray-400 font-semibold">Server Type</th>
                  <th className="pb-3 text-gray-400 font-semibold">Min RAM</th>
                  <th className="pb-3 text-gray-400 font-semibold">Min Storage</th>
                  <th className="pb-3 text-gray-400 font-semibold">Recommended For</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-white/10">
                  <td className="py-3 font-medium text-white">Minecraft Java</td>
                  <td className="py-3">2 GB</td>
                  <td className="py-3">5 GB</td>
                  <td className="py-3">1-10 players</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-3 font-medium text-white">Discord Bot</td>
                  <td className="py-3">512 MB</td>
                  <td className="py-3">1 GB</td>
                  <td className="py-3">Small servers</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-3 font-medium text-white">FiveM</td>
                  <td className="py-3">4 GB</td>
                  <td className="py-3">10 GB</td>
                  <td className="py-3">Roleplay servers</td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-white">Rust</td>
                  <td className="py-3">4 GB</td>
                  <td className="py-3">15 GB</td>
                  <td className="py-3">Small to medium</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Tips */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/10 to-purple-500/10 p-6 space-y-4">
        <h3 className="text-xl font-bold text-white">💡 Pro Tips</h3>
        <ul className="space-y-2 text-gray-300">
          <li>• Start with minimal resources and scale up as needed to save coins</li>
          <li>• Choose a server location close to your players for better performance</li>
          <li>• Enable automatic backups to protect your server data</li>
          <li>• Use the console to monitor server performance and debug issues</li>
          <li>• Join our Discord for server configuration templates and support</li>
        </ul>
      </Card>
    </div>
  )
}
