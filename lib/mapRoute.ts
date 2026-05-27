export type MapLatLng = {
  lat: number
  lng: number
}

export type MapRouteStop = MapLatLng & {
  name: string
  order: number
}

export type MapRouteOverlay = {
  id: string
  label: string
  color: string
  kind: 'bus' | 'train'
  defaultVisible?: boolean
  path: MapLatLng[]
  stops: MapRouteStop[]
}
