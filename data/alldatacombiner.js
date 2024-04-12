const data = require("./alldata.js");
const ebtData = data.ebtData;
const mmData = data.mmData;
const geolib = require("geolib");

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

function mmToLocation(mmLocation) {
	return {
		latitude: parseFloat(mmLocation["geometry"]["coordinates"][1]),
		longitude: parseFloat(mmLocation["geometry"]["coordinates"][0]),
	};
}

function ebtToLocation(ebtLocation) {
	return {
		latitude: ebtLocation.geoPoint.lat,
		longitude: ebtLocation.geoPoint.lon,
	};
}

let marketMatchLocations = new Map();
let ebtLocations = new Map();

const LA_COORDS = {
	latitude: 34.0549,
	longitude: -118.2426,
};
const BANNED_SUBSTRINGS = [
	"7-Eleven",
	"CVS",
	"Pizza Hut",
	"Liquor",
	"Am Pm",
	"Chevron",
	"Carls",
	"Jack In",
	"Domino",
	"Arco",
	"Walgreens",
	"Circle K",
	"Dollar Tree",
	"Gas Station",
];

ebtData.forEach((location) => {
	// only add if within 60 km of LA
	let ebtLocation = ebtToLocation(location);
	if (geolib.getDistance(ebtLocation, LA_COORDS, 1) > 5 * 1000) return;

	// only add if location.locationType is "FOOD" or "FM"
	// TODO: also do "RE"
	if (location.locationType !== "FOOD" && location.locationType !== "FM")
		return;

	// don't include if the name has any banned substrings
	let lowerCaseName = location.locationName.toLowerCase();
	if (
		BANNED_SUBSTRINGS.some((substring) =>
			lowerCaseName.includes(substring.toLowerCase())
		)
	)
		return;

	ebtLocations.set(location.id, location);
});

mmData.forEach((location) => {
	// only add if within 60 km of LA
	let mmLocation = mmToLocation(location);
	if (geolib.getDistance(mmLocation, LA_COORDS, 1) > 10 * 1000) return;

	marketMatchLocations.set(location.properties.id, location);
});

const finalData = [];
let currentID = 0;

function locationsMatch(mmLocation, ebtLocation) {
	return geolib.getDistance(mmLocation, ebtLocation, 1) < 5;
}

function getMMAddress(mmLocation) {
	if (!mmLocation) return null;
	return (
		mmLocation.properties.street_number +
		" " +
		mmLocation.properties.street +
		", " +
		mmLocation.properties.city +
		", " +
		mmLocation.properties.zip
	);
}

function getEBTAddress(ebtLocation) {
	if (!ebtLocation) return null;
	return ebtLocation.address1 + ", " + ebtLocation.address2;
}

function makeFinalData(ebtLocation, mmLocation) {
	if (!ebtLocation) {
		return {
			id: currentID,
			locationName: mmLocation.properties.name,
			address: getMMAddress(mmLocation),
			hasEBT: false,
			hasMarketMatch: true,
			rewards: null,
			coupons: null,
			contact: null,
			websiteURL: mmLocation.properties.website,
			position: {
				lat: parseFloat(mmLocation.geometry.coordinates[1]),
				long: parseFloat(mmLocation.geometry.coordinates[0]),
			},
		};
	}

	if (!mmLocation) {
		return {
			id: currentID,
			locationName: ebtLocation.locationName,
			address: getEBTAddress(ebtLocation),
			hasEBT: true,
			hasMarketMatch: false,
			rewards: null,
			coupons: null,
			contact: null,
			websiteURL: null,
			position: {
				lat: ebtLocation.geoPoint.lat,
				long: ebtLocation.geoPoint.lon,
			},
		};
	}

	return {
		id: currentID,
		locationName: mmLocation.properties.name,
		address: getEBTAddress(ebtLocation),
		hasEBT: true,
		hasMarketMatch: true,
		rewards: null,
		coupons: null,
		contact: null,
		websiteURL: mmLocation.properties.website,
		position: {
			lat: ebtLocation.latitude,
			long: ebtLocation.longitude,
		},
	};
}

for (let [ebtKey, ebtValue] of ebtLocations) {
	if (ebtValue.ALREADY_MATCHED) continue;
	for (let [mmKey, mmValue] of marketMatchLocations) {
		if (mmValue.ALREADY_MATCHED) continue;
		let mmLocation = mmToLocation(mmValue);
		let ebtLocation = ebtToLocation(ebtValue);
		let dist = geolib.getDistance(mmLocation, ebtLocation, 1);

		if (dist < 5) {
			ebtValue.ALREADY_MATCHED = true;
			mmValue.ALREADY_MATCHED = true;

			const finalLocation = makeFinalData(ebtValue, mmValue);
			finalData.push(finalLocation);

			currentID++;
		}
	}
}

// go through the ebt data and find the ones that haven't been matched
for (let [key, value] of ebtLocations) {
	if (value.ALREADY_MATCHED) continue;
	const finalLocation = makeFinalData(value, null);
	finalData.push(finalLocation);
	currentID++;
}

// go through the market match data and find the ones that haven't been matched
for (let [key, value] of marketMatchLocations) {
	if (value.ALREADY_MATCHED) continue;
	const finalLocation = makeFinalData(null, value);
	finalData.push(finalLocation);
	currentID++;
}

// save the final data to a file
const fs = require("fs");
const { parse } = require("path");
fs.writeFileSync("finalDataCombined.json", JSON.stringify(finalData));
