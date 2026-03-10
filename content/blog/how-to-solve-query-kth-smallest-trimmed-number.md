---
title: "How to Solve Query Kth Smallest Trimmed Number — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Query Kth Smallest Trimmed Number. Medium difficulty, 47.1% acceptance rate. Topics: Array, String, Divide and Conquer, Sorting, Heap (Priority Queue)."
date: "2028-11-25"
category: "dsa-patterns"
tags: ["query-kth-smallest-trimmed-number", "array", "string", "divide-and-conquer", "medium"]
---

# How to Solve Query Kth Smallest Trimmed Number

This problem asks us to process multiple queries on an array of digit strings. For each query, we need to trim each number to its last `trim` digits, then find the k-th smallest trimmed number, returning its original index in `nums`. The challenge lies in efficiently handling multiple queries without repeatedly sorting the entire array from scratch for each query.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:**

```
nums = ["102", "473", "385", "001"]
queries = [[1, 1], [2, 2], [1, 3], [2, 3]]
```

**Step-by-step processing:**

**Query 1:** `[k=1, trim=1]`

- Trim each number to last 1 digit: `["2", "3", "5", "1"]`
- Sort trimmed numbers: `["1", "2", "3", "5"]`
- The 1st smallest is `"1"`, which came from original index 3
- **Output:** `3`

**Query 2:** `[k=2, trim=2]`

- Trim to last 2 digits: `["02", "73", "85", "01"]`
- Sort: `["01", "02", "73", "85"]`
- The 2nd smallest is `"02"`, from original index 0
- **Output:** `0`

**Query 3:** `[k=1, trim=3]`

- Trim to last 3 digits: `["102", "473", "385", "001"]`
- Sort: `["001", "102", "385", "473"]`
- The 1st smallest is `"001"`, from original index 3
- **Output:** `3`

**Query 4:** `[k=2, trim=3]`

- Same trimmed numbers as query 3
- The 2nd smallest is `"102"`, from original index 0
- **Output:** `0`

**Final answer:** `[3, 0, 3, 0]`

The key observation: For the same `trim` value, we get the same trimmed numbers. If we process queries with the same `trim` together, we can reuse the sorting work.

## Brute Force Approach

The most straightforward approach is to process each query independently:

1. For each query `[k, trim]`:
   - Create a new array of trimmed strings by taking the last `trim` characters from each number
   - Pair each trimmed string with its original index
   - Sort the pairs by trimmed string (and by index for tie-breaking)
   - Return the original index of the k-th smallest element

**Why this is inefficient:**

- Time complexity: O(q × n log n) where q = number of queries, n = length of nums
- For each query, we're doing O(n log n) sorting work
- If multiple queries have the same `trim` value, we're repeating the same sorting work
- With constraints up to 100 queries and 100 numbers, this could be 10,000 operations, which might pass but isn't optimal

<div class="code-group">

```python
# Brute Force Solution
# Time: O(q * n log n) | Space: O(n)
def smallestTrimmedNumbers(nums, queries):
    result = []

    for k, trim in queries:
        # Step 1: Create trimmed numbers with their indices
        trimmed = []
        for i, num in enumerate(nums):
            # Take last 'trim' digits
            trimmed_num = num[-trim:] if trim <= len(num) else num
            trimmed.append((trimmed_num, i))

        # Step 2: Sort by trimmed number, then by index for ties
        trimmed.sort(key=lambda x: (x[0], x[1]))

        # Step 3: Get the k-th smallest (1-indexed, so k-1)
        result.append(trimmed[k-1][1])

    return result
```

```javascript
// Brute Force Solution
// Time: O(q * n log n) | Space: O(n)
function smallestTrimmedNumbers(nums, queries) {
  const result = [];

  for (const [k, trim] of queries) {
    // Step 1: Create trimmed numbers with their indices
    const trimmed = [];
    for (let i = 0; i < nums.length; i++) {
      // Take last 'trim' digits
      const trimmedNum = nums[i].slice(-trim);
      trimmed.push([trimmedNum, i]);
    }

    // Step 2: Sort by trimmed number, then by index for ties
    trimmed.sort((a, b) => {
      if (a[0] < b[0]) return -1;
      if (a[0] > b[0]) return 1;
      return a[1] - b[1];
    });

    // Step 3: Get the k-th smallest (1-indexed, so k-1)
    result.push(trimmed[k - 1][1]);
  }

  return result;
}
```

```java
// Brute Force Solution
// Time: O(q * n log n) | Space: O(n)
public int[] smallestTrimmedNumbers(String[] nums, int[][] queries) {
    int[] result = new int[queries.length];

    for (int q = 0; q < queries.length; q++) {
        int k = queries[q][0];
        int trim = queries[q][1];

        // Step 1: Create trimmed numbers with their indices
        List<Pair<String, Integer>> trimmed = new ArrayList<>();
        for (int i = 0; i < nums.length; i++) {
            // Take last 'trim' digits
            String trimmedNum = nums[i].substring(nums[i].length() - trim);
            trimmed.add(new Pair<>(trimmedNum, i));
        }

        // Step 2: Sort by trimmed number, then by index for ties
        trimmed.sort((a, b) -> {
            int cmp = a.getKey().compareTo(b.getKey());
            if (cmp != 0) return cmp;
            return a.getValue() - b.getValue();
        });

        // Step 3: Get the k-th smallest (1-indexed, so k-1)
        result[q] = trimmed.get(k - 1).getValue();
    }

    return result;
}
```

</div>

## Optimized Approach

The key insight is that **queries with the same `trim` value will have the same trimmed numbers**. Instead of sorting for each query independently, we can:

1. Group queries by their `trim` value
2. For each unique `trim` value:
   - Create the trimmed versions of all numbers once
   - Sort the (trimmed number, index) pairs
   - Answer all queries with that `trim` value using the same sorted list

**Why this is better:**

- If we have 10 queries with `trim=2`, we only sort once instead of 10 times
- The worst case is when all queries have different `trim` values, which degenerates to the brute force approach
- But in practice, queries often have repeated `trim` values

**Alternative optimization:** Use counting sort or radix sort since we're sorting digit strings of fixed length. However, the grouping approach is simpler and works well for typical constraints.

## Optimal Solution

Here's the optimized solution that groups queries by `trim` value:

<div class="code-group">

```python
# Optimized Solution - Group Queries by Trim Value
# Time: O(t * n log n) where t = number of unique trim values
# Space: O(n + q) for storing results and grouped queries
def smallestTrimmedNumbers(nums, queries):
    # Dictionary to group queries by trim value
    # Key: trim value, Value: list of (query_index, k)
    queries_by_trim = {}

    # Group queries by their trim value
    for i, (k, trim) in enumerate(queries):
        if trim not in queries_by_trim:
            queries_by_trim[trim] = []
        queries_by_trim[trim].append((i, k))

    # Initialize result array
    result = [0] * len(queries)

    # Process each unique trim value
    for trim, query_list in queries_by_trim.items():
        # Step 1: Create trimmed numbers with original indices
        trimmed = []
        for idx, num in enumerate(nums):
            # Extract last 'trim' digits
            # Since all nums have equal length and trim <= len(num),
            # we can safely slice
            trimmed_num = num[-trim:]
            trimmed.append((trimmed_num, idx))

        # Step 2: Sort by trimmed number, then by original index for ties
        # This ensures stable sorting behavior
        trimmed.sort(key=lambda x: (x[0], x[1]))

        # Step 3: Answer all queries with this trim value
        for query_idx, k in query_list:
            # k is 1-indexed, so we use k-1
            result[query_idx] = trimmed[k-1][1]

    return result
```

```javascript
// Optimized Solution - Group Queries by Trim Value
// Time: O(t * n log n) where t = number of unique trim values
// Space: O(n + q) for storing results and grouped queries
function smallestTrimmedNumbers(nums, queries) {
  // Map to group queries by trim value
  // Key: trim value, Value: array of [queryIndex, k]
  const queriesByTrim = new Map();

  // Group queries by their trim value
  for (let i = 0; i < queries.length; i++) {
    const [k, trim] = queries[i];
    if (!queriesByTrim.has(trim)) {
      queriesByTrim.set(trim, []);
    }
    queriesByTrim.get(trim).push([i, k]);
  }

  // Initialize result array
  const result = new Array(queries.length);

  // Process each unique trim value
  for (const [trim, queryList] of queriesByTrim) {
    // Step 1: Create trimmed numbers with original indices
    const trimmed = [];
    for (let i = 0; i < nums.length; i++) {
      // Extract last 'trim' digits
      const trimmedNum = nums[i].slice(-trim);
      trimmed.push([trimmedNum, i]);
    }

    // Step 2: Sort by trimmed number, then by original index for ties
    trimmed.sort((a, b) => {
      if (a[0] < b[0]) return -1;
      if (a[0] > b[0]) return 1;
      return a[1] - b[1];
    });

    // Step 3: Answer all queries with this trim value
    for (const [queryIdx, k] of queryList) {
      // k is 1-indexed, so we use k-1
      result[queryIdx] = trimmed[k - 1][1];
    }
  }

  return result;
}
```

```java
// Optimized Solution - Group Queries by Trim Value
// Time: O(t * n log n) where t = number of unique trim values
// Space: O(n + q) for storing results and grouped queries
public int[] smallestTrimmedNumbers(String[] nums, int[][] queries) {
    // Map to group queries by trim value
    // Key: trim value, Value: list of [queryIndex, k]
    Map<Integer, List<int[]>> queriesByTrim = new HashMap<>();

    // Group queries by their trim value
    for (int i = 0; i < queries.length; i++) {
        int k = queries[i][0];
        int trim = queries[i][1];
        queriesByTrim.computeIfAbsent(trim, key -> new ArrayList<>())
                     .add(new int[]{i, k});
    }

    // Initialize result array
    int[] result = new int[queries.length];

    // Process each unique trim value
    for (Map.Entry<Integer, List<int[]>> entry : queriesByTrim.entrySet()) {
        int trim = entry.getKey();
        List<int[]> queryList = entry.getValue();

        // Step 1: Create trimmed numbers with original indices
        List<Pair<String, Integer>> trimmed = new ArrayList<>();
        for (int i = 0; i < nums.length; i++) {
            // Extract last 'trim' digits
            String trimmedNum = nums[i].substring(nums[i].length() - trim);
            trimmed.add(new Pair<>(trimmedNum, i));
        }

        // Step 2: Sort by trimmed number, then by original index for ties
        trimmed.sort((a, b) -> {
            int cmp = a.getKey().compareTo(b.getKey());
            if (cmp != 0) return cmp;
            return a.getValue() - b.getValue();
        });

        // Step 3: Answer all queries with this trim value
        for (int[] query : queryList) {
            int queryIdx = query[0];
            int k = query[1];
            // k is 1-indexed, so we use k-1
            result[queryIdx] = trimmed.get(k - 1).getValue();
        }
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- Let `n` = number of strings in `nums`
- Let `q` = number of queries
- Let `t` = number of unique `trim` values in queries
- For each unique `trim`, we sort `n` elements: O(n log n)
- Total: O(t × n log n)
- In the worst case where all queries have different `trim` values, `t = q`, giving O(q × n log n) (same as brute force)
- In the best case where all queries have the same `trim`, `t = 1`, giving O(n log n)

**Space Complexity:**

- O(n) for storing the trimmed array
- O(q) for grouping queries and storing results
- Total: O(n + q)

## Common Mistakes

1. **Forgetting that k is 1-indexed:** The problem states "k-th smallest", and in the examples, k=1 means the first smallest. Many candidates use `trimmed[k]` instead of `trimmed[k-1]`.

2. **Not handling tie-breakers correctly:** When two trimmed numbers are equal, we need to return the one with the smaller original index. This requires sorting by both the trimmed number AND the original index.

3. **Inefficient trimming:** Some candidates convert trimmed strings to integers for comparison. This is unnecessary (string comparison works for digit strings) and can cause overflow for large numbers.

4. **Missing edge case when trim > string length:** While the problem guarantees `trim <= len(nums[i])`, in real interviews it's good to handle the general case with `num[-trim:] if trim <= len(num) else num`.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Query optimization by grouping:** Similar to problems where you process multiple queries more efficiently by batching similar ones.
   - Related: LeetCode 1938 - "Maximum Genetic Difference Query" (group queries by node)
   - Related: LeetCode 1851 - "Minimum Interval to Include Each Query" (process queries in sorted order)

2. **Custom sorting with multiple keys:** Sorting by primary key (trimmed number) and secondary key (original index) is a common pattern.
   - Related: LeetCode 179 - "Largest Number" (custom string comparator)
   - Related: LeetCode 937 - "Reorder Data in Log Files" (multiple sort keys)

3. **String manipulation with slicing:** Extracting substrings from fixed-length strings appears in many problems.
   - Related: LeetCode 1071 - "Greatest Common Divisor of Strings"
   - Related: LeetCode 459 - "Repeated Substring Pattern"

## Key Takeaways

1. **Look for opportunities to batch process:** When you have multiple independent operations (queries), check if some can be grouped to avoid redundant work. This is especially valuable when operations are expensive (like sorting).

2. **Understand your comparison requirements:** When sorting, clearly identify all sort keys and their priority. Here, primary key = trimmed string, secondary key = original index for tie-breaking.

3. **Work with the data's properties:** The fact that all strings have equal length and consist only of digits simplifies the problem. Recognizing such constraints helps choose the right approach.

[Practice this problem on CodeJeet](/problem/query-kth-smallest-trimmed-number)
