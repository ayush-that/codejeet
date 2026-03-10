---
title: "How to Solve Least Number of Unique Integers after K Removals — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Least Number of Unique Integers after K Removals. Medium difficulty, 63.7% acceptance rate. Topics: Array, Hash Table, Greedy, Sorting, Counting."
date: "2028-02-20"
category: "dsa-patterns"
tags:
  ["least-number-of-unique-integers-after-k-removals", "array", "hash-table", "greedy", "medium"]
---

## How to Solve Least Number of Unique Integers after K Removals

You're given an array of integers and need to remove exactly `k` elements. After removal, you want the smallest possible number of unique integers remaining. The tricky part is deciding _which_ elements to remove—you can't just remove any random elements, but must strategically target frequencies to maximize the reduction of unique values.

**Why this is interesting:** It looks like a simple counting problem, but requires careful frequency analysis. The optimal strategy isn't about removing the most frequent elements (that would preserve uniqueness), but about removing the _least frequent_ ones first to eliminate entire unique values with minimal removals.

## Visual Walkthrough

Let's trace through an example: `arr = [4, 3, 1, 1, 3, 3, 2]`, `k = 3`

**Step 1: Count frequencies**

- 4 appears 1 time
- 3 appears 3 times
- 1 appears 2 times
- 2 appears 1 time

**Step 2: Sort by frequency (least to most frequent)**
Frequencies sorted: [1, 1, 2, 3] (corresponding to values 4, 2, 1, 3)

**Step 3: Remove elements strategically**
We have `k = 3` removals available:

1. Remove one instance of "4" (frequency 1) → uses 1 removal, eliminates unique value "4"
   - Remaining removals: 2
   - Unique values left: 3, 1, 2
2. Remove one instance of "2" (frequency 1) → uses 1 removal, eliminates unique value "2"
   - Remaining removals: 1
   - Unique values left: 3, 1
3. Remove one instance of "1" (frequency 2 → becomes 1) → uses 1 removal, doesn't eliminate "1" yet
   - Remaining removals: 0
   - Unique values left: 3, 1

**Result:** 2 unique integers remain (3 and 1)

The key insight: By targeting the least frequent elements first, we eliminate entire unique values with minimal removals. If we had removed from the most frequent (3), we'd use 3 removals just to reduce its count from 3 to 0, still leaving 3 other unique values.

## Brute Force Approach

A naive approach would try all combinations of removing `k` elements, then count unique values in each resulting array, and return the minimum. This involves:

1. Generating all combinations of indices to remove (n choose k)
2. For each combination, creating a new array without those elements
3. Counting unique values in the reduced array
4. Tracking the minimum unique count

The problem? With `n` up to 10^5, the number of combinations is astronomical. Even for modest `n=20` and `k=10`, we'd have 184,756 combinations to check. This is clearly infeasible.

What some candidates might incorrectly try: Removing the most frequent elements first. Let's test this on our example:

- Remove from "3" (frequency 3): After 3 removals, "3" is gone, but we still have 4, 1, 2 → 3 unique values (worse than our optimal 2).

## Optimized Approach

The key insight is **greedy removal of least frequent elements**. Here's the step-by-step reasoning:

1. **Count frequencies** - Use a hash map to count how many times each integer appears.
2. **Extract just the frequencies** - We don't need the actual values, just how common each one is.
3. **Sort frequencies ascending** - This lets us target the least frequent values first.
4. **Iterate through sorted frequencies** - For each frequency `f`:
   - If `k >= f`, we can remove all instances of this value, eliminating one unique integer.
   - If `k < f`, we can only remove some instances, not enough to eliminate the value.
   - Subtract the used removals from `k`.
5. **Count remaining unique values** - Start with total unique values, subtract how many we completely eliminated.

Why this greedy approach works: Each removal gives us "credit" toward reducing unique count. Removing from a frequency-1 value gives 1 credit toward eliminating a unique integer. Removing from a frequency-2 value requires 2 credits to eliminate it. By always using our credits on the cheapest targets first, we maximize how many unique integers we can eliminate with our fixed budget `k`.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) for sorting frequencies | Space: O(n) for frequency map
def findLeastNumOfUniqueInts(arr, k):
    """
    Returns the minimum number of unique integers after removing exactly k elements.

    Strategy: Remove least frequent elements first to maximize elimination of unique values.
    """
    # Step 1: Count frequency of each integer
    freq_map = {}
    for num in arr:
        freq_map[num] = freq_map.get(num, 0) + 1

    # Step 2: Extract just the frequencies and sort them
    # We sort ascending to target least frequent values first
    frequencies = sorted(freq_map.values())

    # Step 3: Initialize counters
    unique_count = len(frequencies)  # Total unique integers initially
    removals_used = 0  # Track how many removals we've allocated

    # Step 4: Greedily remove from least frequent values
    for freq in frequencies:
        # If we have enough removals to eliminate this entire unique value
        if removals_used + freq <= k:
            removals_used += freq  # Use removals to eliminate this value
            unique_count -= 1      # One less unique integer
        else:
            # Not enough removals left to eliminate this value
            # We'll use remaining removals on it but won't eliminate it
            break

    # Step 5: Return remaining unique count
    return unique_count
```

```javascript
// Time: O(n log n) for sorting frequencies | Space: O(n) for frequency map
function findLeastNumOfUniqueInts(arr, k) {
  /**
   * Returns the minimum number of unique integers after removing exactly k elements.
   *
   * Strategy: Remove least frequent elements first to maximize elimination of unique values.
   */

  // Step 1: Count frequency of each integer
  const freqMap = new Map();
  for (const num of arr) {
    freqMap.set(num, (freqMap.get(num) || 0) + 1);
  }

  // Step 2: Extract just the frequencies and sort them
  // We sort ascending to target least frequent values first
  const frequencies = Array.from(freqMap.values()).sort((a, b) => a - b);

  // Step 3: Initialize counters
  let uniqueCount = frequencies.length; // Total unique integers initially
  let removalsUsed = 0; // Track how many removals we've allocated

  // Step 4: Greedily remove from least frequent values
  for (const freq of frequencies) {
    // If we have enough removals to eliminate this entire unique value
    if (removalsUsed + freq <= k) {
      removalsUsed += freq; // Use removals to eliminate this value
      uniqueCount--; // One less unique integer
    } else {
      // Not enough removals left to eliminate this value
      // We'll use remaining removals on it but won't eliminate it
      break;
    }
  }

  // Step 5: Return remaining unique count
  return uniqueCount;
}
```

```java
// Time: O(n log n) for sorting frequencies | Space: O(n) for frequency map
import java.util.*;

class Solution {
    public int findLeastNumOfUniqueInts(int[] arr, int k) {
        /**
         * Returns the minimum number of unique integers after removing exactly k elements.
         *
         * Strategy: Remove least frequent elements first to maximize elimination of unique values.
         */

        // Step 1: Count frequency of each integer
        Map<Integer, Integer> freqMap = new HashMap<>();
        for (int num : arr) {
            freqMap.put(num, freqMap.getOrDefault(num, 0) + 1);
        }

        // Step 2: Extract just the frequencies and sort them
        // We sort ascending to target least frequent values first
        List<Integer> frequencies = new ArrayList<>(freqMap.values());
        Collections.sort(frequencies);

        // Step 3: Initialize counters
        int uniqueCount = frequencies.size();  // Total unique integers initially
        int removalsUsed = 0;                  // Track how many removals we've allocated

        // Step 4: Greedily remove from least frequent values
        for (int freq : frequencies) {
            // If we have enough removals to eliminate this entire unique value
            if (removalsUsed + freq <= k) {
                removalsUsed += freq;  // Use removals to eliminate this value
                uniqueCount--;         // One less unique integer
            } else {
                // Not enough removals left to eliminate this value
                // We'll use remaining removals on it but won't eliminate it
                break;
            }
        }

        // Step 5: Return remaining unique count
        return uniqueCount;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Building frequency map: O(n) to iterate through array
- Extracting and sorting frequencies: O(u log u) where u = number of unique values
- In worst case, all elements are unique (u = n), so O(n log n)
- The loop through sorted frequencies: O(u) ≤ O(n)

**Space Complexity: O(n)**

- Frequency map stores up to n entries (if all unique)
- List of frequencies stores up to n values
- No other significant storage needed

The sorting step dominates the time complexity. We could optimize to O(n) using a counting sort approach since frequencies are bounded by n, but O(n log n) is acceptable for interview constraints.

## Common Mistakes

1. **Removing most frequent elements first** - This seems intuitive ("remove the ones we have most of") but actually preserves more unique values. Always test with simple examples to verify your strategy.

2. **Forgetting to handle the case where k > total elements** - While the problem guarantees k ≤ arr.length, candidates sometimes write code that assumes k is smaller than individual frequencies. Our condition `removalsUsed + freq <= k` handles this correctly.

3. **Not breaking early when k runs out** - Some candidates continue iterating after k removals are used, which doesn't affect the result but wastes computation. The `break` statement optimizes this.

4. **Using a priority queue unnecessarily** - While a min-heap (priority queue) could work, it's overkill. Sorting frequencies once is simpler and has the same time complexity for this problem.

## When You'll See This Pattern

This "frequency sorting + greedy selection" pattern appears in many resource allocation problems:

1. **Maximum Number of Distinct Elements After Operations** - Similar but opposite: you can add to elements to make them equal, trying to maximize distinct values.

2. **Minimum Deletions to Make Character Frequencies Unique** (LeetCode 1647) - Adjust frequencies to make all unique, removing minimum characters.

3. **Task Scheduler** (LeetCode 621) - Schedule tasks with cooldown periods, which involves arranging by frequency.

4. **Reorganize String** (LeetCode 767) - Rearrange string so no two adjacent are same, using frequency-based placement.

The core pattern: When you need to optimize some metric (minimize/maximize count) with limited operations, first count frequencies, then process in optimal order (usually least or most frequent first).

## Key Takeaways

1. **Frequency analysis is your first tool** for array problems involving counts or removals. Always start by counting occurrences.

2. **Greedy on sorted frequencies often works** when you have an operation budget. Sort ascending to target rare items, descending to target common ones.

3. **Test your strategy with small examples** before coding. The "remove least frequent first" insight becomes obvious when you trace through a concrete case.

4. **You don't always need the actual values** - sometimes just the frequencies matter. This simplifies both code and reasoning.

Related problems: [Maximum Number of Distinct Elements After Operations](/problem/maximum-number-of-distinct-elements-after-operations)
