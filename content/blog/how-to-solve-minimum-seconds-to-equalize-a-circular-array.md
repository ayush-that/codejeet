---
title: "How to Solve Minimum Seconds to Equalize a Circular Array — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Seconds to Equalize a Circular Array. Medium difficulty, 28.5% acceptance rate. Topics: Array, Hash Table."
date: "2029-12-23"
category: "dsa-patterns"
tags: ["minimum-seconds-to-equalize-a-circular-array", "array", "hash-table", "medium"]
---

# How to Solve Minimum Seconds to Equalize a Circular Array

This problem asks us to find the minimum number of seconds needed to make all elements in a circular array equal, where at each second each element can be replaced by itself, its left neighbor, or its right neighbor. The circular nature and the propagation mechanism make this problem interesting—it's essentially about finding how quickly a value can spread through the array.

## Visual Walkthrough

Let's trace through an example: `nums = [2, 1, 3, 1, 2]`

We need to find the minimum seconds to make all elements equal. At each second:

- Element at index `i` can become `nums[i]`, `nums[(i-1+n)%n]`, or `nums[(i+1)%n]`
- This means values can spread to adjacent positions each second

Consider trying to make all elements equal to `2`:

- Initial positions of `2`: indices 0 and 4
- From index 0, `2` spreads to neighbors: at second 1, indices 0, 1, and 4 could be 2
- From index 4, `2` spreads to neighbors: at second 1, indices 0, 3, and 4 could be 2
- After 1 second: indices 0, 1, 3, 4 could potentially be 2
- After 2 seconds: all indices could be 2

But wait—we need to be precise. The key insight: for a target value `v`, the maximum distance between consecutive occurrences of `v` in the circular array determines how many seconds it takes for `v` to fill the gaps.

For value `2` at indices [0, 4]:

- In circular order: ... 4 → 0 → 1 → 2 → 3 → 4 → 0 ...
- Distance between 0 and 4 (going forward): 1 step (4 → 0)
- Distance between 4 and 0 (going forward): 4 steps (0 → 1 → 2 → 3 → 4)
- Maximum gap: 4 steps
- Time needed: ceil(max_gap / 2) = ceil(4 / 2) = 2 seconds

Let's verify: After 1 second, 2 spreads from index 0 to indices 0,1,4 and from index 4 to indices 0,3,4. After 2 seconds, all positions can be 2.

## Brute Force Approach

A naive approach would simulate the process second by second:

1. For each possible target value
2. Simulate the spreading process until all elements equal that value
3. Track the minimum seconds needed

The simulation would work like BFS: at each second, positions with the target value "infect" their neighbors. We'd need to check all possible target values (all unique values in `nums`).

Why this is too slow:

- Up to `n` unique values (worst case: all elements distinct)
- Each simulation could take up to `n` seconds
- Total: O(n²) time, which is too slow for n up to 10⁵
- We also need to handle the circular nature carefully

The brute force helps build intuition but isn't efficient enough.

## Optimized Approach

The key insight: **For a given value `v`, the minimum seconds needed to make all elements equal to `v` is determined by the largest gap between consecutive occurrences of `v` in the circular array.**

Why? Because:

1. Values spread at most one position per second in each direction
2. The worst-case "blank spot" is the longest segment without `v`
3. From both ends of a gap of length `d`, it takes ceil(d/2) seconds to meet in the middle

We need to consider the circular nature: the array wraps around, so we should duplicate the array to handle circular distances easily.

Steps for the optimal solution:

1. Group indices by value using a hash map
2. For each value, collect all indices where it appears
3. Duplicate the indices array to handle circular wrap-around
4. For each value, find the maximum gap between consecutive occurrences
5. The time for that value = ceil(max_gap / 2)
6. Return the minimum time across all values

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def minimumSeconds(nums):
    """
    Find minimum seconds to equalize circular array.

    At each second, each element can become itself,
    its left neighbor, or its right neighbor.
    """
    from collections import defaultdict
    import math

    n = len(nums)

    # Step 1: Group indices by value
    # key: value, value: list of indices where it appears
    value_indices = defaultdict(list)
    for i, num in enumerate(nums):
        value_indices[num].append(i)

    # Initialize answer with a large value
    min_seconds = float('inf')

    # Step 2: For each unique value, calculate time needed
    for indices in value_indices.values():
        # If value appears everywhere, no time needed
        if len(indices) == n:
            return 0

        # Step 3: Handle circular nature by duplicating indices
        # Add n to each index in a copy to simulate wrap-around
        extended_indices = indices + [i + n for i in indices]

        # Step 4: Find maximum gap between consecutive occurrences
        max_gap = 0
        # Compare each pair of consecutive indices in the extended list
        for i in range(1, len(extended_indices)):
            gap = extended_indices[i] - extended_indices[i-1]
            max_gap = max(max_gap, gap)

        # Step 5: Time needed = ceil(max_gap / 2)
        # Because value spreads from both sides of the gap
        seconds_needed = math.ceil(max_gap / 2)

        # Step 6: Track minimum across all values
        min_seconds = min(min_seconds, seconds_needed)

    return min_seconds
```

```javascript
// Time: O(n) | Space: O(n)
function minimumSeconds(nums) {
  /**
   * Find minimum seconds to equalize circular array.
   *
   * At each second, each element can become itself,
   * its left neighbor, or its right neighbor.
   */
  const n = nums.length;

  // Step 1: Group indices by value
  // key: value, value: list of indices where it appears
  const valueIndices = new Map();
  for (let i = 0; i < n; i++) {
    const num = nums[i];
    if (!valueIndices.has(num)) {
      valueIndices.set(num, []);
    }
    valueIndices.get(num).push(i);
  }

  // Initialize answer with a large value
  let minSeconds = Infinity;

  // Step 2: For each unique value, calculate time needed
  for (const indices of valueIndices.values()) {
    // If value appears everywhere, no time needed
    if (indices.length === n) {
      return 0;
    }

    // Step 3: Handle circular nature by duplicating indices
    // Add n to each index in a copy to simulate wrap-around
    const extendedIndices = [...indices, ...indices.map((i) => i + n)];

    // Step 4: Find maximum gap between consecutive occurrences
    let maxGap = 0;
    // Compare each pair of consecutive indices in the extended list
    for (let i = 1; i < extendedIndices.length; i++) {
      const gap = extendedIndices[i] - extendedIndices[i - 1];
      maxGap = Math.max(maxGap, gap);
    }

    // Step 5: Time needed = ceil(maxGap / 2)
    // Because value spreads from both sides of the gap
    const secondsNeeded = Math.ceil(maxGap / 2);

    // Step 6: Track minimum across all values
    minSeconds = Math.min(minSeconds, secondsNeeded);
  }

  return minSeconds;
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.*;

class Solution {
    public int minimumSeconds(List<Integer> nums) {
        /**
         * Find minimum seconds to equalize circular array.
         *
         * At each second, each element can become itself,
         * its left neighbor, or its right neighbor.
         */
        int n = nums.size();

        // Step 1: Group indices by value
        // key: value, value: list of indices where it appears
        Map<Integer, List<Integer>> valueIndices = new HashMap<>();
        for (int i = 0; i < n; i++) {
            int num = nums.get(i);
            valueIndices.putIfAbsent(num, new ArrayList<>());
            valueIndices.get(num).add(i);
        }

        // Initialize answer with a large value
        int minSeconds = Integer.MAX_VALUE;

        // Step 2: For each unique value, calculate time needed
        for (List<Integer> indices : valueIndices.values()) {
            // If value appears everywhere, no time needed
            if (indices.size() == n) {
                return 0;
            }

            // Step 3: Handle circular nature by duplicating indices
            // Add n to each index in a copy to simulate wrap-around
            List<Integer> extendedIndices = new ArrayList<>(indices);
            for (int i : indices) {
                extendedIndices.add(i + n);
            }

            // Step 4: Find maximum gap between consecutive occurrences
            int maxGap = 0;
            // Compare each pair of consecutive indices in the extended list
            for (int i = 1; i < extendedIndices.size(); i++) {
                int gap = extendedIndices.get(i) - extendedIndices.get(i - 1);
                maxGap = Math.max(maxGap, gap);
            }

            // Step 5: Time needed = ceil(maxGap / 2)
            // Because value spreads from both sides of the gap
            int secondsNeeded = (maxGap + 1) / 2; // Ceil division

            // Step 6: Track minimum across all values
            minSeconds = Math.min(minSeconds, secondsNeeded);
        }

        return minSeconds;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Building the hash map: O(n) to iterate through all elements
- Processing each value: Each index appears in exactly one value's list and is processed once when calculating gaps
- The extended indices array has at most 2n elements per value, but total across all values is O(n)
- Overall linear time

**Space Complexity: O(n)**

- Hash map stores all indices grouped by value: O(n) space
- Extended indices arrays are temporary but total O(n) across all values
- No recursion or additional significant data structures

## Common Mistakes

1. **Forgetting the circular nature**: Not handling wrap-around correctly. The array is circular, so the distance between the last and first occurrence matters. Solution: Duplicate the indices array or use modulo arithmetic.

2. **Incorrect gap calculation**: Using simple differences instead of considering the circular distance. For indices [0, 4] in array of length 5, the circular distance from 4 to 0 is 1 (not -4). Solution: Add `n` to indices when creating the extended array.

3. **Wrong time formula**: Using `max_gap` directly instead of `ceil(max_gap / 2)`. Remember values spread from both sides simultaneously. If a gap has length 3, it takes 2 seconds (not 3): positions fill from both ends.

4. **Not handling single occurrence**: If a value appears only once, the gap calculation still works. The extended array will have two copies (i and i+n), giving a gap of n, which correctly gives ceil(n/2) seconds.

## When You'll See This Pattern

This problem uses **gap analysis in circular arrays**, which appears in several contexts:

1. **Meeting rooms/scheduling problems**: When you need to find minimum time for something to propagate circularly.
   - Related: [LeetCode 2492. Minimum Score of a Path Between Two Cities](https://leetcode.com/problems/minimum-score-of-a-path-between-two-cities/) - also about propagation through connections

2. **Circular array distance problems**: Finding minimum/maximum distances between elements in circular structures.
   - Related: [LeetCode 2134. Minimum Swaps to Group All 1's Together II](https://leetcode.com/problems/minimum-swaps-to-group-all-1s-together-ii/) - circular sliding window

3. **BFS propagation problems**: Where something spreads to neighbors each step.
   - Related: [LeetCode 994. Rotting Oranges](https://leetcode.com/problems/rotting-oranges/) - similar propagation mechanism but in 2D grid

## Key Takeaways

1. **Circular problems often need duplication**: When dealing with circular arrays, a common trick is to duplicate the array or indices to simplify distance calculations.

2. **Propagation time = ceil(gap/2)**: When something spreads one step per second from multiple sources, the time to fill a gap is half the gap length (rounded up).

3. **Group then analyze**: First group elements by value, then analyze each group independently. This divide-and-conquer approach simplifies complex problems.

[Practice this problem on CodeJeet](/problem/minimum-seconds-to-equalize-a-circular-array)
