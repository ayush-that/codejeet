---
title: "How to Solve Count Number of Homogenous Substrings — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count Number of Homogenous Substrings. Medium difficulty, 57.4% acceptance rate. Topics: Math, String."
date: "2026-12-21"
category: "dsa-patterns"
tags: ["count-number-of-homogenous-substrings", "math", "string", "medium"]
---

# How to Solve Count Number of Homogenous Substrings

This problem asks us to count all contiguous substrings where every character is identical. While the definition is straightforward, the challenge comes from efficiency: a string of length `n` has `n*(n+1)/2` total substrings, so checking each one individually would be far too slow for large inputs. The key insight is that we don't need to examine every substring explicitly—we can count them mathematically by finding runs of identical characters.

## Visual Walkthrough

Let's trace through an example: `s = "abbcccaa"`

We need to count all substrings where all characters are the same. Instead of listing every substring, we'll find consecutive runs:

1. **First run:** `"a"` (length 1)
   - Substrings: `"a"` → 1 substring
   - Formula: For a run of length `k`, it contributes `k*(k+1)/2` homogenous substrings

2. **Second run:** `"bb"` (length 2)
   - Substrings: `"b"`, `"b"`, `"bb"` → 3 substrings
   - Formula: `2*3/2 = 3`

3. **Third run:** `"ccc"` (length 3)
   - Substrings: `"c"`, `"c"`, `"c"`, `"cc"`, `"cc"`, `"ccc"` → 6 substrings
   - Formula: `3*4/2 = 6`

4. **Fourth run:** `"aa"` (length 2)
   - Substrings: `"a"`, `"a"`, `"aa"` → 3 substrings
   - Formula: `2*3/2 = 3`

Total: `1 + 3 + 6 + 3 = 13` homogenous substrings

Notice the pattern: we scan through the string, identify when characters change, and for each run of identical characters, we add `k*(k+1)/2` to our total. This avoids the O(n²) work of checking every substring individually.

## Brute Force Approach

The most straightforward approach would be to generate every possible substring and check if it's homogenous:

1. Generate all `n*(n+1)/2` substrings (using two nested loops)
2. For each substring, check if all characters are the same
3. Count the ones that pass the check

<div class="code-group">

```python
# Time: O(n³) | Space: O(1)
def countHomogenous_brute(s):
    n = len(s)
    count = 0

    # Generate all substrings
    for i in range(n):
        for j in range(i, n):
            # Check if substring s[i:j+1] is homogenous
            is_homogenous = True
            for k in range(i, j):
                if s[k] != s[k+1]:
                    is_homogenous = False
                    break
            if is_homogenous:
                count += 1

    return count % (10**9 + 7)
```

```javascript
// Time: O(n³) | Space: O(1)
function countHomogenousBrute(s) {
  const n = s.length;
  let count = 0;
  const MOD = 1e9 + 7;

  // Generate all substrings
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      // Check if substring s[i..j] is homogenous
      let isHomogenous = true;
      for (let k = i; k < j; k++) {
        if (s[k] !== s[k + 1]) {
          isHomogenous = false;
          break;
        }
      }
      if (isHomogenous) {
        count = (count + 1) % MOD;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n³) | Space: O(1)
public int countHomogenousBrute(String s) {
    int n = s.length();
    int count = 0;
    final int MOD = 1_000_000_007;

    // Generate all substrings
    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            // Check if substring s[i..j] is homogenous
            boolean isHomogenous = true;
            for (int k = i; k < j; k++) {
                if (s.charAt(k) != s.charAt(k + 1)) {
                    isHomogenous = false;
                    break;
                }
            }
            if (isHomogenous) {
                count = (count + 1) % MOD;
            }
        }
    }

    return count;
}
```

</div>

**Why this fails:** The time complexity is O(n³) because we have three nested loops. For a string of length 10⁵ (common constraint), this would require ~10¹⁵ operations, which is completely infeasible. Even with O(n²) approaches, we'd still have 10¹⁰ operations, which is too slow.

## Optimized Approach

The key insight is that we don't need to check every substring individually. Instead, we can:

1. **Identify runs of identical characters:** Scan through the string once
2. **Count substrings mathematically:** For a run of length `k`, it contains exactly `k*(k+1)/2` homogenous substrings
   - Why? A run of length `k` has:
     - `k` substrings of length 1
     - `k-1` substrings of length 2
     - ...
     - `1` substring of length `k`
     - Total: `1 + 2 + ... + k = k*(k+1)/2`
3. **Handle large numbers:** Use modulo arithmetic to avoid overflow

We can implement this with a single pass through the string:

- Keep track of the current run length
- When we see the same character as before, increment the run length
- When we see a different character, add the count for the previous run and start a new run
- Don't forget to add the count for the final run after the loop ends

## Optimal Solution

Here's the efficient implementation using the run-length counting approach:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def countHomogenous(s):
    MOD = 10**9 + 7
    total = 0
    current_run_length = 0

    for i in range(len(s)):
        # If this is the first character OR same as previous character
        if i == 0 or s[i] == s[i-1]:
            current_run_length += 1
        else:
            # Character changed, so previous run ended
            # Add count for the completed run
            total += current_run_length * (current_run_length + 1) // 2
            total %= MOD
            # Start new run with current character
            current_run_length = 1

    # Don't forget the last run
    total += current_run_length * (current_run_length + 1) // 2
    total %= MOD

    return total
```

```javascript
// Time: O(n) | Space: O(1)
function countHomogenous(s) {
  const MOD = 1e9 + 7;
  let total = 0;
  let currentRunLength = 0;

  for (let i = 0; i < s.length; i++) {
    // If this is the first character OR same as previous character
    if (i === 0 || s[i] === s[i - 1]) {
      currentRunLength++;
    } else {
      // Character changed, so previous run ended
      // Add count for the completed run
      total = (total + (currentRunLength * (currentRunLength + 1)) / 2) % MOD;
      // Start new run with current character
      currentRunLength = 1;
    }
  }

  // Don't forget the last run
  total = (total + (currentRunLength * (currentRunLength + 1)) / 2) % MOD;

  return total;
}
```

```java
// Time: O(n) | Space: O(1)
public int countHomogenous(String s) {
    final int MOD = 1_000_000_007;
    long total = 0;  // Use long to avoid overflow during calculation
    int currentRunLength = 0;

    for (int i = 0; i < s.length(); i++) {
        // If this is the first character OR same as previous character
        if (i == 0 || s.charAt(i) == s.charAt(i - 1)) {
            currentRunLength++;
        } else {
            // Character changed, so previous run ended
            // Add count for the completed run
            total = (total + (long) currentRunLength * (currentRunLength + 1) / 2) % MOD;
            // Start new run with current character
            currentRunLength = 1;
        }
    }

    // Don't forget the last run
    total = (total + (long) currentRunLength * (currentRunLength + 1) / 2) % MOD;

    return (int) total;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We make a single pass through the string of length `n`
- Each character is examined exactly once
- The arithmetic operations inside the loop are O(1)

**Space Complexity:** O(1)

- We only use a constant amount of extra space: variables for the total count, current run length, and loop index
- No additional data structures that scale with input size

## Common Mistakes

1. **Forgetting the modulo operation:** The problem explicitly states to return the answer modulo 10⁹+7. Candidates often calculate the correct count but forget to apply the modulo, or they apply it incorrectly (e.g., only at the end instead of during intermediate calculations).

2. **Off-by-one errors in run length counting:** When a character changes, it's easy to miscount whether the current character belongs to the previous run or starts a new one. The cleanest approach is to always compare `s[i]` with `s[i-1]` (for `i > 0`).

3. **Integer overflow:** For long runs, `k*(k+1)/2` can exceed 32-bit integer limits. In Java, use `long` for intermediate calculations. In Python, integers are arbitrary precision, but we still need modulo to keep numbers manageable.

4. **Forgetting the final run:** After the loop ends, there's always one last run that hasn't been counted. Candidates often miss this edge case, especially when the string ends with a long run.

## When You'll See This Pattern

This "run-length counting" pattern appears in many string and array problems:

1. **Consecutive Characters (LeetCode 1446):** Find the maximum length of a contiguous substring of the same character. This is essentially finding the longest run.

2. **Number of Substrings With Only 1s (LeetCode 1513):** Given a binary string, count the number of substrings containing only '1's. This is identical to our problem but restricted to '1' characters.

3. **Count Binary Substrings (LeetCode 696):** Count binary substrings with equal number of 0s and 1s, where all 0s and all 1s are grouped consecutively. This uses run-length encoding to group consecutive characters.

The core technique is recognizing that when dealing with contiguous properties, you can often process the input in a single pass by tracking runs or groups rather than examining every possible substring.

## Key Takeaways

1. **Avoid O(n²) substring enumeration:** When counting substrings with a specific property, look for mathematical formulas that let you count them in O(n) time by processing runs or groups.

2. **Run-length encoding is powerful:** Many string problems become simpler when you think in terms of consecutive runs of identical characters. This transforms substring problems into arithmetic problems.

3. **Watch for overflow and modulo:** In counting problems with large results, always check if you need modulo arithmetic and use appropriate data types to prevent overflow.

Related problems: [Consecutive Characters](/problem/consecutive-characters), [Number of Substrings With Only 1s](/problem/number-of-substrings-with-only-1s), [Sum of Subarray Ranges](/problem/sum-of-subarray-ranges)
