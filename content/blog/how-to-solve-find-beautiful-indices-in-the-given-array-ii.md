---
title: "How to Solve Find Beautiful Indices in the Given Array II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Find Beautiful Indices in the Given Array II. Hard difficulty, 27.6% acceptance rate. Topics: Two Pointers, String, Binary Search, Rolling Hash, String Matching."
date: "2030-01-17"
category: "dsa-patterns"
tags:
  [
    "find-beautiful-indices-in-the-given-array-ii",
    "two-pointers",
    "string",
    "binary-search",
    "hard",
  ]
---

# How to Solve Find Beautiful Indices in the Given Array II

This problem asks us to find all indices `i` in string `s` where substring `a` appears, and there exists some index `j` where substring `b` appears within distance `k` of `i`. The challenge is doing this efficiently when strings can be long (up to 10^5 characters). The "II" version differs from the original by having more flexible distance constraints between `i` and `j`.

What makes this problem interesting is that it combines string matching with range queries. We need to efficiently find all occurrences of two patterns in a text, then check if any occurrence of one pattern is within `k` distance of any occurrence of the other pattern.

## Visual Walkthrough

Let's trace through an example to build intuition:

```
s = "isawsomething"
a = "is"
b = "so"
k = 3
```

We need to find all indices where "is" appears in `s`, then check if there's any "so" occurrence within ±3 positions.

First, find all occurrences of "is":

- At index 0: "is" (s[0:2] = "is")
- At index 5: "is" (s[5:7] = "is")

Now find all occurrences of "so":

- At index 2: "so" (s[2:4] = "so")

Check each "is" occurrence:

1. Index 0: Distance to "so" at index 2 is |0 - 2| = 2 ≤ 3 ✓ (beautiful)
2. Index 5: Distance to "so" at index 2 is |5 - 2| = 3 ≤ 3 ✓ (beautiful)

Result: [0, 5]

The key insight: For each occurrence of `a` at index `i`, we need to check if there's any occurrence of `b` in the range `[i-k, i+k]` (accounting for string lengths). This becomes a range query problem once we have all occurrences.

## Brute Force Approach

A naive solution would:

1. Find all occurrences of `a` in `s` (O(n × len(a)))
2. Find all occurrences of `b` in `s` (O(n × len(b)))
3. For each occurrence `i` of `a`, check all occurrences `j` of `b` to see if `|i - j| ≤ k`

The brute force code would look like:

<div class="code-group">

```python
def beautifulIndices_brute(s, a, b, k):
    n = len(s)
    len_a = len(a)
    len_b = len(b)

    # Find all occurrences of a and b
    a_indices = []
    b_indices = []

    for i in range(n - len_a + 1):
        if s[i:i+len_a] == a:
            a_indices.append(i)

    for i in range(n - len_b + 1):
        if s[i:i+len_b] == b:
            b_indices.append(i)

    # Check each a occurrence
    result = []
    for i in a_indices:
        beautiful = False
        for j in b_indices:
            if abs(i - j) <= k:
                beautiful = True
                break
        if beautiful:
            result.append(i)

    return result
```

```javascript
function beautifulIndicesBrute(s, a, b, k) {
  const n = s.length;
  const lenA = a.length;
  const lenB = b.length;

  // Find all occurrences of a and b
  const aIndices = [];
  const bIndices = [];

  for (let i = 0; i <= n - lenA; i++) {
    if (s.substring(i, i + lenA) === a) {
      aIndices.push(i);
    }
  }

  for (let i = 0; i <= n - lenB; i++) {
    if (s.substring(i, i + lenB) === b) {
      bIndices.push(i);
    }
  }

  // Check each a occurrence
  const result = [];
  for (const i of aIndices) {
    let beautiful = false;
    for (const j of bIndices) {
      if (Math.abs(i - j) <= k) {
        beautiful = true;
        break;
      }
    }
    if (beautiful) {
      result.push(i);
    }
  }

  return result;
}
```

```java
public List<Integer> beautifulIndicesBrute(String s, String a, String b, int k) {
    int n = s.length();
    int lenA = a.length();
    int lenB = b.length();

    // Find all occurrences of a and b
    List<Integer> aIndices = new ArrayList<>();
    List<Integer> bIndices = new ArrayList<>();

    for (int i = 0; i <= n - lenA; i++) {
        if (s.substring(i, i + lenA).equals(a)) {
            aIndices.add(i);
        }
    }

    for (int i = 0; i <= n - lenB; i++) {
        if (s.substring(i, i + lenB).equals(b)) {
            bIndices.add(i);
        }
    }

    // Check each a occurrence
    List<Integer> result = new ArrayList<>();
    for (int i : aIndices) {
        boolean beautiful = false;
        for (int j : bIndices) {
            if (Math.abs(i - j) <= k) {
                beautiful = true;
                break;
            }
        }
        if (beautiful) {
            result.add(i);
        }
    }

    return result;
}
```

</div>

**Why this is too slow:** The nested loops give us O(n × (len(a) + len(b)) + |a_indices| × |b_indices|) time complexity. In the worst case, both patterns could appear O(n) times, giving us O(n²) comparisons. With n up to 10^5, this is far too slow.

## Optimized Approach

The key insight is that once we have sorted lists of indices where `a` and `b` appear, we can use **binary search** to efficiently check if there's any `b` occurrence near each `a` occurrence.

For each occurrence `i` of `a`, we need to check if there's any occurrence `j` of `b` such that `|i - j| ≤ k`. This is equivalent to checking if there's any `b` occurrence in the range `[i-k, i+k]`.

Instead of checking all `b` occurrences, we can:

1. Use binary search to find the first `b` occurrence ≥ `i-k`
2. Check if that occurrence exists and is ≤ `i+k`

This reduces the check from O(|b_indices|) to O(log |b_indices|) per `a` occurrence.

We still need to find all occurrences efficiently. We can use:

- Built-in string searching (KMP-like algorithms) that most languages provide
- Or implement a proper string matching algorithm for educational purposes

The optimized approach:

1. Find all indices where `a` appears in `s` (using efficient string search)
2. Find all indices where `b` appears in `s` (using efficient string search)
3. For each `a` index, use binary search to check if any `b` index is within `k` distance

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n + m + p log p) where n = len(s), m = total occurrences, p = |b_indices|
# Space: O(m) to store the indices
def beautifulIndices(s: str, a: str, b: str, k: int):
    """
    Find all beautiful indices in s where a appears and there's a b
    occurrence within distance k.
    """
    n = len(s)
    len_a = len(a)
    len_b = len(b)

    # Step 1: Find all occurrences of a in s
    a_indices = []
    # We search for a starting at each position
    for i in range(n - len_a + 1):
        if s[i:i+len_a] == a:
            a_indices.append(i)

    # Step 2: Find all occurrences of b in s
    b_indices = []
    for i in range(n - len_b + 1):
        if s[i:i+len_b] == b:
            b_indices.append(i)

    # If no b occurrences exist, no indices can be beautiful
    if not b_indices:
        return []

    result = []

    # Step 3: For each a occurrence, check if any b is within k distance
    for i in a_indices:
        # We need to find if there's any b index in [i-k, i+k]
        # Use binary search to find the first b index >= i-k
        left, right = 0, len(b_indices) - 1
        first_possible = -1

        while left <= right:
            mid = (left + right) // 2
            if b_indices[mid] >= i - k:
                first_possible = mid
                right = mid - 1  # Look for earlier occurrence
            else:
                left = mid + 1

        # Check if we found a b index and if it's within i+k
        if first_possible != -1 and b_indices[first_possible] <= i + k:
            result.append(i)

    return result
```

```javascript
// Time: O(n + m + p log p) where n = s.length, m = total occurrences, p = bIndices.length
// Space: O(m) to store the indices
function beautifulIndices(s, a, b, k) {
  const n = s.length;
  const lenA = a.length;
  const lenB = b.length;

  // Step 1: Find all occurrences of a in s
  const aIndices = [];
  for (let i = 0; i <= n - lenA; i++) {
    if (s.substring(i, i + lenA) === a) {
      aIndices.push(i);
    }
  }

  // Step 2: Find all occurrences of b in s
  const bIndices = [];
  for (let i = 0; i <= n - lenB; i++) {
    if (s.substring(i, i + lenB) === b) {
      bIndices.push(i);
    }
  }

  // If no b occurrences, no indices can be beautiful
  if (bIndices.length === 0) {
    return [];
  }

  const result = [];

  // Step 3: For each a occurrence, check if any b is within k distance
  for (const i of aIndices) {
    // Binary search for first b index >= i-k
    let left = 0;
    let right = bIndices.length - 1;
    let firstPossible = -1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (bIndices[mid] >= i - k) {
        firstPossible = mid;
        right = mid - 1; // Look for earlier occurrence
      } else {
        left = mid + 1;
      }
    }

    // Check if found b index is within i+k
    if (firstPossible !== -1 && bIndices[firstPossible] <= i + k) {
      result.push(i);
    }
  }

  return result;
}
```

```java
// Time: O(n + m + p log p) where n = s.length(), m = total occurrences, p = bIndices.size()
// Space: O(m) to store the indices
public List<Integer> beautifulIndices(String s, String a, String b, int k) {
    int n = s.length();
    int lenA = a.length();
    int lenB = b.length();

    // Step 1: Find all occurrences of a in s
    List<Integer> aIndices = new ArrayList<>();
    for (int i = 0; i <= n - lenA; i++) {
        if (s.substring(i, i + lenA).equals(a)) {
            aIndices.add(i);
        }
    }

    // Step 2: Find all occurrences of b in s
    List<Integer> bIndices = new ArrayList<>();
    for (int i = 0; i <= n - lenB; i++) {
        if (s.substring(i, i + lenB).equals(b)) {
            bIndices.add(i);
        }
    }

    // If no b occurrences, no indices can be beautiful
    if (bIndices.isEmpty()) {
        return new ArrayList<>();
    }

    List<Integer> result = new ArrayList<>();

    // Step 3: For each a occurrence, check if any b is within k distance
    for (int i : aIndices) {
        // Binary search for first b index >= i-k
        int left = 0, right = bIndices.size() - 1;
        int firstPossible = -1;

        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (bIndices.get(mid) >= i - k) {
                firstPossible = mid;
                right = mid - 1; // Look for earlier occurrence
            } else {
                left = mid + 1;
            }
        }

        // Check if found b index is within i+k
        if (firstPossible != -1 && bIndices.get(firstPossible) <= i + k) {
            result.add(i);
        }
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- Finding all `a` occurrences: O(n × len(a)) in worst case, but most languages optimize substring comparison
- Finding all `b` occurrences: O(n × len(b)) similarly
- For each of the O(|a_indices|) occurrences, we do a binary search on b_indices: O(|a_indices| × log|b_indices|)
- Overall: O(n × (len(a) + len(b)) + |a_indices| × log|b_indices|)

**Space Complexity:**

- We store all indices where `a` and `b` appear: O(|a_indices| + |b_indices|)
- In worst case, both could be O(n), so O(n) space
- The result list could also be O(n) in worst case

**Optimization Note:** We could use more advanced string matching algorithms (KMP, Rabin-Karp) to find occurrences in O(n) time instead of O(n × pattern_len), but in practice, built-in string methods are highly optimized and sufficient for most cases.

## Common Mistakes

1. **Off-by-one errors with substring indices:** When checking `s[i:i+len_a]`, remember that Python slicing is exclusive of the end index, while Java's `substring(i, i+len)` is inclusive of start, exclusive of end. JavaScript's `substring` works like Java's.

2. **Forgetting to handle empty b_indices:** If `b` never appears in `s`, no index can be beautiful. Always check this edge case early to avoid unnecessary computation.

3. **Incorrect distance calculation:** The problem requires `|i - j| ≤ k`, but some candidates mistakenly check only `j` in `[i, i+k]` or forget that `j` can be before `i`. The range should be `[i-k, i+k]`.

4. **Inefficient checking of b occurrences:** The most common performance mistake is using linear search through `b_indices` for each `a` occurrence. With binary search, we get O(log n) instead of O(n) per check.

5. **Missing the substring length constraint:** Remember that `i` must satisfy `0 <= i <= s.length - a.length` to have room for the full substring `a`. The same applies to `j` with `b`.

## When You'll See This Pattern

This problem combines several important patterns:

1. **String pattern matching + binary search:** Similar to problems where you need to find occurrences of patterns then perform range queries on the results.
   - Related: [1062. Longest Repeating Substring](https://leetcode.com/problems/longest-repeating-substring/) - uses string matching with binary search on answer
   - Related: [1044. Longest Duplicate Substring](https://leetcode.com/problems/longest-duplicate-substring/) - Rabin-Karp with binary search

2. **Two arrays with distance constraints:** Problems where you have two sorted arrays and need to find pairs within a certain distance.
   - Related: [1539. Kth Missing Positive Number](https://leetcode.com/problems/kth-missing-positive-number/) - binary search on sorted arrays
   - Related: [658. Find K Closest Elements](https://leetcode.com/problems/find-k-closest-elements/) - finding elements within a range in sorted array

3. **Range query problems:** Once you have sorted indices, checking if any value falls in a range is a common pattern.
   - Related: [352. Data Stream as Disjoint Intervals](https://leetcode.com/problems/data-stream-as-disjoint-intervals/) - maintaining and querying sorted intervals

## Key Takeaways

1. **Convert string matching to array processing:** First find all occurrences, then work with the indices as a sorted array. This separates the string matching problem from the geometric/range query problem.

2. **Binary search on sorted arrays for range queries:** When you need to check if any value in a sorted array falls within a range `[L, R]`, use binary search to find the first value ≥ L, then check if it's ≤ R.

3. **Consider edge cases early:** Empty result sets, patterns longer than the string, and patterns that don't appear at all are common edge cases that should be handled upfront.

4. **The "II" version insight:** The main difference from the original problem is the symmetric distance check `|i-j| ≤ k` instead of requiring `j` to be within `[i, i+k]`. This affects the binary search range but not the overall approach.

[Practice this problem on CodeJeet](/problem/find-beautiful-indices-in-the-given-array-ii)
