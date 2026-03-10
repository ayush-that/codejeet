---
title: "How to Solve Check if Binary String Has at Most One Segment of Ones — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Check if Binary String Has at Most One Segment of Ones. Easy difficulty, 39.4% acceptance rate. Topics: String."
date: "2028-05-04"
category: "dsa-patterns"
tags: ["check-if-binary-string-has-at-most-one-segment-of-ones", "string", "easy"]
---

# How to Solve "Check if Binary String Has at Most One Segment of Ones"

This problem asks us to determine if a binary string contains at most one contiguous segment of '1's. The key detail is that the string is guaranteed to have no leading zeros, meaning it always starts with '1'. This constraint simplifies our logic significantly. The tricky part is recognizing that we don't need to count segments—we just need to verify that once we encounter a zero after the initial ones, we never see another '1'.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `s = "11001"`:

1. The string starts with '1' (no leading zeros guarantee)
2. We continue seeing '1's: positions 0 and 1 are both '1'
3. At position 2, we encounter our first '0'
4. Now we need to check: if we see any '1' after this point, we have multiple segments
5. Position 3 is '0' (still okay)
6. Position 4 is '1' (problem! This creates a second segment)

The string `"11001"` has two segments: `"11"` and `"1"`, so it should return `false`.

Now consider `s = "1110"`:

1. Starts with '1'
2. Continue through positions 0, 1, 2 (all '1')
3. Position 3 is '0'
4. No more characters after this, so we never see another '1'
5. Only one segment exists, so return `true`

The insight: Once we transition from '1' to '0', we must not see any more '1's.

## Brute Force Approach

A naive approach would be to actually count segments by scanning the string and tracking state changes:

1. Initialize `segment_count = 0` and `in_segment = false`
2. For each character in the string:
   - If character is '1' and `in_segment` is false: increment `segment_count` and set `in_segment = true`
   - If character is '0': set `in_segment = false`
3. Return `true` if `segment_count <= 1`

While this works, it's more complex than needed. The problem only asks for "at most one" segment, not the exact count. We can optimize by stopping early: once we find a second segment, we can immediately return `false`.

## Optimal Solution

The optimal solution leverages the "no leading zeros" constraint. Since the string must start with '1', we know:

- If there are no zeros at all, we have exactly one segment
- If there are zeros, they must appear after all the ones (contiguously) to have only one segment

Thus, we can simply check if the string contains the substring `"01"`. If it does, that means we have a zero followed by a one, which indicates a second segment of ones.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def checkOnesSegment(s: str) -> bool:
    """
    Check if binary string has at most one contiguous segment of ones.

    The key insight: Since there are no leading zeros, the string must start with '1'.
    If we ever see the pattern "01", that means we've transitioned from zeros back to ones,
    indicating a second segment.

    Args:
        s: Binary string without leading zeros

    Returns:
        True if s contains at most one contiguous segment of ones
    """
    # Check if "01" exists in the string
    # If it does, we have at least two segments
    return "01" not in s
```

```javascript
// Time: O(n) | Space: O(1)
/**
 * Check if binary string has at most one contiguous segment of ones.
 *
 * The key insight: Since there are no leading zeros, the string must start with '1'.
 * If we ever see the pattern "01", that means we've transitioned from zeros back to ones,
 * indicating a second segment.
 *
 * @param {string} s - Binary string without leading zeros
 * @return {boolean} True if s contains at most one contiguous segment of ones
 */
function checkOnesSegment(s) {
  // Check if "01" exists in the string
  // If it does, we have at least two segments
  return !s.includes("01");
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    /**
     * Check if binary string has at most one contiguous segment of ones.
     *
     * The key insight: Since there are no leading zeros, the string must start with '1'.
     * If we ever see the pattern "01", that means we've transitioned from zeros back to ones,
     * indicating a second segment.
     *
     * @param s Binary string without leading zeros
     * @return True if s contains at most one contiguous segment of ones
     */
    public boolean checkOnesSegment(String s) {
        // Check if "01" exists in the string
        // If it does, we have at least two segments
        return !s.contains("01");
    }
}
```

</div>

## Alternative Implementation

Some interviewers might prefer an explicit loop to demonstrate the algorithmic thinking. Here's an alternative approach that scans the string once:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def checkOnesSegment(s: str) -> bool:
    """
    Alternative implementation using explicit scanning.

    We look for the first zero, then check if any ones appear after it.
    """
    found_zero = False

    for char in s:
        if char == '0':
            found_zero = True
        elif found_zero and char == '1':
            # We found a one after a zero - second segment!
            return False

    return True
```

```javascript
// Time: O(n) | Space: O(1)
function checkOnesSegment(s) {
  /**
   * Alternative implementation using explicit scanning.
   *
   * We look for the first zero, then check if any ones appear after it.
   */
  let foundZero = false;

  for (let i = 0; i < s.length; i++) {
    if (s[i] === "0") {
      foundZero = true;
    } else if (foundZero && s[i] === "1") {
      // We found a one after a zero - second segment!
      return false;
    }
  }

  return true;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public boolean checkOnesSegment(String s) {
        /**
         * Alternative implementation using explicit scanning.
         *
         * We look for the first zero, then check if any ones appear after it.
         */
        boolean foundZero = false;

        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c == '0') {
                foundZero = true;
            } else if (foundZero && c == '1') {
                // We found a one after a zero - second segment!
                return false;
            }
        }

        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the length of the string. In the worst case, we need to scan the entire string to either find "01" or confirm it doesn't exist.

**Space Complexity:** O(1) for all implementations. We only use a constant amount of extra space regardless of input size.

## Common Mistakes

1. **Overcomplicating with segment counting:** Some candidates try to actually count segments by tracking state changes. While this works, it's more code and more error-prone than the simple "01" check.

2. **Forgetting the "no leading zeros" constraint:** If you miss this detail, you might write code that handles cases like "0011" (which won't appear in test cases). The constraint guarantees the string starts with '1', which simplifies the logic.

3. **Off-by-one errors in loop implementations:** When writing the explicit loop version, it's easy to incorrectly handle the transition logic. Always test with edge cases like "1", "10", "101".

4. **Using regex unnecessarily:** While `return not re.search("01", s)` works in Python, it's overkill and less efficient than the simple string method.

## When You'll See This Pattern

This problem teaches pattern recognition in sequences. The core technique—looking for a specific pattern that indicates failure—appears in many string problems:

1. **Longer Contiguous Segments of Ones than Zeros (Easy):** Similar segment counting problem but requires comparing lengths of segments.

2. **Max Consecutive Ones (Easy):** Finding the maximum length of consecutive '1's in a binary array.

3. **Monotonic Array (Easy):** Checking if an array is entirely non-increasing or non-decreasing by looking for pattern violations.

The key insight is recognizing when you can determine the answer by finding a single violating pattern rather than computing complete counts or states.

## Key Takeaways

1. **Constraints are clues:** The "no leading zeros" constraint isn't just a random detail—it's the key that enables the simple "01" check solution. Always pay close attention to problem constraints.

2. **Look for pattern violations:** Many validation problems can be solved by searching for a single pattern that indicates failure, rather than computing complete state.

3. **Simple is often better:** The one-line solution `return "01" not in s` is not only correct but also more readable and less error-prone than more complex approaches.

Related problems: [Longer Contiguous Segments of Ones than Zeros](/problem/longer-contiguous-segments-of-ones-than-zeros)
