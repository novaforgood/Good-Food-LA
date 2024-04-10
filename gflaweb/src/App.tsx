import { useState } from "react"
import { Helmet } from "react-helmet"
import { MapContainer, TileLayer } from "react-leaflet"
import Modal from "react-modal"
import "./App.css"

import locations from "./combinedData.ts"

import "leaflet/dist/leaflet.css"
import MapMarker from "./components/MapMarker.js"
import { Location, Store } from "./types/mapTypes.js"
import { LocationType } from "./types/mapTypes.js"
import Filter from "./components/Filter.tsx"
import Search from "./components/Search.tsx"

function App() {
    Modal.setAppElement("#root")

    const filterTypes: String[] = [
        "EBT",
        "Maket Match",
        "Another",
        "One",
        "DJ Khaled",
    ]
    const [selectedFilterTypes, setSelectedFilterTypes] = useState<String[]>([])

    const [locationClicked, setLocationClicked] = useState("-1") // the ID of which location clicked
    const handleMarkerClick = (marker_id: string) => {
        if (marker_id == locationClicked) {
            setLocationClicked("-1") // unclick
        } else {
            setLocationClicked(marker_id)
        }
    }
    const convertLocations = (oldLocations: any[]): Location[] => {
        return oldLocations.map((oldLocation) => ({
            id: oldLocation.id,
            name: oldLocation.locationName,
            address: oldLocation.address,
            position: {
                lat: oldLocation.geoPoint.lat, // Convert string to number
                long: oldLocation.geoPoint.long, // Convert string to number
            },
        }))
    }

    const convertLocationsToMap = (
        oldLocations: any[],
    ): Record<string, Store> => {
        const locationsMap: Record<string, Store> = {}

        oldLocations.forEach((oldLocation) => {
            const location: Location = {
                id: oldLocation.id,
                name: oldLocation.locationName,
                address: `${oldLocation.address1}, ${oldLocation.address2}`,
                position: {
                    lat: parseFloat(oldLocation.latitude),
                    long: parseFloat(oldLocation.longitude),
                },
            }

            const store: Store = {
                location: location,
                locationType: oldLocation.locationType,
                cashBackFlag: oldLocation.cashBackFlag,
                surchargeFlag: oldLocation.surchargeFlag,
                surchargePercent: oldLocation.surchargePercent,
                surchargeAmt: oldLocation.surchargeAmt,
                dailyCashLimit: oldLocation.dailyCashLimit,
            }

            locationsMap[oldLocation.id] = store
        })

        return locationsMap
    }

    // Convert locations
    const newLocations = convertLocations(locations)

    const locationsMap = convertLocationsToMap(locations)

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

            <div>
                <Search />
            </div>

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
                {newLocations
                    // .filter((location) =>
                    //     selectedFilterTypes.includes(location.locationType),
                    // )
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
                    display: locationClicked != "-1" ? "block" : "none",
                    position: "absolute",
                    bottom: "0",
                    left: "0",
                    width: "100%",
                    backgroundColor: "white",
                    padding: "1rem",
                    boxSizing: "border-box",
                    zIndex: 1000,
                }}
                // use tailwindcss
                // round top right and left corners
                className="absolute bottom-0 left-0 w-full bg-white p-4 rounded-t-lg"
            >
                <h3
                    // style using tailwindcss
                    // font size of 1.5rem
                    // font weight of bold
                    className="text-2xl font-bold"
                >
                    Name: {locationsMap[locationClicked]?.location.name}
                </h3>
                <p className="text-lg">
                    Address: {locationsMap[locationClicked]?.location.address}
                </p>
                <p>
                    Location Type: {locationsMap[locationClicked]?.locationType}
                </p>
                <p>
                    Daily Cash Limit:{" "}
                    {locationsMap[locationClicked]?.dailyCashLimit}
                </p>
            </div>
        </>
    )
}

export default App
