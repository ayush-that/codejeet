---
title: "How to Solve Non-decreasing Array — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Non-decreasing Array. Medium difficulty, 25.4% acceptance rate. Topics: Array."
date: "2028-01-26"
category: "dsa-patterns"
tags: ["non-decreasing-array", "array", "medium"]
---

# How to Solve Non-decreasing Array

This problem asks us to determine if we can make an array non-decreasing by modifying **at most one element**. What makes this problem tricky is that a single modification can have ripple effects — changing one element might fix one violation but create another elsewhere. The challenge lies in deciding _which_ element to modify when we encounter a decreasing pair.

## Visual Walkthrough

Let's trace through `[3, 4, 2, 3]` step by step:

1. Start at index 0: `3 <= 4` ✓ (non-decreasing)
2. Move to index 1: `4 <= 2` ✗ (violation found!)

We've found our first (and potentially only allowed) violation. Now we need to decide: should we modify `4` or `2`? Let's think through both options:

**Option A: Modify 4 to be ≤ 2**

- If we change `4` to `1` (or any value ≤ 2), we get `[3, 1, 2, 3]`
- Check `3 <= 1`? ✗ (new violation created!)
- This doesn't work because changing `4` to a smaller value breaks the previous pair

**Option B: Modify 2 to be ≥ 4**

- If we change `2` to `5` (or any value ≥ 4), we get `[3, 4, 5, 3]`
- Check `4 <= 5`? ✓
- Check `5 <= 3`? ✗ (new violation between indices 2 and 3)

Wait, that didn't work either! But let's think more carefully. When we modify `2` to `5`, we need to check if `5` is also ≥ the _previous_ element (`4`), which it is. The real issue is that `5` is now too large compared to the next element `3`.

Actually, there's a smarter choice: what if we modify `2` to be between `4` and `3`? But `4 > 3`, so no number can be both ≥ 4 and ≤ 3. This reveals the key insight: when `nums[i-1] > nums[i+1]` (the element before the violation is greater than the element after), we might need to modify `nums[i-1]` instead of `nums[i]`.

Let's try modifying `4` (at index 1) to be between `3` and `2`:

- Change `4` to `2.5`, get `[3, 2.5, 2, 3]`
- Check `3 <= 2.5`? ✗ (fails immediately)

So `[3, 4, 2, 3]` should return `false` — no single modification can fix it. The pattern we're discovering is that when we find `nums[i] > nums[i+1]`, we need to check the relationship between `nums[i-1]` and `nums[i+1]` to decide which element to "virtually" modify.

## Brute Force Approach

A brute force approach would try modifying each element to various values and check if the array becomes non-decreasing. More practically, we could:

1. Try removing each element one by one and check if the remaining array is non-decreasing
2. Or try modifying each element to match its neighbor

However, both approaches are inefficient. The first requires O(n²) time since for each of n removals, we need O(n) to check the array. The second is even worse because we'd need to try many possible values for each modification.

What a naive candidate might try is simply counting violations: if we find more than one index where `nums[i] > nums[i+1]`, return false. But this fails on cases like `[3, 4, 2, 3]` which has only one violation but still can't be fixed with one modification. We need to consider _which_ element to modify, not just count violations.

## Optimized Approach

The key insight is that when we encounter a decreasing pair `nums[i] > nums[i+1]`, we have exactly two choices:

1. Lower `nums[i]` to be ≤ `nums[i+1]`
2. Raise `nums[i+1]` to be ≥ `nums[i]`

But we must choose wisely based on the surrounding elements. Here's the decision logic:

- If `i == 0` (first element), we can always lower `nums[0]` without affecting any previous pair
- If `nums[i-1] <= nums[i+1]`, we can safely lower `nums[i]` to a value between `nums[i-1]` and `nums[i+1]`
- Otherwise, we must raise `nums[i+1]` to be ≥ `nums[i]`

The trick is that we only get **one** modification. Once we use it, any subsequent violation means we should return false.

Step-by-step reasoning:

1. Initialize `modifications = 0` to track how many changes we've made
2. Iterate through the array from index 1 to n-1
3. When we find `nums[i-1] > nums[i]` (a violation):
   - If we've already used our modification, return false
   - If `i == 1` or `nums[i-2] <= nums[i]`, we can modify `nums[i-1]` downward
   - Otherwise, we must modify `nums[i]` upward
   - Increment `modifications`
4. If we finish the loop, return true

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def checkPossibility(nums):
    """
    Check if array can become non-decreasing with at most one modification.

    The key insight: when we find nums[i-1] > nums[i], we have two choices:
    1. Lower nums[i-1] to nums[i] (if possible)
    2. Raise nums[i] to nums[i-1] (if first choice isn't possible)

    We can only make one modification, so any second violation means false.
    """
    modifications = 0  # Track how many modifications we've made

    for i in range(1, len(nums)):
        # Found a decreasing pair
        if nums[i-1] > nums[i]:
            modifications += 1

            # If we've already used our one allowed modification, fail
            if modifications > 1:
                return False

            # Decision: should we modify nums[i-1] or nums[i]?
            # We can modify nums[i-1] downward if:
            # 1. We're at the beginning of array (i == 1), OR
            # 2. nums[i-2] <= nums[i] (so lowering nums[i-1] won't create new violation)
            if i == 1 or nums[i-2] <= nums[i]:
                # Modify nums[i-1] downward to nums[i]
                # We don't actually modify the array, just track that we "would"
                nums[i-1] = nums[i]
            else:
                # Otherwise, we must modify nums[i] upward to nums[i-1]
                nums[i] = nums[i-1]

    return True
```

```javascript
// Time: O(n) | Space: O(1)
function checkPossibility(nums) {
  /**
   * Check if array can become non-decreasing with at most one modification.
   *
   * When we find nums[i-1] > nums[i], we decide:
   * - If i == 1 or nums[i-2] <= nums[i], modify nums[i-1] downward
   * - Otherwise, modify nums[i] upward
   *
   * We only get one modification, so second violation means false.
   */
  let modifications = 0; // Track modifications made

  for (let i = 1; i < nums.length; i++) {
    // Found a decreasing pair
    if (nums[i - 1] > nums[i]) {
      modifications++;

      // Already used our one allowed modification
      if (modifications > 1) {
        return false;
      }

      // Decide which element to modify
      // Can modify nums[i-1] if at beginning or nums[i-2] <= nums[i]
      if (i === 1 || nums[i - 2] <= nums[i]) {
        // Modify nums[i-1] downward to nums[i]
        nums[i - 1] = nums[i];
      } else {
        // Must modify nums[i] upward to nums[i-1]
        nums[i] = nums[i - 1];
      }
    }
  }

  return true;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public boolean checkPossibility(int[] nums) {
        /**
         * Check if array can become non-decreasing with at most one modification.
         *
         * Strategy: When we encounter nums[i-1] > nums[i]:
         * 1. If i == 1 or nums[i-2] <= nums[i], we can fix by modifying nums[i-1]
         * 2. Otherwise, we must modify nums[i]
         * 3. We only get one modification total
         */
        int modifications = 0;  // Count modifications made

        for (int i = 1; i < nums.length; i++) {
            // Found a violation of non-decreasing order
            if (nums[i - 1] > nums[i]) {
                modifications++;

                // Already used our one allowed modification
                if (modifications > 1) {
                    return false;
                }

                // Decide which element to modify
                // Can modify previous element if at start or nums[i-2] <= nums[i]
                if (i == 1 || nums[i - 2] <= nums[i]) {
                    // Modify nums[i-1] downward to match nums[i]
                    nums[i - 1] = nums[i];
                } else {
                    // Must modify nums[i] upward to match nums[i-1]
                    nums[i] = nums[i - 1];
                }
            }
        }

        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the array from index 1 to n-1
- Each iteration does constant-time comparisons and assignments
- No nested loops or recursive calls

**Space Complexity: O(1)**

- We only use a few integer variables (`modifications`, loop index `i`)
- We modify the input array in place (though conceptually we're just tracking what we "would" do)
- No additional data structures that scale with input size

## Common Mistakes

1. **Just counting violations without considering which element to modify**
   - Example: `[3, 4, 2, 3]` has only one violation but requires careful choice of which element to modify
   - Fix: When you find `nums[i-1] > nums[i]`, check the relationship with `nums[i-2]` to decide whether to modify `nums[i-1]` or `nums[i]`

2. **Forgetting to handle the beginning of the array**
   - When `i == 1`, there's no `nums[i-2]` to check
   - Fix: Add a special case `if (i == 1)` before checking `nums[i-2] <= nums[i]`

3. **Actually modifying the array vs. tracking conceptually**
   - Some candidates get confused about whether to actually change array values
   - Fix: We "virtually" modify by updating array values, but only to help with future comparisons. The actual algorithm just needs to know if such a modification is possible.

4. **Not checking `modifications > 1` immediately after incrementing**
   - If you wait until after the modification logic, you might process a second violation incorrectly
   - Fix: Check `if (modifications > 1) return false` right after incrementing

## When You'll See This Pattern

This "single modification check" pattern appears in problems where you need to validate a sequence with limited corrections:

1. **Valid Palindrome II** (Easy) - Check if a string is a palindrome with at most one deletion
   - Similar decision: when characters don't match, decide whether to delete left or right character
   - Both require careful choice when fixing a violation

2. **Shortest Unsorted Continuous Subarray** (Medium) - Find the minimal subarray to sort to make entire array sorted
   - Both involve analyzing local violations to determine global fix
   - Both require understanding how one element affects its neighbors

3. **Remove One Element to Make the Array Strictly Increasing** (Easy) - Direct variant of this problem
   - Almost identical logic but with strict inequality
   - Tests the same core skill of deciding which element to modify/remove

## Key Takeaways

1. **When fixing sequence violations with limited modifications, you must decide _which_ element to modify, not just count violations.** The choice depends on surrounding elements.

2. **Array validation problems often require looking at elements before and after a violation.** Don't just check adjacent pairs in isolation — consider how a fix affects both previous and next comparisons.

3. **The "single pass with decision logic" pattern is efficient for constraint-checking problems.** When you're allowed limited modifications, track them as you go and make local decisions immediately.

Related problems: [Make Array Non-decreasing or Non-increasing](/problem/make-array-non-decreasing-or-non-increasing), [Find Good Days to Rob the Bank](/problem/find-good-days-to-rob-the-bank), [Count Non-Decreasing Subarrays After K Operations](/problem/count-non-decreasing-subarrays-after-k-operations)
