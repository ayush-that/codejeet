---
title: "How to Solve Find Array Given Subset Sums — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Find Array Given Subset Sums. Hard difficulty, 49.5% acceptance rate. Topics: Array, Divide and Conquer."
date: "2026-07-11"
category: "dsa-patterns"
tags: ["find-array-given-subset-sums", "array", "divide-and-conquer", "hard"]
---

# How to Solve Find Array Given Subset Sums

You're given all subset sums of an unknown array of length `n`, and you need to recover the original array. This is tricky because you have `2ⁿ` sums in random order, and you need to deduce the `n` original numbers from them. The challenge lies in systematically reconstructing the array from this unordered collection of sums.

## Visual Walkthrough

Let's trace through a small example: `n = 3`, `sums = [0, 2, 3, 5, 2, 5, 7, 10]`. The unknown array is `[2, 3, 5]`.

**Step 1: Sort the sums**  
Sorted: `[0, 2, 2, 3, 5, 5, 7, 10]`

**Step 2: Find the smallest non-zero element**  
The smallest positive sum is `2`. This must be either the smallest positive number in our array or its negative counterpart. We'll try `2` as our first element.

**Step 3: Split sums into two groups**  
We separate sums that contain `2` from those that don't. The key insight: if we have a sum `x` that doesn't include `2`, then `x + 2` must be a sum that does include `2`.

From our sorted list:

- Without 2: `[0, 3, 5, 7]` (these sums don't include 2)
- With 2: `[2, 5, 7, 10]` (these sums include 2)

Notice that `[2, 5, 7, 10]` is exactly `[0, 3, 5, 7]` with 2 added to each element.

**Step 4: Recurse on the smaller group**  
Now we have `n = 2` and sums `[0, 3, 5, 7]`. The smallest positive is `3`, so our next element is `3`.

Split again:

- Without 3: `[0, 5]`
- With 3: `[3, 7]` (which is `[0, 5] + 3`)

**Step 5: Final element**  
Now `n = 1` with sums `[0, 5]`. The smallest positive is `5`, so our last element is `5`.

Result: `[2, 3, 5]`

## Brute Force Approach

A naive approach would try to guess the array by:

1. Generating all possible arrays of length `n` with reasonable bounds
2. Computing all subset sums for each candidate array
3. Comparing if the multiset of subset sums matches the input

The problem? The search space is enormous. Even with reasonable bounds, there are combinatorially many arrays to check. For `n = 15`, we'd have `2¹⁵ = 32,768` subset sums, and checking each candidate would require generating and comparing all these sums. This approach is exponential in `n` and completely impractical.

## Optimized Approach

The key insight comes from observing how subset sums relate to each other:

1. **Always sort the sums first** - The smallest sum is always 0 (empty subset)
2. **The smallest positive sum** is either the smallest positive number in our array or its negative
3. **Divide and conquer** - Once we identify an element `x`, we can split the sums into two groups: those that contain `x` and those that don't
4. **Recursive reconstruction** - The group without `x` contains all subset sums of the remaining `n-1` elements

The tricky part: `x` could be positive or negative. We need to try both possibilities and see which one allows us to continue the reconstruction. We can determine this by checking if for every sum `s` in the "without x" group, `s + x` exists in the "with x" group.

## Optimal Solution

Here's the complete solution using divide and conquer:

<div class="code-group">

```python
# Time: O(2^n * n) | Space: O(2^n)
def recoverArray(n, sums):
    """
    Recover the original array from all subset sums.

    Args:
        n: Length of the original array
        sums: List of all 2^n subset sums

    Returns:
        List of n integers representing the original array
    """
    # Sort sums to make processing easier
    sums.sort()

    def dfs(sums, n):
        """
        Recursively recover array from subset sums.

        Args:
            sums: Current list of subset sums
            n: Number of elements left to recover

        Returns:
            List of recovered elements
        """
        # Base case: if only one element left, it must be the only non-zero sum
        if n == 1:
            return [sums[1]] if sums[1] != 0 else [sums[-1]]

        # Find the smallest positive difference between sums
        # This will be our candidate for the next element
        x = sums[1] - sums[0]

        # Try both positive and negative possibilities
        # We need to check which one allows valid splitting
        for sign in [1, -1]:
            candidate = x * sign

            # Split sums into two groups: with and without candidate
            count = collections.Counter(sums)
            with_candidate = []
            without_candidate = []

            # Process sums in order to maintain consistency
            for s in sums:
                if count[s] == 0:
                    continue

                # If s doesn't contain candidate, then s + candidate must exist
                if count[s + candidate] == 0:
                    break

                # Move s to without_candidate group
                without_candidate.append(s)
                count[s] -= 1

                # Move s + candidate to with_candidate group
                with_candidate.append(s + candidate)
                count[s + candidate] -= 1
            else:
                # If we successfully processed all sums, recurse
                # The without_candidate group has sums for n-1 elements
                remaining = dfs(without_candidate, n - 1)
                if remaining is not None:
                    return [candidate] + remaining

        # If neither sign works, return None
        return None

    return dfs(sums, n)
```

```javascript
// Time: O(2^n * n) | Space: O(2^n)
/**
 * Recover the original array from all subset sums.
 *
 * @param {number} n - Length of the original array
 * @param {number[]} sums - Array of all 2^n subset sums
 * @return {number[]} - The original array of length n
 */
function recoverArray(n, sums) {
  // Sort sums to make processing easier
  sums.sort((a, b) => a - b);

  /**
   * Recursively recover array from subset sums.
   *
   * @param {number[]} sums - Current list of subset sums
   * @param {number} n - Number of elements left to recover
   * @return {number[]|null} - Recovered elements or null if impossible
   */
  function dfs(sums, n) {
    // Base case: if only one element left, it must be the only non-zero sum
    if (n === 1) {
      return sums[1] !== 0 ? [sums[1]] : [sums[sums.length - 1]];
    }

    // Find the smallest positive difference between sums
    // This will be our candidate for the next element
    const x = sums[1] - sums[0];

    // Try both positive and negative possibilities
    for (const sign of [1, -1]) {
      const candidate = x * sign;

      // Use a map to count occurrences of each sum
      const count = new Map();
      for (const s of sums) {
        count.set(s, (count.get(s) || 0) + 1);
      }

      const withCandidate = [];
      const withoutCandidate = [];
      let valid = true;

      // Process sums in order to maintain consistency
      for (const s of sums) {
        if ((count.get(s) || 0) === 0) {
          continue;
        }

        // If s doesn't contain candidate, then s + candidate must exist
        if ((count.get(s + candidate) || 0) === 0) {
          valid = false;
          break;
        }

        // Move s to withoutCandidate group
        withoutCandidate.push(s);
        count.set(s, count.get(s) - 1);

        // Move s + candidate to withCandidate group
        withCandidate.push(s + candidate);
        count.set(s + candidate, count.get(s + candidate) - 1);
      }

      if (valid) {
        // Recurse on the withoutCandidate group (has sums for n-1 elements)
        const remaining = dfs(withoutCandidate, n - 1);
        if (remaining !== null) {
          return [candidate, ...remaining];
        }
      }
    }

    // If neither sign works, return null
    return null;
  }

  return dfs(sums, n);
}
```

```java
// Time: O(2^n * n) | Space: O(2^n)
import java.util.*;

class Solution {
    /**
     * Recover the original array from all subset sums.
     *
     * @param n Length of the original array
     * @param sums Array of all 2^n subset sums
     * @return The original array of length n
     */
    public int[] recoverArray(int n, int[] sums) {
        // Sort sums to make processing easier
        Arrays.sort(sums);
        List<Integer> result = dfs(sums, n);
        return result.stream().mapToInt(i -> i).toArray();
    }

    /**
     * Recursively recover array from subset sums.
     *
     * @param sums Current list of subset sums
     * @param n Number of elements left to recover
     * @return List of recovered elements or null if impossible
     */
    private List<Integer> dfs(int[] sums, int n) {
        // Base case: if only one element left, it must be the only non-zero sum
        if (n == 1) {
            List<Integer> result = new ArrayList<>();
            result.add(sums[1] != 0 ? sums[1] : sums[sums.length - 1]);
            return result;
        }

        // Find the smallest positive difference between sums
        // This will be our candidate for the next element
        int x = sums[1] - sums[0];

        // Try both positive and negative possibilities
        for (int sign : new int[]{1, -1}) {
            int candidate = x * sign;

            // Use a map to count occurrences of each sum
            Map<Integer, Integer> count = new HashMap<>();
            for (int s : sums) {
                count.put(s, count.getOrDefault(s, 0) + 1);
            }

            List<Integer> withCandidate = new ArrayList<>();
            List<Integer> withoutCandidate = new ArrayList<>();
            boolean valid = true;

            // Process sums in order to maintain consistency
            for (int s : sums) {
                if (count.getOrDefault(s, 0) == 0) {
                    continue;
                }

                // If s doesn't contain candidate, then s + candidate must exist
                if (count.getOrDefault(s + candidate, 0) == 0) {
                    valid = false;
                    break;
                }

                // Move s to withoutCandidate group
                withoutCandidate.add(s);
                count.put(s, count.get(s) - 1);

                // Move s + candidate to withCandidate group
                withCandidate.add(s + candidate);
                count.put(s + candidate, count.get(s + candidate) - 1);
            }

            if (valid) {
                // Convert withoutCandidate list to array for recursion
                int[] remainingSums = new int[withoutCandidate.size()];
                for (int i = 0; i < withoutCandidate.size(); i++) {
                    remainingSums[i] = withoutCandidate.get(i);
                }

                // Recurse on the withoutCandidate group (has sums for n-1 elements)
                List<Integer> remaining = dfs(remainingSums, n - 1);
                if (remaining != null) {
                    List<Integer> result = new ArrayList<>();
                    result.add(candidate);
                    result.addAll(remaining);
                    return result;
                }
            }
        }

        // If neither sign works, return null
        return null;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(2ⁿ \* n)**

- We process `2ⁿ` sums at each level of recursion
- At each level, we iterate through all sums to split them into two groups
- We have `n` levels of recursion (reducing `n` by 1 each time)
- The total is roughly `2ⁿ + 2ⁿ⁻¹ + ... + 2¹ = O(2ⁿ * n)`

**Space Complexity: O(2ⁿ)**

- We need to store all `2ⁿ` sums at each recursive level
- The recursion depth is `n`, but we're not keeping all levels simultaneously in memory
- The dominant space usage is for storing and processing the sums arrays

## Common Mistakes

1. **Not handling both positive and negative candidates**: The smallest positive difference could correspond to either a positive or negative element in the original array. You must try both possibilities and see which one leads to a valid reconstruction.

2. **Forgetting to sort the sums first**: The algorithm relies on processing sums in sorted order to correctly identify the smallest positive difference and maintain consistency when splitting groups.

3. **Incorrect base case handling**: When `n = 1`, you need to handle the case where the only non-zero sum could be positive or negative. Some implementations fail when the array contains zeros.

4. **Not using a frequency counter**: When splitting sums into groups, you need to track which sums have already been used. A simple list removal approach is too slow (O(n²)). Using a frequency counter (like Counter in Python or Map in Java/JS) is essential for efficiency.

## When You'll See This Pattern

This divide-and-conquer approach appears in problems where you need to reconstruct data from aggregated information:

1. **Subsets / Subsets II**: While simpler, these problems deal with generating all subsets, which is the inverse of what we're doing here.

2. **Recover the Original Array**: Similar reconstruction problem where you need to deduce the original array from transformed versions.

3. **Guess the Word**: Interactive problems where you deduce hidden information through systematic elimination.

The core pattern is: when you can split a problem into independent subproblems based on some distinguishing feature (here, whether a sum contains a particular element), you can use divide and conquer.

## Key Takeaways

1. **Divide and conquer on subset inclusion**: When dealing with subset problems, consider whether you can split based on whether subsets include or exclude a particular element.

2. **Work from smallest to largest**: Sorting and processing the smallest elements first often simplifies reconstruction problems.

3. **Try both possibilities for ambiguous cases**: When you can't determine if an element is positive or negative from local information, systematically try both options and see which one leads to a consistent solution.

Related problems: [Subsets](/problem/subsets), [Subsets II](/problem/subsets-ii), [Recover the Original Array](/problem/recover-the-original-array)
