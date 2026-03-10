---
title: "How to Solve Maximum of Absolute Value Expression — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum of Absolute Value Expression. Medium difficulty, 48.6% acceptance rate. Topics: Array, Math."
date: "2029-04-28"
category: "dsa-patterns"
tags: ["maximum-of-absolute-value-expression", "array", "math", "medium"]
---

# How to Solve Maximum of Absolute Value Expression

This problem asks us to find the maximum value of `|arr1[i] - arr1[j]| + |arr2[i] - arr2[j]| + |i - j|` for all pairs of indices `i` and `j` in two equal-length arrays. What makes this problem interesting is that the absolute value expressions make direct computation expensive, but a mathematical insight transforms it into a much simpler problem that can be solved in linear time.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider:

- `arr1 = [1, 2, 3, 4]`
- `arr2 = [-1, 0, 1, 2]`

The brute force approach would check all 16 pairs (i,j). For example:

- When i=0, j=3: `|1-4| + |-1-2| + |0-3| = 3 + 3 + 3 = 9`
- When i=1, j=2: `|2-3| + |0-1| + |1-2| = 1 + 1 + 1 = 3`

The maximum value here is 9. But checking all pairs becomes impractical for large arrays (n=10,000 would have 100 million pairs).

The key insight comes from expanding the absolute value expressions. For any real numbers a and b, `|a - b| = max(a - b, b - a)`. This means our expression can be rewritten as the maximum of 8 different expressions (2 choices for each of the 3 absolute values).

## Brute Force Approach

The most straightforward solution is to check every possible pair (i,j):

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def maxAbsValExpr(arr1, arr2):
    n = len(arr1)
    max_val = 0

    # Check every pair (i, j)
    for i in range(n):
        for j in range(n):
            # Calculate the expression directly
            val = abs(arr1[i] - arr1[j]) + abs(arr2[i] - arr2[j]) + abs(i - j)
            max_val = max(max_val, val)

    return max_val
```

```javascript
// Time: O(n²) | Space: O(1)
function maxAbsValExpr(arr1, arr2) {
  const n = arr1.length;
  let maxVal = 0;

  // Check every pair (i, j)
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      // Calculate the expression directly
      const val = Math.abs(arr1[i] - arr1[j]) + Math.abs(arr2[i] - arr2[j]) + Math.abs(i - j);
      maxVal = Math.max(maxVal, val);
    }
  }

  return maxVal;
}
```

```java
// Time: O(n²) | Space: O(1)
public int maxAbsValExpr(int[] arr1, int[] arr2) {
    int n = arr1.length;
    int maxVal = 0;

    // Check every pair (i, j)
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            // Calculate the expression directly
            int val = Math.abs(arr1[i] - arr1[j]) +
                     Math.abs(arr2[i] - arr2[j]) +
                     Math.abs(i - j);
            maxVal = Math.max(maxVal, val);
        }
    }

    return maxVal;
}
```

</div>

This approach is correct but too slow for large inputs. With n up to 40,000, O(n²) operations would be 1.6 billion calculations, which is impractical.

## Optimized Approach

The breakthrough comes from expanding the absolute value expressions. Let's define:

- `a = arr1[i] - arr1[j]`
- `b = arr2[i] - arr2[j]`
- `c = i - j`

Our expression is `|a| + |b| + |c|`. Each absolute value can be positive or negative, giving us 2³ = 8 possible sign combinations. For example:

- `(+a) + (+b) + (+c) = a + b + c`
- `(+a) + (+b) + (-c) = a + b - c`
- And so on...

But notice that `a = arr1[i] - arr1[j]` can be rearranged as `arr1[i] - arr1[j]`. Similarly for b and c. So each of the 8 expressions becomes a linear combination of terms involving i and j separately.

For instance, consider the expression `a + b + c`:

- `a + b + c = (arr1[i] - arr1[j]) + (arr2[i] - arr2[j]) + (i - j)`
- `= (arr1[i] + arr2[i] + i) - (arr1[j] + arr2[j] + j)`

This is crucial: the expression becomes `f(i) - f(j)` where `f(x) = arr1[x] + arr2[x] + x`. The maximum of `f(i) - f(j)` over all i,j is simply `max(f) - min(f)`!

Similarly, each of the 8 sign combinations gives us a different linear function of i. We compute the maximum and minimum for each of these 8 functions, then take the maximum difference across all 8 cases.

## Optimal Solution

Here's the complete implementation using this insight:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def maxAbsValExpr(arr1, arr2):
    """
    The key insight: |a| + |b| + |c| = max over all sign combinations of (±a ± b ± c)
    Each combination gives us f(i) - f(j) for some linear function f
    The maximum of f(i) - f(j) is max(f) - min(f)
    """
    n = len(arr1)

    # We'll track max and min for each of the 8 sign combinations
    # The signs correspond to: sign1 * arr1[i] + sign2 * arr2[i] + sign3 * i
    # where each sign is either +1 or -1

    # Initialize with extreme values
    max_vals = [-float('inf')] * 8
    min_vals = [float('inf')] * 8

    for i in range(n):
        # Generate all 8 combinations of signs
        for k in range(8):
            # Extract signs using bit manipulation
            # bit 0: sign for arr1 (0 means +1, 1 means -1)
            # bit 1: sign for arr2
            # bit 2: sign for i
            sign1 = 1 if (k & 1) == 0 else -1  # +1 for bit 0=0, -1 for bit 0=1
            sign2 = 1 if (k & 2) == 0 else -1  # +1 for bit 1=0, -1 for bit 1=1
            sign3 = 1 if (k & 4) == 0 else -1  # +1 for bit 2=0, -1 for bit 2=1

            # Compute the linear function value for index i
            val = sign1 * arr1[i] + sign2 * arr2[i] + sign3 * i

            # Update max and min for this sign combination
            max_vals[k] = max(max_vals[k], val)
            min_vals[k] = min(min_vals[k], val)

    # The answer is the maximum difference across all 8 cases
    result = 0
    for k in range(8):
        result = max(result, max_vals[k] - min_vals[k])

    return result
```

```javascript
// Time: O(n) | Space: O(1)
function maxAbsValExpr(arr1, arr2) {
  /**
   * The key insight: |a| + |b| + |c| = max over all sign combinations of (±a ± b ± c)
   * Each combination gives us f(i) - f(j) for some linear function f
   * The maximum of f(i) - f(j) is max(f) - min(f)
   */
  const n = arr1.length;

  // We'll track max and min for each of the 8 sign combinations
  // The signs correspond to: sign1 * arr1[i] + sign2 * arr2[i] + sign3 * i
  // where each sign is either +1 or -1

  // Initialize with extreme values
  const maxVals = new Array(8).fill(-Infinity);
  const minVals = new Array(8).fill(Infinity);

  for (let i = 0; i < n; i++) {
    // Generate all 8 combinations of signs
    for (let k = 0; k < 8; k++) {
      // Extract signs using bit manipulation
      // bit 0: sign for arr1 (0 means +1, 1 means -1)
      // bit 1: sign for arr2
      // bit 2: sign for i
      const sign1 = (k & 1) === 0 ? 1 : -1; // +1 for bit 0=0, -1 for bit 0=1
      const sign2 = (k & 2) === 0 ? 1 : -1; // +1 for bit 1=0, -1 for bit 1=1
      const sign3 = (k & 4) === 0 ? 1 : -1; // +1 for bit 2=0, -1 for bit 2=1

      // Compute the linear function value for index i
      const val = sign1 * arr1[i] + sign2 * arr2[i] + sign3 * i;

      // Update max and min for this sign combination
      maxVals[k] = Math.max(maxVals[k], val);
      minVals[k] = Math.min(minVals[k], val);
    }
  }

  // The answer is the maximum difference across all 8 cases
  let result = 0;
  for (let k = 0; k < 8; k++) {
    result = Math.max(result, maxVals[k] - minVals[k]);
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(1)
public int maxAbsValExpr(int[] arr1, int[] arr2) {
    /**
     * The key insight: |a| + |b| + |c| = max over all sign combinations of (±a ± b ± c)
     * Each combination gives us f(i) - f(j) for some linear function f
     * The maximum of f(i) - f(j) is max(f) - min(f)
     */
    int n = arr1.length;

    // We'll track max and min for each of the 8 sign combinations
    // The signs correspond to: sign1 * arr1[i] + sign2 * arr2[i] + sign3 * i
    // where each sign is either +1 or -1

    // Initialize with extreme values
    int[] maxVals = new int[8];
    int[] minVals = new int[8];
    for (int i = 0; i < 8; i++) {
        maxVals[i] = Integer.MIN_VALUE;
        minVals[i] = Integer.MAX_VALUE;
    }

    for (int i = 0; i < n; i++) {
        // Generate all 8 combinations of signs
        for (int k = 0; k < 8; k++) {
            // Extract signs using bit manipulation
            // bit 0: sign for arr1 (0 means +1, 1 means -1)
            // bit 1: sign for arr2
            // bit 2: sign for i
            int sign1 = (k & 1) == 0 ? 1 : -1;  // +1 for bit 0=0, -1 for bit 0=1
            int sign2 = (k & 2) == 0 ? 1 : -1;  // +1 for bit 1=0, -1 for bit 1=1
            int sign3 = (k & 4) == 0 ? 1 : -1;  // +1 for bit 2=0, -1 for bit 2=1

            // Compute the linear function value for index i
            int val = sign1 * arr1[i] + sign2 * arr2[i] + sign3 * i;

            // Update max and min for this sign combination
            maxVals[k] = Math.max(maxVals[k], val);
            minVals[k] = Math.min(minVals[k], val);
        }
    }

    // The answer is the maximum difference across all 8 cases
    int result = 0;
    for (int k = 0; k < 8; k++) {
        result = Math.max(result, maxVals[k] - minVals[k]);
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the length of the arrays. We iterate through the array once, and for each element, we compute 8 values (constant time per element). The total is 8n operations, which simplifies to O(n).

**Space Complexity:** O(1). We only use a constant amount of extra space: two arrays of size 8 to track maximum and minimum values for each sign combination. This doesn't grow with the input size.

## Common Mistakes

1. **Forgetting that i and j can be in any order:** Some candidates mistakenly assume i < j, but the problem allows any i and j. The expression is symmetric in i and j, but we must consider both orders.

2. **Incorrect sign handling in the optimized solution:** The bit manipulation for extracting signs is tricky. A common error is mixing up which bit corresponds to which variable. Remember: bit 0 for arr1, bit 1 for arr2, bit 2 for i.

3. **Not initializing max/min values properly:** For the linear functions, we need to initialize max values to negative infinity (or a very small number) and min values to positive infinity (or a very large number). Using 0 as initial value would fail for arrays with all negative values.

4. **Overlooking the index term |i - j|:** Some candidates focus only on the array values and forget to include the index difference term. This term is crucial and changes the problem significantly from just finding maximum Manhattan distance.

## When You'll See This Pattern

This technique of expanding absolute values into sign combinations appears in several other problems:

1. **Maximum of Absolute Value Expression (this problem):** The canonical example.

2. **Best Time to Buy and Sell Stock III (LeetCode 123):** While not identical, it uses a similar idea of considering different states (buy/sell) to maximize profit.

3. **Minimum Time Visiting All Points (LeetCode 1266):** Uses Manhattan distance where |x1-x2| + |y1-y2| = max of four linear expressions.

4. **Maximum Distance in Arrays (LeetCode 624):** Involves finding maximum absolute difference between elements from different arrays, which can be approached with similar reasoning.

The core pattern is recognizing that absolute value expressions can be transformed into maximums over linear expressions, which are much easier to optimize.

## Key Takeaways

1. **Absolute values can be expanded:** When you see expressions like |a-b|, remember they equal max(a-b, b-a). For multiple absolute values, you get multiple sign combinations (2^k for k absolute values).

2. **Look for separability:** If an expression can be written as f(i) - f(j) for some function f, then the maximum over all i,j is simply max(f) - min(f). This transforms O(n²) problems into O(n).

3. **Bit manipulation for combinations:** When you need to iterate through all combinations of binary choices (like sign choices), using bit manipulation (k from 0 to 2^m-1) is cleaner than nested loops.

[Practice this problem on CodeJeet](/problem/maximum-of-absolute-value-expression)
