import React from "react"

interface Props extends React.ComponentProps<"button"> {
    children: React.ReactNode
}

const ModalButton = ({ children, style, ...props }: Props) => {
    return (
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
                ...style,
            }}
            {...props}
        >
            {children}
        </button>
    )
}

export default ModalButton
