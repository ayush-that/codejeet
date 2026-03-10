---
title: "How to Solve Time Needed to Rearrange a Binary String — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Time Needed to Rearrange a Binary String. Medium difficulty, 52.6% acceptance rate. Topics: String, Dynamic Programming, Simulation."
date: "2028-10-18"
category: "dsa-patterns"
tags:
  [
    "time-needed-to-rearrange-a-binary-string",
    "string",
    "dynamic-programming",
    "simulation",
    "medium",
  ]
---

# How to Solve "Time Needed to Rearrange a Binary String"

This problem asks us to simulate a transformation process on a binary string where all "01" substrings are simultaneously replaced with "10" each second, and we need to count how many seconds until no "01" remains. What makes this tricky is that simultaneous replacements create a wave-like movement of 1's to the right, and a naive simulation would be far too slow for strings up to 1000 characters. The core challenge is recognizing this as a **maximum carry-over propagation problem** rather than literal simulation.

## Visual Walkthrough

Let's trace through `s = "011010"` step by step:

**Initial:** `0 1 1 0 1 0`  
We identify all "01" pairs at positions: (0,1) → "01", (3,4) → "01"

**Second 1:** All "01" become "10" simultaneously:

- Position 0-1: "01" → "10"
- Position 3-4: "01" → "10"  
  Result: `1 0 1 1 0 0`

**Second 2:** Identify "01" pairs: (2,3) → "01"  
Transform: "01" → "10"  
Result: `1 0 1 0 1 0`

**Second 3:** Identify "01" pairs: (2,3) → "01", (4,5) → "01"  
Transform both:

- Position 2-3: "01" → "10"
- Position 4-5: "01" → "10"  
  Result: `1 0 0 1 0 1`

**Second 4:** Identify "01" pairs: (3,4) → "01"  
Transform: "01" → "10"  
Result: `1 0 0 0 1 1`

**Second 5:** No "01" pairs remain. Total seconds = 4.

Notice the pattern: Each 1 moves rightward through zeros, but when multiple 1's are consecutive, they create a "traffic jam" where the leftmost 1 must wait for the rightmost 1 to move first. This is key to our optimized solution.

## Brute Force Approach

The most straightforward approach is to literally simulate the process: each second, scan the string for all "01" patterns, replace them with "10", and repeat until no changes occur.

<div class="code-group">

```python
# Time: O(n²) worst case | Space: O(n)
def secondsToRemoveOccurrences_brute(s: str) -> int:
    seconds = 0
    while True:
        # Find all positions where "01" occurs
        changed = False
        i = 0
        # We need to work on a list since strings are immutable
        arr = list(s)

        while i < len(arr) - 1:
            if arr[i] == '0' and arr[i+1] == '1':
                # Replace "01" with "10"
                arr[i] = '1'
                arr[i+1] = '0'
                changed = True
                # Skip the next position since we just changed it
                i += 2
            else:
                i += 1

        if not changed:
            break

        s = ''.join(arr)
        seconds += 1

    return seconds
```

```javascript
// Time: O(n²) worst case | Space: O(n)
function secondsToRemoveOccurrencesBrute(s) {
  let seconds = 0;

  while (true) {
    let changed = false;
    let i = 0;
    const arr = s.split("");

    while (i < arr.length - 1) {
      if (arr[i] === "0" && arr[i + 1] === "1") {
        // Replace "01" with "10"
        arr[i] = "1";
        arr[i + 1] = "0";
        changed = true;
        // Skip the next position
        i += 2;
      } else {
        i += 1;
      }
    }

    if (!changed) break;

    s = arr.join("");
    seconds++;
  }

  return seconds;
}
```

```java
// Time: O(n²) worst case | Space: O(n)
public int secondsToRemoveOccurrencesBrute(String s) {
    int seconds = 0;

    while (true) {
        boolean changed = false;
        int i = 0;
        char[] arr = s.toCharArray();

        while (i < arr.length - 1) {
            if (arr[i] == '0' && arr[i+1] == '1') {
                // Replace "01" with "10"
                arr[i] = '1';
                arr[i+1] = '0';
                changed = true;
                // Skip the next position
                i += 2;
            } else {
                i++;
            }
        }

        if (!changed) break;

        s = new String(arr);
        seconds++;
    }

    return seconds;
}
```

</div>

**Why this is insufficient:** In the worst case (like `"011111...10"`), each second only moves the leftmost 1 one position right, requiring O(n) seconds. Each second requires O(n) scanning, giving O(n²) time complexity. For n = 1000, this could mean ~500,000 operations, which might pass but is inefficient. For larger constraints, it would fail.

## Optimized Approach

The key insight is that we don't need to simulate every second. Instead, we can think about **how many seconds each 1 needs to reach its final position**.

Consider each 1 moving right through zeros. When a 1 encounters another 1 ahead of it, it must wait because they can't occupy the same position. This creates a **carry-over delay**.

Let's define:

- `zeros` = count of zeros we've encountered so far (from left to right)
- `time` = current maximum time needed for any 1 we've seen

For each character from left to right:

1. If we see a `'0'`, increment `zeros` (these are zeros that 1's might need to pass through)
2. If we see a `'1'`:
   - If there are no zeros before it (`zeros == 0`), it's already in position, needs 0 seconds
   - Otherwise, this 1 needs to pass through all preceding zeros
   - But if another 1 was already delayed, this 1 might need to wait additional time

The recurrence relation:  
For each `'1'`, time needed = max(`time + 1`, `zeros`)  
Where:

- `time + 1`: If previous 1 needed `time` seconds, this consecutive 1 needs at least `time + 1` (traffic jam effect)
- `zeros`: This 1 needs to pass through all preceding zeros

We take the maximum because the 1 needs both to pass through zeros AND wait for preceding 1's if they're congested.

## Optimal Solution

Here's the implementation using the single-pass approach:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def secondsToRemoveOccurrences(s: str) -> int:
    """
    Calculate seconds needed for all '01' to become '10'.

    The key insight: Track zeros count and maximum time needed.
    Each '1' needs to pass through all preceding zeros,
    but consecutive '1's create traffic jams where each
    subsequent '1' needs extra time to wait.
    """
    zeros = 0  # Count of zeros encountered so far
    time = 0   # Maximum time needed for any '1' encountered so far

    for char in s:
        if char == '0':
            zeros += 1  # Another zero for future '1's to pass through
        else:  # char == '1'
            if zeros > 0:
                # This '1' needs to pass through all preceding zeros
                # But if there was a previous '1' delayed, we might need to wait longer
                # max(time + 1, zeros) covers both cases:
                # - time + 1: traffic jam from consecutive '1's
                # - zeros: need to pass through all zeros
                time = max(time + 1, zeros)

    return time
```

```javascript
// Time: O(n) | Space: O(1)
function secondsToRemoveOccurrences(s) {
  /**
   * Calculate seconds needed for all '01' to become '10'.
   *
   * The key insight: Track zeros count and maximum time needed.
   * Each '1' needs to pass through all preceding zeros,
   * but consecutive '1's create traffic jams where each
   * subsequent '1' needs extra time to wait.
   */
  let zeros = 0; // Count of zeros encountered so far
  let time = 0; // Maximum time needed for any '1' encountered so far

  for (let i = 0; i < s.length; i++) {
    if (s[i] === "0") {
      zeros++; // Another zero for future '1's to pass through
    } else {
      // s[i] === '1'
      if (zeros > 0) {
        // This '1' needs to pass through all preceding zeros
        // But if there was a previous '1' delayed, we might need to wait longer
        // Math.max(time + 1, zeros) covers both cases:
        // - time + 1: traffic jam from consecutive '1's
        // - zeros: need to pass through all zeros
        time = Math.max(time + 1, zeros);
      }
    }
  }

  return time;
}
```

```java
// Time: O(n) | Space: O(1)
public int secondsToRemoveOccurrences(String s) {
    /**
     * Calculate seconds needed for all '01' to become '10'.
     *
     * The key insight: Track zeros count and maximum time needed.
     * Each '1' needs to pass through all preceding zeros,
     * but consecutive '1's create traffic jams where each
     * subsequent '1' needs extra time to wait.
     */
    int zeros = 0;  // Count of zeros encountered so far
    int time = 0;   // Maximum time needed for any '1' encountered so far

    for (int i = 0; i < s.length(); i++) {
        char c = s.charAt(i);
        if (c == '0') {
            zeros++;  // Another zero for future '1's to pass through
        } else {  // c == '1'
            if (zeros > 0) {
                // This '1' needs to pass through all preceding zeros
                // But if there was a previous '1' delayed, we might need to wait longer
                // Math.max(time + 1, zeros) covers both cases:
                // - time + 1: traffic jam from consecutive '1's
                // - zeros: need to pass through all zeros
                time = Math.max(time + 1, zeros);
            }
        }
    }

    return time;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)  
We make a single pass through the string, processing each character exactly once. Each operation is O(1).

**Space Complexity:** O(1)  
We only use a constant amount of extra space (two integer variables), regardless of input size.

## Common Mistakes

1. **Simulating every second literally:** This leads to O(n²) time in worst case. Candidates might not realize the pattern of 1's moving like cars in traffic.
2. **Incorrect handling of consecutive 1's:** Forgetting that consecutive 1's create additional delays. A common wrong approach is to just count zeros before each 1 without considering that 1's must wait for each other.

3. **Off-by-one in the recurrence:** Using `time = max(time, zeros)` instead of `time = max(time + 1, zeros)`. The `+1` is crucial because when 1's are consecutive, each needs one more second than the previous one.

4. **Not resetting properly for leading 1's:** For strings starting with '1', these 1's are already in position and shouldn't contribute to time. Our solution handles this with the `if zeros > 0` check.

## When You'll See This Pattern

This problem uses a **carry-over propagation** pattern common in problems where elements move or transform with dependencies:

1. **Minimum Swaps to Group All 1's Together** - Also involves moving 1's, though with different constraints. You need to find a window and count zeros to swap.

2. **Minimum Number of Swaps to Make the String Balanced** - Similar wave-like movement of elements to achieve a target pattern.

3. **Trapping Rain Water** - While different in application, it uses a similar forward-pass accumulation technique to track maximums.

The core pattern is: **When processing sequentially, maintain running counts/maximums that capture cumulative constraints from previous elements.**

## Key Takeaways

1. **Look for propagation patterns:** When elements move or transform based on neighbors, there's often a mathematical relationship that avoids simulation.

2. **Track cumulative constraints:** Use running variables to capture how previous elements affect current processing. Here, `zeros` and `time` capture all necessary state.

3. **Test with consecutive identical elements:** Edge cases with consecutive 1's or 0's often reveal the need for the `max(time + 1, zeros)` logic rather than simpler alternatives.

Related problems: [Minimum Swaps to Group All 1's Together](/problem/minimum-swaps-to-group-all-1s-together), [Minimum Swaps to Group All 1's Together II](/problem/minimum-swaps-to-group-all-1s-together-ii)
