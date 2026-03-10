---
title: "How to Solve Product of the Last K Numbers — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Product of the Last K Numbers. Medium difficulty, 62.9% acceptance rate. Topics: Array, Math, Design, Data Stream, Prefix Sum."
date: "2028-04-16"
category: "dsa-patterns"
tags: ["product-of-the-last-k-numbers", "array", "math", "design", "medium"]
---

# How to Solve "Product of the Last K Numbers"

This problem asks us to design a data structure that supports two operations: adding numbers to a stream, and efficiently retrieving the product of the last `k` numbers added. The challenge is that both operations need to be fast — we can't recompute products from scratch every time, especially when the stream could have thousands of numbers and many queries.

What makes this interesting is that it looks like a prefix sum problem, but with multiplication instead of addition. However, there's a critical complication: zeros. A single zero in the last `k` numbers makes the entire product zero, but zeros also break the prefix product approach unless handled carefully.

## Visual Walkthrough

Let's trace through an example to build intuition. We'll create a `ProductOfNumbers` object and perform these operations:

```
add(3) → stream: [3]
add(0) → stream: [3, 0]
add(2) → stream: [3, 0, 2]
add(5) → stream: [3, 0, 2, 5]
getProduct(2) → product of last 2 numbers = 2 * 5 = 10
getProduct(3) → product of last 3 numbers = 0 * 2 * 5 = 0
add(4) → stream: [3, 0, 2, 5, 4]
getProduct(2) → product of last 2 numbers = 5 * 4 = 20
```

Notice the challenge: when we have a zero in the stream, it affects all products that include it. If we try to use prefix products like `[1, 3, 0, 0, 0, 0]` (where each element is the product of all numbers up to that point), we run into problems because once we hit a zero, all subsequent prefix products become zero too.

The key insight: we need to "reset" our prefix product array whenever we encounter a zero. This way, each segment between zeros maintains valid prefix products.

## Brute Force Approach

The most straightforward approach would be to store all numbers in an array and compute products on demand:

1. **add(num)**: Simply append `num` to an array. O(1) time.
2. **getProduct(k)**: Iterate through the last `k` elements and multiply them together. O(k) time.

While `add` is efficient, `getProduct` becomes problematic when `k` is large or when we have many queries. In the worst case, if we have `n` numbers and make `q` queries for large `k`, the time complexity could be O(nq), which is too slow for constraints where `n` and `q` can be up to 40,000.

**Why this fails**: The problem explicitly states we need an efficient solution. The brute force approach doesn't scale because each query requires scanning potentially thousands of elements. We need to precompute something to answer queries in constant time.

## Optimized Approach

The optimal solution uses a modified **prefix product** approach with zero handling. Here's the step-by-step reasoning:

1. **Prefix Products Concept**: For addition, we use prefix sums to compute the sum of any subarray in O(1) time. For multiplication, we could use prefix products: `prefix[i] = product of all numbers from index 0 to i`. Then `product of last k numbers = prefix[n-1] / prefix[n-k-1]`.

2. **The Zero Problem**: Division by zero is undefined, and if any element in the range is zero, the entire product is zero anyway. We need a different approach.

3. **Key Insight - Reset on Zero**: When we encounter a zero, we should reset our prefix product array. This creates segments between zeros where prefix products work correctly.

4. **Implementation Plan**:
   - Maintain a list `prefix` where `prefix[i]` is the product of all numbers since the last zero (or start).
   - When we `add(num)`:
     - If `num` is 0, reset `prefix` to `[1]` (the identity element for multiplication).
     - Otherwise, append `prefix[-1] * num` to `prefix`.
   - When we `getProduct(k)`:
     - If `k > len(prefix)-1`, it means there's a zero in the last `k` numbers (since we reset on zeros), so return 0.
     - Otherwise, return `prefix[-1] / prefix[-1-k]`.

5. **Why This Works**: The `prefix` array grows with each non-zero number. When we ask for the last `k` numbers, if `k` is larger than our current segment size, there must be a zero in that range. If `k` fits within the current segment, we can compute the product using division of prefix products.

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
class ProductOfNumbers:
    # Time: O(1) for both add() and getProduct()
    # Space: O(n) where n is the number of elements added

    def __init__(self):
        # Initialize with [1] so we can easily compute products
        # The 1 acts as a base for multiplication (identity element)
        self.prefix = [1]

    def add(self, num: int) -> None:
        if num == 0:
            # Reset the prefix array when we encounter a zero
            # This marks the start of a new segment
            self.prefix = [1]
        else:
            # Append the product of the current number with the last product
            # This builds our running product for the current segment
            self.prefix.append(self.prefix[-1] * num)

    def getProduct(self, k: int) -> int:
        # Check if k is larger than our current segment size
        # If so, there's a zero in the last k numbers
        if k >= len(self.prefix):
            return 0

        # Compute product using prefix products
        # prefix[-1] is product of entire current segment
        # prefix[-1-k] is product up to (but not including) the first of the k numbers
        # Dividing gives us the product of the last k numbers
        return self.prefix[-1] // self.prefix[-1 - k]
```

```javascript
class ProductOfNumbers {
  // Time: O(1) for both add() and getProduct()
  // Space: O(n) where n is the number of elements added

  constructor() {
    // Initialize with [1] so we can easily compute products
    // The 1 acts as a base for multiplication (identity element)
    this.prefix = [1];
  }

  add(num) {
    if (num === 0) {
      // Reset the prefix array when we encounter a zero
      // This marks the start of a new segment
      this.prefix = [1];
    } else {
      // Append the product of the current number with the last product
      // This builds our running product for the current segment
      this.prefix.push(this.prefix[this.prefix.length - 1] * num);
    }
  }

  getProduct(k) {
    // Check if k is larger than our current segment size
    // If so, there's a zero in the last k numbers
    if (k >= this.prefix.length) {
      return 0;
    }

    // Compute product using prefix products
    // prefix[prefix.length-1] is product of entire current segment
    // prefix[prefix.length-1-k] is product up to (but not including) the first of the k numbers
    // Dividing gives us the product of the last k numbers
    const lastIndex = this.prefix.length - 1;
    return this.prefix[lastIndex] / this.prefix[lastIndex - k];
  }
}
```

```java
class ProductOfNumbers {
    // Time: O(1) for both add() and getProduct()
    // Space: O(n) where n is the number of elements added

    private List<Integer> prefix;

    public ProductOfNumbers() {
        // Initialize with 1 so we can easily compute products
        // The 1 acts as a base for multiplication (identity element)
        prefix = new ArrayList<>();
        prefix.add(1);
    }

    public void add(int num) {
        if (num == 0) {
            // Reset the prefix list when we encounter a zero
            // This marks the start of a new segment
            prefix = new ArrayList<>();
            prefix.add(1);
        } else {
            // Append the product of the current number with the last product
            // This builds our running product for the current segment
            prefix.add(prefix.get(prefix.size() - 1) * num);
        }
    }

    public int getProduct(int k) {
        // Check if k is larger than our current segment size
        // If so, there's a zero in the last k numbers
        if (k >= prefix.size()) {
            return 0;
        }

        // Compute product using prefix products
        // prefix.get(lastIndex) is product of entire current segment
        // prefix.get(lastIndex-k) is product up to (but not including) the first of the k numbers
        // Dividing gives us the product of the last k numbers
        int lastIndex = prefix.size() - 1;
        return prefix.get(lastIndex) / prefix.get(lastIndex - k);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- `add(num)`: O(1) - We either reset the array (O(1) amortized) or append one element.
- `getProduct(k)`: O(1) - We perform at most two array lookups and one division.

**Space Complexity:** O(n) in the worst case, where `n` is the number of elements added. This occurs when we never encounter a zero, so we store prefix products for all elements. When we encounter zeros, we reset and use less space for that segment.

The key to the O(1) time for `getProduct` is that we precompute prefix products as we add numbers, so queries don't need to iterate through the data.

## Common Mistakes

1. **Forgetting to handle zeros properly**: The most common error is trying to use standard prefix products without resetting on zeros. This fails because once a zero appears, all subsequent prefix products become zero, making division impossible.

2. **Off-by-one errors in index calculations**: When computing `prefix[-1] / prefix[-1-k]`, it's easy to get the indices wrong. Remember that `prefix[-1]` is the product of ALL numbers in the current segment, and `prefix[-1-k]` is the product up to (but not including) the first of the `k` numbers.

3. **Not initializing with [1]**: Starting with an empty array or `[0]` breaks the logic. We need `[1]` as a base because:
   - When we add the first number `x`, we want `prefix` to become `[1, x]`
   - Then `getProduct(1)` should return `prefix[-1] / prefix[-2] = x / 1 = x`

4. **Using integer overflow**: The problem constraints say numbers can be up to 100, and we might have up to 40,000 numbers. 100^40,000 is astronomically large and will overflow even 64-bit integers. However, the problem guarantees all computations fit within 32-bit integers, so this isn't an issue in practice.

## When You'll See This Pattern

This "prefix product with reset" pattern appears in several stream processing problems:

1. **LeetCode 238. Product of Array Except Self**: While not a stream problem, it uses similar prefix product thinking. You compute prefix and suffix products to get the product of all elements except the current one.

2. **LeetCode 1352. Product of the Last K Numbers**: This is the exact problem we're solving! Recognizing it as a prefix product variant is key.

3. **LeetCode 53. Maximum Subarray (Kadane's Algorithm)**: While about sums not products, it shares the "reset when encountering a problematic value (negative sum dropping below zero)" pattern.

4. **LeetCode 862. Shortest Subarray with Sum at Least K**: Uses prefix sums with monotonic queues, showing how prefix arrays can be combined with other data structures for more complex queries.

The core pattern is: when you need to answer range queries on a stream or array, consider prefix sums/products. When division by zero or negative numbers complicate things, look for reset conditions or alternative representations.

## Key Takeaways

1. **Prefix products generalize prefix sums**: Just as prefix sums help with range sum queries, prefix products help with range product queries. The reset-on-zero trick is the key adaptation for multiplication.

2. **Stream problems often require precomputation**: To achieve O(1) query time, you typically need to maintain some data structure that gets updated with each addition. Think about what you can compute incrementally.

3. **Identity elements matter**: Starting with `[1]` (the multiplicative identity) rather than `[0]` or an empty array is crucial. This pattern appears whenever building cumulative operations.

4. **Segment-based thinking helps with resets**: When you encounter a "reset condition" (like zero in this case), think in terms of segments. Each segment is independent, and queries spanning segment boundaries have special answers (zero in this case).

[Practice this problem on CodeJeet](/problem/product-of-the-last-k-numbers)
