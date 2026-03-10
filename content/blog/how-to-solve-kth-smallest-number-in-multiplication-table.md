---
title: "How to Solve Kth Smallest Number in Multiplication Table — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Kth Smallest Number in Multiplication Table. Hard difficulty, 53.8% acceptance rate. Topics: Math, Binary Search."
date: "2027-10-21"
category: "dsa-patterns"
tags: ["kth-smallest-number-in-multiplication-table", "math", "binary-search", "hard"]
---

# How to Solve Kth Smallest Number in Multiplication Table

This problem asks us to find the k-th smallest element in a multiplication table of size m × n, where the value at position (i, j) is i × j (with 1-indexed indices). What makes this problem tricky is that we can't actually build the entire multiplication table—with m and n up to 3×10⁴, the table would have up to 900 million elements, far too large to store in memory. We need a clever approach that works without constructing the table explicitly.

## Visual Walkthrough

Let's trace through a concrete example: m = 3, n = 3, k = 5.

Our multiplication table looks like this:

```
1  2  3
2  4  6
3  6  9
```

All elements sorted: [1, 2, 2, 3, 3, 4, 6, 6, 9]
The 5th smallest element is 3.

But here's the key insight: we don't need to generate all these numbers. Instead, we can ask: "How many numbers in the table are ≤ X?" For any number X, we can count this efficiently.

For example, let's count how many numbers are ≤ 4:

- Row 1: numbers are 1, 2, 3 → all ≤ 4 (3 numbers)
- Row 2: numbers are 2, 4, 6 → 2 and 4 are ≤ 4 (2 numbers)
- Row 3: numbers are 3, 6, 9 → only 3 is ≤ 4 (1 number)
  Total: 3 + 2 + 1 = 6 numbers ≤ 4

Since we're looking for the 5th smallest, and there are 6 numbers ≤ 4, the answer must be ≤ 4. But we need to find the exact number where the count reaches exactly k.

## Brute Force Approach

A naive approach would be to generate all m × n elements, sort them, and return the k-th element:

<div class="code-group">

```python
# Time: O(m*n log(m*n)) | Space: O(m*n)
def findKthNumber_brute(m, n, k):
    # Generate all elements
    elements = []
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            elements.append(i * j)

    # Sort and return k-th smallest
    elements.sort()
    return elements[k - 1]
```

```javascript
// Time: O(m*n log(m*n)) | Space: O(m*n)
function findKthNumberBrute(m, n, k) {
  // Generate all elements
  const elements = [];
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      elements.push(i * j);
    }
  }

  // Sort and return k-th smallest
  elements.sort((a, b) => a - b);
  return elements[k - 1];
}
```

```java
// Time: O(m*n log(m*n)) | Space: O(m*n)
public int findKthNumberBrute(int m, int n, int k) {
    // Generate all elements
    List<Integer> elements = new ArrayList<>();
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            elements.add(i * j);
        }
    }

    // Sort and return k-th smallest
    Collections.sort(elements);
    return elements.get(k - 1);
}
```

</div>

This approach fails because:

1. **Memory**: With m, n up to 3×10⁴, we'd need to store 900 million integers, requiring ~3.6GB of memory.
2. **Time**: Sorting 900 million elements is computationally infeasible.

## Optimized Approach

The key insight is that we can use **binary search** on the answer space. We know:

- The smallest possible answer is 1 (top-left corner)
- The largest possible answer is m × n (bottom-right corner)

For any candidate value `mid`, we can efficiently count how many numbers in the table are ≤ `mid`. Here's how:

For row `i`, the numbers are: i×1, i×2, i×3, ..., i×n
We want to count how many of these are ≤ `mid`, which means: i×j ≤ mid → j ≤ mid/i

So in row i, the count is: `min(n, mid // i)` (using integer division)

We sum this count across all rows to get the total count of numbers ≤ `mid`.

If `count(mid) < k`, then our answer must be greater than `mid` (not enough small numbers).
If `count(mid) ≥ k`, then our answer could be `mid` or smaller (we have at least k numbers ≤ mid).

This gives us a binary search condition: we're looking for the smallest `mid` where `count(mid) ≥ k`.

## Optimal Solution

<div class="code-group">

```python
# Time: O(m * log(m*n)) | Space: O(1)
def findKthNumber(m, n, k):
    """
    Find the k-th smallest number in an m x n multiplication table.
    Uses binary search on the answer space [1, m*n].
    """

    def count_leq(x):
        """
        Count how many numbers in the multiplication table are ≤ x.
        For each row i, numbers are i*1, i*2, ..., i*n.
        The count in row i is min(n, x // i).
        """
        total = 0
        for i in range(1, m + 1):
            # Count numbers in row i that are ≤ x
            # Using min(n, x // i) because we can't have more than n columns
            total += min(n, x // i)
        return total

    # Binary search on the answer space [1, m*n]
    left, right = 1, m * n

    while left < right:
        mid = (left + right) // 2

        # If count(mid) >= k, answer could be mid or smaller
        if count_leq(mid) >= k:
            right = mid  # Try smaller values
        else:
            left = mid + 1  # Need larger values

    # When left == right, we've found the smallest number with count >= k
    return left
```

```javascript
// Time: O(m * log(m*n)) | Space: O(1)
function findKthNumber(m, n, k) {
  /**
   * Count how many numbers in the multiplication table are ≤ x.
   * For each row i, numbers are i*1, i*2, ..., i*n.
   * The count in row i is min(n, Math.floor(x / i)).
   */
  const countLeq = (x) => {
    let total = 0;
    for (let i = 1; i <= m; i++) {
      // Count numbers in row i that are ≤ x
      // Using min(n, Math.floor(x / i)) because we can't have more than n columns
      total += Math.min(n, Math.floor(x / i));
    }
    return total;
  };

  // Binary search on the answer space [1, m*n]
  let left = 1;
  let right = m * n;

  while (left < right) {
    const mid = Math.floor((left + right) / 2);

    // If count(mid) >= k, answer could be mid or smaller
    if (countLeq(mid) >= k) {
      right = mid; // Try smaller values
    } else {
      left = mid + 1; // Need larger values
    }
  }

  // When left == right, we've found the smallest number with count >= k
  return left;
}
```

```java
// Time: O(m * log(m*n)) | Space: O(1)
public int findKthNumber(int m, int n, int k) {
    // Binary search on the answer space [1, m*n]
    int left = 1;
    int right = m * n;

    while (left < right) {
        int mid = left + (right - left) / 2;  // Avoid overflow

        // Count how many numbers ≤ mid
        int count = 0;
        for (int i = 1; i <= m; i++) {
            // In row i, numbers are i*1, i*2, ..., i*n
            // Count = min(n, mid / i)
            count += Math.min(n, mid / i);
        }

        // If count >= k, answer could be mid or smaller
        if (count >= k) {
            right = mid;  // Try smaller values
        } else {
            left = mid + 1;  // Need larger values
        }
    }

    // When left == right, we've found the smallest number with count >= k
    return left;
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(m × log(m×n))

- We perform binary search over the range [1, m×n], which takes O(log(m×n)) iterations.
- In each iteration, we compute `count(mid)` in O(m) time by iterating through all rows.
- Total: O(m × log(m×n))

**Space Complexity**: O(1)

- We only use a constant amount of extra space for variables.

**Why this is efficient**: Even with m = 30,000, we perform about log₂(900,000,000) ≈ 30 iterations, and each iteration does 30,000 operations, totaling about 900,000 operations—very efficient!

## Common Mistakes

1. **Off-by-one errors in binary search**: The classic binary search pitfalls:
   - Using `while (left ≤ right)` instead of `while (left < right)`
   - Forgetting to use `mid + 1` when moving `left`
   - Using `right = mid - 1` instead of `right = mid` when `count(mid) ≥ k`

   **Fix**: Remember we're looking for the smallest `mid` where `count(mid) ≥ k`. When `count(mid) ≥ k`, `mid` could still be the answer, so we set `right = mid`. When `count(mid) < k`, `mid` cannot be the answer, so we set `left = mid + 1`.

2. **Integer overflow in mid calculation**: In Java, `(left + right) / 2` can overflow when m×n is large.

   **Fix**: Use `left + (right - left) / 2` instead.

3. **Incorrect count calculation**: Forgetting the `min(n, x // i)` part and just using `x // i`.

   **Fix**: Remember each row has at most n elements. If `x // i > n`, we should only count n elements.

4. **Confusing 0-indexed vs 1-indexed**: The multiplication table uses 1-indexing (i×j starting from 1×1=1).

   **Fix**: Start loops from 1, not 0.

## When You'll See This Pattern

This "binary search on answer space with counting function" pattern appears in several LeetCode problems:

1. **Kth Smallest Element in a Sorted Matrix (Medium)**: Similar structure but with pre-sorted rows and columns. The counting function is more complex but follows the same pattern.

2. **Find K-th Smallest Pair Distance (Hard)**: Given an array, find the k-th smallest distance among all pairs. Binary search on distance with a counting function that uses two pointers.

3. **K-th Smallest Prime Fraction (Hard)**: Given a sorted list of primes, find the k-th smallest fraction. Binary search on the fraction value with a counting function.

4. **Capacity To Ship Packages Within D Days (Medium)**: Binary search on shipping capacity with a counting function that checks how many days are needed.

The pattern is: when you need to find the k-th smallest/largest of something, and you can efficiently count how many elements are ≤ some value X, binary search on X is often the solution.

## Key Takeaways

1. **Binary search isn't just for arrays**: You can binary search on the answer space when you have a monotonic condition (like "count of elements ≤ X").

2. **The counting function is key**: The efficiency of the solution depends on having an O(m) or O(n) counting function, not O(m×n).

3. **Think about what you can compute efficiently**: Instead of generating all elements, ask "for a given value X, can I quickly determine how many elements are ≤ X?" This reframing is crucial for many hard problems.

4. **Memory constraints guide algorithm design**: When m×n is too large to store, you need a solution that works without constructing the entire data structure.

Related problems: [Kth Smallest Element in a Sorted Matrix](/problem/kth-smallest-element-in-a-sorted-matrix), [Find K-th Smallest Pair Distance](/problem/find-k-th-smallest-pair-distance), [K-th Smallest Prime Fraction](/problem/k-th-smallest-prime-fraction)
