---
title: "How to Solve Kth Smallest Product of Two Sorted Arrays — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Kth Smallest Product of Two Sorted Arrays. Hard difficulty, 48.9% acceptance rate. Topics: Array, Binary Search."
date: "2027-10-12"
category: "dsa-patterns"
tags: ["kth-smallest-product-of-two-sorted-arrays", "array", "binary-search", "hard"]
---

# How to Solve Kth Smallest Product of Two Sorted Arrays

You're given two sorted integer arrays `nums1` and `nums2`, and an integer `k`. You need to find the kth smallest product formed by multiplying any element from `nums1` with any element from `nums2`. The challenge is that the total number of possible products is `n × m`, which can be up to 10^10 for maximum constraints, making it impossible to generate all products. The key insight is that we can use binary search on the answer space combined with a clever counting technique.

## Visual Walkthrough

Let's walk through a small example to build intuition. Consider:

- `nums1 = [-4, -2, 0, 3]`
- `nums2 = [2, 4]`
- `k = 3`

We need the 3rd smallest product. The complete product matrix would be:

```
nums2:   2     4
nums1:
-4     -8    -16
-2     -4     -8
 0      0      0
 3      6     12
```

Sorted products: `[-16, -8, -8, -4, 0, 0, 6, 12]`

The 3rd smallest (1-based) is `-8`. But generating all 8 products is manageable here; for arrays of size 10^5 each, we'd have 10^10 products — impossible to generate.

The key observation: **If we guess a candidate product value `mid`, we can count how many products are ≤ `mid` without generating them all**. This is the classic "binary search on answer" pattern.

Let's test guessing `mid = -5`:

- How many products ≤ -5?
- For each `a` in nums1, we need to count how many `b` in nums2 satisfy `a * b ≤ -5`
- This counting can be done efficiently using binary search in nums2

For example, when `a = -4` (negative):

- We need `-4 * b ≤ -5` → `b ≥ 1.25` (dividing by negative flips inequality)
- In nums2 = [2, 4], both 2 and 4 satisfy this → count = 2

When `a = 3` (positive):

- We need `3 * b ≤ -5` → `b ≤ -1.666`
- No elements in nums2 satisfy this → count = 0

We sum these counts for all `a`. If total count ≥ k, our guess `mid` might be too high (or equal to the answer). If count < k, our guess is too low.

## Brute Force Approach

The brute force solution generates all possible products, sorts them, and returns the kth smallest:

<div class="code-group">

```python
# Time: O(n*m log(n*m)) | Space: O(n*m)
def kthSmallestProduct(nums1, nums2, k):
    products = []
    for a in nums1:
        for b in nums2:
            products.append(a * b)
    products.sort()
    return products[k-1]
```

```javascript
// Time: O(n*m log(n*m)) | Space: O(n*m)
function kthSmallestProduct(nums1, nums2, k) {
  const products = [];
  for (const a of nums1) {
    for (const b of nums2) {
      products.push(a * b);
    }
  }
  products.sort((a, b) => a - b);
  return products[k - 1];
}
```

```java
// Time: O(n*m log(n*m)) | Space: O(n*m)
public long kthSmallestProduct(int[] nums1, int[] nums2, long k) {
    List<Long> products = new ArrayList<>();
    for (int a : nums1) {
        for (int b : nums2) {
            products.add((long) a * b);
        }
    }
    Collections.sort(products);
    return products.get((int) (k - 1));
}
```

</div>

**Why this fails:** With n, m up to 5×10^4, we'd have 2.5×10^9 products to generate and sort. That's 20+ GB of memory and would take hours to compute. We need a solution that works in roughly O((n+m) log W) where W is the range of possible products.

## Optimized Approach

The optimized solution uses **binary search on the answer** combined with **efficient counting**. Here's the step-by-step reasoning:

1. **Binary Search on Answer Space**: The minimum possible product is `min(nums1[0]*nums2[0], nums1[0]*nums2[-1], nums1[-1]*nums2[0], nums1[-1]*nums2[-1])` and maximum is similarly among extremes. We search between `-10^20` to `10^20` (since values can be ±10^5 and product of two such values is ±10^10).

2. **Counting Function**: For a candidate value `mid`, we need to count how many pairs (i, j) satisfy `nums1[i] * nums2[j] ≤ mid`. We handle four cases based on the sign of `nums1[i]`:
   - **Zero**: If `mid ≥ 0`, all products with zero are ≤ mid (since 0 ≤ mid)
   - **Positive**: We need `nums2[j] ≤ mid / nums1[i]` (integer division with floor)
   - **Negative**: We need `nums2[j] ≥ mid / nums1[i]` (division with ceiling, inequality flips)
   - **Edge Cases**: Handle division carefully to avoid overflow

3. **Binary Search in nums2**: For each `a` in nums1, we can binary search in nums2 to count valid `b` values in O(log m) time.

4. **Binary Search Termination**: We look for the smallest `mid` such that `count(mid) ≥ k`. This is the standard "lower bound" binary search pattern.

The counting is tricky because:

- When `a > 0`, inequality `a*b ≤ mid` becomes `b ≤ floor(mid/a)`
- When `a < 0`, inequality `a*b ≤ mid` becomes `b ≥ ceil(mid/a)` (dividing by negative flips inequality)
- When `a = 0`, all products are 0, so count depends on whether `mid ≥ 0`

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O((n+m) log W) where W is range of products | Space: O(1)
def kthSmallestProduct(nums1, nums2, k):
    """
    Find the kth smallest product of nums1[i] * nums2[j]
    using binary search on answer with efficient counting.
    """

    def count_products(mid):
        """Count how many products are <= mid."""
        count = 0

        for a in nums1:
            if a == 0:
                # If a == 0, then a*b = 0 for all b
                # All products are <= mid if mid >= 0
                if mid >= 0:
                    count += len(nums2)
            elif a > 0:
                # For a > 0: a*b <= mid => b <= mid // a
                # We need to find the largest index where nums2[j] <= target
                target = mid // a

                # Binary search for the rightmost position where nums2[j] <= target
                # If all elements are > target, left will stay at 0
                # If all elements are <= target, left will be len(nums2)
                left, right = 0, len(nums2)
                while left < right:
                    m = (left + right) // 2
                    if nums2[m] <= target:
                        left = m + 1
                    else:
                        right = m
                count += left
            else:  # a < 0
                # For a < 0: a*b <= mid => b >= ceil(mid / a)
                # Dividing by negative flips inequality
                # We need ceil(mid / a) = (mid + a + 1) // a for negative a
                target = (mid + a + 1) // a  # Ceiling division for negative divisor

                # Binary search for the leftmost position where nums2[j] >= target
                left, right = 0, len(nums2)
                while left < right:
                    m = (left + right) // 2
                    if nums2[m] < target:
                        left = m + 1
                    else:
                        right = m
                count += len(nums2) - left

        return count

    # Binary search for the smallest mid such that count_products(mid) >= k
    # Search range: from -10^20 to 10^20 (since max abs value is 10^5, product is 10^10)
    left, right = -10**20, 10**20

    while left < right:
        mid = (left + right) // 2
        if count_products(mid) >= k:
            right = mid
        else:
            left = mid + 1

    return left
```

```javascript
// Time: O((n+m) log W) where W is range of products | Space: O(1)
function kthSmallestProduct(nums1, nums2, k) {
    /**
     * Count how many products are <= mid
     */
    const countProducts = (mid) => {
        let count = 0;

        for (const a of nums1) {
            if (a === 0) {
                // If a == 0, all products are 0
                // They are <= mid if mid >= 0
                if (mid >= 0) {
                    count += nums2.length;
                }
            } else if (a > 0) {
                // For a > 0: a*b <= mid => b <= Math.floor(mid / a)
                const target = Math.floor(mid / a);

                // Binary search for rightmost index where nums2[j] <= target
                let left = 0, right = nums2.length;
                while (left < right) {
                    const m = Math.floor((left + right) / 2);
                    if (nums2[m] <= target) {
                        left = m + 1;
                    } else {
                        right = m;
                    }
                }
                count += left;  // left is the count of elements <= target
            } else {  // a < 0
                // For a < 0: a*b <= mid => b >= Math.ceil(mid / a)
                // Math.ceil(mid / a) for negative a
                const target = Math.ceil(mid / a);

                // Binary search for leftmost index where nums2[j] >= target
                let left = 0, right = nums2.length;
                while (left < right) {
                    const m = Math.floor((left + right) / 2);
                    if (nums2[m] < target) {
                        left = m + 1;
                    } else {
                        right = m;
                    }
                }
                count += nums2.length - left;
            }
        }

        return count;
    };

    // Binary search on answer space
    // Use BigInt to handle large numbers safely
    let left = -10n ** 20n;
    let right = 10n ** 20n;

    while (left < right) {
        const mid = (left + right) / 2n;
        if (countProducts(mid) >= k) {
            right = mid;
        } else {
            left = mid + 1n;
        }
    }

    return Number(left);
}
```

```java
// Time: O((n+m) log W) where W is range of products | Space: O(1)
public long kthSmallestProduct(int[] nums1, int[] nums2, long k) {
    // Helper function to count products <= mid
    long countProducts(long mid) {
        long count = 0;

        for (int a : nums1) {
            if (a == 0) {
                // All products with a=0 are 0
                if (mid >= 0) {
                    count += nums2.length;
                }
            } else if (a > 0) {
                // For a > 0: a*b <= mid => b <= mid / a
                long target = mid / a;  // Integer division truncates toward zero

                // Binary search for rightmost index where nums2[j] <= target
                int left = 0, right = nums2.length;
                while (left < right) {
                    int m = left + (right - left) / 2;
                    if (nums2[m] <= target) {
                        left = m + 1;
                    } else {
                        right = m;
                    }
                }
                count += left;
            } else {  // a < 0
                // For a < 0: a*b <= mid => b >= ceil(mid / a)
                // Ceil division for negative numbers: (mid + a + 1) / a
                long target = (mid + a + 1) / a;

                // Binary search for leftmost index where nums2[j] >= target
                int left = 0, right = nums2.length;
                while (left < right) {
                    int m = left + (right - left) / 2;
                    if (nums2[m] < target) {
                        left = m + 1;
                    } else {
                        right = m;
                    }
                }
                count += nums2.length - left;
            }
        }

        return count;
    }

    // Binary search on answer
    // Range: -10^20 to 10^20 (since max product is 10^10)
    long left = -10_000_000_000_000_000_000L;
    long right = 10_000_000_000_000_000_000L;

    while (left < right) {
        long mid = left + (right - left) / 2;
        if (countProducts(mid) >= k) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }

    return left;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O((n + m) log W) where:

- `n` = length of nums1, `m` = length of nums2
- `W` = range of possible product values (from -10^20 to 10^20 in our search)
- For each binary search iteration (log W steps), we iterate through nums1 (O(n)) and perform binary search in nums2 for each element (O(log m) each)
- Total: O(n log m × log W) ≈ O((n+m) log W) for practical purposes

**Space Complexity:** O(1) excluding input arrays. We only use a few variables for counting and binary search indices.

## Common Mistakes

1. **Incorrect inequality handling for negative numbers**: When `a < 0`, dividing both sides of `a*b ≤ mid` by `a` flips the inequality. Many candidates forget this and use `b ≤ mid/a` for all cases.

2. **Integer overflow in product calculation**: Even when using 64-bit integers, `mid/a` can overflow if we're not careful. Always use division to check the condition rather than computing `a*b` directly.

3. **Off-by-one errors in binary search**: When counting elements `≤ target` or `≥ target`, it's easy to get the indices wrong. Test your binary search logic on simple cases.

4. **Forgetting the zero case**: When `a = 0`, the product is always 0. This needs special handling since division by zero would crash.

5. **Incorrect search bounds**: Using bounds that are too small might miss the actual answer. Since values can be ±10^5, products can be ±10^10. Use bounds like ±10^20 to be safe.

## When You'll See This Pattern

This "binary search on answer with counting" pattern appears in many problems where:

1. Direct computation is too expensive (O(n²) or worse)
2. You can efficiently count how many elements satisfy a condition relative to a candidate value
3. The answer space is monotonic (if count(mid) ≥ k, then answer ≤ mid)

**Related problems:**

- **Find K Pairs with Smallest Sums** (Medium): Similar structure but with sums instead of products. You maintain a heap of candidates.
- **Kth Smallest Element in a Sorted Matrix** (Medium): Binary search on value with counting of how many elements are ≤ mid.
- **Maximum Number of Robots Within Budget** (Hard): Binary search on number of robots with feasibility check.

## Key Takeaways

1. **Binary search on answer** is powerful when you can't generate all possibilities but can test a candidate efficiently. Look for problems where you can answer "how many elements satisfy X ≤ mid?" in better than O(n²) time.

2. **Handle different cases separately** when operations aren't symmetric. Here, positive and negative numbers require different inequality handling.

3. **Precompute what you can** — the arrays are already sorted, allowing O(log n) binary searches instead of O(n) linear scans.

4. **Test edge cases thoroughly**: zero values, all positive/negative arrays, large k values, and boundary conditions.

Related problems: [Find K Pairs with Smallest Sums](/problem/find-k-pairs-with-smallest-sums), [K-diff Pairs in an Array](/problem/k-diff-pairs-in-an-array), [Maximum Number of Robots Within Budget](/problem/maximum-number-of-robots-within-budget)
