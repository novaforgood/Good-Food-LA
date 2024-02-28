import { Marker, Popup } from "react-leaflet"
import { Location } from "../types/mapTypes"

interface Props {
    location: Location
}

const MapMarker = ({ location }: Props) => {
    return (
        <Marker position={[location.position.lat, location.position.long]}>
            <Popup>
                <div>
                    <h2>{location.name}</h2>
                    <p>{location.address}</p>
                </div>
            </Popup>
        </Marker>
    )
}

export default MapMarker
