---
title: "How to Solve Sum of Imbalance Numbers of All Subarrays — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Sum of Imbalance Numbers of All Subarrays. Hard difficulty, 43.2% acceptance rate. Topics: Array, Hash Table, Enumeration."
date: "2026-06-01"
category: "dsa-patterns"
tags: ["sum-of-imbalance-numbers-of-all-subarrays", "array", "hash-table", "enumeration", "hard"]
---

# How to Solve Sum of Imbalance Numbers of All Subarrays

This problem asks us to sum the "imbalance numbers" of every possible subarray of a given array. The imbalance number of an array is defined as the count of adjacent pairs in its sorted version where the difference between consecutive elements is greater than 1. The challenge lies in efficiently computing this sum for all O(n²) subarrays without explicitly sorting each one, which would be prohibitively slow.

What makes this problem interesting is that it requires a clever counting strategy rather than brute force enumeration. We need to think about how each element contributes to the imbalance count across all subarrays, which involves understanding when an element creates or removes an imbalance gap.

## Visual Walkthrough

Let's trace through a small example: `arr = [1, 3, 2]`

First, let's list all subarrays and compute their imbalance numbers:

1. Subarray `[1]`: Sorted → `[1]`. No adjacent pairs, so imbalance = 0
2. Subarray `[3]`: Sorted → `[3]`. No adjacent pairs, so imbalance = 0
3. Subarray `[2]`: Sorted → `[2]`. No adjacent pairs, so imbalance = 0
4. Subarray `[1, 3]`: Sorted → `[1, 3]`. Adjacent pair: 3-1 = 2 > 1, so imbalance = 1
5. Subarray `[3, 2]`: Sorted → `[2, 3]`. Adjacent pair: 3-2 = 1 (not > 1), so imbalance = 0
6. Subarray `[1, 3, 2]`: Sorted → `[1, 2, 3]`. Adjacent pairs: 2-1 = 1, 3-2 = 1. Neither > 1, so imbalance = 0

Total sum = 0 + 0 + 0 + 1 + 0 + 0 = 1

The key insight is that for each element `arr[i]`, we can determine in which subarrays it creates an imbalance gap with its neighbors in the sorted order. Specifically, when we add `arr[i]` to a subarray, it might:

1. Create a new imbalance gap with the element just smaller than it
2. Create a new imbalance gap with the element just larger than it
3. Remove an existing imbalance gap between two other elements

We need to count these contributions efficiently.

## Brute Force Approach

The most straightforward approach is to generate all subarrays, sort each one, and count the imbalance gaps:

1. Generate all O(n²) subarrays
2. For each subarray, sort it (O(k log k) where k is subarray length)
3. Count adjacent pairs with difference > 1
4. Sum all counts

This gives us O(n³ log n) time complexity, which is far too slow for n up to 1000 (the typical constraint for such problems).

Even if we optimize the sorting by maintaining a sorted structure as we extend subarrays, we'd still have O(n² log n) complexity, which is borderline for n=1000 and likely to time out.

## Optimized Approach

The key insight is that we can compute the total imbalance sum by counting contributions of each element `arr[i]` as the "right endpoint" of subarrays. For each `i`, we consider subarrays ending at position `i`.

For a subarray ending at `i`, when we add `arr[i]` to it:

- If `arr[i]` is between two existing elements `L` and `R` in the sorted order where `L < arr[i] < R`
- And if `R - L > 1` (there was already an imbalance gap between L and R)
- Then adding `arr[i]` might remove this gap by filling it

More precisely, for each `arr[i]`, we look for:

1. The nearest smaller element to the left (if any)
2. The nearest larger element to the left (if any)
3. The nearest smaller element to the right (if any)
4. The nearest larger element to the right (if any)

The imbalance contribution of `arr[i]` depends on these neighbors. We can use a monotonic approach to find these neighbors efficiently.

## Optimal Solution

The optimal solution uses the fact that for each element `arr[i]`, we can determine the range of subarrays where `arr[i]` is the minimum or maximum that creates certain imbalance conditions. We use the "contribution" technique: instead of computing imbalance for each subarray, we count how many times each potential imbalance gap is counted.

Here's the reasoning:

1. For any two elements `arr[i]` and `arr[j]` where `arr[j] = arr[i] + 1`, they will never create an imbalance gap when both are present in a subarray
2. For any two elements `arr[i]` and `arr[j]` where `arr[j] > arr[i] + 1`, they might create an imbalance gap
3. The number of subarrays where `arr[i]` and `arr[j]` are consecutive in sorted order depends on elements between them

The efficient approach: For each element `arr[i]`, find the nearest element to the left and right that has value `arr[i] + 1`. Then, `arr[i]` can create an imbalance with any element larger than `arr[i] + 1` in subarrays that don't contain `arr[i] + 1`.

<div class="code-group">

```python
# Time: O(n^2) | Space: O(1)
def sumImbalanceNumbers(nums):
    """
    Calculate the sum of imbalance numbers of all subarrays.

    The key insight: For each element nums[i], count how many subarrays
    where nums[i] is the smallest element that creates an imbalance gap
    with some larger element.
    """
    n = len(nums)
    total = 0

    # For each starting point of subarray
    for i in range(n):
        # visited will track which numbers we've seen in current subarray
        visited = [False] * (n + 2)  # +2 for 1-indexed and buffer
        visited[nums[i]] = True
        imbalance = 0

        # Extend subarray to the right
        for j in range(i + 1, n):
            x = nums[j]

            # If we haven't seen this number before
            if not visited[x]:
                # By default, adding a new element might create 1 new imbalance
                # (it creates gaps with its neighbors)
                imbalance += 1

                # But check if it fills an existing gap
                if visited[x - 1]:
                    imbalance -= 1  # x connects with x-1
                if visited[x + 1]:
                    imbalance -= 1  # x connects with x+1

                visited[x] = True

            # Add current imbalance for subarray nums[i..j]
            total += imbalance

    return total
```

```javascript
// Time: O(n^2) | Space: O(n)
function sumImbalanceNumbers(nums) {
  /**
   * Calculate the sum of imbalance numbers of all subarrays.
   *
   * We iterate through all starting points i, and extend subarray to the right.
   * We maintain a visited array to track which numbers are in current subarray.
   * When adding a new number, we update the imbalance count accordingly.
   */
  const n = nums.length;
  let total = 0;

  // For each starting point of subarray
  for (let i = 0; i < n; i++) {
    // visited array: index is the number, value is whether it's in subarray
    // We use n+2 size to handle numbers up to n+1 safely
    const visited = new Array(n + 2).fill(false);
    visited[nums[i]] = true;
    let imbalance = 0;

    // Extend subarray to the right
    for (let j = i + 1; j < n; j++) {
      const x = nums[j];

      // If this number is new to the current subarray
      if (!visited[x]) {
        // Adding a new element initially creates 1 imbalance
        imbalance++;

        // But check if it connects with neighbors
        if (visited[x - 1]) {
          imbalance--; // x connects with x-1
        }
        if (visited[x + 1]) {
          imbalance--; // x connects with x+1
        }

        visited[x] = true;
      }

      // Add current imbalance for subarray nums[i..j]
      total += imbalance;
    }
  }

  return total;
}
```

```java
// Time: O(n^2) | Space: O(n)
class Solution {
    public int sumImbalanceNumbers(int[] nums) {
        /**
         * Calculate the sum of imbalance numbers of all subarrays.
         *
         * For each starting index i, we maintain a boolean array to track
         * which numbers are present in the current subarray.
         * As we extend the subarray to the right, we update the imbalance count.
         */
        int n = nums.length;
        int total = 0;

        // For each starting point
        for (int i = 0; i < n; i++) {
            // visited array to track numbers in current subarray
            // n+2 size to safely handle nums[i]+1 without index issues
            boolean[] visited = new boolean[n + 2];
            visited[nums[i]] = true;
            int imbalance = 0;

            // Extend subarray to the right
            for (int j = i + 1; j < n; j++) {
                int x = nums[j];

                // If this number is new to current subarray
                if (!visited[x]) {
                    // New element might create an imbalance
                    imbalance++;

                    // Check if it connects with neighbors
                    if (x > 0 && visited[x - 1]) {
                        imbalance--;  // Connects with x-1
                    }
                    if (x < n + 1 && visited[x + 1]) {
                        imbalance--;  // Connects with x+1
                    }

                    visited[x] = true;
                }

                // Add imbalance for current subarray
                total += imbalance;
            }
        }

        return total;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n²)

- We have an outer loop iterating through all n starting points
- For each starting point, we extend the subarray to the right, which takes O(n) time
- Inside the inner loop, operations are O(1) (array access and simple arithmetic)
- Total: O(n²)

**Space Complexity:** O(n)

- We use a visited array of size n+2 to track which numbers are in the current subarray
- This array is reused for each starting point
- No other significant data structures are used

## Common Mistakes

1. **Forgetting to handle duplicate elements correctly**: When a subarray contains duplicate values, they don't create additional imbalance gaps. Our solution handles this by checking `if (!visited[x])` before processing.

2. **Off-by-one errors with array bounds**: When checking `visited[x-1]` and `visited[x+1]`, we need to ensure we don't access out of bounds. We solve this by making the visited array size n+2 instead of n+1.

3. **Incorrect initialization of imbalance count**: For a single-element subarray, the imbalance should be 0, not 1. Our solution starts with `imbalance = 0` for the starting element alone.

4. **Missing the connection logic**: The trickiest part is realizing that when we add a new element `x`, we need to check both `x-1` and `x+1`. If either exists, `x` connects with it and reduces the imbalance count.

## When You'll See This Pattern

This "contribution technique" where we count how many times each element or pair contributes to the total sum appears in several problems:

1. **Count Subarrays With Median K (Hard)**: Similar idea of counting subarrays where each element contributes to whether K is the median.

2. **Sum of Subarray Minimums (Medium)**: Counts how many subarrays have each element as the minimum, using monotonic stack to find boundaries.

3. **Subarray Sum Equals K (Medium)**: Uses prefix sums and hash maps to count contributions efficiently.

The pattern involves shifting from "compute property for each subarray" to "count how many subarrays have this property for each element/pair."

## Key Takeaways

1. **Think in terms of contributions**: Instead of computing a property for each subarray, count how many subarrays have a certain property involving each element or pair of elements.

2. **Maintain state while extending subarrays**: When iterating through subarrays systematically (like all subarrays ending at position j), maintain relevant state (like which numbers are present) to compute the property incrementally.

3. **Handle boundaries carefully**: Problems involving sorted order and adjacent differences often require careful handling of duplicate values and boundary conditions.

Related problems: [Count Subarrays With Median K](/problem/count-subarrays-with-median-k)
