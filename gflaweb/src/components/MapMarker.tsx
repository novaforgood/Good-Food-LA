import { Marker, Popup } from "react-leaflet"
import { Location } from "../types/mapTypes"

interface Props {
    location: Location;
    handleMarkerClick: (id: string) => void; // Assuming handleMarkerClick expects a string id
}

const MapMarker = ({location, handleMarkerClick}: Props) => {

    const onClick = () => {
        // alert(location.id);
        handleMarkerClick(location.id);
    }

    return (
        <Marker position={[location.position.lat, location.position.long]} eventHandlers={{click: onClick}}>
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
