---
title: "How to Solve Minimum Total Cost to Make Arrays Unequal — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Total Cost to Make Arrays Unequal. Hard difficulty, 41.2% acceptance rate. Topics: Array, Hash Table, Greedy, Counting."
date: "2026-08-13"
category: "dsa-patterns"
tags: ["minimum-total-cost-to-make-arrays-unequal", "array", "hash-table", "greedy", "hard"]
---

# How to Solve Minimum Total Cost to Make Arrays Unequal

This problem asks us to find the minimum total cost to swap elements in `nums1` so that `nums1[i] != nums2[i]` for all indices `i`, where each swap costs the sum of the indices being swapped. The challenge lies in efficiently handling the constraints while ensuring all positions become unequal with minimal cost.

**What makes this tricky:** We need to simultaneously track which positions have equal values, decide which values to swap, and minimize the sum of indices involved in swaps. A greedy approach is required, but the exact swapping strategy depends on frequency counts of problematic values.

## Visual Walkthrough

Let's trace through an example to build intuition:

```
nums1 = [1, 2, 3, 4, 1]
nums2 = [2, 1, 3, 1, 3]
```

**Step 1: Identify problematic positions**
We check where `nums1[i] == nums2[i]`:

- Index 2: 3 == 3 ✓ (problematic)
- All others: 1≠2, 2≠1, 4≠1, 1≠3 (fine)

So we have one problematic position: index 2 with value 3.

**Step 2: Find a value to swap with**
We need to swap index 2 with some other index where the value at that index in `nums1` is NOT equal to 3 (the value at index 2 in `nums2` after swapping).

Check index 0: `nums1[0] = 1`, `nums2[0] = 2`. If we swap indices 0 and 2:

- After swap: `nums1[0] = 3`, `nums2[0] = 2` → 3≠2 ✓
- After swap: `nums1[2] = 1`, `nums2[2] = 3` → 1≠3 ✓

Cost = 0 + 2 = 2. This works!

**Step 3: Consider a more complex case**

```
nums1 = [1, 1, 2, 3]
nums2 = [1, 1, 1, 1]
```

Here, indices 0 and 1 are problematic (both have value 1). We need to swap these with indices 2 and 3. But careful: if we swap index 0 with index 2:

- After: `nums1[0] = 2`, `nums2[0] = 1` → 2≠1 ✓
- After: `nums1[2] = 1`, `nums2[2] = 1` → 1=1 ✗ (new problem!)

So we need to ensure the value we swap TO a position doesn't create a new equality. This is where frequency analysis becomes crucial.

## Brute Force Approach

A brute force approach would try all possible sequences of swaps to fix all problematic positions. For each problematic position, we could try swapping with every other position, recursively exploring all possibilities.

**Why this fails:**

1. **Exponential time:** With n positions, there are n! possible swap sequences to consider.
2. **No clear stopping condition:** We'd need to explore deeply to find minimal cost.
3. **n up to 10⁵:** Even O(n²) is impossible, let alone exponential.

The brute force is clearly infeasible, so we need a smarter approach.

## Optimized Approach

The key insight is that we only care about positions where `nums1[i] == nums2[i]`. Let's call these "bad" positions. For each bad position `i` with value `v`, we need to swap it with some other position `j` such that:

1. After swapping, `nums1[i] != nums2[i]` (fixes the original problem)
2. After swapping, `nums1[j] != nums2[j]` (doesn't create a new problem)

**Observation 1:** If we have a value `x` that appears more than `n/2` times among the bad positions, we might need to involve "good" positions (where `nums1[i] != nums2[i]`) in swaps.

**Observation 2:** To minimize cost, we should prioritize swapping bad positions with each other when possible, since this fixes two problems with one swap (cost = i + j).

**Observation 3:** When we can't pair bad positions (because they have the same value), we need to involve good positions. We should choose the cheapest good positions (smallest indices) for these swaps.

**The algorithm:**

1. Collect all bad positions (where `nums1[i] == nums2[i]`)
2. Count frequency of each value in bad positions
3. Find the most frequent value in bad positions
4. If its frequency > n/2, we need to involve enough good positions
5. Greedily pair bad positions for swapping, using good positions when necessary
6. Sum the indices of all positions involved in swaps

## Optimal Solution

The solution involves careful counting and greedy pairing:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def minimumTotalCost(nums1, nums2):
    n = len(nums1)
    total_cost = 0
    bad_positions = []
    freq = {}

    # Step 1: Collect all positions where nums1[i] == nums2[i]
    for i in range(n):
        if nums1[i] == nums2[i]:
            bad_positions.append(i)
            # Count frequency of this value in bad positions
            freq[nums1[i]] = freq.get(nums1[i], 0) + 1

    # If no bad positions, cost is 0
    if not bad_positions:
        return 0

    # Step 2: Find the most frequent value in bad positions
    max_freq = 0
    max_freq_val = -1
    for val, count in freq.items():
        if count > max_freq:
            max_freq = count
            max_freq_val = val

    # Step 3: Check if we need to involve good positions
    # If the most frequent value appears more than half of bad positions,
    # we need additional positions to swap with
    need_extra = max_freq * 2 - len(bad_positions)
    if need_extra > 0:
        # We need to involve 'need_extra' good positions
        # Choose the cheapest (smallest index) good positions
        extra_count = 0
        for i in range(n):
            # Good position condition: nums1[i] != nums2[i]
            # Also, the value at this position shouldn't be the max_freq_val
            # (to avoid creating new problems)
            if (nums1[i] != nums2[i] and
                nums1[i] != max_freq_val and
                nums2[i] != max_freq_val):
                bad_positions.append(i)
                extra_count += 1
                if extra_count == need_extra:
                    break

        # If we couldn't find enough good positions, problem is impossible
        if extra_count < need_extra:
            return -1

    # Step 4: Calculate total cost (sum of all indices in bad_positions)
    # When we pair positions for swapping, each position appears once
    # So total cost is simply sum of all indices involved
    return sum(bad_positions)
```

```javascript
// Time: O(n) | Space: O(n)
function minimumTotalCost(nums1, nums2) {
  const n = nums1.length;
  let totalCost = 0;
  const badPositions = [];
  const freq = new Map();

  // Step 1: Collect all positions where nums1[i] == nums2[i]
  for (let i = 0; i < n; i++) {
    if (nums1[i] === nums2[i]) {
      badPositions.push(i);
      // Count frequency of this value in bad positions
      freq.set(nums1[i], (freq.get(nums1[i]) || 0) + 1);
    }
  }

  // If no bad positions, cost is 0
  if (badPositions.length === 0) {
    return 0;
  }

  // Step 2: Find the most frequent value in bad positions
  let maxFreq = 0;
  let maxFreqVal = -1;
  for (const [val, count] of freq) {
    if (count > maxFreq) {
      maxFreq = count;
      maxFreqVal = val;
    }
  }

  // Step 3: Check if we need to involve good positions
  // If the most frequent value appears more than half of bad positions,
  // we need additional positions to swap with
  let needExtra = maxFreq * 2 - badPositions.length;
  if (needExtra > 0) {
    // We need to involve 'needExtra' good positions
    // Choose the cheapest (smallest index) good positions
    let extraCount = 0;
    for (let i = 0; i < n; i++) {
      // Good position condition: nums1[i] != nums2[i]
      // Also, the value at this position shouldn't be the maxFreqVal
      // (to avoid creating new problems)
      if (nums1[i] !== nums2[i] && nums1[i] !== maxFreqVal && nums2[i] !== maxFreqVal) {
        badPositions.push(i);
        extraCount++;
        if (extraCount === needExtra) {
          break;
        }
      }
    }

    // If we couldn't find enough good positions, problem is impossible
    if (extraCount < needExtra) {
      return -1;
    }
  }

  // Step 4: Calculate total cost (sum of all indices in badPositions)
  // When we pair positions for swapping, each position appears once
  // So total cost is simply sum of all indices involved
  return badPositions.reduce((sum, idx) => sum + idx, 0);
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public long minimumTotalCost(int[] nums1, int[] nums2) {
        int n = nums1.length;
        List<Integer> badPositions = new ArrayList<>();
        Map<Integer, Integer> freq = new HashMap<>();

        // Step 1: Collect all positions where nums1[i] == nums2[i]
        for (int i = 0; i < n; i++) {
            if (nums1[i] == nums2[i]) {
                badPositions.add(i);
                // Count frequency of this value in bad positions
                freq.put(nums1[i], freq.getOrDefault(nums1[i], 0) + 1);
            }
        }

        // If no bad positions, cost is 0
        if (badPositions.isEmpty()) {
            return 0L;
        }

        // Step 2: Find the most frequent value in bad positions
        int maxFreq = 0;
        int maxFreqVal = -1;
        for (Map.Entry<Integer, Integer> entry : freq.entrySet()) {
            if (entry.getValue() > maxFreq) {
                maxFreq = entry.getValue();
                maxFreqVal = entry.getKey();
            }
        }

        // Step 3: Check if we need to involve good positions
        // If the most frequent value appears more than half of bad positions,
        // we need additional positions to swap with
        int needExtra = maxFreq * 2 - badPositions.size();
        if (needExtra > 0) {
            // We need to involve 'needExtra' good positions
            // Choose the cheapest (smallest index) good positions
            int extraCount = 0;
            for (int i = 0; i < n; i++) {
                // Good position condition: nums1[i] != nums2[i]
                // Also, the value at this position shouldn't be the maxFreqVal
                // (to avoid creating new problems)
                if (nums1[i] != nums2[i] &&
                    nums1[i] != maxFreqVal &&
                    nums2[i] != maxFreqVal) {
                    badPositions.add(i);
                    extraCount++;
                    if (extraCount == needExtra) {
                        break;
                    }
                }
            }

            // If we couldn't find enough good positions, problem is impossible
            if (extraCount < needExtra) {
                return -1L;
            }
        }

        // Step 4: Calculate total cost (sum of all indices in badPositions)
        // When we pair positions for swapping, each position appears once
        // So total cost is simply sum of all indices involved
        long totalCost = 0L;
        for (int idx : badPositions) {
            totalCost += idx;
        }
        return totalCost;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass to identify bad positions and count frequencies: O(n)
- We find the maximum frequency: O(k) where k ≤ n (number of distinct values)
- We potentially make another pass to find good positions: O(n)
- Total: O(n) linear time

**Space Complexity: O(n)**

- We store bad positions: O(n) in worst case (all positions are bad)
- We store frequency counts: O(k) where k ≤ n
- Total: O(n) linear space

## Common Mistakes

1. **Not handling the "dominant value" case:** When one value appears more than n/2 times in bad positions, candidates often try to pair all bad positions directly, which fails because same-value positions can't swap with each other (wouldn't fix the problem).

2. **Forgetting to check if solution exists:** When we need good positions but all good positions contain the dominant value, we should return -1. Some candidates miss this edge case.

3. **Incorrect cost calculation:** The cost is the sum of indices involved in swaps, not the number of swaps. Each position involved in any swap contributes its index once to the total cost.

4. **Using wrong comparison for good positions:** When selecting good positions to involve, we must ensure they don't contain the dominant value in either array. Checking only `nums1[i]` is insufficient.

## When You'll See This Pattern

This problem combines frequency counting with greedy pairing, a pattern seen in:

1. **Minimum Swaps to Make Sequences Increasing (LeetCode 801):** Also involves strategic swapping to achieve a condition, though with different constraints.

2. **Minimum Domino Rotations For Equal Row (LeetCode 1007):** Uses frequency analysis to determine if a target value can dominate the array.

3. **Minimum Number of Swaps to Make the String Balanced (LeetCode 1963):** Involves counting imbalances and calculating minimum swaps.

The core pattern is: identify problematic elements, count frequencies to understand constraints, then apply greedy matching with careful consideration of dominant elements.

## Key Takeaways

1. **Frequency analysis is crucial for constraint problems:** When elements have relationships (like equality constraints), counting frequencies helps identify the "bottleneck" value that determines feasibility.

2. **Greedy pairing minimizes operations:** Pairing problematic elements with each other when possible is optimal, falling back to "neutral" elements only when necessary.

3. **Cost calculation can be simplified:** Instead of tracking individual swaps, recognize that each position involved in any swap contributes its index once to the total cost when summing all involved indices.

[Practice this problem on CodeJeet](/problem/minimum-total-cost-to-make-arrays-unequal)
