---
title: "Array Interview Questions: Patterns and Strategies"
description: "Master Array problems for coding interviews — common patterns, difficulty breakdown, which companies ask them, and study tips."
date: "2026-01-09"
category: "dsa-patterns"
tags: ["array", "dsa", "interview prep"]
---

# Array Interview Questions: Patterns and Strategies

Let me start with a confession: I once bombed an array question in a Google interview. It wasn't some convoluted dynamic programming problem—it was "Maximum Subarray" (LeetCode #53), which I'd solved a dozen times. But under pressure, I overcomplicated it, trying to use a sliding window when the optimal solution was Kadane's algorithm. The interviewer watched me struggle for 15 minutes before gently asking, "Have you considered tracking just the current maximum and global maximum?" That moment taught me that array problems aren't about memorizing solutions; they're about recognizing patterns and applying the right mental model.

Arrays appear in 1625 LeetCode questions—21% easy, 54% medium, 25% hard. They're the most fundamental data structure, yet companies like Google, Amazon, and Meta keep asking them because they reveal how you think about space, time, and edge cases. The array is your canvas; the patterns are your brushes.

## Common Patterns

### 1. Two Pointers

This pattern solves problems where you need to find pairs, remove duplicates, or compare elements from different positions. The intuition: instead of nested loops (O(n²)), use two pointers moving toward each other or in the same direction to achieve O(n) time.

<div class="code-group">

```python
# Two Sum II - Input Array Is Sorted (LeetCode #167)
# Time: O(n) | Space: O(1)
def twoSum(numbers, target):
    left, right = 0, len(numbers) - 1
    while left < right:
        current_sum = numbers[left] + numbers[right]
        if current_sum == target:
            return [left + 1, right + 1]  # 1-indexed
        elif current_sum < target:
            left += 1  # Need larger sum
        else:
            right -= 1  # Need smaller sum
    return []

# Other problems using this pattern:
# - Container With Most Water (#11)
# - Remove Duplicates from Sorted Array (#26)
```

```javascript
// Two Sum II - Input Array Is Sorted (LeetCode #167)
// Time: O(n) | Space: O(1)
function twoSum(numbers, target) {
  let left = 0;
  let right = numbers.length - 1;

  while (left < right) {
    const currentSum = numbers[left] + numbers[right];
    if (currentSum === target) {
      return [left + 1, right + 1]; // 1-indexed
    } else if (currentSum < target) {
      left++; // Need larger sum
    } else {
      right--; // Need smaller sum
    }
  }
  return [];
}

// Other problems using this pattern:
// - Container With Most Water (#11)
// - Remove Duplicates from Sorted Array (#26)
```

```java
// Two Sum II - Input Array Is Sorted (LeetCode #167)
// Time: O(n) | Space: O(1)
public int[] twoSum(int[] numbers, int target) {
    int left = 0;
    int right = numbers.length - 1;

    while (left < right) {
        int currentSum = numbers[left] + numbers[right];
        if (currentSum == target) {
            return new int[]{left + 1, right + 1};  // 1-indexed
        } else if (currentSum < target) {
            left++;  // Need larger sum
        } else {
            right--;  // Need smaller sum
        }
    }
    return new int[]{};
}

// Other problems using this pattern:
// - Container With Most Water (#11)
// - Remove Duplicates from Sorted Array (#26)
```

</div>

### 2. Sliding Window

Use this for subarray/substring problems where you need to find something contiguous. The intuition: maintain a window that satisfies certain conditions, and slide it through the array while updating your answer.

<div class="code-group">

```python
# Maximum Subarray (LeetCode #53) - Kadane's Algorithm variant
# Time: O(n) | Space: O(1)
def maxSubArray(nums):
    max_sum = float('-inf')
    current_sum = 0

    for num in nums:
        # Key insight: either start new subarray or extend current one
        current_sum = max(num, current_sum + num)
        max_sum = max(max_sum, current_sum)

    return max_sum

# Other problems using this pattern:
# - Longest Substring Without Repeating Characters (#3)
# - Minimum Size Subarray Sum (#209)
```

```javascript
// Maximum Subarray (LeetCode #53) - Kadane's Algorithm variant
// Time: O(n) | Space: O(1)
function maxSubArray(nums) {
  let maxSum = -Infinity;
  let currentSum = 0;

  for (const num of nums) {
    // Key insight: either start new subarray or extend current one
    currentSum = Math.max(num, currentSum + num);
    maxSum = Math.max(maxSum, currentSum);
  }

  return maxSum;
}

// Other problems using this pattern:
// - Longest Substring Without Repeating Characters (#3)
// - Minimum Size Subarray Sum (#209)
```

```java
// Maximum Subarray (LeetCode #53) - Kadane's Algorithm variant
// Time: O(n) | Space: O(1)
public int maxSubArray(int[] nums) {
    int maxSum = Integer.MIN_VALUE;
    int currentSum = 0;

    for (int num : nums) {
        // Key insight: either start new subarray or extend current one
        currentSum = Math.max(num, currentSum + num);
        maxSum = Math.max(maxSum, currentSum);
    }

    return maxSum;
}

// Other problems using this pattern:
// - Longest Substring Without Repeating Characters (#3)
// - Minimum Size Subarray Sum (#209)
```

</div>

### 3. Prefix Sum

When you need to calculate subarray sums frequently, precompute prefix sums. The intuition: sum[i:j] = prefix[j] - prefix[i-1]. This transforms O(n) queries into O(1).

<div class="code-group">

```python
# Subarray Sum Equals K (LeetCode #560)
# Time: O(n) | Space: O(n)
def subarraySum(nums, k):
    count = 0
    prefix_sum = 0
    sum_count = {0: 1}  # Base case: empty subarray has sum 0

    for num in nums:
        prefix_sum += num
        # If (prefix_sum - k) exists in map, we found a subarray summing to k
        count += sum_count.get(prefix_sum - k, 0)
        sum_count[prefix_sum] = sum_count.get(prefix_sum, 0) + 1

    return count

# Other problems using this pattern:
# - Range Sum Query - Immutable (#303)
# - Continuous Subarray Sum (#523)
```

```javascript
// Subarray Sum Equals K (LeetCode #560)
// Time: O(n) | Space: O(n)
function subarraySum(nums, k) {
  let count = 0;
  let prefixSum = 0;
  const sumCount = new Map();
  sumCount.set(0, 1); // Base case: empty subarray has sum 0

  for (const num of nums) {
    prefixSum += num;
    // If (prefixSum - k) exists in map, we found a subarray summing to k
    count += sumCount.get(prefixSum - k) || 0;
    sumCount.set(prefixSum, (sumCount.get(prefixSum) || 0) + 1);
  }

  return count;
}

// Other problems using this pattern:
// - Range Sum Query - Immutable (#303)
// - Continuous Subarray Sum (#523)
```

```java
// Subarray Sum Equals K (LeetCode #560)
// Time: O(n) | Space: O(n)
public int subarraySum(int[] nums, int k) {
    int count = 0;
    int prefixSum = 0;
    Map<Integer, Integer> sumCount = new HashMap<>();
    sumCount.put(0, 1);  // Base case: empty subarray has sum 0

    for (int num : nums) {
        prefixSum += num;
        // If (prefixSum - k) exists in map, we found a subarray summing to k
        count += sumCount.getOrDefault(prefixSum - k, 0);
        sumCount.put(prefixSum, sumCount.getOrDefault(prefixSum, 0) + 1);
    }

    return count;
}

// Other problems using this pattern:
// - Range Sum Query - Immutable (#303)
// - Continuous Subarray Sum (#523)
```

</div>

## When to Use Array vs Alternatives

The key decision: is your problem fundamentally about ordered elements with random access? If yes, array. If no, consider alternatives:

- **Hash Map vs Array**: Use a hash map (dictionary) when you need O(1) lookups by key, not index. But if your keys are small integers (0 to n), arrays are faster and use less memory. Example: "Two Sum" (#1) needs O(1) lookups by value → hash map. "Find All Numbers Disappeared in an Array" (#448) has values 1 to n → array.

- **Sorting First**: Many array problems become trivial if sorted. Ask: "Would sorting help?" If the problem mentions "pairs," "closest," or "minimum difference," sorting + two pointers often works. Time complexity tradeoff: O(n log n) for sorting vs potentially O(n²) for brute force.

- **BFS/DFS vs Array Traversal**: Arrays represent grids in matrix problems. Use BFS for shortest path problems ("Number of Islands" #200), DFS for connected components. For 1D arrays, simple traversal usually suffices.

**Decision Criteria Checklist**:

1. Do I need to maintain order? → Array
2. Are indices meaningful? → Array
3. Do I need O(1) access by position? → Array
4. Do I need O(1) access by value? → Hash map
5. Would the problem be easier if elements were ordered? → Consider sorting

## Edge Cases and Gotchas

Interviewers love these traps. Miss one, and you've failed the test:

1. **Empty and Single-Element Arrays**: Always check `if len(nums) == 0` or `if len(nums) == 1`. What should your function return? Often `0`, `[]`, or the single element itself.

2. **Integer Overflow**: When dealing with large numbers (especially in Java), use `long` for intermediate calculations. In "Maximum Subarray" (#53), the sum might exceed 32-bit integer limits.

3. **Off-by-One Errors**: The most common mistake. When your loop goes from `0` to `n-1`, but you access `nums[i+1]`, you'll get an `IndexOutOfBoundsException`. Always test with the smallest non-trivial case (2-3 elements).

4. **Mutable vs Immutable Input**: Some problems say "do not modify the input array." If you sort in-place, you've failed. Create a copy: `sorted_nums = nums.copy()` in Python, `Arrays.copyOf(nums, nums.length)` in Java.

Here's how to handle a tricky edge case:

```python
# Handling multiple edge cases in one function
def findMin(nums):
    """Find minimum in rotated sorted array (LeetCode #153)"""
    if not nums:
        return -1  # Or raise exception based on problem requirements

    left, right = 0, len(nums) - 1

    # Array not rotated
    if nums[left] < nums[right]:
        return nums[left]

    # Binary search for rotation point
    while left < right:
        mid = left + (right - left) // 2

        # Check if mid is the minimum
        if mid > 0 and nums[mid] < nums[mid - 1]:
            return nums[mid]

        # Decide which side to search
        if nums[mid] > nums[right]:
            left = mid + 1
        else:
            right = mid - 1

    return nums[left]
```

## Difficulty Breakdown

The 21% easy, 54% medium, 25% hard split tells a story:

- **Easy problems** test basic traversal and manipulation. Master these first—they're free points if you don't panic.
- **Medium problems** (the majority) combine 2-3 patterns. This is where interviews are won or lost.
- **Hard problems** often require non-obvious insights or combining multiple techniques.

**Study prioritization**: Spend 50% of your time on medium problems, 30% on hard, 20% on easy. Why? Medium problems appear most frequently in interviews. Hard problems teach you to think deeply, but you'll see fewer of them.

## Which Companies Ask Array

Every company asks array questions, but their styles differ:

- **Google** (/company/google): Loves "clever" array problems requiring mathematical insights. Expect problems like "Product of Array Except Self" (#238) or "Next Permutation" (#31). They test if you can optimize both time and space.

- **Amazon** (/company/amazon): Prefers practical array problems related to real systems. "Merge Intervals" (#56) for calendar scheduling, "Two Sum" (#1) for data lookup. They care about clean code and edge cases.

- **Meta** (/company/meta): Focuses on array problems that extend to strings and matrices. "3Sum" (#15), "Spiral Matrix" (#54). They want to see you handle multi-dimensional thinking.

- **Microsoft** (/company/microsoft): Mixes classic algorithms with new twists. "Rotate Array" (#189) but with constraints, "Set Matrix Zeroes" (#73) with follow-ups about optimization.

- **Bloomberg** (/company/bloomberg): Heavy on financial applications—sliding window for time series, prefix sums for portfolio calculations. "Best Time to Buy and Sell Stock" (#121) is their favorite.

## Study Tips

1. **Pattern-First, Not Problem-First**: Don't just solve random array problems. Group them by pattern. Solve all "two pointer" problems in one session, all "sliding window" in another. Your brain will start recognizing the patterns.

2. **The 15-Minute Rule**: If you're stuck on a problem for 15 minutes, look at the solution. But don't just read it—implement it yourself immediately after. Then solve it again tomorrow without help.

3. **Start with Constraints**: When you read a problem, immediately check the constraints. `1 <= nums.length <= 10^5` means O(n²) won't work. `-10^9 <= nums[i] <= 10^9` means watch for overflow.

4. **Recommended Problem Order**:
   - Week 1: Two Sum (#1), Best Time to Buy and Sell Stock (#121), Maximum Subarray (#53)
   - Week 2: Product of Array Except Self (#238), 3Sum (#15), Container With Most Water (#11)
   - Week 3: Merge Intervals (#56), Search in Rotated Sorted Array (#33), Subarray Sum Equals K (#560)
   - Week 4: Trapping Rain Water (#42), Sliding Window Maximum (#239), Median of Two Sorted Arrays (#4)

Arrays are the foundation. Master these patterns, and you'll find they reappear in string, matrix, and even tree problems. The array is a simple structure that reveals complex thinking—exactly what interviewers want to see.

[Practice all Array questions on CodeJeet](/topic/array)
