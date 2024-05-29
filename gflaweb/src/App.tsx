import { useEffect, useReducer, useRef, useState } from "react"
import { Helmet } from "react-helmet"
import { MapContainer, Marker, TileLayer } from "react-leaflet"
import Modal from "react-modal"
import "./App.css"

// import { locations } from "./combinedData.ts"
import L from "leaflet"
import { locations as dtlaLocations } from "./dtlaData.ts"
import { locations as sylmarLocations } from "./sylmarData.ts"

import "leaflet/dist/leaflet.css"
import userIcon from "./assets/UserIcon.svg"
import Filter from "./components/Filter.tsx"
import MapMarker from "./components/MapMarker.js"
import { Location } from "./types/mapTypes.js"

import { useLocalStorage } from "usehooks-ts"
import LocationModal from "./components/LocationModal.tsx"

const userLocationIcon = new L.Icon({
    iconUrl: userIcon,
    popupAnchor: [-0, -0],
    iconSize: [40, 40],
})

const locations: {
    [key: string]: Location
} = {}
for (let [key, value] of Object.entries(sylmarLocations)) {
    locations[key] = value
}
for (let [key, value] of Object.entries(dtlaLocations)) {
    locations[key] = value
}

function App() {
    Modal.setAppElement("#root")

    const [savedLocations, setSavedLocations, _] = useLocalStorage<string[]>(
        "savedLocations",
        [] as string[],
    )

    const filterTypes: string[] = [
        "EBT",
        "Market Match",
        "Fruit",
        "Vegetables",
        "Dairy",
        "Meat",
    ]
    const [selectedFilterTypes, setSelectedFilterTypes] = useState<string[]>([])

    // const rangeFilterTypes: string[] = ["Fruit", "Vegetables", "Dairy", "Meat"]
    // const [selectedRangeFilterTypes, setSelectedRangeFilterTypes] = useState<
    //     number[]
    // >([0, 0, 0, 0])
    // function handleRangeFilterChange(index: number, value: number) {
    //     let newSelectedRangeFilterTypes = [...selectedRangeFilterTypes]
    //     newSelectedRangeFilterTypes[index] = value
    //     setSelectedRangeFilterTypes(newSelectedRangeFilterTypes)
    // }

    const [locationClicked, setLocationClicked] = useState("-1") // the ID of which location clicked
    const handleMarkerClick = (marker_id: string) => {
        // let marker_id_num = parseInt(marker_id)
        if (marker_id == locationClicked) {
            setLocationClicked("-1")
        } else {
            setLocationClicked(marker_id)
        }
    }

    const locationsList = useRef([] as Location[])
    const forceUpdate = useReducer(() => ({}), {})[1].bind(null)

    useEffect(() => {
        // locations is a map from number to object
        // turn locations into a list
        let newLocationsList = [] as Location[]

        for (let [_, value] of Object.entries(locations)) {
            newLocationsList.push(value)
        }

        locationsList.current = newLocationsList
        forceUpdate()
    }, [])

    const [location, setLocation] = useState<Location | null>(null)
    useEffect(() => {
        if (locationClicked !== "-1") {
            setLocation(locations[locationClicked])
        }
    }, [locationClicked])

    const [showModal, setShowModal] = useState(false)
    useEffect(() => {
        if (locationClicked !== "-1") {
            setTimeout(() => {
                setShowModal(true)
            }, 100)
        } else {
            setShowModal(false)
        }
    }, [locationClicked])

    const [userLocation, setUserLocation] = useState<[number, number] | null>(
        null,
    )
    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            setUserLocation([
                position.coords.latitude,
                position.coords.longitude,
            ])
        })
    }, [])

    // console.log("filters", selectedFilterTypes)

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

            {/* <div
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
            > */}
            <Filter
                items={filterTypes}
                value={selectedFilterTypes}
                onChange={setSelectedFilterTypes}
            />

            {/* {
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
                } */}
            {/* </div> */}

            <MapContainer
                id="map"
                // center={[34.05, -118.249]}
                // center={[34.3051382, -118.4676895]}
                center={userLocation || [34.3051382, -118.4676895]}
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
                            // console.log("Market Match")
                            return false
                        }

                        if (
                            selectedFilterTypes.includes("Fruit") &&
                            location.freshFruit !== "HIGH"
                        ) {
                            return false
                        }

                        if (
                            selectedFilterTypes.includes("Vegetables") &&
                            location.freshVegetables !== "HIGH"
                        ) {
                            return false
                        }

                        if (
                            selectedFilterTypes.includes("Dairy") &&
                            location.freshDairy !== "HIGH"
                        ) {
                            return false
                        }

                        if (
                            selectedFilterTypes.includes("Meat") &&
                            location.unprocessedMeat !== "HIGH"
                        ) {
                            return false
                        }

                        return true
                    })
                    .map((location) => (
                        <MapMarker
                            currentLocation={locationClicked}
                            location={location}
                            handleMarkerClick={handleMarkerClick}
                            key={location.id}
                            isFav={savedLocations.includes(location.id)}
                        />
                    ))}
                <Marker
                    position={{
                        lat: userLocation ? userLocation[0] : 34.3051382,
                        lng: userLocation ? userLocation[1] : -118.4676895,
                    }}
                    icon={userLocationIcon}
                ></Marker>
            </MapContainer>
            <LocationModal
                location={location}
                locationID={locationClicked}
                showModal={showModal}
                closeModal={() => setLocationClicked("-1")}
            ></LocationModal>
        </>
    )
}

export default App
