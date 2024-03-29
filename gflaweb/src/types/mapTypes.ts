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

export interface Store {
    location: Location
    locationType: string
    cashBackFlag: string
    surchargeFlag: string
    surchargePercent: string
    surchargeAmt: string
    dailyCashLimit: string
}
