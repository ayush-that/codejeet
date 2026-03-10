---
title: "How to Solve Plates Between Candles — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Plates Between Candles. Medium difficulty, 47.3% acceptance rate. Topics: Array, String, Binary Search, Prefix Sum."
date: "2027-12-05"
category: "dsa-patterns"
tags: ["plates-between-candles", "array", "string", "binary-search", "medium"]
---

# How to Solve Plates Between Candles

You're given a string representing plates (`'*'`) and candles (`'|'`), along with queries that ask: "How many plates are between the nearest candles to the left and right of each query range?" The challenge is answering many queries efficiently—a brute force check for each query would be far too slow. This problem combines prefix sums with binary search to achieve optimal performance.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:**

```
s = "**|**|***|"
queries = [[2,5], [5,9]]
```

**Step 1: Understanding what we need**
For query `[2,5]` (indices 2 through 5 inclusive):

- `s[2:6]` = `"|**|"` (positions 2,3,4,5)
- The leftmost candle within this range is at index 2
- The rightmost candle within this range is at index 5
- We need to count plates between these two candles: indices 3 and 4 → 2 plates

For query `[5,9]` (indices 5 through 9 inclusive):

- `s[5:10]` = `"|***|"` (positions 5,6,7,8,9)
- Leftmost candle: index 5
- Rightmost candle: index 9
- Plates between: indices 6,7,8 → 3 plates

**Step 2: The efficiency challenge**
If we had 100,000 queries and a string of length 100,000, checking each query range character by character would take O(n × q) time—potentially 10 billion operations. We need a way to answer each query in O(log n) or O(1) time.

**Step 3: Key observations**

1. We only care about plates that are between two candles
2. We need to quickly find the nearest candles to any position
3. We need to quickly count plates between any two positions

## Brute Force Approach

The most straightforward approach would be:

1. For each query `[left, right]`, scan from `left` to `right` to find the leftmost candle
2. Scan from `right` to `left` to find the rightmost candle
3. If both candles exist, count plates between them by scanning again

<div class="code-group">

```python
# Time: O(n × q) | Space: O(1)
def platesBetweenCandles_brute(s, queries):
    result = []

    for left, right in queries:
        # Find leftmost candle in range
        left_candle = -1
        for i in range(left, right + 1):
            if s[i] == '|':
                left_candle = i
                break

        # Find rightmost candle in range
        right_candle = -1
        for i in range(right, left - 1, -1):
            if s[i] == '|':
                right_candle = i
                break

        # Count plates between candles
        count = 0
        if left_candle != -1 and right_candle != -1 and left_candle < right_candle:
            for i in range(left_candle + 1, right_candle):
                if s[i] == '*':
                    count += 1

        result.append(count)

    return result
```

```javascript
// Time: O(n × q) | Space: O(1)
function platesBetweenCandlesBrute(s, queries) {
  const result = [];

  for (const [left, right] of queries) {
    // Find leftmost candle in range
    let leftCandle = -1;
    for (let i = left; i <= right; i++) {
      if (s[i] === "|") {
        leftCandle = i;
        break;
      }
    }

    // Find rightmost candle in range
    let rightCandle = -1;
    for (let i = right; i >= left; i--) {
      if (s[i] === "|") {
        rightCandle = i;
        break;
      }
    }

    // Count plates between candles
    let count = 0;
    if (leftCandle !== -1 && rightCandle !== -1 && leftCandle < rightCandle) {
      for (let i = leftCandle + 1; i < rightCandle; i++) {
        if (s[i] === "*") {
          count++;
        }
      }
    }

    result.push(count);
  }

  return result;
}
```

```java
// Time: O(n × q) | Space: O(1)
public int[] platesBetweenCandlesBrute(String s, int[][] queries) {
    int[] result = new int[queries.length];

    for (int q = 0; q < queries.length; q++) {
        int left = queries[q][0];
        int right = queries[q][1];

        // Find leftmost candle in range
        int leftCandle = -1;
        for (int i = left; i <= right; i++) {
            if (s.charAt(i) == '|') {
                leftCandle = i;
                break;
            }
        }

        // Find rightmost candle in range
        int rightCandle = -1;
        for (int i = right; i >= left; i--) {
            if (s.charAt(i) == '|') {
                rightCandle = i;
                break;
            }
        }

        // Count plates between candles
        int count = 0;
        if (leftCandle != -1 && rightCandle != -1 && leftCandle < rightCandle) {
            for (int i = leftCandle + 1; i < rightCandle; i++) {
                if (s.charAt(i) == '*') {
                    count++;
                }
            }
        }

        result[q] = count;
    }

    return result;
}
```

</div>

**Why this fails:** With n = 100,000 and q = 100,000, this could take up to 10 billion operations (100,000 × 100,000), which is far too slow. We need to answer each query in O(1) or O(log n) time.

## Optimized Approach

The key insight is to **preprocess** the string so we can answer queries quickly. We need two pieces of information for each query:

1. **The nearest candle to the right** of any position (to find the left boundary)
2. **The nearest candle to the left** of any position (to find the right boundary)
3. **The cumulative count of plates** up to any position (to calculate plates between boundaries)

**Step-by-step reasoning:**

1. **Prefix sum of plates:** Create an array where `prefix[i]` = number of plates (`'*'`) from index 0 to i inclusive. This lets us calculate plates between any two indices in O(1) time: `plates_between(a, b) = prefix[b] - prefix[a-1]`.

2. **Next candle to the right:** For each position i, what's the index of the next candle to the right (including i itself if it's a candle)? This helps find the left boundary of our range.

3. **Previous candle to the left:** For each position i, what's the index of the previous candle to the left (including i itself if it's a candle)? This helps find the right boundary.

4. **Answering a query:** For query `[left, right]`:
   - Find the actual left boundary = next candle to the right of `left`
   - Find the actual right boundary = previous candle to the left of `right`
   - If left boundary < right boundary, answer = `prefix[right_boundary] - prefix[left_boundary]`
   - Otherwise, answer = 0

## Optimal Solution

We'll precompute three arrays:

- `prefix`: cumulative count of plates
- `nextCandle`: for each position, the index of the next candle to the right
- `prevCandle`: for each position, the index of the previous candle to the left

<div class="code-group">

```python
# Time: O(n + q) | Space: O(n)
def platesBetweenCandles(s, queries):
    n = len(s)

    # Step 1: Build prefix sum of plates
    # prefix[i] = number of plates from index 0 to i inclusive
    prefix = [0] * n
    plates_so_far = 0
    for i in range(n):
        if s[i] == '*':
            plates_so_far += 1
        prefix[i] = plates_so_far

    # Step 2: Build nextCandle array
    # nextCandle[i] = index of next candle to the right (including i)
    nextCandle = [0] * n
    next_candle_idx = -1  # -1 means no candle found yet
    # Process from right to left
    for i in range(n - 1, -1, -1):
        if s[i] == '|':
            next_candle_idx = i
        nextCandle[i] = next_candle_idx

    # Step 3: Build prevCandle array
    # prevCandle[i] = index of previous candle to the left (including i)
    prevCandle = [0] * n
    prev_candle_idx = -1  # -1 means no candle found yet
    # Process from left to right
    for i in range(n):
        if s[i] == '|':
            prev_candle_idx = i
        prevCandle[i] = prev_candle_idx

    # Step 4: Answer queries
    result = []
    for left, right in queries:
        # Find the actual left boundary: next candle to the right of 'left'
        left_boundary = nextCandle[left]
        # Find the actual right boundary: previous candle to the left of 'right'
        right_boundary = prevCandle[right]

        # If either boundary doesn't exist or left_boundary >= right_boundary, answer is 0
        if left_boundary == -1 or right_boundary == -1 or left_boundary >= right_boundary:
            result.append(0)
        else:
            # Count plates between boundaries using prefix sums
            # plates = plates up to right_boundary - plates up to (left_boundary - 1)
            plates_between = prefix[right_boundary] - (prefix[left_boundary - 1] if left_boundary > 0 else 0)
            result.append(plates_between)

    return result
```

```javascript
// Time: O(n + q) | Space: O(n)
function platesBetweenCandles(s, queries) {
  const n = s.length;

  // Step 1: Build prefix sum of plates
  // prefix[i] = number of plates from index 0 to i inclusive
  const prefix = new Array(n).fill(0);
  let platesSoFar = 0;
  for (let i = 0; i < n; i++) {
    if (s[i] === "*") {
      platesSoFar++;
    }
    prefix[i] = platesSoFar;
  }

  // Step 2: Build nextCandle array
  // nextCandle[i] = index of next candle to the right (including i)
  const nextCandle = new Array(n).fill(-1);
  let nextCandleIdx = -1; // -1 means no candle found yet
  // Process from right to left
  for (let i = n - 1; i >= 0; i--) {
    if (s[i] === "|") {
      nextCandleIdx = i;
    }
    nextCandle[i] = nextCandleIdx;
  }

  // Step 3: Build prevCandle array
  // prevCandle[i] = index of previous candle to the left (including i)
  const prevCandle = new Array(n).fill(-1);
  let prevCandleIdx = -1; // -1 means no candle found yet
  // Process from left to right
  for (let i = 0; i < n; i++) {
    if (s[i] === "|") {
      prevCandleIdx = i;
    }
    prevCandle[i] = prevCandleIdx;
  }

  // Step 4: Answer queries
  const result = [];
  for (const [left, right] of queries) {
    // Find the actual left boundary: next candle to the right of 'left'
    const leftBoundary = nextCandle[left];
    // Find the actual right boundary: previous candle to the left of 'right'
    const rightBoundary = prevCandle[right];

    // If either boundary doesn't exist or leftBoundary >= rightBoundary, answer is 0
    if (leftBoundary === -1 || rightBoundary === -1 || leftBoundary >= rightBoundary) {
      result.push(0);
    } else {
      // Count plates between boundaries using prefix sums
      // plates = plates up to rightBoundary - plates up to (leftBoundary - 1)
      const platesBetween =
        prefix[rightBoundary] - (leftBoundary > 0 ? prefix[leftBoundary - 1] : 0);
      result.push(platesBetween);
    }
  }

  return result;
}
```

```java
// Time: O(n + q) | Space: O(n)
public int[] platesBetweenCandles(String s, int[][] queries) {
    int n = s.length();

    // Step 1: Build prefix sum of plates
    // prefix[i] = number of plates from index 0 to i inclusive
    int[] prefix = new int[n];
    int platesSoFar = 0;
    for (int i = 0; i < n; i++) {
        if (s.charAt(i) == '*') {
            platesSoFar++;
        }
        prefix[i] = platesSoFar;
    }

    // Step 2: Build nextCandle array
    // nextCandle[i] = index of next candle to the right (including i)
    int[] nextCandle = new int[n];
    int nextCandleIdx = -1;  // -1 means no candle found yet
    // Process from right to left
    for (int i = n - 1; i >= 0; i--) {
        if (s.charAt(i) == '|') {
            nextCandleIdx = i;
        }
        nextCandle[i] = nextCandleIdx;
    }

    // Step 3: Build prevCandle array
    // prevCandle[i] = index of previous candle to the left (including i)
    int[] prevCandle = new int[n];
    int prevCandleIdx = -1;  // -1 means no candle found yet
    // Process from left to right
    for (int i = 0; i < n; i++) {
        if (s.charAt(i) == '|') {
            prevCandleIdx = i;
        }
        prevCandle[i] = prevCandleIdx;
    }

    // Step 4: Answer queries
    int[] result = new int[queries.length];
    for (int q = 0; q < queries.length; q++) {
        int left = queries[q][0];
        int right = queries[q][1];

        // Find the actual left boundary: next candle to the right of 'left'
        int leftBoundary = nextCandle[left];
        // Find the actual right boundary: previous candle to the left of 'right'
        int rightBoundary = prevCandle[right];

        // If either boundary doesn't exist or leftBoundary >= rightBoundary, answer is 0
        if (leftBoundary == -1 || rightBoundary == -1 || leftBoundary >= rightBoundary) {
            result[q] = 0;
        } else {
            // Count plates between boundaries using prefix sums
            // plates = plates up to rightBoundary - plates up to (leftBoundary - 1)
            int platesBetween = prefix[rightBoundary] - (leftBoundary > 0 ? prefix[leftBoundary - 1] : 0);
            result[q] = platesBetween;
        }
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n + q)

- **O(n)** to build the three preprocessing arrays (prefix, nextCandle, prevCandle)
- **O(q)** to answer all queries (each query takes O(1) time after preprocessing)
- Total: O(n + q), which is optimal since we need to at least read the input

**Space Complexity:** O(n)

- We store three arrays of size n: prefix, nextCandle, and prevCandle
- The output array of size q is not counted in auxiliary space complexity

## Common Mistakes

1. **Forgetting to check if boundaries exist:** If `nextCandle[left]` or `prevCandle[right]` returns -1 (no candle found), you must return 0. Many candidates forget this edge case.

2. **Off-by-one errors in prefix sum calculation:** When calculating plates between `left_boundary` and `right_boundary`, remember it's `prefix[right] - prefix[left-1]`, not `prefix[right] - prefix[left]`. The latter would exclude the plate at position `left` if it's a plate.

3. **Incorrect boundary conditions:** Some candidates use `left_boundary > right_boundary` instead of `left_boundary >= right_boundary`. If they're equal, there are no plates between them, so the answer should be 0.

4. **Building arrays in the wrong direction:** `nextCandle` must be built from right to left (so each position knows about candles to its right), while `prevCandle` must be built from left to right. Mixing these up gives incorrect results.

## When You'll See This Pattern

This problem combines **prefix sums** with **nearest element search**, a pattern that appears in many interview problems:

1. **Find First and Last Position of Element in Sorted Array (LeetCode 34):** Uses binary search to find boundaries, similar to how we find candle boundaries.

2. **Can Make Palindrome from Substring (LeetCode 1177):** Uses prefix sums of character counts to answer substring queries efficiently.

3. **Range Sum Query - Immutable (LeetCode 303):** The classic prefix sum problem that teaches the foundational technique used here.

4. **Number of Subarrays with Bounded Maximum (LeetCode 795):** Uses similar "nearest element" arrays to find boundaries for valid subarrays.

The core pattern is: when you need to answer many range queries on an array, precompute information that lets you answer each query in O(1) or O(log n) time.

## Key Takeaways

1. **Prefix sums transform range queries into point queries:** Instead of counting plates between indices by scanning, we can compute `prefix[right] - prefix[left-1]` in O(1) time.

2. **Preprocessing enables O(1) queries:** When dealing with multiple queries, invest O(n) time upfront to build data structures that make each query fast.

3. **"Nearest element" arrays are versatile:** The `nextCandle` and `prevCandle` arrays solve the "find first candle in range" problem efficiently. This technique works for finding the nearest greater/smaller element, nearest zero, etc.

4. **Always consider edge cases:** Empty ranges, missing boundaries, and equal boundaries can break your solution if not handled carefully.

Related problems: [Find First and Last Position of Element in Sorted Array](/problem/find-first-and-last-position-of-element-in-sorted-array), [Can Make Palindrome from Substring](/problem/can-make-palindrome-from-substring)
