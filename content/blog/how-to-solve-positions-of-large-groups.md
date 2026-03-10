---
title: "How to Solve Positions of Large Groups — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Positions of Large Groups. Easy difficulty, 53.8% acceptance rate. Topics: String."
date: "2027-02-18"
category: "dsa-patterns"
tags: ["positions-of-large-groups", "string", "easy"]
---

## How to Solve Positions of Large Groups

This problem asks us to find all "large groups" in a string — consecutive sequences of the same character that are at least 3 characters long. While the concept is straightforward, the challenge lies in correctly tracking group boundaries and handling edge cases like groups at the very end of the string. The key insight is that we need to scan through the string once, identifying when a group starts and ends, then check if it meets the length requirement.

---

## Visual Walkthrough

Let's trace through `s = "abbxxxxzyy"` step by step:

1. **Start at index 0**: Character `'a'` begins our first group
   - Compare `s[0]` with `s[1]`: `'a'` vs `'b'` → different
   - Group length = 1 (0 to 0) → not large (needs ≥3)
   - Move to index 1

2. **Index 1**: Character `'b'` begins second group
   - Compare `s[1]` with `s[2]`: `'b'` vs `'b'` → same, continue
   - Compare `s[2]` with `s[3]`: `'b'` vs `'x'` → different
   - Group length = 2 (1 to 2) → not large
   - Move to index 3

3. **Index 3**: Character `'x'` begins third group
   - Compare `s[3]` with `s[4]`: `'x'` vs `'x'` → same, continue
   - Compare `s[4]` with `s[5]`: `'x'` vs `'x'` → same, continue
   - Compare `s[5]` with `s[6]`: `'x'` vs `'x'` → same, continue
   - Compare `s[6]` with `s[7]`: `'x'` vs `'z'` → different
   - Group length = 4 (3 to 6) → large group! Add [3, 6] to result
   - Move to index 7

4. **Index 7**: Character `'z'` begins fourth group
   - Compare `s[7]` with `s[8]`: `'z'` vs `'y'` → different
   - Group length = 1 (7 to 7) → not large
   - Move to index 8

5. **Index 8**: Character `'y'` begins fifth group
   - Compare `s[8]` with `s[9]`: `'y'` vs `'y'` → same, continue
   - Reached end of string (index 9 is last)
   - Group length = 2 (8 to 9) → not large

**Final result**: `[[3, 6]]`

---

## Brute Force Approach

A naive approach might try to check every possible substring:

1. For each starting index `i` from 0 to `n-1`
2. For each ending index `j` from `i` to `n-1`
3. Check if all characters from `i` to `j` are the same
4. If yes and `j-i+1 ≥ 3`, add to result

This would be O(n³) time (O(n²) substrings, each checked in O(n) time). Even with optimization, checking every substring is wasteful since we know groups must consist of identical characters. The brute force fails because it doesn't leverage the consecutive nature of groups — we can find all groups in a single pass.

---

## Optimal Solution

The optimal solution uses a single pass through the string with two pointers. We maintain a `start` pointer at the beginning of each group and move an `i` pointer through the string. When we find a character different from the current group's character, we check if the group length meets the threshold.

<div class="code-group">

```python
# Time: O(n) | Space: O(1) excluding output list
def largeGroupPositions(s: str):
    """
    Find all intervals where the same character appears consecutively
    for at least 3 characters.

    Args:
        s: Input string of lowercase letters

    Returns:
        List of [start, end] intervals (0-indexed, inclusive)
    """
    result = []
    n = len(s)

    # We'll use i to traverse the string
    i = 0

    while i < n:
        # Start of a new group
        start = i

        # Move i forward while characters are the same
        while i < n and s[i] == s[start]:
            i += 1

        # i now points to first character after the group
        # Group length = i - start
        if i - start >= 3:
            # Add interval [start, end] where end = i - 1
            result.append([start, i - 1])

    return result
```

```javascript
// Time: O(n) | Space: O(1) excluding output array
function largeGroupPositions(s) {
  /**
   * Find all intervals where the same character appears consecutively
   * for at least 3 characters.
   *
   * @param {string} s - Input string of lowercase letters
   * @return {number[][]} - Array of [start, end] intervals (0-indexed, inclusive)
   */
  const result = [];
  const n = s.length;

  let i = 0;

  while (i < n) {
    // Start of a new group
    const start = i;

    // Move i forward while characters are the same
    while (i < n && s[i] === s[start]) {
      i++;
    }

    // i now points to first character after the group
    // Group length = i - start
    if (i - start >= 3) {
      // Add interval [start, end] where end = i - 1
      result.push([start, i - 1]);
    }
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(1) excluding output list
import java.util.*;

class Solution {
    public List<List<Integer>> largeGroupPositions(String s) {
        /**
         * Find all intervals where the same character appears consecutively
         * for at least 3 characters.
         *
         * @param s - Input string of lowercase letters
         * @return List of [start, end] intervals (0-indexed, inclusive)
         */
        List<List<Integer>> result = new ArrayList<>();
        int n = s.length();

        int i = 0;

        while (i < n) {
            // Start of a new group
            int start = i;

            // Move i forward while characters are the same
            while (i < n && s.charAt(i) == s.charAt(start)) {
                i++;
            }

            // i now points to first character after the group
            // Group length = i - start
            if (i - start >= 3) {
                // Add interval [start, end] where end = i - 1
                List<Integer> interval = new ArrayList<>();
                interval.add(start);
                interval.add(i - 1);
                result.add(interval);
            }
        }

        return result;
    }
}
```

</div>

**Key implementation details:**

1. The outer `while` loop moves `i` from group to group
2. The inner `while` loop expands `i` to the end of the current group
3. After the inner loop, `i` points to the first character of the _next_ group (or end of string)
4. We calculate group length as `i - start` (not `i - start + 1`) because `i` has already moved past the group
5. The interval is `[start, i-1]` because `i-1` is the last character of the group

---

## Complexity Analysis

**Time Complexity: O(n)**

- We traverse the string exactly once with the `i` pointer
- Each character is examined exactly twice: once when it becomes the start of a group, and once when we compare it in the inner loop
- This gives us linear time complexity

**Space Complexity: O(1) excluding output**

- We only use a few integer variables (`i`, `start`, `n`)
- The output list is not counted toward space complexity in standard analysis
- If we count the output, it would be O(k) where k is the number of large groups

---

## Common Mistakes

1. **Off-by-one errors with interval endpoints**
   - Mistake: Using `[start, i]` instead of `[start, i-1]`
   - Why: Forgetting that `i` points to the first character _after_ the group
   - Fix: Always remember that after the inner loop, `i` is one position past the group

2. **Forgetting to check the last group**
   - Mistake: The loop ends before checking if the final group is large
   - Why: Some implementations check groups only when a character changes
   - Fix: Our implementation handles this naturally because we check after _every_ inner loop

3. **Incorrect length calculation**
   - Mistake: Calculating length as `i - start + 1`
   - Why: This would be correct if `i` hadn't moved past the group
   - Fix: Since `i` ends up pointing past the group, length is simply `i - start`

4. **Not handling empty or very short strings**
   - Mistake: Assuming the string has at least 3 characters
   - Why: Edge cases like `""`, `"a"`, `"aa"` should return empty list
   - Fix: Our implementation handles these correctly because the while loop won't enter if `n < 3`

---

## When You'll See This Pattern

This "two-pointer group expansion" pattern appears in many string and array problems:

1. **String Compression** (LeetCode 443)
   - Similar: Group identical characters, but here you modify the array in-place
   - Difference: You count groups and sometimes write the count

2. **Summary Ranges** (LeetCode 228)
   - Similar: Find consecutive sequences (of numbers), return intervals
   - Difference: Numbers increment by 1, not just equal values

3. **Partition Labels** (LeetCode 763)
   - Similar: Find intervals in strings based on character properties
   - Difference: More complex grouping rule (last occurrence matters)

The core pattern is: **Use two pointers to mark the start and end of a "segment" that satisfies some condition, then process that segment before moving on.**

---

## Key Takeaways

1. **Two-pointer group expansion** is ideal for finding consecutive sequences with identical properties. The outer loop moves between groups, the inner loop expands within a group.

2. **Careful with pointer positions**: After expanding a pointer in an inner loop, it points to the first element _outside_ the current group. Adjust your indices accordingly.

3. **This pattern generalizes**: Any time you need to process "runs" or "streaks" in sequential data (strings, arrays), consider this approach. It's O(n) and uses minimal extra space.

---

Related problems: [Divide a String Into Groups of Size k](/problem/divide-a-string-into-groups-of-size-k)
