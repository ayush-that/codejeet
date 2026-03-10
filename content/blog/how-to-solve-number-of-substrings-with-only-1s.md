---
title: "How to Solve Number of Substrings With Only 1s — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Number of Substrings With Only 1s. Medium difficulty, 57.4% acceptance rate. Topics: Math, String."
date: "2026-08-03"
category: "dsa-patterns"
tags: ["number-of-substrings-with-only-1s", "math", "string", "medium"]
---

# How to Solve Number of Substrings With Only 1s

You're given a binary string `s` and need to count all substrings that consist entirely of `'1'` characters. The challenge is that the number can be huge, so you return it modulo 10⁹ + 7. What makes this interesting is that while a brute force check of every substring is straightforward, it's far too slow for strings up to 100,000 characters. The key insight is recognizing that within a contiguous block of `'1'`s, the number of valid substrings follows a simple mathematical pattern.

## Visual Walkthrough

Let's trace through `s = "0110111"` step by step to build intuition.

The string has three groups of consecutive `'1'`s:

1. `"11"` (positions 1-2)
2. `"1"` (position 4)
3. `"111"` (positions 5-7)

For each group, we count all substrings containing only `'1'`s:

- Group 1 (`"11"`): Substrings are `"1"` (first), `"1"` (second), and `"11"` (both). That's 3 substrings.
- Group 2 (`"1"`): Only `"1"` itself. That's 1 substring.
- Group 3 (`"111"`): Substrings are `"1"` (first), `"1"` (second), `"1"` (third), `"11"` (first two), `"11"` (last two), and `"111"` (all three). That's 6 substrings.

Total: 3 + 1 + 6 = 10 substrings.

Notice the pattern: For a group of `k` consecutive `'1'`s, the number of valid substrings is `k × (k + 1) / 2`. This formula counts all possible starting and ending positions within the group:

- `"11"` (k=2): 2×3/2 = 3
- `"1"` (k=1): 1×2/2 = 1
- `"111"` (k=3): 3×4/2 = 6

So instead of checking every substring, we just need to find each group of consecutive `'1'`s, calculate this formula for its length, and sum the results.

## Brute Force Approach

The most straightforward solution is to check every possible substring:

1. Generate all substrings using two nested loops
2. For each substring, check if all characters are `'1'`
3. Count the valid ones

<div class="code-group">

```python
# Time: O(n³) | Space: O(1)
def numSub_brute(s: str) -> int:
    MOD = 10**9 + 7
    n = len(s)
    count = 0

    # Generate all substrings
    for i in range(n):
        for j in range(i, n):
            # Check if substring s[i:j+1] contains only '1's
            valid = True
            for k in range(i, j + 1):
                if s[k] != '1':
                    valid = False
                    break
            if valid:
                count = (count + 1) % MOD

    return count
```

```javascript
// Time: O(n³) | Space: O(1)
function numSubBrute(s) {
  const MOD = 10 ** 9 + 7;
  const n = s.length;
  let count = 0;

  // Generate all substrings
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      // Check if substring s[i..j] contains only '1's
      let valid = true;
      for (let k = i; k <= j; k++) {
        if (s[k] !== "1") {
          valid = false;
          break;
        }
      }
      if (valid) {
        count = (count + 1) % MOD;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n³) | Space: O(1)
public int numSubBrute(String s) {
    final int MOD = 1_000_000_007;
    int n = s.length();
    int count = 0;

    // Generate all substrings
    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            // Check if substring s[i..j] contains only '1's
            boolean valid = true;
            for (int k = i; k <= j; k++) {
                if (s.charAt(k) != '1') {
                    valid = false;
                    break;
                }
            }
            if (valid) {
                count = (count + 1) % MOD;
            }
        }
    }

    return count;
}
```

</div>

**Why this fails:** With O(n³) time complexity, this is far too slow for n up to 100,000. Even O(n²) would be too slow. We need a linear solution.

## Optimized Approach

The key insight is that we don't need to check every substring individually. Instead, we can:

1. Scan through the string once
2. Track the length of the current consecutive `'1'`s group
3. When we encounter a `'0'` or reach the end, add the count for that group using the formula `k × (k + 1) / 2`
4. Reset the counter for the next group

**Why the formula works:** In a group of `k` consecutive `'1'`s:

- There are `k` substrings of length 1
- `k-1` substrings of length 2
- `k-2` substrings of length 3
- ...
- 1 substring of length `k`

This sum is `k + (k-1) + (k-2) + ... + 1 = k × (k + 1) / 2`

**Step-by-step reasoning:**

1. Initialize `count = 0` and `current_length = 0`
2. Iterate through each character in `s`:
   - If it's `'1'`, increment `current_length`
   - If it's `'0'` (or we're at the end), we've reached the end of a group:
     - Add `current_length × (current_length + 1) / 2` to `count`
     - Reset `current_length = 0`
3. Return `count % MOD`

This approach processes each character exactly once, giving us O(n) time complexity.

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def numSub(s: str) -> int:
    MOD = 10**9 + 7
    count = 0
    current_length = 0

    # Iterate through each character in the string
    for char in s:
        if char == '1':
            # We're in a group of consecutive '1's
            current_length += 1
        else:
            # We've reached the end of a group
            # Add all substrings from this group to count
            # Formula: k * (k + 1) // 2 for k consecutive '1's
            count = (count + current_length * (current_length + 1) // 2) % MOD
            # Reset for the next group
            current_length = 0

    # Don't forget the last group if the string ends with '1's
    count = (count + current_length * (current_length + 1) // 2) % MOD

    return count
```

```javascript
// Time: O(n) | Space: O(1)
function numSub(s) {
  const MOD = 10 ** 9 + 7;
  let count = 0;
  let currentLength = 0;

  // Iterate through each character in the string
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "1") {
      // We're in a group of consecutive '1's
      currentLength++;
    } else {
      // We've reached the end of a group
      // Add all substrings from this group to count
      // Formula: k * (k + 1) / 2 for k consecutive '1's
      count = (count + (currentLength * (currentLength + 1)) / 2) % MOD;
      // Reset for the next group
      currentLength = 0;
    }
  }

  // Don't forget the last group if the string ends with '1's
  count = (count + (currentLength * (currentLength + 1)) / 2) % MOD;

  return count;
}
```

```java
// Time: O(n) | Space: O(1)
public int numSub(String s) {
    final int MOD = 1_000_000_007;
    long count = 0;  // Use long to avoid overflow during calculation
    int currentLength = 0;

    // Iterate through each character in the string
    for (int i = 0; i < s.length(); i++) {
        if (s.charAt(i) == '1') {
            // We're in a group of consecutive '1's
            currentLength++;
        } else {
            // We've reached the end of a group
            // Add all substrings from this group to count
            // Formula: k * (k + 1) / 2 for k consecutive '1's
            count = (count + (long) currentLength * (currentLength + 1) / 2) % MOD;
            // Reset for the next group
            currentLength = 0;
        }
    }

    // Don't forget the last group if the string ends with '1's
    count = (count + (long) currentLength * (currentLength + 1) / 2) % MOD;

    return (int) count;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the string exactly once, processing each character in constant time
- The formula calculation `k × (k + 1) / 2` is O(1) for each group

**Space Complexity: O(1)**

- We only use a few integer variables (`count`, `current_length`, `MOD`)
- No additional data structures that grow with input size

## Common Mistakes

1. **Forgetting to handle the last group:** If the string ends with `'1'`s, you need to process that final group after the loop ends. Many candidates add the group count only when they encounter a `'0'`, missing the last group.

2. **Integer overflow:** The count can be huge (up to ~5×10⁹ for a string of all `'1'`s). In Java, using `int` for intermediate calculations can overflow. Use `long` for intermediate results, or apply modulo after each addition.

3. **Incorrect formula application:** Some candidates try to incrementally add to the count as they extend the current group, which is correct but less efficient. The formula `k × (k + 1) / 2` is mathematically equivalent to the sum `1 + 2 + ... + k`.

4. **Modulo operation placement:** Applying modulo only at the end risks overflow. Apply it after each addition to keep numbers manageable. In Python, this is less critical due to arbitrary precision integers, but it's good practice.

## When You'll See This Pattern

This "consecutive groups" pattern appears in many string and array problems:

1. **Count Number of Homogenous Substrings (LeetCode 1759)** - Almost identical! Counts substrings with all identical characters (not just `'1'`s). The same group-length formula applies.

2. **Max Consecutive Ones (LeetCode 485)** - Find the maximum length of consecutive `'1'`s. Uses the same group-tracking technique but keeps only the maximum instead of counting all substrings.

3. **Palindromic Substrings (LeetCode 647)** - While more complex, it also involves counting substrings that satisfy a property. The efficient solution expands around centers, similar to how we expand groups.

4. **Arithmetic Slices (LeetCode 413)** - Counts arithmetic subarrays. Uses a similar idea: when you extend a valid arithmetic sequence by one element, you add `current_length - 2` new valid subarrays.

## Key Takeaways

1. **Look for mathematical patterns in substring counts:** When counting substrings with a property that depends on consecutive elements, there's often a formula based on group length rather than needing to check each substring individually.

2. **The "group length" technique is versatile:** Track the length of consecutive elements satisfying a condition, then apply a formula when the condition breaks. This transforms O(n²) or O(n³) problems into O(n).

3. **Edge cases matter:** Always check what happens at the beginning and end of your iteration. The last group needs special handling if it doesn't end with a "break" condition.

Related problems: [Count Number of Homogenous Substrings](/problem/count-number-of-homogenous-substrings), [Count Vowel Substrings of a String](/problem/count-vowel-substrings-of-a-string)
