import { useEffect, useReducer, useRef, useState } from "react"
import { Helmet } from "react-helmet"
import { MapContainer, TileLayer } from "react-leaflet"
import Modal from "react-modal"
import "./App.css"

// import { locations } from "./combinedData.ts"
import { locations } from "./labeledData.ts"

import "leaflet/dist/leaflet.css"
import Filter from "./components/Filter.tsx"
import MapMarker from "./components/MapMarker.js"
import { Location } from "./types/mapTypes.js"
import RangeFilter from "./components/RangeFilter.tsx"

function App() {
    Modal.setAppElement("#root")

    const filterTypes: string[] = ["EBT", "Market Match"]
    const [selectedFilterTypes, setSelectedFilterTypes] = useState<string[]>([])

    const rangeFilterTypes: string[] = ["Fruit", "Vegetables", "Dairy", "Meat"]
    const [selectedRangeFilterTypes, setSelectedRangeFilterTypes] = useState<
        number[]
    >([0, 0, 0, 0])
    function handleRangeFilterChange(index: number, value: number) {
        let newSelectedRangeFilterTypes = [...selectedRangeFilterTypes]
        newSelectedRangeFilterTypes[index] = value
        setSelectedRangeFilterTypes(newSelectedRangeFilterTypes)
    }

    const [locationClicked, setLocationClicked] = useState(-1) // the ID of which location clicked
    const handleMarkerClick = (marker_id: string) => {
        let marker_id_num = parseInt(marker_id)
        if (marker_id_num == locationClicked) {
            setLocationClicked(-1)
        } else {
            setLocationClicked(marker_id_num)
        }
    }

    const locationsList = useRef([] as Location[])
    const forceUpdate = useReducer(() => ({}), {})[1].bind(null, {})

    useEffect(() => {
        // locations is a map from number to object
        // turn locations into a list
        let newLocationsList = [] as Location[]

        for (let [key, value] of Object.entries(locations)) {
            newLocationsList.push(value)
        }

        locationsList.current = newLocationsList
        forceUpdate()
    }, [])

    let location = locations[locationClicked]

    console.log("filters", selectedFilterTypes)

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

            <div
                style={{
                    position: "absolute",
                    top: "0",
                    left: "0",
                    zIndex: 1000,
                    padding: "1rem",
                    backgroundColor: "white",
                    width: "100%",
                    boxSizing: "border-box",
                }}
            >
                {/* <Filter
                    items={filterTypes}
                    value={selectedFilterTypes}
                    onChange={setSelectedFilterTypes}
                /> */}

                {
                    // range filters
                    rangeFilterTypes.map((rangeFilterType, index) => (
                        <RangeFilter
                            key={index}
                            name={rangeFilterType}
                            value={selectedRangeFilterTypes[index]}
                            onChange={(value) =>
                                handleRangeFilterChange(index, value)
                            }
                        />
                    ))
                }
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
                {locationsList.current
                    .filter((location) => {
                        // if (selectedFilterTypes.length === 0) {
                        //     return true
                        // }

                        if (
                            selectedFilterTypes.includes("EBT") &&
                            !location.hasEBT
                        ) {
                            return false
                        }

                        if (
                            selectedFilterTypes.includes("Market Match") &&
                            !location.hasMarketMatch
                        ) {
                            console.log("Market Match")
                            return false
                        }

                        const healthAttributes = [
                            location.freshFruit,
                            location.freshVegetables,
                            location.freshDairy,
                            location.unprocessedMeat,
                        ]

                        for (let i = 0; i < healthAttributes.length; i++) {
                            if (selectedRangeFilterTypes[i] === 1) {
                                if (healthAttributes[i] === "NONE") {
                                    return false
                                }
                            } else if (selectedRangeFilterTypes[i] === 2) {
                                if (
                                    healthAttributes[i] === "NONE" ||
                                    healthAttributes[i] === "LOW"
                                ) {
                                    return false
                                }
                            }
                        }

                        return true
                    })
                    .map((location) => (
                        <MapMarker
                            location={location}
                            handleMarkerClick={handleMarkerClick}
                            key={location.id}
                        />
                    ))}
            </MapContainer>
            {locationClicked !== -1 && (
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
                        Name: {location.locationName}
                    </h3>
                    {location.address && (
                        <p className="text-lg">Address: {location.address}</p>
                    )}
                    {location.websiteURL && (
                        <p className="text-lg">
                            Website: {location.websiteURL}
                        </p>
                    )}
                    {location.contact && (
                        <p className="text-lg">Contact: {location.contact}</p>
                    )}
                    {location.hasEBT && (
                        <p className="text-lg">
                            EBT: {location.hasEBT ? "Yes" : "No"}
                        </p>
                    )}
                    {location.hasMarketMatch && (
                        <p className="text-lg">
                            Market Match:{" "}
                            {location.hasMarketMatch ? "Yes" : "No"}
                        </p>
                    )}
                    {location.phoneNumber && (
                        <p className="text-lg">
                            Phone Number: {location.phoneNumber}
                        </p>
                    )}
                    {location.email && (
                        <p className="text-lg">Email: {location.email}</p>
                    )}
                    {location.storeType && (
                        <p className="text-lg">
                            Store Type: {location.storeType}
                        </p>
                    )}
                    {location.freshFruit && (
                        <p className="text-lg">
                            Fresh Fruit: {location.freshFruit}
                        </p>
                    )}
                    {location.freshVegetables && (
                        <p className="text-lg">
                            Fresh Vegetables: {location.freshVegetables}
                        </p>
                    )}
                    {location.freshDairy && (
                        <p className="text-lg">
                            Fresh Dairy: {location.freshDairy}
                        </p>
                    )}
                    {location.unprocessedMeat && (
                        <p className="text-lg">
                            Unprocessed Meat: {location.unprocessedMeat}
                        </p>
                    )}
                    {location.flagged && (
                        <p className="text-lg">
                            Flagged: {location.flagged ? "Yes" : "No"}
                        </p>
                    )}
                    {location.flagReason && (
                        <p className="text-lg">
                            Flag Reason: {location.flagReason}
                        </p>
                    )}
                    {location.comments && (
                        <p className="text-lg">Comments: {location.comments}</p>
                    )}
                </div>
            )}
        </>
    )
}

export default App
