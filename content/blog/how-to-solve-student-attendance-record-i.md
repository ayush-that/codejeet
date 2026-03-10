---
title: "How to Solve Student Attendance Record I — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Student Attendance Record I. Easy difficulty, 50.0% acceptance rate. Topics: String."
date: "2028-02-14"
category: "dsa-patterns"
tags: ["student-attendance-record-i", "string", "easy"]
---

# How to Solve Student Attendance Record I

This problem asks us to determine whether a student's attendance record qualifies for an award based on two simple rules: the student cannot have more than one 'A' (absent) day, and cannot have three or more consecutive 'L' (late) days. While the problem is conceptually straightforward, it's interesting because it tests your ability to carefully track multiple conditions simultaneously while handling edge cases efficiently.

## Visual Walkthrough

Let's trace through an example step by step to build intuition. Consider the attendance record: `"PPALLP"`

**Step 1:** Initialize counters

- `absentCount = 0` (tracks total 'A' occurrences)
- `consecutiveLateCount = 0` (tracks consecutive 'L's)

**Step 2:** Process each character:

- `'P'`: Reset `consecutiveLateCount = 0`, `absentCount` unchanged
- `'P'`: Reset `consecutiveLateCount = 0`, `absentCount` unchanged
- `'A'`: Increment `absentCount = 1`, reset `consecutiveLateCount = 0`
- `'L'`: Increment `consecutiveLateCount = 1`
- `'L'`: Increment `consecutiveLateCount = 2`
- `'P'`: Reset `consecutiveLateCount = 0`

**Step 3:** Check conditions:

- `absentCount = 1` (≤ 1) ✓
- Maximum `consecutiveLateCount` was 2 (< 3) ✓

Result: `True` - the student qualifies for the award.

Now let's try `"PPALLL"`:

- Process `'P'`, `'P'`, `'A'` (absentCount = 1)
- Process `'L'` (consecutiveLateCount = 1)
- Process `'L'` (consecutiveLateCount = 2)
- Process `'L'` (consecutiveLateCount = 3) → Immediately fails!

The key insight is we can check conditions as we go and return `false` immediately when either condition is violated.

## Brute Force Approach

A naive approach might involve multiple passes through the string:

1. First pass: Count all 'A' characters
2. Second pass: Check for "LLL" substring
3. Return true if both conditions pass

While this would work, it's inefficient because we're making multiple passes through the string when we could check everything in a single pass. More importantly, this approach doesn't allow for early termination - even if we find "LLL" early in the string, we'd still complete the entire first pass counting 'A's.

The brute force also might involve using string methods like `count()` or `find()` which internally scan the string, making the solution less efficient than necessary for what should be a simple O(n) single-pass solution.

## Optimal Solution

The optimal solution processes the string in a single pass, tracking both conditions simultaneously. We maintain two counters: one for total absent days, and another for consecutive late days. The consecutive late counter resets whenever we encounter a non-late day. We can return `false` immediately when either condition is violated, making the solution efficient even for worst-case inputs.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def checkRecord(s: str) -> bool:
    """
    Check if a student's attendance record qualifies for an award.

    Rules:
    1. The student was absent ('A') for strictly fewer than 2 days total.
    2. The student was never late ('L') for 3 or more consecutive days.

    Args:
        s: String containing only 'A', 'L', or 'P' characters

    Returns:
        True if the record qualifies for an award, False otherwise
    """
    absent_count = 0
    consecutive_late_count = 0

    # Iterate through each day's attendance record
    for char in s:
        if char == 'A':
            # Increment absent count and check if it exceeds limit
            absent_count += 1
            if absent_count >= 2:
                return False  # Too many absences
            # Reset consecutive late count since this is not a late day
            consecutive_late_count = 0

        elif char == 'L':
            # Increment consecutive late count and check if it reaches 3
            consecutive_late_count += 1
            if consecutive_late_count >= 3:
                return False  # Three consecutive lates

        else:  # char == 'P'
            # Reset consecutive late count for present days
            consecutive_late_count = 0

    # If we've processed all days without violating rules, record qualifies
    return True
```

```javascript
// Time: O(n) | Space: O(1)
/**
 * Check if a student's attendance record qualifies for an award.
 *
 * Rules:
 * 1. The student was absent ('A') for strictly fewer than 2 days total.
 * 2. The student was never late ('L') for 3 or more consecutive days.
 *
 * @param {string} s - String containing only 'A', 'L', or 'P' characters
 * @return {boolean} True if the record qualifies for an award, False otherwise
 */
function checkRecord(s) {
  let absentCount = 0;
  let consecutiveLateCount = 0;

  // Iterate through each day's attendance record
  for (let i = 0; i < s.length; i++) {
    const char = s[i];

    if (char === "A") {
      // Increment absent count and check if it exceeds limit
      absentCount++;
      if (absentCount >= 2) {
        return false; // Too many absences
      }
      // Reset consecutive late count since this is not a late day
      consecutiveLateCount = 0;
    } else if (char === "L") {
      // Increment consecutive late count and check if it reaches 3
      consecutiveLateCount++;
      if (consecutiveLateCount >= 3) {
        return false; // Three consecutive lates
      }
    } else {
      // char === 'P'
      // Reset consecutive late count for present days
      consecutiveLateCount = 0;
    }
  }

  // If we've processed all days without violating rules, record qualifies
  return true;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    /**
     * Check if a student's attendance record qualifies for an award.
     *
     * Rules:
     * 1. The student was absent ('A') for strictly fewer than 2 days total.
     * 2. The student was never late ('L') for 3 or more consecutive days.
     *
     * @param s String containing only 'A', 'L', or 'P' characters
     * @return True if the record qualifies for an award, False otherwise
     */
    public boolean checkRecord(String s) {
        int absentCount = 0;
        int consecutiveLateCount = 0;

        // Iterate through each day's attendance record
        for (int i = 0; i < s.length(); i++) {
            char currentChar = s.charAt(i);

            if (currentChar == 'A') {
                // Increment absent count and check if it exceeds limit
                absentCount++;
                if (absentCount >= 2) {
                    return false;  // Too many absences
                }
                // Reset consecutive late count since this is not a late day
                consecutiveLateCount = 0;

            } else if (currentChar == 'L') {
                // Increment consecutive late count and check if it reaches 3
                consecutiveLateCount++;
                if (consecutiveLateCount >= 3) {
                    return false;  // Three consecutive lates
                }

            } else {  // currentChar == 'P'
                // Reset consecutive late count for present days
                consecutiveLateCount = 0;
            }
        }

        // If we've processed all days without violating rules, record qualifies
        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the string exactly once, performing constant-time operations for each character
- In the worst case, we process all `n` characters (when the record qualifies)
- Best case: We might return early if we find a violation early in the string

**Space Complexity: O(1)**

- We only use a fixed amount of extra space: two integer counters
- No additional data structures that grow with input size
- The input string is not counted toward space complexity as it's part of the input

## Common Mistakes

1. **Forgetting to reset the consecutive late counter**: When you encounter 'A' or 'P', you must reset `consecutiveLateCount` to 0. A common mistake is only resetting it for 'P' but not for 'A', which would incorrectly count 'L's across absent days as consecutive.

2. **Using >= instead of > for comparisons**: The problem says "fewer than 2 days" for absences, which means `absentCount < 2`. Using `absentCount > 1` or `absentCount >= 2` is correct. However, some candidates mistakenly use `absentCount > 2` which would allow 2 absences.

3. **Not checking for three consecutive L's correctly**: Some candidates check for the substring "LLL" but forget that this only catches exactly three consecutive L's. What about four or more? The proper approach is to count consecutive L's and check if the count reaches 3.

4. **Making multiple passes through the string**: While technically correct, using separate passes to count 'A's and check for "LLL" is less efficient and doesn't demonstrate optimal problem-solving. Interviewers expect the single-pass solution.

## When You'll See This Pattern

This problem uses a **single-pass scanning with condition tracking** pattern, which appears in many string processing problems:

1. **Maximum Consecutive Ones** (LeetCode 485): Similar pattern of tracking consecutive occurrences while scanning an array.
2. **Longest Substring Without Repeating Characters** (LeetCode 3): While more complex, it also involves scanning while tracking conditions (character occurrences).
3. **String Compression** (LeetCode 443): Requires scanning while counting consecutive identical characters.
4. **Valid Palindrome** (LeetCode 125): Involves scanning from both ends while checking conditions.

The core pattern is: iterate through the data once, maintain state variables to track conditions, and return early when possible. This is efficient and demonstrates good algorithmic thinking.

## Key Takeaways

1. **Single-pass solutions are often optimal for validation problems**: When you need to check multiple conditions on a sequence, see if you can check them all in one pass with early termination.

2. **Reset counters appropriately**: When tracking consecutive occurrences, remember to reset your counter when the sequence breaks. In this case, both 'A' and 'P' break consecutive 'L' sequences.

3. **Read conditions carefully**: "Fewer than 2" means < 2, not ≤ 2. "3 or more consecutive" means ≥ 3 consecutive. Precise understanding of inequalities is crucial.

Related problems: [Student Attendance Record II](/problem/student-attendance-record-ii)
