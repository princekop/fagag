# Custom Pterodactyl Panel Features

## ✅ What's Built

### 1. **Panel Credentials on /servers**
- Shows email and password for panel login
- Show/Hide password toggle
- Copy to clipboard for email & password
- Reset password button (generates new strong password)
- "Open Panel" button to official Pterodactyl panel

### 2. **Full Custom Panel at /panel/[identifier]**

#### **Live Resource Monitoring**
- Real-time RAM usage (MB / GB with percentage bar)
- Real-time CPU usage (% with progress bar)
- Real-time Disk usage (MB / GB with progress bar)
- Auto-refreshes every 3 seconds

#### **Power Management**
- Start server button
- Stop server button
- Restart server button
- Kill server button (force stop)
- Buttons auto-disable based on server state

#### **Live Console**
- Real-time console output via WebSocket
- Connection status indicator (Connected/Disconnected)
- Auto-scrolls to latest output
- Keeps last 200 lines in memory
- Command input field
- Send command button (only works when server is running)

#### **Tabs**
- **Console Tab**: Live console + command input
- **Files Tab**: Placeholder with link to full panel (file manager can be added later)
- **Settings Tab**: Server info including:
  - Server ID & UUID
  - Description
  - Resource limits (Memory, Disk, CPU)
  - Feature limits (Databases, Backups, Allocations)
  - Network allocations (IP:Port with primary indicator)

### 3. **API Endpoints Created**
- `GET /api/user/panel-password` - Get panel credentials
- `POST /api/user/panel-password` - Reset panel password
- `GET /api/panel/[identifier]` - Get server details
- `GET /api/panel/[identifier]/resources` - Get server resources
- `POST /api/panel/[identifier]/power` - Send power actions
- `POST /api/panel/[identifier]/command` - Send console commands
- `GET /api/panel/[identifier]/websocket` - Get WebSocket connection info

## 🚀 How to Test

1. **Restart dev server**:
   ```bash
   npm run dev
   ```

2. **Create a server** at `/create`

3. **View credentials** at `/servers` - you'll see:
   - Panel credentials card (blue gradient)
   - Your email and password with copy buttons
   - Reset password option

4. **Access custom panel**:
   - Click the gear icon on any server card
   - Opens `/panel/[identifier]` with full custom interface

5. **Test features**:
   - Start/stop server
   - Watch real-time resource usage
   - See live console output
   - Send commands like `help`, `list`, etc.
   - Check Settings tab for server info

## 📝 Notes

- WebSocket connects automatically for live console
- Console auto-scrolls and keeps last 200 lines
- Resource stats update every 3 seconds
- File manager is placeholder (can be built later with file upload/download/edit)
- All API calls go through your Next.js backend for security

## 🎨 UI Features

- Clean, modern interface
- Responsive design (works on mobile)
- Real-time updates without page refresh
- Color-coded status badges
- Progress bars for resource usage
- Monospace font for console/code
- Dark console theme with green text
- Disabled state for unavailable actions

## 🔒 Security

- All panel API calls authenticated via NextAuth session
- WebSocket uses Pterodactyl's token auth
- Passwords encrypted before storing in database
- Panel credentials only shown to server owner
