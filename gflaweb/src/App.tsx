import { useState } from "react"
import { Helmet } from "react-helmet"
import { MapContainer, TileLayer } from "react-leaflet"
import "./App.css"
import reactLogo from "./assets/react.svg"
import viteLogo from "/vite.svg"

import locations from "./ebt.ts"

import "leaflet/dist/leaflet.css"
import MapMarker from "./components/MapMarker.js"
import { Location, Store } from "./types/mapTypes.js"

function App() {
    const [count, setCount] = useState(0)
    const [locationClicked, setLocationClicked] = useState("-1"); // the ID of which location clicked
    
    
    const handleMarkerClick = (marker_id: string) => {
        if(marker_id == locationClicked){
            setLocationClicked("-1"); // unclick
        } else {
            setLocationClicked(marker_id);
        }
    }
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

    const convertLocationsToMap = (oldLocations: any[]): Record<string, Store> => {
        const locationsMap: Record<string, Store> = {};
    
        oldLocations.forEach(oldLocation => {
            const location: Location = {
                id: oldLocation.id,
                name: oldLocation.locationName,
                address: `${oldLocation.address1}, ${oldLocation.address2}`,
                position: {
                    lat: parseFloat(oldLocation.latitude),
                    long: parseFloat(oldLocation.longitude),
                },
            };
          
            const store: Store = {
                location: location,
                locationType: oldLocation.locationType,
                cashBackFlag: oldLocation.cashBackFlag,
                surchargeFlag: oldLocation.surchargeFlag,
                surchargePercent: oldLocation.surchargePercent,
                surchargeAmt: oldLocation.surchargeAmt,
                dailyCashLimit: oldLocation.dailyCashLimit,
            };
          
            locationsMap[oldLocation.id] = store;
        });
    
        return locationsMap;
    };

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

            {(locationClicked != "-1") && 
                <div className="infoBox" >
                    <h3>Name: {locationsMap[locationClicked].location.name}</h3>
                    <p>Address: {locationsMap[locationClicked].location.address}</p>
                    <p>Location Type: {locationsMap[locationClicked].locationType}</p>
                    <p>Daily Cash Limit: {locationsMap[locationClicked].dailyCashLimit}</p>
                </div>
            }

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
                center={[34.05, -118.249]}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: "100vh", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {newLocations.map((location) => (
                   
                    <MapMarker location={location} handleMarkerClick={handleMarkerClick}/>
                    
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
