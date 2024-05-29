import React from "react"
import AnimateHeight from "react-animate-height"
import { Location } from "../types/mapTypes"
import {
    levelToColor,
    storeTypeToColor,
    storeTypeToSpanish,
} from "../types/config"
import { TbApple, TbCheese, TbLeaf, TbMeat } from "react-icons/tb"
import { useLocalStorage } from "usehooks-ts"
import ModalButton from "./ModalButton"

interface Props {
    showModal: boolean
    location?: Location | null
    locationID?: string | null
    closeModal: () => void
}

const LocationModal = ({
    showModal,
    location,
    locationID,
    closeModal,
}: Props) => {
    const [savedLocations, setSavedLocations, _] = useLocalStorage<string[]>(
        "savedLocations",
        [] as string[],
    )

    if (!locationID || !location) {
        return (
            <AnimateHeight
                duration={500}
                height={showModal ? "auto" : 0}
                style={{
                    overflow: "hidden",
                    position: "absolute",
                    bottom: "0",
                    left: "0",
                    width: "100%",
                    zIndex: 1000,
                }}
                easing="ease-in-out"
            ></AnimateHeight>
        )
    }

    return (
        <AnimateHeight
            duration={500}
            height={showModal && location != null ? "auto" : 0}
            style={{
                overflow: "hidden",
                position: "absolute",
                bottom: "0",
                left: "0",
                width: "100%",
                zIndex: 10000,
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
                        // <div style={bac}>
                        //     <p>
                        //         {storeTypeToSpanish[
                        //             location?.storeType || "Other"
                        //         ] ||
                        //             location?.storeType ||
                        //             "Other"}
                        //     </p>
                        // </div>
                    }
                </div>

                <LocationInfo location={location} />

                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "1rem",
                        width: "100%",
                    }}
                >
                    <HealthLevel
                        level={location?.freshFruit || "NONE"}
                        icon={
                            <TbApple
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    color: "white",
                                }}
                            />
                        }
                    />

                    <HealthLevel
                        level={location?.freshVegetables || "NONE"}
                        icon={
                            <TbLeaf
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    color: "white",
                                }}
                            />
                        }
                    />
                    <HealthLevel
                        level={location?.freshDairy || "NONE"}
                        icon={
                            <TbCheese
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    color: "white",
                                }}
                            />
                        }
                    />
                    <HealthLevel
                        level={location?.unprocessedMeat || "NONE"}
                        icon={
                            <TbMeat
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    color: "white",
                                }}
                            />
                        }
                    />
                </div>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "1rem",
                        width: "100%",
                    }}
                >
                    <ModalButton
                        onClick={() => {
                            if (savedLocations.includes(locationID)) {
                                let newSavedLocations = savedLocations.filter(
                                    (id) => id !== locationID,
                                )
                                setSavedLocations(newSavedLocations)
                            } else {
                                setSavedLocations([
                                    ...savedLocations,
                                    locationID,
                                ])
                            }
                        }}
                    >
                        {savedLocations.includes(locationID)
                            ? "Desguardar"
                            : "Guardar"}
                    </ModalButton>

                    <ModalButton
                        onClick={() => {
                            let searchString =
                                location?.address + " " + location?.locationName
                            searchString = encodeURIComponent(searchString)
                            window.open(
                                `https://www.google.com/maps/search/?api=1&query=${searchString}`,
                                "_blank",
                            )
                        }}
                    >
                        Abrir en Mapas
                    </ModalButton>
                </div>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "1rem",
                        width: "100%",
                    }}
                >
                    <ModalButton
                        onClick={() => {
                            closeModal()
                        }}
                    >
                        Cerrar
                    </ModalButton>
                </div>
            </div>
        </AnimateHeight>
    )
}

function LocationInfo({ location }: { location: Location }) {
    return (
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
                        whiteSpace: "nowrap",
                    }}
                >
                    # {location?.phoneNumber || "Loading..."}
                </p>
            )}

            {location?.websiteURL && location?.websiteURL != "null" && (
                <a
                    target="_blank"
                    style={{
                        margin: 0,
                        whiteSpace: "nowrap",
                        color: "black",
                    }}
                    href={location?.websiteURL}
                >
                    {location?.websiteURL || "Loading..."}
                </a>
            )}
        </div>
    )
}

function HealthLevel({
    icon,
    level,
}: {
    icon: React.ReactNode
    level: string
}) {
    return (
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
                backgroundColor: levelToColor[level],
            }}
        >
            {icon}
        </div>
    )
}

export default LocationModal
