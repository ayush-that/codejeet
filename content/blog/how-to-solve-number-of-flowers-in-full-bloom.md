---
title: "How to Solve Number of Flowers in Full Bloom — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Number of Flowers in Full Bloom. Hard difficulty, 57.7% acceptance rate. Topics: Array, Hash Table, Binary Search, Sorting, Prefix Sum."
date: "2027-05-02"
category: "dsa-patterns"
tags: ["number-of-flowers-in-full-bloom", "array", "hash-table", "binary-search", "hard"]
---

# How to Solve Number of Flowers in Full Bloom

This problem asks us to determine how many flowers are in full bloom at each person's arrival time. Given flower bloom intervals and query times, we need to efficiently count overlaps. The challenge is that both flowers and people arrays can be large (up to 5×10⁴), making a naive O(n×m) approach too slow. The key insight is to transform the interval counting problem into a sorted event-based approach.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:**

```
flowers = [[1,6],[3,7],[9,12],[4,13]]
people = [2,3,7,11]
```

**Step-by-step reasoning:**

1. **Flower bloom intervals:**
   - Flower 0: blooms from time 1 to 6 (inclusive)
   - Flower 1: blooms from 3 to 7
   - Flower 2: blooms from 9 to 12
   - Flower 3: blooms from 4 to 13

2. **At time 2:** Only flower 0 is blooming → 1 flower
3. **At time 3:** Flowers 0 and 1 are blooming → 2 flowers
4. **At time 7:** Flowers 1 and 3 are blooming (flower 0 ends at 6) → 2 flowers
5. **At time 11:** Flowers 2 and 3 are blooming → 2 flowers

**Key observation:** For a given time `t`, we need to count:

- How many flowers started blooming before or at `t`
- Minus how many flowers finished blooming before `t` (not at `t`, since inclusive end)

This transforms our problem: instead of checking each flower for each person, we can sort start times and end times separately, then use binary search to quickly count.

## Brute Force Approach

The most straightforward solution is to check each person's time against every flower:

<div class="code-group">

```python
# Time: O(m * n) | Space: O(1) excluding output
def fullBloomFlowers(flowers, people):
    result = []
    for person_time in people:
        count = 0
        for start, end in flowers:
            # Check if person_time falls within bloom interval
            if start <= person_time <= end:
                count += 1
        result.append(count)
    return result
```

```javascript
// Time: O(m * n) | Space: O(1) excluding output
function fullBloomFlowers(flowers, people) {
  const result = [];
  for (const personTime of people) {
    let count = 0;
    for (const [start, end] of flowers) {
      // Check if personTime falls within bloom interval
      if (start <= personTime && personTime <= end) {
        count++;
      }
    }
    result.push(count);
  }
  return result;
}
```

```java
// Time: O(m * n) | Space: O(1) excluding output
public int[] fullBloomFlowers(int[][] flowers, int[] people) {
    int[] result = new int[people.length];
    for (int i = 0; i < people.length; i++) {
        int count = 0;
        for (int[] flower : flowers) {
            // Check if people[i] falls within bloom interval
            if (flower[0] <= people[i] && people[i] <= flower[1]) {
                count++;
            }
        }
        result[i] = count;
    }
    return result;
}
```

</div>

**Why this fails:** With up to 5×10⁴ flowers and 5×10⁴ people, this O(m×n) approach could require 2.5 billion operations, which is far too slow. We need something closer to O((m+n) log n).

## Optimized Approach

The key insight is to think in terms of **events**:

1. When a flower starts blooming, it adds 1 to the count
2. When a flower finishes blooming, it subtracts 1 from the count

However, we can't process events in real-time because people's times are arbitrary. Instead, we can:

- Extract all start times and sort them
- Extract all end times and sort them
- For each person's time `t`:
  - Use binary search to find how many flowers started by time `t` (including those starting exactly at `t`)
  - Use binary search to find how many flowers ended before time `t` (not including those ending at `t`, since end is inclusive)
  - The difference gives us the number of flowers blooming at time `t`

**Why this works mathematically:**

- Flowers blooming at time `t` = (flowers that started by `t`) - (flowers that ended before `t`)
- We use `bisect_right` for starts to include flowers starting exactly at `t`
- We use `bisect_left` for ends to exclude flowers ending exactly at `t` (since inclusive end means they're still blooming at `t`)

## Optimal Solution

Here's the complete implementation using binary search on sorted start and end arrays:

<div class="code-group">

```python
# Time: O((m + n) log n) | Space: O(n)
def fullBloomFlowers(flowers, people):
    # Step 1: Extract and sort start times and end times separately
    starts = sorted(start for start, _ in flowers)
    ends = sorted(end for _, end in flowers)

    result = []

    # Step 2: For each person's arrival time
    for person_time in people:
        # Step 3: Count how many flowers started blooming by this time
        # bisect_right includes flowers that start exactly at person_time
        started = bisect.bisect_right(starts, person_time)

        # Step 4: Count how many flowers finished blooming before this time
        # bisect_left excludes flowers that end exactly at person_time (inclusive end)
        ended = bisect.bisect_left(ends, person_time)

        # Step 5: Flowers currently blooming = started - ended
        result.append(started - ended)

    return result

# Note: Import bisect module at top of file
```

```javascript
// Time: O((m + n) log n) | Space: O(n)
function fullBloomFlowers(flowers, people) {
  // Step 1: Extract and sort start times and end times separately
  const starts = flowers.map((f) => f[0]).sort((a, b) => a - b);
  const ends = flowers.map((f) => f[1]).sort((a, b) => a - b);

  const result = [];

  // Helper function for binary search (rightmost insertion point)
  const bisectRight = (arr, target) => {
    let left = 0,
      right = arr.length;
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (arr[mid] <= target) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    return left;
  };

  // Helper function for binary search (leftmost insertion point)
  const bisectLeft = (arr, target) => {
    let left = 0,
      right = arr.length;
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (arr[mid] < target) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    return left;
  };

  // Step 2: For each person's arrival time
  for (const personTime of people) {
    // Step 3: Count how many flowers started blooming by this time
    // bisectRight includes flowers that start exactly at personTime
    const started = bisectRight(starts, personTime);

    // Step 4: Count how many flowers finished blooming before this time
    // bisectLeft excludes flowers that end exactly at personTime (inclusive end)
    const ended = bisectLeft(ends, personTime);

    // Step 5: Flowers currently blooming = started - ended
    result.push(started - ended);
  }

  return result;
}
```

```java
// Time: O((m + n) log n) | Space: O(n)
import java.util.Arrays;

public int[] fullBloomFlowers(int[][] flowers, int[] people) {
    int n = flowers.length;
    int m = people.length;

    // Step 1: Extract and sort start times and end times separately
    int[] starts = new int[n];
    int[] ends = new int[n];

    for (int i = 0; i < n; i++) {
        starts[i] = flowers[i][0];
        ends[i] = flowers[i][1];
    }

    Arrays.sort(starts);
    Arrays.sort(ends);

    int[] result = new int[m];

    // Step 2: For each person's arrival time
    for (int i = 0; i < m; i++) {
        int personTime = people[i];

        // Step 3: Count how many flowers started blooming by this time
        // We need the rightmost insertion point (includes flowers starting at personTime)
        int started = binarySearchRight(starts, personTime);

        // Step 4: Count how many flowers finished blooming before this time
        // We need the leftmost insertion point (excludes flowers ending at personTime)
        int ended = binarySearchLeft(ends, personTime);

        // Step 5: Flowers currently blooming = started - ended
        result[i] = started - ended;
    }

    return result;
}

// Helper: Binary search for rightmost insertion point (like bisect_right)
private int binarySearchRight(int[] arr, int target) {
    int left = 0, right = arr.length;
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] <= target) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }
    return left;
}

// Helper: Binary search for leftmost insertion point (like bisect_left)
private int binarySearchLeft(int[] arr, int target) {
    int left = 0, right = arr.length;
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }
    return left;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O((m + n) log n)

- Sorting start and end arrays: O(n log n) each, total O(n log n)
- For each of m people, we perform two binary searches: O(log n) each, total O(m log n)
- Overall: O((m + n) log n)

**Space Complexity:** O(n)

- We store two additional arrays for starts and ends, each of size n
- The output array of size m is not counted in auxiliary space
- Total auxiliary space: O(n)

## Common Mistakes

1. **Inclusive/Exclusive boundary confusion:** The most common error is mishandling the inclusive end. Remember: if a flower ends at time `t`, it's still blooming at `t`. That's why we use `bisect_left` for ends (to exclude flowers ending exactly at `t`) and `bisect_right` for starts (to include flowers starting exactly at `t`).

2. **Forgetting to sort:** The binary search approach only works on sorted arrays. Some candidates extract the arrays but forget to sort them, leading to incorrect results.

3. **Using the wrong binary search variant:** Confusing `bisect_left` and `bisect_right` will give off-by-one errors. Remember:
   - For starts: we want to count flowers with `start ≤ person_time` → use `bisect_right`
   - For ends: we want to count flowers with `end < person_time` → use `bisect_left`

4. **Inefficient data structures:** Some candidates try to use a hash map or tree for each time point, which can work but is more complex and error-prone than the simple two-array approach.

## When You'll See This Pattern

This "sorted events with binary search" pattern appears in several interval-related problems:

1. **Meeting Rooms II (LeetCode 253):** Instead of counting overlaps at arbitrary times, you need the maximum concurrent meetings. The solution involves sorting start and end times and using a two-pointer approach.

2. **Minimum Interval to Include Each Query (LeetCode 1851):** Similar structure with intervals and queries, but requires finding the minimum length interval containing each query point. Uses sorting plus a min-heap.

3. **Range Addition (LeetCode 370):** While not exactly the same, it uses a similar prefix-sum approach to efficiently apply range updates.

The core pattern: when you need to answer many queries about interval overlaps, consider separating start and end events, sorting them, and using binary search or two pointers.

## Key Takeaways

1. **Transform interval counting:** Instead of checking each interval for each query, think in terms of "how many intervals started by time T" minus "how many intervals ended before time T".

2. **Binary search on sorted arrays:** When queries are independent and you need efficient lookups, sorting + binary search is often the answer. This reduces O(m×n) to O((m+n) log n).

3. **Pay attention to inclusive/exclusive boundaries:** Interval problems often hinge on whether endpoints are inclusive or exclusive. Always clarify this with your interviewer and handle it consistently in your code.

Related problems: [Meeting Rooms II](/problem/meeting-rooms-ii), [Minimum Interval to Include Each Query](/problem/minimum-interval-to-include-each-query)
