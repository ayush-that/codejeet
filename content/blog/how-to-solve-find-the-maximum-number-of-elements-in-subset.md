---
title: "How to Solve Find the Maximum Number of Elements in Subset — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find the Maximum Number of Elements in Subset. Medium difficulty, 26.8% acceptance rate. Topics: Array, Hash Table, Enumeration."
date: "2029-06-01"
category: "dsa-patterns"
tags:
  ["find-the-maximum-number-of-elements-in-subset", "array", "hash-table", "enumeration", "medium"]
---

# How to Solve "Find the Maximum Number of Elements in Subset"

This problem asks us to find the largest subset from a given array of positive integers that can be arranged in a specific symmetric pattern: `[x, x², x⁴, ..., x^(k/2), x^k, x^(k/2), ..., x⁴, x², x]`. The pattern is symmetric around the middle element `x^k`, with each element being the square of the previous one until we reach the center, then descending back down. What makes this problem tricky is recognizing that we're essentially looking for chains where each element is the square of the previous one, and these chains can be symmetric around a central element.

## Visual Walkthrough

Let's walk through an example: `nums = [2, 4, 16, 256, 3, 9, 81, 5, 25]`

The valid symmetric patterns we can form:

- For `x = 2`: `[2, 4, 16, 256, 16, 4, 2]` (if we have all these elements)
- For `x = 3`: `[3, 9, 81, 9, 3]`
- For `x = 5`: `[5, 25, 5]`

But we need to check what elements we actually have in our array. Let's trace through `x = 2`:

1. Start with `x = 2`
2. Check if `2² = 4` exists → yes
3. Check if `4² = 16` exists → yes
4. Check if `16² = 256` exists → yes
5. Check if `256² = 65536` exists → no, so we stop here

Now we have the ascending part: `[2, 4, 16, 256]`. For a symmetric pattern, we need the descending part too: `[256, 16, 4, 2]`. But wait - we already counted `256` as the center, so the descending part would be `[16, 4, 2]`. So the full symmetric pattern would be `[2, 4, 16, 256, 16, 4, 2]`.

However, we need to be careful: the problem allows the pattern to stop at any point, so we could have just `[2, 4, 2]` or `[2, 4, 16, 4, 2]` if we don't have all the elements.

The key insight: For each starting number `x`, we can build the longest possible symmetric chain by repeatedly squaring until we can't continue, then count how many elements we can include symmetrically.

## Brute Force Approach

A naive approach would be to try all possible subsets and check if they can be arranged in the required pattern. For each subset:

1. Sort it
2. Check if it follows the pattern `[x, x², x⁴, ..., x^k, ..., x⁴, x², x]`

The checking would involve:

- Finding if there's a middle element
- Verifying that for each element at position `i`, there's a corresponding element at position `n-i-1` that's either the same (for the middle) or the square root/square

This approach is extremely inefficient. With `n` elements, there are `2^n` possible subsets. For each subset of size `m`, checking the pattern would take `O(m log m)` for sorting plus `O(m)` for verification. Overall complexity would be `O(2^n * n log n)`, which is infeasible for any reasonable input size.

Even a slightly better brute force would be to try every possible `x` and build the longest chain:

```python
def brute_force(nums):
    max_len = 0
    for x in nums:
        current = x
        chain = []
        # Build ascending part
        while current in nums:
            chain.append(current)
            current = current * current
        # Try to build symmetric chain
        # ... complex logic to check symmetry
```

This is still inefficient because we might process the same elements multiple times, and checking for symmetry is nontrivial.

## Optimized Approach

The key insight is that we can think of this as finding symmetric chains in a directed graph where each number points to its square. For a valid symmetric pattern starting with `x`:

1. We need a chain: `x → x² → x⁴ → ... → x^k`
2. And then back down: `x^k → x^(k/2) → ... → x² → x`

But notice something important: if `x > 1`, then squaring repeatedly makes numbers grow very fast. In fact, since we're dealing with positive integers:

- If `x = 1`, then `1² = 1`, so the chain is just `[1, 1, 1, ...]`
- If `x > 1`, then the chain grows exponentially and will quickly exceed any reasonable bounds

This gives us a critical optimization: we only need to consider chains where the numbers don't exceed the maximum value in `nums` or some reasonable upper bound.

Here's the step-by-step reasoning:

1. Count the frequency of each number using a hash map
2. Handle `x = 1` separately (since `1² = 1`, the pattern is just repeated 1's)
3. For each `x > 1`:
   - If we've already processed this `x` (or a number in its chain), skip it
   - Build the chain by repeatedly squaring until we exceed bounds or don't find the next number
   - For a symmetric pattern, we need the chain to be palindromic: `[x, x², ..., middle, ..., x², x]`
   - The length of the symmetric pattern from this chain is `2 * chain_length - 1` (if we include the middle element once)

But wait, there's another subtlety: what if we have duplicates? For example, if we have `[2, 2, 4, 4, 16]`, we could use both 2's in our pattern. We need to handle counts carefully.

Actually, let's think about this more carefully. The pattern requires specific relationships between elements, not just any symmetric arrangement. The correct approach is:

1. Sort the array and use a hash map to count frequencies
2. For each unique number `x`:
   - If `x = 1`, handle specially (pattern is all 1's)
   - Otherwise, try to build the longest chain starting from `x`
   - For the chain to be symmetric, we need to be able to pair elements: for each `y` in the ascending part (except the middle), we need another `y` for the descending part
   - The maximum symmetric chain we can build is limited by the minimum count along the chain

## Optimal Solution

The optimal solution uses a frequency counter and carefully builds chains while handling duplicates correctly. We process numbers in sorted order to avoid redundant work.

<div class="code-group">

```python
# Time: O(n log n + n * log M) where M is max(nums), Space: O(n)
def maximumLength(nums):
    """
    Find the maximum length of a subset that can be arranged in the pattern:
    [x, x^2, x^4, ..., x^(k/2), x^k, x^(k/2), ..., x^4, x^2, x]
    """
    from collections import Counter

    # Count frequencies of each number
    freq = Counter(nums)

    # Get unique numbers and sort them
    unique_nums = sorted(freq.keys())

    max_len = 0

    # Handle 1 separately since 1^2 = 1
    if 1 in freq:
        # For 1, the pattern is [1, 1, 1, ..., 1] - all 1's
        # The length is just the count of 1's
        # But if count is even, we need odd length for symmetry, so use count if odd, else count-1
        count_1 = freq[1]
        if count_1 % 2 == 1:
            max_len = max(max_len, count_1)
        else:
            max_len = max(max_len, count_1 - 1)
        # Also consider that 1 alone is valid
        if max_len == 0:
            max_len = 1

    # Process other numbers
    for x in unique_nums:
        if x == 1:
            continue

        current_len = 0
        current = x

        # We need at least one of current to start the pattern
        if freq[current] == 0:
            continue

        # Build the chain while we can
        while current in freq and freq[current] > 0:
            # For a valid symmetric pattern, we need:
            # - At least 1 of current for the ascending part
            # - If this is not the middle element, we need another for descending part

            count = freq[current]

            if count >= 2:
                # We have at least 2, can use one for ascending, one for descending
                current_len += 2
                # Move to next in chain
                current = current * current
            elif count == 1:
                # Only one, can only be the middle element
                current_len += 1
                break
            else:
                # No more of this number
                break

        # Update max length
        max_len = max(max_len, current_len)

    return max_len
```

```javascript
// Time: O(n log n + n * log M) where M is max(nums), Space: O(n)
function maximumLength(nums) {
  /**
   * Find the maximum length of a subset that can be arranged in the pattern:
   * [x, x^2, x^4, ..., x^(k/2), x^k, x^(k/2), ..., x^4, x^2, x]
   */

  // Count frequencies of each number
  const freq = new Map();
  for (const num of nums) {
    freq.set(num, (freq.get(num) || 0) + 1);
  }

  // Get unique numbers and sort them
  const uniqueNums = Array.from(freq.keys()).sort((a, b) => a - b);

  let maxLen = 0;

  // Handle 1 separately since 1^2 = 1
  if (freq.has(1)) {
    const count1 = freq.get(1);
    // For 1, the pattern is all 1's
    // Need odd length for symmetry
    if (count1 % 2 === 1) {
      maxLen = Math.max(maxLen, count1);
    } else {
      maxLen = Math.max(maxLen, count1 - 1);
    }
    // Also consider that 1 alone is valid
    if (maxLen === 0) {
      maxLen = 1;
    }
  }

  // Process other numbers
  for (const x of uniqueNums) {
    if (x === 1) continue;

    let currentLen = 0;
    let current = x;

    // We need at least one of current to start
    if (!freq.has(current) || freq.get(current) === 0) {
      continue;
    }

    // Build the chain
    while (freq.has(current) && freq.get(current) > 0) {
      const count = freq.get(current);

      if (count >= 2) {
        // Can use one for ascending, one for descending
        currentLen += 2;
        // Move to next in chain
        current = current * current;
      } else if (count === 1) {
        // Only one, can only be middle element
        currentLen += 1;
        break;
      } else {
        break;
      }
    }

    maxLen = Math.max(maxLen, currentLen);
  }

  return maxLen;
}
```

```java
// Time: O(n log n + n * log M) where M is max(nums), Space: O(n)
import java.util.*;

class Solution {
    public int maximumLength(int[] nums) {
        /**
         * Find the maximum length of a subset that can be arranged in the pattern:
         * [x, x^2, x^4, ..., x^(k/2), x^k, x^(k/2), ..., x^4, x^2, x]
         */

        // Count frequencies
        Map<Integer, Integer> freq = new HashMap<>();
        for (int num : nums) {
            freq.put(num, freq.getOrDefault(num, 0) + 1);
        }

        // Get unique numbers and sort them
        List<Integer> uniqueNums = new ArrayList<>(freq.keySet());
        Collections.sort(uniqueNums);

        int maxLen = 0;

        // Handle 1 separately
        if (freq.containsKey(1)) {
            int count1 = freq.get(1);
            // For 1, pattern is all 1's, need odd length for symmetry
            if (count1 % 2 == 1) {
                maxLen = Math.max(maxLen, count1);
            } else {
                maxLen = Math.max(maxLen, count1 - 1);
            }
            // 1 alone is valid
            if (maxLen == 0) {
                maxLen = 1;
            }
        }

        // Process other numbers
        for (int x : uniqueNums) {
            if (x == 1) continue;

            int currentLen = 0;
            long current = x; // Use long to avoid overflow

            // Need at least one to start
            if (!freq.containsKey((int)current) || freq.get((int)current) == 0) {
                continue;
            }

            // Build the chain
            while (freq.containsKey((int)current) && freq.get((int)current) > 0) {
                int count = freq.get((int)current);

                if (count >= 2) {
                    // Can use for both ascending and descending
                    currentLen += 2;
                    // Move to next in chain
                    if (current > Integer.MAX_VALUE / current) {
                        // Would overflow, break
                        break;
                    }
                    current = current * current;
                } else if (count == 1) {
                    // Only one, can only be middle
                    currentLen += 1;
                    break;
                } else {
                    break;
                }
            }

            maxLen = Math.max(maxLen, currentLen);
        }

        return maxLen;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** `O(n log n + n * log M)` where:

- `n` is the length of the input array
- `M` is the maximum value in the array
- `n log n` comes from sorting the unique numbers
- `n * log M` comes from building chains: for each starting number, we square it repeatedly. Since numbers grow exponentially (squaring each time), the chain length is `O(log log M)` in theory, but more precisely, the number of squaring operations until we exceed `M` is `O(log log M)`. In practice, with the constraints, this is very small.

**Space Complexity:** `O(n)` for storing the frequency map and unique numbers.

The key insight that makes this efficient is that chains grow extremely fast due to squaring, so we don't need to worry about long chains. Even starting from 2: `2 → 4 → 16 → 256 → 65536 → ...` quickly exceeds typical constraints.

## Common Mistakes

1. **Not handling 1 separately**: Since `1² = 1`, the pattern for 1 is special - it's just repeating 1's. Many candidates try to apply the same squaring logic to 1 and get stuck in infinite loops or incorrect results.

2. **Forgetting about duplicates**: The problem doesn't say all numbers are unique. Candidates might assume uniqueness and miss cases where having multiple copies of a number allows longer chains. For example, `[2, 2, 4, 4, 16]` can form a longer chain than `[2, 4, 16]`.

3. **Integer overflow**: When repeatedly squaring, numbers can quickly exceed 32-bit integer limits. Candidates need to use 64-bit integers or check for overflow before squaring.

4. **Incorrect symmetry handling**: The pattern requires symmetry around the middle. Some candidates build chains but forget that elements (except the middle) need to appear twice - once in the ascending part and once in the descending part.

5. **Not considering all starting points**: Some candidates only try numbers that are perfect squares or have square roots in the array, but any number can be the start of a chain if its square is in the array.

## When You'll See This Pattern

This problem uses several patterns common in coding interviews:

1. **Frequency counting with hash maps**: Like in "Two Sum" or "Longest Consecutive Sequence", we use a hash map to count occurrences for O(1) lookups.

2. **Chain/traversal in implicit graphs**: The relationship `x → x²` defines an implicit directed graph. Similar patterns appear in:
   - "Happy Number" (following a sequence defined by a rule)
   - "Linked List Cycle" (traversal until repetition)
   - "Longest Consecutive Sequence" (finding chains of consecutive numbers)

3. **Symmetry/palindrome problems**: While not a typical palindrome problem, it shares the symmetry constraint with problems like:
   - "Longest Palindromic Substring"
   - "Palindrome Linked List"

4. **Exponential growth awareness**: Problems where values grow quickly (like squaring) often have efficient solutions because chains are short. Similar to problems involving powers of two or geometric progressions.

## Key Takeaways

1. **When values grow exponentially, chains are short**: This is a critical insight for optimization. If each step multiplies the value significantly, you don't need to worry about long sequences.

2. **Handle special cases first**: Always check for edge cases like 0, 1, or negative numbers (though here we only have positives). These often break the general pattern.

3. **Frequency matters for symmetry problems**: When building symmetric structures, you often need pairs of elements. Counting frequencies helps determine how many complete pairs you can form.

4. **Sorting can help avoid redundant work**: By processing numbers in sorted order and marking visited elements, you ensure each chain is built only once.

Related problems: [Longest Consecutive Sequence](/problem/longest-consecutive-sequence)
