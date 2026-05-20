import BusanPassPlannerClient from './BusanPassPlannerClient'
import { BUSAN_PASS_MAP_CENTER, busanPassMapPlaces } from '@/data/busan/pass-map/places'

export default function BusanPassPlannerPage() {
  return <BusanPassPlannerClient mapCenter={BUSAN_PASS_MAP_CENTER} places={busanPassMapPlaces} />
}
