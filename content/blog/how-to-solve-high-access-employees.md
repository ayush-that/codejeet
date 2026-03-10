---
title: "How to Solve High-Access Employees — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode High-Access Employees. Medium difficulty, 47.3% acceptance rate. Topics: Array, Hash Table, String, Sorting."
date: "2029-03-12"
category: "dsa-patterns"
tags: ["high-access-employees", "array", "hash-table", "string", "medium"]
---

# How to Solve High-Access Employees

This problem asks us to identify employees who accessed a system three or more times within any one-hour period. The tricky part is that time is given as a string in "HHMM" format (24-hour clock), and we need to efficiently check for overlapping time windows across potentially many access records for each employee.

## Visual Walkthrough

Let's trace through a concrete example:

**Input:**

```
access_times = [
    ["Alice", "0905"],
    ["Bob", "0910"],
    ["Alice", "0915"],
    ["Alice", "1000"],
    ["Bob", "1005"],
    ["Alice", "1005"],
    ["Bob", "1010"]
]
```

**Step 1: Group by employee**

- Alice: ["0905", "0915", "1000", "1005"]
- Bob: ["0910", "1005", "1010"]

**Step 2: Convert times to minutes**

- Alice: [545, 555, 600, 605] (0905 = 9\*60 + 5 = 545)
- Bob: [550, 605, 610]

**Step 3: Sort each employee's times**

- Alice: [545, 555, 600, 605] (already sorted)
- Bob: [550, 605, 610] (already sorted)

**Step 4: Check for three accesses within 60 minutes**
For Alice:

- Check window starting at 545: times within [545, 605] are 545, 555, 600, 605 → 4 accesses ✓
- Check window starting at 555: times within [555, 615] are 555, 600, 605 → 3 accesses ✓
- Alice is a high-access employee

For Bob:

- Check window starting at 550: times within [550, 610] are 550, 605, 610 → 3 accesses ✓
- Bob is a high-access employee

**Result:** ["Alice", "Bob"]

## Brute Force Approach

A naive approach would be to check every possible combination of three access times for each employee:

1. Group all access times by employee name
2. For each employee with at least 3 access times:
   - Generate all combinations of 3 access times
   - Convert each time to minutes
   - Check if the maximum time minus minimum time ≤ 60 minutes
3. If any combination satisfies the condition, add the employee to the result

**Why this is inefficient:**
If an employee has `k` access times, there are `C(k, 3) = k!/(3!(k-3)!)` combinations to check. For `k=100`, that's 161,700 combinations! This becomes `O(n³)` in the worst case where all accesses belong to one employee.

## Optimized Approach

The key insight is that we can use a **sliding window** approach after sorting each employee's access times:

1. **Group by employee**: Use a hash map to collect all access times for each employee
2. **Convert to minutes**: Convert "HHMM" strings to integer minutes for easy comparison
3. **Sort times**: For each employee, sort their access times in ascending order
4. **Sliding window check**: For each employee's sorted times:
   - Use two pointers: `left` at the start of the window, `right` expanding the window
   - While `times[right] - times[left] ≤ 60`, keep expanding `right`
   - If `right - left + 1 ≥ 3`, we found a valid window
   - Move `left` forward and repeat

This works because when times are sorted, if `times[right] - times[left] > 60`, moving `right` further will only make the difference larger. So we move `left` forward instead.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
# n = total number of access records
def findHighAccessEmployees(access_times):
    """
    Finds employees with 3+ accesses within any 60-minute window.

    Args:
        access_times: List[List[str]] where each inner list is [name, time]

    Returns:
        List[str]: Names of high-access employees
    """
    from collections import defaultdict

    # Step 1: Group access times by employee
    employee_times = defaultdict(list)

    for name, time_str in access_times:
        # Convert HHMM string to minutes since midnight
        hours = int(time_str[:2])
        minutes = int(time_str[2:])
        total_minutes = hours * 60 + minutes

        employee_times[name].append(total_minutes)

    result = []

    # Step 2: Check each employee's access pattern
    for name, times in employee_times.items():
        # Skip employees with fewer than 3 accesses (can't satisfy condition)
        if len(times) < 3:
            continue

        # Step 3: Sort times to enable sliding window
        times.sort()

        # Step 4: Sliding window to find any 60-minute window with 3+ accesses
        left = 0
        for right in range(len(times)):
            # Shrink window from left while times[right] - times[left] > 60
            while times[right] - times[left] > 60:
                left += 1

            # Check if current window has at least 3 accesses
            # right - left + 1 gives the number of accesses in current window
            if right - left + 1 >= 3:
                result.append(name)
                break  # Found a valid window, no need to check further

    return result
```

```javascript
// Time: O(n log n) | Space: O(n)
// n = total number of access records
function findHighAccessEmployees(access_times) {
  /**
   * Finds employees with 3+ accesses within any 60-minute window.
   *
   * @param {string[][]} access_times - Array of [name, time] pairs
   * @return {string[]} Names of high-access employees
   */

  // Step 1: Group access times by employee
  const employeeTimes = new Map();

  for (const [name, timeStr] of access_times) {
    // Convert HHMM string to minutes since midnight
    const hours = parseInt(timeStr.substring(0, 2));
    const minutes = parseInt(timeStr.substring(2));
    const totalMinutes = hours * 60 + minutes;

    if (!employeeTimes.has(name)) {
      employeeTimes.set(name, []);
    }
    employeeTimes.get(name).push(totalMinutes);
  }

  const result = [];

  // Step 2: Check each employee's access pattern
  for (const [name, times] of employeeTimes.entries()) {
    // Skip employees with fewer than 3 accesses
    if (times.length < 3) {
      continue;
    }

    // Step 3: Sort times to enable sliding window
    times.sort((a, b) => a - b);

    // Step 4: Sliding window to find any 60-minute window with 3+ accesses
    let left = 0;
    let found = false;

    for (let right = 0; right < times.length; right++) {
      // Shrink window from left while times[right] - times[left] > 60
      while (times[right] - times[left] > 60) {
        left++;
      }

      // Check if current window has at least 3 accesses
      if (right - left + 1 >= 3) {
        result.push(name);
        found = true;
        break; // Found a valid window, no need to check further
      }
    }
  }

  return result;
}
```

```java
// Time: O(n log n) | Space: O(n)
// n = total number of access records
import java.util.*;

class Solution {
    public List<String> findHighAccessEmployees(List<List<String>> access_times) {
        /**
         * Finds employees with 3+ accesses within any 60-minute window.
         *
         * @param access_times List of [name, time] pairs
         * @return List of high-access employee names
         */

        // Step 1: Group access times by employee
        Map<String, List<Integer>> employeeTimes = new HashMap<>();

        for (List<String> entry : access_times) {
            String name = entry.get(0);
            String timeStr = entry.get(1);

            // Convert HHMM string to minutes since midnight
            int hours = Integer.parseInt(timeStr.substring(0, 2));
            int minutes = Integer.parseInt(timeStr.substring(2));
            int totalMinutes = hours * 60 + minutes;

            employeeTimes.putIfAbsent(name, new ArrayList<>());
            employeeTimes.get(name).add(totalMinutes);
        }

        List<String> result = new ArrayList<>();

        // Step 2: Check each employee's access pattern
        for (Map.Entry<String, List<Integer>> entry : employeeTimes.entrySet()) {
            String name = entry.getKey();
            List<Integer> times = entry.getValue();

            // Skip employees with fewer than 3 accesses
            if (times.size() < 3) {
                continue;
            }

            // Step 3: Sort times to enable sliding window
            Collections.sort(times);

            // Step 4: Sliding window to find any 60-minute window with 3+ accesses
            int left = 0;
            boolean found = false;

            for (int right = 0; right < times.size(); right++) {
                // Shrink window from left while times[right] - times[left] > 60
                while (times.get(right) - times.get(left) > 60) {
                    left++;
                }

                // Check if current window has at least 3 accesses
                if (right - left + 1 >= 3) {
                    result.add(name);
                    found = true;
                    break; // Found a valid window, no need to check further
                }
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Grouping by employee: O(n) to iterate through all access records
- Sorting each employee's times: In worst case, all n records belong to one employee, so O(n log n)
- Sliding window check: O(n) total across all employees (each time is processed at most twice)
- Dominated by the sorting step: O(n log n)

**Space Complexity: O(n)**

- Hash map stores all access times: O(n)
- Sorting uses O(log n) additional space (for the recursive call stack in quicksort)
- Result list: O(k) where k ≤ n

## Common Mistakes

1. **Not converting time properly**: Forgetting that "0905" means 9:05 AM, not 905 minutes. Always convert HHMM to `hours*60 + minutes`.

2. **Incorrect window boundary**: Checking `times[right] - times[left] < 60` instead of `≤ 60`. If accesses happen at exactly 10:00 and 11:00, that's a 60-minute difference and should be included.

3. **Not breaking early**: Continuing to check all windows after finding one valid window for an employee. Once we find any 60-minute window with 3+ accesses, we can add the employee to results and move on.

4. **Forgetting to sort**: The sliding window approach only works with sorted times. Without sorting, you'd need to check all combinations.

## When You'll See This Pattern

This problem combines several common patterns:

1. **Grouping + Sliding Window**: Similar to:
   - **LeetCode 438 - Find All Anagrams in a String**: Group characters, then use sliding window
   - **LeetCode 567 - Permutation in String**: Similar sliding window with character counts

2. **Time Interval Problems**: Similar to:
   - **LeetCode 253 - Meeting Rooms II**: Finding maximum overlapping intervals
   - **LeetCode 56 - Merge Intervals**: Working with time ranges

3. **Counting with Constraints**: Similar to:
   - **LeetCode 930 - Binary Subarrays With Sum**: Counting subarrays with a specific sum
   - **LeetCode 1248 - Count Number of Nice Subarrays**: Counting with odd/even constraints

## Key Takeaways

1. **When dealing with time comparisons, convert to a common unit** (like minutes since midnight) to simplify arithmetic.

2. **Sorting enables efficient window checking** - many "find overlapping intervals" problems become tractable after sorting.

3. **The sliding window pattern is powerful for "within a range" constraints** - it reduces O(n²) or O(n³) brute force solutions to O(n).

4. **Always break early when possible** - if you only need to know "if any window exists" rather than "all windows", stop checking once you find one.

[Practice this problem on CodeJeet](/problem/high-access-employees)
