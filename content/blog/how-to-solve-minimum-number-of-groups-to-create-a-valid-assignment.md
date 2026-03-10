---
title: "How to Solve Minimum Number of Groups to Create a Valid Assignment — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Number of Groups to Create a Valid Assignment. Medium difficulty, 24.8% acceptance rate. Topics: Array, Hash Table, Greedy."
date: "2030-02-16"
category: "dsa-patterns"
tags:
  [
    "minimum-number-of-groups-to-create-a-valid-assignment",
    "array",
    "hash-table",
    "greedy",
    "medium",
  ]
---

# How to Solve Minimum Number of Groups to Create a Valid Assignment

You're given an array of integers representing ball values and need to group them such that all balls with the same value go into the same group, but you can split balls of the same value across multiple groups. The challenge is to find the minimum number of groups needed while ensuring that the size difference between any two groups is at most 1. This problem is tricky because it combines frequency counting with mathematical reasoning about group sizes.

## Visual Walkthrough

Let's trace through example `balls = [3, 2, 3, 2, 3, 3]`:

1. **Count frequencies**: Value 3 appears 4 times, value 2 appears 2 times
2. **The constraint**: Group sizes must differ by at most 1. Possible group sizes could be (2,3) or (3,4) or (1,2), etc.
3. **Key insight**: For each ball value with frequency `f`, we need to split it into groups of size `k` or `k+1` (where `k` is our chosen group size).
4. **Testing possibilities**:
   - If we try group size 2:
     - For value 3 (freq=4): 4 ÷ 2 = 2 groups exactly ✓
     - For value 2 (freq=2): 2 ÷ 2 = 1 group exactly ✓
     - Total groups = 2 + 1 = 3
   - If we try group size 3:
     - For value 3 (freq=4): 4 ÷ 3 = 1 group of 3, remainder 1 (can't form valid group) ✗
   - If we try group size 1:
     - Works but gives more groups than necessary
5. **Finding minimum**: We need the smallest `k` where all frequencies can be expressed as `a*k + b*(k+1)` with non-negative integers `a,b`.

The real challenge is that we don't know `k` in advance - we need to find the largest possible `k` that works for all frequencies, since larger `k` means fewer groups.

## Brute Force Approach

A naive approach would be to try every possible group size from 1 up to the maximum frequency. For each candidate size `k`, check if every frequency can be divided into groups of size `k` or `k+1`. This involves:

1. Counting frequencies of each ball value
2. For each `k` from 1 to max frequency:
   - For each frequency `f`:
     - Try to express `f = a*k + b*(k+1)` where `a,b ≥ 0`
     - This can be checked by seeing if `f % k ≤ f/k` (since each group of size `k` can be converted to `k+1` by adding 1 ball)
3. Track the smallest number of groups

The problem with this brute force is it could be O(n × max_freq²) in worst case, which is too slow for large inputs. A candidate might also try greedy grouping without proper mathematical validation, leading to incorrect results.

## Optimized Approach

The key insight is that we only need to check divisors around the frequencies. Here's the step-by-step reasoning:

1. **Frequency counting**: First, count how many times each ball value appears.
2. **Mathematical observation**: If we have group sizes `k` and `k+1`, then for a frequency `f` to be valid, we need `f ≥ k` and `f % k ≤ f/k`. This is because:
   - Start with all groups of size `k`: we get `f/k` groups
   - We can convert some `k`-sized groups to `k+1` by adding 1 ball each
   - We have `f % k` leftover balls after making `k`-sized groups
   - Each conversion uses 1 leftover ball, so we need `f % k ≤ f/k`
3. **Finding optimal k**: Instead of trying all `k`, we only need to check `k` from 1 up to `min(frequency) + 1`. Why? Because:
   - If `k > min_freq + 1`, then the smallest frequency can't form any valid group
   - We check decreasing `k` values and take the first valid one (largest `k` gives fewest groups)
4. **Calculating groups**: For valid `k`, total groups = sum over all frequencies of `ceil(f/(k+1))` with adjustment for exact division

The clever part is realizing we can check validity efficiently and that we only need to check a small range of possible `k` values.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n + m * sqrt(max_freq)) where n = len(balls), m = unique values
# Space: O(m) for frequency dictionary
def minGroupsForValidAssignment(balls):
    # Step 1: Count frequencies of each ball value
    freq_map = {}
    for ball in balls:
        freq_map[ball] = freq_map.get(ball, 0) + 1

    # Get just the frequencies as a list
    frequencies = list(freq_map.values())

    # Step 2: Try possible group sizes from largest to smallest
    # We start from min_freq + 1 down to 1
    min_freq = min(frequencies)

    # Try each possible k value
    for k in range(min_freq + 1, 0, -1):
        total_groups = 0
        valid = True

        # Step 3: Check if this k works for all frequencies
        for f in frequencies:
            # Calculate quotient and remainder when dividing by k
            q = f // k
            r = f % k

            # Check if we can form groups of size k and k+1
            # We need r <= q because each remainder ball needs a k-sized group
            # to convert to k+1 size
            if r > q:
                valid = False
                break

            # Calculate number of groups needed for this frequency
            # Formula: ceil(f / (k+1)) but we need to handle exact division
            groups_for_f = (f + k) // (k + 1)
            total_groups += groups_for_f

        # Step 4: If valid for all frequencies, return result
        if valid:
            return total_groups

    # Should never reach here since k=1 always works
    return len(balls)
```

```javascript
// Time: O(n + m * sqrt(max_freq)) where n = balls.length, m = unique values
// Space: O(m) for frequency map
function minGroupsForValidAssignment(balls) {
  // Step 1: Count frequencies of each ball value
  const freqMap = new Map();
  for (const ball of balls) {
    freqMap.set(ball, (freqMap.get(ball) || 0) + 1);
  }

  // Get just the frequencies as an array
  const frequencies = Array.from(freqMap.values());

  // Step 2: Try possible group sizes from largest to smallest
  const minFreq = Math.min(...frequencies);

  // Try each possible k value
  for (let k = minFreq + 1; k >= 1; k--) {
    let totalGroups = 0;
    let valid = true;

    // Step 3: Check if this k works for all frequencies
    for (const f of frequencies) {
      // Calculate quotient and remainder
      const q = Math.floor(f / k);
      const r = f % k;

      // Check validity condition: r <= q
      if (r > q) {
        valid = false;
        break;
      }

      // Calculate groups needed for this frequency
      // Using ceil(f / (k+1)) formula
      const groupsForF = Math.ceil(f / (k + 1));
      totalGroups += groupsForF;
    }

    // Step 4: If valid for all frequencies, return result
    if (valid) {
      return totalGroups;
    }
  }

  // Fallback: k=1 always works (each ball in its own group)
  return balls.length;
}
```

```java
// Time: O(n + m * sqrt(max_freq)) where n = balls.length, m = unique values
// Space: O(m) for frequency map
import java.util.*;

public class Solution {
    public int minGroupsForValidAssignment(int[] balls) {
        // Step 1: Count frequencies of each ball value
        Map<Integer, Integer> freqMap = new HashMap<>();
        for (int ball : balls) {
            freqMap.put(ball, freqMap.getOrDefault(ball, 0) + 1);
        }

        // Get just the frequencies as a list
        List<Integer> frequencies = new ArrayList<>(freqMap.values());

        // Step 2: Try possible group sizes from largest to smallest
        int minFreq = Integer.MAX_VALUE;
        for (int f : frequencies) {
            minFreq = Math.min(minFreq, f);
        }

        // Try each possible k value
        for (int k = minFreq + 1; k >= 1; k--) {
            int totalGroups = 0;
            boolean valid = true;

            // Step 3: Check if this k works for all frequencies
            for (int f : frequencies) {
                int q = f / k;      // quotient
                int r = f % k;      // remainder

                // Check validity condition: r <= q
                if (r > q) {
                    valid = false;
                    break;
                }

                // Calculate groups needed for this frequency
                // Using ceil(f / (k+1)) = (f + k) / (k + 1) in integer division
                int groupsForF = (f + k) / (k + 1);
                totalGroups += groupsForF;
            }

            // Step 4: If valid for all frequencies, return result
            if (valid) {
                return totalGroups;
            }
        }

        // Fallback: k=1 always works
        return balls.length;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n + m × k) where:

- `n` is the length of the input array (for counting frequencies)
- `m` is the number of unique ball values
- `k` is `min_freq + 1` (the range of group sizes we check)

In practice, `k` is at most the minimum frequency + 1, and `m ≤ n`, so worst case is O(n × min_freq). Since min_freq ≤ n, this could be O(n²) in pathological cases, but typically much faster.

**Space Complexity**: O(m) where `m` is the number of unique ball values, for storing the frequency map.

## Common Mistakes

1. **Not checking all frequencies for a given k**: Candidates might find a k that works for most frequencies but miss one. Always validate against ALL frequencies before accepting a k value.

2. **Incorrect validity condition**: The condition `r <= q` (remainder ≤ quotient) is subtle. A common mistake is checking `r <= k` or `r == 0`, which doesn't account for converting k-sized groups to k+1 sized groups.

3. **Starting from wrong k range**: Starting from k=1 and going up finds a valid k but not necessarily the optimal (largest) one. We need the largest valid k to minimize groups, so we must check from largest to smallest.

4. **Forgetting the +1 in group calculation**: When calculating groups as `ceil(f/(k+1))`, some candidates use `f/(k+1)` without ceiling, getting fractional groups. Integer division `(f + k)/(k + 1)` correctly implements ceiling.

## When You'll See This Pattern

This problem combines frequency counting with divisor-based optimization, a pattern seen in:

1. **Minimum Number of Operations to Make Array Continuous** (LeetCode 2009): Similar frequency analysis with mathematical constraints on grouping.

2. **Divide Array in Sets of K Consecutive Numbers** (LeetCode 1296): Uses frequency counting and grouping with size constraints.

3. **Split Array into Consecutive Subsequences** (LeetCode 659): Another grouping problem where mathematical reasoning about group sizes is key.

The core pattern is: when you need to partition elements with constraints on group sizes, think about frequency distributions and what mathematical conditions make grouping possible.

## Key Takeaways

1. **Frequency analysis is crucial**: When dealing with grouping problems, always start by counting element frequencies - it often reveals the structure of the problem.

2. **Mathematical constraints beat brute force**: Instead of trying all groupings, derive the mathematical conditions that make grouping possible (like `r <= q` in this problem).

3. **Work from optimal backward**: To minimize groups, find the largest possible group size that works, not just any valid group size. This often means checking possibilities from largest to smallest.

[Practice this problem on CodeJeet](/problem/minimum-number-of-groups-to-create-a-valid-assignment)
