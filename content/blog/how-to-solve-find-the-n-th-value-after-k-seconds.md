---
title: "How to Solve Find the N-th Value After K Seconds — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find the N-th Value After K Seconds. Medium difficulty, 53.8% acceptance rate. Topics: Array, Math, Simulation, Combinatorics, Prefix Sum."
date: "2028-09-16"
category: "dsa-patterns"
tags: ["find-the-n-th-value-after-k-seconds", "array", "math", "simulation", "medium"]
---

# How to Solve Find the N-th Value After K Seconds

This problem asks us to simulate a transformation process where we start with an array of all 1's and repeatedly update each element to be the sum of all preceding elements plus itself. The challenge is that `k` can be up to 1000, and `n` up to 1000, making a naive simulation potentially too slow. What makes this problem interesting is recognizing the mathematical pattern behind the transformations—each update is essentially computing prefix sums, which leads to combinatorial solutions.

## Visual Walkthrough

Let's trace through a small example with `n = 4` and `k = 2`:

**Initial state (k = 0):**

```
a = [1, 1, 1, 1]
```

**After 1 second (k = 1):**

- `a[0] = 1` (no preceding elements, just itself)
- `a[1] = a[0] + a[1] = 1 + 1 = 2`
- `a[2] = a[0] + a[1] + a[2] = 1 + 1 + 1 = 3`
- `a[3] = a[0] + a[1] + a[2] + a[3] = 1 + 1 + 1 + 1 = 4`

```
a = [1, 2, 3, 4]
```

**After 2 seconds (k = 2):**

- `a[0] = 1`
- `a[1] = a[0] + a[1] = 1 + 2 = 3`
- `a[2] = a[0] + a[1] + a[2] = 1 + 2 + 3 = 6`
- `a[3] = a[0] + a[1] + a[2] + a[3] = 1 + 2 + 3 + 4 = 10`

```
a = [1, 3, 6, 10]
```

We need to return `a[n-1]`, which is `10`. Notice how each transformation is computing prefix sums of the current array. After k seconds, the value at position i represents the number of ways to choose k items from i+k items with repetition allowed.

## Brute Force Approach

The most straightforward approach is to simulate the process exactly as described:

1. Initialize an array of size n with all 1's
2. For each of k seconds:
   - Create a new array
   - For each position i, compute the sum of all elements from index 0 to i
   - Update the array
3. Return the last element

The problem with this approach is its time complexity: O(k × n²) because for each of k iterations, we're computing prefix sums by summing up to n elements for each of n positions. With constraints up to 1000 for both n and k, this could mean up to 10⁹ operations, which is too slow.

## Optimized Approach

The key insight is recognizing that each transformation is simply computing prefix sums. Instead of recomputing sums from scratch each time, we can maintain running prefix sums.

**Step-by-step reasoning:**

1. **First observation:** After 0 seconds, the array is `[1, 1, 1, ..., 1]`
2. **Second observation:** After 1 second, we have `[1, 2, 3, ..., n]` (the cumulative sums of the initial array)
3. **Third observation:** Each subsequent second transforms `a[i]` to `sum(a[0] + a[1] + ... + a[i])` of the previous array
4. **Key insight:** This is equivalent to repeatedly applying the prefix sum operation k times

We can optimize by noticing that:

- Instead of O(n²) per iteration, we can compute prefix sums in O(n) using a running sum
- The value at position i after k seconds is the number of combinations of choosing k items from i+k items with repetition: C(i+k, k)
- This combinatorial formula comes from recognizing the pattern as repeated convolution of the sequence [1, 1, 1, ...]

The combinatorial approach gives us O(1) time per query after precomputing factorials, but for this problem, the iterative prefix sum approach with O(k × n) time is sufficient and easier to implement correctly in an interview.

## Optimal Solution

We'll implement the optimized prefix sum approach. For each of k seconds, we compute the prefix sums of the current array in O(n) time, giving us O(k × n) total time complexity.

<div class="code-group">

```python
# Time: O(k * n) | Space: O(n)
def valueAfterKSeconds(self, n: int, k: int) -> int:
    MOD = 10**9 + 7

    # Step 1: Initialize array with all 1's (state after 0 seconds)
    arr = [1] * n

    # Step 2: Apply the transformation k times
    for _ in range(k):
        # Compute prefix sums in-place
        for i in range(1, n):
            # Each element becomes the sum of itself and the previous element
            # This computes the prefix sum efficiently
            arr[i] = (arr[i] + arr[i-1]) % MOD

    # Step 3: Return the last element (a[n-1])
    return arr[-1]
```

```javascript
// Time: O(k * n) | Space: O(n)
function valueAfterKSeconds(n, k) {
  const MOD = 10 ** 9 + 7;

  // Step 1: Initialize array with all 1's (state after 0 seconds)
  let arr = new Array(n).fill(1);

  // Step 2: Apply the transformation k times
  for (let sec = 0; sec < k; sec++) {
    // Compute prefix sums in-place
    for (let i = 1; i < n; i++) {
      // Each element becomes the sum of itself and the previous element
      // This computes the prefix sum efficiently
      arr[i] = (arr[i] + arr[i - 1]) % MOD;
    }
  }

  // Step 3: Return the last element (a[n-1])
  return arr[n - 1];
}
```

```java
// Time: O(k * n) | Space: O(n)
class Solution {
    public int valueAfterKSeconds(int n, int k) {
        final int MOD = 1_000_000_007;

        // Step 1: Initialize array with all 1's (state after 0 seconds)
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = 1;
        }

        // Step 2: Apply the transformation k times
        for (int sec = 0; sec < k; sec++) {
            // Compute prefix sums in-place
            for (int i = 1; i < n; i++) {
                // Each element becomes the sum of itself and the previous element
                // This computes the prefix sum efficiently
                arr[i] = (arr[i] + arr[i-1]) % MOD;
            }
        }

        // Step 3: Return the last element (a[n-1])
        return arr[n-1];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(k × n)

- We perform k iterations (one for each second)
- In each iteration, we traverse the array once to compute prefix sums, which takes O(n) time
- Total: O(k × n)

**Space Complexity:** O(n)

- We only need to store one array of size n
- The prefix sum computation is done in-place, so no additional arrays are needed

With constraints n ≤ 1000 and k ≤ 1000, the worst-case is 1,000,000 operations, which is efficient enough.

## Common Mistakes

1. **Forgetting the modulo operation:** The problem states results should be returned modulo 10⁹+7. Candidates often compute correct values but forget to apply modulo at each step, leading to integer overflow.

2. **Using O(n²) prefix sum computation:** Some candidates compute prefix sums by summing from the beginning for each element (`sum(arr[0:i+1])`), which gives O(n²) per iteration instead of O(n). The correct approach uses a running sum.

3. **Off-by-one errors with k:** The transformation happens k times, not k-1 times. After 0 seconds, we have the initial array. After 1 second, we've applied the transformation once. Some candidates loop k-1 times instead of k times.

4. **Not handling the base case correctly:** When n=1, the answer is always 1 regardless of k, since there's only one element with no preceding elements. Some candidates overcomplicate this case.

## When You'll See This Pattern

This prefix sum transformation pattern appears in several types of problems:

1. **Dynamic Programming problems** where the state depends on the sum of previous states, like counting paths in a grid with certain constraints.

2. **Combinatorial problems** involving repeated convolution or generating function coefficients. The values we compute are essentially binomial coefficients.

3. **Problems involving cumulative transformations**, like "Running Sum of 1d Array" (LeetCode 1480) but applied repeatedly.

Specific related problems:

- **Left and Right Sum Differences (LeetCode 2574)** - Also involves prefix sums but in a simpler single-pass way
- **Pascal's Triangle (LeetCode 118)** - The values we get are essentially binomial coefficients, similar to Pascal's triangle
- **Unique Paths (LeetCode 62)** - Can be solved using similar combinatorial reasoning

## Key Takeaways

1. **Repeated prefix sums create combinatorial patterns:** When you apply prefix sum operations repeatedly, the resulting sequence follows combinatorial formulas (specifically, binomial coefficients).

2. **Optimize prefix sum computation:** Instead of recomputing sums from scratch for each element, use a running sum to achieve O(n) instead of O(n²) for each transformation.

3. **Look for mathematical patterns in simulation problems:** When a problem involves repeated transformations, there's often a mathematical formula or pattern that can simplify the computation. In this case, recognizing the connection to binomial coefficients could lead to an O(1) solution using combinatorial formulas.

Related problems: [Left and Right Sum Differences](/problem/left-and-right-sum-differences)
