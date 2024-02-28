import { useState } from "react"
import { Helmet } from "react-helmet"
import { MapContainer, TileLayer } from "react-leaflet"
import "./App.css"
import reactLogo from "./assets/react.svg"
import viteLogo from "/vite.svg"

import locations from "./ebt.ts"

import "leaflet/dist/leaflet.css"
import MapMarker from "./components/MapMarker.js"
import { Location } from "./types/mapTypes.js"

function App() {
    const [count, setCount] = useState(0)
    const convertLocations = (oldLocations: any[]): Location[] => {
        return oldLocations.map((oldLocation) => ({
            id: oldLocation.id,
            name: oldLocation.locationName,
            address: `${oldLocation.address1}, ${oldLocation.address2}`,
            position: {
                lat: parseFloat(oldLocation.latitude), // Convert string to number
                long: parseFloat(oldLocation.longitude), // Convert string to number
            },
        }))
    }

    // Convert locations
    const newLocations = convertLocations(locations)

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
                <a href="https://vitejs.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                    <img
                        src={reactLogo}
                        className="logo react"
                        alt="React logo"
                    />
                </a>
            </div>
            <h1>Vite + React</h1>
            <MapContainer
                id="map"
                center={[34.05, -118.24]}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: "100vh", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {newLocations.map((location) => (
                    <MapMarker location={location} />
                ))}
            </MapContainer>
            <div className="card">
                <button
                    className="bg-sky-700 px-4 py-2 text-white hover:bg-sky-800 sm:px-8 sm:py-3"
                    onClick={() => setCount((count) => count + 1)}
                >
                    count is {count}
                </button>
                <p>
                    Edit <code>src/App.tsx</code> and save to test HMR
                </p>
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </>
    )
}

export default App
