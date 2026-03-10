---
title: "How to Solve Latest Time by Replacing Hidden Digits — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Latest Time by Replacing Hidden Digits. Easy difficulty, 43.6% acceptance rate. Topics: String, Greedy."
date: "2028-08-25"
category: "dsa-patterns"
tags: ["latest-time-by-replacing-hidden-digits", "string", "greedy", "easy"]
---

# How to Solve Latest Time by Replacing Hidden Digits

You're given a time string like "2?:?0" where question marks represent hidden digits, and you need to replace them to create the latest possible valid time (between 00:00 and 23:59). What makes this problem interesting is that each digit position has different constraints, and you need to maximize the time while respecting those constraints. The key insight is that you should maximize earlier digits first, since hours contribute more to making a time "later" than minutes.

## Visual Walkthrough

Let's trace through an example: `time = "?4:5?"`

The format is always `hh:mm` where:

- Position 0: tens digit of hour (0-2)
- Position 1: ones digit of hour (0-9, but depends on first digit)
- Position 2: colon (always ':')
- Position 3: tens digit of minute (0-5)
- Position 4: ones digit of minute (0-9)

Our goal: Replace '?' with digits to get the latest valid time.

**Step-by-step reasoning:**

1. **Position 0 (hour tens):** Current char is '?'. We want the largest valid digit here.
   - If we put '2', then position 1 (hour ones) must be 0-3 (since max hour is 23)
   - If we put '1' or '0', position 1 can be 0-9
   - Check position 1: it's '4' (not '?')
   - If we put '2' at position 0, position 1 would be '4', giving hour "24" → invalid
   - So we can't use '2'. Next best is '1' → valid hour "14"
   - Result: position 0 = '1'

2. **Position 1 (hour ones):** Current char is '4' (not '?'), so we keep it.
   - Hour is now "14"

3. **Position 3 (minute tens):** Current char is '5' (not '?'), so we keep it.
   - Minute tens is '5' (valid, since 0-5)

4. **Position 4 (minute ones):** Current char is '?'.
   - We want the largest digit possible: '9'
   - Check: minute "59" is valid (0-59)
   - Result: position 4 = '9'

Final result: `"14:59"` (the latest possible time)

This shows the greedy approach: at each '?' position, try the largest valid digit that keeps the entire time valid.

## Brute Force Approach

A naive approach would be to generate all possible replacements for the '?' characters and check which one is valid and latest. Since there are up to 4 '?' characters (positions 0, 1, 3, 4), and each can be 0-9 (10 possibilities), that's up to 10⁴ = 10,000 combinations to check.

**Why this is inefficient:**

1. We're checking many invalid combinations (like hour > 23 or minute > 59)
2. We need to compare times to find the latest
3. The problem constraints allow a much simpler approach

Even though 10,000 combinations might be acceptable for this problem, the optimal solution is O(1) time and much more elegant. The brute force also requires careful implementation to avoid missing edge cases.

## Optimal Solution

The optimal solution uses a greedy approach with careful constraint checking. We process each position from left to right, always choosing the largest valid digit for that position. The trick is that some positions have dependencies: if position 0 is '2', position 1 can only be 0-3; otherwise position 1 can be 0-9.

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def maximumTime(time):
    # Convert string to list for easy modification
    time_list = list(time)

    # Position 0: hour tens digit
    if time_list[0] == '?':
        # We can use '2' only if position 1 is '?' or 0-3
        # Otherwise we must use '1' (if position 1 is 4-9) or '0' (if position 1 is 0-9)
        if time_list[1] == '?' or int(time_list[1]) <= 3:
            time_list[0] = '2'  # Best case: '2' gives us hour 20-23
        else:
            time_list[0] = '1'  # Can't use '2', so use '1' for hour 10-19

    # Position 1: hour ones digit
    if time_list[1] == '?':
        # If position 0 is '2', we can only use 0-3
        # Otherwise we can use 0-9
        if time_list[0] == '2':
            time_list[1] = '3'  # Largest valid when hour starts with '2'
        else:
            time_list[1] = '9'  # Largest valid when hour starts with '0' or '1'

    # Position 3: minute tens digit
    if time_list[3] == '?':
        time_list[3] = '5'  # Largest valid is '5' (minutes 50-59)

    # Position 4: minute ones digit
    if time_list[4] == '?':
        time_list[4] = '9'  # Largest valid is '9'

    # Convert list back to string
    return ''.join(time_list)
```

```javascript
// Time: O(1) | Space: O(1)
function maximumTime(time) {
  // Convert string to array for easy modification
  const timeArr = time.split("");

  // Position 0: hour tens digit
  if (timeArr[0] === "?") {
    // Check if we can use '2' (requires position 1 to be '?' or 0-3)
    if (timeArr[1] === "?" || parseInt(timeArr[1]) <= 3) {
      timeArr[0] = "2"; // Best case: hour 20-23
    } else {
      timeArr[0] = "1"; // Can't use '2', so hour 10-19
    }
  }

  // Position 1: hour ones digit
  if (timeArr[1] === "?") {
    // If hour starts with '2', max is '3', otherwise '9'
    if (timeArr[0] === "2") {
      timeArr[1] = "3"; // Hour 23 is latest
    } else {
      timeArr[1] = "9"; // Hour 09 or 19 is latest
    }
  }

  // Position 3: minute tens digit
  if (timeArr[3] === "?") {
    timeArr[3] = "5"; // Minutes 50-59 are latest
  }

  // Position 4: minute ones digit
  if (timeArr[4] === "?") {
    timeArr[4] = "9"; // Minutes 59 is latest
  }

  // Convert array back to string
  return timeArr.join("");
}
```

```java
// Time: O(1) | Space: O(1)
public String maximumTime(String time) {
    // Convert to char array for modification
    char[] timeArr = time.toCharArray();

    // Position 0: hour tens digit
    if (timeArr[0] == '?') {
        // Can we use '2'? Only if position 1 is '?' or 0-3
        if (timeArr[1] == '?' || (timeArr[1] >= '0' && timeArr[1] <= '3')) {
            timeArr[0] = '2';  // Hour 20-23
        } else {
            timeArr[0] = '1';  // Hour 10-19
        }
    }

    // Position 1: hour ones digit
    if (timeArr[1] == '?') {
        // If hour starts with '2', max is '3', otherwise '9'
        if (timeArr[0] == '2') {
            timeArr[1] = '3';  // Hour 23
        } else {
            timeArr[1] = '9';  // Hour 09 or 19
        }
    }

    // Position 3: minute tens digit
    if (timeArr[3] == '?') {
        timeArr[3] = '5';  // Minutes 50-59
    }

    // Position 4: minute ones digit
    if (timeArr[4] == '?') {
        timeArr[4] = '9';  // Minutes 59
    }

    return new String(timeArr);
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(1)

- We only examine 5 positions in the string (fixed length)
- Each position requires at most a few comparisons and assignments
- No loops or recursion that scale with input size

**Space Complexity:** O(1) for all solutions

- Python: `list(time)` creates a new list of length 5 → O(1) space
- JavaScript: `split('')` creates an array of length 5 → O(1) space
- Java: `toCharArray()` creates an array of length 5 → O(1) space
- No additional data structures that grow with input

The constant factors are small because the time string always has exactly 5 characters.

## Common Mistakes

1. **Forgetting the hour constraint (max 23):** Some candidates put '9' in position 1 when position 0 is '2', creating invalid times like "29:00". Always check: if hour starts with '2', the second digit can only be 0-3.

2. **Wrong order of processing:** Processing positions right-to-left or in random order can lead to suboptimal results. Always process left-to-right (most significant digit first) to maximize the time.

3. **Not handling the dependency between positions 0 and 1:** When position 0 is '?', you must check position 1 to decide between '2' and '1'. When position 1 is '?', you must check position 0 to decide between '3' and '9'.

4. **Overlooking minute constraints:** The tens digit of minutes (position 3) can only be 0-5, not 0-9. Some candidates mistakenly put '9' there.

## When You'll See This Pattern

This greedy approach with position-specific constraints appears in several time/string problems:

1. **Number of Valid Clock Times (LeetCode 2437):** Similar constraints but asks for count of valid times rather than maximizing one.

2. **Latest Time You Can Obtain After Replacing Characters (LeetCode 3114):** Essentially the same problem with different framing.

3. **String problems with positional constraints:** Any problem where you need to construct a valid string with different rules for different positions (like valid IP addresses, license plates, or formatted codes).

The pattern is: when each position has specific valid ranges and possibly dependencies on other positions, process positions in order of significance, choosing the maximum valid value at each step while ensuring future positions can still be filled validly.

## Key Takeaways

1. **Greedy works when maximizing significance:** For time strings, earlier positions (hours) matter more for making a time "later". Process from most significant to least significant.

2. **Check dependencies between positions:** Some digits constrain what values adjacent digits can take. Always verify that your choice at one position doesn't make another position impossible to fill.

3. **Know your constraints cold:** For time problems, remember: hours 00-23, minutes 00-59. For 24-hour format specifically: if first hour digit is 2, second can only be 0-3; minute tens digit can only be 0-5.

Related problems: [Number of Valid Clock Times](/problem/number-of-valid-clock-times), [Latest Time You Can Obtain After Replacing Characters](/problem/latest-time-you-can-obtain-after-replacing-characters)
