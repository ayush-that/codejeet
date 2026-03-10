---
title: "How to Solve Number of Ways to Select Buildings — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Number of Ways to Select Buildings. Medium difficulty, 50.9% acceptance rate. Topics: String, Dynamic Programming, Prefix Sum."
date: "2028-06-29"
category: "dsa-patterns"
tags:
  ["number-of-ways-to-select-buildings", "string", "dynamic-programming", "prefix-sum", "medium"]
---

# How to Solve Number of Ways to Select Buildings

You're given a binary string representing office (`'0'`) and restaurant (`'1'`) buildings. You need to count the number of ways to select three buildings such that no two adjacent selected buildings have the same type. This problem is tricky because it looks like a simple combination problem, but the "no two adjacent same type" constraint creates dependencies between selections that make brute force approaches too slow.

## Visual Walkthrough

Let's trace through example `s = "001101"`:

We need to count valid sequences of three indices `i < j < k` where:

- `s[i] != s[j]` AND `s[j] != s[k]`
- This means the sequence must alternate: either `"010"` or `"101"`

For `s = "001101"`:

- Valid `"010"` sequences:
  - Indices (0,2,3): `"0"` at 0, `"1"` at 2, `"0"` at 3 → `"010"` ✓
  - Indices (0,2,5): `"0"` at 0, `"1"` at 2, `"0"` at 5 → `"010"` ✓
  - Indices (0,4,5): `"0"` at 0, `"1"` at 4, `"0"` at 5 → `"010"` ✓
  - Indices (1,2,3): `"0"` at 1, `"1"` at 2, `"0"` at 3 → `"010"` ✓
  - Indices (1,2,5): `"0"` at 1, `"1"` at 2, `"0"` at 5 → `"010"` ✓
  - Indices (1,4,5): `"0"` at 1, `"1"` at 4, `"0"` at 5 → `"010"` ✓
  - Total: 6 `"010"` sequences

- Valid `"101"` sequences:
  - Indices (2,3,4): `"1"` at 2, `"0"` at 3, `"1"` at 4 → `"101"` ✓
  - Indices (2,3,5): `"1"` at 2, `"0"` at 3, `"1"` at 5 → `"101"` ✓
  - Indices (2,4,5): `"1"` at 2, `"0"` at 4, `"1"` at 5 → `"101"` ✓
  - Indices (4,3,5): Not valid (indices must be increasing)
  - Total: 3 `"101"` sequences

Total valid selections: 6 + 3 = 9

The key insight: For each middle building at index `j`, we can count how many valid left and right buildings exist. For example, when `j=2` with `s[2]='1'`:

- Left side: We need `'0'` buildings before index 2 → indices 0 and 1 → 2 options
- Right side: We need `'0'` buildings after index 2 → indices 3 and 5 → 2 options
- Valid sequences with `j=2` as middle: 2 × 2 = 4 sequences of type `"010"`

## Brute Force Approach

The most straightforward solution is to check all possible triplets `(i, j, k)` where `i < j < k`:

1. Generate all combinations of 3 indices from n indices (n choose 3)
2. For each combination, check if `s[i] != s[j]` and `s[j] != s[k]`
3. Count valid combinations

This approach has O(n³) time complexity since we need to check all triplets. For n up to 10⁵ (as in LeetCode constraints), this is completely infeasible (10¹⁵ operations).

<div class="code-group">

```python
# Time: O(n³) | Space: O(1) - Too slow for n up to 10⁵
def numberOfWaysBruteForce(s: str) -> int:
    n = len(s)
    count = 0

    # Check all possible triplets i < j < k
    for i in range(n):
        for j in range(i + 1, n):
            for k in range(j + 1, n):
                # Check if types alternate
                if s[i] != s[j] and s[j] != s[k]:
                    count += 1

    return count
```

```javascript
// Time: O(n³) | Space: O(1) - Too slow for n up to 10⁵
function numberOfWaysBruteForce(s) {
  const n = s.length;
  let count = 0;

  // Check all possible triplets i < j < k
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      for (let k = j + 1; k < n; k++) {
        // Check if types alternate
        if (s[i] !== s[j] && s[j] !== s[k]) {
          count++;
        }
      }
    }
  }

  return count;
}
```

```java
// Time: O(n³) | Space: O(1) - Too slow for n up to 10⁵
public long numberOfWaysBruteForce(String s) {
    int n = s.length();
    long count = 0;

    // Check all possible triplets i < j < k
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            for (int k = j + 1; k < n; k++) {
                // Check if types alternate
                if (s.charAt(i) != s.charAt(j) && s.charAt(j) != s.charAt(k)) {
                    count++;
                }
            }
        }
    }

    return count;
}
```

</div>

## Optimized Approach

The key insight is to fix the middle building and count valid left/right pairs:

For each index `j` as the middle building:

- If `s[j] == '0'`, we need `'1'` on left and `'1'` on right → pattern `"101"`
- If `s[j] == '1'`, we need `'0'` on left and `'0'` on right → pattern `"010"`

We can precompute:

1. `totalZeros` and `totalOnes` in the entire string
2. For each position `j`, track:
   - `zerosLeft`: number of `'0'` before index `j`
   - `onesLeft`: number of `'1'` before index `j`
   - `zerosRight`: number of `'0'` after index `j` = `totalZeros - zerosLeft - (1 if s[j]=='0' else 0)`
   - `onesRight`: number of `'1'` after index `j` = `totalOnes - onesLeft - (1 if s[j]=='1' else 0)`

Then for each `j`:

- If `s[j] == '0'`: valid sequences = `onesLeft × onesRight` (pattern `"101"`)
- If `s[j] == '1'`: valid sequences = `zerosLeft × zerosRight` (pattern `"010"`)

This reduces the problem to O(n) time with O(1) extra space!

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def numberOfWays(s: str) -> int:
    n = len(s)

    # Step 1: Count total zeros and ones in the entire string
    total_zeros = s.count('0')
    total_ones = n - total_zeros

    # Step 2: Initialize counters for zeros/ones seen so far
    zeros_left = 0
    ones_left = 0
    result = 0

    # Step 3: Iterate through each position as the middle building
    for i in range(n):
        # Calculate zeros/ones on the right of current position
        zeros_right = total_zeros - zeros_left
        ones_right = total_ones - ones_left

        # Adjust for current character (it's not on left or right)
        if s[i] == '0':
            zeros_right -= 1  # Current '0' is not on the right
            # Pattern "101": current is '0', need '1' on both sides
            result += ones_left * ones_right
            zeros_left += 1  # Update count for next iteration
        else:  # s[i] == '1'
            ones_right -= 1  # Current '1' is not on the right
            # Pattern "010": current is '1', need '0' on both sides
            result += zeros_left * zeros_right
            ones_left += 1  # Update count for next iteration

    return result
```

```javascript
// Time: O(n) | Space: O(1)
function numberOfWays(s) {
  const n = s.length;

  // Step 1: Count total zeros and ones in the entire string
  let totalZeros = 0;
  for (let i = 0; i < n; i++) {
    if (s[i] === "0") totalZeros++;
  }
  const totalOnes = n - totalZeros;

  // Step 2: Initialize counters for zeros/ones seen so far
  let zerosLeft = 0;
  let onesLeft = 0;
  let result = 0;

  // Step 3: Iterate through each position as the middle building
  for (let i = 0; i < n; i++) {
    // Calculate zeros/ones on the right of current position
    let zerosRight = totalZeros - zerosLeft;
    let onesRight = totalOnes - onesLeft;

    // Adjust for current character (it's not on left or right)
    if (s[i] === "0") {
      zerosRight--; // Current '0' is not on the right
      // Pattern "101": current is '0', need '1' on both sides
      result += onesLeft * onesRight;
      zerosLeft++; // Update count for next iteration
    } else {
      onesRight--; // Current '1' is not on the right
      // Pattern "010": current is '1', need '0' on both sides
      result += zerosLeft * zerosRight;
      onesLeft++; // Update count for next iteration
    }
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(1)
public long numberOfWays(String s) {
    int n = s.length();

    // Step 1: Count total zeros and ones in the entire string
    int totalZeros = 0;
    for (int i = 0; i < n; i++) {
        if (s.charAt(i) == '0') totalZeros++;
    }
    int totalOnes = n - totalZeros;

    // Step 2: Initialize counters for zeros/ones seen so far
    int zerosLeft = 0;
    int onesLeft = 0;
    long result = 0;  // Use long to avoid integer overflow for large n

    // Step 3: Iterate through each position as the middle building
    for (int i = 0; i < n; i++) {
        // Calculate zeros/ones on the right of current position
        int zerosRight = totalZeros - zerosLeft;
        int onesRight = totalOnes - onesLeft;

        // Adjust for current character (it's not on left or right)
        if (s.charAt(i) == '0') {
            zerosRight--;  // Current '0' is not on the right
            // Pattern "101": current is '0', need '1' on both sides
            result += (long) onesLeft * onesRight;
            zerosLeft++;  // Update count for next iteration
        } else {
            onesRight--;  // Current '1' is not on the right
            // Pattern "010": current is '1', need '0' on both sides
            result += (long) zerosLeft * zerosRight;
            onesLeft++;  // Update count for next iteration
        }
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make two passes through the string: one to count total zeros/ones (O(n)), and one to calculate the result (O(n))
- Each pass involves simple arithmetic operations, so overall O(n)

**Space Complexity: O(1)**

- We only use a constant number of integer variables regardless of input size
- No additional data structures that grow with input size

## Common Mistakes

1. **Not using long/int64 for result**: For n up to 10⁵, the result can be as large as C(10⁵, 3) ≈ 1.6×10¹⁴, which exceeds 32-bit integer limits. Always use 64-bit integers (long in Java/C++, int64 in Python).

2. **Incorrectly calculating right counts**: Forgetting to subtract the current character when calculating `zerosRight` or `onesRight`. The current building at index `j` is neither on the left nor right side.

3. **Confusing the patterns**: Mixing up when to use `"010"` vs `"101"`. Remember: if middle is `'0'`, we need `'1'` on both sides (`"101"`). If middle is `'1'`, we need `'0'` on both sides (`"010"`).

4. **Off-by-one in prefix sums**: When updating `zerosLeft` or `onesLeft`, make sure to do it AFTER using the current counts for calculation, not before.

## When You'll See This Pattern

This "fix the middle element and count valid left/right pairs" pattern appears in many counting problems:

1. **Count Number of Teams** (LeetCode 1395): Count increasing/decreasing triplets in an array. The solution fixes the middle soldier and counts valid left/right pairs.

2. **Sum of Beauty of All Substrings** (LeetCode 1781): For each character in a substring, count how many times it appears and find min/max frequencies.

3. **Count Nice Pairs in an Array** (LeetCode 1814): The transformation `rev(nums[i]) - nums[i] = rev(nums[j]) - nums[j]` creates pairs that can be counted efficiently.

The core technique is transforming a O(n³) triplet problem into O(n) by fixing one element and using prefix/suffix counts.

## Key Takeaways

1. **Fix the middle element**: When counting triplets with constraints, fixing the middle element often allows O(n) solutions using prefix/suffix computations.

2. **Alternating patterns simplify**: The "no two adjacent same type" constraint creates only two valid patterns (`"010"` and `"101"`), making the counting straightforward.

3. **Precompute totals**: Counting total zeros/ones first allows O(1) calculation of right-side counts at each position, avoiding nested loops.

[Practice this problem on CodeJeet](/problem/number-of-ways-to-select-buildings)
