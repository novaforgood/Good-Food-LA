import { useEffect, useRef, useState } from "react"
import { Helmet } from "react-helmet"
import { MapContainer, TileLayer } from "react-leaflet"
import Modal from "react-modal"
import "./App.css"

import { locations } from "./combinedData.ts"

import "leaflet/dist/leaflet.css"
import Filter from "./components/Filter.tsx"
import MapMarker from "./components/MapMarker.js"
import { Location } from "./types/mapTypes.js"

function App() {
    Modal.setAppElement("#root")

    const filterTypes: String[] = ["EBT", "Market Match"]
    const [selectedFilterTypes, setSelectedFilterTypes] = useState<String[]>([])

    const [locationClicked, setLocationClicked] = useState(-1) // the ID of which location clicked
    const handleMarkerClick = (marker_id: string) => {
        let marker_id_num = parseInt(marker_id)
        if (marker_id_num == locationClicked) {
            setLocationClicked(-1)
        } else {
            setLocationClicked(marker_id_num)
        }
    }

    const locationsMap = useRef<Map<number, Location>>(new Map())
    useEffect(() => {
        locations.forEach((location) => {
            locationsMap.current.set(location.id, location)
        })
    }, [locations])

    return (
        <>
            <Helmet>
                <link
                    rel="stylesheet"
                    href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
                    integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
                    crossOrigin=""
                />
                <script
                    src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
                    integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
                    crossOrigin=""
                />
            </Helmet>

            {/* <div>
                <Search />
            </div> */}

            <div>
                <Filter
                    items={filterTypes}
                    value={selectedFilterTypes}
                    onChange={setSelectedFilterTypes}
                />
            </div>

            <MapContainer
                id="map"
                center={[34.05, -118.249]}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: "100vh", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {locations
                    .filter((location) => {
                        if (selectedFilterTypes.length === 0) {
                            return true
                        }

                        if (
                            selectedFilterTypes.includes("EBT") &&
                            location.hasEBT
                        ) {
                            return true
                        }

                        if (
                            selectedFilterTypes.includes("Market Match") &&
                            location.hasMarketMatch
                        ) {
                            console.log("Market Match")
                            return true
                        }

                        return false
                    })
                    .map((location) => (
                        <MapMarker
                            location={location}
                            handleMarkerClick={handleMarkerClick}
                            key={location.id}
                        />
                    ))}
            </MapContainer>

            <div
                style={{
                    display: locationClicked !== -1 ? "block" : "none",
                    position: "absolute",
                    bottom: "0",
                    left: "0",
                    width: "100%",
                    backgroundColor: "white",
                    padding: "1rem",
                    boxSizing: "border-box",
                    zIndex: 1000,
                }}
                className="absolute bottom-0 left-0 w-full bg-white p-4 rounded-t-lg"
            >
                <h3 className="text-2xl font-bold">
                    Name:{" "}
                    {locationsMap.current.get(locationClicked)?.locationName}
                </h3>
                <p className="text-lg">
                    Address:{" "}
                    {locationsMap.current.get(locationClicked)?.address}
                </p>
                <p className="text-lg">
                    EBT:{" "}
                    {locationsMap.current.get(locationClicked)?.hasEBT
                        ? "Yes"
                        : "No"}
                </p>
                <p className="text-lg">
                    Market Match:{" "}
                    {locationsMap.current.get(locationClicked)?.hasMarketMatch
                        ? "Yes"
                        : "No"}
                </p>
            </div>
        </>
    )
}

export default App
