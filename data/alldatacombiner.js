// final data model
const location = {
	id: "01l1JIwBNOx9bTLwPtmQ",
	locationName: "CVS Store",
	address: "2500 W Victory Blvd, Burbank, CA 91505",
	hasEBT: true,
	hasMarketMatch: true,
	rewards: null,
	coupons: null,
	contact: "not there yet",
	websiteURL: "https://google.com",
	geoPoint: {
		lat: 34.183237,
		long: -118.33,
	},
};

let marketMatchLocations = new Map();
let ebtLocations = new Map();

ebtData.forEach((location) => {
	ebtLocations.set(location.id, location);
});

mmData.forEach((location) => {
	marketMatchLocations.set(location.properties.id, location);
});

const geolib = require("geolib");

const finalData = [];
let currentID = 0;

for (let [ebtKey, ebtValue] of ebtLocations) {
	if (ebtValue.ALREADY_MATCHED) continue;
	for (let [mmKey, mmValue] of marketMatchLocations) {
		if (mmValue.ALREADY_MATCHED) continue;
		let mmLocation = {
			// convert these two to float
			latitude: parseFloat(mmValue["geometry"]["coordinates"][0]),
			longitude: parseFloat(mmValue["geometry"]["coordinates"][1]),
		};
		let ebtLocation = {
			latitude: ebtValue.geoPoint.lat,
			longitude: ebtValue.geoPoint.lon,
		};
		let dist = geolib.getDistance(mmLocation, ebtLocation, 1);
		console.log(mmlLocation, ebtLocation, dist);

		if (dist < 5) {
			ebtValue.ALREADY_MATCHED = true;
			mmValue.ALREADY_MATCHED = true;

			// construct the final data
			finalData.push({
				id: currentID,
				locationName: ebtValue.locationName,
				address: ebtValue.address1 + ", " + ebtValue.address2,
				hasEBT: true,
				hasMarketMatch: true,
				rewards: null,
				coupons: null,
				contact: "NO CONTACT",
				websiteURL: mmValue.properties.website,
				geoPoint: {
					lat: ebtLocation.latitude,
					long: ebtLocation.longitude,
				},
			});

			currentID++;
		}
	}
}

// save the final data to a file
const fs = require("fs");
fs.writeFileSync("finalDataCombined.json", JSON.stringify(finalData));
