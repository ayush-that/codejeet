---
title: "How to Solve Find Beautiful Indices in the Given Array I — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find Beautiful Indices in the Given Array I. Medium difficulty, 40.5% acceptance rate. Topics: Two Pointers, String, Binary Search, Rolling Hash, String Matching."
date: "2028-09-01"
category: "dsa-patterns"
tags:
  [
    "find-beautiful-indices-in-the-given-array-i",
    "two-pointers",
    "string",
    "binary-search",
    "medium",
  ]
---

# How to Solve Find Beautiful Indices in the Given Array I

This problem asks us to find all indices `i` in string `s` where substring `a` appears, and there exists some index `j` where substring `b` appears within distance `k` of `i`. The challenge lies in efficiently finding all occurrences of both patterns and checking their proximity without quadratic scanning.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:** `s = "isawsquirrelnearmysquirrelhouse"`, `a = "squirrel"`, `b = "my"`, `k = 10`

We need to:

1. Find all starting indices where `"squirrel"` appears in `s`
2. Find all starting indices where `"my"` appears in `s`
3. For each `"squirrel"` index, check if there's any `"my"` index within `k` distance

**Step 1: Find "squirrel" occurrences**

- At index 3: `s[3..10] = "squirrel"` ✓
- At index 18: `s[18..25] = "squirrel"` ✓

**Step 2: Find "my" occurrences**

- At index 14: `s[14..15] = "my"` ✓

**Step 3: Check proximity for each "squirrel"**

- For index 3: Distance to "my" at index 14 is `|3 - 14| = 11`. 11 > 10, so not beautiful.
- For index 18: Distance to "my" at index 14 is `|18 - 14| = 4`. 4 ≤ 10, so beautiful.

**Output:** `[18]`

The key insight: We need to efficiently check if for each `a` index, there exists a `b` index within `k` distance.

## Brute Force Approach

A naive solution would:

1. Find all indices where `a` appears in `s`
2. Find all indices where `b` appears in `s`
3. For each `a` index, scan through all `b` indices to check if any is within `k` distance

```python
def beautifulIndices_brute(s, a, b, k):
    indices_a = []
    indices_b = []
    result = []

    # Find all occurrences of a
    for i in range(len(s) - len(a) + 1):
        if s[i:i+len(a)] == a:
            indices_a.append(i)

    # Find all occurrences of b
    for j in range(len(s) - len(b) + 1):
        if s[j:j+len(b)] == b:
            indices_b.append(j)

    # Check each a index against all b indices
    for i in indices_a:
        beautiful = False
        for j in indices_b:
            if abs(i - j) <= k:
                beautiful = True
                break
        if beautiful:
            result.append(i)

    return result
```

**Why this is inefficient:** If `s` has length `n`, and both `a` and `b` appear roughly `n` times, the nested loops give us O(n²) time complexity. For large strings, this becomes prohibitively slow.

## Optimized Approach

The optimization comes from two key observations:

1. **Finding pattern occurrences efficiently:** We can use built-in string search or implement KMP algorithm for O(n) pattern matching instead of O(n·m) naive checking.

2. **Checking proximity efficiently:** Once we have sorted lists of indices for both patterns, we don't need to check every pair. For each `a` index, we only need to know if there's a `b` index in the range `[i-k, i+k]`. Since both lists are sorted, we can use binary search to check this in O(log n) time per `a` index.

The optimal approach:

- Use efficient string searching (like Python's `str.find()` with start parameter) to find all occurrences of both patterns
- For each `a` index, binary search the `b` indices to find if any falls within `[i-k, i+k]`

## Optimal Solution

<div class="code-group">

```python
# Time: O(n + m + p*log(q)) where n = len(s), m = len(a)+len(b),
#       p = # of a occurrences, q = # of b occurrences
# Space: O(p + q) for storing indices
def beautifulIndices(s: str, a: str, b: str, k: int):
    """
    Find all beautiful indices in s where:
    1. a appears starting at index i
    2. There exists j where b appears starting at index j and |i-j| <= k
    """
    indices_a = []
    indices_b = []

    # Step 1: Find all starting indices of pattern a in s
    # Using str.find() with start parameter for efficient searching
    start = 0
    while True:
        # Find next occurrence of a starting from 'start'
        idx = s.find(a, start)
        if idx == -1:  # No more occurrences
            break
        indices_a.append(idx)
        start = idx + 1  # Move start to next position

    # Step 2: Find all starting indices of pattern b in s
    start = 0
    while True:
        idx = s.find(b, start)
        if idx == -1:  # No more occurrences
            break
        indices_b.append(idx)
        start = idx + 1

    # If no b indices exist, no a index can be beautiful
    if not indices_b:
        return []

    result = []

    # Step 3: For each a index, check if any b index is within k distance
    for i in indices_a:
        # Binary search to find the first b index >= i-k
        left, right = 0, len(indices_b) - 1
        first_possible = -1

        while left <= right:
            mid = (left + right) // 2
            if indices_b[mid] >= i - k:
                first_possible = mid
                right = mid - 1
            else:
                left = mid + 1

        # Check if we found a b index and if it's within i+k
        if first_possible != -1 and indices_b[first_possible] <= i + k:
            result.append(i)

    return result
```

```javascript
// Time: O(n + m + p*log(q)) | Space: O(p + q)
function beautifulIndices(s, a, b, k) {
  const indicesA = [];
  const indicesB = [];

  // Step 1: Find all occurrences of pattern a
  let start = 0;
  while (true) {
    const idx = s.indexOf(a, start);
    if (idx === -1) break;
    indicesA.push(idx);
    start = idx + 1; // Search from next position
  }

  // Step 2: Find all occurrences of pattern b
  start = 0;
  while (true) {
    const idx = s.indexOf(b, start);
    if (idx === -1) break;
    indicesB.push(idx);
    start = idx + 1;
  }

  // If no b indices, no a index can be beautiful
  if (indicesB.length === 0) {
    return [];
  }

  const result = [];

  // Step 3: Check each a index for nearby b index
  for (const i of indicesA) {
    // Binary search for first b index >= i-k
    let left = 0,
      right = indicesB.length - 1;
    let firstPossible = -1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (indicesB[mid] >= i - k) {
        firstPossible = mid;
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }

    // Check if found b index is within i+k
    if (firstPossible !== -1 && indicesB[firstPossible] <= i + k) {
      result.push(i);
    }
  }

  return result;
}
```

```java
// Time: O(n + m + p*log(q)) | Space: O(p + q)
import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<Integer> beautifulIndices(String s, String a, String b, int k) {
        List<Integer> indicesA = new ArrayList<>();
        List<Integer> indicesB = new ArrayList<>();

        // Step 1: Find all occurrences of pattern a
        int start = 0;
        while (true) {
            int idx = s.indexOf(a, start);
            if (idx == -1) break;
            indicesA.add(idx);
            start = idx + 1;  // Continue searching from next position
        }

        // Step 2: Find all occurrences of pattern b
        start = 0;
        while (true) {
            int idx = s.indexOf(b, start);
            if (idx == -1) break;
            indicesB.add(idx);
            start = idx + 1;
        }

        // If no b indices, no a index can be beautiful
        if (indicesB.isEmpty()) {
            return new ArrayList<>();
        }

        List<Integer> result = new ArrayList<>();

        // Step 3: For each a index, check if any b index is within k distance
        for (int i : indicesA) {
            // Binary search for first b index >= i-k
            int left = 0, right = indicesB.size() - 1;
            int firstPossible = -1;

            while (left <= right) {
                int mid = left + (right - left) / 2;
                if (indicesB.get(mid) >= i - k) {
                    firstPossible = mid;
                    right = mid - 1;
                } else {
                    left = mid + 1;
                }
            }

            // Check if found b index is within i+k
            if (firstPossible != -1 && indicesB.get(firstPossible) <= i + k) {
                result.add(i);
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- Finding all `a` indices: O(n) where n = len(s), using efficient string search
- Finding all `b` indices: O(n)
- For each of p `a` indices, binary search over q `b` indices: O(p log q)
- **Total:** O(n + p log q)

**Space Complexity:**

- Storing p `a` indices: O(p)
- Storing q `b` indices: O(q)
- **Total:** O(p + q)

In the worst case where patterns are single characters, p ≈ q ≈ n, giving us O(n log n) time and O(n) space, which is much better than the brute force O(n²).

## Common Mistakes

1. **Off-by-one errors in substring bounds:** When checking `s[i:i+len(a)] == a`, remember Python slicing is exclusive of the end index. In Java/JavaScript, `substring(i, i+len)` includes start but excludes end.

2. **Forgetting to handle empty pattern lists:** If there are no `b` indices, no `a` index can be beautiful. Always check for empty lists before proceeding.

3. **Inefficient proximity checking:** Candidates often use linear scan through `b` indices for each `a` index. The binary search optimization is crucial for good performance.

4. **Incorrect distance calculation:** The problem requires `|i - j| ≤ k`, not `i - j ≤ k`. Some candidates forget the absolute value, which would only check b indices that come after a indices.

## When You'll See This Pattern

This problem combines pattern matching with proximity checking using binary search. You'll see similar patterns in:

1. **"Find All Anagrams in a String" (LeetCode 438)** - Uses sliding window to find pattern occurrences, similar to our pattern matching step.

2. **"Shortest Word Distance" (LeetCode 243)** - Involves finding minimum distance between occurrences of two words in a list, using two pointers on sorted indices.

3. **"Range Module" (LeetCode 715)** - Uses binary search to check range overlaps, similar to our proximity checking with `[i-k, i+k]`.

The core technique of "find all occurrences, then efficiently check relationships between them" appears in many string and array problems.

## Key Takeaways

1. **Separate pattern finding from relationship checking:** First find all relevant indices efficiently, then check relationships between them. This separation often leads to cleaner, more optimized solutions.

2. **Binary search on sorted arrays:** When you have sorted data and need to check for elements in a range, binary search is almost always better than linear scan.

3. **Built-in string functions are often sufficient:** While KMP or Rabin-Karp can be used for pattern matching, built-in functions like `find()` or `indexOf()` are usually efficient enough for interview problems and simpler to implement.

[Practice this problem on CodeJeet](/problem/find-beautiful-indices-in-the-given-array-i)
