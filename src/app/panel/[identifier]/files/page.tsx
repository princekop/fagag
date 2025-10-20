"use client"

import React, { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { IconFolder, IconFile, IconDownload, IconTrash, IconEdit, IconArrowLeft, IconPlus, IconUpload, IconRefresh, IconFileText, IconFileZip, IconCode, IconPhoto, IconMusic, IconVideo, IconX, IconSearch, IconCopy, IconFolderPlus } from "@tabler/icons-react"
import Link from "next/link"
import { PanelSidebar } from "@/components/panel-sidebar"

type FileItem = {
  name: string
  mode: string
  size: number
  is_file: boolean
  is_symlink: boolean
  mimetype: string
  created_at: string
  modified_at: string
}

export default function FilesPage() {
  const params = useParams()
  const router = useRouter()
  const { status } = useSession()
  const identifier = params?.identifier as string

  const [server, setServer] = useState<any>(null)
  const [files, setFiles] = useState<FileItem[]>([])
  const [currentPath, setCurrentPath] = useState("/")
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
  const [editContent, setEditContent] = useState("")
  const [showEditModal, setShowEditModal] = useState(false)
  const [showRenameModal, setShowRenameModal] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [newFileName, setNewFileName] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loadingFile, setLoadingFile] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    console.log("[FILES PAGE] useEffect triggered - status:", status, "identifier:", identifier)
    if (status === "unauthenticated") {
      console.log("[FILES PAGE] Not authenticated, redirecting to login")
      router.push("/login")
    } else if (status === "authenticated") {
      console.log("[FILES PAGE] Authenticated, fetching server and files")
      fetchServer()
      fetchFiles("/")
    } else {
      console.log("[FILES PAGE] Status is loading...")
    }
  }, [status, identifier])

  const fetchServer = async () => {
    try {
      const res = await fetch(`/api/panel/${identifier}`)
      if (res.ok) {
        const data = await res.json()
        setServer(data)
      }
    } catch (e) {
      console.error("Failed to load server", e)
    }
  }

  const fetchFiles = async (path: string) => {
    setLoading(true)
    setError(null)
    console.log("[FILES PAGE] Fetching files for path:", path, "identifier:", identifier)
    try {
      const url = `/api/panel/${identifier}/files?directory=${encodeURIComponent(path)}`
      console.log("[FILES PAGE] Fetching from URL:", url)
      
      const res = await fetch(url, { cache: 'no-store' })
      console.log("[FILES PAGE] Response status:", res.status, res.statusText)
      
      if (res.ok) {
        const data = await res.json()
        console.log("[FILES PAGE] Files API response:", data)
        console.log("[FILES PAGE] Data keys:", Object.keys(data))
        
        // Handle Pterodactyl's nested structure: { data: [{ attributes: {...} }] }
        let filesList = Array.isArray(data) ? data : (data.data || [])
        
        // Extract attributes if data is wrapped
        if (filesList.length > 0 && filesList[0].attributes) {
          filesList = filesList.map((item: any) => item.attributes)
          console.log("[FILES PAGE] Extracted attributes from nested structure")
        }
        
        console.log("[FILES PAGE] Files list length:", filesList.length)
        console.log("[FILES PAGE] First file:", filesList[0])
        
        setFiles(filesList)
        setCurrentPath(path)
        setError(null)
      } else {
        console.error("[FILES PAGE] Failed to load files, status:", res.status)
        const errorText = await res.text()
        console.error("[FILES PAGE] Error response:", errorText)
        setError(`Failed to load files (${res.status}): ${errorText}`)
        setFiles([])
      }
    } catch (e) {
      console.error("[FILES PAGE] Failed to load files", e)
      setError(`Error: ${(e as Error).message}`)
      setFiles([])
    }
    setLoading(false)
  }

  const createFolder = async () => {
    const name = prompt("Enter folder name:")
    if (!name) return

    try {
      const res = await fetch(`/api/panel/${identifier}/files`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create_folder", path: currentPath, name })
      })
      if (res.ok) {
        alert("Folder created successfully!")
        fetchFiles(currentPath)
      } else {
        alert("Failed to create folder")
      }
    } catch (e) {
      console.error("Failed to create folder", e)
      alert("Failed to create folder")
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)
    formData.append("directory", currentPath)

    try {
      const res = await fetch(`/api/panel/${identifier}/files/upload`, {
        method: "POST",
        body: formData
      })
      if (res.ok) {
        alert("File uploaded successfully!")
        fetchFiles(currentPath)
      } else {
        alert("Failed to upload file")
      }
    } catch (e) {
      console.error("Failed to upload file", e)
      alert("Failed to upload file")
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const getFileIcon = (file: FileItem) => {
    if (!file.is_file) return IconFolder
    const ext = file.name.split(".").pop()?.toLowerCase()
    switch (ext) {
      case "zip": case "rar": case "7z": case "tar": case "gz": return IconFileZip
      case "js": case "ts": case "jsx": case "tsx": case "json": case "yml": case "yaml": case "xml": return IconCode
      case "png": case "jpg": case "jpeg": case "gif": case "svg": case "webp": return IconPhoto
      case "mp3": case "wav": case "ogg": return IconMusic
      case "mp4": case "avi": case "mkv": return IconVideo
      case "txt": case "md": case "log": return IconFileText
      default: return IconFile
    }
  }

  const filteredFiles = files.filter(file => 
    file.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ?? false
  )

  const openFile = async (file: FileItem) => {
    if (!file.is_file) return

    setLoadingFile(true)
    const filePath = currentPath === "/" ? "/" + file.name : currentPath + "/" + file.name
    const ext = file.name.split(".").pop()?.toLowerCase()
    
    // Check if it's an image
    if (["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp"].includes(ext || "")) {
      // Fetch image through our API to handle auth
      try {
        const res = await fetch(`/api/panel/${identifier}/files/content?file=${encodeURIComponent(filePath)}`)
        if (res.ok) {
          const blob = await res.blob()
          const url = URL.createObjectURL(blob)
          setImageUrl(url)
          setSelectedFile(file)
          setShowImageModal(true)
        } else {
          alert("Failed to load image")
        }
      } catch (e) {
        console.error("Failed to load image", e)
        alert("Failed to load image")
      } finally {
        setLoadingFile(false)
      }
      return
    }

    // For text files, open editor
    try {
      const res = await fetch(`/api/panel/${identifier}/files/content?file=${encodeURIComponent(filePath)}`)
      if (res.ok) {
        const content = await res.text()
        setEditContent(content)
        setSelectedFile(file)
        setShowEditModal(true)
      } else {
        alert("Failed to load file content")
      }
    } catch (e) {
      console.error("Failed to open file", e)
      alert("Failed to open file")
    } finally {
      setLoadingFile(false)
    }
  }

  const saveFile = async () => {
    if (!selectedFile) return

    setSaving(true)
    try {
      const filePath = currentPath === "/" ? "/" + selectedFile.name : currentPath + "/" + selectedFile.name
      const res = await fetch(`/api/panel/${identifier}/files/write`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file: filePath, content: editContent })
      })
      if (res.ok) {
        alert("File saved successfully!")
        setShowEditModal(false)
        fetchFiles(currentPath)
      } else {
        alert("Failed to save file")
      }
    } catch (e) {
      console.error("Failed to save file", e)
      alert("Failed to save file")
    }
    setSaving(false)
  }

  const downloadFile = async (fileName: string) => {
    try {
      const filePath = currentPath === "/" ? "/" + fileName : currentPath + "/" + fileName
      const url = `/api/panel/${identifier}/files/download?file=${encodeURIComponent(filePath)}`
      
      // Create a temporary link and trigger download
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (e) {
      console.error("Failed to download", e)
      alert("Failed to download file")
    }
  }

  const renameFile = async () => {
    if (!selectedFile || !newFileName) return

    try {
      const res = await fetch(`/api/panel/${identifier}/files/rename`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          root: currentPath,
          from: selectedFile.name,
          to: newFileName
        })
      })
      if (res.ok) {
        alert("Renamed successfully!")
        setShowRenameModal(false)
        setNewFileName("")
        fetchFiles(currentPath)
      } else {
        alert("Failed to rename")
      }
    } catch (e) {
      console.error("Failed to rename", e)
      alert("Failed to rename")
    }
  }

  const copyPath = (fileName: string) => {
    const fullPath = currentPath === "/" ? "/" + fileName : currentPath + "/" + fileName
    navigator.clipboard.writeText(fullPath)
    alert("Path copied to clipboard!")
  }

  const deleteFile = async (fileName: string) => {
    if (!confirm(`Delete ${fileName}?`)) return

    try {
      const res = await fetch(`/api/panel/${identifier}/files?file=${encodeURIComponent(fileName)}&directory=${encodeURIComponent(currentPath)}`, {
        method: "DELETE"
      })
      if (res.ok) {
        alert("Deleted successfully!")
        fetchFiles(currentPath)
      } else {
        alert("Failed to delete")
      }
    } catch (e) {
      console.error("Failed to delete", e)
      alert("Failed to delete")
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString()
  }

  if (loading && !server) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <p className="text-white">Loading...</p>
      </div>
    )
  }

  if (!server) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <p className="text-white">Server not found</p>
      </div>
    )
  }

  const serverAttrs = server.attributes

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Animated Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-1/4 top-0 size-96 animate-pulse rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -right-1/4 top-1/3 size-96 animate-pulse rounded-full bg-purple-500/10 blur-3xl delay-1000" />
        <div className="absolute bottom-0 left-1/3 size-96 animate-pulse rounded-full bg-green-500/10 blur-3xl delay-500" />
      </div>

      {/* Sidebar */}
      <PanelSidebar
        identifier={identifier}
        serverName={serverAttrs.name}
        serverStatus={serverAttrs.status}
      />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <div className="relative border-b border-white/10 backdrop-blur-xl bg-black/20">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild className="hover:bg-white/10 text-gray-400 hover:text-white">
                  <Link href={`/panel/${identifier}`}>
                    <IconArrowLeft className="size-4" />
                  </Link>
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-white">File Manager</h1>
                  <p className="text-sm text-gray-400">{serverAttrs.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="border-yellow-500/30 bg-yellow-500/10 text-yellow-300">
                  Status: {status} | Files: {files.length}
                </Badge>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="border-white/10 bg-white/5 hover:bg-white/10 text-white"
                >
                  <IconUpload className="mr-2 size-4" />
                  {uploading ? "Uploading..." : "Upload"}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={createFolder} 
                  className="border-white/10 bg-white/5 hover:bg-white/10 text-white"
                >
                  <IconFolderPlus className="mr-2 size-4" />
                  New Folder
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => {
                    console.log("[TEST] Manual refresh button clicked")
                    fetchFiles(currentPath)
                  }} 
                  className="border-green-500/30 bg-green-500/10 hover:bg-green-500/20 text-green-300"
                >
                  <IconRefresh className="size-4 mr-2" />
                  Test Load
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="relative flex-1 overflow-y-auto px-6 py-6">
          {/* Search and Breadcrumb */}
          <div className="mb-6 space-y-4">
            {/* Search Bar */}
            <div className="relative max-w-md">
              <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search files and folders..."
                className="pl-10 border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus:border-blue-500/50"
              />
              {searchTerm && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <IconX className="size-4" />
                </Button>
              )}
            </div>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
              <button 
                onClick={() => fetchFiles("/")} 
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
              >
                <IconFolder className="size-4" />
                Home
              </button>
              {currentPath !== "/" && currentPath.split("/").filter(Boolean).map((part, i, arr) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-gray-600">/</span>
                  <button
                    onClick={() => fetchFiles("/" + arr.slice(0, i + 1).join("/"))}
                    className="px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                  >
                    {part}
                  </button>
                </div>
              ))}
              {files.length > 0 && (
                <Badge variant="outline" className="ml-auto border-white/10 bg-white/5 text-gray-400">
                  {filteredFiles.length} {filteredFiles.length === 1 ? "item" : "items"}
                </Badge>
              )}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-4 rounded-xl border border-red-500/30 bg-red-500/10 backdrop-blur-xl">
              <div className="flex items-start gap-3">
                <div className="text-red-400">⚠️</div>
                <div className="flex-1">
                  <h3 className="text-red-400 font-semibold mb-1">Error Loading Files</h3>
                  <p className="text-sm text-red-300">{error}</p>
                  <p className="text-xs text-red-400 mt-2">Check browser console (F12) for more details</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => fetchFiles(currentPath)}
                  className="text-red-400 hover:bg-red-500/10"
                >
                  Retry
                </Button>
              </div>
            </div>
          )}

          {/* Files Table */}
          <div className="overflow-hidden rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-white/10 bg-white/5">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Size</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Modified</th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center">
                        <div className="flex items-center justify-center gap-3 text-gray-400">
                          <div className="size-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                          <span>Loading files...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredFiles.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <IconFolder className="size-16 text-gray-600 mb-4" />
                          <p className="text-gray-400 text-lg mb-2">
                            {searchTerm ? "No files match your search" : "This folder is empty"}
                          </p>
                          <p className="text-gray-500 text-sm">
                            {searchTerm ? "Try a different search term" : "Upload files or create a new folder to get started"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredFiles.map((file, index) => {
                      const FileIcon = getFileIcon(file)
                      return (
                        <tr key={index} className="hover:bg-white/5 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`flex items-center justify-center size-8 rounded-lg ${
                                file.is_file ? 'bg-white/5 text-gray-400' : 'bg-blue-500/20 text-blue-400'
                              }`}>
                                <FileIcon className="size-5" />
                              </div>
                              <button
                                onClick={() => file.is_file ? openFile(file) : fetchFiles(currentPath === "/" ? "/" + file.name : currentPath + "/" + file.name)}
                                className="text-white transition-colors font-medium hover:text-blue-400 cursor-pointer"
                              >
                                {file.name}
                              </button>
                              {file.is_symlink && (
                                <Badge variant="outline" className="text-xs border-purple-500/50 text-purple-400">
                                  Symlink
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-400">
                            {file.is_file ? formatBytes(file.size) : "-"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-400">
                            {formatDate(file.modified_at)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {file.is_file && (
                                <>
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={() => openFile(file)}
                                    className="hover:bg-white/10 text-gray-400 hover:text-white h-8 w-8 p-0"
                                    title="Edit"
                                  >
                                    <IconEdit className="size-4" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={() => downloadFile(file.name)}
                                    className="hover:bg-white/10 text-gray-400 hover:text-white h-8 w-8 p-0"
                                    title="Download"
                                  >
                                    <IconDownload className="size-4" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={() => copyPath(file.name)}
                                    className="hover:bg-white/10 text-gray-400 hover:text-white h-8 w-8 p-0"
                                    title="Copy Path"
                                  >
                                    <IconCopy className="size-4" />
                                  </Button>
                                </>
                              )}
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => {
                                  setSelectedFile(file)
                                  setNewFileName(file.name)
                                  setShowRenameModal(true)
                                }}
                                className="hover:bg-blue-500/10 text-gray-400 hover:text-blue-400 h-8 w-8 p-0"
                                title="Rename"
                              >
                                <IconEdit className="size-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => deleteFile(file.name)} 
                                className="hover:bg-red-500/10 text-gray-400 hover:text-red-400 h-8 w-8 p-0"
                                title="Delete"
                              >
                                <IconTrash className="size-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Edit File Modal */}
      {showEditModal && selectedFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-6xl max-h-[90vh] bg-gradient-to-br from-slate-950 to-slate-900 rounded-xl border border-white/10 shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h2 className="text-2xl font-bold text-white">Edit File</h2>
                <p className="text-sm text-gray-400 mt-1">{selectedFile.name}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowEditModal(false)} className="hover:bg-white/10">
                <IconX className="size-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-auto p-6">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full h-[500px] bg-black/50 border border-white/10 rounded-lg p-4 text-white font-mono text-sm focus:outline-none focus:border-blue-500/50 resize-none"
                placeholder="File content..."
              />
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10 bg-white/5">
              <Button variant="outline" onClick={() => setShowEditModal(false)} className="border-white/10 hover:bg-white/10">
                Cancel
              </Button>
              <Button onClick={saveFile} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Rename Modal */}
      {showRenameModal && selectedFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-gradient-to-br from-slate-950 to-slate-900 rounded-xl border border-white/10 shadow-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Rename</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowRenameModal(false)} className="hover:bg-white/10">
                <IconX className="size-5" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">New Name</label>
                <Input
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className="w-full bg-black/50 border-white/10 text-white"
                  placeholder="Enter new name..."
                />
              </div>
              <div className="flex items-center justify-end gap-3">
                <Button variant="outline" onClick={() => setShowRenameModal(false)} className="border-white/10 hover:bg-white/10">
                  Cancel
                </Button>
                <Button onClick={renameFile} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Rename
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Viewer Modal */}
      {showImageModal && selectedFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" onClick={() => {
          if (imageUrl.startsWith('blob:')) URL.revokeObjectURL(imageUrl)
          setShowImageModal(false)
        }}>
          <div className="relative max-w-7xl max-h-[90vh] bg-gradient-to-br from-slate-950 to-slate-900 rounded-xl border border-white/10 shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/50">
              <div>
                <h2 className="text-xl font-bold text-white">{selectedFile.name}</h2>
                <p className="text-sm text-gray-400">{formatBytes(selectedFile.size)}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => {
                if (imageUrl.startsWith('blob:')) URL.revokeObjectURL(imageUrl)
                setShowImageModal(false)
              }} className="hover:bg-white/10">
                <IconX className="size-5" />
              </Button>
            </div>
            <div className="p-4 flex items-center justify-center bg-black/30 min-h-[300px]">
              {imageUrl ? (
                <img src={imageUrl} alt={selectedFile.name} className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl" />
              ) : (
                <div className="text-gray-400">Loading image...</div>
              )}
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-white/10 bg-black/50">
              <Button onClick={() => downloadFile(selectedFile.name)} className="bg-blue-600 hover:bg-blue-700 text-white">
                <IconDownload className="mr-2 size-4" />
                Download
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
