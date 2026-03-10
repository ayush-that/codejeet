---
title: "How to Solve Array of Doubled Pairs — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Array of Doubled Pairs. Medium difficulty, 39.7% acceptance rate. Topics: Array, Hash Table, Greedy, Sorting."
date: "2027-05-23"
category: "dsa-patterns"
tags: ["array-of-doubled-pairs", "array", "hash-table", "greedy", "medium"]
---

# How to Solve Array of Doubled Pairs

This problem asks whether we can reorder an array so that it forms valid pairs where the second element is exactly double the first. The challenge comes from handling negative numbers (where doubling flips magnitude ordering), zeros (where 0 = 2×0 creates special cases), and efficiently matching pairs without exhaustive searching.

## Visual Walkthrough

Let's trace through `arr = [4, -2, 2, -4, 8, 16]`:

1. **Sort the array**: `[-4, -2, 2, 4, 8, 16]`
   - Sorting helps us process numbers in increasing order, making pair matching systematic

2. **Process -4 first**:
   - We need to find its partner: `2 × (-4) = -8`
   - But -8 doesn't exist in our array, so this arrangement is impossible

Wait, that's wrong! Let me reconsider. Actually, for negative numbers, the pairing works differently because `-4` should be paired with `-2` (since `-4 × 2 = -8`, but that's not what we want). Let me think about the actual requirement...

Actually, I need to be careful. The problem says `arr[2*i+1] = 2 × arr[2*i]`. So if we have `-4`, we need `-8` as its partner. But we don't have `-8`. However, what if `-4` is the _second_ element in a pair? Then we'd need `-2` as the first element (since `-4 = 2 × (-2)`).

This reveals the key insight: **We should always try to match the smallest available number with its double**. Let's try again:

**Sorted array**: `[-4, -2, 2, 4, 8, 16]`

1. Start with `-4` (smallest):
   - Can `-4` be a first element? It would need `-8` as partner (2 × -4 = -8), but we don't have `-8`
   - Can `-4` be a second element? Then we need `-2` as first element (since -4 = 2 × -2)
   - We DO have `-2`! So pair `(-2, -4)`

2. Remove `-2` and `-4`, remaining: `[2, 4, 8, 16]`

3. Next smallest is `2`:
   - As first element, needs `4` as partner (2 × 2 = 4)
   - We have `4`! Pair `(2, 4)`

4. Remove `2` and `4`, remaining: `[8, 16]`

5. Next smallest is `8`:
   - As first element, needs `16` as partner (2 × 8 = 16)
   - We have `16`! Pair `(8, 16)`

All elements paired successfully! The reordering could be: `[-2, -4, 2, 4, 8, 16]`

## Brute Force Approach

A brute force approach would try all possible permutations of the array and check each arrangement:

1. Generate all permutations of the array
2. For each permutation, check if `arr[2*i+1] = 2 × arr[2*i]` for all `i`
3. Return `true` if any permutation satisfies the condition

The problem? With `n` elements, there are `n!` permutations. For even moderate `n` (like 20), that's over 2.4 quadrillion permutations to check! This is clearly infeasible.

Even a smarter brute force that tries to build pairs recursively would still be exponential in the worst case, as we'd need to try all possible pairings.

## Optimized Approach

The key insight is that we should **always match the smallest available number with its double**. Here's why:

1. **Sorting gives us order**: By sorting, we process numbers from smallest to largest
2. **Smallest number must be a "first element"**: If the smallest number `x` were a second element, we'd need `x/2` as its partner. But `x/2` would be smaller than `x` (for positive numbers), contradicting that `x` is the smallest
3. **Handle negatives separately**: For negative numbers, the relationship flips: `-4` is smaller than `-2`, but `-4 = 2 × (-2)`. So when we sort, negative numbers are in increasing order (`-4, -2`), but for pairing we need to match `-4` with `-2`
4. **Use a frequency map**: Since we need to efficiently find and remove elements, we use a hash map to track counts

The algorithm:

1. Count frequencies of all numbers
2. Sort unique numbers by absolute value (or handle negatives specially)
3. For each number in sorted order:
   - If current number's count > 0:
     - Check if we have enough of `2 × current` to pair with all instances of current
     - If not, return `false`
     - If yes, reduce counts of both numbers

Special cases:

- **Zero**: `0 = 2 × 0`, so zeros must pair with other zeros. We need an even number of zeros
- **Negative numbers**: When sorted by absolute value, `-2` comes before `-4`, but `-4` needs `-2` as partner. So we need to be careful about traversal order

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) for sorting | Space: O(n) for frequency map
def canReorderDoubled(arr):
    """
    Check if array can be reordered into pairs (x, 2x)
    """
    from collections import Counter

    # Count frequency of each number
    count = Counter(arr)

    # Sort unique numbers by absolute value
    # This ensures we process numbers in order where smaller magnitudes come first
    # For positives: 1, 2, 4, 8...
    # For negatives: -1, -2, -4, -8... (but we need -2 to pair with -4, so we'll handle carefully)
    sorted_keys = sorted(count.keys(), key=lambda x: abs(x))

    for num in sorted_keys:
        # If we've already used all instances of this number, skip
        if count[num] == 0:
            continue

        # Special case: zero
        if num == 0:
            # Zeros must pair with zeros: 0 = 2 * 0
            # So we need an even number of zeros
            if count[0] % 2 != 0:
                return False
            # All zeros can be paired together
            count[0] = 0
            continue

        # For non-zero numbers:
        # If num is positive, we need 2*num as partner
        # If num is negative, we need num/2 as partner? Wait, let's think...
        # Actually, for negative numbers sorted by absolute value: -2, -4
        # -4 needs -2 as partner (since -4 = 2 * -2)
        # So when we process -2, we need to check if we have -4
        # But when we process -4, we've already paired it with -2

        # The key: we always try to use current number as the smaller in the pair
        # So we need to find target = 2 * num
        target = num * 2

        # Check if we have enough target numbers to pair with current numbers
        if count[num] > count.get(target, 0):
            return False

        # Pair current numbers with target numbers
        count[target] -= count[num]
        count[num] = 0

    return True
```

```javascript
// Time: O(n log n) for sorting | Space: O(n) for frequency map
function canReorderDoubled(arr) {
  // Count frequency of each number
  const count = new Map();
  for (const num of arr) {
    count.set(num, (count.get(num) || 0) + 1);
  }

  // Sort unique numbers by absolute value
  // This handles the ordering for both positive and negative numbers
  const sortedKeys = Array.from(count.keys()).sort((a, b) => Math.abs(a) - Math.abs(b));

  for (const num of sortedKeys) {
    // Skip if we've already used all instances of this number
    if (count.get(num) === 0) continue;

    // Handle zero case: zeros must pair with zeros
    if (num === 0) {
      // Need an even number of zeros
      if (count.get(0) % 2 !== 0) return false;
      count.set(0, 0);
      continue;
    }

    // For non-zero numbers, find the target (2 * num)
    const target = num * 2;

    // Check if we have enough target numbers
    if (count.get(num) > (count.get(target) || 0)) {
      return false;
    }

    // Pair current numbers with target numbers
    count.set(target, (count.get(target) || 0) - count.get(num));
    count.set(num, 0);
  }

  return true;
}
```

```java
// Time: O(n log n) for sorting | Space: O(n) for frequency map
import java.util.*;

class Solution {
    public boolean canReorderDoubled(int[] arr) {
        // Count frequency of each number
        Map<Integer, Integer> count = new HashMap<>();
        for (int num : arr) {
            count.put(num, count.getOrDefault(num, 0) + 1);
        }

        // Sort unique numbers by absolute value
        List<Integer> sortedKeys = new ArrayList<>(count.keySet());
        Collections.sort(sortedKeys, (a, b) -> Integer.compare(Math.abs(a), Math.abs(b)));

        for (int num : sortedKeys) {
            // Skip if we've already used all instances of this number
            if (count.get(num) == 0) continue;

            // Handle zero case: zeros must pair with zeros
            if (num == 0) {
                // Need an even number of zeros
                if (count.get(0) % 2 != 0) return false;
                count.put(0, 0);
                continue;
            }

            // For non-zero numbers, find the target (2 * num)
            int target = num * 2;

            // Check if we have enough target numbers
            if (count.get(num) > count.getOrDefault(target, 0)) {
                return false;
            }

            // Pair current numbers with target numbers
            count.put(target, count.getOrDefault(target, 0) - count.get(num));
            count.put(num, 0);
        }

        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Building the frequency map: O(n)
- Sorting the unique keys: O(k log k) where k ≤ n (number of distinct values)
- In worst case (all numbers distinct), k = n, so O(n log n)
- Processing each key: O(k) = O(n)

**Space Complexity: O(n)**

- Frequency map stores up to n entries (if all numbers distinct)
- Sorted keys array: O(k) ≤ O(n)
- No recursion, so constant call stack space

## Common Mistakes

1. **Not handling negative numbers correctly**: The most common error is treating negative numbers the same as positives. Remember: for negative numbers sorted by absolute value, `-2` comes before `-4`, but `-4` needs `-2` as partner. Sorting by absolute value solves this.

2. **Forgetting the zero case**: Zero is special because `0 = 2 × 0`. Candidates often miss that zeros can only pair with other zeros, not with any other number. You need to check if the count of zeros is even.

3. **Not checking if target exists in map**: When looking for `target = 2 × num`, you must use `.getOrDefault(target, 0)` or similar. If `target` doesn't exist in the map, its count is 0, not "undefined" or causing an error.

4. **Processing numbers in wrong order**: If you process numbers in simple sorted order (not by absolute value), you'll fail on mixed positive/negative arrays like `[-2, -4, 2, 4]`. The absolute value sorting ensures we always match the smallest magnitude first.

## When You'll See This Pattern

This "frequency map + greedy pairing" pattern appears in several problems:

1. **Find Original Array From Doubled Array (LeetCode 2007)**: Almost identical! Given a doubled array, find the original. Uses the same frequency map + sorted processing approach.

2. **Divide Array in Sets of K Consecutive Numbers (LeetCode 1296)**: Instead of matching `(x, 2x)`, you match consecutive sequences of length K. Same pattern: frequency map + process smallest available number first.

3. **Hand of Straights (LeetCode 846)**: Similar to above but with the terminology of poker hands. Again, frequency map + greedy matching from smallest card.

The core pattern: When you need to form structured groups from a collection, and the grouping has some ordering constraint, use a frequency map and process elements in sorted order.

## Key Takeaways

1. **Frequency maps are powerful for "can we form groups" problems**: When you need to match or group elements, a count of each value lets you efficiently check availability without modifying the original array.

2. **Sorting by the right key matters**: For this problem, absolute value sorting handles the negative number complication. Always think about what ordering makes the greedy approach work.

3. **Greedy works when smallest elements constrain choices**: If the smallest available element must be used in a specific way (as the smaller element in a pair), a greedy approach that always uses the smallest element first is often optimal.

Related problems: [Find Original Array From Doubled Array](/problem/find-original-array-from-doubled-array)
