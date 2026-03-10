---
title: "How to Solve Kth Largest Element in an Array — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Kth Largest Element in an Array. Medium difficulty, 68.8% acceptance rate. Topics: Array, Divide and Conquer, Sorting, Heap (Priority Queue), Quickselect."
date: "2026-03-16"
category: "dsa-patterns"
tags: ["kth-largest-element-in-an-array", "array", "divide-and-conquer", "sorting", "medium"]
---

# How to Solve Kth Largest Element in an Array

Finding the kth largest element in an unsorted array is a classic interview problem that tests your understanding of sorting, heaps, and partitioning algorithms. What makes this problem interesting is the constraint "without sorting" – while you could sort the entire array in O(n log n) time, the optimal solution achieves O(n) average time using a clever divide-and-conquer approach. This problem forces you to think about trade-offs between different data structures and algorithms.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose we have `nums = [3,2,1,5,6,4]` and `k = 2`. We want the 2nd largest element.

**If we sorted the array**: `[1,2,3,4,5,6]`. The 2nd largest element is at position `len(nums) - k = 6 - 2 = 4`, which gives us `5`.

**Without sorting**, we need a smarter approach. One option is to use a min-heap of size k:

1. Start with empty heap
2. Add 3: heap = [3]
3. Add 2: heap = [2,3] (min-heap keeps smallest at root)
4. Add 1: heap = [1,2,3] → but size > k=2, so remove smallest: heap = [2,3]
5. Add 5: heap = [2,3,5] → remove smallest: heap = [3,5]
6. Add 6: heap = [3,5,6] → remove smallest: heap = [5,6]
7. Add 4: heap = [4,5,6] → remove smallest: heap = [5,6]

After processing all elements, the root of the heap (5) is our answer – it's the smallest element in the heap containing the k largest elements, which makes it the kth largest overall.

## Brute Force Approach

The most straightforward solution is to sort the entire array and return the element at position `len(nums) - k`. This works because after sorting in ascending order, the kth largest element will be at index `n-k`.

<div class="code-group">

```python
# Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation
def findKthLargest(nums, k):
    # Sort the entire array
    nums.sort()
    # Return the kth largest element (0-indexed from the end)
    return nums[len(nums) - k]
```

```javascript
// Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation
function findKthLargest(nums, k) {
  // Sort the entire array
  nums.sort((a, b) => a - b);
  // Return the kth largest element (0-indexed from the end)
  return nums[nums.length - k];
}
```

```java
// Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation
public int findKthLargest(int[] nums, int k) {
    // Sort the entire array
    Arrays.sort(nums);
    // Return the kth largest element (0-indexed from the end)
    return nums[nums.length - k];
}
```

</div>

**Why this isn't optimal**: Sorting the entire array takes O(n log n) time, but we only need to find one specific element, not order all of them. This is overkill – we're doing more work than necessary. In an interview, you'd be expected to improve upon this.

## Optimized Approach

We have two main optimized approaches:

### 1. Min-Heap Approach (O(n log k) time, O(k) space)

Maintain a min-heap of size k. As we iterate through the array:

- Add each element to the heap
- If the heap size exceeds k, remove the smallest element (the root)
- After processing all elements, the root contains the kth largest element

Why does this work? The heap always contains the k largest elements seen so far. The smallest of those k elements (at the root) is the kth largest overall.

### 2. Quickselect Approach (O(n) average, O(n²) worst-case, O(1) space)

This is a divide-and-conquer algorithm based on quicksort:

1. Choose a pivot element
2. Partition the array so elements > pivot go left, elements ≤ pivot go right
3. If pivot is at position k-1 (0-indexed from start for kth largest), return it
4. If pivot position > k-1, search in the left partition
5. If pivot position < k-1, search in the right partition

The key insight: We don't need to fully sort the array – we just need to ensure that the kth largest element is in its correct sorted position, with k-1 larger elements to its left.

## Optimal Solution

Here's the most efficient solution using the Quickselect algorithm with randomization to avoid worst-case performance:

<div class="code-group">

```python
# Time: O(n) average, O(n²) worst-case | Space: O(1)
import random

def findKthLargest(nums, k):
    # Convert kth largest to position in sorted array (0-indexed)
    # kth largest means there are k-1 elements larger than it
    k_smallest = len(nums) - k

    def quickselect(left, right):
        # Base case: single element
        if left == right:
            return nums[left]

        # Choose random pivot to avoid worst-case O(n²)
        pivot_index = random.randint(left, right)

        # Move pivot to the end for partitioning
        nums[pivot_index], nums[right] = nums[right], nums[pivot_index]

        # Partition: elements < pivot go left, >= pivot go right
        store_index = left
        for i in range(left, right):
            if nums[i] < nums[right]:  # Compare with pivot at nums[right]
                nums[store_index], nums[i] = nums[i], nums[store_index]
                store_index += 1

        # Move pivot to its final position
        nums[store_index], nums[right] = nums[right], nums[store_index]

        # Check if pivot is at the k_smallest position
        if store_index == k_smallest:
            return nums[store_index]
        elif store_index > k_smallest:
            # Search in left partition
            return quickselect(left, store_index - 1)
        else:
            # Search in right partition
            return quickselect(store_index + 1, right)

    return quickselect(0, len(nums) - 1)
```

```javascript
// Time: O(n) average, O(n²) worst-case | Space: O(1)
function findKthLargest(nums, k) {
  // Convert kth largest to position in sorted array (0-indexed)
  const kSmallest = nums.length - k;

  function quickselect(left, right) {
    // Base case: single element
    if (left === right) {
      return nums[left];
    }

    // Choose random pivot to avoid worst-case O(n²)
    const pivotIndex = Math.floor(Math.random() * (right - left + 1)) + left;

    // Move pivot to the end for partitioning
    [nums[pivotIndex], nums[right]] = [nums[right], nums[pivotIndex]];

    // Partition: elements < pivot go left, >= pivot go right
    let storeIndex = left;
    for (let i = left; i < right; i++) {
      if (nums[i] < nums[right]) {
        // Compare with pivot at nums[right]
        [nums[storeIndex], nums[i]] = [nums[i], nums[storeIndex]];
        storeIndex++;
      }
    }

    // Move pivot to its final position
    [nums[storeIndex], nums[right]] = [nums[right], nums[storeIndex]];

    // Check if pivot is at the kSmallest position
    if (storeIndex === kSmallest) {
      return nums[storeIndex];
    } else if (storeIndex > kSmallest) {
      // Search in left partition
      return quickselect(left, storeIndex - 1);
    } else {
      // Search in right partition
      return quickselect(storeIndex + 1, right);
    }
  }

  return quickselect(0, nums.length - 1);
}
```

```java
// Time: O(n) average, O(n²) worst-case | Space: O(1)
import java.util.Random;

class Solution {
    public int findKthLargest(int[] nums, int k) {
        // Convert kth largest to position in sorted array (0-indexed)
        int kSmallest = nums.length - k;

        return quickselect(nums, 0, nums.length - 1, kSmallest);
    }

    private int quickselect(int[] nums, int left, int right, int kSmallest) {
        // Base case: single element
        if (left == right) {
            return nums[left];
        }

        // Choose random pivot to avoid worst-case O(n²)
        Random random = new Random();
        int pivotIndex = left + random.nextInt(right - left + 1);

        // Move pivot to the end for partitioning
        swap(nums, pivotIndex, right);

        // Partition: elements < pivot go left, >= pivot go right
        int storeIndex = left;
        for (int i = left; i < right; i++) {
            if (nums[i] < nums[right]) {  // Compare with pivot at nums[right]
                swap(nums, storeIndex, i);
                storeIndex++;
            }
        }

        // Move pivot to its final position
        swap(nums, storeIndex, right);

        // Check if pivot is at the kSmallest position
        if (storeIndex == kSmallest) {
            return nums[storeIndex];
        } else if (storeIndex > kSmallest) {
            // Search in left partition
            return quickselect(nums, left, storeIndex - 1, kSmallest);
        } else {
            // Search in right partition
            return quickselect(nums, storeIndex + 1, right, kSmallest);
        }
    }

    private void swap(int[] nums, int i, int j) {
        int temp = nums[i];
        nums[i] = nums[j];
        nums[j] = temp;
    }
}
```

</div>

## Complexity Analysis

**Quickselect Approach:**

- **Time Complexity**: O(n) average case, O(n²) worst case
  - On average, each recursive call processes half the array: n + n/2 + n/4 + ... ≈ 2n = O(n)
  - Worst case occurs when we consistently pick bad pivots (e.g., always smallest/largest element)
  - Randomization ensures worst case is unlikely in practice
- **Space Complexity**: O(1) for iterative implementation, O(log n) average / O(n) worst for recursion stack
  - We modify the array in-place
  - Recursion depth is O(log n) on average

**Min-Heap Approach (alternative):**

- **Time Complexity**: O(n log k)
  - Each heap operation (insert/remove) takes O(log k) time
  - We perform n operations
- **Space Complexity**: O(k)
  - We store at most k elements in the heap

## Common Mistakes

1. **Off-by-one errors with k**: The most common mistake is confusing "kth largest" with array indices. Remember: kth largest means there are k-1 elements larger than it. If you're using sorting, it's at position `n-k`. If using quickselect, convert to `n-k` smallest.

2. **Forgetting to handle duplicate elements**: The problem states "kth largest element in the sorted order, not the kth distinct element." This means duplicates count separately. Your solution must handle arrays with duplicate values correctly.

3. **Not randomizing pivot in quickselect**: Without randomization, if the array is already sorted or reverse sorted, you'll hit the worst-case O(n²) time. Always randomize the pivot selection.

4. **Incorrect heap size management**: When using a min-heap, you need to maintain exactly k elements. If you add all elements first then extract k times, you get O(n log n) time instead of O(n log k). The key is to remove the smallest whenever size exceeds k.

## When You'll See This Pattern

The quickselect pattern appears whenever you need to find the kth smallest/largest element without fully sorting. The min-heap approach is useful for "top k" problems where k is relatively small compared to n.

Related problems:

- **Top K Frequent Elements**: Find k most frequent elements – use a min-heap of size k or quickselect on frequencies
- **Wiggle Sort II**: Requires finding the median (k = n/2 largest), then partitioning elements around it
- **Third Maximum Number**: A special case where k = 3, but with the twist of ignoring duplicates

## Key Takeaways

1. **Quickselect is the optimal theoretical solution** for finding the kth largest/smallest element, achieving O(n) average time by only partially sorting the array around the target position.

2. **Min-heap provides a practical O(n log k) solution** that's easier to implement and works well when k is small relative to n. It's also more predictable than quickselect's randomized performance.

3. **Always consider the trade-offs**: Quickselect has better asymptotic complexity but more complex implementation and worst-case issues. The heap solution is simpler and more robust for small k. In interviews, discuss both approaches and their trade-offs.

Related problems: [Wiggle Sort II](/problem/wiggle-sort-ii), [Top K Frequent Elements](/problem/top-k-frequent-elements), [Third Maximum Number](/problem/third-maximum-number)
