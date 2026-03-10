---
title: "How to Solve Maximum Distance Between a Pair of Values — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Distance Between a Pair of Values. Medium difficulty, 54.3% acceptance rate. Topics: Array, Two Pointers, Binary Search."
date: "2028-04-10"
category: "dsa-patterns"
tags:
  ["maximum-distance-between-a-pair-of-values", "array", "two-pointers", "binary-search", "medium"]
---

# How to Solve Maximum Distance Between a Pair of Values

This problem asks us to find the maximum distance `j - i` where `i <= j`, `nums1[i] <= nums2[j]`, and both arrays are non-increasing. The challenge lies in efficiently finding valid pairs across two arrays while maximizing the distance. A brute force check of all pairs would be too slow, requiring us to leverage the sorted nature of the arrays for optimization.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:**

```
nums1 = [55, 30, 5, 4, 2]
nums2 = [100, 20, 10, 10, 5]
```

We need to find `(i, j)` such that:

1. `i <= j` (index constraint)
2. `nums1[i] <= nums2[j]` (value constraint)
3. `j - i` is maximized

Let's think step by step:

**Step 1:** Start with `i = 0` (nums1[0] = 55)

- Check `j = 0`: 55 ≤ 100 ✓, distance = 0
- Check `j = 1`: 55 ≤ 20 ✗ (arrays are non-increasing, so all later j will have nums2[j] ≤ 20)
- So for i=0, best j=0 gives distance 0

**Step 2:** Move to `i = 1` (nums1[1] = 30)

- Check `j = 1`: 30 ≤ 20 ✗
- Check `j = 2`: 30 ≤ 10 ✗
- Check `j = 3`: 30 ≤ 10 ✗
- Check `j = 4`: 30 ≤ 5 ✗
- No valid j for i=1

**Step 3:** Move to `i = 2` (nums1[2] = 5)

- Check `j = 2`: 5 ≤ 10 ✓, distance = 0
- Check `j = 3`: 5 ≤ 10 ✓, distance = 1
- Check `j = 4`: 5 ≤ 5 ✓, distance = 2
- Best for i=2: distance = 2

**Step 4:** Continue for remaining i values

- i=3 (4): j=4 gives 4 ≤ 5 ✓, distance = 1
- i=4 (2): j=4 gives 2 ≤ 5 ✓, distance = 0

**Maximum distance = 2** from pair (i=2, j=4)

The key insight: For each i, we want to find the largest j (≥ i) where nums1[i] ≤ nums2[j]. Since both arrays are non-increasing, as i increases, the valid j for that i will also increase or stay the same (monotonic property).

## Brute Force Approach

The most straightforward solution checks every possible pair (i, j):

1. For each i from 0 to n-1
2. For each j from i to m-1 (where m = nums2.length)
3. Check if nums1[i] ≤ nums2[j]
4. Track the maximum j - i

<div class="code-group">

```python
# Time: O(n*m) | Space: O(1)
def maxDistance(nums1, nums2):
    max_dist = 0
    n, m = len(nums1), len(nums2)

    for i in range(n):
        for j in range(i, m):
            if nums1[i] <= nums2[j]:
                max_dist = max(max_dist, j - i)

    return max_dist
```

```javascript
// Time: O(n*m) | Space: O(1)
function maxDistance(nums1, nums2) {
  let maxDist = 0;
  const n = nums1.length,
    m = nums2.length;

  for (let i = 0; i < n; i++) {
    for (let j = i; j < m; j++) {
      if (nums1[i] <= nums2[j]) {
        maxDist = Math.max(maxDist, j - i);
      }
    }
  }

  return maxDist;
}
```

```java
// Time: O(n*m) | Space: O(1)
public int maxDistance(int[] nums1, int[] nums2) {
    int maxDist = 0;
    int n = nums1.length, m = nums2.length;

    for (int i = 0; i < n; i++) {
        for (int j = i; j < m; j++) {
            if (nums1[i] <= nums2[j]) {
                maxDist = Math.max(maxDist, j - i);
            }
        }
    }

    return maxDist;
}
```

</div>

**Why this is insufficient:** With n, m up to 10^5, O(n\*m) could be up to 10^10 operations, which is far too slow. We need to leverage the sorted nature of the arrays to do better.

## Optimized Approach

The key insight comes from the **monotonic property** of non-increasing arrays:

1. For a fixed i, as j increases, nums2[j] decreases (non-increasing)
2. For a fixed j, as i increases, nums1[i] decreases (non-increasing)
3. If nums1[i] ≤ nums2[j] for some j, then for i' > i (smaller nums1 value), we might be able to use j' ≥ j

This suggests a **two-pointer approach**:

- Start with i=0, j=0
- For each i, find the largest j (≥ i) where nums1[i] ≤ nums2[j]
- When we move to i+1, we don't need to reset j back to i+1 because:
  - nums1[i+1] ≤ nums1[i] (non-increasing)
  - So if nums1[i] ≤ nums2[j], then nums1[i+1] ≤ nums2[j] might still hold
  - We can continue checking from the current j forward

**Algorithm:**

1. Initialize i=0, j=0, max_dist=0
2. While i < len(nums1) and j < len(nums2):
   - If i > j: increment j to satisfy i ≤ j
   - If nums1[i] ≤ nums2[j]: update max_dist and increment j
   - Else: increment i
3. Return max_dist

## Optimal Solution

Here's the complete implementation using the two-pointer approach:

<div class="code-group">

```python
# Time: O(n + m) | Space: O(1)
def maxDistance(nums1, nums2):
    """
    Find maximum distance j-i where i <= j and nums1[i] <= nums2[j]
    using two-pointer technique.
    """
    i, j = 0, 0
    max_dist = 0
    n, m = len(nums1), len(nums2)

    while i < n and j < m:
        # Ensure i <= j constraint
        if i > j:
            j += 1
            continue

        # Check if current pair is valid
        if nums1[i] <= nums2[j]:
            # Update maximum distance
            max_dist = max(max_dist, j - i)
            # Try to increase j for potentially larger distance
            j += 1
        else:
            # nums1[i] > nums2[j], so increment i to get smaller nums1 value
            i += 1

    return max_dist
```

```javascript
// Time: O(n + m) | Space: O(1)
function maxDistance(nums1, nums2) {
  /**
   * Find maximum distance j-i where i <= j and nums1[i] <= nums2[j]
   * using two-pointer technique.
   */
  let i = 0,
    j = 0;
  let maxDist = 0;
  const n = nums1.length,
    m = nums2.length;

  while (i < n && j < m) {
    // Ensure i <= j constraint
    if (i > j) {
      j++;
      continue;
    }

    // Check if current pair is valid
    if (nums1[i] <= nums2[j]) {
      // Update maximum distance
      maxDist = Math.max(maxDist, j - i);
      // Try to increase j for potentially larger distance
      j++;
    } else {
      // nums1[i] > nums2[j], so increment i to get smaller nums1 value
      i++;
    }
  }

  return maxDist;
}
```

```java
// Time: O(n + m) | Space: O(1)
public int maxDistance(int[] nums1, int[] nums2) {
    /**
     * Find maximum distance j-i where i <= j and nums1[i] <= nums2[j]
     * using two-pointer technique.
     */
    int i = 0, j = 0;
    int maxDist = 0;
    int n = nums1.length, m = nums2.length;

    while (i < n && j < m) {
        // Ensure i <= j constraint
        if (i > j) {
            j++;
            continue;
        }

        // Check if current pair is valid
        if (nums1[i] <= nums2[j]) {
            // Update maximum distance
            maxDist = Math.max(maxDist, j - i);
            // Try to increase j for potentially larger distance
            j++;
        } else {
            // nums1[i] > nums2[j], so increment i to get smaller nums1 value
            i++;
        }
    }

    return maxDist;
}
```

</div>

**Alternative Binary Search Approach:**
For each i, we can binary search in nums2 for the largest j (≥ i) where nums1[i] ≤ nums2[j]. This gives O(n log m) time complexity.

<div class="code-group">

```python
# Time: O(n log m) | Space: O(1)
def maxDistance(nums1, nums2):
    max_dist = 0
    n, m = len(nums1), len(nums2)

    for i in range(n):
        # Binary search for the rightmost j where nums1[i] <= nums2[j]
        left, right = i, m - 1
        while left <= right:
            mid = left + (right - left) // 2
            if nums1[i] <= nums2[mid]:
                max_dist = max(max_dist, mid - i)
                left = mid + 1  # Try for larger j
            else:
                right = mid - 1  # nums2[mid] too small

    return max_dist
```

</div>

The two-pointer approach is generally preferred as it's more efficient (O(n+m) vs O(n log m)) and demonstrates better algorithmic thinking.

## Complexity Analysis

**Two-pointer approach:**

- **Time:** O(n + m) where n = len(nums1), m = len(nums2)
  - Each pointer moves at most n+m times total
  - In worst case, i goes 0→n-1 and j goes 0→m-1
- **Space:** O(1)
  - Only using a few integer variables

**Binary search approach:**

- **Time:** O(n log m)
  - For each of n elements, binary search takes O(log m)
- **Space:** O(1)

## Common Mistakes

1. **Forgetting the i ≤ j constraint:** Some candidates only check nums1[i] ≤ nums2[j] without ensuring i ≤ j. Always validate both conditions.

2. **Resetting j incorrectly in two-pointer approach:** After incrementing i, j should not reset to i+1. The monotonic property means we can continue from current j. Resetting would make the algorithm O(n\*m) again.

3. **Off-by-one errors in binary search:** When implementing binary search, common mistakes include:
   - Using `while left < right` instead of `while left ≤ right`
   - Incorrectly updating left/right bounds
   - Forgetting to check if j ≥ i

4. **Assuming arrays are strictly decreasing:** The problem says "non-increasing," which means values can be equal. Handle equal values correctly in comparisons.

## When You'll See This Pattern

This two-pointer technique on sorted arrays appears in many problems:

1. **Two Sum II - Input Array Is Sorted (LeetCode 167):** Find two numbers that sum to target in a sorted array. Similar two-pointer movement based on comparing sum to target.

2. **Container With Most Water (LeetCode 11):** Maximize area between two lines. Move pointers based on which line is shorter.

3. **3Sum (LeetCode 15):** After sorting, use outer loop + two-pointer technique to find triplets summing to zero.

4. **Merge Sorted Array (LeetCode 88):** Two-pointer technique for merging while maintaining sorted order.

The pattern: When you have sorted data and need to find pairs satisfying some condition, consider if you can move pointers intelligently based on the values.

## Key Takeaways

1. **Leverage sorted properties:** When arrays are sorted (increasing or decreasing), look for monotonic relationships that allow efficient searching. The condition "if valid for (i, j), then likely valid for (i+1, j)" enables two-pointer optimization.

2. **Two-pointer intuition:** If moving one pointer worsens the condition, try moving the other. Here, if nums1[i] > nums2[j], moving j further right makes nums2[j] smaller (worse), so we move i instead.

3. **Consider multiple approaches:** For this problem, both two-pointer (O(n+m)) and binary search (O(n log m)) work. In interviews, mention both and explain why you chose one.

Related problems: [Two Furthest Houses With Different Colors](/problem/two-furthest-houses-with-different-colors)
