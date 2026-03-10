---
title: "How to Solve Form Array by Concatenating Subarrays of Another Array — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Form Array by Concatenating Subarrays of Another Array. Medium difficulty, 54.7% acceptance rate. Topics: Array, Two Pointers, Greedy, String Matching."
date: "2029-11-01"
category: "dsa-patterns"
tags:
  [
    "form-array-by-concatenating-subarrays-of-another-array",
    "array",
    "two-pointers",
    "greedy",
    "medium",
  ]
---

# How to Solve "Form Array by Concatenating Subarrays of Another Array"

This problem asks whether we can find disjoint subarrays in `nums` that match each group in `groups` in order. The challenge is that the subarrays must appear consecutively in `nums` and maintain the same order as the groups, but there can be gaps between them. This is essentially a pattern matching problem where we need to find multiple patterns sequentially in a larger array.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:**

```
groups = [[1,2,3], [4,5]]
nums = [1,2,3,0,4,5]
```

**Step-by-step process:**

1. **Find first group [1,2,3] in nums:**
   - Start at index 0: nums[0..2] = [1,2,3] ✓ matches
   - Mark that we've used indices 0-2

2. **Find second group [4,5] in nums:**
   - Start searching after index 2 (since we used 0-2)
   - Check index 3: nums[3] = 0 ≠ 4
   - Check index 4: nums[4..5] = [4,5] ✓ matches
   - All groups found in order → return `true`

**Another example:**

```
groups = [[1,2], [3,4]]
nums = [1,2,3,5,4]
```

1. **Find [1,2] in nums:**
   - nums[0..1] = [1,2] ✓ matches
   - Used indices 0-1

2. **Find [3,4] in nums:**
   - Start after index 1
   - Check index 2: nums[2] = 3 (good start)
   - Check index 3: nums[3] = 5 ≠ 4 ✗
   - Try next starting position...
   - No valid match found → return `false`

The key insight: we need to greedily find each group in order, always starting our search after the last matched position.

## Brute Force Approach

A naive approach would try all possible starting positions for each group:

1. For each group in `groups`:
   - Try every possible starting index in `nums` from current position onward
   - Check if the subarray matches the group
   - If found, move to next group starting after this match
   - If not found, backtrack and try different starting positions

This backtracking approach would have exponential time complexity in the worst case. For each of `n` groups, we might try `O(m)` starting positions (where `m` is length of `nums`), and for each position check `O(k)` elements (where `k` is average group length). The worst-case complexity could be `O(m^n * k)`.

The problem with backtracking is it's unnecessarily complex. We don't actually need to backtrack because if we find a match for a group, we should take the earliest valid match and continue. If there's no match starting from our current position, then no solution exists.

## Optimized Approach

The optimal solution uses a **greedy two-pointer approach**:

**Key Insight:** Since groups must appear in order and subarrays must be disjoint, we can process groups sequentially. For each group, we search for it in `nums` starting from our current position. If found, we move our position past the match and continue to the next group. If any group cannot be found, we return `false`.

**Why greedy works:** There's no benefit to skipping an earlier valid match. If we find group `i` starting at position `p`, and there's another match starting at `q > p`, choosing the later match only reduces the available space for remaining groups. The earliest match gives us the most flexibility.

**Algorithm:**

1. Initialize `numsIndex = 0` to track our current position in `nums`
2. For each `group` in `groups`:
   - Try to find `group` in `nums` starting from `numsIndex`
   - If found at position `start`, set `numsIndex = start + len(group)`
   - If not found, return `false`
3. If all groups found, return `true`

**Search optimization:** We can use a simple linear scan to check for each group since arrays are relatively small, but we need to be careful about bounds checking.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * m) where n = len(groups), m = len(nums)
# Space: O(1) - only using pointers, no extra data structures
def canChoose(groups, nums):
    """
    Check if we can find all groups in nums in order as disjoint subarrays.

    Args:
        groups: List[List[int]] - patterns to find
        nums: List[int] - array to search in

    Returns:
        bool - True if all groups found in order, False otherwise
    """
    # Pointer to track current position in nums
    nums_index = 0
    n = len(nums)

    # Try to find each group in order
    for group in groups:
        group_len = len(group)
        found = False

        # Search for current group starting from nums_index
        # We need enough remaining elements for the group
        while nums_index <= n - group_len:
            # Check if subarray matches the group
            match = True
            for i in range(group_len):
                if nums[nums_index + i] != group[i]:
                    match = False
                    break

            if match:
                # Found the group! Move past it and break to next group
                nums_index += group_len
                found = True
                break
            else:
                # No match at current position, try next starting index
                nums_index += 1

        # If we couldn't find this group, entire search fails
        if not found:
            return False

    # All groups found successfully
    return True
```

```javascript
// Time: O(n * m) where n = groups.length, m = nums.length
// Space: O(1) - only using pointers, no extra data structures
function canChoose(groups, nums) {
  /**
   * Check if we can find all groups in nums in order as disjoint subarrays.
   *
   * @param {number[][]} groups - patterns to find
   * @param {number[]} nums - array to search in
   * @return {boolean} - true if all groups found in order, false otherwise
   */
  let numsIndex = 0; // Current position in nums
  const n = nums.length;

  // Try to find each group in order
  for (const group of groups) {
    const groupLen = group.length;
    let found = false;

    // Search for current group starting from numsIndex
    // We need enough remaining elements for the group
    while (numsIndex <= n - groupLen) {
      // Check if subarray matches the group
      let match = true;
      for (let i = 0; i < groupLen; i++) {
        if (nums[numsIndex + i] !== group[i]) {
          match = false;
          break;
        }
      }

      if (match) {
        // Found the group! Move past it and break to next group
        numsIndex += groupLen;
        found = true;
        break;
      } else {
        // No match at current position, try next starting index
        numsIndex++;
      }
    }

    // If we couldn't find this group, entire search fails
    if (!found) {
      return false;
    }
  }

  // All groups found successfully
  return true;
}
```

```java
// Time: O(n * m) where n = groups.length, m = nums.length
// Space: O(1) - only using pointers, no extra data structures
class Solution {
    public boolean canChoose(int[][] groups, int[] nums) {
        /**
         * Check if we can find all groups in nums in order as disjoint subarrays.
         *
         * @param groups - patterns to find
         * @param nums - array to search in
         * @return true if all groups found in order, false otherwise
         */
        int numsIndex = 0;  // Current position in nums
        int n = nums.length;

        // Try to find each group in order
        for (int[] group : groups) {
            int groupLen = group.length;
            boolean found = false;

            // Search for current group starting from numsIndex
            // We need enough remaining elements for the group
            while (numsIndex <= n - groupLen) {
                // Check if subarray matches the group
                boolean match = true;
                for (int i = 0; i < groupLen; i++) {
                    if (nums[numsIndex + i] != group[i]) {
                        match = false;
                        break;
                    }
                }

                if (match) {
                    // Found the group! Move past it and break to next group
                    numsIndex += groupLen;
                    found = true;
                    break;
                } else {
                    // No match at current position, try next starting index
                    numsIndex++;
                }
            }

            // If we couldn't find this group, entire search fails
            if (!found) {
                return false;
            }
        }

        // All groups found successfully
        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** `O(n * m)` where:

- `n` is the total number of elements across all groups
- `m` is the length of `nums`

In the worst case, for each group we might scan through most of `nums`. The inner loop checks each element of the group against `nums`, but since we move `numsIndex` forward with each failed attempt, the total work is bounded by `O(n * m)`.

**Space Complexity:** `O(1)` - we only use a few integer variables to track positions. No additional data structures are needed.

**Why not O(n _ m _ k)?** Some might think the complexity is cubic because we have three nested loops, but notice that `numsIndex` moves forward with each iteration. In total, we examine each position in `nums` at most once for each group, giving us `O(n * m)`.

## Common Mistakes

1. **Forgetting to check bounds:** When checking if a group matches at position `i`, you must ensure `i + len(group) <= len(nums)`. Otherwise, you'll get an index out of bounds error.

2. **Not moving numsIndex correctly after a match:** After finding a group, you need to move `numsIndex` past the entire matched subarray, not just one element forward. This ensures groups are disjoint.

3. **Using backtracking unnecessarily:** Some candidates try to implement backtracking to find "better" matches, but this adds exponential complexity. The greedy approach is optimal here.

4. **Mishandling the while loop condition:** The condition `numsIndex <= n - groupLen` is crucial. Using `<` instead of `<=` would miss the case where the group fits exactly at the end of `nums`.

5. **Not resetting the search properly:** When a partial match fails, you should increment `numsIndex` by 1, not by the number of matched elements. For example, if looking for `[1,2,3]` and `nums` has `[1,2,4]` at position 0, you should try position 1 next, not position 3.

## When You'll See This Pattern

This pattern of sequentially matching multiple patterns in a larger sequence appears in several problems:

1. **Word Search (LeetCode 79)** - Similar concept of searching for a pattern (word) in a grid, though with backtracking for branching paths.

2. **Implement strStr() (LeetCode 28)** - Finding a needle in a haystack is a simpler version of this problem (finding one pattern instead of multiple).

3. **Is Subsequence (LeetCode 392)** - Checking if one sequence appears in order within another, though not necessarily consecutively.

4. **Repeated String Match (LeetCode 686)** - Finding how many times you need to repeat a string to contain another as a substring.

The core technique is **greedy sequential matching with two pointers** - maintain a pointer in the main sequence and try to match patterns in order, advancing the pointer as you find matches.

## Key Takeaways

1. **Greedy works for ordered disjoint matching:** When you need to find multiple patterns in order within a larger sequence, and patterns must be disjoint, taking the earliest valid match for each pattern is optimal. Skipping an earlier match never helps.

2. **Two-pointer technique for sequence matching:** Maintain one pointer in the main sequence and match patterns sequentially. This avoids unnecessary backtracking and keeps the solution simple and efficient.

3. **Boundary checking is critical:** Always verify you have enough remaining elements before attempting to match a pattern. Off-by-one errors are common in these types of problems.

4. **Problem decomposition helps:** Break the problem into "find this group, then find the next group" rather than trying to solve everything at once. This simplifies both thinking and implementation.

[Practice this problem on CodeJeet](/problem/form-array-by-concatenating-subarrays-of-another-array)
