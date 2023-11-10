import json
import csv
import sys
from collections import defaultdict


def process_log_to_csv_with_counts(log_file_path, csv_file_path):
    # Read the log content from the file
    with open(log_file_path, "r") as file:
        log_content = file.read().replace("undefined", "null")

    # Parse the JSON content
    measurements = json.loads(log_content)

    # Count occurrences and sum durations
    name_counts = defaultdict(int)
    name_durations = defaultdict(float)

    for measure in measurements:
        name_counts[measure["name"]] += 1
        name_durations[measure["name"]] += measure["duration"]

    # Create a combined list of names, counts, and total durations
    aggregated_data = [
        {"name": name, "count": count, "total_duration": total_duration}
        for name, count in name_counts.items()
        for total_duration in [name_durations[name]]
    ]

    # Sort the aggregated data by total duration in descending order
    aggregated_data_sorted = sorted(
        aggregated_data, key=lambda x: x["total_duration"], reverse=True
    )

    # Write the aggregated data to a CSV file
    with open(csv_file_path, "w", newline="") as csvfile:
        fieldnames = ["name", "count", "total_duration"]
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(aggregated_data_sorted)

    print(f"CSV file created at {csv_file_path}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python script.py <input_log_file_path> <output_csv_file_path>")
        sys.exit(1)

    log_file_path = sys.argv[1]
    csv_file_path = sys.argv[2]

    process_log_to_csv_with_counts(log_file_path, csv_file_path)
