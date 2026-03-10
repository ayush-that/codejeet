---
title: "How to Solve Rotate Array — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Rotate Array. Medium difficulty, 44.5% acceptance rate. Topics: Array, Math, Two Pointers."
date: "2026-03-09"
category: "dsa-patterns"
tags: ["rotate-array", "array", "math", "two-pointers", "medium"]
---

# How to Solve Rotate Array

The problem asks us to rotate an array to the right by `k` steps, where `k` is non-negative. This means taking the last `k` elements and moving them to the front while preserving their order, shifting the remaining elements to the right. The tricky part is that `k` can be larger than the array length, and the optimal solution requires a clever three-step reversal technique that many candidates don't immediately recognize.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose we have `nums = [1, 2, 3, 4, 5, 6, 7]` and `k = 3`. Rotating right by 3 steps means the last 3 elements `[5, 6, 7]` should move to the front, and the first 4 elements `[1, 2, 3, 4]` should shift right.

**Step-by-step visualization:**

1. Original array: `[1, 2, 3, 4, 5, 6, 7]`
2. After rotation: `[5, 6, 7, 1, 2, 3, 4]`

Notice that element `7` (originally at index 6) moves to index 2, element `6` (index 5) moves to index 1, and so on. The pattern is: new position = `(old_index + k) % n`, where `n` is the array length.

But here's the key insight: we can achieve this rotation efficiently by reversing parts of the array:

1. Reverse the entire array: `[7, 6, 5, 4, 3, 2, 1]`
2. Reverse the first `k` elements: `[5, 6, 7, 4, 3, 2, 1]`
3. Reverse the remaining `n-k` elements: `[5, 6, 7, 1, 2, 3, 4]`

This three-step reversal gives us exactly what we need!

## Brute Force Approach

The most straightforward approach is to rotate the array one step at a time, repeating `k` times. For each rotation, we save the last element, shift all elements one position to the right, and place the saved element at the front.

**Why this is insufficient:**

- Time complexity is O(n × k) — when `k` is large (especially when `k ≈ n`), this becomes O(n²)
- With constraints like `n = 10⁵` and `k = 10⁵`, this would be far too slow (10¹⁰ operations)
- We're doing repeated work by shifting the entire array multiple times

<div class="code-group">

```python
# Time: O(n × k) | Space: O(1)
def rotate_brute_force(nums, k):
    """
    Rotate array by k steps using repeated one-step rotations.
    This is too slow for large inputs.
    """
    n = len(nums)
    # Handle case where k > n
    k = k % n

    # Repeat k times
    for _ in range(k):
        # Save the last element
        last = nums[-1]

        # Shift all elements one position to the right
        # Must iterate backward to avoid overwriting
        for i in range(n - 1, 0, -1):
            nums[i] = nums[i - 1]

        # Place saved element at the front
        nums[0] = last
```

```javascript
// Time: O(n × k) | Space: O(1)
function rotateBruteForce(nums, k) {
  /**
   * Rotate array by k steps using repeated one-step rotations.
   * This is too slow for large inputs.
   */
  const n = nums.length;
  // Handle case where k > n
  k = k % n;

  // Repeat k times
  for (let step = 0; step < k; step++) {
    // Save the last element
    const last = nums[n - 1];

    // Shift all elements one position to the right
    // Must iterate backward to avoid overwriting
    for (let i = n - 1; i > 0; i--) {
      nums[i] = nums[i - 1];
    }

    // Place saved element at the front
    nums[0] = last;
  }
}
```

```java
// Time: O(n × k) | Space: O(1)
public void rotateBruteForce(int[] nums, int k) {
    /**
     * Rotate array by k steps using repeated one-step rotations.
     * This is too slow for large inputs.
     */
    int n = nums.length;
    // Handle case where k > n
    k = k % n;

    // Repeat k times
    for (int step = 0; step < k; step++) {
        // Save the last element
        int last = nums[n - 1];

        // Shift all elements one position to the right
        // Must iterate backward to avoid overwriting
        for (int i = n - 1; i > 0; i--) {
            nums[i] = nums[i - 1];
        }

        // Place saved element at the front
        nums[0] = last;
    }
}
```

</div>

## Optimized Approach

The key insight is that rotating an array by `k` steps is equivalent to:

1. Taking the last `k` elements and moving them to the front
2. Taking the first `n-k` elements and moving them to the back

We can achieve this efficiently using the **three-step reversal technique**:

1. **Reverse the entire array** — this puts the last `k` elements at the front, but in reverse order
2. **Reverse the first `k` elements** — corrects the order of the elements that came from the end
3. **Reverse the remaining `n-k` elements** — corrects the order of the elements that came from the beginning

**Why this works mathematically:**
Let the array be `A[0...n-1]`. Rotating right by `k` gives us:

- First part: `A[n-k...n-1]` (last k elements)
- Second part: `A[0...n-k-1]` (first n-k elements)

After full reversal: `reverse(A[0...n-1]) = reverse(A[n-k...n-1]) + reverse(A[0...n-k-1])`
After reversing first k: `reverse(reverse(A[n-k...n-1])) + reverse(A[0...n-k-1]) = A[n-k...n-1] + reverse(A[0...n-k-1])`
After reversing last n-k: `A[n-k...n-1] + reverse(reverse(A[0...n-k-1])) = A[n-k...n-1] + A[0...n-k-1]`

Which is exactly the rotated array!

## Optimal Solution

Here's the complete implementation using the three-step reversal technique:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def rotate(nums, k):
    """
    Rotate array to the right by k steps using three-step reversal.

    Args:
        nums: List[int] - array to rotate (modified in-place)
        k: int - number of steps to rotate
    """
    n = len(nums)

    # Handle case where k >= n (rotating by n gives original array)
    k = k % n

    # Edge case: if k is 0 or array has 0 or 1 element, no rotation needed
    if k == 0 or n <= 1:
        return

    # Helper function to reverse a portion of the array
    def reverse(start, end):
        """Reverse elements from index start to end (inclusive)."""
        while start < end:
            # Swap elements at start and end
            nums[start], nums[end] = nums[end], nums[start]
            start += 1
            end -= 1

    # Step 1: Reverse the entire array
    # This puts the last k elements at the front (but reversed)
    reverse(0, n - 1)

    # Step 2: Reverse the first k elements
    # This corrects the order of the elements that came from the end
    reverse(0, k - 1)

    # Step 3: Reverse the remaining n-k elements
    # This corrects the order of the elements that came from the beginning
    reverse(k, n - 1)
```

```javascript
// Time: O(n) | Space: O(1)
function rotate(nums, k) {
  /**
   * Rotate array to the right by k steps using three-step reversal.
   *
   * @param {number[]} nums - array to rotate (modified in-place)
   * @param {number} k - number of steps to rotate
   */
  const n = nums.length;

  // Handle case where k >= n (rotating by n gives original array)
  k = k % n;

  // Edge case: if k is 0 or array has 0 or 1 element, no rotation needed
  if (k === 0 || n <= 1) {
    return;
  }

  // Helper function to reverse a portion of the array
  const reverse = (start, end) => {
    /** Reverse elements from index start to end (inclusive). */
    while (start < end) {
      // Swap elements at start and end
      [nums[start], nums[end]] = [nums[end], nums[start]];
      start++;
      end--;
    }
  };

  // Step 1: Reverse the entire array
  // This puts the last k elements at the front (but reversed)
  reverse(0, n - 1);

  // Step 2: Reverse the first k elements
  // This corrects the order of the elements that came from the end
  reverse(0, k - 1);

  // Step 3: Reverse the remaining n-k elements
  // This corrects the order of the elements that came from the beginning
  reverse(k, n - 1);
}
```

```java
// Time: O(n) | Space: O(1)
public void rotate(int[] nums, int k) {
    /**
     * Rotate array to the right by k steps using three-step reversal.
     *
     * @param nums - array to rotate (modified in-place)
     * @param k - number of steps to rotate
     */
    int n = nums.length;

    // Handle case where k >= n (rotating by n gives original array)
    k = k % n;

    // Edge case: if k is 0 or array has 0 or 1 element, no rotation needed
    if (k == 0 || n <= 1) {
        return;
    }

    // Helper function to reverse a portion of the array
    reverse(nums, 0, n - 1);      // Step 1: Reverse entire array
    reverse(nums, 0, k - 1);      // Step 2: Reverse first k elements
    reverse(nums, k, n - 1);      // Step 3: Reverse remaining n-k elements
}

private void reverse(int[] nums, int start, int end) {
    /** Reverse elements from index start to end (inclusive). */
    while (start < end) {
        // Swap elements at start and end
        int temp = nums[start];
        nums[start] = nums[end];
        nums[end] = temp;
        start++;
        end--;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We reverse the entire array once: O(n)
- We reverse the first k elements: O(k)
- We reverse the remaining n-k elements: O(n-k)
- Total: O(n) + O(k) + O(n-k) = O(2n) = O(n)

**Space Complexity: O(1)**

- We only use a constant amount of extra space for temporary variables (swap operations)
- The reversal is done in-place, modifying the original array

## Common Mistakes

1. **Not handling `k > n`**: When `k` is larger than the array length, rotating by `k` is equivalent to rotating by `k % n`. For example, rotating an array of length 5 by 7 steps is the same as rotating by 2 steps. Always compute `k = k % n` first.

2. **Off-by-one errors in reversal**: When reversing a subarray from index `start` to `end`, the loop condition should be `while start < end`, not `while start <= end`. With `<=`, you'd swap the middle element with itself when the subarray has odd length, which is unnecessary but not wrong. However, with even length, `<=` would cause an extra swap that undoes the previous swap.

3. **Forgetting edge cases**:
   - Empty array or single-element array (nothing to rotate)
   - `k = 0` (no rotation needed)
   - `k = n` (array returns to original state after full rotation)

4. **Using extra space unnecessarily**: Some candidates create a new array of size `n`, copy elements to their new positions, then copy back. While this is O(n) time, it uses O(n) extra space when O(1) space is possible with the reversal technique.

## When You'll See This Pattern

The three-step reversal pattern appears in several array manipulation problems:

1. **Rotate List (LeetCode 61)**: Similar concept but with linked lists instead of arrays. You still need to handle the rotation count modulo length, but the implementation differs due to linked list properties.

2. **Reverse Words in a String II (LeetCode 186)**: First reverse the entire string, then reverse each word individually. This is essentially the same pattern applied to words instead of array segments.

3. **Reverse String (LeetCode 344)**: A simpler version where you just reverse the entire array/string using the same two-pointer swap technique.

4. **Array partitioning problems**: Any problem that requires moving certain elements to one side while preserving order for others can often use similar reversal techniques.

## Key Takeaways

1. **The modulo operation is crucial**: When dealing with circular rotations or indices that wrap around, always use `k % n` to handle cases where the rotation count exceeds the array length.

2. **Reversal is a powerful in-place operation**: The three-step reversal technique allows you to rotate an array in O(n) time with O(1) space. This pattern of reversing segments to achieve a permutation is worth memorizing.

3. **Test edge cases systematically**: Always test with `k = 0`, `k = n`, `k > n`, empty array, single-element array, and arrays with even/odd lengths to catch off-by-one errors.

Related problems: [Rotate List](/problem/rotate-list), [Reverse Words in a String II](/problem/reverse-words-in-a-string-ii), [Make K-Subarray Sums Equal](/problem/make-k-subarray-sums-equal)
