---
title: "How to Solve Special Array II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Special Array II. Medium difficulty, 45.8% acceptance rate. Topics: Array, Binary Search, Prefix Sum."
date: "2026-11-14"
category: "dsa-patterns"
tags: ["special-array-ii", "array", "binary-search", "prefix-sum", "medium"]
---

# How to Solve Special Array II

This problem asks us to check multiple subarray queries to determine if each subarray is "special" — meaning every adjacent pair contains numbers with different parity (one even, one odd). The challenge comes from having to answer many queries efficiently. A brute force check for each query would be too slow, requiring us to find a way to preprocess the array so each query can be answered in constant time.

**What makes this interesting:** We need to transform a "check every adjacent pair" problem into a prefix computation problem. The key insight is that we're not checking individual elements but relationships between them, which can be precomputed.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:**

```
nums = [3, 4, 1, 2, 6]
queries = [[0, 1], [1, 3], [0, 4]]
```

A subarray is special if for every adjacent pair `(nums[i], nums[i+1])`, one is even and one is odd.

**Step-by-step check:**

1. Query `[0, 1]`: Subarray `[3, 4]`
   - Check pair (3, 4): 3 is odd, 4 is even ✓ (different parity)
   - All pairs valid → subarray is special → **true**

2. Query `[1, 3]`: Subarray `[4, 1, 2]`
   - Check (4, 1): 4 even, 1 odd ✓
   - Check (1, 2): 1 odd, 2 even ✓
   - All pairs valid → **true**

3. Query `[0, 4]`: Subarray `[3, 4, 1, 2, 6]`
   - Check (3, 4): ✓
   - Check (4, 1): ✓
   - Check (1, 2): ✓
   - Check (2, 6): 2 even, 6 even ✗ (same parity)
   - One invalid pair → **false**

The brute force approach would check each pair in each query. For `m` queries on an array of length `n`, worst-case time would be `O(m * n)` when queries cover most of the array.

**Key observation:** If we could quickly know whether there's any "bad" pair (same parity adjacent) in a subarray, we could answer queries faster. This is where prefix sums come in.

## Brute Force Approach

The straightforward solution checks each query independently by iterating through the subarray and verifying every adjacent pair has different parity:

<div class="code-group">

```python
# Time: O(m * n) | Space: O(1) excluding output
def isArraySpecial(nums, queries):
    result = []

    for from_i, to_i in queries:
        is_special = True

        # Check every adjacent pair in the subarray
        for i in range(from_i, to_i):
            # If both even or both odd, parity is same -> not special
            if (nums[i] % 2) == (nums[i+1] % 2):
                is_special = False
                break

        result.append(is_special)

    return result
```

```javascript
// Time: O(m * n) | Space: O(1) excluding output
function isArraySpecial(nums, queries) {
  const result = [];

  for (const [from_i, to_i] of queries) {
    let isSpecial = true;

    // Check every adjacent pair in the subarray
    for (let i = from_i; i < to_i; i++) {
      // If both even or both odd, parity is same -> not special
      if (nums[i] % 2 === nums[i + 1] % 2) {
        isSpecial = false;
        break;
      }
    }

    result.push(isSpecial);
  }

  return result;
}
```

```java
// Time: O(m * n) | Space: O(1) excluding output
public boolean[] isArraySpecial(int[] nums, int[][] queries) {
    boolean[] result = new boolean[queries.length];

    for (int q = 0; q < queries.length; q++) {
        int from_i = queries[q][0];
        int to_i = queries[q][1];
        boolean isSpecial = true;

        // Check every adjacent pair in the subarray
        for (int i = from_i; i < to_i; i++) {
            // If both even or both odd, parity is same -> not special
            if ((nums[i] % 2) == (nums[i + 1] % 2)) {
                isSpecial = false;
                break;
            }
        }

        result[q] = isSpecial;
    }

    return result;
}
```

</div>

**Why this is too slow:** In the worst case, if we have `m` queries and each query covers nearly the entire array of length `n`, the time complexity is `O(m * n)`. With `n` up to 10⁵ and `m` up to 10⁵, this could mean 10¹⁰ operations, which is far too slow.

## Optimized Approach

The key insight is that we can preprocess the array to answer queries in constant time. Here's the step-by-step reasoning:

1. **Identify the problem:** We need to know if any "bad" pair (adjacent elements with same parity) exists in a subarray.

2. **Transform the problem:** Instead of checking the elements themselves, we can check the relationships between adjacent elements. Let's create an array `badPairs` where:
   - `badPairs[i] = 1` if `nums[i]` and `nums[i+1]` have the same parity (a "bad" pair)
   - `badPairs[i] = 0` otherwise

3. **Use prefix sums:** If we create a prefix sum array `prefixBad` where `prefixBad[i]` represents the number of bad pairs from index `0` to `i-1`, then:
   - Number of bad pairs in subarray `[from_i, to_i]` = `prefixBad[to_i] - prefixBad[from_i]`
   - If this difference is 0, the subarray has no bad pairs → it's special
   - If this difference > 0, the subarray has at least one bad pair → not special

4. **Why this works:** The prefix sum allows us to answer "how many bad pairs are in this range?" in O(1) time after O(n) preprocessing.

**Example with our earlier input:**

```
nums =        [3, 4, 1, 2, 6]
parity =      [O, E, O, E, E]  # O=odd, E=even
badPairs =    [0, 0, 0, 1]     # 1 where (2,6) have same parity
prefixBad =   [0, 0, 0, 0, 1]  # cumulative sum of badPairs

Query [0, 4]: prefixBad[4] - prefixBad[0] = 1 - 0 = 1 → not special
Query [0, 1]: prefixBad[1] - prefixBad[0] = 0 - 0 = 0 → special
```

## Optimal Solution

Here's the complete implementation using prefix sums:

<div class="code-group">

```python
# Time: O(n + m) | Space: O(n)
def isArraySpecial(nums, queries):
    n = len(nums)

    # Step 1: Create badPairs array
    # badPairs[i] = 1 if nums[i] and nums[i+1] have same parity, else 0
    badPairs = [0] * (n - 1)  # n-1 possible adjacent pairs

    for i in range(n - 1):
        # Check if current and next element have same parity
        # nums[i] % 2 == nums[i+1] % 2 means both even or both odd
        if (nums[i] % 2) == (nums[i + 1] % 2):
            badPairs[i] = 1

    # Step 2: Create prefix sum of badPairs
    # prefixBad[i] = number of bad pairs from index 0 to i-1
    # prefixBad[0] is always 0 (no pairs before index 0)
    prefixBad = [0] * (n)

    for i in range(1, n):
        # prefixBad[i] = prefixBad[i-1] + badPairs[i-1]
        # Add 1 if the pair ending at i-1 was bad
        prefixBad[i] = prefixBad[i - 1] + badPairs[i - 1]

    # Step 3: Answer each query in O(1) time
    result = []

    for from_i, to_i in queries:
        # Number of bad pairs in range [from_i, to_i]
        # is the difference in prefix sums
        badPairsInRange = prefixBad[to_i] - prefixBad[from_i]

        # If no bad pairs, subarray is special
        result.append(badPairsInRange == 0)

    return result
```

```javascript
// Time: O(n + m) | Space: O(n)
function isArraySpecial(nums, queries) {
  const n = nums.length;

  // Step 1: Create badPairs array
  // badPairs[i] = 1 if nums[i] and nums[i+1] have same parity, else 0
  const badPairs = new Array(n - 1).fill(0);

  for (let i = 0; i < n - 1; i++) {
    // Check if current and next element have same parity
    // nums[i] % 2 == nums[i+1] % 2 means both even or both odd
    if (nums[i] % 2 === nums[i + 1] % 2) {
      badPairs[i] = 1;
    }
  }

  // Step 2: Create prefix sum of badPairs
  // prefixBad[i] = number of bad pairs from index 0 to i-1
  // prefixBad[0] is always 0 (no pairs before index 0)
  const prefixBad = new Array(n).fill(0);

  for (let i = 1; i < n; i++) {
    // prefixBad[i] = prefixBad[i-1] + badPairs[i-1]
    // Add 1 if the pair ending at i-1 was bad
    prefixBad[i] = prefixBad[i - 1] + badPairs[i - 1];
  }

  // Step 3: Answer each query in O(1) time
  const result = [];

  for (const [from_i, to_i] of queries) {
    // Number of bad pairs in range [from_i, to_i]
    // is the difference in prefix sums
    const badPairsInRange = prefixBad[to_i] - prefixBad[from_i];

    // If no bad pairs, subarray is special
    result.push(badPairsInRange === 0);
  }

  return result;
}
```

```java
// Time: O(n + m) | Space: O(n)
public boolean[] isArraySpecial(int[] nums, int[][] queries) {
    int n = nums.length;

    // Step 1: Create badPairs array
    // badPairs[i] = 1 if nums[i] and nums[i+1] have same parity, else 0
    int[] badPairs = new int[n - 1];

    for (int i = 0; i < n - 1; i++) {
        // Check if current and next element have same parity
        // nums[i] % 2 == nums[i+1] % 2 means both even or both odd
        if ((nums[i] % 2) == (nums[i + 1] % 2)) {
            badPairs[i] = 1;
        }
    }

    // Step 2: Create prefix sum of badPairs
    // prefixBad[i] = number of bad pairs from index 0 to i-1
    // prefixBad[0] is always 0 (no pairs before index 0)
    int[] prefixBad = new int[n];

    for (int i = 1; i < n; i++) {
        // prefixBad[i] = prefixBad[i-1] + badPairs[i-1]
        // Add 1 if the pair ending at i-1 was bad
        prefixBad[i] = prefixBad[i - 1] + badPairs[i - 1];
    }

    // Step 3: Answer each query in O(1) time
    boolean[] result = new boolean[queries.length];

    for (int q = 0; q < queries.length; q++) {
        int from_i = queries[q][0];
        int to_i = queries[q][1];

        // Number of bad pairs in range [from_i, to_i]
        // is the difference in prefix sums
        int badPairsInRange = prefixBad[to_i] - prefixBad[from_i];

        // If no bad pairs, subarray is special
        result[q] = (badPairsInRange == 0);
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + m)**

- `O(n)` to build the `badPairs` array and prefix sum array
- `O(m)` to answer all queries (each in O(1) time)
- Total: `O(n + m)`, which is efficient even for large inputs

**Space Complexity: O(n)**

- `O(n)` for the `badPairs` array (size n-1) and `prefixBad` array (size n)
- We could optimize to use only the prefix array by building it directly, but O(n) is acceptable

## Common Mistakes

1. **Off-by-one errors in prefix sum calculation:**
   - Mistake: Using `prefixBad[to_i + 1] - prefixBad[from_i]` or similar incorrect indices
   - Why it happens: Confusion about whether prefixBad[i] includes the pair at i-1 or not
   - How to avoid: Remember `prefixBad[i]` = number of bad pairs from index 0 to i-1. Test with small examples.

2. **Not handling single-element subarrays:**
   - Mistake: Special logic needed when `from_i == to_i`
   - Why it happens: A single element has no adjacent pairs, so it's always special
   - How to avoid: Our solution handles this correctly because `prefixBad[to_i] - prefixBad[from_i]` = 0 when `from_i == to_i`

3. **Incorrect parity check:**
   - Mistake: Using `(nums[i] + nums[i+1]) % 2 == 0` to check for same parity
   - Why it happens: Misunderstanding that sum of two odds is even (2+4=6 even, but 2 even, 4 even)
   - How to avoid: Use `(nums[i] % 2) == (nums[i+1] % 2)` to directly compare parity

4. **Building full prefix array for each query:**
   - Mistake: Recomputing prefix sums for each query instead of precomputing once
   - Why it happens: Not recognizing the pattern that allows O(1) query answering
   - How to avoid: Recognize that range sum queries can be answered with prefix sums

## When You'll See This Pattern

This "prefix sum for range queries" pattern appears in many problems:

1. **Range Sum Query - Immutable (LeetCode 303):** The classic prefix sum problem for answering sum queries.

2. **Product of Array Except Self (LeetCode 238):** Uses prefix and suffix products, a variation of the prefix concept.

3. **Subarray Sum Equals K (LeetCode 560):** Uses prefix sums with hash maps to find subarrays summing to k.

4. **Counting subarrays with certain properties:** Any problem asking "how many subarrays have property X?" often uses prefix sums or sliding window.

The core idea: When you need to answer many queries about ranges in an array, and the query is about some aggregate property (sum, count, product), consider if you can precompute prefix values.

## Key Takeaways

1. **Transform relationship checks into prefix sums:** When checking relationships between adjacent elements (like parity), create an array marking where the relationship fails, then use prefix sums to count failures in any range.

2. **Range query → prefix sum thinking:** If a problem asks about subarray properties and has multiple queries, prefix sums (or segment trees, or binary indexed trees) should come to mind.

3. **Test edge cases:** Always test with single-element subarrays, entire array, and arrays with all valid/invalid pairs. These catch off-by-one errors.

[Practice this problem on CodeJeet](/problem/special-array-ii)
