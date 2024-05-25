import { Marker } from "react-leaflet"
import { Location } from "../types/mapTypes"
import L from "leaflet"
import marker from "../assets/MapIcon.svg"
import markerActive from "../assets/MapIconActive.svg"
import markerFavorite from "../assets/MapIconFav.svg"

interface Props {
    location: Location
    currentLocation: string
    isFav: boolean
    handleMarkerClick: (id: string) => void // Assuming handleMarkerClick expects a string id
}

const MapMarker = ({
    location,
    currentLocation,
    isFav,
    handleMarkerClick,
}: Props) => {
    const onClick = () => {
        // alert(location.id);
        handleMarkerClick(location.id)
    }

    const customIcon = new L.Icon({
        iconUrl:
            location.id === currentLocation
                ? markerActive
                : isFav
                ? markerFavorite
                : marker,
        iconRetinaUrl:
            location.id === currentLocation
                ? markerActive
                : isFav
                ? markerFavorite
                : marker,
        popupAnchor: [-0, -0],
        iconSize: [50, 50],
    })

    return (
        <Marker
            position={[location.position.lat, location.position.long]}
            eventHandlers={{ click: onClick }}
            icon={customIcon}
        >
            {/* <Popup>
                <div>
                    <h2>{location.name}</h2>
                    <p>{location.address}</p>
                </div>
            </Popup> */}
        </Marker>
    )
}

export default MapMarker
