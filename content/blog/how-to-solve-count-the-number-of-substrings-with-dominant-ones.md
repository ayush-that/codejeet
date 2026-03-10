---
title: "How to Solve Count the Number of Substrings With Dominant Ones — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count the Number of Substrings With Dominant Ones. Medium difficulty, 42.1% acceptance rate. Topics: String, Enumeration."
date: "2028-03-17"
category: "dsa-patterns"
tags: ["count-the-number-of-substrings-with-dominant-ones", "string", "enumeration", "medium"]
---

# How to Solve Count the Number of Substrings With Dominant Ones

This problem asks us to count all substrings of a binary string where the number of ones is at least the square of the number of zeros. What makes this interesting is that we need to efficiently check this non-linear condition across all possible substrings without resorting to the O(n³) brute force approach.

## Visual Walkthrough

Let's trace through the example `s = "101"`:

All possible substrings:

1. `"1"`: ones=1, zeros=0 → 1 ≥ 0² ✓ (count=1)
2. `"0"`: ones=0, zeros=1 → 0 ≥ 1² ✗ (count=1)
3. `"1"`: ones=1, zeros=0 → 1 ≥ 0² ✓ (count=2)
4. `"10"`: ones=1, zeros=1 → 1 ≥ 1² ✓ (count=3)
5. `"01"`: ones=1, zeros=1 → 1 ≥ 1² ✓ (count=4)
6. `"101"`: ones=2, zeros=1 → 2 ≥ 1² ✓ (count=5)

So for `"101"`, the answer is 5.

The challenge is that for a string of length n, there are n(n+1)/2 substrings (≈500,000 for n=1000). Checking each one individually would be O(n³) if we recount ones and zeros each time.

## Brute Force Approach

The most straightforward approach is to generate all substrings and check each one:

1. Generate all starting indices i from 0 to n-1
2. For each i, generate all ending indices j from i to n-1
3. For each substring s[i:j+1], count ones and zeros
4. Check if ones ≥ zeros²

<div class="code-group">

```python
# Time: O(n³) | Space: O(1)
def countSubstringsBruteForce(s):
    n = len(s)
    count = 0

    # Generate all substrings
    for i in range(n):
        for j in range(i, n):
            ones = 0
            zeros = 0

            # Count ones and zeros in current substring
            for k in range(i, j + 1):
                if s[k] == '1':
                    ones += 1
                else:
                    zeros += 1

            # Check dominant condition
            if ones >= zeros * zeros:
                count += 1

    return count
```

```javascript
// Time: O(n³) | Space: O(1)
function countSubstringsBruteForce(s) {
  const n = s.length;
  let count = 0;

  // Generate all substrings
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      let ones = 0;
      let zeros = 0;

      // Count ones and zeros in current substring
      for (let k = i; k <= j; k++) {
        if (s[k] === "1") {
          ones++;
        } else {
          zeros++;
        }
      }

      // Check dominant condition
      if (ones >= zeros * zeros) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n³) | Space: O(1)
public int countSubstringsBruteForce(String s) {
    int n = s.length();
    int count = 0;

    // Generate all substrings
    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            int ones = 0;
            int zeros = 0;

            // Count ones and zeros in current substring
            for (int k = i; k <= j; k++) {
                if (s.charAt(k) == '1') {
                    ones++;
                } else {
                    zeros++;
                }
            }

            // Check dominant condition
            if (ones >= zeros * zeros) {
                count++;
            }
        }
    }

    return count;
}
```

</div>

**Why this fails:** With O(n³) time complexity, this solution times out for n > 200. We need something closer to O(n²) or better.

## Optimized Approach

The key insight is that we can optimize the counting process using prefix sums. Let's define:

- `prefixOnes[i]` = number of ones in s[0:i]
- `prefixZeros[i]` = number of zeros in s[0:i]

Then for any substring s[i:j]:

- `ones = prefixOnes[j+1] - prefixOnes[i]`
- `zeros = prefixZeros[j+1] - prefixZeros[i]`

This reduces substring counting from O(n) to O(1), giving us O(n²) overall.

But we can do even better with another observation: For a fixed starting index i, as we extend the substring to the right (increasing j), the number of zeros increases, but the condition `ones ≥ zeros²` becomes harder to satisfy. Once it fails for some j, it will fail for all larger j (since zeros² grows faster than linearly).

This gives us a two-pointer approach:

1. For each starting index i, find the smallest j where the condition fails
2. All substrings from i to positions before j are valid
3. Use prefix sums to quickly compute ones and zeros

## Optimal Solution

Here's the O(n²) solution using prefix sums and the monotonic property:

<div class="code-group">

```python
# Time: O(n²) | Space: O(n)
def countSubstrings(s):
    n = len(s)

    # Build prefix sums for quick substring calculations
    # prefixOnes[i] = count of '1' in s[0:i] (exclusive of i)
    # prefixZeros[i] = count of '0' in s[0:i]
    prefixOnes = [0] * (n + 1)
    prefixZeros = [0] * (n + 1)

    for i in range(n):
        prefixOnes[i + 1] = prefixOnes[i] + (1 if s[i] == '1' else 0)
        prefixZeros[i + 1] = prefixZeros[i] + (1 if s[i] == '0' else 0)

    count = 0

    # For each starting position
    for i in range(n):
        # For each ending position starting from i
        # We can break early when condition fails due to monotonic property
        for j in range(i, n):
            # Calculate ones and zeros in substring s[i:j+1]
            ones = prefixOnes[j + 1] - prefixOnes[i]
            zeros = prefixZeros[j + 1] - prefixZeros[i]

            # Check the dominant condition
            if ones >= zeros * zeros:
                count += 1
            else:
                # Once condition fails for this j, it will fail for all larger j
                # because zeros² grows faster than ones
                break

    return count
```

```javascript
// Time: O(n²) | Space: O(n)
function countSubstrings(s) {
  const n = s.length;

  // Build prefix sums for quick substring calculations
  // prefixOnes[i] = count of '1' in s[0:i] (exclusive of i)
  // prefixZeros[i] = count of '0' in s[0:i]
  const prefixOnes = new Array(n + 1).fill(0);
  const prefixZeros = new Array(n + 1).fill(0);

  for (let i = 0; i < n; i++) {
    prefixOnes[i + 1] = prefixOnes[i] + (s[i] === "1" ? 1 : 0);
    prefixZeros[i + 1] = prefixZeros[i] + (s[i] === "0" ? 1 : 0);
  }

  let count = 0;

  // For each starting position
  for (let i = 0; i < n; i++) {
    // For each ending position starting from i
    // We can break early when condition fails due to monotonic property
    for (let j = i; j < n; j++) {
      // Calculate ones and zeros in substring s[i:j+1]
      const ones = prefixOnes[j + 1] - prefixOnes[i];
      const zeros = prefixZeros[j + 1] - prefixZeros[i];

      // Check the dominant condition
      if (ones >= zeros * zeros) {
        count++;
      } else {
        // Once condition fails for this j, it will fail for all larger j
        // because zeros² grows faster than ones
        break;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n²) | Space: O(n)
public int countSubstrings(String s) {
    int n = s.length();

    // Build prefix sums for quick substring calculations
    // prefixOnes[i] = count of '1' in s[0:i] (exclusive of i)
    // prefixZeros[i] = count of '0' in s[0:i]
    int[] prefixOnes = new int[n + 1];
    int[] prefixZeros = new int[n + 1];

    for (int i = 0; i < n; i++) {
        prefixOnes[i + 1] = prefixOnes[i] + (s.charAt(i) == '1' ? 1 : 0);
        prefixZeros[i + 1] = prefixZeros[i] + (s.charAt(i) == '0' ? 1 : 0);
    }

    int count = 0;

    // For each starting position
    for (int i = 0; i < n; i++) {
        // For each ending position starting from i
        // We can break early when condition fails due to monotonic property
        for (int j = i; j < n; j++) {
            // Calculate ones and zeros in substring s[i:j+1]
            int ones = prefixOnes[j + 1] - prefixOnes[i];
            int zeros = prefixZeros[j + 1] - prefixZeros[i];

            // Check the dominant condition
            if (ones >= zeros * zeros) {
                count++;
            } else {
                // Once condition fails for this j, it will fail for all larger j
                // because zeros² grows faster than ones
                break;
            }
        }
    }

    return count;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n²) in the worst case, but often better due to early breaking. In the worst case (string of all '1's), the condition always holds, so we check all O(n²) substrings. With early breaking, we typically do much better.

**Space Complexity:** O(n) for storing the prefix sum arrays. We could optimize to O(1) by counting ones and zeros on the fly, but that would make the code less clear and only provide constant factor improvement.

## Common Mistakes

1. **Forgetting the early break condition:** Without realizing that `zeros²` grows faster than `ones`, candidates might check all O(n²) substrings even when unnecessary. The early break is crucial for good performance.

2. **Off-by-one errors with prefix sums:** A common mistake is using `prefixOnes[j] - prefixOnes[i]` instead of `prefixOnes[j+1] - prefixOnes[i]`. Remember: `prefixOnes[i]` counts characters in `s[0:i)` (exclusive of i).

3. **Integer overflow for large n:** When n=1000, n²=1,000,000 which fits in 32-bit integers, but if you're not careful with intermediate calculations (like computing all substrings count as n(n+1)/2), you might overflow in some languages.

4. **Misunderstanding the condition:** The problem says "greater than or equal to" not "greater than". Also note it's `ones ≥ zeros²`, not `ones > zeros²`.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Prefix Sums for substring queries** - Used in problems like:
   - "Range Sum Query - Immutable" (LeetCode 303)
   - "Subarray Sum Equals K" (LeetCode 560)

2. **Two-pointer/sliding window with monotonic property** - Used when some condition becomes easier/harder as the window expands:
   - "Minimum Size Subarray Sum" (LeetCode 209)
   - "Longest Substring Without Repeating Characters" (LeetCode 3)

3. **Counting substrings with constraints** - Similar to:
   - "Count Binary Substrings" (LeetCode 696) - which asks for substrings with equal numbers of 0s and 1s in groups
   - "Subarrays with K Different Integers" (LeetCode 992)

## Key Takeaways

1. **Prefix sums transform O(n) substring queries into O(1)** - When you need to repeatedly compute sums/counts over subarrays/substrings, prefix sums are your first tool to reach for.

2. **Look for monotonic properties to enable early termination** - If a condition becomes strictly harder or easier as you extend a substring, you can break early from inner loops.

3. **Square terms create interesting constraints** - The `zeros²` term means zeros are heavily penalized. A substring with many zeros needs exponentially more ones to satisfy the condition.

Related problems: [Count Binary Substrings](/problem/count-binary-substrings)
