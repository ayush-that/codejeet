---
title: "How to Solve Tuple with Same Product — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Tuple with Same Product. Medium difficulty, 70.1% acceptance rate. Topics: Array, Hash Table, Counting."
date: "2028-10-17"
category: "dsa-patterns"
tags: ["tuple-with-same-product", "array", "hash-table", "counting", "medium"]
---

# How to Solve Tuple with Same Product

This problem asks us to count quadruples `(a, b, c, d)` from a distinct positive integer array where `a × b = c × d` and all four elements are distinct. The challenge lies in efficiently finding pairs of numbers with equal products without checking all possible quadruples, which would be prohibitively slow for larger arrays.

## Visual Walkthrough

Let's trace through a small example: `nums = [2, 3, 4, 6]`

We need to find all quadruples where `a × b = c × d` with all four elements distinct. Let's examine all possible products:

- `2 × 3 = 6`
- `2 × 4 = 8`
- `2 × 6 = 12`
- `3 × 4 = 12`
- `3 × 6 = 18`
- `4 × 6 = 24`

Now let's look for equal products:

- Product 12 appears twice: `2 × 6 = 12` and `3 × 4 = 12`

For product 12, we have two pairs: `(2, 6)` and `(3, 4)`. From these two pairs, we can form 8 distinct quadruples:

1. `(2, 6, 3, 4)` and `(2, 6, 4, 3)` (a,b as first pair)
2. `(6, 2, 3, 4)` and `(6, 2, 4, 3)` (swapping a,b)
3. `(3, 4, 2, 6)` and `(3, 4, 6, 2)` (a,b as second pair)
4. `(4, 3, 2, 6)` and `(4, 3, 6, 2)` (swapping a,b)

Notice the pattern: for `k` pairs that share the same product, each pair can be `(a,b)` or `(c,d)`, and within each position, the two numbers can be swapped. This gives us `k × (k-1) × 4` quadruples for that product value.

## Brute Force Approach

The most straightforward approach is to check all possible quadruples:

<div class="code-group">

```python
# Time: O(n⁴) | Space: O(1)
def brute_force(nums):
    n = len(nums)
    count = 0

    # Check all possible quadruples
    for i in range(n):
        for j in range(n):
            if j == i: continue
            for k in range(n):
                if k == i or k == j: continue
                for l in range(n):
                    if l == i or l == j or l == k: continue
                    if nums[i] * nums[j] == nums[k] * nums[l]:
                        count += 1

    # Each valid quadruple is counted 8 times (4!/(2!2!) = 6 ways to arrange,
    # but we need to divide by 2 since (a,b) and (b,a) are considered same for product)
    return count // 8
```

```javascript
// Time: O(n⁴) | Space: O(1)
function bruteForce(nums) {
  const n = nums.length;
  let count = 0;

  // Check all possible quadruples
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (j === i) continue;
      for (let k = 0; k < n; k++) {
        if (k === i || k === j) continue;
        for (let l = 0; l < n; l++) {
          if (l === i || l === j || l === k) continue;
          if (nums[i] * nums[j] === nums[k] * nums[l]) {
            count++;
          }
        }
      }
    }
  }

  // Adjust for overcounting
  return count / 8;
}
```

```java
// Time: O(n⁴) | Space: O(1)
public int bruteForce(int[] nums) {
    int n = nums.length;
    int count = 0;

    // Check all possible quadruples
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (j == i) continue;
            for (int k = 0; k < n; k++) {
                if (k == i || k == j) continue;
                for (int l = 0; l < n; l++) {
                    if (l == i || l == j || l == k) continue;
                    if (nums[i] * nums[j] == nums[k] * nums[l]) {
                        count++;
                    }
                }
            }
        }
    }

    // Adjust for overcounting
    return count / 8;
}
```

</div>

**Why this fails:** With O(n⁴) time complexity, this solution becomes impossibly slow for arrays with more than about 20 elements. For n=100, we'd need to check 100⁴ = 100 million operations, which is far too slow.

## Optimized Approach

The key insight is that we don't need to check all quadruples directly. Instead, we can:

1. **Compute all possible products** of distinct pairs (i < j to avoid duplicates)
2. **Count how many pairs** have each product value using a hash map
3. **For each product value**, if there are `k` pairs with that product, they can form `k × (k-1) × 4` valid quadruples

Why multiply by 4? For each pair of pairs (p1, p2) where p1 ≠ p2:

- p1 can be (a,b) and p2 can be (c,d)
- Within p1, (a,b) can be swapped to (b,a) → 2 arrangements
- Within p2, (c,d) can be swapped to (d,c) → 2 arrangements
- Total: 2 × 2 = 4 arrangements

The formula becomes: For product with count `k`, add `k × (k-1) × 4` to total.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n²) | Space: O(n²)
def tupleSameProduct(nums):
    """
    Count quadruples (a,b,c,d) where a*b = c*d and all elements are distinct.

    Approach:
    1. Compute all products of distinct pairs (i < j)
    2. Count frequency of each product using hash map
    3. For each product with count k, it contributes k*(k-1)*4 quadruples
    """
    n = len(nums)
    product_count = {}  # Map product -> number of pairs with that product

    # Step 1: Compute all products of distinct pairs
    for i in range(n):
        for j in range(i + 1, n):  # i < j ensures distinct elements
            product = nums[i] * nums[j]
            # Increment count for this product
            product_count[product] = product_count.get(product, 0) + 1

    # Step 2: Calculate total number of valid quadruples
    total = 0
    for count in product_count.values():
        # For count pairs with same product, number of ways to choose 2 distinct pairs
        # is count choose 2 = count*(count-1)/2
        # Each pair of pairs gives 4 arrangements (swap within each pair)
        # So total = (count*(count-1)/2) * 4 = count*(count-1)*2
        total += count * (count - 1) * 4

    return total
```

```javascript
// Time: O(n²) | Space: O(n²)
function tupleSameProduct(nums) {
  /**
   * Count quadruples (a,b,c,d) where a*b = c*d and all elements are distinct.
   *
   * Approach:
   * 1. Compute all products of distinct pairs (i < j)
   * 2. Count frequency of each product using hash map
   * 3. For each product with count k, it contributes k*(k-1)*4 quadruples
   */
  const n = nums.length;
  const productCount = new Map(); // Map product -> number of pairs with that product

  // Step 1: Compute all products of distinct pairs
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      // i < j ensures distinct elements
      const product = nums[i] * nums[j];
      // Increment count for this product
      productCount.set(product, (productCount.get(product) || 0) + 1);
    }
  }

  // Step 2: Calculate total number of valid quadruples
  let total = 0;
  for (const count of productCount.values()) {
    // For count pairs with same product, number of ways to choose 2 distinct pairs
    // is count choose 2 = count*(count-1)/2
    // Each pair of pairs gives 4 arrangements (swap within each pair)
    // So total = (count*(count-1)/2) * 4 = count*(count-1)*2
    total += count * (count - 1) * 4;
  }

  return total;
}
```

```java
// Time: O(n²) | Space: O(n²)
public int tupleSameProduct(int[] nums) {
    /**
     * Count quadruples (a,b,c,d) where a*b = c*d and all elements are distinct.
     *
     * Approach:
     * 1. Compute all products of distinct pairs (i < j)
     * 2. Count frequency of each product using hash map
     * 3. For each product with count k, it contributes k*(k-1)*4 quadruples
     */
    int n = nums.length;
    Map<Integer, Integer> productCount = new HashMap<>();  // Map product -> number of pairs

    // Step 1: Compute all products of distinct pairs
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {  // i < j ensures distinct elements
            int product = nums[i] * nums[j];
            // Increment count for this product
            productCount.put(product, productCount.getOrDefault(product, 0) + 1);
        }
    }

    // Step 2: Calculate total number of valid quadruples
    int total = 0;
    for (int count : productCount.values()) {
        // For count pairs with same product, number of ways to choose 2 distinct pairs
        // is count choose 2 = count*(count-1)/2
        // Each pair of pairs gives 4 arrangements (swap within each pair)
        // So total = (count*(count-1)/2) * 4 = count*(count-1)*2
        total += count * (count - 1) * 4;
    }

    return total;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n²)**

- We iterate through all pairs of indices (i, j) where i < j
- Number of such pairs is n choose 2 = n(n-1)/2 = O(n²)
- Hash map operations (insert and lookup) are O(1) on average

**Space Complexity: O(n²)**

- In the worst case, all products could be distinct
- Maximum number of distinct products is n choose 2 = O(n²)
- However, in practice, many products may be repeated, so actual space usage is often less

## Common Mistakes

1. **Not ensuring all four elements are distinct**: The problem requires a ≠ b ≠ c ≠ d. If you use i ≤ j instead of i < j when generating pairs, you might include pairs with the same element (like 2×2), which violates the distinctness requirement.

2. **Incorrect counting formula**: Some candidates use `count × (count-1)` without the `×4` factor, forgetting that for each pair of pairs, we can swap elements within each pair. Others might use `count × (count-1) × 2` by mistake.

3. **Integer overflow**: With large numbers in the array, the product might exceed the maximum integer value. While Python handles big integers automatically, in Java and JavaScript you need to be aware of this. The problem constraints (positive integers) help, but it's still good practice to consider.

4. **Double counting adjustments**: In the brute force approach, candidates often struggle with dividing by the correct factor (8) to account for different orderings of the same quadruple.

## When You'll See This Pattern

This "count pairs with equal value" pattern appears in several problems:

1. **Two Sum** (LeetCode 1): Instead of products, we look for pairs with a specific sum. The technique of using a hash map to store seen values is similar.

2. **4Sum II** (LeetCode 454): Count quadruples from four arrays where a+b+c+d=0. The optimal solution involves computing all sums from two arrays and using a hash map, similar to how we compute all products here.

3. **Number of Good Pairs** (LeetCode 1512): Count pairs (i,j) where nums[i] == nums[j] and i<j. The counting formula (n choose 2 for equal values) is similar to our k×(k-1)/2 calculation.

The core pattern is: when you need to find combinations that satisfy an equation, consider computing intermediate results and counting their frequencies.

## Key Takeaways

1. **Transform the problem**: Instead of directly checking quadruples (O(n⁴)), transform to counting pairs with equal products (O(n²)). This is a common optimization technique for combinatorial problems.

2. **Combinatorial counting**: Learn to derive counting formulas. For k pairs with the same product, the number of valid quadruples is k×(k-1)×4. Practice deriving such formulas for different constraints.

3. **Hash maps for frequency counting**: When you need to count how many times a computed value appears, hash maps are your go-to data structure. They provide O(1) lookups and updates on average.

[Practice this problem on CodeJeet](/problem/tuple-with-same-product)
