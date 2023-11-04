import re
import sys
from collections import defaultdict

# Define a regex pattern to match the function and method call logs with timings and errors.
log_pattern = re.compile(
    r'(Function|Async function|Iterator) ([\w\.]+) (took|failed after) ([\d\.]+) ms(?: with error: (.*))?'
)

def aggregate_log_data(log_file_path):
    # Read the log file contents
    with open(log_file_path, 'r') as file:
        log_contents = file.read()

    # Find all matches of the pattern in the log file.
    log_entries = log_pattern.findall(log_contents)

    # Initialize a dict to hold the aggregated data
    aggregated_data = defaultdict(lambda: {'total_time': 0.0, 'call_count': 0})

    # Aggregate the data
    for entry in log_entries:
        function_name = entry[1]
        time_taken = float(entry[3])
        aggregated_data[function_name]['total_time'] += time_taken
        aggregated_data[function_name]['call_count'] += 1

    return aggregated_data

def print_aggregated_data(aggregated_data):
    # Print the aggregated data in a formatted way
    print("| Function/Method | Total Calls | Total Execution Time (ms) |")
    print("| --- | --- | --- |")
    for function_name, data in aggregated_data.items():
        print(f"| {function_name} | {data['call_count']} | {data['total_time']:.2f} |")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python aggregate_log.py <path_to_log_file>")
        sys.exit(1)

    log_file_path = sys.argv[1]
    try:
        aggregated_data = aggregate_log_data(log_file_path)
        print_aggregated_data(aggregated_data)
    except Exception as e:
        print(f"An error occurred: {e}")
