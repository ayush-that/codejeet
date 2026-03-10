---
title: "How to Solve Separate Black and White Balls — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Separate Black and White Balls. Medium difficulty, 64.0% acceptance rate. Topics: Two Pointers, String, Greedy."
date: "2026-04-10"
category: "dsa-patterns"
tags: ["separate-black-and-white-balls", "two-pointers", "string", "greedy", "medium"]
---

## Brief Problem Restatement

We have a binary string where `'1'` represents black balls and `'0'` represents white balls. We can swap adjacent balls, and we want to separate all black balls to one side and white balls to the other with the minimum number of swaps. The tricky part is recognizing that we don't actually need to simulate swaps—we can calculate the total distance each ball needs to travel to reach its final position.

## Visual Walkthrough

Let's trace through example `s = "101010"` step by step:

**Goal:** Move all black balls (`'1'`) to the right side (or all white balls to the left—both are equivalent).

**Initial:** `1 0 1 0 1 0` (positions 0-5)

**Step 1 - Identify target positions:**
If we want all `'1'`s on the right, they should occupy the last k positions where k = count of `'1'`s.
Here, k = 3 (three `'1'`s at positions 0, 2, 4).
So target positions for `'1'`s are indices 3, 4, 5.

**Step 2 - Match each `'1'` to a target position:**
We process left to right:

- First `'1'` at index 0 → target index 3: needs 3 swaps to move right
- Second `'1'` at index 2 → target index 4: needs 2 swaps to move right
- Third `'1'` at index 4 → target index 5: needs 1 swap to move right

**Step 3 - Calculate total swaps:**
We don't actually swap—just sum the distances: 3 + 2 + 1 = 6 swaps.

**Why this works:** Each `'1'` must pass through all `'0'`s to its right to reach the right side. By counting how many `'0'`s are to the right of each `'1'`, we get exactly the number of swaps needed for that `'1'`.

## Brute Force Approach

A naive approach would be to actually simulate the swapping process:

1. Find the first violation where a `'0'` is after a `'1'` when we want all `'1'`s on the right
2. Swap adjacent balls to fix it
3. Repeat until sorted
4. Count the swaps

This would be O(n²) in worst case (like bubble sort) and is too slow for n up to 10⁵.

Even worse, some candidates might try generating all permutations or using BFS to find the minimum swaps, which would be factorial or exponential time.

The key insight we need is that we don't need to simulate—we can calculate the answer directly.

## Optimized Approach

The optimal solution uses a **greedy two-pointer** approach:

**Key Insight:**

- If we want all black balls (`'1'`) on the right, each `'1'` needs to swap with every `'0'` to its right.
- Equivalently, for each `'1'`, count how many `'0'`s appear after it.
- We can do this in one pass by maintaining a count of `'0'`s seen so far from the right.

**Step-by-step reasoning:**

1. Count total number of `'0'`s in the string
2. Iterate from left to right
3. For each `'1'`, add the number of `'0'`s to its right to the answer
4. Update the count of `'0'`s as we move

**Why greedy works:**

- Each `'1'` must cross all `'0'`s to its right to reach the right side
- These crossings are independent—moving one `'1'` doesn't affect how many `'0'`s another `'1'` needs to cross
- The order we process `'1'`s doesn't matter for the total count

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def minimumSteps(self, s: str) -> int:
    """
    Calculate minimum adjacent swaps to move all '1's to the right.

    Approach:
    - Each '1' needs to swap with every '0' to its right
    - Count '0's from right to left, add to answer when we see a '1'
    - This gives total swaps without actually swapping

    Example: "101010"
    - zeros = 3, answer = 0
    - i=0: '1' → answer += 3 = 3
    - i=1: '0' → zeros -= 1 = 2
    - i=2: '1' → answer += 2 = 5
    - i=3: '0' → zeros -= 1 = 1
    - i=4: '1' → answer += 1 = 6
    - i=5: '0' → zeros -= 1 = 0
    - Return 6
    """
    zeros = s.count('0')  # Count all zeros initially
    swaps = 0

    for char in s:
        if char == '1':
            # This '1' needs to cross all zeros to its right
            swaps += zeros
        else:
            # Found a zero, so remaining '1's have one less zero to cross
            zeros -= 1

    return swaps
```

```javascript
// Time: O(n) | Space: O(1)
/**
 * @param {string} s
 * @return {number}
 */
var minimumSteps = function (s) {
  // Count total zeros in the string
  let zeros = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "0") zeros++;
  }

  let swaps = 0;

  // Process each character left to right
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "1") {
      // Current '1' needs to swap with all zeros to its right
      swaps += zeros;
    } else {
      // Found a zero, so future '1's have one less zero to cross
      zeros--;
    }
  }

  return swaps;
};
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public long minimumSteps(String s) {
        // Count all zeros in the string
        long zeros = 0;
        for (int i = 0; i < s.length(); i++) {
            if (s.charAt(i) == '0') zeros++;
        }

        long swaps = 0;

        // Process each character from left to right
        for (int i = 0; i < s.length(); i++) {
            if (s.charAt(i) == '1') {
                // Each '1' must swap with every '0' to its right
                swaps += zeros;
            } else {
                // This zero is now to the left of remaining '1's
                zeros--;
            }
        }

        return swaps;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We make two passes through the string: one to count zeros, one to calculate swaps
- Each pass is O(n), so total is O(n)

**Space Complexity:** O(1)

- We only use a few integer variables (zeros, swaps, loop counter)
- No additional data structures that scale with input size

## Common Mistakes

1. **Simulating swaps directly:** Attempting to actually swap balls in the string and count swaps. This leads to O(n²) time which times out for large n. Remember: we only need the count, not the actual sequence of swaps.

2. **Wrong direction assumption:** Some candidates assume we need to move all `'1'`s to the left instead of right. The problem is symmetric—moving all `'1'`s to the right is equivalent to moving all `'0'`s to the left. Both give the same answer.

3. **Off-by-one with zero count:** Forgetting to decrement the zero count when we encounter a `'0'`. Each `'0'` we pass is now to the left of remaining `'1'`s, so future `'1'`s don't need to cross it.

4. **Using int instead of long:** For large n (up to 10⁵), the answer can exceed 32-bit int range. The maximum swaps is when all `'1'`s are on the left and all `'0'`s on the right: for n=10⁵, answer ≈ n²/4 ≈ 2.5×10⁹ which fits in 32-bit signed int, but it's safer to use 64-bit.

## When You'll See This Pattern

This "count crossings" pattern appears in several problems where we need to calculate minimum adjacent swaps:

1. **Minimum Adjacent Swaps to Make Palindrome** (LeetCode 2193): Similar crossing count logic for palindrome formation.

2. **Minimum Swaps to Group All 1's Together** (LeetCode 1151): Sliding window approach that also counts how many zeros need to be swapped out of a window.

3. **Minimum Number of Swaps to Make the String Balanced** (LeetCode 1963): Similar greedy counting of imbalances.

The core idea is recognizing that adjacent swaps have a predictable effect on element positions, allowing us to calculate totals without simulation.

## Key Takeaways

1. **Adjacent swaps = crossing counts:** When swapping adjacent elements, each element must cross all elements of the opposite type between its current and target positions. Counting these crossings gives the minimum swaps.

2. **Process in optimal order:** For grouping problems, processing elements in the order they appear (left to right) and matching them to target positions in the same order yields the minimum swaps.

3. **Think in terms of relative positions:** Instead of tracking exact positions after each swap, focus on how many elements of the opposite type each element needs to cross. This abstraction simplifies the calculation.

[Practice this problem on CodeJeet](/problem/separate-black-and-white-balls)
