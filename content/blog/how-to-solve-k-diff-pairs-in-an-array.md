---
title: "How to Solve K-diff Pairs in an Array — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode K-diff Pairs in an Array. Medium difficulty, 45.6% acceptance rate. Topics: Array, Hash Table, Two Pointers, Binary Search, Sorting."
date: "2027-07-15"
category: "dsa-patterns"
tags: ["k-diff-pairs-in-an-array", "array", "hash-table", "two-pointers", "medium"]
---

# How to Solve K-diff Pairs in an Array

The problem asks us to count unique pairs of numbers in an array whose absolute difference equals a given value `k`. What makes this problem interesting is that we need to handle duplicates carefully while ensuring we don't count the same pair twice, and we must handle the special case where `k = 0` differently from other values.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `nums = [3, 1, 4, 1, 5]` with `k = 2`.

**Step 1: Understanding what we're looking for**
We need pairs where `|a - b| = 2`. This means either:

- `a = b + 2` (a is 2 greater than b)
- `a = b - 2` (a is 2 less than b)

**Step 2: Manual counting**
Let's find all unique pairs:

- For 3: We need 1 or 5. 1 exists (at index 1 or 3) → (3,1)
- For 1: We need -1 or 3. 3 exists → (1,3) but this is the same as (3,1) just reversed
- For 4: We need 2 or 6. Neither exists
- For 5: We need 3 or 7. 3 exists → (5,3)

So we have two unique pairs: (3,1) and (5,3). Notice that (1,3) is the same as (3,1) since order doesn't matter in pairs.

**Step 3: The k = 0 special case**
If `k = 0`, we're looking for pairs of equal numbers. For `nums = [1, 1, 1, 1]` with `k = 0`, we have only one unique pair: (1,1). We need to count duplicates but not overcount.

## Brute Force Approach

The most straightforward approach is to check all possible pairs:

1. Generate all combinations of indices `(i, j)` where `i < j`
2. For each pair, check if `|nums[i] - nums[j]| == k`
3. Store unique pairs in a set to avoid duplicates

<div class="code-group">

```python
# Time: O(n²) | Space: O(n²) for storing all unique pairs
def findPairs_brute(nums, k):
    # Use a set to store unique pairs
    pairs = set()
    n = len(nums)

    # Check all possible pairs
    for i in range(n):
        for j in range(i + 1, n):
            if abs(nums[i] - nums[j]) == k:
                # Store as tuple with sorted elements to ensure uniqueness
                pairs.add((min(nums[i], nums[j]), max(nums[i], nums[j])))

    return len(pairs)
```

```javascript
// Time: O(n²) | Space: O(n²) for storing all unique pairs
function findPairsBrute(nums, k) {
  // Use a Set to store unique pairs as strings
  const pairs = new Set();
  const n = nums.length;

  // Check all possible pairs
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (Math.abs(nums[i] - nums[j]) === k) {
        // Store as string with sorted elements to ensure uniqueness
        const pair = [Math.min(nums[i], nums[j]), Math.max(nums[i], nums[j])].toString();
        pairs.add(pair);
      }
    }
  }

  return pairs.size;
}
```

```java
// Time: O(n²) | Space: O(n²) for storing all unique pairs
public int findPairsBrute(int[] nums, int k) {
    // Use a HashSet to store unique pairs
    Set<String> pairs = new HashSet<>();
    int n = nums.length;

    // Check all possible pairs
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (Math.abs(nums[i] - nums[j]) == k) {
                // Store as string with sorted elements to ensure uniqueness
                int a = Math.min(nums[i], nums[j]);
                int b = Math.max(nums[i], nums[j]);
                pairs.add(a + "," + b);
            }
        }
    }

    return pairs.size();
}
```

</div>

**Why this is insufficient:**

- Time complexity is O(n²), which is too slow for large arrays (n up to 10⁴ would mean 100 million operations)
- Space complexity is also O(n²) in worst case if many pairs satisfy the condition
- We're doing redundant work by checking every pair when we could use a more efficient lookup

## Optimized Approach

The key insight is that for each number `num` in the array, we can determine what its partner should be:

- If we're looking at `num`, then its partner should be either `num + k` or `num - k`

However, we need to be careful:

1. **Avoid counting duplicates**: If we find both `(a, b)` and `(b, a)`, we should count it only once
2. **Handle k = 0 specially**: When `k = 0`, we're looking for duplicate numbers in the array

**Optimal strategy:**

1. Count frequency of each number using a hash map
2. For `k > 0`:
   - For each unique number `num`, check if `num + k` exists in the map
   - We only need to check `num + k` (not `num - k`) to avoid double counting
3. For `k = 0`:
   - Count how many numbers appear at least twice in the array

**Why checking only `num + k` works for k > 0:**
If `(a, b)` is a valid pair where `b = a + k`, then when we process `a`, we'll find `b`. When we process `b`, we would look for `b + k = a + 2k`, which doesn't exist (unless there's another number). So we avoid double counting by only looking forward.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def findPairs(nums, k):
    """
    Count unique k-diff pairs in the array.

    Approach:
    1. Count frequency of each number using a hash map
    2. For k > 0: For each unique number, check if num + k exists
    3. For k = 0: Count numbers with frequency >= 2

    Args:
        nums: List of integers
        k: Target difference

    Returns:
        Number of unique k-diff pairs
    """
    # Edge case: k cannot be negative (absolute difference is always non-negative)
    if k < 0:
        return 0

    # Step 1: Count frequency of each number
    freq = {}
    for num in nums:
        freq[num] = freq.get(num, 0) + 1

    count = 0

    # Step 2: Count pairs based on k value
    if k == 0:
        # Special case: we need duplicate numbers
        for num, frequency in freq.items():
            if frequency >= 2:
                count += 1
    else:
        # For k > 0: check if num + k exists for each unique number
        for num in freq.keys():
            if num + k in freq:
                count += 1

    return count
```

```javascript
// Time: O(n) | Space: O(n)
function findPairs(nums, k) {
  /**
   * Count unique k-diff pairs in the array.
   *
   * Approach:
   * 1. Count frequency of each number using a hash map
   * 2. For k > 0: For each unique number, check if num + k exists
   * 3. For k = 0: Count numbers with frequency >= 2
   *
   * @param {number[]} nums - Array of integers
   * @param {number} k - Target difference
   * @return {number} Number of unique k-diff pairs
   */

  // Edge case: k cannot be negative (absolute difference is always non-negative)
  if (k < 0) return 0;

  // Step 1: Count frequency of each number
  const freq = new Map();
  for (const num of nums) {
    freq.set(num, (freq.get(num) || 0) + 1);
  }

  let count = 0;

  // Step 2: Count pairs based on k value
  if (k === 0) {
    // Special case: we need duplicate numbers
    for (const frequency of freq.values()) {
      if (frequency >= 2) {
        count++;
      }
    }
  } else {
    // For k > 0: check if num + k exists for each unique number
    for (const num of freq.keys()) {
      if (freq.has(num + k)) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n) | Space: O(n)
public int findPairs(int[] nums, int k) {
    /**
     * Count unique k-diff pairs in the array.
     *
     * Approach:
     * 1. Count frequency of each number using a hash map
     * 2. For k > 0: For each unique number, check if num + k exists
     * 3. For k = 0: Count numbers with frequency >= 2
     *
     * @param nums Array of integers
     * @param k Target difference
     * @return Number of unique k-diff pairs
     */

    // Edge case: k cannot be negative (absolute difference is always non-negative)
    if (k < 0) return 0;

    // Step 1: Count frequency of each number
    Map<Integer, Integer> freq = new HashMap<>();
    for (int num : nums) {
        freq.put(num, freq.getOrDefault(num, 0) + 1);
    }

    int count = 0;

    // Step 2: Count pairs based on k value
    if (k == 0) {
        // Special case: we need duplicate numbers
        for (int frequency : freq.values()) {
            if (frequency >= 2) {
                count++;
            }
        }
    } else {
        // For k > 0: check if num + k exists for each unique number
        for (int num : freq.keySet()) {
            if (freq.containsKey(num + k)) {
                count++;
            }
        }
    }

    return count;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Building the frequency map takes O(n) time (one pass through the array)
- Counting pairs takes O(n) time in worst case (when all numbers are unique)
- Total: O(n) + O(n) = O(n)

**Space Complexity: O(n)**

- The frequency map stores at most n entries (when all numbers are unique)
- In the worst case, we need O(n) space to store the frequency counts

## Common Mistakes

1. **Not handling k = 0 as a special case**: When k = 0, we're looking for duplicate numbers, not numbers that are 0 apart. Many candidates try to look for `num + 0` which would just find the same number, leading to incorrect counts.

2. **Double counting pairs**: If you check both `num + k` and `num - k` for each number, you'll count each pair twice. The solution is to only check in one direction (either `num + k` or `num - k`).

3. **Forgetting that k can be negative**: The problem states k is an integer, but mathematically, absolute difference cannot be negative. Always check for `k < 0` and return 0 immediately.

4. **Not considering duplicates in the array**: If the array has duplicates like `[1, 1, 1, 1]` with `k = 0`, there's only one unique pair `(1, 1)`, not 6 pairs (which would be the number of index combinations).

## When You'll See This Pattern

This problem uses the **frequency counting with hash maps** pattern, which is common in many array problems:

1. **Two Sum** (LeetCode #1): Find two numbers that add up to a target. Similar to looking for `num + k` in our frequency map.

2. **Contains Duplicate** (LeetCode #217): Check if any value appears at least twice. This is exactly our `k = 0` case.

3. **Count Number of Pairs With Absolute Difference K** (LeetCode #2006): This is essentially the same problem with a simpler constraint (k is always positive).

The core pattern is: when you need to find pairs satisfying a certain relationship, consider using a hash map to store what you've seen so you can check for complements in O(1) time.

## Key Takeaways

1. **Hash maps are excellent for pair-finding problems**: When you need to find pairs that satisfy `f(a, b) = target`, store elements in a hash map as you iterate, allowing O(1) lookups for complements.

2. **Handle edge cases early**: Always check for invalid inputs (like negative k) and special cases (like k = 0) at the beginning of your solution.

3. **Think about directionality to avoid double counting**: In pair-finding problems, decide whether to look "forward" or "backward" to count each pair exactly once.

Related problems: [Minimum Absolute Difference in BST](/problem/minimum-absolute-difference-in-bst), [Count Number of Pairs With Absolute Difference K](/problem/count-number-of-pairs-with-absolute-difference-k), [Kth Smallest Product of Two Sorted Arrays](/problem/kth-smallest-product-of-two-sorted-arrays)
