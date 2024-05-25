import csv
import json

# Define file paths
csvFilePath = 'sylmar-final.csv'
jsonFilePath = 'sylmar-final.json'

# Create a dictionary to store data
data = {}

# Open and read the CSV file
with open(csvFilePath) as csvFile:
    csvReader = csv.reader(csvFile)

    # Read the header and adjust it to remove the 20th column
    header = next(csvReader)
    header.pop(19)

    # Read the remaining rows and adjust to remove the 20th column
    rows = []
    for row in csvReader:
        row.pop(19)
        rows.append(row)

    # Create a dictionary to store the adjusted data
    adjusted_data = [dict(zip(header, row)) for row in rows]

    # Process each row to adjust the 'position' field and convert "TRUE"/"FALSE" to booleans
    for row in adjusted_data:
        id = row['id']
        row['position'] = {
            'lat': float(row.pop('position__lat')),
            'long': float(row.pop('position__long'))
        }

        # Convert "TRUE" and "FALSE" to booleans
        for key, value in row.items():
            if value == "TRUE":
                row[key] = True
            elif value == "FALSE":
                row[key] = False

        # Exclude rows where noInfo or permanentlyClosed are True
        if not row.get('noInfo', False) and not row.get('permanentlyClosed', False) and row.get('storeType', '') != '' and row.get('storeType', '') != "DON'T INCLUDE":
            # Remove noInfo and permanentlyClosed columns
            row.pop('noInfo', None)
            row.pop('permanentlyClosed', None)
            data[id] = row

# Write the data to a JSON file
with open(jsonFilePath, 'w') as jsonFile:
    jsonFile.write(json.dumps(data, indent=4))
