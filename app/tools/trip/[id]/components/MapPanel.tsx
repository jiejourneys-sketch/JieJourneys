'use client'

import { useEffect, useRef } from 'react'
import { BRAND, BRAND_LIGHT } from '../../lib/types'
import type { PlanItem } from '../../lib/types'
import { useGoogleMaps } from '../../lib/useGoogleMaps'

interface Props {
  items: PlanItem[]
  activeDay: number
}

export default function MapPanel({ items, activeDay }: Props) {
  const mapsReady = useGoogleMaps()
  const mapRef = useRef<HTMLDivElement>(null)
  const gMapRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])
  const polylineRef = useRef<google.maps.Polyline | null>(null)

  // Initialize map
  useEffect(() => {
    if (!mapsReady || !mapRef.current || gMapRef.current) return
    gMapRef.current = new google.maps.Map(mapRef.current, {
      zoom: 13,
      center: { lat: 35.1796, lng: 129.0756 },
      disableDefaultUI: true,
      zoomControl: true,
      styles: [
        { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
        { featureType: 'transit', elementType: 'labels', stylers: [{ visibility: 'off' }] },
      ],
    })
  }, [mapsReady])

  // Update markers when items or day changes
  useEffect(() => {
    if (!gMapRef.current) return

    // Clear old markers
    markersRef.current.forEach((m) => m.setMap(null))
    markersRef.current = []
    polylineRef.current?.setMap(null)

    const pinned = items.filter((i) => i.lat && i.lng)
    if (pinned.length === 0) return

    const bounds = new google.maps.LatLngBounds()

    pinned.forEach((item, idx) => {
      const pos = { lat: item.lat!, lng: item.lng! }
      bounds.extend(pos)

      const marker = new google.maps.Marker({
        position: pos,
        map: gMapRef.current!,
        title: item.name,
        label: {
          text: String(idx + 1),
          color: '#fff',
          fontSize: '11px',
          fontWeight: 'bold',
        },
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 16,
          fillColor: BRAND,
          fillOpacity: 1,
          strokeColor: '#fff',
          strokeWeight: 2,
        },
      })

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="font-family:sans-serif;padding:4px 2px;min-width:120px">
            <p style="font-weight:700;font-size:13px;color:#111;margin:0 0 2px">${item.name}</p>
            ${item.address ? `<p style="font-size:11px;color:#888;margin:0">${item.address}</p>` : ''}
            <p style="font-size:11px;font-weight:600;color:${BRAND};margin:4px 0 0">${item.time} · ${item.duration}分</p>
          </div>
        `,
      })
      marker.addListener('click', () => infoWindow.open(gMapRef.current, marker))
      markersRef.current.push(marker)
    })

    // Polyline connecting stops in order
    if (pinned.length > 1) {
      polylineRef.current = new google.maps.Polyline({
        path: pinned.map((i) => ({ lat: i.lat!, lng: i.lng! })),
        geodesic: true,
        strokeColor: BRAND,
        strokeOpacity: 0.5,
        strokeWeight: 2,
        map: gMapRef.current,
      })
    }

    gMapRef.current.fitBounds(bounds, { top: 40, right: 40, bottom: 40, left: 40 })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapsReady, items])

  if (!mapsReady) {
    return (
      <div className="relative w-full h-full overflow-hidden flex flex-col items-center justify-center" style={{ background: '#e8eef0' }}>
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="mapgrid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#d4dfe3" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mapgrid)" />
        </svg>
        <span className="text-5xl opacity-20 relative">🗺️</span>
        <p className="mt-3 text-sm font-semibold text-gray-400 relative">互動地圖</p>
        <p className="text-xs text-gray-300 mt-1 relative">設定 Google Maps API Key 後啟用</p>
        <div
          className="absolute bottom-4 right-4 text-xs font-semibold px-3 py-1.5 rounded-full bg-white shadow"
          style={{ color: BRAND }}
        >
          {items.filter((i) => i.lat).length} 個景點
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />
      {/* Legend */}
      <div
        className="absolute bottom-4 right-4 text-xs font-semibold px-3 py-1.5 rounded-full bg-white shadow-md"
        style={{ color: BRAND }}
      >
        Day {activeDay} · {items.filter((i) => i.lat).length} 個景點
      </div>
    </div>
  )
}
