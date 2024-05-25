function Search() {
    // const check = (inputQuery: string) => {}

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                gap: "1rem",
                padding: "1rem",
                marginLeft: "2rem",
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
            <input
                type="text"
                style={{
                    // padding: "0.5rem",
                    boxSizing: "border-box",
                    borderRadius: "0.5rem",
                    border: "1px solid black",
                    // marginTop: "1rem",
                    // marginBottom: "1rem",
                    width: "50%",
                }}
            ></input>
        </div>
    )
}
export default Search
