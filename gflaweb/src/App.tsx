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
import AnimateHeight from "react-animate-height"
import userIcon from "./assets/UserIcon.svg"
import Filter from "./components/Filter.tsx"
import MapMarker from "./components/MapMarker.js"
import { Location } from "./types/mapTypes.js"

import { TbApple, TbCheese, TbLeaf, TbMeat } from "react-icons/tb"
import { useLocalStorage } from "usehooks-ts"

const storeTypeToColor: {
    [key: string]: string
} = {
    Grocery: "#3bd151",
    Meat: "#eb4034",
    "Convenience Store": "#ff8080",
    Bakery: "#ffac54",
    "Big Grocery": "#118a23",
    Restaurant: "#6f2bd6",
    "Farmer's Market": "#2b76f0",
    Pharmacy: "#f0f02b",
    Other: "#b5b5b5",
}

const storeTypeToSpanish: {
    [key: string]: string
} = {
    Grocery: "Supermercado",
    Meat: "Carnicería",
    "Convenience Store": "Tienda de conveniencia",
    Bakery: "Panadería",
    "Big Grocery": "Gran supermercado",
    Restaurant: "Restaurante",
    "Farmer's Market": "Mercado de agricultores",
    Pharmacy: "Farmacia",
    Other: "Otro",
}

const levelToColor: {
    [key: string]: string
} = {
    NONE: "#E2371F",
    LOW: "#F7D156",
    HIGH: "#35A500",
}

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

                        // const healthAttributes = [
                        //     location.freshFruit,
                        //     location.freshVegetables,
                        //     location.freshDairy,
                        //     location.unprocessedMeat,
                        // ]

                        // for (let i = 0; i < healthAttributes.length; i++) {
                        //     if (selectedRangeFilterTypes[i] === 1) {
                        //         if (healthAttributes[i] === "NONE") {
                        //             return false
                        //         }
                        //     } else if (selectedRangeFilterTypes[i] === 2) {
                        //         if (
                        //             healthAttributes[i] === "NONE" ||
                        //             healthAttributes[i] === "LOW"
                        //         ) {
                        //             return false
                        //         }
                        //     }
                        // }

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
            <AnimateHeight
                duration={500}
                height={showModal && location != null ? "auto" : 0} // see props documentation below
                style={{
                    overflow: "hidden",
                    position: "absolute",
                    bottom: "0",
                    left: "0",
                    width: "100%",
                    zIndex: 1000,
                }}
                easing="ease-in-out"
            >
                <div
                    style={{
                        // display: locationClicked !== "-1" ? "flex" : "none",
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor: "white",
                        padding: "1rem",
                        boxSizing: "border-box",
                        zIndex: 1000,
                        gap: "1rem",
                        position: "relative",
                    }}
                    // className="absolute bottom-0 left-0 w-full bg-white p-4 rounded-t-lg"
                >
                    {/* <button
                        style={{
                            backgroundColor: "transparent",
                            border: "none",
                            cursor: "pointer",
                            position: "absolute",
                            top: "0.25rem",
                            right: "0.5rem",
                            fontSize: "2rem",
                        }}
                        onClick={() => {
                            setLocationClicked("-1")
                        }}
                    >
                        ✖
                    </button> */}

                    <h1
                        style={{
                            margin: 0,
                            // marginTop: "1.5rem",
                        }}
                    >
                        {location?.locationName || "Loading..."}
                    </h1>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: "1rem",
                            width: "100%",
                            overflow: "scroll",
                        }}
                    >
                        {location?.hasEBT && (
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    padding: "0.25rem",
                                    paddingLeft: "1rem",
                                    paddingRight: "1rem",
                                    fontSize: "1rem",
                                    backgroundColor: "#4ad94c",
                                    borderRadius: "2rem",
                                    height: "2rem",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                <p
                                    style={{
                                        padding: 0,
                                        margin: 0,
                                    }}
                                >
                                    Acepta EBT
                                </p>
                            </div>
                        )}
                        {location?.hasMarketMatch && (
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    padding: "0.25rem",
                                    paddingLeft: "1rem",
                                    paddingRight: "1rem",
                                    fontSize: "1rem",
                                    backgroundColor: "#4ad94c",
                                    borderRadius: "2rem",
                                    height: "2rem",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                <p>Acepta Market Match</p>
                            </div>
                        )}
                        {
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    padding: "0.25rem",
                                    paddingLeft: "1rem",
                                    paddingRight: "1rem",
                                    fontSize: "1rem",
                                    borderRadius: "2rem",
                                    height: "2rem",
                                    backgroundColor:
                                        storeTypeToColor[
                                            location?.storeType || "Other"
                                        ],
                                    whiteSpace: "nowrap",
                                }}
                            >
                                <p>
                                    {storeTypeToSpanish[
                                        location?.storeType || "Other"
                                    ] ||
                                        location?.storeType ||
                                        "Other"}
                                </p>
                            </div>
                        }
                    </div>

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.5rem",
                            backgroundColor: "#EEEEEE",
                            padding: "1rem",
                            borderRadius: "1rem",
                            width: "100%",
                            boxSizing: "border-box",
                            overflow: "scroll",
                        }}
                    >
                        {location?.address && (
                            <p
                                style={{
                                    margin: 0,
                                    // don't break into multiple lines
                                    whiteSpace: "nowrap",
                                }}
                            >
                                📍 {location?.address || "Loading..."}
                            </p>
                        )}
                        {location?.phoneNumber && (
                            <p
                                style={{
                                    margin: 0,
                                    // don't break into multiple lines
                                    whiteSpace: "nowrap",
                                }}
                            >
                                # {location?.phoneNumber || "Loading..."}
                            </p>
                        )}

                        {location?.websiteURL &&
                            location?.websiteURL != "null" && (
                                <a
                                    target="_blank"
                                    style={{
                                        margin: 0,
                                        // don't break into multiple lines
                                        whiteSpace: "nowrap",
                                        color: "black",
                                    }}
                                    href={location?.websiteURL}
                                >
                                    {location?.websiteURL || "Loading..."}
                                </a>
                            )}
                    </div>

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: "1rem",
                            width: "100%",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                width: "calc((100% - 3rem) / 4)",
                                aspectRatio: "1/1",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: "1rem",
                                boxSizing: "border-box",
                                borderRadius: "1rem",
                                backgroundColor:
                                    levelToColor[
                                        location?.freshFruit || "NONE"
                                    ],
                            }}
                        >
                            <TbApple
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    color: "white",
                                }}
                            />
                        </div>
                        <div
                            style={{
                                display: "flex",
                                width: "calc((100% - 3rem) / 4)",
                                aspectRatio: "1/1",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: "1rem",
                                boxSizing: "border-box",
                                borderRadius: "1rem",
                                backgroundColor:
                                    levelToColor[
                                        location?.freshVegetables || "NONE"
                                    ],
                            }}
                        >
                            <TbLeaf
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    color: "white",
                                }}
                            />
                        </div>
                        <div
                            style={{
                                display: "flex",
                                width: "calc((100% - 3rem) / 4)",
                                aspectRatio: "1/1",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: "1rem",
                                boxSizing: "border-box",
                                borderRadius: "1rem",
                                backgroundColor:
                                    levelToColor[
                                        location?.freshDairy || "NONE"
                                    ],
                            }}
                        >
                            <TbCheese
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    color: "white",
                                }}
                            />
                        </div>
                        <div
                            style={{
                                display: "flex",
                                width: "calc((100% - 3rem) / 4)",
                                aspectRatio: "1/1",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: "1rem",
                                boxSizing: "border-box",
                                borderRadius: "1rem",
                                backgroundColor:
                                    levelToColor[
                                        location?.unprocessedMeat || "NONE"
                                    ],
                            }}
                        >
                            <TbMeat
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    color: "white",
                                }}
                            />
                        </div>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: "1rem",
                            width: "100%",
                        }}
                    >
                        <button
                            style={{
                                backgroundColor: "black",
                                color: "white",
                                borderRadius: "1rem",
                                padding: "0.5rem",
                                paddingTop: "1rem",
                                paddingBottom: "1rem",
                                border: "none",
                                cursor: "pointer",
                                width: "100%",
                                boxSizing: "border-box",
                                fontSize: "1rem",
                            }}
                            onClick={() => {
                                if (savedLocations.includes(locationClicked)) {
                                    let newSavedLocations =
                                        savedLocations.filter(
                                            (id) => id !== locationClicked,
                                        )
                                    setSavedLocations(newSavedLocations)
                                } else {
                                    setSavedLocations([
                                        ...savedLocations,
                                        locationClicked,
                                    ])
                                }
                            }}
                        >
                            {savedLocations.includes(locationClicked)
                                ? "Desguardar"
                                : "Guardar"}
                        </button>

                        <button
                            style={{
                                backgroundColor: "black",
                                color: "white",
                                borderRadius: "1rem",
                                padding: "0.5rem",
                                paddingTop: "1rem",
                                paddingBottom: "1rem",
                                border: "none",
                                cursor: "pointer",
                                width: "100%",
                                boxSizing: "border-box",
                                fontSize: "1rem",
                            }}
                            onClick={() => {
                                // open the address in google maps
                                // not the lat long
                                let searchString =
                                    location?.address +
                                    " " +
                                    location?.locationName
                                searchString = encodeURIComponent(searchString)
                                window.open(
                                    `https://www.google.com/maps/search/?api=1&query=${searchString}`,
                                    "_blank",
                                )
                            }}
                        >
                            Abrir en Mapas
                        </button>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: "1rem",
                            width: "100%",
                        }}
                    >
                        <button
                            style={{
                                backgroundColor: "#444444",
                                color: "white",
                                borderRadius: "1rem",
                                padding: "0.5rem",
                                paddingTop: "1rem",
                                paddingBottom: "1rem",
                                border: "none",
                                cursor: "pointer",
                                width: "100%",
                                boxSizing: "border-box",
                                fontSize: "1rem",
                            }}
                            onClick={() => {
                                setLocationClicked("-1")
                            }}
                        >
                            Cerrar Detalles
                        </button>
                    </div>
                </div>
            </AnimateHeight>
        </>
    )
}

export default App
