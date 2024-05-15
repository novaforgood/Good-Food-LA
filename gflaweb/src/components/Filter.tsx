import React from "react"
import { LocationType } from "../types/mapTypes"

interface Props {
    items: string[]
    value: string[]
    onChange: (value: string[]) => void
}

const Filter = (props: Props) => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                gap: "1rem",
                padding: "1rem",
                marginTop: "0rem",
                marginLeft: "0rem",
                boxSizing: "border-box",
                position: "absolute",
                zIndex: 10000,
                backgroundColor: "transparent",
                top: "0",
                left: "0",
                overflowX: "scroll",
                width: "100%",
            }}
        >
            {props.items.map((item, index) => {
                console.log("HELLO")
                return (
                    <div
                        key={index}
                        // style using tailwindcss
                        // flexbox row no padding, overflow is scrollable
                        className="flex flex-row p-0 overflow-auto"
                        style={{
                            padding: "0.5rem",
                            boxSizing: "border-box",
                            borderRadius: "0.5rem",
                            border: "1px solid black",
                            backgroundColor:
                                props.value.indexOf(item) > -1
                                    ? "black"
                                    : "white",
                            color:
                                props.value.indexOf(item) > -1
                                    ? "white"
                                    : "black",
                        }}
                    >
                        <input
                            // style using tailwind, when checked, the color is red and text is white
                            // when not checked, the color is white and text is black
                            // padding of 0.5rem
                            id={"filter-" + index}
                            className="hidden md:visible"
                            style={{ display: "none" }}
                            type="checkbox"
                            checked={props.value.indexOf(item) > -1}
                            onChange={() => {
                                if (props.value.indexOf(item) > -1) {
                                    props.onChange(
                                        props.value.filter((i) => i !== item),
                                    )
                                } else {
                                    props.onChange([...props.value, item])
                                }
                            }}
                        />
                        <label
                            htmlFor={"filter-" + index}
                            style={{
                                // don't break text
                                whiteSpace: "nowrap",
                            }}
                        >
                            {item}
                        </label>
                    </div>
                )
            })}
        </div>
    )
}

export default Filter
