import csv
import json

# Define file paths
csvFilePath = 'labeledData.csv'
jsonFilePath = 'labeledData.json'

# Create a dictionary to store data
data = {}

# Open and read the CSV file
with open(csvFilePath) as csvFile:
    csvReader = csv.DictReader(csvFile)
    for rows in csvReader:
        id = rows['id']
        rows['position'] = {
            'lat': float(rows.pop('position__lat')),
            'long': float(rows.pop('position__long'))
        }
        data[id] = rows

# Write the data to a JSON file
with open(jsonFilePath, 'w') as jsonFile:
    jsonFile.write(json.dumps(data, indent=4))
