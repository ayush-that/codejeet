---
title: "How to Solve DI String Match — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode DI String Match. Easy difficulty, 80.9% acceptance rate. Topics: Array, Two Pointers, String, Greedy."
date: "2028-09-15"
category: "dsa-patterns"
tags: ["di-string-match", "array", "two-pointers", "string", "easy"]
---

# How to Solve DI String Match

This problem asks us to reconstruct a permutation of numbers 0 through `n` given a string `s` of length `n` where each character tells us whether consecutive numbers in the permutation increase ('I') or decrease ('D'). What makes this problem interesting is that while it appears to be a backtracking/permutation problem, it has a clever greedy solution that runs in linear time with constant space. The key insight is recognizing that we can use the smallest available number for 'D' and largest available number for 'I' to guarantee we always have valid numbers available.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `s = "IDID"` (n = 4, so we need numbers 0 through 4).

We'll maintain two pointers: `low = 0` and `high = 4` (since n = 4). We'll build our result array as we process each character:

1. **First character 'I'**: We need `perm[0] < perm[1]`. If we put the smallest available number (0) at position 0, we guarantee that whatever comes next (which will be ≥ 0) satisfies the 'I' condition. So `result[0] = 0`, increment `low` to 1.
   - Result: `[0, _, _, _, _]`, low=1, high=4

2. **Second character 'D'**: We need `perm[1] > perm[2]`. If we put the largest available number (4) at position 1, we guarantee that whatever comes next (which will be ≤ 4) satisfies the 'D' condition. So `result[1] = 4`, decrement `high` to 3.
   - Result: `[0, 4, _, _, _]`, low=1, high=3

3. **Third character 'I'**: We need `perm[2] < perm[3]`. Put the smallest available number (1) at position 2. So `result[2] = 1`, increment `low` to 2.
   - Result: `[0, 4, 1, _, _]`, low=2, high=3

4. **Fourth character 'D'**: We need `perm[3] > perm[4]`. Put the largest available number (3) at position 3. So `result[3] = 3`, decrement `high` to 2.
   - Result: `[0, 4, 1, 3, _]`, low=2, high=2

5. **Final position**: We have one number left (2) and one position left. Since `low == high`, we set `result[4] = 2`.
   - Final result: `[0, 4, 1, 3, 2]`

Let's verify:

- `0 < 4` ✓ (I)
- `4 > 1` ✓ (D)
- `1 < 3` ✓ (I)
- `3 > 2` ✓ (D)

The pattern is clear: for 'I', use the smallest available number; for 'D', use the largest available number. This ensures we always have valid numbers for future positions.

## Brute Force Approach

A naive approach would be to generate all permutations of numbers 0 through n and check which one satisfies the string constraints. For each permutation, we'd compare consecutive elements according to the 'I'/'D' rules.

The problem with this approach is the time complexity: generating all permutations of n+1 numbers takes O((n+1)!) time, which is astronomical even for moderate n. For n=10, that's 39,916,800 permutations to check!

Even if we try to prune early (backtracking), in the worst case we still explore many invalid permutations. The optimal solution avoids this combinatorial explosion entirely.

## Optimal Solution

The greedy two-pointer approach works because:

1. When we see 'I', we want the current number to be as small as possible so the next number can be larger
2. When we see 'D', we want the current number to be as large as possible so the next number can be smaller
3. By tracking the smallest and largest unused numbers, we guarantee we always have valid options

<div class="code-group">

```python
# Time: O(n) | Space: O(1) excluding output array
def diStringMatch(s: str):
    n = len(s)
    # Initialize result array with n+1 elements (since perm has n+1 numbers)
    result = [0] * (n + 1)

    # Two pointers: low starts at 0, high starts at n
    low, high = 0, n

    # Process each character in the string
    for i in range(n):
        if s[i] == 'I':
            # For 'I', use the smallest available number
            result[i] = low
            low += 1  # Move low pointer up
        else:  # s[i] == 'D'
            # For 'D', use the largest available number
            result[i] = high
            high -= 1  # Move high pointer down

    # Fill the last position with the remaining number
    # At this point, low == high
    result[n] = low  # or result[n] = high

    return result
```

```javascript
// Time: O(n) | Space: O(1) excluding output array
function diStringMatch(s) {
  const n = s.length;
  // Initialize result array with n+1 elements
  const result = new Array(n + 1);

  // Two pointers: low starts at 0, high starts at n
  let low = 0,
    high = n;

  // Process each character in the string
  for (let i = 0; i < n; i++) {
    if (s[i] === "I") {
      // For 'I', use the smallest available number
      result[i] = low;
      low++; // Move low pointer up
    } else {
      // s[i] === 'D'
      // For 'D', use the largest available number
      result[i] = high;
      high--; // Move high pointer down
    }
  }

  // Fill the last position with the remaining number
  // At this point, low === high
  result[n] = low; // or result[n] = high

  return result;
}
```

```java
// Time: O(n) | Space: O(1) excluding output array
public int[] diStringMatch(String s) {
    int n = s.length();
    // Initialize result array with n+1 elements
    int[] result = new int[n + 1];

    // Two pointers: low starts at 0, high starts at n
    int low = 0, high = n;

    // Process each character in the string
    for (int i = 0; i < n; i++) {
        if (s.charAt(i) == 'I') {
            // For 'I', use the smallest available number
            result[i] = low;
            low++;  // Move low pointer up
        } else {  // s.charAt(i) == 'D'
            // For 'D', use the largest available number
            result[i] = high;
            high--;  // Move high pointer down
        }
    }

    // Fill the last position with the remaining number
    // At this point, low == high
    result[n] = low;  // or result[n] = high

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the string once, performing constant-time operations for each character
- The final assignment is also constant time
- Total operations: n iterations + 1 final assignment = O(n)

**Space Complexity: O(1) auxiliary space, O(n) output space**

- We only use a few integer variables (low, high, i) regardless of input size
- The output array requires O(n+1) = O(n) space, but this is typically not counted as auxiliary space in interview contexts unless specified
- If we count the output array, total space is O(n)

## Common Mistakes

1. **Off-by-one errors with array indices**: The result array has length `n+1`, but the string has length `n`. Candidates often create an array of length `n` or try to access `result[n+1]`. Remember: if `s` has `n` characters comparing `n+1` numbers, you need `n+1` positions in your result.

2. **Forgetting the last element**: After processing all characters, we have one number left to place. Some candidates forget to add this final number. The loop handles positions 0 through n-1, so position n needs to be filled separately.

3. **Incorrect pointer initialization**: Setting `high = n-1` instead of `high = n`. Since we need numbers from 0 to n inclusive, the maximum value is n, not n-1.

4. **Assuming input validation**: The problem guarantees the string only contains 'I' and 'D', but in a real interview, mentioning edge cases like empty string shows attention to detail. For empty string, we should return `[0]`.

## When You'll See This Pattern

This greedy two-pointer pattern appears in problems where you need to construct a sequence satisfying certain constraints with limited resources (numbers in a range):

1. **Construct Smallest Number From DI String (Medium)**: Similar concept but with digits 1-9 instead of 0-n. The same greedy approach works with slight modification.

2. **Two Sum II - Input Array Is Sorted (Easy)**: Uses two pointers from opposite ends to find pairs summing to a target. The "move inward based on comparison" logic is similar.

3. **Container With Most Water (Medium)**: Uses two pointers at opposite ends, moving the pointer with smaller height inward. The pattern of adjusting pointers based on comparisons is analogous.

The core insight is recognizing when you can make locally optimal choices (greedy) that don't invalidate future choices, often by keeping track of extreme values.

## Key Takeaways

1. **Greedy with two pointers**: When you need to allocate numbers from a range to satisfy ordering constraints, consider using the smallest available number for increasing requirements and largest for decreasing requirements.

2. **Problem transformation**: Instead of thinking about permutations (which suggests backtracking), recognize this as a resource allocation problem. We have numbers 0 through n as resources to allocate according to specific rules.

3. **Verification strategy**: Always test your solution with edge cases: all 'I's, all 'D's, alternating patterns, and the empty string. This helps catch off-by-one errors.

Related problems: [Construct Smallest Number From DI String](/problem/construct-smallest-number-from-di-string)
