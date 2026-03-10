---
title: "How to Solve Alternating Groups II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Alternating Groups II. Medium difficulty, 59.9% acceptance rate. Topics: Array, Sliding Window."
date: "2026-07-28"
category: "dsa-patterns"
tags: ["alternating-groups-ii", "array", "sliding-window", "medium"]
---

# How to Solve Alternating Groups II

This problem asks us to count the number of **alternating groups** of length exactly `k` in a circular array of red (0) and blue (1) tiles. An alternating group is defined as consecutive tiles where no two adjacent tiles have the same color. The circular nature means we need to wrap around from the end to the beginning. What makes this problem interesting is combining **circular array handling** with **sliding window** techniques while maintaining alternating property checks efficiently.

## Visual Walkthrough

Let's trace through a concrete example: `colors = [0,1,0,1,0]`, `k = 3`

The circular array has 5 tiles. We need to find all subarrays of length 3 where adjacent colors differ.

**Step 1:** Check positions 0-2: `[0,1,0]`

- 0→1: different ✓
- 1→0: different ✓
- All adjacent pairs differ → This is alternating ✓

**Step 2:** Check positions 1-3: `[1,0,1]`

- 1→0: different ✓
- 0→1: different ✓
- Alternating ✓

**Step 3:** Check positions 2-4: `[0,1,0]`

- 0→1: different ✓
- 1→0: different ✓
- Alternating ✓

**Step 4:** Check positions 3-5 (wrap around): `[1,0,0]`

- 1→0: different ✓
- 0→0: SAME ✗
- Not alternating

**Step 5:** Check positions 4-6 (wrap around): `[0,0,1]`

- 0→0: SAME ✗
- Already fails

Wait, we need to be systematic. Since it's circular, we should check all starting positions 0 through n-1. For position 4, we need tiles 4, 0, 1: `[0,0,1]` (0→0 same, fails). For position 3, we already checked `[1,0,0]`.

Total alternating groups: positions 0, 1, and 2 → **3 groups**.

The key insight: we can't check each group independently in O(k) time each, or we'd have O(nk) complexity. We need a way to quickly determine if a window is alternating as we slide it.

## Brute Force Approach

The straightforward approach is to check every possible starting position in the circular array and verify if the next k tiles form an alternating sequence:

1. For each starting index i from 0 to n-1
2. For each position j from i to i+k-1
3. Compare colors[j % n] with colors[(j+1) % n]
4. If any adjacent pair has the same color, break and move to next i
5. Count all starting positions where all k-1 adjacent comparisons pass

This approach has O(nk) time complexity since for each of n starting positions, we do up to k-1 comparisons. For k up to n, this becomes O(n²), which is too slow for typical constraints (n up to 10⁵).

<div class="code-group">

```python
# Time: O(n*k) | Space: O(1)
def bruteForce(colors, k):
    n = len(colors)
    count = 0

    # Check each possible starting position
    for i in range(n):
        is_alternating = True

        # Check k-1 adjacent pairs in this window
        for j in range(k-1):
            # Use modulo for circular indexing
            idx1 = (i + j) % n
            idx2 = (i + j + 1) % n

            # If any adjacent pair has same color, not alternating
            if colors[idx1] == colors[idx2]:
                is_alternating = False
                break

        if is_alternating:
            count += 1

    return count
```

```javascript
// Time: O(n*k) | Space: O(1)
function bruteForce(colors, k) {
  const n = colors.length;
  let count = 0;

  // Check each possible starting position
  for (let i = 0; i < n; i++) {
    let isAlternating = true;

    // Check k-1 adjacent pairs in this window
    for (let j = 0; j < k - 1; j++) {
      // Use modulo for circular indexing
      const idx1 = (i + j) % n;
      const idx2 = (i + j + 1) % n;

      // If any adjacent pair has same color, not alternating
      if (colors[idx1] === colors[idx2]) {
        isAlternating = false;
        break;
      }
    }

    if (isAlternating) {
      count++;
    }
  }

  return count;
}
```

```java
// Time: O(n*k) | Space: O(1)
public int bruteForce(int[] colors, int k) {
    int n = colors.length;
    int count = 0;

    // Check each possible starting position
    for (int i = 0; i < n; i++) {
        boolean isAlternating = true;

        // Check k-1 adjacent pairs in this window
        for (int j = 0; j < k - 1; j++) {
            // Use modulo for circular indexing
            int idx1 = (i + j) % n;
            int idx2 = (i + j + 1) % n;

            // If any adjacent pair has same color, not alternating
            if (colors[idx1] == colors[idx2]) {
                isAlternating = false;
                break;
            }
        }

        if (isAlternating) {
            count++;
        }
    }

    return count;
}
```

</div>

## Optimized Approach

The key insight is that we can use a **sliding window** approach with a **prefix sum of violations**. Instead of checking all k-1 pairs for each window, we can maintain a running count of "bad pairs" (adjacent tiles with same color) and update it efficiently as we slide the window.

Here's the step-by-step reasoning:

1. **Create a violations array**: For each position i, record if colors[i] == colors[(i+1)%n] (a violation of the alternating property). This is O(n) preprocessing.

2. **Handle circularity**: Since the array is circular, we need to check n + k positions to cover all windows of length k in the circular array.

3. **Use prefix sums**: Build a prefix sum array where prefix[i] = number of violations in positions 0 to i-1. Then the number of violations in window [l, r] is prefix[r+1] - prefix[l].

4. **Slide through all windows**: For each starting position i from 0 to n-1, the window covers positions i to i+k-1. The number of violations in this window tells us if it's alternating (0 violations = alternating).

5. **Efficiency**: Each window check becomes O(1) after O(n) preprocessing, giving us O(n) total time.

The tricky part is handling the circular indices correctly. We need to extend our array conceptually to length n + k to handle wrap-around windows properly.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def numberOfAlternatingGroups(colors, k):
    n = len(colors)

    # Edge case: if k == 1, every single tile forms an alternating group
    # because there are no adjacent pairs to compare
    if k == 1:
        return n

    # Step 1: Create an extended array to handle circular nature
    # We need n + k elements to cover all windows of length k
    extended = colors + colors[:k]

    # Step 2: Create violations array
    # violations[i] = 1 if extended[i] == extended[i+1] (not alternating)
    # violations[i] = 0 if they differ (alternating)
    violations = [0] * (n + k - 1)
    for i in range(n + k - 1):
        if extended[i] == extended[i + 1]:
            violations[i] = 1

    # Step 3: Build prefix sum of violations
    # prefix[i] = sum of violations[0] to violations[i-1]
    prefix = [0] * (n + k)
    for i in range(1, n + k):
        prefix[i] = prefix[i - 1] + violations[i - 1]

    # Step 4: Count windows of length k with 0 violations
    count = 0
    for i in range(n):
        # Window from i to i+k-1 (inclusive)
        # Number of violations in this window = prefix[i+k] - prefix[i]
        window_violations = prefix[i + k] - prefix[i]

        # If no violations in the window, it's alternating
        if window_violations == 0:
            count += 1

    return count
```

```javascript
// Time: O(n) | Space: O(n)
function numberOfAlternatingGroups(colors, k) {
  const n = colors.length;

  // Edge case: if k == 1, every single tile forms an alternating group
  if (k === 1) {
    return n;
  }

  // Step 1: Create an extended array to handle circular nature
  // We need n + k elements to cover all windows of length k
  const extended = [...colors, ...colors.slice(0, k)];

  // Step 2: Create violations array
  // violations[i] = 1 if extended[i] == extended[i+1] (not alternating)
  const violations = new Array(n + k - 1).fill(0);
  for (let i = 0; i < n + k - 1; i++) {
    if (extended[i] === extended[i + 1]) {
      violations[i] = 1;
    }
  }

  // Step 3: Build prefix sum of violations
  // prefix[i] = sum of violations[0] to violations[i-1]
  const prefix = new Array(n + k).fill(0);
  for (let i = 1; i < n + k; i++) {
    prefix[i] = prefix[i - 1] + violations[i - 1];
  }

  // Step 4: Count windows of length k with 0 violations
  let count = 0;
  for (let i = 0; i < n; i++) {
    // Window from i to i+k-1 (inclusive)
    // Number of violations in this window = prefix[i+k] - prefix[i]
    const windowViolations = prefix[i + k] - prefix[i];

    // If no violations in the window, it's alternating
    if (windowViolations === 0) {
      count++;
    }
  }

  return count;
}
```

```java
// Time: O(n) | Space: O(n)
public int numberOfAlternatingGroups(int[] colors, int k) {
    int n = colors.length;

    // Edge case: if k == 1, every single tile forms an alternating group
    if (k == 1) {
        return n;
    }

    // Step 1: Create an extended array to handle circular nature
    // We need n + k elements to cover all windows of length k
    int[] extended = new int[n + k];
    for (int i = 0; i < n; i++) {
        extended[i] = colors[i];
    }
    for (int i = 0; i < k; i++) {
        extended[n + i] = colors[i];
    }

    // Step 2: Create violations array
    // violations[i] = 1 if extended[i] == extended[i+1] (not alternating)
    int[] violations = new int[n + k - 1];
    for (int i = 0; i < n + k - 1; i++) {
        if (extended[i] == extended[i + 1]) {
            violations[i] = 1;
        }
    }

    // Step 3: Build prefix sum of violations
    // prefix[i] = sum of violations[0] to violations[i-1]
    int[] prefix = new int[n + k];
    for (int i = 1; i < n + k; i++) {
        prefix[i] = prefix[i - 1] + violations[i - 1];
    }

    // Step 4: Count windows of length k with 0 violations
    int count = 0;
    for (int i = 0; i < n; i++) {
        // Window from i to i+k-1 (inclusive)
        // Number of violations in this window = prefix[i+k] - prefix[i]
        int windowViolations = prefix[i + k] - prefix[i];

        // If no violations in the window, it's alternating
        if (windowViolations == 0) {
            count++;
        }
    }

    return count;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Creating the extended array: O(n + k) = O(n) since k ≤ n
- Building violations array: O(n + k) = O(n)
- Building prefix sum: O(n + k) = O(n)
- Counting valid windows: O(n)
- Total: O(n)

**Space Complexity: O(n)**

- Extended array: O(n + k) = O(n)
- Violations array: O(n + k) = O(n)
- Prefix sum array: O(n + k) = O(n)
- We could optimize to O(1) extra space by computing violations on the fly, but O(n) is acceptable for clarity

## Common Mistakes

1. **Forgetting the k=1 edge case**: When k=1, every single tile forms a valid alternating group because there are no adjacent pairs to compare. Many candidates return 0 or get index errors here.

2. **Incorrect circular indexing**: Simply using `(i+j) % n` in a nested loop gives O(nk) time. The optimized solution requires proper handling of the extended array to maintain O(n) time.

3. **Off-by-one errors in window boundaries**: When checking a window of length k starting at i, it covers positions i to i+k-1 (inclusive). This means we need to check k-1 adjacent pairs, not k pairs. Getting this wrong leads to incorrect counts.

4. **Not handling wrap-around correctly**: For the last window starting at position n-1, it wraps around to include positions n-1, 0, 1, ... This requires either modular arithmetic or creating an extended array as shown in the solution.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Sliding Window with Prefix Sum**: Similar to problems like:
   - **Subarray Sum Equals K** (LeetCode 560): Uses prefix sum to find subarrays with a target sum
   - **Maximum Points You Can Obtain from Cards** (LeetCode 1423): Uses sliding window on a circular array

2. **Circular Array Problems**: These often require duplicating the array or using modular arithmetic:
   - **Next Greater Element II** (LeetCode 503): Circular version of Next Greater Element
   - **House Robber II** (LeetCode 213): Circular version of House Robber

3. **Alternating Sequence Problems**: Problems that require checking or finding alternating sequences:
   - **Wiggle Subsequence** (LeetCode 376): Find longest alternating subsequence
   - **Remove All Adjacent Duplicates in String** (LeetCode 1047): Remove adjacent identical characters

## Key Takeaways

1. **Prefix sums transform range queries into O(1) operations**: Instead of summing or counting elements in a window repeatedly, precompute prefix sums to answer window queries instantly.

2. **Circular arrays often require extended arrays**: When you need to process all windows in a circular array, creating an array of length 2n or n+k simplifies the logic compared to complex modular arithmetic.

3. **Sliding window problems often have a "violation" or "constraint" count**: Maintaining a count of how many constraints are violated in the current window (like non-alternating pairs) allows efficient window validity checks as you slide.

[Practice this problem on CodeJeet](/problem/alternating-groups-ii)
