export interface Position {
    lat: number
    long: number
}

// export interface Location {
//     id: number
//     locationName: string
//     address: string
//     hasEBT: boolean
//     hasMarketMatch: boolean
//     rewards: string | null
//     coupons: string | null
//     contact: "string" | null
//     websiteURL: string | null
//     position: Position
// }

export interface Location {
    id: string
    locationName: string
    address: string
    websiteURL: string | null
    contact?: string | null
    hasEBT: boolean
    hasMarketMatch: boolean
    rewards: string | null
    coupons: string | null
    season_1_start: string
    season_1_end: string
    season_2_start: string
    season_2_end: string
    days: string
    frequency: string
    time_open: string
    time_close: string
    searchLink: string
    phoneNumber?: string
    email?: string
    storeType: string
    freshFruit: string
    freshVegetables: string
    freshDairy: string
    unprocessedMeat: string
    flagged: boolean
    flagReason: string
    comments: string
    position: Position

    sylmarDistance?: string
}
