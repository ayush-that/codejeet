---
title: "How to Solve Check If All 1's Are at Least Length K Places Away — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Check If All 1's Are at Least Length K Places Away. Easy difficulty, 64.3% acceptance rate. Topics: Array."
date: "2028-08-25"
category: "dsa-patterns"
tags: ["check-if-all-1s-are-at-least-length-k-places-away", "array", "easy"]
---

# How to Solve "Check If All 1's Are at Least Length K Places Away"

This problem asks us to verify whether all the `1`s in a binary array are separated by at least `k` zeros between them. While the problem is classified as "Easy," it tests your attention to detail with index manipulation and edge case handling. The tricky part is correctly measuring the distance between consecutive `1`s—many candidates mistakenly count the wrong number of elements or mishandle arrays with zero or one `1`.

## Visual Walkthrough

Let's walk through an example to build intuition. Suppose we have `nums = [1,0,0,0,1,0,0,1]` and `k = 2`.

We need to check the distance between every pair of consecutive `1`s. The distance is measured by counting the number of elements _between_ them, not the difference in indices.

**Step-by-step:**

1. Find the first `1` at index 0.
2. Find the next `1` at index 4.
   - Elements between them: indices 1, 2, 3 → three zeros.
   - Required: at least `k = 2` zeros → passes (3 ≥ 2).
3. Move to the next `1` at index 7.
   - Elements between current `1` (index 4) and next `1` (index 7): indices 5, 6 → two zeros.
   - Required: at least 2 zeros → passes (2 ≥ 2).
4. No more `1`s → all pairs satisfy the condition → return `true`.

If `k = 3` instead:

- First pair (indices 0 and 4): 3 zeros between → passes (3 ≥ 3).
- Second pair (indices 4 and 7): 2 zeros between → fails (2 < 3) → return `false`.

The key insight: we only need to track the index of the _previous_ `1` and compare it with each new `1` we find.

## Brute Force Approach

A naive approach might compare every `1` with every other `1`, but that's unnecessary. A more straightforward (but still suboptimal) brute force would be:

For each `1` at index `i`, scan forward to find the next `1` at index `j`, then check if `j - i - 1 >= k`. This is actually the optimal approach in terms of time complexity (O(n)), but it's "brute" in the sense of scanning repeatedly. The real brute force would be O(n²) by checking all pairs.

However, the common _mistaken_ brute force is to count all zeros between ones without tracking the previous index properly, leading to off-by-one errors. Let's see what that might look like:

**Incorrect approach:**

- Count zeros until you hit a `1`, then reset if count ≥ k.
- This fails for cases like `[1,0,1]` with `k=1` because it doesn't properly measure between consecutive ones.

Since the optimal solution is already straightforward, we'll focus on implementing it correctly.

## Optimal Solution

We maintain a variable `prev_index` to store the index of the last `1` we encountered. Initialize it to `-1` (or a sentinel value indicating no previous `1`). Then iterate through the array:

- When we find a `1` at index `i`:
  - If `prev_index` is not `-1`, check if `i - prev_index - 1 >= k`.
    - If not, return `false` immediately.
  - Update `prev_index = i`.
- If we finish the loop without failing, return `true`.

The distance between two `1`s at indices `prev` and `curr` is `curr - prev - 1` because we exclude both `1`s themselves.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def kLengthApart(nums, k):
    """
    Check if all 1's are at least k places apart.

    Args:
        nums: List[int] - binary array
        k: int - minimum required distance between 1's

    Returns:
        bool - True if condition satisfied, False otherwise
    """
    # Initialize previous index to -1 (no 1 seen yet)
    prev_index = -1

    # Iterate through each element in the array
    for i in range(len(nums)):
        # If current element is 1
        if nums[i] == 1:
            # Check if we've seen a 1 before
            if prev_index != -1:
                # Calculate distance between current and previous 1
                # Distance = elements between them = i - prev_index - 1
                if i - prev_index - 1 < k:
                    # Distance too small, condition violated
                    return False
            # Update previous index to current position
            prev_index = i

    # All pairs satisfy the condition
    return True
```

```javascript
// Time: O(n) | Space: O(1)
/**
 * Check if all 1's are at least k places apart.
 * @param {number[]} nums - binary array
 * @param {number} k - minimum required distance between 1's
 * @return {boolean} - true if condition satisfied, false otherwise
 */
function kLengthApart(nums, k) {
  // Initialize previous index to -1 (no 1 seen yet)
  let prevIndex = -1;

  // Iterate through each element in the array
  for (let i = 0; i < nums.length; i++) {
    // If current element is 1
    if (nums[i] === 1) {
      // Check if we've seen a 1 before
      if (prevIndex !== -1) {
        // Calculate distance between current and previous 1
        // Distance = elements between them = i - prevIndex - 1
        if (i - prevIndex - 1 < k) {
          // Distance too small, condition violated
          return false;
        }
      }
      // Update previous index to current position
      prevIndex = i;
    }
  }

  // All pairs satisfy the condition
  return true;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    /**
     * Check if all 1's are at least k places apart.
     * @param nums - binary array
     * @param k - minimum required distance between 1's
     * @return true if condition satisfied, false otherwise
     */
    public boolean kLengthApart(int[] nums, int k) {
        // Initialize previous index to -1 (no 1 seen yet)
        int prevIndex = -1;

        // Iterate through each element in the array
        for (int i = 0; i < nums.length; i++) {
            // If current element is 1
            if (nums[i] == 1) {
                // Check if we've seen a 1 before
                if (prevIndex != -1) {
                    // Calculate distance between current and previous 1
                    // Distance = elements between them = i - prevIndex - 1
                    if (i - prevIndex - 1 < k) {
                        // Distance too small, condition violated
                        return false;
                    }
                }
                // Update previous index to current position
                prevIndex = i;
            }
        }

        // All pairs satisfy the condition
        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We iterate through the array once, performing constant-time operations for each element.
- The check `i - prev_index - 1 < k` is O(1), and we do it only when we encounter a `1`.

**Space Complexity:** O(1)

- We use only a few integer variables (`prev_index`, `i`, `k`), regardless of input size.
- No additional data structures are required.

## Common Mistakes

1. **Off-by-one errors in distance calculation**
   - Mistake: Using `i - prev_index` instead of `i - prev_index - 1` to count elements between ones.
   - Why it's wrong: The difference in indices includes both `1`s. For indices 2 and 5, there are 2 elements between (indices 3 and 4), not 3.
   - How to avoid: Always subtract 1 when counting _between_ elements. Test with small examples.

2. **Not handling the first `1` correctly**
   - Mistake: Initializing `prev_index = 0` when the first element might not be `1`.
   - Why it's wrong: If `nums[0] = 0`, setting `prev_index = 0` incorrectly assumes a `1` at position 0.
   - How to avoid: Use a sentinel value like `-1` to indicate "no previous `1` seen yet."

3. **Incorrectly handling `k = 0`**
   - Mistake: Special-casing `k = 0` or returning early.
   - Why it's wrong: The formula `i - prev_index - 1 < k` works correctly for `k = 0`. If two `1`s are adjacent, distance is 0, which fails when `k = 0` (0 < 0 is false, so it passes—wait, that's correct! Actually, adjacent ones should fail when k=0? Let's think: if k=0, we require at least 0 zeros between ones. Adjacent ones have 0 zeros between, so they should pass. Our formula works: 0 < 0 is false, so we don't return false. Good!)
   - How to avoid: Trust the math. Test edge cases: `[1,1]` with `k=0` should return `true`.

4. **Early termination on single `1` or no `1`s**
   - Mistake: Returning `false` if only one `1` exists or if there are no `1`s.
   - Why it's wrong: The condition only applies between pairs of `1`s. With zero or one `1`, there are no pairs to check, so it should return `true`.
   - How to avoid: Remember we only check distance when `prev_index != -1`. With zero or one `1`, we never enter that check.

## When You'll See This Pattern

This problem uses the **two-pointer/tracking** pattern where you maintain a reference to a previous element while iterating. You'll see this in:

1. **Remove Duplicates from Sorted Array (LeetCode #26)** - Track the position to insert the next unique element while iterating.
2. **Move Zeroes (LeetCode #283)** - Track the position to place the next non-zero element.
3. **Maximum Distance to Closest Person (LeetCode #849)** - Similar distance calculation between `1`s, but with different rules for edges.

The core technique is maintaining state (previous index) to make comparisons without extra space—a common optimization in array problems.

## Key Takeaways

1. **Distance between elements** in an array is often `index2 - index1 - 1` when counting elements _between_ them. Remember the `-1`.
2. **Sentinel values** like `-1` are useful for tracking "no previous occurrence" without special cases.
3. **Early return** when a condition fails can simplify logic and improve efficiency in the average case.

Related problems: [Task Scheduler II](/problem/task-scheduler-ii)
