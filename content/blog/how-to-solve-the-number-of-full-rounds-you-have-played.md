---
title: "How to Solve The Number of Full Rounds You Have Played — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode The Number of Full Rounds You Have Played. Medium difficulty, 43.5% acceptance rate. Topics: Math, String."
date: "2029-07-28"
category: "dsa-patterns"
tags: ["the-number-of-full-rounds-you-have-played", "math", "string", "medium"]
---

# How to Solve "The Number of Full Rounds You Have Played"

This problem asks you to calculate how many complete 15-minute chess rounds you can play between a given login time and logout time. The tricky part is that you can only count rounds where you were present for the entire 15-minute duration — partial participation doesn’t count. This requires careful handling of time boundaries and understanding how to round times to the nearest valid round start/end points.

## Visual Walkthrough

Let’s walk through an example: login = `"20:00"`, logout = `"06:00"`.  
We need to count full 15-minute rounds between these times.

**Step 1 — Convert to minutes from midnight:**

- `20:00` = 20 × 60 = 1200 minutes
- `06:00` = 6 × 60 = 360 minutes

**Step 2 — Handle overnight case:**  
Since logout (360) is less than login (1200), we add 24 hours (1440 minutes) to logout:  
360 + 1440 = 1800 minutes (this represents 06:00 the next day).

**Step 3 — Find the earliest round you can fully participate in:**  
Rounds start at 0, 15, 30, 45, 60, etc.  
If you login at 1200 minutes, you can’t join a round that started at 1200 exactly unless you logged in exactly at that moment.  
The first full round you can join starts at the next 15-minute boundary _after_ your login time.

- Next multiple of 15 after 1200: 1200 ÷ 15 = 80 exactly, so 1200 is already a multiple of 15.
- But since you logged in _at_ 1200, you can join the round starting at 1200. Wait — careful! The problem says you can only count rounds where you were present for the _entire_ duration. If you login exactly at the round start time, you can participate in that full round. So we actually need the _ceiling_ of login time to the next 15-minute interval, unless it’s already exactly on a boundary.

Actually, let’s think: If you login at 20:00 (which is 1200 minutes, a multiple of 15), you can join the round starting at 20:00 and play the full 20:00–20:15 round. So the first round start time is the _ceiling_ of login time to the next 15-minute mark, but if login is exactly on a 15-minute mark, we use that exact time.

**Step 4 — Find the last round you can fully participate in:**  
The last full round must end by your logout time.  
If logout is 1800 minutes, the round ending at 1800 started at 1785.  
We need the _floor_ of logout time to the previous 15-minute mark, then subtract 15 to get the start time of the last possible round.

**Step 5 — Calculate count:**  
First round start = ceil(login / 15) × 15  
Last round start = floor(logout / 15) × 15 − 15  
Number of rounds = max(0, (last − first) / 15 + 1)

Let’s compute:

- First = ceil(1200 / 15) × 15 = 80 × 15 = 1200
- Last = floor(1800 / 15) × 15 − 15 = 120 × 15 − 15 = 1800 − 15 = 1785
- Rounds = (1785 − 1200) / 15 + 1 = 585 / 15 + 1 = 39 + 1 = 40

So you can play 40 full rounds.

## Brute Force Approach

A brute force approach would be to simulate every 15-minute interval from login to logout and check if you were present for the entire interval. You’d convert both times to minutes, then iterate through all 15-minute blocks (starting at 0, 15, 30, …) and count how many fall completely within [login, logout).

**Why it’s inefficient:**  
There are 24 × 4 = 96 rounds per day. If we consider overnight sessions, we might need to check up to 192 rounds. While this is actually O(1) since it’s bounded, it’s still more complex than necessary and requires careful iteration logic. More importantly, the brute force approach often leads to off-by-one errors when determining whether a round is fully contained. The mathematical approach is cleaner and less error-prone.

## Optimized Approach

The key insight is that we can use **integer division and rounding** to directly calculate the number of 15-minute intervals between two times.

1. **Convert times to minutes** from midnight for easy arithmetic.
2. **Handle overnight sessions** by adding 24 hours to the logout time if it’s less than login time.
3. **Find the first round start time** you can fully participate in:
   - If you login at time `L`, you can join a round starting at `ceil(L / 15) × 15`.
   - Example: Login at 12:07 → 12:07 in minutes = 727 → ceil(727/15) = ceil(48.466) = 49 → 49×15 = 735 minutes = 12:15.
4. **Find the last round start time** you can fully participate in:
   - If you logout at time `R`, the last round you can finish must end by `R`, so it must start at `floor(R / 15) × 15 − 15`.
   - Example: Logout at 14:30 → 870 minutes → floor(870/15) = 58 → 58×15 = 870 → 870 − 15 = 855 minutes = 14:15.
5. **Calculate the count**:
   - If first round start > last round start, return 0.
   - Otherwise, number of rounds = `(last − first) / 15 + 1`.

This approach runs in O(1) time with O(1) space.

## Optimal Solution

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def numberOfRounds(loginTime: str, logoutTime: str) -> int:
    # Convert HH:MM strings to minutes since midnight
    def to_minutes(t: str) -> int:
        hours, minutes = map(int, t.split(':'))
        return hours * 60 + minutes

    login_min = to_minutes(loginTime)
    logout_min = to_minutes(logoutTime)

    # Handle case where logout is on the next day
    if logout_min < login_min:
        logout_min += 24 * 60  # Add 24 hours in minutes

    # Find the first round start time we can fully participate in
    # We need the smallest multiple of 15 that is >= login_min
    # This is the ceiling division: (login_min + 14) // 15 * 15
    first_round_start = (login_min + 14) // 15 * 15

    # Find the last round start time we can fully participate in
    # The round must end by logout_min, so it must start at most
    # 15 minutes before the largest multiple of 15 <= logout_min
    last_round_start = logout_min // 15 * 15 - 15

    # If first round start is after last round start, no full rounds
    if first_round_start > last_round_start:
        return 0

    # Calculate number of 15-minute intervals between first and last
    return (last_round_start - first_round_start) // 15 + 1
```

```javascript
// Time: O(1) | Space: O(1)
function numberOfRounds(loginTime, logoutTime) {
  // Convert HH:MM string to minutes since midnight
  const toMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  let loginMin = toMinutes(loginTime);
  let logoutMin = toMinutes(logoutTime);

  // Handle overnight case
  if (logoutMin < loginMin) {
    logoutMin += 24 * 60; // Add 24 hours in minutes
  }

  // First round start: smallest multiple of 15 >= loginMin
  // Using Math.ceil would give floating point issues, so use integer math
  const firstRoundStart = Math.ceil(loginMin / 15) * 15;

  // Last round start: must end by logoutMin
  // So start time is largest multiple of 15 <= logoutMin, minus 15
  const lastRoundStart = Math.floor(logoutMin / 15) * 15 - 15;

  // If no valid rounds
  if (firstRoundStart > lastRoundStart) {
    return 0;
  }

  // Count intervals
  return (lastRoundStart - firstRoundStart) / 15 + 1;
}
```

```java
// Time: O(1) | Space: O(1)
class Solution {
    public int numberOfRounds(String loginTime, String logoutTime) {
        // Convert HH:MM to minutes since midnight
        int loginMin = toMinutes(loginTime);
        int logoutMin = toMinutes(logoutTime);

        // Handle overnight case
        if (logoutMin < loginMin) {
            logoutMin += 24 * 60; // Add 24 hours
        }

        // First round start: smallest multiple of 15 >= loginMin
        // Using integer math to avoid floating point issues
        int firstRoundStart = (loginMin + 14) / 15 * 15;

        // Last round start: must end by logoutMin
        // So start time is largest multiple of 15 <= logoutMin, minus 15
        int lastRoundStart = logoutMin / 15 * 15 - 15;

        // If no valid rounds
        if (firstRoundStart > lastRoundStart) {
            return 0;
        }

        // Count intervals between first and last (inclusive)
        return (lastRoundStart - firstRoundStart) / 15 + 1;
    }

    private int toMinutes(String time) {
        String[] parts = time.split(":");
        int hours = Integer.parseInt(parts[0]);
        int minutes = Integer.parseInt(parts[1]);
        return hours * 60 + minutes;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(1)

- Converting strings to minutes takes constant time (parsing two fixed-length strings).
- All subsequent operations are simple arithmetic operations.
- No loops or recursion that depend on input size.

**Space Complexity:** O(1)

- We only store a few integer variables.
- No additional data structures that grow with input size.

## Common Mistakes

1. **Not handling overnight sessions correctly:**  
   Forgetting to add 24 hours when logout time is earlier than login time. This leads to negative time differences and incorrect counts.

2. **Off-by-one errors in round boundary calculations:**
   - Using `Math.ceil(loginMin / 15) * 15` without considering that if loginMin is exactly on a 15-minute boundary, you _can_ join that round. The correct formula is `(loginMin + 14) // 15 * 15` in integer math.
   - For the last round, forgetting to subtract 15 minutes from the floor value. The last round must _end_ by logout time, not just start before it.

3. **Using floating point division:**  
   Using `Math.ceil(loginMin / 15)` in JavaScript can lead to floating point precision issues. Better to use integer math: `Math.ceil(loginMin / 15)` is acceptable here since we're dealing with small integers, but `(loginMin + 14) // 15` is more robust in languages like Python.

4. **Not checking for zero rounds case:**  
   If `firstRoundStart > lastRoundStart`, you must return 0. This happens when there's not enough time for even one full round (e.g., login at 12:10, logout at 12:20).

## When You'll See This Pattern

This problem uses **mathematical interval counting** and **boundary alignment** techniques that appear in:

1. **Meeting Rooms II (LeetCode 253)** — Counting how many meeting rooms needed involves similar interval overlap reasoning, though with different data structures.
2. **Car Pooling (LeetCode 1094)** — Tracking capacity changes at specific time points shares the time-conversion and boundary-handling logic.
3. **Minimum Number of Arrows to Burst Balloons (LeetCode 452)** — Finding minimum arrows to burst overlapping intervals uses similar "align to boundaries" thinking.

The core pattern is: convert time/coordinate values to a common scale, align to specific boundaries (multiples of a value), then use mathematical formulas rather than simulation to count intervals.

## Key Takeaways

1. **Convert to a common unit first:** When dealing with time problems, convert everything to the smallest relevant unit (minutes, seconds) to simplify arithmetic.
2. **Use ceiling and floor division for boundary alignment:** To find the next/last multiple of K, use `ceil(n/K)*K` and `floor(n/K)*K` with integer math to avoid off-by-one errors.
3. **Consider edge cases explicitly:** Overnight sessions, exact boundary times, and cases where no intervals fit are common pitfalls that need special handling.

[Practice this problem on CodeJeet](/problem/the-number-of-full-rounds-you-have-played)
