---
title: "How to Solve K-th Smallest Prime Fraction — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode K-th Smallest Prime Fraction. Medium difficulty, 69.0% acceptance rate. Topics: Array, Two Pointers, Binary Search, Sorting, Heap (Priority Queue)."
date: "2026-05-19"
category: "dsa-patterns"
tags: ["k-th-smallest-prime-fraction", "array", "two-pointers", "binary-search", "medium"]
---

# How to Solve K-th Smallest Prime Fraction

This problem asks us to find the k-th smallest fraction formed by dividing any two numbers from a sorted array of primes (including 1). The challenge comes from having to navigate through n² possible fractions efficiently when k can be up to n². The fractions aren't stored anywhere—we need to find the k-th smallest without generating all of them.

## Visual Walkthrough

Let's trace through a concrete example: `arr = [1, 2, 3, 5]`, `k = 3`.

First, let's list all possible fractions where `i < j`:

- 1/2 = 0.5
- 1/3 ≈ 0.333
- 1/5 = 0.2
- 2/3 ≈ 0.667
- 2/5 = 0.4
- 3/5 = 0.6

Sorted by value: 0.2 (1/5), 0.333 (1/3), 0.4 (2/5), 0.5 (1/2), 0.6 (3/5), 0.667 (2/3)

The 3rd smallest is 0.4, which is 2/5.

Now, here's the key insight: if we think of the fractions as a matrix where row `i` contains all fractions `arr[i]/arr[j]` for `j > i`, each row is sorted in increasing order (since denominators increase while numerator stays fixed). This structure is similar to "Kth Smallest Element in a Sorted Matrix."

## Brute Force Approach

The most straightforward approach is to generate all n(n-1)/2 fractions, sort them, and return the k-th smallest. While simple, this has O(n² log n) time complexity and O(n²) space complexity, which is unacceptable for n up to 1000 (where n² = 1,000,000).

Even a slightly better approach using a min-heap to find the k-th smallest still requires O(n²) operations in the worst case when k is large. We need something smarter that doesn't require examining all fractions.

## Optimized Approach

The optimal solution uses **binary search on the answer space** combined with a **two-pointer counting technique**. Here's the step-by-step reasoning:

1. **Binary Search on Values**: Since fractions are between 0 and 1 (all numbers are positive), we can binary search for the target fraction value. For any candidate value `mid`, we can count how many fractions are ≤ `mid`.

2. **Counting Fractions Efficiently**: Given a value `x`, we need to count pairs `(i, j)` where `arr[i]/arr[j] ≤ x`. Rearranging: `arr[i] ≤ x * arr[j]`. For each denominator `arr[j]`, we find how many numerators `arr[i]` (with `i < j`) satisfy this inequality. Since the array is sorted, we can use a two-pointer approach:
   - As `j` increases (denominator gets larger), the maximum allowed numerator (`x * arr[j]`) increases
   - So we can maintain a pointer `i` that only moves forward, giving us O(n) counting per binary search iteration

3. **Tracking the Maximum Fraction**: While counting, we also track the maximum fraction ≤ `mid`. This helps us return the actual fraction when we find the k-th smallest.

4. **Binary Search Termination**: We continue binary search until we've narrowed down to the exact k-th smallest fraction. The precision requirement means we need enough iterations (typically 50-100 for double precision).

This approach gives us O(n log W) time complexity where W is the precision range, much better than O(n²).

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(n * log(W)) where W is the search space width (1e-9 precision)
# Space: O(1)
def kthSmallestPrimeFraction(arr, k):
    """
    Find the k-th smallest fraction formed by dividing any two numbers
    from the sorted prime array.
    """
    n = len(arr)
    left, right = 0.0, 1.0  # Fractions are between 0 and 1

    # Binary search with sufficient precision
    for _ in range(100):  # Enough iterations for 1e-9 precision
        mid = (left + right) / 2

        # Count fractions <= mid and track the maximum such fraction
        count = 0
        max_fraction = 0.0
        numerator_idx, denominator_idx = 0, 0

        # Two-pointer counting
        j = 1  # Start with j=1 since i < j
        for i in range(n - 1):
            # Move j forward until arr[i]/arr[j] > mid
            while j < n and arr[i] > mid * arr[j]:
                j += 1

            # All fractions with numerator arr[i] and denominator arr[j...n-1]
            # are <= mid (since j is the first index where fraction > mid)
            count += n - j

            # If we found any valid fractions with this numerator,
            # update the maximum fraction seen so far
            if j < n:
                fraction = arr[i] / arr[j]
                if fraction > max_fraction:
                    max_fraction = fraction
                    numerator_idx, denominator_idx = i, j

        # Adjust binary search bounds
        if count == k:
            # Found exactly k fractions <= mid, return the maximum one
            return [arr[numerator_idx], arr[denominator_idx]]
        elif count < k:
            # Need more fractions, so target must be larger than mid
            left = mid
        else:
            # Too many fractions, target must be smaller than mid
            right = mid

    # After binary search, left should be very close to the answer
    # Return the fraction we tracked during the last iteration
    return [arr[numerator_idx], arr[denominator_idx]]
```

```javascript
// Time: O(n * log(W)) where W is the search space width
// Space: O(1)
function kthSmallestPrimeFraction(arr, k) {
  const n = arr.length;
  let left = 0.0,
    right = 1.0;

  // Binary search with sufficient precision
  for (let iter = 0; iter < 100; iter++) {
    const mid = (left + right) / 2;

    // Count fractions <= mid and track the maximum such fraction
    let count = 0;
    let maxFraction = 0.0;
    let numeratorIdx = 0,
      denominatorIdx = 0;

    // Two-pointer counting
    let j = 1; // Start with j=1 since i < j
    for (let i = 0; i < n - 1; i++) {
      // Move j forward until arr[i]/arr[j] > mid
      while (j < n && arr[i] > mid * arr[j]) {
        j++;
      }

      // All fractions with numerator arr[i] and denominator arr[j...n-1]
      // are <= mid
      count += n - j;

      // Update maximum fraction if we found any valid fractions
      if (j < n) {
        const fraction = arr[i] / arr[j];
        if (fraction > maxFraction) {
          maxFraction = fraction;
          numeratorIdx = i;
          denominatorIdx = j;
        }
      }
    }

    // Adjust binary search bounds
    if (count === k) {
      // Found exactly k fractions <= mid
      return [arr[numeratorIdx], arr[denominatorIdx]];
    } else if (count < k) {
      // Need more fractions
      left = mid;
    } else {
      // Too many fractions
      right = mid;
    }
  }

  // Return the best fraction found during last iteration
  return [arr[numeratorIdx], arr[denominatorIdx]];
}
```

```java
// Time: O(n * log(W)) where W is the search space width
// Space: O(1)
class Solution {
    public int[] kthSmallestPrimeFraction(int[] arr, int k) {
        int n = arr.length;
        double left = 0.0, right = 1.0;

        // Track the best fraction found during binary search
        int numeratorIdx = 0, denominatorIdx = 0;

        // Binary search with sufficient precision
        for (int iter = 0; iter < 100; iter++) {
            double mid = (left + right) / 2;

            // Count fractions <= mid and track the maximum such fraction
            int count = 0;
            double maxFraction = 0.0;
            int j = 1;  // Start with j=1 since i < j

            for (int i = 0; i < n - 1; i++) {
                // Move j forward until arr[i]/arr[j] > mid
                while (j < n && arr[i] > mid * arr[j]) {
                    j++;
                }

                // All fractions with numerator arr[i] and denominator arr[j...n-1]
                // are <= mid
                count += n - j;

                // Update maximum fraction if we found any valid fractions
                if (j < n) {
                    double fraction = (double) arr[i] / arr[j];
                    if (fraction > maxFraction) {
                        maxFraction = fraction;
                        numeratorIdx = i;
                        denominatorIdx = j;
                    }
                }
            }

            // Adjust binary search bounds
            if (count == k) {
                // Found exactly k fractions <= mid
                return new int[]{arr[numeratorIdx], arr[denominatorIdx]};
            } else if (count < k) {
                // Need more fractions
                left = mid;
            } else {
                // Too many fractions
                right = mid;
            }
        }

        // Return the best fraction found during last iteration
        return new int[]{arr[numeratorIdx], arr[denominatorIdx]};
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log W)**

- `n` is the length of the input array
- `W` is the width of our search space (1.0 in this case)
- Each binary search iteration takes O(n) time for the two-pointer counting
- We perform a fixed number of iterations (100) for sufficient precision, so O(100n) = O(n)

**Space Complexity: O(1)**

- We only use a constant amount of extra space for pointers and counters
- No additional data structures that scale with input size

## Common Mistakes

1. **Integer Division Errors**: Forgetting to use floating-point arithmetic when comparing fractions. In Java especially, `arr[i] / arr[j]` does integer division if both are integers. Always cast to double: `(double) arr[i] / arr[j]`.

2. **Insufficient Binary Search Iterations**: Using a while loop like `while (right - left > 1e-9)` can lead to infinite loops due to floating-point precision. Using a fixed number of iterations (50-100) is more reliable.

3. **Incorrect Counting Logic**: The inequality `arr[i] ≤ mid * arr[j]` is correct. A common mistake is using `arr[i]/arr[j] ≤ mid` directly, which requires floating-point division for each comparison instead of multiplication.

4. **Forgetting to Track the Maximum Fraction**: When we find that exactly `k` fractions are ≤ `mid`, we need to return the actual fraction, not `mid`. We must track the maximum fraction ≤ `mid` during counting.

## When You'll See This Pattern

This "binary search on answer + two-pointer counting" pattern appears in several k-th smallest/largest problems:

1. **Kth Smallest Element in a Sorted Matrix (Medium)**: Similar structure with sorted rows and columns. Instead of fractions, we have matrix elements.

2. **Kth Smallest Number in Multiplication Table (Hard)**: Find k-th smallest in multiplication table. Count how many numbers ≤ mid using division instead of multiplication.

3. **Find K-th Smallest Pair Distance (Hard)**: Find k-th smallest distance between array elements. Count pairs with distance ≤ mid using two pointers.

The common theme: when direct computation is too expensive, binary search on the answer space with an efficient counting function provides an optimal solution.

## Key Takeaways

1. **Binary search isn't just for searching arrays**: When the answer lies in a continuous range and you can efficiently test whether a candidate is too high or too low, binary search on values can be more efficient than working directly with the data.

2. **Two-pointer counting is powerful for sorted arrays**: When you need to count pairs satisfying an inequality in a sorted array, the two-pointer technique often gives O(n) time instead of O(n²).

3. **Track additional information during counting**: When binary searching for a specific element (not just existence), track the closest candidate encountered during counting to return the actual element, not just its value.

Related problems: [Kth Smallest Element in a Sorted Matrix](/problem/kth-smallest-element-in-a-sorted-matrix), [Kth Smallest Number in Multiplication Table](/problem/kth-smallest-number-in-multiplication-table), [Find K-th Smallest Pair Distance](/problem/find-k-th-smallest-pair-distance)
