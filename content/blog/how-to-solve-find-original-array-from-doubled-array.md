---
title: "How to Solve Find Original Array From Doubled Array — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find Original Array From Doubled Array. Medium difficulty, 40.7% acceptance rate. Topics: Array, Hash Table, Greedy, Sorting."
date: "2026-08-26"
category: "dsa-patterns"
tags: ["find-original-array-from-doubled-array", "array", "hash-table", "greedy", "medium"]
---

# How to Solve Find Original Array From Doubled Array

You're given a shuffled array where each element from the original array appears alongside its doubled value. Your task is to recover the original array from this mixed collection. The tricky part is that you need to pair each number with its double correctly while handling duplicates, negative numbers, and zeros—all in an efficient way.

## Visual Walkthrough

Let's trace through a concrete example: `changed = [1, 3, 4, 2, 6, 8]`

**Step 1: Sort the array**
Sorted: `[1, 2, 3, 4, 6, 8]`

**Step 2: Process smallest numbers first**

- Start with 1: Look for its double (2). Found 2, so `original = [1]`, remove both 1 and 2.
- Remaining: `[3, 4, 6, 8]`
- Next smallest is 3: Look for its double (6). Found 6, so `original = [1, 3]`, remove both 3 and 6.
- Remaining: `[4, 8]`
- Next smallest is 4: Look for its double (8). Found 8, so `original = [1, 3, 4]`, remove both 4 and 8.

**Step 3: Check if we processed all elements**
All elements are paired, so `[1, 3, 4]` is the original array.

Why process smallest numbers first? Because if we start with larger numbers, we might incorrectly pair them. For example, if we started with 8, we'd look for 16 (not present) and fail, even though a valid solution exists.

## Brute Force Approach

A naive approach would be to try all possible pairings. For each element, we could search for its double among the remaining elements, pair them, and continue recursively. This would involve:

1. Generate all permutations of pairings
2. For each permutation, check if it forms valid (x, 2x) pairs
3. Return the first valid set of x values

The problem with this approach is the combinatorial explosion. With n elements, there are n! possible orderings to check, making it O(n!) time complexity—completely impractical for arrays of any reasonable size.

Even a slightly better brute force would be O(n²) by scanning for each element's double, but this fails with duplicates. For `[2, 2, 4, 4]`, we need to pair the first 2 with the first 4, not with any 4.

## Optimized Approach

The key insight is that we should **process numbers in sorted order** and use a **frequency counter** to track available elements. Here's why this works:

1. **Sorting ensures we process smaller numbers first**, preventing the "greedy mistake" of incorrectly pairing larger numbers.
2. **Frequency counting (hash map)** allows O(1) lookups for doubles while handling duplicates correctly.
3. **Special handling for negative numbers**: When numbers are negative, their doubles are smaller (e.g., -4's double is -8, which is less than -4). So we need to process negative numbers in reverse order (largest to smallest).

The algorithm:

1. If the array length is odd, immediately return empty array (can't have pairs)
2. Count frequencies of all numbers
3. Sort the unique keys (handle negative numbers specially)
4. For each number in sorted order:
   - If current number's count is 0, skip (already paired)
   - Check if double exists with sufficient count
   - If yes, add current number to result and decrement counts
   - If no, return empty array (invalid input)

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) for sorting | Space: O(n) for frequency map
def findOriginalArray(changed):
    # If length is odd, it can't be a doubled array
    if len(changed) % 2 != 0:
        return []

    # Count frequency of each number
    freq = {}
    for num in changed:
        freq[num] = freq.get(num, 0) + 1

    # Sort the unique numbers
    # We need to handle negative numbers specially because for negatives,
    # the "double" is actually smaller (e.g., -4's double is -8)
    sorted_nums = sorted(freq.keys())

    original = []

    # Process numbers in sorted order
    for num in sorted_nums:
        # If we've already used all occurrences of this number, skip
        if freq[num] == 0:
            continue

        # Special case: zero (0 * 2 = 0)
        if num == 0:
            # Zeros must come in pairs (each zero pairs with another zero)
            if freq[num] % 2 != 0:
                return []
            # Add half of the zeros to original
            original.extend([0] * (freq[num] // 2))
            freq[num] = 0
            continue

        # For non-zero numbers, check if double exists
        double = num * 2

        # If double doesn't exist or doesn't have enough count
        if double not in freq or freq[double] < freq[num]:
            return []

        # Add current number to original array (once for each pair)
        original.extend([num] * freq[num])

        # Reduce counts: all current numbers are paired with their doubles
        freq[double] -= freq[num]
        freq[num] = 0

    return original
```

```javascript
// Time: O(n log n) for sorting | Space: O(n) for frequency map
function findOriginalArray(changed) {
  // If length is odd, it can't be a doubled array
  if (changed.length % 2 !== 0) {
    return [];
  }

  // Count frequency of each number
  const freq = new Map();
  for (const num of changed) {
    freq.set(num, (freq.get(num) || 0) + 1);
  }

  // Sort the unique numbers
  // Handle negative numbers by sorting by absolute value first, then by sign
  const sortedNums = Array.from(freq.keys()).sort((a, b) => a - b);

  const original = [];

  // Process numbers in sorted order
  for (const num of sortedNums) {
    // If we've already used all occurrences of this number, skip
    if (freq.get(num) === 0) {
      continue;
    }

    // Special case: zero (0 * 2 = 0)
    if (num === 0) {
      // Zeros must come in pairs (each zero pairs with another zero)
      if (freq.get(num) % 2 !== 0) {
        return [];
      }
      // Add half of the zeros to original
      for (let i = 0; i < freq.get(num) / 2; i++) {
        original.push(0);
      }
      freq.set(num, 0);
      continue;
    }

    // For non-zero numbers, check if double exists
    const double = num * 2;

    // If double doesn't exist or doesn't have enough count
    if (!freq.has(double) || freq.get(double) < freq.get(num)) {
      return [];
    }

    // Add current number to original array (once for each pair)
    for (let i = 0; i < freq.get(num); i++) {
      original.push(num);
    }

    // Reduce counts: all current numbers are paired with their doubles
    freq.set(double, freq.get(double) - freq.get(num));
    freq.set(num, 0);
  }

  return original;
}
```

```java
// Time: O(n log n) for sorting | Space: O(n) for frequency map
import java.util.*;

class Solution {
    public int[] findOriginalArray(int[] changed) {
        // If length is odd, it can't be a doubled array
        if (changed.length % 2 != 0) {
            return new int[0];
        }

        // Count frequency of each number
        Map<Integer, Integer> freq = new HashMap<>();
        for (int num : changed) {
            freq.put(num, freq.getOrDefault(num, 0) + 1);
        }

        // Sort the unique numbers
        List<Integer> sortedNums = new ArrayList<>(freq.keySet());
        Collections.sort(sortedNums);

        List<Integer> originalList = new ArrayList<>();

        // Process numbers in sorted order
        for (int num : sortedNums) {
            // If we've already used all occurrences of this number, skip
            if (freq.get(num) == 0) {
                continue;
            }

            // Special case: zero (0 * 2 = 0)
            if (num == 0) {
                // Zeros must come in pairs (each zero pairs with another zero)
                if (freq.get(num) % 2 != 0) {
                    return new int[0];
                }
                // Add half of the zeros to original
                for (int i = 0; i < freq.get(num) / 2; i++) {
                    originalList.add(0);
                }
                freq.put(num, 0);
                continue;
            }

            // For non-zero numbers, check if double exists
            int doubleNum = num * 2;

            // If double doesn't exist or doesn't have enough count
            if (!freq.containsKey(doubleNum) || freq.get(doubleNum) < freq.get(num)) {
                return new int[0];
            }

            // Add current number to original array (once for each pair)
            for (int i = 0; i < freq.get(num); i++) {
                originalList.add(num);
            }

            // Reduce counts: all current numbers are paired with their doubles
            freq.put(doubleNum, freq.get(doubleNum) - freq.get(num));
            freq.put(num, 0);
        }

        // Convert List to array
        int[] original = new int[originalList.size()];
        for (int i = 0; i < originalList.size(); i++) {
            original[i] = originalList.get(i);
        }

        return original;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Building the frequency map: O(n)
- Sorting the unique keys: O(k log k) where k ≤ n (number of unique elements)
- In worst case (all elements unique), k = n, so O(n log n)
- Processing each element: O(n)

**Space Complexity: O(n)**

- Frequency map stores up to n entries
- Result array stores n/2 elements
- Sorting may use O(log n) to O(n) additional space depending on implementation

The dominant factor is sorting, making this an O(n log n) solution.

## Common Mistakes

1. **Not handling negative numbers correctly**: For negative numbers, the "double" is actually smaller (e.g., -4's double is -8). If you always process from smallest to largest, you'll fail for negatives. Solution: Sort normally (Python/JS/Java sort already handle this correctly by value).

2. **Forgetting the zero edge case**: Zero is its own double (0 × 2 = 0). This means zeros must come in pairs. Many candidates check if zero's double exists but forget that zeros pair with other zeros, not with themselves in a 1:1 ratio.

3. **Not checking frequency counts properly**: With duplicates like `[2, 2, 4, 4]`, you need to ensure there are enough doubles for all occurrences. Simply checking if the double exists isn't enough—you must check if `freq[double] >= freq[num]`.

4. **Not returning early for odd-length arrays**: If the array has odd length, it's immediately invalid since each original element needs a double partner. Check this first to save computation.

## When You'll See This Pattern

This "pair matching with transformation" pattern appears in several LeetCode problems:

1. **Array of Doubled Pairs (Medium)**: Almost identical problem—check if an array can be rearranged so each element is half of another. The same frequency map + sorted processing approach works.

2. **Divide Array in Sets of K Consecutive Numbers (Medium)**: Instead of pairing (x, 2x), you group consecutive numbers. The pattern of frequency counting + processing smallest first is similar.

3. **Hand of Straights (Medium)**: Same as above but with the specific name for the card game variant.

4. **Recover the Original Array (Hard)**: A more complex version where you need to find both the original array and the transformation parameter k.

The core pattern: When you need to match elements based on some relationship (double, consecutive, etc.), use frequency counting + sorted processing to ensure you always make safe choices.

## Key Takeaways

1. **Frequency maps + sorting** solve many "matching" problems: When elements need to be paired or grouped based on some relationship, count frequencies first, then process in a deterministic order.

2. **Process from smallest to largest for greedy matching**: This ensures you don't "steal" elements needed for smaller numbers. For negative numbers, standard numerical sorting handles this correctly.

3. **Edge cases matter**: Zero (self-double), negative numbers (double is smaller), and duplicates (need sufficient counts) are what separate working solutions from broken ones.

Related problems: [Array of Doubled Pairs](/problem/array-of-doubled-pairs), [Recover the Original Array](/problem/recover-the-original-array)
