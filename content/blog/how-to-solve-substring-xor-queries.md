---
title: "How to Solve Substring XOR Queries — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Substring XOR Queries. Medium difficulty, 35.4% acceptance rate. Topics: Array, Hash Table, String, Bit Manipulation."
date: "2030-02-06"
category: "dsa-patterns"
tags: ["substring-xor-queries", "array", "hash-table", "string", "medium"]
---

# How to Solve Substring XOR Queries

You're given a binary string `s` and a 2D array `queries`. For each query `[first, second]`, you need to find the shortest substring of `s` whose decimal value XORed with `first` equals `second`. What makes this problem interesting is that it combines substring searching with bitwise operations, requiring you to think about both string manipulation and XOR properties efficiently.

## Visual Walkthrough

Let's walk through an example to build intuition. Suppose we have:

- `s = "101101"`
- `queries = [[1, 2], [2, 1]]`

For the first query `[1, 2]`:

- We need `val ^ 1 = 2`, which means `val = 2 ^ 1 = 3` (since XOR is reversible: if `a ^ b = c`, then `a = b ^ c`)
- We need to find the shortest substring whose decimal value is 3
- In binary, 3 is "11"
- Looking at `s = "101101"`, we find "11" starting at index 1 (positions 1-2: "11")
- So the answer is `[1, 2]` (starting index, ending index)

For the second query `[2, 1]`:

- We need `val ^ 2 = 1`, so `val = 1 ^ 2 = 3`
- Again we need substring with value 3 ("11")
- The same substring works, so answer is `[1, 2]`

The key insight: For query `[first, second]`, we're actually looking for substring with value `first ^ second`. This transforms the problem from "find substring where XOR equals something" to "find substring with specific value."

## Brute Force Approach

A naive approach would be:

1. For each query `[first, second]`, calculate `target = first ^ second`
2. Convert `target` to binary string
3. Search through all substrings of `s` to find the shortest one matching the binary representation

Here's what that might look like:

<div class="code-group">

```python
def substringXorQueries_brute(s, queries):
    result = []

    for first, second in queries:
        target = first ^ second
        target_bin = bin(target)[2:]  # Remove '0b' prefix

        # Search for shortest substring
        best_start = -1
        best_end = -1
        found = False

        # Try all possible starting positions
        for start in range(len(s)):
            # Try all possible ending positions
            for end in range(start, len(s)):
                substring = s[start:end+1]

                # Remove leading zeros for comparison
                # But we need to handle the case where substring is all zeros
                if substring.lstrip('0') == target_bin or (target == 0 and substring == '0'):
                    if not found or (end - start) < (best_end - best_start):
                        best_start = start
                        best_end = end
                        found = True

        if found:
            result.append([best_start, best_end])
        else:
            result.append([-1, -1])

    return result
```

```javascript
function substringXorQueriesBrute(s, queries) {
  const result = [];

  for (const [first, second] of queries) {
    const target = first ^ second;
    const targetBin = target.toString(2);

    let bestStart = -1;
    let bestEnd = -1;
    let found = false;

    // Try all possible substrings
    for (let start = 0; start < s.length; start++) {
      for (let end = start; end < s.length; end++) {
        const substring = s.substring(start, end + 1);

        // Remove leading zeros for comparison
        const substringNoLeadingZeros = substring.replace(/^0+/, "");

        if (
          (substringNoLeadingZeros === targetBin && substringNoLeadingZeros !== "") ||
          (target === 0 && substring === "0")
        ) {
          if (!found || end - start < bestEnd - bestStart) {
            bestStart = start;
            bestEnd = end;
            found = true;
          }
        }
      }
    }

    result.push(found ? [bestStart, bestEnd] : [-1, -1]);
  }

  return result;
}
```

```java
public int[][] substringXorQueriesBrute(String s, int[][] queries) {
    int[][] result = new int[queries.length][2];

    for (int i = 0; i < queries.length; i++) {
        int first = queries[i][0];
        int second = queries[i][1];
        int target = first ^ second;
        String targetBin = Integer.toBinaryString(target);

        int bestStart = -1;
        int bestEnd = -1;
        boolean found = false;

        // Try all possible substrings
        for (int start = 0; start < s.length(); start++) {
            for (int end = start; end < s.length(); end++) {
                String substring = s.substring(start, end + 1);

                // Remove leading zeros
                String substringNoLeadingZeros = substring.replaceFirst("^0+", "");

                if ((!substringNoLeadingZeros.isEmpty() &&
                     substringNoLeadingZeros.equals(targetBin)) ||
                    (target == 0 && substring.equals("0"))) {
                    if (!found || (end - start) < (bestEnd - bestStart)) {
                        bestStart = start;
                        bestEnd = end;
                        found = true;
                    }
                }
            }
        }

        result[i] = found ? new int[]{bestStart, bestEnd} : new int[]{-1, -1};
    }

    return result;
}
```

</div>

**Why this is too slow:**

- Time complexity: O(n² \* m) where n is length of `s` and m is number of queries
- For each query, we check O(n²) substrings
- With n up to 10⁴ and m up to 10⁵, this could be 10¹³ operations - far too slow

## Optimized Approach

The key insight is that we can precompute all possible substring values and their shortest occurrences. Since `s` can be up to 10⁴ characters long, we can't store all O(n²) substrings, but we can limit ourselves to reasonably sized substrings.

**Critical observation:** The maximum value we need to search for is limited by the constraints. Since `first` and `second` are up to 10⁹, `target = first ^ second` is also up to 10⁹. In binary, 10⁹ requires at most 30 bits (2³⁰ ≈ 1.07 × 10⁹).

Therefore:

1. We only need to consider substrings of length up to 30 (or 31 to be safe)
2. We can precompute all substring values of length 1-30 and store the earliest/shortest occurrence
3. For each query, compute `target = first ^ second` and look it up in our precomputed map

**Step-by-step reasoning:**

1. **Precomputation phase:** Iterate through all starting positions in `s`
   - For each start, build substrings of length 1 to min(30, remaining length)
   - Convert each substring to its decimal value
   - Store the earliest and shortest occurrence for each value
2. **Query phase:** For each query `[first, second]`
   - Compute `target = first ^ second`
   - Look up `target` in our precomputed map
   - Return the stored indices or `[-1, -1]` if not found

**Why this works:**

- Any valid substring value that could answer a query must be ≤ 10⁹
- A value ≤ 10⁹ can be represented by at most 30 bits
- Therefore, if a value exists in `s`, it must appear in a substring of length ≤ 30
- By precomputing all short substrings, we guarantee we'll find any valid answer

## Optimal Solution

Here's the complete optimized solution:

<div class="code-group">

```python
def substringXorQueries(s, queries):
    """
    Optimal solution using precomputation of all short substrings.
    Time: O(30n + m) where n = len(s), m = len(queries)
    Space: O(min(2^30, n*30)) for storing substring values
    """
    n = len(s)
    # Dictionary to store {value: [start, end]} for shortest substring
    # We store the shortest substring for each value
    value_map = {}

    # Precompute all substrings of length up to 30
    # 30 bits is enough to represent numbers up to 10^9 (2^30 ≈ 1.07e9)
    for start in range(n):
        # Initialize current value to 0
        current_val = 0

        # Build substrings starting at 'start' with length up to 30
        # or until we reach the end of string
        for length in range(1, min(31, n - start + 1)):
            # Convert next character to bit value and add to current value
            # Shift left and add new bit: equivalent to current_val * 2 + int(s[end])
            end = start + length - 1
            current_val = (current_val << 1) | int(s[end])

            # If this value hasn't been seen before, or if we found a shorter substring
            if current_val not in value_map or (end - start) < (value_map[current_val][1] - value_map[current_val][0]):
                value_map[current_val] = [start, end]

    # Process queries
    result = []
    for first, second in queries:
        target = first ^ second

        # Look up target in our precomputed map
        if target in value_map:
            result.append(value_map[target])
        else:
            result.append([-1, -1])

    return result
```

```javascript
function substringXorQueries(s, queries) {
  /**
   * Optimal solution using precomputation of all short substrings.
   * Time: O(30n + m) where n = s.length, m = queries.length
   * Space: O(min(2^30, n*30)) for storing substring values
   */
  const n = s.length;
  // Map to store {value: [start, end]} for shortest substring
  const valueMap = new Map();

  // Precompute all substrings of length up to 30
  for (let start = 0; start < n; start++) {
    let currentVal = 0;

    // Build substrings starting at 'start' with length up to 30
    for (let length = 1; length <= 30 && start + length - 1 < n; length++) {
      const end = start + length - 1;
      // Shift left and add new bit
      currentVal = (currentVal << 1) | parseInt(s[end], 10);

      // Check if we found a new value or a shorter substring for existing value
      if (
        !valueMap.has(currentVal) ||
        end - start < valueMap.get(currentVal)[1] - valueMap.get(currentVal)[0]
      ) {
        valueMap.set(currentVal, [start, end]);
      }
    }
  }

  // Process queries
  const result = [];
  for (const [first, second] of queries) {
    const target = first ^ second;

    if (valueMap.has(target)) {
      result.push(valueMap.get(target));
    } else {
      result.push([-1, -1]);
    }
  }

  return result;
}
```

```java
public int[][] substringXorQueries(String s, int[][] queries) {
    /**
     * Optimal solution using precomputation of all short substrings.
     * Time: O(30n + m) where n = s.length(), m = queries.length
     * Space: O(min(2^30, n*30)) for storing substring values
     */
    int n = s.length();
    // HashMap to store {value: [start, end]} for shortest substring
    Map<Integer, int[]> valueMap = new HashMap<>();

    // Precompute all substrings of length up to 30
    for (int start = 0; start < n; start++) {
        int currentVal = 0;

        // Build substrings starting at 'start' with length up to 30
        for (int length = 1; length <= 30 && start + length - 1 < n; length++) {
            int end = start + length - 1;
            // Shift left and add new bit
            currentVal = (currentVal << 1) | (s.charAt(end) - '0');

            // Check if we found a new value or a shorter substring
            if (!valueMap.containsKey(currentVal) ||
                (end - start) < (valueMap.get(currentVal)[1] - valueMap.get(currentVal)[0])) {
                valueMap.put(currentVal, new int[]{start, end});
            }
        }
    }

    // Process queries
    int[][] result = new int[queries.length][2];
    for (int i = 0; i < queries.length; i++) {
        int first = queries[i][0];
        int second = queries[i][1];
        int target = first ^ second;

        if (valueMap.containsKey(target)) {
            result[i] = valueMap.get(target);
        } else {
            result[i] = new int[]{-1, -1};
        }
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- Precomputation: O(30n) = O(n)
  - For each of n starting positions, we check up to 30 lengths
  - This is linear in n
- Query processing: O(m)
  - Each query is a constant-time lookup
- Total: O(n + m)

**Space Complexity:**

- We store at most O(min(2³⁰, 30n)) entries in our map
  - In worst case, if all 30-bit substrings are distinct: ~2³⁰ entries
  - But practically limited by n \* 30 since we only have n starting positions
- So space is O(min(2³⁰, 30n)) which is manageable

## Common Mistakes

1. **Not limiting substring length to 30:** Some candidates try to store all O(n²) substrings, which would cause memory overflow for n = 10⁴. Remember that values are limited to 10⁹, which needs at most 30 bits.

2. **Incorrect XOR reversal:** The key transformation is `val ^ first = second` → `val = first ^ second`. Some candidates mistakenly try `val = second ^ first` (which is actually the same due to XOR commutativity) or other incorrect transformations.

3. **Handling leading zeros incorrectly:** When comparing binary strings, "001" and "1" represent the same value (1). Our solution avoids this issue by working with integer values directly instead of string comparisons.

4. **Not storing shortest substring:** The problem asks for the shortest substring. If you only store the first occurrence, you might miss a shorter later occurrence. Always check if a new occurrence is shorter before updating.

5. **Integer overflow in other languages:** In languages with fixed-size integers, be careful when building values. However, with max 30 bits, we're safe even in 32-bit integers (max 2³¹-1 ≈ 2.1×10⁹).

## When You'll See This Pattern

This problem combines several important patterns:

1. **Precomputation with bounded search space:** When the search space seems large but has inherent limits (like 30 bits here), precomputing all possibilities within those limits is effective. Similar to:
   - **"Maximum XOR of Two Numbers in an Array"** - uses Trie with bounded bit length
   - **"Count Pairs With XOR in a Range"** - leverages limited bit length for efficiency

2. **XOR properties and transformations:** Problems involving XOR often use its mathematical properties:
   - **"Find the Duplicate Number"** - uses XOR to find duplicates
   - **"Single Number"** - classic XOR problem
   - **"Maximum XOR of Two Numbers in an Array"** - mentioned above

3. **Substring value computation with rolling updates:** Building integer values from binary strings efficiently using bit operations appears in:
   - **"Add Binary"** - similar bit manipulation
   - **"Binary Subarrays With Sum"** - counting subarrays with specific sums

## Key Takeaways

1. **Look for inherent limits in the problem:** The constraint that values are ≤ 10⁹ (30 bits) is crucial. Always check input constraints for such opportunities to bound your solution.

2. **Understand XOR properties deeply:** `a ^ b = c` implies `a = b ^ c` and `b = a ^ c`. XOR is its own inverse, which often simplifies problems.

3. **Precomputation beats repeated computation:** When you have many queries, it's often better to precompute answers for all possible queries (within reasonable limits) rather than processing each query independently.

4. **Bit manipulation is efficient:** Using `<<`, `|`, `&`, `^` operations is much faster than string manipulation for binary data.

Related problems: [String Matching in an Array](/problem/string-matching-in-an-array)
