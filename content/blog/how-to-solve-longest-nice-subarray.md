---
title: "How to Solve Longest Nice Subarray — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Longest Nice Subarray. Medium difficulty, 64.8% acceptance rate. Topics: Array, Bit Manipulation, Sliding Window."
date: "2026-05-03"
category: "dsa-patterns"
tags: ["longest-nice-subarray", "array", "bit-manipulation", "sliding-window", "medium"]
---

# How to Solve Longest Nice Subarray

This problem asks us to find the longest subarray where **every pair of elements has a bitwise AND of 0**. At first glance, this might seem like a standard sliding window problem, but the bitwise constraint makes it particularly interesting. The key insight is that for all pairs in a subarray to have AND = 0, **no two elements can share any set bit positions**. This transforms the problem from checking all pairs to tracking which bits are currently "occupied" in our window.

## Visual Walkthrough

Let's trace through `nums = [1, 3, 8, 48, 10]` step by step:

**Initial state:** `left = 0`, `right = 0`, `bitmask = 0`, `max_len = 0`

**Step 1:** Add `nums[0] = 1` (binary: `0001`)

- Check: `bitmask & 1 = 0 & 1 = 0` ✓
- Update: `bitmask |= 1 = 0001`
- Window: `[1]`, length = 1
- `max_len = max(0, 1) = 1`

**Step 2:** Add `nums[1] = 3` (binary: `0011`)

- Check: `bitmask & 3 = 0001 & 0011 = 0001 ≠ 0` ✗
- Conflict! Bit position 0 is already set by element 1
- Shrink window: remove `nums[0] = 1` from bitmask
- `bitmask ^= 1 = 0000`
- `left = 1`
- Now add `3`: `bitmask & 3 = 0 & 3 = 0` ✓
- `bitmask |= 3 = 0011`
- Window: `[3]`, length = 1
- `max_len` stays 1

**Step 3:** Add `nums[2] = 8` (binary: `1000`)

- Check: `bitmask & 8 = 0011 & 1000 = 0000` ✓
- Update: `bitmask |= 8 = 1011`
- Window: `[3, 8]`, length = 2
- `max_len = max(1, 2) = 2`

**Step 4:** Add `nums[3] = 48` (binary: `110000`)

- Check: `bitmask & 48 = 1011 & 110000 = 0000` ✓
- Update: `bitmask |= 48 = 111011`
- Window: `[3, 8, 48]`, length = 3
- `max_len = max(2, 3) = 3`

**Step 5:** Add `nums[4] = 10` (binary: `1010`)

- Check: `bitmask & 10 = 111011 & 1010 = 0010 ≠ 0` ✗
- Conflict! Bit position 1 is set (from element 3)
- Shrink window: remove `nums[1] = 3` from bitmask
- `bitmask ^= 3 = 111000`
- `left = 2`
- Check again: `bitmask & 10 = 111000 & 1010 = 1000 ≠ 0` ✗
- Still conflict! Bit position 3 is set (from element 8)
- Shrink window: remove `nums[2] = 8` from bitmask
- `bitmask ^= 8 = 110000`
- `left = 3`
- Check again: `bitmask & 10 = 110000 & 1010 = 0000` ✓
- Finally add `10`: `bitmask |= 10 = 111010`
- Window: `[48, 10]`, length = 2
- `max_len` stays 3

**Result:** The longest nice subarray is `[3, 8, 48]` with length 3.

## Brute Force Approach

The brute force solution would check every possible subarray and verify if it's "nice" by checking all pairs:

1. Generate all subarrays (O(n²) subarrays)
2. For each subarray, check all pairs (O(k²) pairs for a subarray of length k)
3. For each pair, compute bitwise AND and check if it's 0

This results in O(n⁴) time complexity in the worst case, which is completely impractical for typical constraints (n up to 10⁵).

Even an optimized brute force that stops early when finding a conflict would still be O(n³), which is too slow. The key issue is that checking all pairs is expensive, and we need a way to maintain the "no shared bits" property efficiently as we expand and shrink our window.

## Optimized Approach

The critical insight comes from understanding what the "nice" condition really means:

**If `a & b = 0` for all pairs in a subarray, then no two numbers can have a `1` in the same bit position.**

This means that **the bitwise OR of all elements in a nice subarray equals the sum of their values** (since no bits overlap). More importantly, we can track which bits are currently "occupied" in our window using a single integer bitmask.

The optimal approach uses a **sliding window with bitmask tracking**:

1. Maintain a window `[left, right]` that's always "nice"
2. Track a `bitmask` representing all bits currently set in the window
3. When expanding the window (moving `right`):
   - If `nums[right] & bitmask == 0`, the new element doesn't conflict
   - Add it to the window: `bitmask |= nums[right]`
4. If there's a conflict (`nums[right] & bitmask != 0`):
   - Shrink the window from the left until the conflict is resolved
   - Remove `nums[left]` from `bitmask` using XOR
   - Increment `left`
5. Track the maximum window length throughout

This works because:

- We only need O(1) to check if a new element conflicts (bitwise AND)
- We only need O(1) to add/remove elements from our bitmask (bitwise OR/XOR)
- Each element enters and leaves the window at most once, giving us O(n) time

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def longestNiceSubarray(nums):
    """
    Finds the longest subarray where all pairs have bitwise AND = 0.

    The key insight: For all pairs to have AND = 0, no two elements
    can share any set bit positions. We track occupied bits using
    a sliding window with bitmask.
    """
    left = 0          # Left pointer of sliding window
    bitmask = 0       # Tracks which bits are set in current window
    max_len = 0       # Tracks maximum window length found

    for right in range(len(nums)):
        # While current element conflicts with existing bits in window
        # (shares at least one set bit position)
        while bitmask & nums[right] != 0:
            # Remove leftmost element from window
            # XOR removes exactly the bits that nums[left] contributed
            bitmask ^= nums[left]
            left += 1

        # Add current element to window
        # OR adds its bits to our tracking mask
        bitmask |= nums[right]

        # Update maximum window length
        # Window is [left, right], inclusive, so length = right - left + 1
        current_len = right - left + 1
        max_len = max(max_len, current_len)

    return max_len
```

```javascript
// Time: O(n) | Space: O(1)
/**
 * Finds the longest subarray where all pairs have bitwise AND = 0.
 *
 * The key insight: For all pairs to have AND = 0, no two elements
 * can share any set bit positions. We track occupied bits using
 * a sliding window with bitmask.
 */
function longestNiceSubarray(nums) {
  let left = 0; // Left pointer of sliding window
  let bitmask = 0; // Tracks which bits are set in current window
  let maxLen = 0; // Tracks maximum window length found

  for (let right = 0; right < nums.length; right++) {
    // While current element conflicts with existing bits in window
    // (shares at least one set bit position)
    while ((bitmask & nums[right]) !== 0) {
      // Remove leftmost element from window
      // XOR removes exactly the bits that nums[left] contributed
      bitmask ^= nums[left];
      left++;
    }

    // Add current element to window
    // OR adds its bits to our tracking mask
    bitmask |= nums[right];

    // Update maximum window length
    // Window is [left, right], inclusive, so length = right - left + 1
    const currentLen = right - left + 1;
    maxLen = Math.max(maxLen, currentLen);
  }

  return maxLen;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    /**
     * Finds the longest subarray where all pairs have bitwise AND = 0.
     *
     * The key insight: For all pairs to have AND = 0, no two elements
     * can share any set bit positions. We track occupied bits using
     * a sliding window with bitmask.
     */
    public int longestNiceSubarray(int[] nums) {
        int left = 0;          // Left pointer of sliding window
        int bitmask = 0;       // Tracks which bits are set in current window
        int maxLen = 0;        // Tracks maximum window length found

        for (int right = 0; right < nums.length; right++) {
            // While current element conflicts with existing bits in window
            // (shares at least one set bit position)
            while ((bitmask & nums[right]) != 0) {
                // Remove leftmost element from window
                // XOR removes exactly the bits that nums[left] contributed
                bitmask ^= nums[left];
                left++;
            }

            // Add current element to window
            // OR adds its bits to our tracking mask
            bitmask |= nums[right];

            // Update maximum window length
            // Window is [left, right], inclusive, so length = right - left + 1
            int currentLen = right - left + 1;
            maxLen = Math.max(maxLen, currentLen);
        }

        return maxLen;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Each element is processed once when added to the window (right pointer moves n times)
- Each element is removed at most once when shrinking the window (left pointer moves at most n times)
- The while loop for shrinking doesn't make it O(n²) because each element is removed at most once
- All bitwise operations are O(1)

**Space Complexity: O(1)**

- We only use a few integer variables (left, right, bitmask, max_len)
- No additional data structures that scale with input size

## Common Mistakes

1. **Checking all pairs explicitly**: Some candidates try to maintain a window and check all pairs when adding a new element. This leads to O(n³) time. Remember: the bitmask trick lets us check conflicts in O(1).

2. **Using addition instead of bitwise OR for the mask**: You might think to add numbers to track the window, but this is wrong. Example: 1 + 2 = 3, but 1 & 2 = 0 (valid). However, 1 + 1 = 2, but 1 & 1 = 1 (invalid). The sum doesn't track which bits come from which numbers.

3. **Forgetting to use XOR when removing elements**: When shrinking the window, you must remove the exact bits that the left element contributed. If you use `bitmask &= ~nums[left]` (AND with NOT), that works too, but XOR is cleaner. Using subtraction would be wrong.

4. **Not handling the empty array edge case**: While the problem states positive integers, in interviews you should ask about empty input. Our solution handles it correctly (returns 0).

## When You'll See This Pattern

This problem combines **sliding window** with **bitmask state tracking**. You'll see similar patterns in:

1. **Longest Substring Without Repeating Characters** - Instead of tracking characters with a set, we track bits with a bitmask. Both maintain a "no conflict" property in a sliding window.

2. **Bitwise AND of Numbers Range** - While not a sliding window problem, it requires deep understanding of bit manipulation properties, similar to recognizing that AND=0 means no shared bits.

3. **Maximum XOR of Two Numbers in an Array** - Uses bitwise trie to track bits, similar to how we track occupied bits here.

4. **Subarrays with K Different Integers** - Sliding window tracking state (count of elements), though with hashmap instead of bitmask.

## Key Takeaways

1. **Bitwise AND = 0 means no shared 1-bits**: This is the fundamental insight. If `a & b = 0`, then `a` and `b` have no 1s in the same bit position.

2. **Sliding window with state compression**: When window validity depends on some property that can be compressed into a small state (like a 32-bit integer for bits), you can get O(n) solutions instead of O(n²).

3. **XOR is the inverse of OR for non-overlapping bits**: If you add elements with OR and they don't share bits, you can remove them with XOR. This is cleaner than using `mask &= ~element`.

Related problems: [Longest Substring Without Repeating Characters](/problem/longest-substring-without-repeating-characters), [Bitwise AND of Numbers Range](/problem/bitwise-and-of-numbers-range), [Bitwise ORs of Subarrays](/problem/bitwise-ors-of-subarrays)
