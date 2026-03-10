---
title: "How to Solve XOR Queries of a Subarray — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode XOR Queries of a Subarray. Medium difficulty, 78.1% acceptance rate. Topics: Array, Bit Manipulation, Prefix Sum."
date: "2028-08-12"
category: "dsa-patterns"
tags: ["xor-queries-of-a-subarray", "array", "bit-manipulation", "prefix-sum", "medium"]
---

# How to Solve XOR Queries of a Subarray

This problem asks us to efficiently compute XOR values for multiple subarray queries. Given an array `arr` and a list of queries `[left, right]`, we need to return the XOR of elements from index `left` to `right` for each query. What makes this interesting is that XOR has a special property similar to prefix sums, allowing us to answer multiple queries in constant time each after some preprocessing.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider:

- `arr = [1, 3, 4, 8]`
- `queries = [[0,1], [1,2], [0,3], [3,3]]`

**Step 1: Understanding XOR properties**
XOR has two key properties:

1. `a XOR a = 0` (any number XOR itself is 0)
2. `a XOR 0 = a` (any number XOR 0 is itself)

**Step 2: Manual calculation**

- Query `[0,1]`: `1 XOR 3 = 2`
- Query `[1,2]`: `3 XOR 4 = 7`
- Query `[0,3]`: `1 XOR 3 XOR 4 XOR 8 = 14`
- Query `[3,3]`: `8`

**Step 3: The prefix XOR insight**
If we precompute prefix XORs:

- `prefix[0] = 0` (base case)
- `prefix[1] = 1` (0 XOR 1)
- `prefix[2] = 1 XOR 3 = 2`
- `prefix[3] = 2 XOR 4 = 6`
- `prefix[4] = 6 XOR 8 = 14`

Now notice:

- Query `[0,1]`: `prefix[2] XOR prefix[0] = 2 XOR 0 = 2`
- Query `[1,2]`: `prefix[3] XOR prefix[1] = 6 XOR 1 = 7`
- Query `[0,3]`: `prefix[4] XOR prefix[0] = 14 XOR 0 = 14`
- Query `[3,3]`: `prefix[4] XOR prefix[3] = 14 XOR 6 = 8`

The pattern: `XOR(arr[left]...arr[right]) = prefix[right+1] XOR prefix[left]`

## Brute Force Approach

The most straightforward approach is to compute each query independently by iterating through the specified range:

1. For each query `[left, right]`
2. Initialize `result = 0`
3. Loop from `i = left` to `i = right`
4. XOR each element into `result`
5. Store the result

While simple, this approach is inefficient because it recomputes overlapping ranges for different queries. If we have `m` queries and each query covers up to `n` elements, the time complexity becomes O(m × n), which is too slow for large inputs.

<div class="code-group">

```python
# Time: O(m * n) where m = len(queries), n = len(arr)
# Space: O(m) for the answer array
def xorQueries_brute(arr, queries):
    answer = []

    for left, right in queries:
        xor_val = 0
        # XOR all elements in the range [left, right]
        for i in range(left, right + 1):
            xor_val ^= arr[i]
        answer.append(xor_val)

    return answer
```

```javascript
// Time: O(m * n) where m = queries.length, n = arr.length
// Space: O(m) for the answer array
function xorQueriesBrute(arr, queries) {
  const answer = [];

  for (const [left, right] of queries) {
    let xorVal = 0;
    // XOR all elements in the range [left, right]
    for (let i = left; i <= right; i++) {
      xorVal ^= arr[i];
    }
    answer.push(xorVal);
  }

  return answer;
}
```

```java
// Time: O(m * n) where m = queries.length, n = arr.length
// Space: O(m) for the answer array
public int[] xorQueriesBrute(int[] arr, int[][] queries) {
    int[] answer = new int[queries.length];

    for (int q = 0; q < queries.length; q++) {
        int left = queries[q][0];
        int right = queries[q][1];
        int xorVal = 0;
        // XOR all elements in the range [left, right]
        for (int i = left; i <= right; i++) {
            xorVal ^= arr[i];
        }
        answer[q] = xorVal;
    }

    return answer;
}
```

</div>

## Optimized Approach

The key insight is that XOR operations have properties similar to addition/subtraction when it comes to prefix computations. Specifically:

1. **Prefix XOR array**: Let `prefix[i]` be the XOR of all elements from `arr[0]` to `arr[i-1]`. So `prefix[0] = 0`, `prefix[1] = arr[0]`, `prefix[2] = arr[0] XOR arr[1]`, etc.

2. **Range XOR from prefix**: The XOR of elements from index `left` to `right` can be computed as:

   ```
   XOR(arr[left]...arr[right]) = prefix[right+1] XOR prefix[left]
   ```

   Why does this work? Because:

   ```
   prefix[right+1] = arr[0] XOR arr[1] XOR ... XOR arr[right]
   prefix[left] = arr[0] XOR arr[1] XOR ... XOR arr[left-1]

   prefix[right+1] XOR prefix[left] = (arr[0] XOR ... XOR arr[left-1]) XOR (arr[0] XOR ... XOR arr[right]) XOR (arr[0] XOR ... XOR arr[left-1])
   ```

   Since `(arr[0] XOR ... XOR arr[left-1]) XOR (arr[0] XOR ... XOR arr[left-1]) = 0`, we're left with:

   ```
   arr[left] XOR arr[left+1] XOR ... XOR arr[right]
   ```

This is analogous to how prefix sums work: `sum(arr[left]...arr[right]) = prefix[right+1] - prefix[left]`.

## Optimal Solution

We can now implement an efficient solution:

1. Precompute the prefix XOR array in O(n) time
2. Answer each query in O(1) time using the formula above
3. Total time complexity: O(n + m)

<div class="code-group">

```python
# Time: O(n + m) where n = len(arr), m = len(queries)
# Space: O(n + m) for prefix array and answer
def xorQueries(arr, queries):
    n = len(arr)

    # Step 1: Build prefix XOR array
    # prefix[i] = XOR of arr[0] to arr[i-1]
    # prefix[0] = 0 (XOR of empty array)
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] ^ arr[i]

    # Step 2: Answer each query using prefix XOR
    answer = []
    for left, right in queries:
        # XOR from left to right = prefix[right+1] XOR prefix[left]
        xor_val = prefix[right + 1] ^ prefix[left]
        answer.append(xor_val)

    return answer
```

```javascript
// Time: O(n + m) where n = arr.length, m = queries.length
// Space: O(n + m) for prefix array and answer
function xorQueries(arr, queries) {
  const n = arr.length;

  // Step 1: Build prefix XOR array
  // prefix[i] = XOR of arr[0] to arr[i-1]
  // prefix[0] = 0 (XOR of empty array)
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] ^ arr[i];
  }

  // Step 2: Answer each query using prefix XOR
  const answer = [];
  for (const [left, right] of queries) {
    // XOR from left to right = prefix[right+1] XOR prefix[left]
    const xorVal = prefix[right + 1] ^ prefix[left];
    answer.push(xorVal);
  }

  return answer;
}
```

```java
// Time: O(n + m) where n = arr.length, m = queries.length
// Space: O(n + m) for prefix array and answer
public int[] xorQueries(int[] arr, int[][] queries) {
    int n = arr.length;

    // Step 1: Build prefix XOR array
    // prefix[i] = XOR of arr[0] to arr[i-1]
    // prefix[0] = 0 (XOR of empty array)
    int[] prefix = new int[n + 1];
    for (int i = 0; i < n; i++) {
        prefix[i + 1] = prefix[i] ^ arr[i];
    }

    // Step 2: Answer each query using prefix XOR
    int[] answer = new int[queries.length];
    for (int q = 0; q < queries.length; q++) {
        int left = queries[q][0];
        int right = queries[q][1];
        // XOR from left to right = prefix[right+1] XOR prefix[left]
        answer[q] = prefix[right + 1] ^ prefix[left];
    }

    return answer;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + m)**

- Building the prefix XOR array takes O(n) time, where n is the length of `arr`
- Answering m queries takes O(m) time, since each query is answered in O(1) time
- Total: O(n + m)

**Space Complexity: O(n + m)**

- The prefix array requires O(n) space
- The answer array requires O(m) space
- Total: O(n + m)

Note: We could optimize space to O(m) by computing XOR values on the fly without storing the entire prefix array, but this would make the code less readable and the improvement is usually negligible unless n is extremely large.

## Common Mistakes

1. **Off-by-one errors with prefix array indices**: The most common mistake is using `prefix[right] XOR prefix[left-1]` instead of `prefix[right+1] XOR prefix[left]`. Remember: `prefix[i]` contains XOR up to `arr[i-1]`, not `arr[i]`. Always test with a simple example.

2. **Forgetting to initialize prefix[0] = 0**: If you start with `prefix[0] = arr[0]`, the formula won't work for queries starting at index 0. The empty prefix (XOR of no elements) must be 0.

3. **Using the wrong operator**: XOR is `^` in most languages, not `xor` or `XOR`. Also, don't confuse it with exponentiation (`**` or `Math.pow`).

4. **Not handling edge cases**: What if `left > right`? According to the problem, queries are valid (left ≤ right), but in interviews, it's good to mention this assumption. Also consider empty arrays: if `arr` is empty, return an empty answer array.

## When You'll See This Pattern

The prefix XOR technique is a special case of the more general **prefix sum** pattern, which appears in many problems:

1. **Range Sum Query - Immutable (LeetCode 303)**: Exactly the same pattern but with addition instead of XOR. Build prefix sums and answer queries with `prefix[right+1] - prefix[left]`.

2. **Maximum Subarray (LeetCode 53)**: While solved differently, understanding prefix sums helps recognize that the maximum subarray ending at position i is `prefix[i] - min(prefix[0...i-1])`.

3. **Subarray Sum Equals K (LeetCode 560)**: Uses prefix sums with hash maps to find subarrays summing to k in O(n) time.

4. **Count Triplets That Can Form Two Arrays of Equal XOR (LeetCode 1442)**: A harder problem that builds on the XOR prefix concept.

The core idea is: when you need to answer many range queries on a static array, precomputing prefix values often allows O(1) query time.

## Key Takeaways

1. **XOR has cancellation properties** similar to addition/subtraction: `a XOR a = 0` and `a XOR 0 = a`. This allows us to compute range XORs using prefix arrays.

2. **Prefix techniques work for any associative operation** that has an inverse (or a "cancellation" property like XOR). This includes addition, subtraction, and XOR, but not multiplication (due to division by zero issues) or maximum/minimum (no inverse).

3. **The formula `prefix[right+1] XOR prefix[left]`** gives the XOR of elements from index `left` to `right`. The `+1` is crucial because `prefix[i]` stores XOR up to index `i-1`.

4. **When you see "multiple range queries on a static array"**, think about prefix computations. The preprocessing cost of O(n) is worth it if you have many queries.

[Practice this problem on CodeJeet](/problem/xor-queries-of-a-subarray)
