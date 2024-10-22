"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Moon, Sun } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export interface Log {
  type: string
  serverName: string
  date: number
  world: string
  playerName: string
  block: string
  x: number
  y: number
  z: number
  staff: boolean
}

export interface Pi {
  name: string
  uuid: string
}

interface IData {
  pi: Pi
  logs: Log[]
}

export default function LogViewer() {
  const [data, setData] = useState<IData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [blockIcons, setBlockIcons] = useState<{ [key: string]: string }>({})

  const [darkMode, setDarkMode] = useState(true)
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    window.localStorage.setItem("darkMode", (!darkMode).toString());
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
  	    const path = new URLSearchParams(window.location.search).get("d");
        const response = await fetch(path === "testing" ? "https://api.lincolnsmp.xyz/api/testing" : `https://api.lincolnsmp.xyz/api/logs/${path}`)
        if (!response.ok) {
          throw new Error("Failed to fetch data")
        }
        const jsonData: IData = await response.json()
        setData(jsonData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (data) {
      data.logs.forEach((log) => {
        getBlockIcon(log.block.toLowerCase()).then((url) => {
          setBlockIcons((prev) => ({ ...prev, [log.block]: url }))
        })
      })
    }
  }, [data])

  const block = (log: Log) => {
    const blockarray = log.block.toLowerCase().split("_")
    const b: Array<string> = []
    blockarray.forEach((index) => {
      b.push(index.charAt(0).toUpperCase() + index.slice(1))
    })
    return b.join(" ")
  }

  const getBlockIcon = async (block: string): Promise<string> => {
    try {
      const res = await fetch(`https://assets.lincolnsmp.xyz/images/${block}.png`)
      if (!res.ok) {
        throw new Error("Failed to fetch image")
      }
      const blob = await res.blob()
      return URL.createObjectURL(blob)
    } catch (error) {
      console.error("Error fetching block icon:", error)
      return "" 
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>
  }

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Button
          variant={darkMode ? "ghost" : "g2"}
          size="icon"
          className="fixed top-4 right-4"
          onClick={toggleDarkMode}
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
        </Button>
      </div>
      {data && (
        <>
                {data.logs.map((log, index) => (
                  <Card key={index} className="mb-4">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant={log.type === "place" ? "default" : "destructive"}>
                          {log.type}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(log.date).toLocaleString()}
                        </span>
                      </div>
                      <p className="font-semibold">{log.playerName}</p>
                      <div className="flex items-center gap-2">
                        <p>Block: {block(log)}</p>
                        {blockIcons[log.block] && (
                          <Image
                            src={blockIcons[log.block]}
                            alt={`${log.block} icon`}
                            width={24}
                            height={24}
                            className="inline-block"
                          />
                        )}
                      </div>
                      <p>Server: {log.serverName}</p>
                      <p>World: {log.world}</p>
                      <p>
                        Coordinates: X: {log.x}, Y: {log.y}, Z: {log.z}
                      </p>
                      {log.staff && (
                        <Badge variant="outline" className="mt-2">
                          Staff
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
        </>
      )}
    </div>
  )
}
