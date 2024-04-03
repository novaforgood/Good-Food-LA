import React from "react"
import { LocationType } from "../types/mapTypes"

interface Props {
    items: LocationType[]
    value: LocationType[]
    onChange: (value: LocationType[]) => void
}

const Filter = (props: Props) => {
    return (
        <div>
            {props.items.map((item, index) => {
                return (
                    <div
                        key={index}
                        // style using tailwindcss
                        // flexbox row no padding, overflow is scrollable
                        className="flex flex-row p-0 overflow-auto"
                    >
                        <input
                            // style using tailwind, when checked, the color is red and text is white
                            // when not checked, the color is white and text is black
                            // padding of 0.5rem
                            className="checked:bg-red-500 checked:border-transparent"
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
                        <label>{item}</label>
                    </div>
                )
            })}
        </div>
    )
}

export default Filter
