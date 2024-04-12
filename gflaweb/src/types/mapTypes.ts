export interface Position {
    lat: number
    long: number
}

export interface Location {
    id: number
    locationName: string
    address: string
    hasEBT: boolean
    hasMarketMatch: boolean
    rewards: string | null
    coupons: string | null
    contact: "string" | null
    websiteURL: string | null
    position: Position
}
