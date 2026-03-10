---
title: "How to Solve Element Appearing More Than 25% In Sorted Array — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Element Appearing More Than 25% In Sorted Array. Easy difficulty, 61.1% acceptance rate. Topics: Array."
date: "2028-04-26"
category: "dsa-patterns"
tags: ["element-appearing-more-than-25-in-sorted-array", "array", "easy"]
---

# How to Solve Element Appearing More Than 25% In Sorted Array

You're given a sorted array where exactly one element appears more than 25% of the time. Your task is to find that element. While this might seem straightforward, the sorted nature of the array and the specific 25% threshold create interesting optimization opportunities beyond simple counting.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider the sorted array:  
`[1, 2, 2, 2, 3, 4, 5, 6]` with length 8.

A 25% threshold means we need an element appearing more than `8 × 0.25 = 2` times.  
Visually scanning, we see `2` appears 3 times (indices 1, 2, 3), which is > 2.

Here's the key insight: In a sorted array, if an element appears more than 25% of the time, then one occurrence of that element must be at either:

- Position `i`
- Position `i + n/4`
- Position `i + n/2`
- Position `i + 3n/4`

Why? Because if an element occupies more than a quarter of the array, spreading it evenly would place copies at these quarter points. Even if clustered, at least one copy will land at or cross these quarter boundaries.

Let's test this with our example `[1, 2, 2, 2, 3, 4, 5, 6]`:

- `n = 8`, so `n/4 = 2`
- Check position 0: `arr[0] = 1`
- Check position 2: `arr[2] = 2`
- Check position 4: `arr[4] = 3`
- Check position 6: `arr[6] = 5`

Now for each candidate (1, 2, 3, 5), we find its first and last occurrence:

- For candidate `2`: first occurrence at index 1, last at index 3 → count = 3 → 3 > 2 ✓

This works with just 4 checks instead of examining every element!

## Brute Force Approach

A naive approach would count frequencies for each element until we find one exceeding 25%. Since the array is sorted, we could iterate through and count consecutive identical elements.

**Why this isn't optimal:**

- It requires examining every element in the worst case (O(n) time)
- It doesn't leverage the sorted property beyond counting consecutive elements
- While O(n) might be acceptable, we can do better by examining only 4 positions

However, the brute force approach is still worth understanding as it's a logical first step:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def findSpecialInteger(arr):
    n = len(arr)
    threshold = n // 4

    count = 1
    for i in range(1, n):
        if arr[i] == arr[i-1]:
            count += 1
        else:
            count = 1

        if count > threshold:
            return arr[i]

    return arr[0]  # Edge case: single element array
```

```javascript
// Time: O(n) | Space: O(1)
function findSpecialInteger(arr) {
  const n = arr.length;
  const threshold = Math.floor(n / 4);

  let count = 1;
  for (let i = 1; i < n; i++) {
    if (arr[i] === arr[i - 1]) {
      count++;
    } else {
      count = 1;
    }

    if (count > threshold) {
      return arr[i];
    }
  }

  return arr[0]; // Edge case: single element array
}
```

```java
// Time: O(n) | Space: O(1)
public int findSpecialInteger(int[] arr) {
    int n = arr.length;
    int threshold = n / 4;

    int count = 1;
    for (int i = 1; i < n; i++) {
        if (arr[i] == arr[i-1]) {
            count++;
        } else {
            count = 1;
        }

        if (count > threshold) {
            return arr[i];
        }
    }

    return arr[0];  // Edge case: single element array
}
```

</div>

## Optimal Solution

The optimal solution leverages the sorted property and the 25% threshold. We only need to check elements at positions `0`, `n/4`, `n/2`, and `3n/4`. For each candidate, we find its first and last occurrence using binary search and check if the count exceeds 25%.

**Why this works:**

1. If an element occupies >25% of a sorted array, it must span across at least one quarter boundary
2. By checking elements at quarter points, we guarantee examining the special element
3. Binary search gives us O(log n) bounds for each check

<div class="code-group">

```python
# Time: O(log n) | Space: O(1)
def findSpecialInteger(arr):
    n = len(arr)
    # Positions to check: quarter points in the array
    positions = [n // 4, n // 2, 3 * n // 4]

    for pos in positions:
        # Get candidate element at current quarter position
        candidate = arr[pos]

        # Find first occurrence of candidate using binary search
        left = 0
        right = n - 1
        while left < right:
            mid = left + (right - left) // 2
            if arr[mid] < candidate:
                left = mid + 1
            else:
                right = mid

        first_occurrence = left

        # Find last occurrence of candidate using binary search
        left = 0
        right = n - 1
        while left < right:
            mid = left + (right - left + 1) // 2  # Bias right to avoid infinite loop
            if arr[mid] > candidate:
                right = mid - 1
            else:
                left = mid

        last_occurrence = left

        # Check if candidate appears more than 25% of the time
        if last_occurrence - first_occurrence + 1 > n // 4:
            return candidate

    # In practice, we'll always find it, but return first element as fallback
    return arr[0]
```

```javascript
// Time: O(log n) | Space: O(1)
function findSpecialInteger(arr) {
  const n = arr.length;
  // Positions to check: quarter points in the array
  const positions = [Math.floor(n / 4), Math.floor(n / 2), Math.floor((3 * n) / 4)];

  for (const pos of positions) {
    // Get candidate element at current quarter position
    const candidate = arr[pos];

    // Find first occurrence of candidate using binary search
    let left = 0;
    let right = n - 1;
    while (left < right) {
      const mid = Math.floor(left + (right - left) / 2);
      if (arr[mid] < candidate) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }

    const firstOccurrence = left;

    // Find last occurrence of candidate using binary search
    left = 0;
    right = n - 1;
    while (left < right) {
      const mid = Math.floor(left + (right - left + 1) / 2); // Bias right
      if (arr[mid] > candidate) {
        right = mid - 1;
      } else {
        left = mid;
      }
    }

    const lastOccurrence = left;

    // Check if candidate appears more than 25% of the time
    if (lastOccurrence - firstOccurrence + 1 > Math.floor(n / 4)) {
      return candidate;
    }
  }

  // In practice, we'll always find it, but return first element as fallback
  return arr[0];
}
```

```java
// Time: O(log n) | Space: O(1)
public int findSpecialInteger(int[] arr) {
    int n = arr.length;
    // Positions to check: quarter points in the array
    int[] positions = {n / 4, n / 2, (3 * n) / 4};

    for (int pos : positions) {
        // Get candidate element at current quarter position
        int candidate = arr[pos];

        // Find first occurrence of candidate using binary search
        int left = 0;
        int right = n - 1;
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (arr[mid] < candidate) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }

        int firstOccurrence = left;

        // Find last occurrence of candidate using binary search
        left = 0;
        right = n - 1;
        while (left < right) {
            int mid = left + (right - left + 1) / 2;  // Bias right to avoid infinite loop
            if (arr[mid] > candidate) {
                right = mid - 1;
            } else {
                left = mid;
            }
        }

        int lastOccurrence = left;

        // Check if candidate appears more than 25% of the time
        if (lastOccurrence - firstOccurrence + 1 > n / 4) {
            return candidate;
        }
    }

    // In practice, we'll always find it, but return first element as fallback
    return arr[0];
}
```

</div>

**Simpler Linear Approach (Still O(n) but Cleaner):**
Since n ≤ 10^4, even a linear scan is acceptable. Here's a cleaner linear approach:

<div class="code-group">

```python
# Time: O(n) | Space: O(1) - Simpler approach
def findSpecialInteger(arr):
    n = len(arr)
    threshold = n // 4

    # Only need to check n/4 + 1 positions due to pigeonhole principle
    for i in range(n - threshold):
        if arr[i] == arr[i + threshold]:
            return arr[i]

    return arr[0]
```

```javascript
// Time: O(n) | Space: O(1) - Simpler approach
function findSpecialInteger(arr) {
  const n = arr.length;
  const threshold = Math.floor(n / 4);

  // Only need to check n/4 + 1 positions due to pigeonhole principle
  for (let i = 0; i < n - threshold; i++) {
    if (arr[i] === arr[i + threshold]) {
      return arr[i];
    }
  }

  return arr[0];
}
```

```java
// Time: O(n) | Space: O(1) - Simpler approach
public int findSpecialInteger(int[] arr) {
    int n = arr.length;
    int threshold = n / 4;

    // Only need to check n/4 + 1 positions due to pigeonhole principle
    for (int i = 0; i < n - threshold; i++) {
        if (arr[i] == arr[i + threshold]) {
            return arr[i];
        }
    }

    return arr[0];
}
```

</div>

This simpler approach works because if an element appears more than 25% of the time in a sorted array, then `arr[i]` and `arr[i + n/4]` must be the same for some `i`.

## Complexity Analysis

**Optimal Solution (Binary Search Approach):**

- **Time Complexity:** O(log n)
  - We check 3 positions (n/4, n/2, 3n/4)
  - For each, we perform two binary searches (first and last occurrence)
  - Each binary search takes O(log n) time
  - Total: 3 × 2 × O(log n) = O(log n)

- **Space Complexity:** O(1)
  - We only use a constant amount of extra space for variables

**Simpler Linear Approach:**

- **Time Complexity:** O(n)
  - In the worst case, we check n - n/4 positions
  - Still linear but with a smaller constant factor than full scan

- **Space Complexity:** O(1)
  - Constant extra space

## Common Mistakes

1. **Not handling the "more than 25%" correctly:** The problem says "more than 25%", not "25% or more". If an element appears exactly 25% of the time, it doesn't count. Many candidates use `>= n/4` instead of `> n/4`.

2. **Off-by-one errors in binary search:** When finding the last occurrence, you need to use `mid = left + (right - left + 1) // 2` to bias right. Otherwise, you might get stuck in an infinite loop when `left` and `right` are consecutive.

3. **Checking unnecessary positions:** Some candidates check every position instead of just the quarter points. While this works, it's less efficient and doesn't demonstrate understanding of the optimization.

4. **Forgetting the array is sorted:** The most efficient solutions rely heavily on the sorted property. Candidates who try to use a hash map (which would work on unsorted arrays) miss the opportunity to optimize.

## When You'll See This Pattern

This problem combines two important patterns:

1. **Binary Search for Bounds:** Finding the first and last occurrence of a target in a sorted array is a classic binary search variant. You'll see this in:
   - **"Find First and Last Position of Element in Sorted Array" (LeetCode 34)** - Direct application
   - **"Search Insert Position" (LeetCode 35)** - Simpler version with single position

2. **Pigeonhole Principle with Sorted Arrays:** When you know something about frequency distribution in a sorted array, you can make intelligent guesses about where to look:
   - **"Majority Element" (LeetCode 169)** - Element appearing >50% of the time (can use Boyer-Moore)
   - **"Check If a Number Is Majority Element in a Sorted Array" (LeetCode 1150)** - Similar to this problem

3. **Quarter/Majority Element Problems:** Any problem asking for elements with specific frequency thresholds in sorted arrays uses similar reasoning.

## Key Takeaways

1. **Sorted arrays enable position-based reasoning:** When an array is sorted and you know something about element frequency, you can deduce where those elements must be located. An element occupying >25% of a sorted array must cross quarter boundaries.

2. **Binary search isn't just for finding exact matches:** You can adapt binary search to find boundaries (first/last occurrence), which is often more useful than simple existence checks.

3. **The pigeonhole principle is powerful:** If you have n items and k containers with n > k, at least one container must contain more than n/k items. Here, with 4 quarter-sized containers and an element occupying >25%, it must occupy more than one quarter.

4. **Sometimes simpler is better:** While the binary search solution is theoretically optimal, the linear scan with the `arr[i] == arr[i + n/4]` check is simpler, less error-prone, and still efficient enough for most constraints.

[Practice this problem on CodeJeet](/problem/element-appearing-more-than-25-in-sorted-array)
