import React from "react"

interface Props {
    name: string
    value: number
    onChange: (value: number) => void
}

const RangeFilter = ({ name, value, onChange }: Props) => {
    const getBackgroundColor = (value: number) => {
        switch (value) {
            case 0:
                return "white"
            case 1:
                return "yellow"
            case 2:
                return "green"
            default:
                return "white"
        }
    }

    const getFilterString = (value: number) => {
        switch (value) {
            case 0:
                return "NONE"
            case 1:
                return "LOW"
            case 2:
                return "HIGH"
            default:
                return "NONE"
        }
    }

    const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseInt(event.target.value)
        onChange(newValue)
    }

    return (
        <div
            className="flex flex-col p-2 overflow-auto"
            style={{
                padding: "0.5rem",
                boxSizing: "border-box",
                borderRadius: "0.5rem",
                border: "1px solid black",
                backgroundColor: getBackgroundColor(value),
            }}
        >
            <div className="flex flex-row justify-between mb-2">
                <span>{name}</span>
                <span>{getFilterString(value)}</span>
            </div>
            <input
                type="range"
                min="0"
                max="2"
                value={value}
                onChange={handleSliderChange}
                className="w-full"
            />
        </div>
    )
}

export default RangeFilter
