---
title: "How to Solve Transform Array by Parity — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Transform Array by Parity. Easy difficulty, 89.7% acceptance rate. Topics: Array, Sorting, Counting."
date: "2027-08-17"
category: "dsa-patterns"
tags: ["transform-array-by-parity", "array", "sorting", "counting", "easy"]
---

# How to Solve Transform Array by Parity

This problem asks us to transform an array by first converting even numbers to 0 and odd numbers to 1, then sorting the resulting array. While the problem seems straightforward, it's interesting because it reveals how we can optimize beyond the obvious approach. The key insight is that after transformation, we only have 0s and 1s, and sorting them simply means putting all 0s before all 1s.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `nums = [3, 1, 2, 4]`.

**Step 1: Replace each even number with 0**

- 3 is odd → stays as is for now (will become 1 in step 2)
- 1 is odd → stays as is for now
- 2 is even → becomes 0
- 4 is even → becomes 0

After step 1: `[3, 1, 0, 0]` (but we haven't converted odds to 1 yet)

**Step 2: Replace each odd number with 1**

- 3 becomes 1
- 1 becomes 1
- 0 stays 0
- 0 stays 0

After step 2: `[1, 1, 0, 0]`

**Step 3: Sort in non-decreasing order**
Sorting `[1, 1, 0, 0]` gives us `[0, 0, 1, 1]`

Final result: `[0, 0, 1, 1]`

Notice something interesting: after transformation, we only have 0s and 1s. Sorting 0s and 1s is equivalent to putting all 0s first, then all 1s. We don't need a full comparison sort!

## Brute Force Approach

The most straightforward approach follows the problem description exactly:

1. Create a new array
2. Iterate through `nums`, replacing evens with 0 and odds with 1
3. Sort the resulting array using a standard sorting algorithm

While this approach works, it's inefficient because:

- We're sorting an array that only contains two distinct values (0 and 1)
- Comparison sorts like quicksort or mergesort take O(n log n) time
- We can do better by recognizing the special structure of our data

Here's what the brute force might look like:

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n) or O(1) depending on implementation
def transformArrayBruteForce(nums):
    # Step 1 & 2: Transform evens to 0, odds to 1
    transformed = []
    for num in nums:
        if num % 2 == 0:
            transformed.append(0)
        else:
            transformed.append(1)

    # Step 3: Sort the transformed array
    transformed.sort()

    return transformed
```

```javascript
// Time: O(n log n) | Space: O(n)
function transformArrayBruteForce(nums) {
  // Step 1 & 2: Transform evens to 0, odds to 1
  const transformed = [];
  for (let num of nums) {
    if (num % 2 === 0) {
      transformed.push(0);
    } else {
      transformed.push(1);
    }
  }

  // Step 3: Sort the transformed array
  transformed.sort((a, b) => a - b);

  return transformed;
}
```

```java
// Time: O(n log n) | Space: O(n)
public int[] transformArrayBruteForce(int[] nums) {
    // Step 1 & 2: Transform evens to 0, odds to 1
    int[] transformed = new int[nums.length];
    for (int i = 0; i < nums.length; i++) {
        if (nums[i] % 2 == 0) {
            transformed[i] = 0;
        } else {
            transformed[i] = 1;
        }
    }

    // Step 3: Sort the transformed array
    Arrays.sort(transformed);

    return transformed;
}
```

</div>

## Optimal Solution

Since we only have two values (0 and 1), we don't need a full O(n log n) sort. We can solve this in O(n) time by counting how many 0s and 1s we have, then building the result array directly.

**Algorithm:**

1. Count how many even numbers are in the original array (these become 0s)
2. Count how many odd numbers are in the original array (these become 1s)
3. Create a result array where the first `even_count` elements are 0, and the remaining elements are 1

This approach is optimal because we only need to:

- Make one pass through the array to count evens/odds (O(n))
- Build the result array in one pass (O(n))

<div class="code-group">

```python
# Time: O(n) | Space: O(n) for the result array
def transformArray(nums):
    # Step 1: Count even numbers (which will become 0s)
    even_count = 0
    for num in nums:
        if num % 2 == 0:
            even_count += 1

    # Step 2: Create result array
    result = [0] * len(nums)  # Initialize with all zeros

    # Step 3: Fill the remaining positions with 1s
    # After even_count zeros, we need to put ones
    for i in range(even_count, len(nums)):
        result[i] = 1

    return result

# Alternative implementation using list multiplication
def transformArrayConcise(nums):
    # Count evens in one line
    even_count = sum(1 for num in nums if num % 2 == 0)

    # Create array with even_count zeros followed by (n - even_count) ones
    return [0] * even_count + [1] * (len(nums) - even_count)
```

```javascript
// Time: O(n) | Space: O(n) for the result array
function transformArray(nums) {
  // Step 1: Count even numbers (which will become 0s)
  let evenCount = 0;
  for (let num of nums) {
    if (num % 2 === 0) {
      evenCount++;
    }
  }

  // Step 2: Create result array filled with zeros
  const result = new Array(nums.length).fill(0);

  // Step 3: Fill the remaining positions with 1s
  // After evenCount zeros, we need to put ones
  for (let i = evenCount; i < nums.length; i++) {
    result[i] = 1;
  }

  return result;
}

// Alternative implementation using array concatenation
function transformArrayConcise(nums) {
  const evenCount = nums.filter((num) => num % 2 === 0).length;
  return [...Array(evenCount).fill(0), ...Array(nums.length - evenCount).fill(1)];
}
```

```java
// Time: O(n) | Space: O(n) for the result array
public int[] transformArray(int[] nums) {
    // Step 1: Count even numbers (which will become 0s)
    int evenCount = 0;
    for (int num : nums) {
        if (num % 2 == 0) {
            evenCount++;
        }
    }

    // Step 2: Create result array
    int[] result = new int[nums.length];

    // Step 3: Fill the array with zeros up to evenCount
    // Arrays are initialized with zeros in Java, so we only need to fill ones
    for (int i = evenCount; i < nums.length; i++) {
        result[i] = 1;
    }

    return result;
}

// Alternative implementation using Arrays.fill
public int[] transformArrayConcise(int[] nums) {
    int evenCount = 0;
    for (int num : nums) {
        if (num % 2 == 0) evenCount++;
    }

    int[] result = new int[nums.length];
    // Fill ones starting from position evenCount
    Arrays.fill(result, evenCount, nums.length, 1);

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make one pass through the array to count even numbers: O(n)
- We create the result array in O(n) time
- Total: O(n) + O(n) = O(n)

**Space Complexity: O(n)**

- We need to store the result array of size n: O(n)
- We use only a constant amount of extra space for counters: O(1)
- Total: O(n) for the output (which is required by the problem)

Note: If we could modify the input array in-place, we could achieve O(1) extra space. However, the problem doesn't specify whether we can modify the input, and typically transformation problems expect a new array.

## Common Mistakes

1. **Forgetting that 0 is even**: Some candidates might write `if num % 2 == 0` but forget that 0 % 2 == 0, so 0 would be correctly classified as even. This is actually correct, but it's worth noting.

2. **Using bitwise AND incorrectly**: Some try to optimize with `num & 1` to check parity. While this works for positive numbers, it can fail for negative numbers in some languages. Stick with `num % 2 == 0` for clarity and correctness across all integers.

3. **Inefficient sorting**: The most common mistake is using a full O(n log n) sort when we only have two values. Always ask yourself: "Do I really need a full sort given the constraints of my data?"

4. **Off-by-one errors when filling the result array**: When building the result, remember that if we have `even_count` zeros, they go in positions `0` to `even_count - 1`, and ones go in positions `even_count` to `n - 1`.

5. **Not handling empty array**: While the problem likely guarantees non-empty input, it's good practice to check: `if not nums: return []`.

## When You'll See This Pattern

This problem demonstrates the **counting sort** pattern for a very small range of values. Counting sort is efficient when you have a limited set of possible values (in this case, just 0 and 1).

Related problems that use similar patterns:

1. **Sort Colors (LeetCode 75)**: Sort an array of 0s, 1s, and 2s in-place. This is the famous Dutch National Flag problem and uses a similar two-pointer approach.

2. **Move Zeroes (LeetCode 283)**: Move all zeros to the end while maintaining the relative order of non-zero elements. While not exactly the same, it involves segregating array elements based on a property.

3. **Partition Array According to Given Pivot (LeetCode 2161)**: Similar segregation problem but with three groups instead of two.

The key insight in all these problems is that when you have a small set of distinct values, you don't need comparison-based sorting.

## Key Takeaways

1. **Always consider the data range**: When sorting or transforming data, check if the limited range of values allows for optimizations beyond general-purpose algorithms.

2. **Counting is often faster than sorting**: For problems with a small fixed set of possible values, counting occurrences and reconstructing the array is usually O(n), beating O(n log n) comparison sorts.

3. **Read between the lines**: The problem says "sort," but with only 0s and 1s, sorting is just segregation. Always think about what the operation really means given your specific data.

This problem may seem simple, but it teaches an important lesson: don't just implement what's asked literally. Think about what the operations actually accomplish given your data constraints.

Related problems: [Odd Even Linked List](/problem/odd-even-linked-list)
