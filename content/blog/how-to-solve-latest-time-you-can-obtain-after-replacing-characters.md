---
title: "How to Solve Latest Time You Can Obtain After Replacing Characters — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Latest Time You Can Obtain After Replacing Characters. Easy difficulty, 35.1% acceptance rate. Topics: String, Enumeration."
date: "2028-11-12"
category: "dsa-patterns"
tags: ["latest-time-you-can-obtain-after-replacing-characters", "string", "enumeration", "easy"]
---

# How to Solve "Latest Time You Can Obtain After Replacing Characters"

You're given a time string in 12-hour format (`HH:MM`) where some digits are replaced with `?`. Your task is to replace each `?` with a digit to create the **latest possible valid time**. The tricky part is that the constraints interact: the hour's first digit limits the second, and the minute's first digit limits the second. This isn't just about picking the largest digit everywhere—you need to consider validity rules at each position.

## Visual Walkthrough

Let's walk through an example: `s = "1?:?4"`

**Step 1: Understand the format**

- Positions: `H1 H2 : M1 M2`
- `H1` can be `0` or `1` (since hours go from `00` to `11`)
- `H2` can be `0-9` if `H1` is `0`, but only `0-1` if `H1` is `1` (because `11` is max)
- `M1` can be `0-5` (minutes go from `00` to `59`)
- `M2` can be `0-9` regardless of `M1`

**Step 2: Process each position from left to right**
We want the latest time, so we try to maximize each position starting from the leftmost.

- **H1 position (index 0):** Current digit is `1`. Since it's already fixed, we keep it.
- **H2 position (index 1):** Current is `?`. What's the maximum possible here?
  - Since H1 is `1`, H2 can only be `0` or `1` (to keep hour ≤ 11)
  - We want the latest time, so try `1` first → hour would be `11` (valid)
  - Set H2 to `1`
- **M1 position (index 3):** Current is `?`. Maximum is `5` (since minutes ≤ 59)
  - Set M1 to `5`
- **M2 position (index 4):** Current is `4` (fixed digit)
  - Keep it as `4`

Result: `"11:54"` — this is indeed the latest possible valid time.

**Key insight:** When a position has `?`, we need to check constraints from both left and right:

1. What's the maximum digit allowed by the format rules?
2. Does choosing that maximum affect what we can put in later positions?

## Brute Force Approach

A naive approach would be to try all possible digit combinations for each `?`:

- There are 4 positions that could have `?`
- Each `?` could be replaced with 0-9 (10 possibilities)
- That's up to 10⁴ = 10,000 combinations to check

For each combination:

1. Replace all `?` with specific digits
2. Check if the resulting time is valid (HH:MM format, HH ≤ 11, MM ≤ 59)
3. Track the maximum valid time

**Why this is inefficient:**

- We're doing unnecessary work by trying invalid combinations
- We're not using the structure of the problem
- Time complexity is O(10^k) where k is the number of `?` (up to 4 in this case)

While 10,000 checks might seem acceptable for this small problem, the optimal solution is much cleaner and demonstrates better problem-solving skills.

## Optimal Solution

The optimal approach processes each position independently but considers dependencies:

1. **H1 (hour tens):** If `?`, choose `1` if possible (because `1` gives us more options for H2), otherwise choose `0`
2. **H2 (hour ones):** If `?`, choose the maximum based on H1's value
3. **M1 (minute tens):** If `?`, always choose `5` (maximum allowed)
4. **M2 (minute ones):** If `?`, always choose `9` (maximum allowed)

The only tricky part is H2: if H1 is `2`, H2 can only be `0-3`, but in 12-hour format, H1 can't be `2`! Actually, H1 can only be `0` or `1`. So if H1 is `1`, H2 can be `0-1`; if H1 is `0`, H2 can be `0-9`.

Wait, let me correct that: In the problem statement, hours go from `00` to `11`, so:

- If H1 is `0`, H2 can be `0-9` (00 to 09)
- If H1 is `1`, H2 can be `0-1` (10 to 11)

Here's the step-by-step logic:

<div class="code-group">

```python
# Time: O(1) | Space: O(1) - we only process 4 characters
def findLatestTime(s: str) -> str:
    # Convert string to list for easy modification
    time = list(s)

    # Handle H1 (position 0)
    if time[0] == '?':
        # We want to set H1 as high as possible
        # If H2 is '?' or H2 is <= 1, we can set H1 to 1
        # Otherwise, if H2 is > 1, we must set H1 to 0
        if time[1] == '?' or int(time[1]) <= 1:
            time[0] = '1'
        else:
            time[0] = '0'

    # Handle H2 (position 1)
    if time[1] == '?':
        # Depends on H1's value
        if time[0] == '1':
            time[1] = '1'  # Latest possible when H1 is 1
        else:
            time[1] = '9'  # Latest possible when H1 is 0

    # Handle M1 (position 3)
    if time[3] == '?':
        time[3] = '5'  # Maximum for minute tens digit

    # Handle M2 (position 4)
    if time[4] == '?':
        time[2] = '9'  # Maximum for minute ones digit

    # Convert list back to string
    return ''.join(time)
```

```javascript
// Time: O(1) | Space: O(1)
function findLatestTime(s) {
  // Convert string to array for easy modification
  const time = s.split("");

  // Handle H1 (position 0)
  if (time[0] === "?") {
    // We want to set H1 as high as possible
    // If H2 is '?' or H2 <= 1, we can set H1 to 1
    // Otherwise, if H2 > 1, we must set H1 to 0
    if (time[1] === "?" || parseInt(time[1]) <= 1) {
      time[0] = "1";
    } else {
      time[0] = "0";
    }
  }

  // Handle H2 (position 1)
  if (time[1] === "?") {
    // Depends on H1's value
    if (time[0] === "1") {
      time[1] = "1"; // Latest possible when H1 is 1
    } else {
      time[1] = "9"; // Latest possible when H1 is 0
    }
  }

  // Handle M1 (position 3)
  if (time[3] === "?") {
    time[3] = "5"; // Maximum for minute tens digit
  }

  // Handle M2 (position 4)
  if (time[4] === "?") {
    time[4] = "9"; // Maximum for minute ones digit
  }

  // Convert array back to string
  return time.join("");
}
```

```java
// Time: O(1) | Space: O(1)
public String findLatestTime(String s) {
    // Convert string to char array for modification
    char[] time = s.toCharArray();

    // Handle H1 (position 0)
    if (time[0] == '?') {
        // We want to set H1 as high as possible
        // If H2 is '?' or H2 <= 1, we can set H1 to 1
        // Otherwise, if H2 > 1, we must set H1 to 0
        if (time[1] == '?' || (time[1] - '0') <= 1) {
            time[0] = '1';
        } else {
            time[0] = '0';
        }
    }

    // Handle H2 (position 1)
    if (time[1] == '?') {
        // Depends on H1's value
        if (time[0] == '1') {
            time[1] = '1';  // Latest possible when H1 is 1
        } else {
            time[1] = '9';  // Latest possible when H1 is 0
        }
    }

    // Handle M1 (position 3)
    if (time[3] == '?') {
        time[3] = '5';  // Maximum for minute tens digit
    }

    // Handle M2 (position 4)
    if (time[4] == '?') {
        time[4] = '9';  // Maximum for minute ones digit
    }

    return new String(time);
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(1)

- We only process exactly 4 positions (H1, H2, M1, M2)
- Each position requires at most a couple of comparisons and assignments
- The operations don't scale with input size since the time string always has exactly 5 characters

**Space Complexity:** O(1)

- We convert the string to a list/array for modification, which uses O(5) = O(1) extra space
- No additional data structures that grow with input size
- Some languages create a new string for the result, but that's still O(1) since it's fixed size

## Common Mistakes

1. **Forgetting the hour constraint (00-11):** Some candidates think hours go to 23 (like 24-hour time) or 12 (like 12-hour time without leading zero). Remember: it's specifically `00` to `11`.

2. **Wrong order of processing:** If you process H2 before H1, you might make suboptimal choices. Always process from left to right because earlier positions constrain later ones.

3. **Not handling the colon position:** The string has format `"HH:MM"`, so position 2 is always `:`. Some candidates try to process it as a digit. Remember to skip index 2.

4. **Overcomplicating with backtracking:** This problem doesn't need DFS or backtracking. The constraints are simple enough that greedy choices work. If you find yourself writing recursive code, you're overthinking it.

## When You'll See This Pattern

This "constrained digit replacement" pattern appears in several time-related problems:

1. **Latest Time by Replacing Hidden Digits (LeetCode 1736):** Almost identical problem but for 24-hour format. The same greedy approach works, but with different constraints (hours 00-23).

2. **Maximum Time (LeetCode 5661):** Another variation where you need to find the maximum valid time given digits with wildcards.

3. **Valid Time Format Problems:** Any problem where you need to validate or construct time strings with constraints on digit ranges will use similar logic.

The core technique is **greedy digit assignment with constraint checking**: at each position, choose the maximum valid digit while ensuring later positions can still be filled validly.

## Key Takeaways

1. **Greedy works when constraints are local:** For time formatting problems, you can usually process digits left-to-right, making the locally optimal choice at each step.

2. **Understand the format rules deeply:** Don't just memorize that hours are 00-11. Understand why: first digit 0-1, second digit depends on first. This pattern of "dependent digit constraints" appears in many problems.

3. **Fixed-length strings mean O(1) complexity:** When input has fixed size (like 5 characters for time), even "brute force" checking all combinations might be acceptable, but an optimal O(1) solution is cleaner and shows better understanding.

Related problems: [Latest Time by Replacing Hidden Digits](/problem/latest-time-by-replacing-hidden-digits)
