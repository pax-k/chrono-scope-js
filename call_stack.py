import json
import csv
import sys


def process_log_to_csv(log_file_path, csv_file_path):
    with open(log_file_path, "r") as file:
        log_content = file.read().replace("undefined", "null")

    measurements = json.loads(log_content)
    measurements_sorted = sorted(measurements, key=lambda x: x["startTime"])

    call_stack = []

    for measure in measurements_sorted:
        while call_stack and call_stack[-1]["endTime"] < measure["startTime"]:
            call_stack.pop()

        parent_measure = call_stack[-1] if call_stack else None
        measure_end_time = measure["startTime"] + measure["duration"]
        measure["endTime"] = measure_end_time
        call_stack.append(measure)
        measure["depth"] = len(call_stack)

    for measure in measurements_sorted:
        measure["indentedName"] = ("    " * (measure["depth"] - 1)) + measure["name"]

    csv_data = [
        {
            "name": measure["indentedName"],
            "duration": measure["duration"],
            "startTime": measure["startTime"],
        }
        for measure in sorted(measurements_sorted, key=lambda x: x["startTime"])
    ]

    with open(csv_file_path, "w", newline="") as csvfile:
        fieldnames = ["name", "duration", "startTime"]
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(csv_data)

    print(f"CSV file created at {csv_file_path}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python script.py <input_log_file_path> <output_csv_file_path>")
        sys.exit(1)

    log_file_path = sys.argv[1]
    csv_file_path = sys.argv[2]

    process_log_to_csv(log_file_path, csv_file_path)
