---
title: "How to Solve Sum of Total Strength of Wizards — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Sum of Total Strength of Wizards. Hard difficulty, 29.2% acceptance rate. Topics: Array, Stack, Monotonic Stack, Prefix Sum."
date: "2029-08-05"
category: "dsa-patterns"
tags: ["sum-of-total-strength-of-wizards", "array", "stack", "monotonic-stack", "hard"]
---

# How to Solve Sum of Total Strength of Wizards

This problem asks us to calculate the sum of the "total strength" of all contiguous subarrays of wizards, where a subarray's total strength is defined as the minimum strength in that subarray multiplied by the sum of all strengths in that subarray. The challenge comes from needing to efficiently consider **all O(n²) subarrays** while avoiding O(n²) time complexity. The key insight is that we can use each element as the minimum for certain subarrays and compute contributions efficiently using prefix sums and monotonic stacks.

## Visual Walkthrough

Let's trace through a small example: `strength = [1, 3, 2]`

We need to sum the total strength of all contiguous subarrays:

- `[1]`: min=1, sum=1 → 1×1 = 1
- `[3]`: min=3, sum=3 → 3×3 = 9
- `[2]`: min=2, sum=2 → 2×2 = 4
- `[1, 3]`: min=1, sum=4 → 1×4 = 4
- `[3, 2]`: min=2, sum=5 → 2×5 = 10
- `[1, 3, 2]`: min=1, sum=6 → 1×6 = 6

Total = 1 + 9 + 4 + 4 + 10 + 6 = 34

The brute force approach would compute all these subarrays explicitly, but for n=10⁵, that's impossible. Instead, think about each element's role as a minimum. For example, the element `1` at index 0 is the minimum for subarrays `[1]`, `[1, 3]`, and `[1, 3, 2]`. The element `3` at index 1 is the minimum only for `[3]` since both neighbors are smaller or equal. The element `2` at index 2 is the minimum for `[2]` and `[3, 2]`.

The efficient approach: For each element `strength[i]`, find the range `(left, right)` where it's the minimum. Then all subarrays starting between `left+1` and `i` and ending between `i` and `right-1` have `strength[i]` as their minimum. We can compute the sum of sums of these subarrays using prefix sums of prefix sums.

## Brute Force Approach

The most straightforward solution is to enumerate all O(n²) subarrays, find the minimum and sum for each, and accumulate the results:

<div class="code-group">

```python
# Time: O(n³) | Space: O(1)
def totalStrengthBrute(strength):
    n = len(strength)
    total = 0
    MOD = 10**9 + 7

    # Generate all subarrays
    for i in range(n):
        for j in range(i, n):
            # Find min and sum for subarray [i..j]
            min_val = float('inf')
            sub_sum = 0
            for k in range(i, j + 1):
                min_val = min(min_val, strength[k])
                sub_sum += strength[k]
            total = (total + min_val * sub_sum) % MOD

    return total
```

```javascript
// Time: O(n³) | Space: O(1)
function totalStrengthBrute(strength) {
  const n = strength.length;
  let total = 0;
  const MOD = 1e9 + 7;

  // Generate all subarrays
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      // Find min and sum for subarray [i..j]
      let minVal = Infinity;
      let subSum = 0;
      for (let k = i; k <= j; k++) {
        minVal = Math.min(minVal, strength[k]);
        subSum += strength[k];
      }
      total = (total + minVal * subSum) % MOD;
    }
  }

  return total;
}
```

```java
// Time: O(n³) | Space: O(1)
public int totalStrengthBrute(int[] strength) {
    int n = strength.length;
    long total = 0;
    final int MOD = 1_000_000_007;

    // Generate all subarrays
    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            // Find min and sum for subarray [i..j]
            int minVal = Integer.MAX_VALUE;
            long subSum = 0;
            for (int k = i; k <= j; k++) {
                minVal = Math.min(minVal, strength[k]);
                subSum += strength[k];
            }
            total = (total + minVal * subSum) % MOD;
        }
    }

    return (int) total;
}
```

</div>

This runs in O(n³) time (O(n²) subarrays, each taking O(n) to compute min and sum). Even with O(n²) optimization (precomputing prefix sums and using segment trees for range minimum queries), we'd still have O(n²) time, which is too slow for n up to 10⁵.

## Optimized Approach

The key insight is to treat each element as the **minimum** for certain subarrays. For each index `i`, we find:

- `left[i]`: the index of the previous element that is **strictly smaller** than `strength[i]` (or -1 if none)
- `right[i]`: the index of the next element that is **less than or equal** to `strength[i]` (or n if none)

Using strict inequality on the left and non-strict on the right ensures each subarray's minimum is counted exactly once.

For `strength[i]` as the minimum, consider all subarrays starting between `(left[i], i]` and ending between `[i, right[i])`. Let:

- `L = left[i] + 1` (first start index where i is minimum)
- `R = right[i] - 1` (last end index where i is minimum)
- `lenL = i - L + 1` (number of possible start positions)
- `lenR = R - i + 1` (number of possible end positions)

We need the sum of sums of all these subarrays. This can be computed efficiently using **prefix sums of prefix sums**:

Let `prefix[i]` = sum of first i elements (prefix sum)
Let `prefixPrefix[i]` = sum of first i prefix sums

Then the sum of sums of subarrays starting at `a` and ending at `b` can be expressed as:
`sum_{a≤s≤i≤e≤b} sum(strength[s..e]) = (i-L+1)*(prefixPrefix[R+1]-prefixPrefix[i]) - (R-i+1)*(prefixPrefix[i]-prefixPrefix[L])`

This formula comes from considering contributions of each element to subarrays where `strength[i]` is the minimum.

## Optimal Solution

Here's the complete solution using monotonic stacks and prefix sums:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def totalStrength(strength):
    MOD = 10**9 + 7
    n = len(strength)

    # Step 1: Find left boundaries where strength[i] is minimum
    # left[i] = index of previous element < strength[i], or -1
    left = [-1] * n
    stack = []
    for i in range(n):
        while stack and strength[stack[-1]] >= strength[i]:
            stack.pop()
        left[i] = stack[-1] if stack else -1
        stack.append(i)

    # Step 2: Find right boundaries where strength[i] is minimum
    # right[i] = index of next element <= strength[i], or n
    right = [n] * n
    stack.clear()
    for i in range(n - 1, -1, -1):
        # Use > instead of >= to handle duplicates correctly
        while stack and strength[stack[-1]] > strength[i]:
            stack.pop()
        right[i] = stack[-1] if stack else n
        stack.append(i)

    # Step 3: Compute prefix sums and prefix of prefix sums
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = (prefix[i] + strength[i]) % MOD

    prefix_prefix = [0] * (n + 2)
    for i in range(n + 1):
        prefix_prefix[i + 1] = (prefix_prefix[i] + prefix[i]) % MOD

    # Step 4: Calculate total strength
    total = 0
    for i in range(n):
        # Boundaries where strength[i] is the minimum
        L = left[i] + 1  # first index where i is minimum
        R = right[i] - 1 # last index where i is minimum

        # Number of subarrays starting/ending with i as minimum
        len_left = i - L + 1
        len_right = R - i + 1

        # Using the derived formula for sum of sums:
        # sum_{L≤s≤i≤e≤R} sum(strength[s..e]) =
        #   len_left * (prefix_prefix[R+2] - prefix_prefix[i+1]) -
        #   len_right * (prefix_prefix[i+1] - prefix_prefix[L])

        # Note: +2 and +1 offsets due to prefix_prefix starting at index 1
        left_sum = (prefix_prefix[R + 2] - prefix_prefix[i + 1]) % MOD
        right_sum = (prefix_prefix[i + 1] - prefix_prefix[L]) % MOD

        # Contribution of strength[i] as minimum
        contribution = (strength[i] * (len_left * left_sum - len_right * right_sum)) % MOD
        total = (total + contribution) % MOD

    return total % MOD
```

```javascript
// Time: O(n) | Space: O(n)
function totalStrength(strength) {
  const MOD = 1_000_000_007n;
  const n = strength.length;

  // Step 1: Find left boundaries where strength[i] is minimum
  const left = new Array(n).fill(-1);
  const stack = [];
  for (let i = 0; i < n; i++) {
    while (stack.length && strength[stack[stack.length - 1]] >= strength[i]) {
      stack.pop();
    }
    left[i] = stack.length ? stack[stack.length - 1] : -1;
    stack.push(i);
  }

  // Step 2: Find right boundaries where strength[i] is minimum
  const right = new Array(n).fill(n);
  stack.length = 0;
  for (let i = n - 1; i >= 0; i--) {
    // Use > instead of >= to handle duplicates correctly
    while (stack.length && strength[stack[stack.length - 1]] > strength[i]) {
      stack.pop();
    }
    right[i] = stack.length ? stack[stack.length - 1] : n;
    stack.push(i);
  }

  // Step 3: Compute prefix sums and prefix of prefix sums
  const prefix = new Array(n + 1).fill(0n);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = (prefix[i] + BigInt(strength[i])) % MOD;
  }

  const prefixPrefix = new Array(n + 2).fill(0n);
  for (let i = 0; i <= n; i++) {
    prefixPrefix[i + 1] = (prefixPrefix[i] + prefix[i]) % MOD;
  }

  // Step 4: Calculate total strength
  let total = 0n;
  for (let i = 0; i < n; i++) {
    // Boundaries where strength[i] is the minimum
    const L = left[i] + 1; // first index where i is minimum
    const R = right[i] - 1; // last index where i is minimum

    // Number of subarrays starting/ending with i as minimum
    const lenLeft = BigInt(i - L + 1);
    const lenRight = BigInt(R - i + 1);

    // Using the derived formula for sum of sums
    const leftSum = (prefixPrefix[R + 2] - prefixPrefix[i + 1] + MOD) % MOD;
    const rightSum = (prefixPrefix[i + 1] - prefixPrefix[L] + MOD) % MOD;

    // Contribution of strength[i] as minimum
    const strengthVal = BigInt(strength[i]);
    let contribution = (strengthVal * ((lenLeft * leftSum) % MOD)) % MOD;
    contribution =
      (contribution - ((strengthVal * ((lenRight * rightSum) % MOD)) % MOD) + MOD) % MOD;

    total = (total + contribution) % MOD;
  }

  return Number(total % MOD);
}
```

```java
// Time: O(n) | Space: O(n)
public int totalStrength(int[] strength) {
    final int MOD = 1_000_000_007;
    int n = strength.length;

    // Step 1: Find left boundaries where strength[i] is minimum
    int[] left = new int[n];
    Deque<Integer> stack = new ArrayDeque<>();
    for (int i = 0; i < n; i++) {
        while (!stack.isEmpty() && strength[stack.peek()] >= strength[i]) {
            stack.pop();
        }
        left[i] = stack.isEmpty() ? -1 : stack.peek();
        stack.push(i);
    }

    // Step 2: Find right boundaries where strength[i] is minimum
    int[] right = new int[n];
    stack.clear();
    for (int i = n - 1; i >= 0; i--) {
        // Use > instead of >= to handle duplicates correctly
        while (!stack.isEmpty() && strength[stack.peek()] > strength[i]) {
            stack.pop();
        }
        right[i] = stack.isEmpty() ? n : stack.peek();
        stack.push(i);
    }

    // Step 3: Compute prefix sums and prefix of prefix sums
    long[] prefix = new long[n + 1];
    for (int i = 0; i < n; i++) {
        prefix[i + 1] = (prefix[i] + strength[i]) % MOD;
    }

    long[] prefixPrefix = new long[n + 2];
    for (int i = 0; i <= n; i++) {
        prefixPrefix[i + 1] = (prefixPrefix[i] + prefix[i]) % MOD;
    }

    // Step 4: Calculate total strength
    long total = 0;
    for (int i = 0; i < n; i++) {
        // Boundaries where strength[i] is the minimum
        int L = left[i] + 1;  // first index where i is minimum
        int R = right[i] - 1; // last index where i is minimum

        // Number of subarrays starting/ending with i as minimum
        long lenLeft = i - L + 1;
        long lenRight = R - i + 1;

        // Using the derived formula for sum of sums
        long leftSum = (prefixPrefix[R + 2] - prefixPrefix[i + 1] + MOD) % MOD;
        long rightSum = (prefixPrefix[i + 1] - prefixPrefix[L] + MOD) % MOD;

        // Contribution of strength[i] as minimum
        long contribution = (strength[i] * ((lenLeft * leftSum) % MOD)) % MOD;
        contribution = (contribution - (strength[i] * ((lenRight * rightSum) % MOD)) % MOD + MOD) % MOD;

        total = (total + contribution) % MOD;
    }

    return (int) total;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)** - We make four passes through the array:

1. O(n) to find left boundaries using a monotonic stack
2. O(n) to find right boundaries using a monotonic stack
3. O(n) to compute prefix sums
4. O(n) to compute prefix of prefix sums
5. O(n) to calculate the total contribution

Each element is pushed and popped from the stacks at most once, so the stack operations are O(n) total.

**Space Complexity: O(n)** - We store:

- `left` and `right` arrays: O(n)
- `prefix` and `prefix_prefix` arrays: O(n)
- Stack: O(n) in worst case

## Common Mistakes

1. **Incorrect inequality handling for duplicates**: Using `>=` on both sides counts some subarrays twice. The standard approach is strict on one side (`<` on left, `<=` on right) or vice versa. In our solution, we use `>=` when finding left boundaries and `>` when finding right boundaries.

2. **Off-by-one errors in prefix sums**: The formula uses `prefix_prefix[R+2]` and `prefix_prefix[i+1]` because `prefix_prefix` is 1-indexed (starts at index 1). A common mistake is using `R+1` or `i` directly.

3. **Integer overflow**: The sums can be very large (up to ~10¹⁵ for n=10⁵ and values up to 10⁹). We must use 64-bit integers (long in Java, BigInt in JavaScript) and apply modulo operations carefully.

4. **Forgetting modulo operations in intermediate steps**: When computing `(len_left * left_sum - len_right * right_sum)`, we need to apply modulo after each multiplication and handle negative results by adding MOD.

## When You'll See This Pattern

This problem combines two important patterns:

1. **Monotonic Stack for Next/Previous Smaller Element**: Used in problems like:
   - [Next Greater Element I](/problem/next-greater-element-i) - Basic monotonic stack application
   - [Largest Rectangle in Histogram](/problem/largest-rectangle-in-histogram) - Finding boundaries where current element is minimum
   - [Number of Visible People in a Queue](/problem/number-of-visible-people-in-a-queue) - Monotonic stack with counting

2. **Sum of Subarray Minimums/Maximums**: This problem extends:
   - [Sum of Subarray Minimums](/problem/sum-of-subarray-minimums) - Similar concept but simpler (only min, not min×sum)
   - [Sum of Subarray Ranges](/problem/sum-of-subarray-ranges) - Both min and max

The key insight across these problems is to consider each element's contribution as an extreme value (min/max) for certain subarrays, find those subarrays efficiently using monotonic stacks, and compute the contribution using prefix sums or combinatorics.

## Key Takeaways

1. **Think in terms of contributions**: Instead of enumerating all subarrays, consider what each element contributes to the final answer. This often leads to more efficient O(n) or O(n log n) solutions.

2. **Monotonic stacks find boundaries efficiently**: When you need to find the next/previous element satisfying some condition (like smaller/greater), monotonic stacks provide O(n) solutions.

3. **Prefix sums of prefix sums for sum-of-sums**: When you need the sum of sums of all subarrays in a range, use prefix sums of prefix sums to get O(1) computation per element after O(n) preprocessing.

Related problems: [Next Greater Element I](/problem/next-greater-element-i), [Sum of Subarray Minimums](/problem/sum-of-subarray-minimums), [Number of Visible People in a Queue](/problem/number-of-visible-people-in-a-queue)
