---
title: "How to Solve Find Maximum Removals From Source String — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find Maximum Removals From Source String. Medium difficulty, 39.2% acceptance rate. Topics: Array, Hash Table, Two Pointers, String, Dynamic Programming."
date: "2026-04-12"
category: "dsa-patterns"
tags: ["find-maximum-removals-from-source-string", "array", "hash-table", "two-pointers", "medium"]
---

# How to Solve Find Maximum Removals From Source String

You're given a source string, a pattern string that's a subsequence of source, and a sorted list of indices you can remove from source. Your task is to find the maximum number of removals you can perform while keeping the pattern as a subsequence of the remaining string. What makes this problem interesting is that you need to efficiently check whether removing certain indices breaks the subsequence property, and the sorted indices allow for binary search optimization.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:**

- source = "abca"
- pattern = "ab"
- targetIndices = [0, 1, 3]

**Step-by-step reasoning:**

1. **Initial state:** source = "abca", pattern = "ab"
   - Pattern "ab" is a subsequence: 'a' at index 0, 'b' at index 1

2. **Try removing 1 index (k=1):** Remove index 0
   - Remaining source = "bca"
   - Can we find "ab" as subsequence?
     - Look for 'a': find 'a' at index 2
     - Look for 'b' after index 2: no 'b' found
   - ❌ Pattern not found

3. **Try removing 1 index (k=1):** Remove index 1
   - Remaining source = "aca"
   - Can we find "ab" as subsequence?
     - Look for 'a': find 'a' at index 0
     - Look for 'b' after index 0: no 'b' found
   - ❌ Pattern not found

4. **Try removing 1 index (k=1):** Remove index 3
   - Remaining source = "abc"
   - Can we find "ab" as subsequence?
     - Look for 'a': find 'a' at index 0
     - Look for 'b' after index 0: find 'b' at index 1
   - ✅ Pattern found!

5. **Try removing 2 indices (k=2):** Remove indices [0, 1]
   - Remaining source = "ca"
   - Can we find "ab" as subsequence?
     - Look for 'a': find 'a' at index 1
     - Look for 'b' after index 1: no 'b' found
   - ❌ Pattern not found

6. **Try removing 2 indices (k=2):** Remove indices [0, 3]
   - Remaining source = "bc"
   - Can we find "ab" as subsequence?
     - Look for 'a': no 'a' found
   - ❌ Pattern not found

7. **Try removing 2 indices (k=2):** Remove indices [1, 3]
   - Remaining source = "ac"
   - Can we find "ab" as subsequence?
     - Look for 'a': find 'a' at index 0
     - Look for 'b' after index 0: no 'b' found
   - ❌ Pattern not found

**Maximum removals:** 1 (only index 3 can be removed)

The key insight: We need to find the largest k such that removing the first k indices from targetIndices doesn't break the subsequence property.

## Brute Force Approach

A naive approach would be to try all possible k values from 0 up to the length of targetIndices. For each k, we would:

1. Create a set of the first k indices to remove
2. Build a new string by filtering out characters at those indices
3. Check if pattern is a subsequence of the filtered string

The subsequence check would use two pointers: one for the pattern and one for the filtered string, advancing through both to see if all pattern characters can be found in order.

**Why this is inefficient:**

- For each k, we're rebuilding the string: O(n) time
- Checking subsequence: O(n + m) time where n is source length, m is pattern length
- Trying all k values: O(k) iterations
- **Total:** O(k × n) which is too slow for large inputs (k and n up to 10^5)

## Optimized Approach

The key optimization is using **binary search** on k. Since targetIndices is sorted and we're looking for the maximum k where the pattern remains a subsequence, we can binary search between 0 and len(targetIndices).

**Why binary search works:**

- If pattern is a subsequence after removing k indices, it will also be a subsequence after removing fewer than k indices (removing fewer characters can't break a subsequence that already exists)
- This monotonic property (True for small k, False for large k) allows binary search

**Efficient subsequence check:**
Instead of rebuilding the string for each k, we can:

1. Create a boolean array `removed` marking which indices are removed for the current k
2. Use two pointers to traverse source and pattern simultaneously
3. Skip characters at removed indices when checking the subsequence

**Step-by-step reasoning:**

1. Binary search over k from 0 to len(targetIndices)
2. For each mid value k:
   - Mark the first k indices from targetIndices as removed
   - Check if pattern is subsequence of source ignoring removed indices
3. If pattern is subsequence, try larger k (move left = mid + 1)
4. If pattern is not subsequence, try smaller k (move right = mid - 1)

## Optimal Solution

<div class="code-group">

```python
# Time: O((n + m) * log k) where n = len(source), m = len(pattern), k = len(targetIndices)
# Space: O(n) for the removed array
def maximumRemovals(source: str, pattern: str, targetIndices: list[int]) -> int:
    n = len(source)
    m = len(pattern)

    # Helper function to check if pattern is subsequence after removing first k indices
    def can_remove_k(k: int) -> bool:
        # Create a boolean array to mark removed indices
        removed = [False] * n

        # Mark the first k indices from targetIndices as removed
        for i in range(k):
            removed[targetIndices[i]] = True

        # Check if pattern is subsequence of source ignoring removed indices
        pattern_ptr = 0

        # Traverse source string
        for i in range(n):
            # Skip removed characters
            if removed[i]:
                continue

            # If current character matches current pattern character, advance pattern pointer
            if source[i] == pattern[pattern_ptr]:
                pattern_ptr += 1
                # If we've matched all pattern characters, we're done
                if pattern_ptr == m:
                    return True

        # Check if we matched all pattern characters
        return pattern_ptr == m

    # Binary search for maximum k
    left, right = 0, len(targetIndices)
    max_k = 0

    while left <= right:
        mid = left + (right - left) // 2

        if can_remove_k(mid):
            # If we can remove mid indices, try removing more
            max_k = mid
            left = mid + 1
        else:
            # If we can't remove mid indices, try removing fewer
            right = mid - 1

    return max_k
```

```javascript
// Time: O((n + m) * log k) where n = source.length, m = pattern.length, k = targetIndices.length
// Space: O(n) for the removed array
function maximumRemovals(source, pattern, targetIndices) {
  const n = source.length;
  const m = pattern.length;

  // Helper function to check if pattern is subsequence after removing first k indices
  const canRemoveK = (k) => {
    // Create a boolean array to mark removed indices
    const removed = new Array(n).fill(false);

    // Mark the first k indices from targetIndices as removed
    for (let i = 0; i < k; i++) {
      removed[targetIndices[i]] = true;
    }

    // Check if pattern is subsequence of source ignoring removed indices
    let patternPtr = 0;

    // Traverse source string
    for (let i = 0; i < n; i++) {
      // Skip removed characters
      if (removed[i]) {
        continue;
      }

      // If current character matches current pattern character, advance pattern pointer
      if (source[i] === pattern[patternPtr]) {
        patternPtr++;
        // If we've matched all pattern characters, we're done
        if (patternPtr === m) {
          return true;
        }
      }
    }

    // Check if we matched all pattern characters
    return patternPtr === m;
  };

  // Binary search for maximum k
  let left = 0;
  let right = targetIndices.length;
  let maxK = 0;

  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);

    if (canRemoveK(mid)) {
      // If we can remove mid indices, try removing more
      maxK = mid;
      left = mid + 1;
    } else {
      // If we can't remove mid indices, try removing fewer
      right = mid - 1;
    }
  }

  return maxK;
}
```

```java
// Time: O((n + m) * log k) where n = source.length(), m = pattern.length(), k = targetIndices.length
// Space: O(n) for the removed array
public int maximumRemovals(String source, String pattern, int[] targetIndices) {
    int n = source.length();
    int m = pattern.length();

    // Helper function to check if pattern is subsequence after removing first k indices
    java.util.function.IntPredicate canRemoveK = (k) -> {
        // Create a boolean array to mark removed indices
        boolean[] removed = new boolean[n];

        // Mark the first k indices from targetIndices as removed
        for (int i = 0; i < k; i++) {
            removed[targetIndices[i]] = true;
        }

        // Check if pattern is subsequence of source ignoring removed indices
        int patternPtr = 0;

        // Traverse source string
        for (int i = 0; i < n; i++) {
            // Skip removed characters
            if (removed[i]) {
                continue;
            }

            // If current character matches current pattern character, advance pattern pointer
            if (source.charAt(i) == pattern.charAt(patternPtr)) {
                patternPtr++;
                // If we've matched all pattern characters, we're done
                if (patternPtr == m) {
                    return true;
                }
            }
        }

        // Check if we matched all pattern characters
        return patternPtr == m;
    };

    // Binary search for maximum k
    int left = 0;
    int right = targetIndices.length;
    int maxK = 0;

    while (left <= right) {
        int mid = left + (right - left) / 2;

        if (canRemoveK.test(mid)) {
            // If we can remove mid indices, try removing more
            maxK = mid;
            left = mid + 1;
        } else {
            // If we can't remove mid indices, try removing fewer
            right = mid - 1;
        }
    }

    return maxK;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O((n + m) × log k)

- Binary search runs O(log k) times
- Each `can_remove_k` check takes O(n + m) time:
  - O(n) to mark removed indices (only first k)
  - O(n) to traverse source string
  - O(m) to traverse pattern (but m ≤ n, so O(n) dominates)

**Space Complexity:** O(n)

- We need the `removed` boolean array of size n
- The recursion stack for binary search is O(log k), which is negligible compared to O(n)

## Common Mistakes

1. **Not using binary search:** Some candidates try linear search from 0 to k, which gives O(k × n) time and times out for large inputs. Always look for monotonic properties that enable binary search.

2. **Inefficient subsequence checking:** Rebuilding the string for each k takes O(n) extra time. Instead, mark removed indices and skip them during traversal.

3. **Off-by-one errors in binary search:** The classic pitfalls include:
   - Using `while (left < right)` instead of `while (left <= right)`
   - Forgetting to update `max_k` when `can_remove_k(mid)` is true
   - Incorrectly setting initial `right` boundary (should be `len(targetIndices)`, not `len(targetIndices) - 1`)

4. **Not handling early termination:** In the subsequence check, you can return `true` as soon as `pattern_ptr == m`. This optimization saves time when pattern is found early.

## When You'll See This Pattern

This problem combines two important patterns:

1. **Binary search on answer:** When you need to find the maximum/minimum value satisfying a condition, and the condition is monotonic (true for small values, false for large values or vice versa).
   - Related: [Capacity To Ship Packages Within D Days](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/) (find minimum capacity)
   - Related: [Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum/) (find minimum largest sum)

2. **Subsequence checking with constraints:** Checking if one string is a subsequence of another with additional constraints (removed indices, time limits, etc.).
   - Related: [Is Subsequence](https://leetcode.com/problems/is-subsequence/) (basic version)
   - Related: [Number of Matching Subsequences](https://leetcode.com/problems/number-of-matching-subsequences/) (multiple patterns)

## Key Takeaways

1. **Look for monotonicity to enable binary search:** If removing more indices makes it harder (not easier) to maintain the subsequence property, you have a monotonic condition perfect for binary search.

2. **Avoid rebuilding data structures:** When checking a condition repeatedly with small variations (like removing different sets of indices), find a way to efficiently represent the variation without reconstructing everything from scratch.

3. **Combine patterns:** Many medium/hard problems combine simpler patterns. Here it's binary search + subsequence checking. Recognizing the components helps you build the solution step by step.

Related problems: [Delete Characters to Make Fancy String](/problem/delete-characters-to-make-fancy-string)
