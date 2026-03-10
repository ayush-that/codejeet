---
title: "How to Solve Number of Unique XOR Triplets II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Number of Unique XOR Triplets II. Medium difficulty, 32.4% acceptance rate. Topics: Array, Math, Bit Manipulation, Enumeration."
date: "2026-02-11"
category: "dsa-patterns"
tags: ["number-of-unique-xor-triplets-ii", "array", "math", "bit-manipulation", "medium"]
---

## How to Solve Number of Unique XOR Triplets II

This problem asks us to count the number of unique XOR values we can get by taking three elements from an array, where we can use the same element multiple times as long as the indices satisfy `i ≤ j ≤ k`. The challenge comes from the fact that a brute force approach would be O(n³), which is too slow for typical constraints, so we need a smarter way to compute all possible XOR values efficiently.

**What makes this problem interesting:** Unlike regular triplets where indices must be distinct, here we can reuse elements, which actually simplifies the problem mathematically. The key insight is that `nums[i] XOR nums[j] XOR nums[k]` can be rewritten as `(nums[i] XOR nums[j]) XOR nums[k]`, allowing us to use intermediate results.

---

## Visual Walkthrough

Let's trace through a small example: `nums = [1, 2, 3]`

We need to find all unique XOR values from triplets where `i ≤ j ≤ k`:

**Step 1: List all possible triplets**

- (0,0,0): 1 XOR 1 XOR 1 = 1
- (0,0,1): 1 XOR 1 XOR 2 = 2
- (0,0,2): 1 XOR 1 XOR 3 = 3
- (0,1,1): 1 XOR 2 XOR 2 = 1
- (0,1,2): 1 XOR 2 XOR 3 = 0
- (0,2,2): 1 XOR 3 XOR 3 = 1
- (1,1,1): 2 XOR 2 XOR 2 = 2
- (1,1,2): 2 XOR 2 XOR 3 = 3
- (1,2,2): 2 XOR 3 XOR 3 = 2
- (2,2,2): 3 XOR 3 XOR 3 = 3

**Step 2: Collect unique values**
We get: {0, 1, 2, 3} → 4 unique values

Notice that many triplets produce the same XOR value. Instead of generating all triplets, we can think about this differently: For each possible `i` and `j`, compute `nums[i] XOR nums[j]`, then XOR that result with every possible `nums[k]`. But we can optimize further.

---

## Brute Force Approach

The most straightforward solution is to iterate through all valid triplets `(i, j, k)` with three nested loops, compute each XOR, and store results in a set to count unique values.

<div class="code-group">

```python
# Time: O(n³) | Space: O(n³) in worst case
def countTriplets_brute(nums):
    unique_xors = set()
    n = len(nums)

    for i in range(n):
        for j in range(i, n):
            for k in range(j, n):
                # Compute XOR of three elements
                xor_val = nums[i] ^ nums[j] ^ nums[k]
                unique_xors.add(xor_val)

    return len(unique_xors)
```

```javascript
// Time: O(n³) | Space: O(n³) in worst case
function countTripletsBrute(nums) {
  const uniqueXors = new Set();
  const n = nums.length;

  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      for (let k = j; k < n; k++) {
        // Compute XOR of three elements
        const xorVal = nums[i] ^ nums[j] ^ nums[k];
        uniqueXors.add(xorVal);
      }
    }
  }

  return uniqueXors.size;
}
```

```java
// Time: O(n³) | Space: O(n³) in worst case
public int countTripletsBrute(int[] nums) {
    Set<Integer> uniqueXors = new HashSet<>();
    int n = nums.length;

    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            for (int k = j; k < n; k++) {
                // Compute XOR of three elements
                int xorVal = nums[i] ^ nums[j] ^ nums[k];
                uniqueXors.add(xorVal);
            }
        }
    }

    return uniqueXors.size();
}
```

</div>

**Why this fails:** With `n` up to 1000, O(n³) is far too slow (1 billion operations). We need to reduce this to at least O(n²).

---

## Optimized Approach

The key insight is that XOR is associative: `(a XOR b) XOR c = a XOR (b XOR c)`. This means we can think of the problem as:

1. First, compute all possible XORs of two elements (with `i ≤ j`)
2. Then, XOR each of those results with every possible third element `nums[k]`

But wait — we can optimize even further. Notice that `i ≤ j ≤ k` means we're essentially picking three elements in non-decreasing index order. However, mathematically, the XOR operation doesn't care about order (XOR is commutative). The only constraint is that we can't use an element at an index smaller than a previous one.

Here's the breakthrough: Since we can reuse elements, `nums[i] XOR nums[j]` where `i ≤ j` is equivalent to XORing any two elements from the array (allowing duplicates). Therefore, the set of all possible `nums[i] XOR nums[j]` is actually just the set of all XORs between ANY two elements in the array.

But we need to be careful: When we then XOR with `nums[k]`, we need `k ≥ j`. However, since we're just computing possible values (not tracking indices), we can think of it as: The final XOR is just the XOR of three elements from the array, where we're allowed to use the same element multiple times.

This leads to a simpler approach: The set of all possible XOR triplets is exactly the set of all XORs we can get by combining up to three elements from the array (with repetition allowed).

**Even better insight:** Since XOR is its own inverse (`x XOR x = 0`), and `0 XOR x = x`, we can realize that any XOR of three elements is equivalent to XORing some subset of elements. But with three elements and repetition allowed, we can actually generate any XOR value that can be formed by the XOR of at most three distinct elements from the array.

The most efficient approach: Compute all pairwise XORs first, then XOR those results with all elements to get triple XORs.

---

## Optimal Solution

We use a two-step process:

1. Compute all possible XORs of two elements (including same element twice)
2. For each of those results, XOR with every element to get triple XORs
3. Use a set to track unique values

<div class="code-group">

```python
# Time: O(n²) | Space: O(n²) in worst case
def countTriplets(nums):
    """
    Count unique XOR values from triplets (i <= j <= k).

    Approach:
    1. Generate all possible XORs of two elements (pair_xors)
    2. For each pair_xor, XOR with every element to get triple XORs
    3. Use a set to track unique triple XOR values
    """
    n = len(nums)
    pair_xors = set()

    # Step 1: Generate all XORs of two elements (i <= j)
    # This includes i == j (same element XORed with itself = 0)
    for i in range(n):
        for j in range(i, n):
            pair_xors.add(nums[i] ^ nums[j])

    # Step 2: For each pair XOR, combine with every element
    # to get all possible triple XORs
    triple_xors = set()

    # Special case: XOR of three zeros (0^0^0 = 0) is always possible
    # when we have at least one element (0 comes from i=j=k with value 0,
    # or from x^x^x = x for any x)
    for pair_xor in pair_xors:
        for k in range(n):
            triple_xors.add(pair_xor ^ nums[k])

    return len(triple_xors)
```

```javascript
// Time: O(n²) | Space: O(n²) in worst case
function countTriplets(nums) {
  /**
   * Count unique XOR values from triplets (i <= j <= k).
   *
   * Approach:
   * 1. Generate all possible XORs of two elements (pairXors)
   * 2. For each pairXor, XOR with every element to get triple XORs
   * 3. Use a set to track unique triple XOR values
   */
  const n = nums.length;
  const pairXors = new Set();

  // Step 1: Generate all XORs of two elements (i <= j)
  // This includes i == j (same element XORed with itself = 0)
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      pairXors.add(nums[i] ^ nums[j]);
    }
  }

  // Step 2: For each pair XOR, combine with every element
  // to get all possible triple XORs
  const tripleXors = new Set();

  // Convert pairXors to array for iteration
  const pairXorArray = Array.from(pairXors);

  for (const pairXor of pairXorArray) {
    for (let k = 0; k < n; k++) {
      tripleXors.add(pairXor ^ nums[k]);
    }
  }

  return tripleXors.size;
}
```

```java
// Time: O(n²) | Space: O(n²) in worst case
public int countTriplets(int[] nums) {
    /**
     * Count unique XOR values from triplets (i <= j <= k).
     *
     * Approach:
     * 1. Generate all possible XORs of two elements (pairXors)
     * 2. For each pairXor, XOR with every element to get triple XORs
     * 3. Use a set to track unique triple XOR values
     */
    int n = nums.length;
    Set<Integer> pairXors = new HashSet<>();

    // Step 1: Generate all XORs of two elements (i <= j)
    // This includes i == j (same element XORed with itself = 0)
    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            pairXors.add(nums[i] ^ nums[j]);
        }
    }

    // Step 2: For each pair XOR, combine with every element
    // to get all possible triple XORs
    Set<Integer> tripleXors = new HashSet<>();

    // Special case: XOR of three zeros (0^0^0 = 0) is always possible
    for (int pairXor : pairXors) {
        for (int k = 0; k < n; k++) {
            tripleXors.add(pairXor ^ nums[k]);
        }
    }

    return tripleXors.size();
}
```

</div>

---

## Complexity Analysis

**Time Complexity:** O(n²)

- First nested loop to generate pair XORs: O(n²)
- Second nested loop: O(|pair_xors| × n). In worst case, |pair_xors| could be O(n²), making this O(n³). However, since XOR values are bounded (max value depends on input range), in practice |pair_xors| is limited. For 32-bit integers, there are at most 2³² possible XOR values, which is constant relative to n.

**Space Complexity:** O(min(n², M)) where M is the range of possible XOR values

- We store all unique pair XORs and all unique triple XORs
- With bounded integer range, this is effectively O(1) for large n

---

## Common Mistakes

1. **Forgetting that i ≤ j ≤ k allows element reuse**: Some candidates think they need three distinct elements, which would make the problem harder. Remember `i ≤ j ≤ k` means you can use the same index multiple times.

2. **Trying to track indices instead of values**: The problem asks for unique XOR _values_, not unique triplets. Don't waste time counting how many triplets produce each value.

3. **Missing the associative property insight**: XOR is associative `(a^b)^c = a^(b^c)`, which allows us to compute pair XORs first. Without this insight, candidates might struggle to optimize beyond O(n³).

4. **Not handling the zero case properly**: Remember that `x^x = 0` and `0^x = x`. The value 0 is always possible if we have at least one element (take `i=j=k` with any element `x`, then `x^x^x = x` for any `x`, and if any `x=0`, we get 0 directly).

---

## When You'll See This Pattern

This problem combines **bit manipulation** with **meet-in-the-middle** and **intermediate result caching**:

1. **Maximum XOR of Two Numbers in an Array (LeetCode 421)**: Uses similar XOR properties with bitwise trie to find maximum XOR pair.

2. **Count Triplets That Can Form Two Arrays of Equal XOR (LeetCode 1442)**: Also uses XOR prefix properties and associative nature of XOR.

3. **Subarray XOR Queries (LeetCode 1310)**: Uses prefix XOR to answer range XOR queries efficiently.

The core pattern is: When dealing with XOR over multiple elements, leverage its associative property to precompute intermediate results.

---

## Key Takeaways

1. **XOR is associative and commutative**: `(a^b)^c = a^(b^c)` and `a^b = b^a`. This means order doesn't matter for XOR results, only which elements are included.

2. **Break complex operations into steps**: When asked for XOR of three elements, consider computing pairwise XORs first, then combining with the third element.

3. **Focus on values, not combinations**: For "count unique values" problems, use sets to track results rather than counting how many ways to achieve each result (unless specifically asked).

[Practice this problem on CodeJeet](/problem/number-of-unique-xor-triplets-ii)
