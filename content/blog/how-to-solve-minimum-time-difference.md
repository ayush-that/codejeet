---
title: "How to Solve Minimum Time Difference — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Time Difference. Medium difficulty, 62.6% acceptance rate. Topics: Array, Math, String, Sorting."
date: "2027-10-13"
category: "dsa-patterns"
tags: ["minimum-time-difference", "array", "math", "string", "medium"]
---

# How to Solve Minimum Time Difference

This problem asks us to find the smallest time difference in minutes between any two times in a list of 24-hour clock times. What makes this problem interesting is that time is circular—the difference between 23:59 and 00:01 is just 2 minutes, not 1438 minutes. This circular nature requires careful handling to avoid missing the "wrap-around" case.

## Visual Walkthrough

Let's trace through an example: `["23:59", "00:00", "12:30"]`

**Step 1: Convert times to minutes**

- "23:59" → 23 × 60 + 59 = 1439 minutes
- "00:00" → 0 × 60 + 0 = 0 minutes
- "12:30" → 12 × 60 + 30 = 750 minutes

**Step 2: Sort the minutes**
Sorted order: [0, 750, 1439]

**Step 3: Compare adjacent times**

- Difference between 0 and 750: 750 minutes
- Difference between 750 and 1439: 689 minutes

**Step 4: Check the circular case**
The difference between the last and first times, going around the clock:

- 0 + 1440 (full day) - 1439 = 1 minute

**Step 5: Find the minimum**
Minimum of [750, 689, 1] = 1 minute

The answer is 1 minute, which comes from comparing 23:59 and 00:00 across the midnight boundary.

## Brute Force Approach

The most straightforward approach is to compare every pair of times:

1. Convert each time string to total minutes
2. For each time i, compare it with every time j where j > i
3. Calculate both the forward difference and the circular difference
4. Track the minimum difference found

<div class="code-group">

```python
# Time: O(n²) | Space: O(n)
def findMinDifferenceBrute(timePoints):
    # Convert all times to minutes
    minutes = []
    for time in timePoints:
        hours, mins = map(int, time.split(':'))
        minutes.append(hours * 60 + mins)

    min_diff = float('inf')
    n = len(minutes)

    # Compare every pair
    for i in range(n):
        for j in range(i + 1, n):
            # Calculate forward difference
            diff = abs(minutes[i] - minutes[j])
            # Take the smaller of forward or circular difference
            diff = min(diff, 1440 - diff)
            min_diff = min(min_diff, diff)

    return min_diff
```

```javascript
// Time: O(n²) | Space: O(n)
function findMinDifferenceBrute(timePoints) {
  // Convert all times to minutes
  const minutes = [];
  for (const time of timePoints) {
    const [hours, mins] = time.split(":").map(Number);
    minutes.push(hours * 60 + mins);
  }

  let minDiff = Infinity;
  const n = minutes.length;

  // Compare every pair
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      // Calculate forward difference
      let diff = Math.abs(minutes[i] - minutes[j]);
      // Take the smaller of forward or circular difference
      diff = Math.min(diff, 1440 - diff);
      minDiff = Math.min(minDiff, diff);
    }
  }

  return minDiff;
}
```

```java
// Time: O(n²) | Space: O(n)
public int findMinDifferenceBrute(List<String> timePoints) {
    // Convert all times to minutes
    int[] minutes = new int[timePoints.size()];
    for (int i = 0; i < timePoints.size(); i++) {
        String[] parts = timePoints.get(i).split(":");
        int hours = Integer.parseInt(parts[0]);
        int mins = Integer.parseInt(parts[1]);
        minutes[i] = hours * 60 + mins;
    }

    int minDiff = Integer.MAX_VALUE;
    int n = minutes.length;

    // Compare every pair
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            // Calculate forward difference
            int diff = Math.abs(minutes[i] - minutes[j]);
            // Take the smaller of forward or circular difference
            diff = Math.min(diff, 1440 - diff);
            minDiff = Math.min(minDiff, diff);
        }
    }

    return minDiff;
}
```

</div>

**Why this is insufficient:** With n time points, we make n×(n-1)/2 comparisons, giving us O(n²) time complexity. For large inputs (up to 2×10⁴ time points), this is far too slow—it would require about 200 million operations.

## Optimized Approach

The key insight is that the minimum difference will always occur between **adjacent times when sorted**. Here's why:

1. **Sorting brings close times together**: When we sort the times, any two times that are close to each other on the 24-hour clock will be adjacent or nearly adjacent in the sorted list.

2. **The circular case is just another adjacent pair**: The difference between the largest and smallest times, going around the clock, can be treated as if the smallest time were 1440 minutes larger than it actually is (a full day ahead).

3. **Only need to check n comparisons**: After sorting, we only need to compare each time with its next neighbor, plus the circular case, giving us O(n log n) time complexity.

The algorithm:

1. Convert all time strings to minutes (O(n))
2. Sort the minutes (O(n log n))
3. Compare adjacent differences (O(n))
4. Check the circular difference between first and last (O(1))
5. Return the minimum

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def findMinDifference(timePoints):
    # Step 1: Convert all time strings to minutes
    minutes = []
    for time in timePoints:
        # Split "HH:MM" into hours and minutes
        hours, mins = map(int, time.split(':'))
        # Convert to total minutes since midnight
        total_minutes = hours * 60 + mins
        minutes.append(total_minutes)

    # Step 2: Sort the minutes to bring close times together
    minutes.sort()

    # Step 3: Initialize minimum difference as infinity
    min_diff = float('inf')

    # Step 4: Compare adjacent times in sorted order
    for i in range(1, len(minutes)):
        # Calculate difference between current and previous time
        diff = minutes[i] - minutes[i - 1]
        # Update minimum if this difference is smaller
        min_diff = min(min_diff, diff)

    # Step 5: Check the circular case (last to first across midnight)
    # Add 1440 (24 hours in minutes) to the first time to represent it "tomorrow"
    circular_diff = (minutes[0] + 1440) - minutes[-1]
    min_diff = min(min_diff, circular_diff)

    return min_diff
```

```javascript
// Time: O(n log n) | Space: O(n)
function findMinDifference(timePoints) {
  // Step 1: Convert all time strings to minutes
  const minutes = [];
  for (const time of timePoints) {
    // Split "HH:MM" into hours and minutes
    const [hours, mins] = time.split(":").map(Number);
    // Convert to total minutes since midnight
    const totalMinutes = hours * 60 + mins;
    minutes.push(totalMinutes);
  }

  // Step 2: Sort the minutes to bring close times together
  minutes.sort((a, b) => a - b);

  // Step 3: Initialize minimum difference as infinity
  let minDiff = Infinity;

  // Step 4: Compare adjacent times in sorted order
  for (let i = 1; i < minutes.length; i++) {
    // Calculate difference between current and previous time
    const diff = minutes[i] - minutes[i - 1];
    // Update minimum if this difference is smaller
    minDiff = Math.min(minDiff, diff);
  }

  // Step 5: Check the circular case (last to first across midnight)
  // Add 1440 (24 hours in minutes) to the first time to represent it "tomorrow"
  const circularDiff = minutes[0] + 1440 - minutes[minutes.length - 1];
  minDiff = Math.min(minDiff, circularDiff);

  return minDiff;
}
```

```java
// Time: O(n log n) | Space: O(n)
public int findMinDifference(List<String> timePoints) {
    // Step 1: Convert all time strings to minutes
    int[] minutes = new int[timePoints.size()];
    for (int i = 0; i < timePoints.size(); i++) {
        String[] parts = timePoints.get(i).split(":");
        int hours = Integer.parseInt(parts[0]);
        int mins = Integer.parseInt(parts[1]);
        // Convert to total minutes since midnight
        minutes[i] = hours * 60 + mins;
    }

    // Step 2: Sort the minutes to bring close times together
    Arrays.sort(minutes);

    // Step 3: Initialize minimum difference as maximum integer
    int minDiff = Integer.MAX_VALUE;

    // Step 4: Compare adjacent times in sorted order
    for (int i = 1; i < minutes.length; i++) {
        // Calculate difference between current and previous time
        int diff = minutes[i] - minutes[i - 1];
        // Update minimum if this difference is smaller
        minDiff = Math.min(minDiff, diff);
    }

    // Step 5: Check the circular case (last to first across midnight)
    // Add 1440 (24 hours in minutes) to the first time to represent it "tomorrow"
    int circularDiff = (minutes[0] + 1440) - minutes[minutes.length - 1];
    minDiff = Math.min(minDiff, circularDiff);

    return minDiff;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Converting n time strings to minutes: O(n)
- Sorting n integers: O(n log n) — this is the dominant operation
- Comparing adjacent elements: O(n)
- Total: O(n + n log n + n) = O(n log n)

**Space Complexity: O(n)**

- We store all n time points as integers: O(n)
- Sorting may require additional O(log n) space for the algorithm's stack, but we typically say O(n) for the array storage

## Common Mistakes

1. **Forgetting the circular case**: The most common error is only comparing adjacent times in the sorted list and missing that 23:59 and 00:01 are only 2 minutes apart, not 1438 minutes. Always remember to check `(first + 1440) - last`.

2. **Incorrect time conversion**: When parsing "HH:MM", ensure you handle leading zeros. Using `int()` or `Integer.parseInt()` handles this correctly, but some candidates try manual string manipulation and get it wrong.

3. **Not sorting before comparing**: Some candidates try to find the minimum difference without sorting, which requires O(n²) comparisons. The sorting step is crucial for reducing to O(n log n).

4. **Off-by-one in the loop**: When comparing adjacent elements, start from index 1 and compare with index i-1. Starting from 0 and comparing with i+1 can cause index out of bounds errors at the last element.

## When You'll See This Pattern

This problem teaches the **"sort and compare adjacent elements"** pattern, which appears in many problems where you need to find minimum/maximum differences:

1. **Maximum Gap (LeetCode 164)**: Find the maximum difference between successive elements in sorted order. The same sorting approach works, though there's a harder linear-time solution using bucket sort.

2. **Array Partition I (LeetCode 561)**: To maximize the sum of min(a,b) pairs, you sort and take every other element. The insight that sorting brings optimal pairs together is similar.

3. **Meeting Rooms II (LeetCode 253)**: While not identical, the concept of sorting intervals and comparing adjacent endpoints shares the "sort first, then process in order" mentality.

The core pattern: When you need to find relationships between elements (differences, overlaps, pairs), sorting often brings the relevant elements together, reducing the problem complexity.

## Key Takeaways

1. **Sorting transforms relationship problems**: When asked to find minimum/maximum differences or relationships between elements, sorting is often the first optimization to consider. It brings relevant elements together.

2. **Circular data needs wrap-around handling**: For problems involving circular data (time, angles, circular arrays), always check both the direct difference and the "wrap-around" difference by adding the period (24 hours = 1440 minutes, 360 degrees, etc.).

3. **Adjacent elements in sorted order often hold the answer**: After sorting, the minimum difference between any two elements will be between some pair of adjacent elements in the sorted list. This reduces O(n²) comparisons to O(n).

Related problems: [Minimum Cost to Set Cooking Time](/problem/minimum-cost-to-set-cooking-time)
