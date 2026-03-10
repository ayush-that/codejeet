---
title: "How to Solve Alert Using Same Key-Card Three or More Times in a One Hour Period — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Alert Using Same Key-Card Three or More Times in a One Hour Period. Medium difficulty, 46.1% acceptance rate. Topics: Array, Hash Table, String, Sorting."
date: "2028-08-16"
category: "dsa-patterns"
tags:
  [
    "alert-using-same-key-card-three-or-more-times-in-a-one-hour-period",
    "array",
    "hash-table",
    "string",
    "medium",
  ]
---

# How to Solve "Alert Using Same Key-Card Three or More Times in a One Hour Period"

This problem asks us to identify which workers triggered a security alert by using their key-card three or more times within any one-hour period. The tricky part is that the one-hour window can start at any access time, not just at fixed hourly intervals, and we need to efficiently check all possible sliding windows for each worker.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:**

```
keyName = ["daniel","daniel","daniel","luis","luis","luis","luis"]
keyTime = ["10:00","10:40","11:00","09:00","11:00","13:00","15:00"]
```

**Step 1: Group by worker**

- daniel: ["10:00", "10:40", "11:00"]
- luis: ["09:00", "11:00", "13:00", "15:00"]

**Step 2: Convert times to minutes for easier comparison**

- daniel: [600, 640, 660] (10:00=600, 10:40=640, 11:00=660)
- luis: [540, 660, 780, 900] (09:00=540, 11:00=660, 13:00=780, 15:00=900)

**Step 3: Check each worker's access times**
For daniel:

- Sort times: already sorted [600, 640, 660]
- Check sliding windows of size 3:
  - Window 1: [600, 640, 660] → 660-600 = 60 minutes ✓ (alert!)
  - Since we found an alert, daniel goes to result list

For luis:

- Sort times: already sorted [540, 660, 780, 900]
- Check sliding windows of size 3:
  - Window 1: [540, 660, 780] → 780-540 = 240 minutes ✗
  - Window 2: [660, 780, 900] → 900-660 = 240 minutes ✗
  - No alert for luis

**Result:** ["daniel"]

The key insight is that for each worker, we need to check if any three consecutive accesses (when sorted) fall within a 60-minute window. We can use a sliding window approach for efficiency.

## Brute Force Approach

A naive approach would be to check every possible triple of accesses for each worker:

1. Group accesses by worker
2. For each worker, convert all times to minutes
3. For each combination of 3 access times (triple nested loops), check if max_time - min_time ≤ 60
4. If any triple satisfies this, add worker to result

**Why this is inefficient:**

- For a worker with n accesses, there are C(n,3) = n!/(3!(n-3)!) possible triples to check
- This grows as O(n³) per worker, which becomes too slow when workers have many accesses
- With up to 100 workers and 100 accesses each, this could mean checking millions of combinations

The brute force misses the opportunity to use sorting and sliding windows to reduce the work to O(n log n) per worker.

## Optimized Approach

The key insight is that **if three accesses fall within one hour, then when we sort the access times, there must exist three consecutive times in that sorted list that are within one hour of each other**.

**Reasoning:**

1. Sort each worker's access times in ascending order
2. Use a sliding window of size 3 to check consecutive accesses
3. For window starting at index i, check if `time[i+2] - time[i] ≤ 60`
   - Why i+2? Because we're checking indices i, i+1, i+2 (three accesses)
   - Why ≤ 60? Because "within one hour" means the first and last access can be exactly 60 minutes apart

**Why this works:**

- If any three accesses are within one hour, the farthest apart they can be in the sorted list is when we take the earliest and latest of those three
- By checking every consecutive triple in the sorted list, we're guaranteed to catch any three accesses that are close together
- This reduces the check from O(n³) to O(n) per worker after sorting

## Optimal Solution

The optimal solution groups accesses by worker, sorts each worker's times, then uses a sliding window to check for three accesses within 60 minutes.

<div class="code-group">

```python
# Time: O(n log n) where n is total number of accesses
# Space: O(n) for storing the grouped accesses and result
def alertNames(keyName, keyTime):
    from collections import defaultdict

    # Step 1: Group access times by worker
    # We use defaultdict to automatically create lists for new workers
    accesses = defaultdict(list)

    # Pair each name with its corresponding time
    for name, time_str in zip(keyName, keyTime):
        # Convert "HH:MM" to minutes since midnight for easy comparison
        hours, minutes = map(int, time_str.split(':'))
        time_minutes = hours * 60 + minutes

        # Add to this worker's access list
        accesses[name].append(time_minutes)

    # Step 2: Check each worker for alerts
    alerted_workers = []

    for name, times in accesses.items():
        # Sort times to enable sliding window check
        times.sort()

        # Step 3: Check for any three accesses within 60 minutes
        # We use a sliding window of size 3
        for i in range(len(times) - 2):
            # If the third access is within 60 minutes of the first access
            # then all three accesses are within one hour
            if times[i + 2] - times[i] <= 60:
                alerted_workers.append(name)
                # Once we find one alert for this worker, we can stop checking
                break

    # Step 4: Return sorted list as required
    alerted_workers.sort()
    return alerted_workers
```

```javascript
// Time: O(n log n) where n is total number of accesses
// Space: O(n) for storing the grouped accesses and result
function alertNames(keyName, keyTime) {
  // Step 1: Group access times by worker
  const accesses = new Map();

  for (let i = 0; i < keyName.length; i++) {
    const name = keyName[i];
    const timeStr = keyTime[i];

    // Convert "HH:MM" to minutes since midnight
    const [hours, minutes] = timeStr.split(":").map(Number);
    const timeMinutes = hours * 60 + minutes;

    // Add to this worker's access list
    if (!accesses.has(name)) {
      accesses.set(name, []);
    }
    accesses.get(name).push(timeMinutes);
  }

  // Step 2: Check each worker for alerts
  const alertedWorkers = [];

  for (const [name, times] of accesses) {
    // Sort times to enable sliding window check
    times.sort((a, b) => a - b);

    // Step 3: Check for any three accesses within 60 minutes
    // Use sliding window of size 3
    for (let i = 0; i < times.length - 2; i++) {
      // If third access is within 60 minutes of first access
      if (times[i + 2] - times[i] <= 60) {
        alertedWorkers.push(name);
        // Once we find an alert, stop checking this worker
        break;
      }
    }
  }

  // Step 4: Return sorted list as required
  return alertedWorkers.sort();
}
```

```java
// Time: O(n log n) where n is total number of accesses
// Space: O(n) for storing the grouped accesses and result
import java.util.*;

class Solution {
    public List<String> alertNames(String[] keyName, String[] keyTime) {
        // Step 1: Group access times by worker
        Map<String, List<Integer>> accesses = new HashMap<>();

        for (int i = 0; i < keyName.length; i++) {
            String name = keyName[i];
            String timeStr = keyTime[i];

            // Convert "HH:MM" to minutes since midnight
            String[] parts = timeStr.split(":");
            int hours = Integer.parseInt(parts[0]);
            int minutes = Integer.parseInt(parts[1]);
            int timeMinutes = hours * 60 + minutes;

            // Add to this worker's access list
            accesses.putIfAbsent(name, new ArrayList<>());
            accesses.get(name).add(timeMinutes);
        }

        // Step 2: Check each worker for alerts
        List<String> alertedWorkers = new ArrayList<>();

        for (Map.Entry<String, List<Integer>> entry : accesses.entrySet()) {
            String name = entry.getKey();
            List<Integer> times = entry.getValue();

            // Sort times to enable sliding window check
            Collections.sort(times);

            // Step 3: Check for any three accesses within 60 minutes
            // Use sliding window of size 3
            for (int i = 0; i < times.size() - 2; i++) {
                // If third access is within 60 minutes of first access
                if (times.get(i + 2) - times.get(i) <= 60) {
                    alertedWorkers.add(name);
                    // Once we find an alert, stop checking this worker
                    break;
                }
            }
        }

        // Step 4: Return sorted list as required
        Collections.sort(alertedWorkers);
        return alertedWorkers;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Grouping accesses by worker: O(n) where n is total number of accesses
- Sorting each worker's access times: In worst case, one worker has all n accesses, so O(n log n)
- Sliding window check: O(n) total across all workers
- Sorting the result list: O(k log k) where k is number of alerted workers (k ≤ n)
- Dominated by O(n log n) from sorting

**Space Complexity: O(n)**

- Storing grouped accesses: O(n) in worst case
- Result list: O(k) where k ≤ n
- Total: O(n)

## Common Mistakes

1. **Not converting times properly**: Forgetting that "10:00" and "10:01" are 1 minute apart, not 1 hour apart. Always convert to a comparable numeric format (minutes since midnight).

2. **Incorrect window comparison**: Checking `times[i+2] - times[i+1] ≤ 60` instead of `times[i+2] - times[i] ≤ 60`. The latter correctly checks if all three accesses fit within a 60-minute window starting at `times[i]`.

3. **Forgetting to sort times per worker**: If times aren't sorted, the sliding window approach doesn't work because we might miss non-consecutive accesses that are close together.

4. **Not breaking early**: Continuing to check a worker after finding an alert wastes time. Use `break` once an alert is detected for a worker.

5. **Returning unsorted result**: The problem requires the result in sorted order. Don't forget the final sort.

## When You'll See This Pattern

This problem combines several common patterns:

1. **Grouping + Sorting + Sliding Window**: Similar to:
   - **LeetCode 438 "Find All Anagrams in a String"**: Group characters and use sliding window
   - **LeetCode 567 "Permutation in String"**: Check if one string contains a permutation of another using sliding window
   - **LeetCode 3 "Longest Substring Without Repeating Characters"**: Use sliding window to track unique characters

2. **Time Interval Problems**: This is essentially checking for overlapping intervals or close events:
   - **LeetCode 253 "Meeting Rooms II"**: Find minimum rooms needed for overlapping meetings
   - **LeetCode 56 "Merge Intervals"**: Merge overlapping intervals

The core technique of sorting then using a sliding window appears in many problems where you need to find subsequences or check relationships between ordered elements.

## Key Takeaways

1. **When checking for "within a time window"**, convert all times to a common numeric unit (like minutes since midnight) for easy comparison.

2. **For "k events within time T" problems**, sort the events and use a sliding window of size k. Check if the last event is within T of the first event in the window.

3. **Group-then-process** is a common pattern: First group related data (by worker, by day, by category), then apply your algorithm to each group independently.

Remember: The sorted sliding window approach works because if k events are within time T, then in the sorted list, there must exist k consecutive events where the last is within T of the first.

[Practice this problem on CodeJeet](/problem/alert-using-same-key-card-three-or-more-times-in-a-one-hour-period)
