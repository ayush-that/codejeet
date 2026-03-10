---
title: "How to Solve Check if Array Is Sorted and Rotated — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Check if Array Is Sorted and Rotated. Easy difficulty, 55.7% acceptance rate. Topics: Array."
date: "2026-12-07"
category: "dsa-patterns"
tags: ["check-if-array-is-sorted-and-rotated", "array", "easy"]
---

## How to Solve "Check if Array Is Sorted and Rotated"

This problem asks us to determine whether a given array could have been created by taking a sorted (non-decreasing) array and rotating it some number of positions. The twist is that the array may contain duplicates, and the rotation could be zero positions (meaning the array is already sorted). What makes this interesting is that we need to check a _global_ sorted property while accounting for a _single_ rotation point.

---

## Visual Walkthrough

Let's trace through an example: `nums = [3, 4, 5, 1, 2]`

**Step 1: Understand what we're checking**
A sorted, rotated array has exactly one "drop" where an element is smaller than the previous one. This drop marks the rotation point. In a fully sorted array, there are zero drops.

**Step 2: Walk through the example**

- Compare 3 and 4: 4 ≥ 3 ✓ (no drop)
- Compare 4 and 5: 5 ≥ 4 ✓ (no drop)
- Compare 5 and 1: 1 < 5 ✗ (DROP! This is the rotation point)
- Compare 1 and 2: 2 ≥ 1 ✓ (no drop)

We found exactly 1 drop. Now check the wrap-around: compare last element (2) with first element (3). Since 2 < 3, this is consistent with a rotation.

**Step 3: Why this works**
In a sorted array rotated at position `k`, all elements before the rotation point are in order, all elements after are in order, and the entire sequence has exactly one drop. The wrap-around comparison ensures the last element ≤ first element (otherwise there would be two drops).

---

## Brute Force Approach

A naive approach would be to actually try every possible rotation: for each possible rotation point `k`, check if rotating the array `k` positions results in a sorted array. This involves:

1. For each `k` from 0 to `n-1`
2. Create a rotated version of the array
3. Check if it's sorted
4. Return `true` if any rotation yields a sorted array

**Why this fails:**

- Time complexity: O(n²) — creating each rotated array takes O(n), and we do this n times
- Space complexity: O(n) — need to store rotated arrays
- Completely unnecessary since we can solve in O(n) with O(1) space

---

## Optimal Solution

The key insight: In a sorted, rotated array, there can be **at most one** position where `nums[i] < nums[i-1]`. If we find more than one such "drop," it cannot be a rotated sorted array. We also need to handle the wrap-around from the last element to the first.

**Algorithm:**

1. Initialize `drops = 0` to count positions where current element < previous element
2. Iterate through the array, comparing each element with its predecessor
3. For each drop found, increment `drops`
4. Finally, check the wrap-around: if last element > first element, that's another drop
5. Return `true` if `drops ≤ 1`

**Why `drops ≤ 1` not `drops == 1`?**

- `drops = 0`: array is already sorted (rotation by 0 positions)
- `drops = 1`: array was sorted then rotated
- `drops > 1`: impossible for a sorted, rotated array

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def check(nums):
    """
    Check if array could be sorted then rotated.

    Args:
        nums: List[int] - input array

    Returns:
        bool: True if array is sorted and rotated
    """
    n = len(nums)
    drops = 0  # Count positions where nums[i] < nums[i-1]

    # Check consecutive pairs within the array
    for i in range(1, n):
        if nums[i] < nums[i - 1]:
            drops += 1
            # Early exit: if we already have 2 drops, it's impossible
            if drops > 1:
                return False

    # Check the wrap-around from last to first element
    # If last > first, that's another "drop" in the circular sense
    if nums[n - 1] > nums[0]:
        drops += 1

    # Valid if we have at most 1 drop total
    return drops <= 1
```

```javascript
// Time: O(n) | Space: O(1)
function check(nums) {
  /**
   * Check if array could be sorted then rotated.
   *
   * @param {number[]} nums - input array
   * @return {boolean} True if array is sorted and rotated
   */
  const n = nums.length;
  let drops = 0; // Count positions where nums[i] < nums[i-1]

  // Check consecutive pairs within the array
  for (let i = 1; i < n; i++) {
    if (nums[i] < nums[i - 1]) {
      drops++;
      // Early exit: if we already have 2 drops, it's impossible
      if (drops > 1) {
        return false;
      }
    }
  }

  // Check the wrap-around from last to first element
  // If last > first, that's another "drop" in the circular sense
  if (nums[n - 1] > nums[0]) {
    drops++;
  }

  // Valid if we have at most 1 drop total
  return drops <= 1;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public boolean check(int[] nums) {
        /**
         * Check if array could be sorted then rotated.
         *
         * @param nums - input array
         * @return True if array is sorted and rotated
         */
        int n = nums.length;
        int drops = 0;  // Count positions where nums[i] < nums[i-1]

        // Check consecutive pairs within the array
        for (int i = 1; i < n; i++) {
            if (nums[i] < nums[i - 1]) {
                drops++;
                // Early exit: if we already have 2 drops, it's impossible
                if (drops > 1) {
                    return false;
                }
            }
        }

        // Check the wrap-around from last to first element
        // If last > first, that's another "drop" in the circular sense
        if (nums[n - 1] > nums[0]) {
            drops++;
        }

        // Valid if we have at most 1 drop total
        return drops <= 1;
    }
}
```

</div>

---

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the array once, performing constant-time comparisons
- The early exit optimization doesn't change worst-case but helps average case

**Space Complexity: O(1)**

- We only use a few integer variables (`drops`, `i`, `n`)
- No additional data structures needed

---

## Common Mistakes

1. **Forgetting to check the wrap-around**: Only checking consecutive pairs within the array misses cases like `[2,1,3,4]` which has no internal drops but `4 > 2` creates a wrap-around drop.

2. **Using strict inequality**: The problem says "non-decreasing" order, so `nums[i] <= nums[i-1]` is allowed. Using `<` instead of `≤` would incorrectly flag equal elements as drops.

3. **Not handling the zero-rotation case**: Some candidates look for exactly one drop, forgetting that zero drops (already sorted array) is valid. That's why we check `drops ≤ 1` not `drops == 1`.

4. **Overcomplicating with actual rotation**: Trying to find the rotation point and reconstruct the original array is unnecessary and inefficient. The drop-counting approach is simpler and faster.

---

## When You'll See This Pattern

This "single violation" pattern appears in problems where you need to check if a sequence has been modified in a specific, constrained way:

1. **Check if Array Is Sorted and Rotated** (this problem) - exactly one "drop" allowed
2. **Check if All A's Appears Before All B's** - exactly one transition from 'a' to 'b' allowed
3. **Valid Mountain Array** - exactly one peak with strict increasing then decreasing
4. **Monotonic Array** - either all non-increasing or all non-decreasing

The pattern: scan once, count violations of some invariant, and check if the count is within allowed limits.

---

## Key Takeaways

1. **Look for invariants**: Instead of simulating rotations, identify what property must be true for a rotated sorted array (at most one drop).

2. **Handle wrap-around carefully**: Circular array problems often require checking both internal pairs and the last-to-first connection.

3. **Early exits improve readability**: Checking `if drops > 1: return false` makes the intent clearer than counting all drops then checking at the end.

---

Related problems: [Check if All A's Appears Before All B's](/problem/check-if-all-as-appears-before-all-bs)
