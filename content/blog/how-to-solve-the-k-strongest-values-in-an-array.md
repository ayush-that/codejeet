---
title: "How to Solve The k Strongest Values in an Array — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode The k Strongest Values in an Array. Medium difficulty, 62.6% acceptance rate. Topics: Array, Two Pointers, Sorting."
date: "2028-09-02"
category: "dsa-patterns"
tags: ["the-k-strongest-values-in-an-array", "array", "two-pointers", "sorting", "medium"]
---

# How to Solve "The k Strongest Values in an Array"

This problem asks us to find the `k` "strongest" values from an array based on their distance from the array's median. The tricky part is that strength isn't just about magnitude—it's defined by absolute distance from the median, with larger numbers breaking ties. This creates an interesting sorting challenge that can be solved efficiently with a two-pointer approach after finding the median.

## Visual Walkthrough

Let's trace through a concrete example: `arr = [1,2,3,4,5]`, `k = 2`.

**Step 1: Find the median (m)**  
First, we need to sort the array: `[1,2,3,4,5]` (already sorted).  
The median is the middle element: `m = arr[(n-1)//2] = arr[2] = 3`.

**Step 2: Understand strength calculation**  
For each element, we calculate `|arr[i] - m|`:

- `|1-3| = 2`
- `|2-3| = 1`
- `|3-3| = 0`
- `|4-3| = 1`
- `|5-3| = 2`

**Step 3: Apply tie-breaking rules**  
When distances are equal, larger values are stronger:

- Both 1 and 5 have distance 2, but 5 > 1, so 5 is stronger than 1
- Both 2 and 4 have distance 1, but 4 > 2, so 4 is stronger than 2

**Step 4: Identify the k strongest**  
Sorted by strength (strongest first): `[5, 1, 4, 2, 3]`  
The 2 strongest are: `[5, 1]`

Notice a pattern: The strongest values will always come from the extremes of the sorted array, alternating between the largest and smallest values. This insight leads us to an efficient two-pointer solution.

## Brute Force Approach

A naive approach would be:

1. Sort the array to find the median
2. Create a new array of tuples `(value, abs(value - median))`
3. Sort this array by distance (descending), then by value (descending) for ties
4. Take the first k values

**Why this is inefficient:**

- Sorting the array: O(n log n)
- Creating and sorting tuples: O(n log n) additional time and O(n) space
- While O(n log n) might be acceptable, we can do better with O(n log n) total and O(k) space

**What candidates might try and fail:**

- Trying to use a heap without proper comparator logic
- Forgetting that the median depends on the sorted array, not just any middle element
- Attempting to calculate strength without first sorting to find the median

## Optimized Approach

The key insight is that after sorting the array:

1. The median is at index `(n-1)//2`
2. The strongest values will come from the extremes
3. We can use two pointers to pick the stronger value between the smallest and largest remaining elements

**Step-by-step reasoning:**

1. **Sort the array** - This gives us two benefits: we can find the median, and we can use two pointers
2. **Find the median** - After sorting, `m = arr[(n-1)//2]`
3. **Initialize two pointers** - `left = 0` (smallest values), `right = n-1` (largest values)
4. **Compare and select** - At each step, compare `|arr[right] - m|` vs `|arr[left] - m|`:
   - If right element has greater distance, it's stronger
   - If distances are equal, right element is stronger (since it's larger)
   - Add the stronger element to result and move the corresponding pointer
5. **Repeat k times** - We need exactly k strongest values

This approach is efficient because:

- One sort: O(n log n)
- Two-pointer selection: O(k)
- Total: O(n log n + k) ≈ O(n log n) since k ≤ n
- Space: O(k) for the result (excluding sort space)

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) for sorting + O(k) for selection = O(n log n)
# Space: O(k) for result (Python sort uses O(n) additional space)
def getStrongest(arr, k):
    """
    Returns the k strongest values in arr.

    Strength is defined by distance from median, with larger values
    breaking ties when distances are equal.
    """
    # Step 1: Sort the array to find median and enable two-pointer approach
    arr.sort()
    n = len(arr)

    # Step 2: Find the median (middle element after sorting)
    # According to problem: m = arr[(n-1)//2]
    median = arr[(n - 1) // 2]

    # Step 3: Initialize two pointers
    # left points to smallest values, right points to largest values
    left, right = 0, n - 1
    result = []

    # Step 4: Select k strongest values using two-pointer comparison
    for _ in range(k):
        # Calculate distances from median for both ends
        left_dist = abs(arr[left] - median)
        right_dist = abs(arr[right] - median)

        # Compare strengths: right element wins if:
        # 1. It has greater distance from median, OR
        # 2. Distances are equal (right element is larger per problem definition)
        if right_dist >= left_dist:
            # Right element is stronger
            result.append(arr[right])
            right -= 1  # Move right pointer inward
        else:
            # Left element is stronger
            result.append(arr[left])
            left += 1   # Move left pointer inward

    return result
```

```javascript
// Time: O(n log n) for sorting + O(k) for selection = O(n log n)
// Space: O(k) for result
/**
 * Returns the k strongest values in arr.
 *
 * Strength is defined by distance from median, with larger values
 * breaking ties when distances are equal.
 */
function getStrongest(arr, k) {
  // Step 1: Sort the array to find median and enable two-pointer approach
  arr.sort((a, b) => a - b);
  const n = arr.length;

  // Step 2: Find the median (middle element after sorting)
  // According to problem: m = arr[(n-1)//2]
  const median = arr[Math.floor((n - 1) / 2)];

  // Step 3: Initialize two pointers
  // left points to smallest values, right points to largest values
  let left = 0,
    right = n - 1;
  const result = [];

  // Step 4: Select k strongest values using two-pointer comparison
  for (let i = 0; i < k; i++) {
    // Calculate distances from median for both ends
    const leftDist = Math.abs(arr[left] - median);
    const rightDist = Math.abs(arr[right] - median);

    // Compare strengths: right element wins if:
    // 1. It has greater distance from median, OR
    // 2. Distances are equal (right element is larger per problem definition)
    if (rightDist >= leftDist) {
      // Right element is stronger
      result.push(arr[right]);
      right--; // Move right pointer inward
    } else {
      // Left element is stronger
      result.push(arr[left]);
      left++; // Move left pointer inward
    }
  }

  return result;
}
```

```java
// Time: O(n log n) for sorting + O(k) for selection = O(n log n)
// Space: O(k) for result (sorting may use O(log n) stack space for primitive arrays)
import java.util.Arrays;

class Solution {
    /**
     * Returns the k strongest values in arr.
     *
     * Strength is defined by distance from median, with larger values
     * breaking ties when distances are equal.
     */
    public int[] getStrongest(int[] arr, int k) {
        // Step 1: Sort the array to find median and enable two-pointer approach
        Arrays.sort(arr);
        int n = arr.length;

        // Step 2: Find the median (middle element after sorting)
        // According to problem: m = arr[(n-1)//2]
        int median = arr[(n - 1) / 2];

        // Step 3: Initialize two pointers
        // left points to smallest values, right points to largest values
        int left = 0, right = n - 1;
        int[] result = new int[k];
        int idx = 0;

        // Step 4: Select k strongest values using two-pointer comparison
        while (idx < k) {
            // Calculate distances from median for both ends
            int leftDist = Math.abs(arr[left] - median);
            int rightDist = Math.abs(arr[right] - median);

            // Compare strengths: right element wins if:
            // 1. It has greater distance from median, OR
            // 2. Distances are equal (right element is larger per problem definition)
            if (rightDist >= leftDist) {
                // Right element is stronger
                result[idx++] = arr[right];
                right--;  // Move right pointer inward
            } else {
                // Left element is stronger
                result[idx++] = arr[left];
                left++;   // Move left pointer inward
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Sorting the array: O(n log n) dominates the time complexity
- Two-pointer selection of k elements: O(k)
- Total: O(n log n + k) = O(n log n) since k ≤ n

**Space Complexity:**

- **Python/JavaScript:** O(n) for the sort algorithm's temporary space (Timsort uses O(n) in worst case)
- **Java:** O(log n) for Arrays.sort() on primitives (uses Dual-Pivot Quicksort)
- **All languages:** O(k) for the result array
- **Total:** O(n) for Python/JavaScript, O(k) for Java (ignoring sort space)

## Common Mistakes

1. **Incorrect median calculation:** Using `arr[n//2]` instead of `arr[(n-1)//2]`. The problem specifically defines the median as the element at index `(n-1)//2` after sorting. For example, with `n=5`, `(5-1)//2 = 2`, which is the middle index.

2. **Forgetting to sort first:** Attempting to find the median without sorting, or trying to use two pointers on an unsorted array. The median definition and two-pointer approach both depend on the array being sorted.

3. **Wrong tie-breaking logic:** When distances are equal, the problem states the larger value is stronger. Some candidates mistakenly think the smaller value should win or forget to handle ties altogether.

4. **Off-by-one in two-pointer movement:** Forgetting to move pointers after selecting an element, or moving the wrong pointer. Always move the pointer whose element was added to the result.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Two-pointer technique on sorted arrays** - Similar to problems like:
   - **Two Sum II** (LeetCode 167): Find two numbers that sum to target in a sorted array
   - **3Sum** (LeetCode 15): Find triplets that sum to zero using sorted array and two pointers
   - **Container With Most Water** (LeetCode 11): Maximize area by moving pointers from both ends

2. **Custom sorting/comparison logic** - Like:
   - **Sort Characters By Frequency** (LeetCode 451): Sort by frequency, then character
   - **Largest Number** (LeetCode 179): Custom comparator for string concatenation

3. **Selection of top k elements** - Similar to:
   - **Top K Frequent Elements** (LeetCode 347): Use heap or bucket sort
   - **K Closest Points to Origin** (LeetCode 973): Sort by distance or use quickselect

## Key Takeaways

1. **When you need "extremes" from a sorted array, think two pointers.** This pattern efficiently selects elements from both ends based on some comparison logic.

2. **Always read problem definitions carefully.** The specific median calculation `(n-1)//2` and tie-breaking rule (larger value wins) are crucial details that affect the solution.

3. **Sorting often enables simpler solutions.** While O(n log n) isn't always optimal, it's frequently acceptable and can transform a complex problem into a straightforward one.

4. **Test with edge cases:** Empty array, k = 0, k = n, all equal values, negative numbers. These reveal bugs in pointer logic and comparisons.

[Practice this problem on CodeJeet](/problem/the-k-strongest-values-in-an-array)
