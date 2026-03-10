---
title: "How to Solve Count Number of Pairs With Absolute Difference K — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Count Number of Pairs With Absolute Difference K. Easy difficulty, 85.3% acceptance rate. Topics: Array, Hash Table, Counting."
date: "2028-06-29"
category: "dsa-patterns"
tags:
  ["count-number-of-pairs-with-absolute-difference-k", "array", "hash-table", "counting", "easy"]
---

# How to Solve Count Number of Pairs With Absolute Difference K

You're given an array of integers `nums` and an integer `k`. Your task is to count all pairs of indices `(i, j)` where `i < j` and the absolute difference between their values equals `k`. While this problem seems straightforward, the challenge lies in finding an efficient solution that doesn't require checking every possible pair, especially when dealing with large arrays. The absolute difference constraint creates interesting relationships between numbers that we can exploit for optimization.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `nums = [1, 2, 2, 1]` with `k = 1`. We need to count pairs where `|nums[i] - nums[j]| == 1`.

**Step-by-step thinking:**

1. For the first element `1`, we need numbers that are either `1 + 1 = 2` or `1 - 1 = 0`
2. Looking ahead: we see `2` at index 1 (difference is 1), `2` at index 2 (difference is 1), and `1` at index 3 (difference is 0)
3. So element `1` at index 0 forms valid pairs with both `2`s at indices 1 and 2

4. For the second element `2` at index 1, we need numbers that are either `3` or `1`
5. Looking ahead: we see `2` at index 2 (difference is 0), `1` at index 3 (difference is 1)
6. So element `2` at index 1 forms a valid pair with `1` at index 3

7. For the third element `2` at index 2, we need numbers that are either `3` or `1`
8. Looking ahead: we see `1` at index 3 (difference is 1)
9. So element `2` at index 2 forms a valid pair with `1` at index 3

Total valid pairs: 2 (from first element) + 1 (from second element) + 1 (from third element) = 4

Notice a pattern: For each number `x`, we're looking for either `x + k` or `x - k` in the remaining elements. This observation will guide our solution.

## Brute Force Approach

The most straightforward solution is to check every possible pair `(i, j)` where `i < j` and count those with absolute difference equal to `k`. This approach is intuitive but inefficient.

**Why it's too slow:**

- For an array of size `n`, there are `n × (n-1) / 2` possible pairs
- Checking each pair takes O(1) time, but with `n` up to 200 (typical LeetCode constraints), that's about 20,000 operations
- While this might pass for small inputs, it becomes problematic for larger arrays (n = 10,000 would require ~50 million operations)

**Brute Force Code:**

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def countKDifference(nums, k):
    count = 0
    n = len(nums)

    # Check every possible pair (i, j) where i < j
    for i in range(n):
        for j in range(i + 1, n):
            if abs(nums[i] - nums[j]) == k:
                count += 1

    return count
```

```javascript
// Time: O(n²) | Space: O(1)
function countKDifference(nums, k) {
  let count = 0;
  const n = nums.length;

  // Check every possible pair (i, j) where i < j
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (Math.abs(nums[i] - nums[j]) === k) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n²) | Space: O(1)
public int countKDifference(int[] nums, int k) {
    int count = 0;
    int n = nums.length;

    // Check every possible pair (i, j) where i < j
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (Math.abs(nums[i] - nums[j]) == k) {
                count++;
            }
        }
    }

    return count;
}
```

</div>

## Optimal Solution

The key insight is that for each number `x`, we need to find how many occurrences of `x + k` and `x - k` we've seen so far. We can use a hash map (dictionary in Python, object/map in JavaScript, HashMap in Java) to store the frequency of numbers we've encountered. As we iterate through the array, for each element `num`:

1. Check if `num - k` exists in our map → if yes, add its frequency to our count
2. Check if `num + k` exists in our map → if yes, add its frequency to our count
3. Update the frequency of `num` in our map

This approach ensures we count each pair exactly once while maintaining O(n) time complexity.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def countKDifference(nums, k):
    # Dictionary to store frequency of numbers we've seen
    freq = {}
    count = 0

    # Iterate through each number in the array
    for num in nums:
        # For current num, we need to find numbers that are either
        # num - k or num + k to satisfy |num - x| = k

        # Check if num - k exists in our frequency map
        # If it does, each occurrence forms a valid pair with current num
        if num - k in freq:
            count += freq[num - k]

        # Check if num + k exists in our frequency map
        # If it does, each occurrence forms a valid pair with current num
        if num + k in freq:
            count += freq[num + k]

        # Update the frequency of current number
        # We do this after checking to ensure we don't pair num with itself
        freq[num] = freq.get(num, 0) + 1

    return count
```

```javascript
// Time: O(n) | Space: O(n)
function countKDifference(nums, k) {
  // Map to store frequency of numbers we've seen
  const freq = new Map();
  let count = 0;

  // Iterate through each number in the array
  for (const num of nums) {
    // For current num, we need to find numbers that are either
    // num - k or num + k to satisfy |num - x| = k

    // Check if num - k exists in our frequency map
    // If it does, each occurrence forms a valid pair with current num
    if (freq.has(num - k)) {
      count += freq.get(num - k);
    }

    // Check if num + k exists in our frequency map
    // If it does, each occurrence forms a valid pair with current num
    if (freq.has(num + k)) {
      count += freq.get(num + k);
    }

    // Update the frequency of current number
    // We do this after checking to ensure we don't pair num with itself
    freq.set(num, (freq.get(num) || 0) + 1);
  }

  return count;
}
```

```java
// Time: O(n) | Space: O(n)
public int countKDifference(int[] nums, int k) {
    // HashMap to store frequency of numbers we've seen
    Map<Integer, Integer> freq = new HashMap<>();
    int count = 0;

    // Iterate through each number in the array
    for (int num : nums) {
        // For current num, we need to find numbers that are either
        // num - k or num + k to satisfy |num - x| = k

        // Check if num - k exists in our frequency map
        // If it does, each occurrence forms a valid pair with current num
        if (freq.containsKey(num - k)) {
            count += freq.get(num - k);
        }

        // Check if num + k exists in our frequency map
        // If it does, each occurrence forms a valid pair with current num
        if (freq.containsKey(num + k)) {
            count += freq.get(num + k);
        }

        // Update the frequency of current number
        // We do this after checking to ensure we don't pair num with itself
        freq.put(num, freq.getOrDefault(num, 0) + 1);
    }

    return count;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the array once, performing constant-time operations for each element
- Hash map lookups (`in` operator in Python, `has()`/`get()` in JavaScript, `containsKey()`/`get()` in Java) are O(1) on average
- Hash map insertions/updates are also O(1) on average

**Space Complexity: O(n)**

- In the worst case, all elements in the array are distinct, so our hash map stores n entries
- Even with duplicates, we still need to store frequency counts for each unique value

## Common Mistakes

1. **Counting pairs twice**: The most common mistake is updating the frequency map before checking for complements. If you add `num` to the map first, then check for `num - k` and `num + k`, you might pair `num` with itself when `k = 0`. Always check first, then update.

2. **Missing the absolute value logic**: Some candidates only check for `num + k` or only check for `num - k`, forgetting that absolute difference works in both directions. Remember: `|a - b| = k` means either `a - b = k` OR `b - a = k`.

3. **Using the wrong data structure for frequency counting**: While you could use an array if you know the value range, a hash map is more general and works for any integer values. Don't assume constraints that aren't given.

4. **Off-by-one in brute force loops**: When implementing the brute force solution, ensure the inner loop starts from `i + 1` not `i` (to avoid pairing an element with itself) and not `0` (to avoid counting pairs twice).

## When You'll See This Pattern

This problem uses the **frequency counting with complement search** pattern, which appears in many array and hash table problems:

1. **Two Sum (Easy)**: Instead of looking for `num ± k`, you look for `target - num`. The core pattern of storing seen elements and checking for complements is identical.

2. **K-diff Pairs in an Array (Medium)**: This is essentially the same problem but with additional constraints about unique pairs. The solution approach is very similar, just with extra handling for the `k = 0` case.

3. **Finding Pairs With a Certain Sum (Medium)**: While more complex, it builds on the same foundation of using hash maps to efficiently find complements that satisfy a mathematical relationship.

The pattern to recognize: when you need to find pairs satisfying `f(a, b) = target` for some function `f`, consider whether you can rearrange the equation to express what complement you need for each element as you iterate.

## Key Takeaways

1. **Hash maps transform O(n²) pair-finding into O(n)**: When you need to find pairs satisfying a condition, consider whether storing seen elements in a hash map lets you find complements in constant time.

2. **Order matters for avoiding double-counting**: When counting pairs `(i, j)` with `i < j`, process elements sequentially and only look backward (at elements you've already seen) to ensure each pair is counted exactly once.

3. **Absolute difference problems often have two complement cases**: For `|a - b| = k`, you need to check for both `a - k` and `a + k` (which is equivalent to checking for `b = a - k` or `b = a + k`).

Related problems: [Two Sum](/problem/two-sum), [K-diff Pairs in an Array](/problem/k-diff-pairs-in-an-array), [Finding Pairs With a Certain Sum](/problem/finding-pairs-with-a-certain-sum)
