---
title: "How to Solve Assign Cookies — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Assign Cookies. Easy difficulty, 54.7% acceptance rate. Topics: Array, Two Pointers, Greedy, Sorting."
date: "2026-11-10"
category: "dsa-patterns"
tags: ["assign-cookies", "array", "two-pointers", "greedy", "easy"]
---

# How to Solve Assign Cookies

You're given two arrays: one representing children's greed factors (minimum cookie size they'll accept) and another representing cookie sizes. Each child can get at most one cookie, and a child will only be content if they receive a cookie at least as large as their greed factor. Your goal is to maximize the number of content children.

What makes this problem interesting is that it's a classic **greedy matching problem** where we need to match children with cookies optimally. The greedy approach works perfectly here, but understanding why it works is key to solving similar problems.

## Visual Walkthrough

Let's trace through an example step by step:

**Input:** `g = [1, 2, 3]`, `s = [1, 1]`

**Step 1: Sort both arrays**

- Children sorted by greed: `[1, 2, 3]`
- Cookies sorted by size: `[1, 1]`

**Step 2: Initialize pointers**

- Child pointer `i = 0` (points to child with greed 1)
- Cookie pointer `j = 0` (points to cookie of size 1)

**Step 3: First matching attempt**

- Child greed (1) ≤ Cookie size (1) → **MATCH!**
- Give cookie 0 to child 0
- Move both pointers: `i = 1`, `j = 1`
- Content children: 1

**Step 4: Second matching attempt**

- Child greed (2) > Cookie size (1) → **NO MATCH**
- Cookie is too small for this child
- Move only cookie pointer: `j = 2`
- But `j = 2` equals cookie array length → **DONE**

**Result:** 1 content child

**Why sorting works:** By sorting both arrays, we always try to match the smallest cookie that satisfies each child. This prevents "wasting" large cookies on children with small greed factors when smaller cookies would suffice.

## Brute Force Approach

A naive approach would be to try all possible assignments of cookies to children. For each child, we could check all available cookies to find one that satisfies their greed. However, this becomes extremely inefficient:

1. We could try all permutations of cookie assignments
2. For `n` children and `m` cookies, there are `m!/(m-n)!` possible assignments (if `m ≥ n`)
3. This leads to factorial time complexity: `O(m!/(m-n)!)` in the worst case

Even a simpler brute force of checking each child against each cookie would be `O(n × m)`, which is better but still not optimal when we can achieve `O(n log n + m log m)`.

The key insight is that we don't need to check every cookie for every child. Once we sort, we can use a two-pointer approach to match children and cookies in linear time after sorting.

## Optimal Solution

The optimal solution uses a **greedy two-pointer approach**:

1. Sort both arrays (children by greed, cookies by size)
2. Use two pointers: one for children, one for cookies
3. Iterate through cookies, trying to satisfy the current child
4. If a cookie satisfies a child, move both pointers forward
5. If not, try the next cookie (move cookie pointer only)

This works because:

- Sorting ensures we always use the smallest possible cookie for each child
- The greedy choice (satisfy the least greedy child first with the smallest adequate cookie) is always optimal
- By not "saving" cookies for potentially greedier children later, we maximize matches

<div class="code-group">

```python
# Time: O(n log n + m log m) where n = len(g), m = len(s)
# Space: O(1) if sorting in-place, O(n + m) if not
def findContentChildren(g, s):
    """
    Maximizes the number of content children by assigning cookies optimally.

    Args:
        g: List of children's greed factors
        s: List of cookie sizes

    Returns:
        Number of content children
    """
    # Step 1: Sort both arrays
    # We sort to apply the greedy strategy: always try to satisfy
    # the least greedy child with the smallest adequate cookie
    g.sort()  # Sort children by greed (ascending)
    s.sort()  # Sort cookies by size (ascending)

    # Step 2: Initialize pointers
    child_ptr = 0  # Points to current child we're trying to satisfy
    cookie_ptr = 0  # Points to current cookie we're considering

    # Step 3: Iterate through cookies and children
    # We stop when we run out of either children or cookies
    while child_ptr < len(g) and cookie_ptr < len(s):
        # Check if current cookie can satisfy current child
        if s[cookie_ptr] >= g[child_ptr]:
            # Cookie is big enough! Give it to the child
            child_ptr += 1  # Move to next child (this one is satisfied)

        # Whether the cookie was used or not, move to next cookie
        # If cookie was used: we need a new cookie for next child
        # If cookie was too small: try next (larger) cookie for same child
        cookie_ptr += 1

    # Step 4: Return number of satisfied children
    # child_ptr represents how many children we've satisfied
    return child_ptr
```

```javascript
// Time: O(n log n + m log m) where n = g.length, m = s.length
// Space: O(1) if sorting in-place, O(n + m) if not
function findContentChildren(g, s) {
  /**
   * Maximizes the number of content children by assigning cookies optimally.
   *
   * @param {number[]} g - Array of children's greed factors
   * @param {number[]} s - Array of cookie sizes
   * @return {number} - Number of content children
   */

  // Step 1: Sort both arrays
  // Sorting enables the greedy matching strategy
  g.sort((a, b) => a - b); // Sort children by greed (ascending)
  s.sort((a, b) => a - b); // Sort cookies by size (ascending)

  // Step 2: Initialize pointers
  let childPtr = 0; // Points to current child we're trying to satisfy
  let cookiePtr = 0; // Points to current cookie we're considering

  // Step 3: Iterate through cookies and children
  // Loop continues until we run out of children or cookies
  while (childPtr < g.length && cookiePtr < s.length) {
    // Check if current cookie can satisfy current child
    if (s[cookiePtr] >= g[childPtr]) {
      // Cookie satisfies child! Give it to them
      childPtr++; // Move to next child (current one is satisfied)
    }

    // Always move to next cookie
    // If cookie was used: we need new cookie for next child
    // If cookie was too small: try next (larger) cookie
    cookiePtr++;
  }

  // Step 4: Return number of satisfied children
  // childPtr represents count of satisfied children
  return childPtr;
}
```

```java
// Time: O(n log n + m log m) where n = g.length, m = s.length
// Space: O(1) if sorting in-place, O(n + m) if not
import java.util.Arrays;

public class Solution {
    public int findContentChildren(int[] g, int[] s) {
        /**
         * Maximizes the number of content children by assigning cookies optimally.
         *
         * @param g Array of children's greed factors
         * @param s Array of cookie sizes
         * @return Number of content children
         */

        // Step 1: Sort both arrays
        // Sorting is crucial for the greedy matching to work
        Arrays.sort(g);  // Sort children by greed (ascending)
        Arrays.sort(s);  // Sort cookies by size (ascending)

        // Step 2: Initialize pointers
        int childPtr = 0;  // Points to current child we're trying to satisfy
        int cookiePtr = 0; // Points to current cookie we're considering

        // Step 3: Iterate through cookies and children
        // Continue until we run out of children or cookies
        while (childPtr < g.length && cookiePtr < s.length) {
            // Check if current cookie can satisfy current child
            if (s[cookiePtr] >= g[childPtr]) {
                // Cookie satisfies child! Assign it
                childPtr++;  // Move to next child (current one is satisfied)
            }

            // Always move to next cookie
            // If cookie was used: need new cookie for next child
            // If cookie was too small: try next (larger) cookie
            cookiePtr++;
        }

        // Step 4: Return number of satisfied children
        // childPtr represents the count of satisfied children
        return childPtr;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** `O(n log n + m log m)`

- Sorting the greed array takes `O(n log n)` where `n` is the number of children
- Sorting the cookie array takes `O(m log m)` where `m` is the number of cookies
- The two-pointer traversal takes `O(n + m)` which is dominated by the sorting operations
- Total: `O(n log n + m log m)`

**Space Complexity:** `O(1)` or `O(n + m)` depending on sorting implementation

- If sorting is done in-place (like Python's Timsort or Java's Arrays.sort), space complexity is `O(1)` for the algorithm itself
- Some sorting algorithms may use `O(n)` or `O(m)` auxiliary space
- The pointers use constant space: `O(1)`

## Common Mistakes

1. **Forgetting to sort the arrays**: This is the most common mistake. Without sorting, the greedy approach doesn't work. You might satisfy a greedy child with a large cookie early, leaving less greedy children with no adequate cookies later.

2. **Incorrect pointer movement in the loop**: Some candidates only move the cookie pointer when a match is found, but we should always move it. If a cookie is too small for the current child, it's also too small for all subsequent children (since they're sorted by increasing greed).

3. **Using the wrong comparison operator**: The condition should be `cookie >= greed`, not `cookie > greed` (unless the problem said "greater than" instead of "greater than or equal to"). A child is content if the cookie size equals their greed factor.

4. **Not handling empty inputs**: Always check if either array is empty. If there are no cookies, return 0. If there are no children, also return 0. The code handles this naturally since the while loop won't execute.

5. **Trying to optimize by starting from largest cookies**: While it might seem intuitive to give the largest cookies to the greediest children, starting from the smallest cookies and least greedy children is actually optimal and simpler to implement.

## When You'll See This Pattern

This "greedy matching with two pointers" pattern appears in many problems where you need to optimally match or pair elements from two sorted sequences:

1. **Two Sum II - Input Array Is Sorted (LeetCode 167)**: Similar two-pointer approach but looking for a specific sum rather than matching.

2. **Merge Sorted Array (LeetCode 88)**: While not exactly the same, it uses similar pointer manipulation on sorted arrays.

3. **Interval Scheduling Problems**: Many interval problems use greedy approaches with sorting, like "Non-overlapping Intervals" (LeetCode 435).

4. **Container With Most Water (LeetCode 11)**: Uses two pointers moving inward from both ends, a variation of the two-pointer pattern.

The core idea is: **when you can sort inputs and make locally optimal choices that lead to globally optimal solutions, consider a greedy approach with pointers.**

## Key Takeaways

1. **Greedy algorithms often work with sorting**: When you can sort inputs to make optimal local decisions, a greedy approach is worth considering. The "assign smallest adequate resource to smallest demand" pattern is common.

2. **Two pointers simplify matching on sorted arrays**: Once arrays are sorted, you can use pointers to traverse them together in linear time, avoiding nested loops.

3. **Always verify greedy choice optimality**: Before implementing, ask: "Does satisfying the least greedy child first with the smallest adequate cookie prevent a better solution?" In this case, no—any cookie that satisfies a greedy child would also satisfy a less greedy one.

4. **Edge cases matter**: Empty arrays, single elements, and cases where all cookies are too small or all children can be satisfied should all be handled correctly.

[Practice this problem on CodeJeet](/problem/assign-cookies)
