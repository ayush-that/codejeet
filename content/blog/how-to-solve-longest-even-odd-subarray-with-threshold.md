---
title: "How to Solve Longest Even Odd Subarray With Threshold — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Longest Even Odd Subarray With Threshold. Easy difficulty, 31.6% acceptance rate. Topics: Array, Sliding Window."
date: "2028-07-11"
category: "dsa-patterns"
tags: ["longest-even-odd-subarray-with-threshold", "array", "sliding-window", "easy"]
---

# How to Solve Longest Even Odd Subarray With Threshold

This problem asks us to find the longest contiguous subarray where: (1) the first element is even, (2) consecutive elements alternate between even and odd, and (3) all elements are ≤ threshold. The challenge lies in efficiently tracking alternating patterns while respecting the threshold constraint across a sliding window.

## Visual Walkthrough

Let's trace through `nums = [3, 2, 5, 4, 6, 7]` with `threshold = 6`:

1. Start at index 0: `nums[0] = 3` (odd) - violates "first element must be even", so skip.
2. Index 1: `nums[1] = 2` (even) and ≤6 ✓ Start subarray at l=1
   - Check i=2: `nums[2]=5` (odd) and ≤6 ✓ Pattern holds (even→odd)
   - Check i=3: `nums[3]=4` (even) and ≤6 ✓ Pattern holds (odd→even)
   - Check i=4: `nums[4]=6` (even) ✗ Pattern broken! (even→even doesn't alternate)
     Current length = 3 (indices 1-3)
3. Index 2: `nums[2]=5` (odd) - violates "first element must be even", skip.
4. Index 3: `nums[3]=4` (even) and ≤6 ✓ Start at l=3
   - Check i=4: `nums[4]=6` (even) ✗ Pattern broken immediately
     Length = 1
5. Index 4: `nums[4]=6` (even) and ≤6 ✓ Start at l=4
   - Check i=5: `nums[5]=7` (odd) and ≤6 ✓ Pattern holds (even→odd)
     End of array reached
     Length = 2
6. Index 5: `nums[5]=7` (odd) - violates first element condition

Maximum length = max(3, 1, 2) = 3 (subarray [2, 5, 4])

The key insight: once the alternating pattern breaks or we hit an element > threshold, we must restart our search from the current index.

## Brute Force Approach

A naive solution would check every possible subarray `(l, r)`:

1. For each starting index `l` from 0 to n-1
2. For each ending index `r` from l to n-1
3. Check if `nums[l]` is even
4. Check if all elements ≤ threshold
5. Check if consecutive elements alternate parity

This requires O(n³) time in worst case (O(n²) subarrays × O(n) validation per subarray). Even with optimization, it's O(n²), which is inefficient for n up to 100,000.

What makes brute force fail? We're re-checking the same conditions repeatedly. If a subarray from l to r is valid, checking l to r+1 only requires verifying one new element, not the entire subarray again.

## Optimal Solution

We can solve this in a single pass using a modified sliding window approach. The key observation: when we encounter an invalid element (wrong parity or > threshold), we must restart from the current position, not just move the left pointer forward.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def longestAlternatingSubarray(self, nums, threshold):
    """
    Find longest subarray where:
    1. First element is even
    2. Consecutive elements alternate even/odd
    3. All elements <= threshold
    """
    n = len(nums)
    max_len = 0
    current_len = 0

    for i in range(n):
        # Case 1: We can extend current valid subarray
        if current_len > 0:
            # Check if current element can extend the subarray
            # Must satisfy: 1) <= threshold, 2) alternates parity with previous
            if (nums[i] <= threshold and
                nums[i] % 2 != nums[i-1] % 2):
                current_len += 1
            else:
                # Current element breaks the pattern
                # Reset and check if current element can start new subarray
                current_len = 0
                if nums[i] % 2 == 0 and nums[i] <= threshold:
                    current_len = 1

        # Case 2: Start new subarray from current element
        elif nums[i] % 2 == 0 and nums[i] <= threshold:
            current_len = 1

        # Update maximum length found so far
        max_len = max(max_len, current_len)

    return max_len
```

```javascript
// Time: O(n) | Space: O(1)
function longestAlternatingSubarray(nums, threshold) {
  /**
   * Find longest subarray where:
   * 1. First element is even
   * 2. Consecutive elements alternate even/odd
   * 3. All elements <= threshold
   */
  const n = nums.length;
  let maxLen = 0;
  let currentLen = 0;

  for (let i = 0; i < n; i++) {
    // Case 1: We can extend current valid subarray
    if (currentLen > 0) {
      // Check if current element can extend the subarray
      // Must satisfy: 1) <= threshold, 2) alternates parity with previous
      if (nums[i] <= threshold && nums[i] % 2 !== nums[i - 1] % 2) {
        currentLen++;
      } else {
        // Current element breaks the pattern
        // Reset and check if current element can start new subarray
        currentLen = 0;
        if (nums[i] % 2 === 0 && nums[i] <= threshold) {
          currentLen = 1;
        }
      }
    }
    // Case 2: Start new subarray from current element
    else if (nums[i] % 2 === 0 && nums[i] <= threshold) {
      currentLen = 1;
    }

    // Update maximum length found so far
    maxLen = Math.max(maxLen, currentLen);
  }

  return maxLen;
}
```

```java
// Time: O(n) | Space: O(1)
public int longestAlternatingSubarray(int[] nums, int threshold) {
    /**
     * Find longest subarray where:
     * 1. First element is even
     * 2. Consecutive elements alternate even/odd
     * 3. All elements <= threshold
     */
    int n = nums.length;
    int maxLen = 0;
    int currentLen = 0;

    for (int i = 0; i < n; i++) {
        // Case 1: We can extend current valid subarray
        if (currentLen > 0) {
            // Check if current element can extend the subarray
            // Must satisfy: 1) <= threshold, 2) alternates parity with previous
            if (nums[i] <= threshold &&
                nums[i] % 2 != nums[i - 1] % 2) {
                currentLen++;
            } else {
                // Current element breaks the pattern
                // Reset and check if current element can start new subarray
                currentLen = 0;
                if (nums[i] % 2 == 0 && nums[i] <= threshold) {
                    currentLen = 1;
                }
            }
        }
        // Case 2: Start new subarray from current element
        else if (nums[i] % 2 == 0 && nums[i] <= threshold) {
            currentLen = 1;
        }

        // Update maximum length found so far
        maxLen = Math.max(maxLen, currentLen);
    }

    return maxLen;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)** - We make a single pass through the array, performing constant-time operations at each index. The key is that we never backtrack or re-examine elements.

**Space Complexity: O(1)** - We only use a few integer variables (`max_len`, `current_len`) regardless of input size. No additional data structures are needed.

## Common Mistakes

1. **Forgetting to reset properly when pattern breaks**: Some candidates try to use a traditional sliding window with left/right pointers but fail to handle the "restart from current index" requirement. When the pattern breaks at index i, you can't just increment left pointer - you must check if nums[i] itself can start a new valid subarray.

2. **Incorrect parity checking**: Using `(nums[i] % 2 == 0 && nums[i-1] % 2 == 1) OR (nums[i] % 2 == 1 && nums[i-1] % 2 == 0)` is verbose. The cleaner check is `nums[i] % 2 != nums[i-1] % 2`.

3. **Missing the threshold check for the first element**: Remember that ALL elements must be ≤ threshold, including the first one. Don't just check `nums[i] % 2 == 0` - also verify `nums[i] <= threshold`.

4. **Off-by-one errors in current_len tracking**: When starting a new subarray, set `current_len = 1` (not 0). When extending, increment by 1. The length represents number of elements in current valid subarray.

## When You'll See This Pattern

This problem combines two common patterns:

1. **Alternating sequence problems**: Similar to "Longest Alternating Subsequence" but for contiguous subarrays. The parity alternation check appears in problems like:
   - **1524. Number of Sub-arrays With Odd Sum** - Also deals with parity patterns
   - **1869. Longer Contiguous Segments of Ones than Zeros** - Alternating patterns in binary arrays

2. **Conditional sliding window**: Unlike standard sliding window where you adjust left pointer incrementally, here you "jump" the left pointer to current position when conditions fail. This pattern appears in:
   - **1004. Max Consecutive Ones III** - Reset when you can't flip enough zeros
   - **1493. Longest Subarray of 1's After Deleting One Element** - Similar restart logic

## Key Takeaways

1. **Not all sliding windows move left pointer incrementally**: When constraints require contiguous validity from a starting point, you may need to restart the window entirely at the current index rather than sliding left forward.

2. **Track state, not just pointers**: Instead of maintaining left/right pointers, we can track `current_len` which implicitly represents a valid subarray ending at current index. This simplifies logic for problems with "starting condition" requirements.

3. **Combine multiple conditions efficiently**: Check the most restrictive condition first (parity alternation) before other checks to short-circuit and avoid unnecessary computations.

[Practice this problem on CodeJeet](/problem/longest-even-odd-subarray-with-threshold)
