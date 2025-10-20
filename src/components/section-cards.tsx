"use client"

import { useEffect, useState } from "react"
import styled from "styled-components"

const StyledWrapper = styled.div`
  width: 100%;
  
  .e-card {
    background: transparent;
    box-shadow: 0px 12px 40px -12px rgba(0, 0, 0, 0.6);
    position: relative;
    width: 100%;
    aspect-ratio: 1;
    min-height: 280px;
    max-height: 320px;
    border-radius: 24px;
    overflow: hidden;
    border: 2px solid transparent;
    background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)),
      linear-gradient(101deg, #78e4ff, #ff48fa, #00ddeb);
    background-origin: border-box;
    background-clip: padding-box, border-box;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .e-card:hover {
    transform: translateY(-8px);
    box-shadow: 0px 16px 48px -12px rgba(0, 0, 0, 0.6);
  }

  .wave {
    position: absolute;
    width: 540px;
    height: 700px;
    opacity: 0.75;
    left: 0;
    top: 0;
    margin-left: -50%;
    margin-top: -70%;
    background: linear-gradient(744deg, #ff6b6b, #4ecdc4 40%, #45b7d1 60%, #f06595);
    will-change: transform;
  }

  .icon {
    width: 4.5em;
    height: 4.5em;
    margin-bottom: 0.5em;
    filter: drop-shadow(0 6px 16px rgba(255, 255, 255, 0.4));
  }

  .infotop {
    text-align: center;
    font-size: 24px;
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    transform: translateY(-50%);
    color: rgb(255, 255, 255);
    font-weight: 700;
    letter-spacing: 0.8px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    text-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
    padding: 0 1rem;
  }

  .name {
    font-size: 18px;
    font-weight: 700;
    position: relative;
    top: 0.8em;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    text-shadow: 0 3px 12px rgba(0, 0, 0, 0.5);
  }

  .wave:nth-child(2),
  .wave:nth-child(3) {
    top: 210px;
  }

  .playing .wave {
    border-radius: 40%;
    animation: wave 3000ms infinite linear;
  }

  .wave {
    border-radius: 40%;
    animation: wave 55s infinite linear;
  }

  .playing .wave:nth-child(2) {
    animation-duration: 4000ms;
  }

  .wave:nth-child(2) {
    animation-duration: 50s;
  }

  .playing .wave:nth-child(3) {
    animation-duration: 5000ms;
  }

  .wave:nth-child(3) {
    animation-duration: 45s;
  }

  @keyframes wave {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }
`

export function SectionCards() {
  const [stats, setStats] = useState({ ram: 0, ramTotal: 4, cpu: 0, cpuTotal: 100, disk: 0, diskTotal: 10, servers: 0, serverSlots: 1 })

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 5000) // Real-time updates
    return () => clearInterval(interval)
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/user/profile")
      if (res.ok) {
        const data = await res.json()
        setStats({
          ram: data.usedRam || 0,
          ramTotal: data.ram || 4,
          cpu: data.usedCpu || 0,
          cpuTotal: data.cpu || 100,
          disk: data.usedDisk || 0,
          diskTotal: data.disk || 10,
          servers: data.serversCount || 0,
          serverSlots: data.serverSlots || 1,
        })
      }
    } catch (e) {
      console.error("Failed to fetch stats", e)
    }
  }

  return (
    <div className="w-full px-4 lg:px-8 mb-10 overflow-visible">
      <h2 className="mb-8 text-3xl font-bold">
        <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          Resource Usage
        </span>
      </h2>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4">
      <StyledWrapper>
        <div className="e-card playing">
          <div className="wave" />
          <div className="wave" />
          <div className="wave" />
          <div className="infotop">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="icon"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 2v12h16V6H4zm2 2h2v8H6V8zm4 0h2v8h-2V8zm4 0h2v8h-2V8zm4 0h2v8h-2V8z" />
            </svg>
            <div style={{ marginTop: '0.5rem' }}>RAM</div>
            <div className="name">{stats.ram} / {stats.ramTotal} GB</div>
          </div>
        </div>
      </StyledWrapper>

      <StyledWrapper>
        <div className="e-card playing">
          <div className="wave" />
          <div className="wave" />
          <div className="wave" />
          <div className="infotop">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="icon"
            >
              <path d="M9 2v2h6V2h2v2h1c1.1 0 2 .9 2 2v1h2v2h-2v6h2v2h-2v1c0 1.1-.9 2-2 2h-1v2h-2v-2H9v2H7v-2H6c-1.1 0-2-.9-2-2v-1H2v-2h2V9H2V7h2V6c0-1.1.9-2 2-2h1V2h2zm-3 4v12h12V6H6zm2 2h8v8H8V8z" />
            </svg>
            <div style={{ marginTop: '0.5rem' }}>CPU</div>
            <div className="name">{stats.cpuTotal - stats.cpu}% Free</div>
          </div>
        </div>
      </StyledWrapper>

      <StyledWrapper>
        <div className="e-card playing">
          <div className="wave" />
          <div className="wave" />
          <div className="wave" />
          <div className="infotop">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="icon"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
              <circle cx="12" cy="12" r="3" opacity="0.3" />
            </svg>
            <div style={{ marginTop: '0.5rem' }}>Storage</div>
            <div className="name">{stats.diskTotal - stats.disk} GB Free</div>
          </div>
        </div>
      </StyledWrapper>

      <StyledWrapper>
        <div className="e-card playing">
          <div className="wave" />
          <div className="wave" />
          <div className="wave" />
          <div className="infotop">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="icon"
            >
              <path d="M20 2H4c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 6H4V4h16v4zM4 14h16c1.1 0 2-.9 2-2v-1H2v1c0 1.1.9 2 2 2zm16 2H4c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-2c0-1.1-.9-2-2-2zm0 4H4v-2h16v2z" />
              <circle cx="6" cy="6" r="1.5" fill="#4ade80" />
              <circle cx="6" cy="18" r="1.5" fill="#4ade80" />
            </svg>
            <div style={{ marginTop: '0.5rem' }}>Servers</div>
            <div className="name">{stats.servers} / {stats.serverSlots} Used</div>
          </div>
        </div>
      </StyledWrapper>
      </div>
    </div>
  )
}
