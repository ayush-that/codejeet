---
title: "How to Solve Sum of Subarray Ranges — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Sum of Subarray Ranges. Medium difficulty, 60.8% acceptance rate. Topics: Array, Stack, Monotonic Stack."
date: "2028-08-20"
category: "dsa-patterns"
tags: ["sum-of-subarray-ranges", "array", "stack", "monotonic-stack", "medium"]
---

# How to Solve Sum of Subarray Ranges

This problem asks us to find the sum of all subarray ranges, where the range of a subarray is defined as the difference between its maximum and minimum elements. The challenge comes from the fact that a naive approach would examine all O(n²) subarrays, which is too slow for constraints where n can be up to 1000. The interesting insight is that we can compute the sum of all maximums and sum of all minimums separately using a technique similar to finding the sum of subarray minimums.

## Visual Walkthrough

Let's trace through a small example: `nums = [1, 3, 2]`. We need to find all subarrays and their ranges:

1. Subarray `[1]`: max = 1, min = 1, range = 0
2. Subarray `[3]`: max = 3, min = 3, range = 0
3. Subarray `[2]`: max = 2, min = 2, range = 0
4. Subarray `[1, 3]`: max = 3, min = 1, range = 2
5. Subarray `[3, 2]`: max = 3, min = 2, range = 1
6. Subarray `[1, 3, 2]`: max = 3, min = 1, range = 2

Sum of ranges = 0 + 0 + 0 + 2 + 1 + 2 = 5

Notice that we can also compute this as: (sum of all subarray maximums) - (sum of all subarray minimums). Let's verify:

Sum of maximums: 1 + 3 + 2 + 3 + 3 + 3 = 15  
Sum of minimums: 1 + 3 + 2 + 1 + 2 + 1 = 10  
Difference: 15 - 10 = 5 ✓

This observation is key: instead of computing ranges directly, we can find how many times each element appears as a maximum or minimum across all subarrays.

## Brute Force Approach

The most straightforward solution is to generate all subarrays and compute their ranges directly:

1. Iterate through all possible starting indices `i` from 0 to n-1
2. For each `i`, iterate through all ending indices `j` from i to n-1
3. For each subarray `nums[i..j]`, find the maximum and minimum
4. Add their difference to a running total

This approach has O(n³) time complexity if we naively find max/min for each subarray, or O(n²) if we track them as we expand `j`. Even O(n²) is too slow for n up to 1000 (1,000,000 operations is borderline but might pass, but the problem is designed to teach a more efficient approach).

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def subArrayRangesBrute(nums):
    n = len(nums)
    total = 0

    for i in range(n):
        # Initialize min and max for subarrays starting at i
        curr_min = nums[i]
        curr_max = nums[i]

        for j in range(i, n):
            # Update min and max as we expand the subarray
            curr_min = min(curr_min, nums[j])
            curr_max = max(curr_max, nums[j])

            # Add the range of current subarray
            total += curr_max - curr_min

    return total
```

```javascript
// Time: O(n²) | Space: O(1)
function subArrayRangesBrute(nums) {
  const n = nums.length;
  let total = 0;

  for (let i = 0; i < n; i++) {
    // Initialize min and max for subarrays starting at i
    let currMin = nums[i];
    let currMax = nums[i];

    for (let j = i; j < n; j++) {
      // Update min and max as we expand the subarray
      currMin = Math.min(currMin, nums[j]);
      currMax = Math.max(currMax, nums[j]);

      // Add the range of current subarray
      total += currMax - currMin;
    }
  }

  return total;
}
```

```java
// Time: O(n²) | Space: O(1)
public long subArrayRangesBrute(int[] nums) {
    int n = nums.length;
    long total = 0;

    for (int i = 0; i < n; i++) {
        // Initialize min and max for subarrays starting at i
        int currMin = nums[i];
        int currMax = nums[i];

        for (int j = i; j < n; j++) {
            // Update min and max as we expand the subarray
            currMin = Math.min(currMin, nums[j]);
            currMax = Math.max(currMax, nums[j]);

            // Add the range of current subarray
            total += (currMax - currMin);
        }
    }

    return total;
}
```

</div>

While this O(n²) brute force might pass for smaller constraints, we can do better with an O(n) approach using monotonic stacks.

## Optimized Approach

The key insight is that we can compute:
**Sum of all subarray ranges = (Sum of all subarray maximums) - (Sum of all subarray minimums)**

Now we need to efficiently compute how many times each element appears as a maximum or minimum in all subarrays. For an element at index `i` with value `nums[i]`:

- It is the **maximum** of a subarray if all elements in that subarray are ≤ `nums[i]`
- It is the **minimum** of a subarray if all elements in that subarray are ≥ `nums[i]`

We can find for each element:

- The distance to the **next smaller element** on the left and right (for computing when it's minimum)
- The distance to the **next larger element** on the left and right (for computing when it's maximum)

Using a **monotonic stack**, we can find these boundaries in O(n) time:

- For minimums: use a monotonically increasing stack (smaller elements pop larger ones)
- For maximums: use a monotonically decreasing stack (larger elements pop smaller ones)

For each element `nums[i]`:

- Let `left_min[i]` = number of contiguous elements to the left where `nums[i]` is the minimum
- Let `right_min[i]` = number of contiguous elements to the right where `nums[i]` is the minimum
- Then `nums[i]` contributes to `total_min` as: `nums[i] * left_min[i] * right_min[i]`

Similarly for maximums. The total contribution is the sum over all elements.

## Optimal Solution

We'll implement the monotonic stack approach. Note that we need to be careful with boundaries: when an element has no smaller/larger element to its left/right, we use -1 or n as sentinel values.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def subArrayRanges(nums):
    n = len(nums)
    total = 0

    # Helper function to compute sum of all subarray minimums
    def sum_of_mins(arr):
        n = len(arr)
        # left[i] = index of previous smaller element
        # right[i] = index of next smaller element
        left = [-1] * n
        right = [n] * n
        stack = []

        # Find next smaller element to the right
        for i in range(n):
            # While stack is not empty and current element is smaller than stack top
            while stack and arr[i] < arr[stack[-1]]:
                # For the element at stack top, i is its next smaller element
                idx = stack.pop()
                right[idx] = i
            stack.append(i)

        stack.clear()

        # Find previous smaller element to the left
        for i in range(n-1, -1, -1):
            # While stack is not empty and current element is smaller than stack top
            while stack and arr[i] <= arr[stack[-1]]:
                # For the element at stack top, i is its previous smaller element
                idx = stack.pop()
                left[idx] = i
            stack.append(i)

        # Calculate contribution of each element as minimum
        total_min = 0
        for i in range(n):
            # Number of subarrays where arr[i] is the minimum
            left_count = i - left[i]
            right_count = right[i] - i
            total_min += arr[i] * left_count * right_count

        return total_min

    # Helper function to compute sum of all subarray maximums
    def sum_of_maxs(arr):
        n = len(arr)
        # left[i] = index of previous larger element
        # right[i] = index of next larger element
        left = [-1] * n
        right = [n] * n
        stack = []

        # Find next larger element to the right
        for i in range(n):
            # While stack is not empty and current element is larger than stack top
            while stack and arr[i] > arr[stack[-1]]:
                # For the element at stack top, i is its next larger element
                idx = stack.pop()
                right[idx] = i
            stack.append(i)

        stack.clear()

        # Find previous larger element to the left
        for i in range(n-1, -1, -1):
            # While stack is not empty and current element is larger than stack top
            while stack and arr[i] >= arr[stack[-1]]:
                # For the element at stack top, i is its previous larger element
                idx = stack.pop()
                left[idx] = i
            stack.append(i)

        # Calculate contribution of each element as maximum
        total_max = 0
        for i in range(n):
            # Number of subarrays where arr[i] is the maximum
            left_count = i - left[i]
            right_count = right[i] - i
            total_max += arr[i] * left_count * right_count

        return total_max

    # Total sum of ranges = sum of maximums - sum of minimums
    return sum_of_maxs(nums) - sum_of_mins(nums)
```

```javascript
// Time: O(n) | Space: O(n)
function subArrayRanges(nums) {
  const n = nums.length;

  // Helper function to compute sum of all subarray minimums
  function sumOfMins(arr) {
    const n = arr.length;
    // left[i] = index of previous smaller element
    // right[i] = index of next smaller element
    const left = new Array(n).fill(-1);
    const right = new Array(n).fill(n);
    const stack = [];

    // Find next smaller element to the right
    for (let i = 0; i < n; i++) {
      // While stack is not empty and current element is smaller than stack top
      while (stack.length > 0 && arr[i] < arr[stack[stack.length - 1]]) {
        // For the element at stack top, i is its next smaller element
        const idx = stack.pop();
        right[idx] = i;
      }
      stack.push(i);
    }

    stack.length = 0; // Clear stack

    // Find previous smaller element to the left
    for (let i = n - 1; i >= 0; i--) {
      // While stack is not empty and current element is smaller than stack top
      while (stack.length > 0 && arr[i] <= arr[stack[stack.length - 1]]) {
        // For the element at stack top, i is its previous smaller element
        const idx = stack.pop();
        left[idx] = i;
      }
      stack.push(i);
    }

    // Calculate contribution of each element as minimum
    let totalMin = 0;
    for (let i = 0; i < n; i++) {
      // Number of subarrays where arr[i] is the minimum
      const leftCount = i - left[i];
      const rightCount = right[i] - i;
      totalMin += arr[i] * leftCount * rightCount;
    }

    return totalMin;
  }

  // Helper function to compute sum of all subarray maximums
  function sumOfMaxs(arr) {
    const n = arr.length;
    // left[i] = index of previous larger element
    // right[i] = index of next larger element
    const left = new Array(n).fill(-1);
    const right = new Array(n).fill(n);
    const stack = [];

    // Find next larger element to the right
    for (let i = 0; i < n; i++) {
      // While stack is not empty and current element is larger than stack top
      while (stack.length > 0 && arr[i] > arr[stack[stack.length - 1]]) {
        // For the element at stack top, i is its next larger element
        const idx = stack.pop();
        right[idx] = i;
      }
      stack.push(i);
    }

    stack.length = 0; // Clear stack

    // Find previous larger element to the left
    for (let i = n - 1; i >= 0; i--) {
      // While stack is not empty and current element is larger than stack top
      while (stack.length > 0 && arr[i] >= arr[stack[stack.length - 1]]) {
        // For the element at stack top, i is its previous larger element
        const idx = stack.pop();
        left[idx] = i;
      }
      stack.push(i);
    }

    // Calculate contribution of each element as maximum
    let totalMax = 0;
    for (let i = 0; i < n; i++) {
      // Number of subarrays where arr[i] is the maximum
      const leftCount = i - left[i];
      const rightCount = right[i] - i;
      totalMax += arr[i] * leftCount * rightCount;
    }

    return totalMax;
  }

  // Total sum of ranges = sum of maximums - sum of minimums
  return sumOfMaxs(nums) - sumOfMins(nums);
}
```

```java
// Time: O(n) | Space: O(n)
public long subArrayRanges(int[] nums) {
    int n = nums.length;

    // Helper function to compute sum of all subarray minimums
    long sumOfMins(int[] arr) {
        int n = arr.length;
        // left[i] = index of previous smaller element
        // right[i] = index of next smaller element
        int[] left = new int[n];
        int[] right = new int[n];
        Arrays.fill(left, -1);
        Arrays.fill(right, n);
        Stack<Integer> stack = new Stack<>();

        // Find next smaller element to the right
        for (int i = 0; i < n; i++) {
            // While stack is not empty and current element is smaller than stack top
            while (!stack.isEmpty() && arr[i] < arr[stack.peek()]) {
                // For the element at stack top, i is its next smaller element
                int idx = stack.pop();
                right[idx] = i;
            }
            stack.push(i);
        }

        stack.clear();

        // Find previous smaller element to the left
        for (int i = n - 1; i >= 0; i--) {
            // While stack is not empty and current element is smaller than stack top
            while (!stack.isEmpty() && arr[i] <= arr[stack.peek()]) {
                // For the element at stack top, i is its previous smaller element
                int idx = stack.pop();
                left[idx] = i;
            }
            stack.push(i);
        }

        // Calculate contribution of each element as minimum
        long totalMin = 0;
        for (int i = 0; i < n; i++) {
            // Number of subarrays where arr[i] is the minimum
            long leftCount = i - left[i];
            long rightCount = right[i] - i;
            totalMin += (long) arr[i] * leftCount * rightCount;
        }

        return totalMin;
    }

    // Helper function to compute sum of all subarray maximums
    long sumOfMaxs(int[] arr) {
        int n = arr.length;
        // left[i] = index of previous larger element
        // right[i] = index of next larger element
        int[] left = new int[n];
        int[] right = new int[n];
        Arrays.fill(left, -1);
        Arrays.fill(right, n);
        Stack<Integer> stack = new Stack<>();

        // Find next larger element to the right
        for (int i = 0; i < n; i++) {
            // While stack is not empty and current element is larger than stack top
            while (!stack.isEmpty() && arr[i] > arr[stack.peek()]) {
                // For the element at stack top, i is its next larger element
                int idx = stack.pop();
                right[idx] = i;
            }
            stack.push(i);
        }

        stack.clear();

        // Find previous larger element to the left
        for (int i = n - 1; i >= 0; i--) {
            // While stack is not empty and current element is larger than stack top
            while (!stack.isEmpty() && arr[i] >= arr[stack.peek()]) {
                // For the element at stack top, i is its previous larger element
                int idx = stack.pop();
                left[idx] = i;
            }
            stack.push(i);
        }

        // Calculate contribution of each element as maximum
        long totalMax = 0;
        for (int i = 0; i < n; i++) {
            // Number of subarrays where arr[i] is the maximum
            long leftCount = i - left[i];
            long rightCount = right[i] - i;
            totalMax += (long) arr[i] * leftCount * rightCount;
        }

        return totalMax;
    }

    // Total sum of ranges = sum of maximums - sum of minimums
    return sumOfMaxs(nums) - sumOfMins(nums);
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**  
We make four passes through the array: two for finding boundaries for minimums (using monotonically increasing stack), and two for finding boundaries for maximums (using monotonically decreasing stack). Each element is pushed and popped from the stack at most once, so each pass is O(n).

**Space Complexity: O(n)**  
We use:

- Two arrays of size n for left/right boundaries (for both min and max calculations)
- A stack that can grow up to size n in the worst case (when array is strictly increasing/decreasing)
- Overall O(n) extra space

## Common Mistakes

1. **Off-by-one errors in boundary calculations**: When computing `left_count = i - left[i]` and `right_count = right[i] - i`, remember that these represent the number of positions you can extend the subarray while maintaining the current element as min/max. Test with simple cases like `[1, 1, 1]` where elements are equal.

2. **Handling equal elements incorrectly**: This is the trickiest part. When finding boundaries for minimums, we use `<` for next smaller and `<=` for previous smaller (or vice versa) to avoid double-counting. Similarly for maximums. The pattern is: use strict inequality in one direction and non-strict in the other.

3. **Integer overflow**: The result can be large (up to ~10^11 for n=1000 and values up to 10^9). Use `long` in Java, `BigInt` if needed in JavaScript, and Python handles big integers automatically.

4. **Forgetting to clear the stack between passes**: After finding right boundaries, you need to clear the stack before finding left boundaries. Otherwise, elements from the previous pass will interfere.

## When You'll See This Pattern

The monotonic stack pattern for counting subarrays where an element is extreme (min/max) appears in several LeetCode problems:

1. **Sum of Subarray Minimums (Medium)**: Directly related - this problem asks for just the sum of minimums. Our solution for sum of minimums is exactly the algorithm needed for that problem.

2. **Next Greater Element I (Easy)**: Teaches the basic monotonic stack pattern for finding next larger elements.

3. **Number of Visible People in a Queue (Hard)**: Uses monotonic stack to count how many people each person can see, which involves finding next taller person to the right.

4. **Largest Rectangle in Histogram (Hard)**: Uses similar boundary-finding with monotonic stacks to determine how far a bar can extend while maintaining its height as the minimum.

## Key Takeaways

1. **Decompose complex problems**: The insight that "sum of ranges = sum of maximums - sum of minimums" transforms a difficult problem into two manageable subproblems. Always look for ways to break down problems.

2. **Monotonic stacks for boundary finding**: When you need to find "next smaller/larger element" or count subarrays where an element is extreme, monotonic stacks are often the right tool. They efficiently find boundaries in O(n) time.

3. **Handle equal elements carefully**: The choice between `<` and `<=` (or `>` and `>=`) matters when elements can be equal. Establish a consistent convention (e.g., strict in one direction, non-strict in the other) to avoid double-counting or missing subarrays.

Related problems: [Next Greater Element I](/problem/next-greater-element-i), [Sum of Subarray Minimums](/problem/sum-of-subarray-minimums), [Number of Visible People in a Queue](/problem/number-of-visible-people-in-a-queue)
