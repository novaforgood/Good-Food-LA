export interface Location {
    id: string
    name: string
    address: string
    position: Position
}

export interface Position {
    lat: number
    long: number
}
