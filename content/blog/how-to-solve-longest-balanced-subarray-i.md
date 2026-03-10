---
title: "How to Solve Longest Balanced Subarray I — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Longest Balanced Subarray I. Medium difficulty, 65.7% acceptance rate. Topics: Array, Hash Table, Divide and Conquer, Segment Tree, Prefix Sum."
date: "2026-10-29"
category: "dsa-patterns"
tags: ["longest-balanced-subarray-i", "array", "hash-table", "divide-and-conquer", "medium"]
---

# How to Solve Longest Balanced Subarray I

This problem asks us to find the longest subarray where the count of distinct even numbers equals the count of distinct odd numbers. What makes this tricky is that we're tracking _distinct_ values, not just total counts. A subarray like `[2, 2, 7]` has 1 distinct even (2) and 1 distinct odd (7), making it balanced, even though there are more even numbers total. This distinction changes how we approach the problem compared to simpler subarray problems.

## Visual Walkthrough

Let's trace through `nums = [2, 2, 7, 8, 3, 2, 7]`:

**Step 1:** Start at index 0 with `[2]`

- Distinct evens: {2} → count = 1
- Distinct odds: {} → count = 0
- Not balanced

**Step 2:** Expand to `[2, 2]`

- Distinct evens: {2} → count = 1 (still 1, duplicates don't count)
- Distinct odds: {} → count = 0
- Not balanced

**Step 3:** Expand to `[2, 2, 7]`

- Distinct evens: {2} → count = 1
- Distinct odds: {7} → count = 1
- **Balanced!** Length = 3

**Step 4:** Expand to `[2, 2, 7, 8]`

- Distinct evens: {2, 8} → count = 2
- Distinct odds: {7} → count = 1
- Not balanced

**Step 5:** Try different starting point: `[7, 8, 3]`

- Distinct evens: {8} → count = 1
- Distinct odds: {7, 3} → count = 2
- Not balanced

**Step 6:** Try `[8, 3, 2, 7]`

- Distinct evens: {8, 2} → count = 2
- Distinct odds: {3, 7} → count = 2
- **Balanced!** Length = 4 (better than previous 3)

The challenge is we need to check all possible subarrays efficiently. A brute force check of all O(n²) subarrays would be too slow for large inputs.

## Brute Force Approach

The most straightforward solution checks every possible subarray:

1. For each starting index `i` from 0 to n-1
2. For each ending index `j` from i to n-1
3. Extract the subarray `nums[i:j+1]`
4. Count distinct evens and odds using a set
5. If counts are equal, update the maximum length

This approach is correct but inefficient. For each of O(n²) subarrays, we need O(k) time to process it (where k is the subarray length), giving us O(n³) total time complexity. Even with some optimizations, we'd still have O(n²) time, which is too slow for n up to 10⁵.

<div class="code-group">

```python
# Time: O(n³) | Space: O(n)
def longestBalancedSubarrayBrute(nums):
    n = len(nums)
    max_len = 0

    for i in range(n):
        for j in range(i, n):
            # Extract current subarray
            subarray = nums[i:j+1]

            # Count distinct evens and odds
            evens = set()
            odds = set()

            for num in subarray:
                if num % 2 == 0:
                    evens.add(num)
                else:
                    odds.add(num)

            # Check if balanced
            if len(evens) == len(odds):
                max_len = max(max_len, j - i + 1)

    return max_len
```

```javascript
// Time: O(n³) | Space: O(n)
function longestBalancedSubarrayBrute(nums) {
  let maxLen = 0;
  const n = nums.length;

  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      // Count distinct evens and odds in current subarray
      const evens = new Set();
      const odds = new Set();

      for (let k = i; k <= j; k++) {
        if (nums[k] % 2 === 0) {
          evens.add(nums[k]);
        } else {
          odds.add(nums[k]);
        }
      }

      // Check if balanced
      if (evens.size === odds.size) {
        maxLen = Math.max(maxLen, j - i + 1);
      }
    }
  }

  return maxLen;
}
```

```java
// Time: O(n³) | Space: O(n)
public int longestBalancedSubarrayBrute(int[] nums) {
    int maxLen = 0;
    int n = nums.length;

    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            // Count distinct evens and odds in current subarray
            Set<Integer> evens = new HashSet<>();
            Set<Integer> odds = new HashSet<>();

            for (int k = i; k <= j; k++) {
                if (nums[k] % 2 == 0) {
                    evens.add(nums[k]);
                } else {
                    odds.add(nums[k]);
                }
            }

            // Check if balanced
            if (evens.size() == odds.size()) {
                maxLen = Math.max(maxLen, j - i + 1);
            }
        }
    }

    return maxLen;
}
```

</div>

## Optimized Approach

The key insight is to transform this into a prefix sum problem. For each position `i`, we can track the difference between distinct even count and distinct odd count up to that point. However, since we're tracking _distinct_ values, we need a smarter approach.

**Core Insight:** As we process the array left to right, we can maintain two sets: one for distinct evens seen so far, and one for distinct odds. The difference between their sizes changes only when we encounter a _new_ distinct value.

**Transformation:** Let's define `diff[i] = (distinct_evens_up_to_i) - (distinct_odds_up_to_i)`. A subarray from `j+1` to `i` is balanced if `diff[i] == diff[j]` because the change in distinct counts over that interval is zero.

**Algorithm:**

1. Initialize a hashmap to store the first occurrence of each `diff` value
2. Maintain two sets tracking distinct evens and odds seen so far
3. For each position `i`:
   - Update the distinct sets with `nums[i]`
   - Calculate current `diff = len(evens) - len(odds)`
   - If this `diff` was seen before at index `j`, then subarray `[j+1, i]` is balanced
   - Otherwise, record this `diff` with current index `i`

This gives us O(n) time because we process each element once and use O(1) operations with the hashmap.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def longestBalancedSubarray(nums):
    """
    Find the longest subarray where count of distinct evens equals count of distinct odds.

    Approach: Use prefix difference of distinct counts with hashmap for O(n) solution.
    Key insight: When diff = (distinct_evens - distinct_odds) repeats, the subarray
    between those indices has equal distinct counts.
    """
    n = len(nums)
    if n == 0:
        return 0

    # Track first occurrence of each diff value
    # diff_map[diff] = first index where this diff occurred
    diff_map = {}

    # Initialize: before processing any elements, diff = 0 at index -1
    diff_map[0] = -1

    # Sets to track distinct evens and odds seen so far
    distinct_evens = set()
    distinct_odds = set()

    max_length = 0

    for i in range(n):
        num = nums[i]

        # Update distinct sets based on current number
        if num % 2 == 0:
            distinct_evens.add(num)
        else:
            distinct_odds.add(num)

        # Calculate current difference
        current_diff = len(distinct_evens) - len(distinct_odds)

        # Check if we've seen this diff before
        if current_diff in diff_map:
            # Subarray from (previous_index + 1) to i is balanced
            prev_index = diff_map[current_diff]
            length = i - prev_index
            max_length = max(max_length, length)
        else:
            # First time seeing this diff, record its index
            diff_map[current_diff] = i

    return max_length
```

```javascript
// Time: O(n) | Space: O(n)
function longestBalancedSubarray(nums) {
  /**
   * Find the longest subarray where count of distinct evens equals count of distinct odds.
   *
   * Approach: Use prefix difference of distinct counts with hashmap for O(n) solution.
   * Key insight: When diff = (distinct_evens - distinct_odds) repeats, the subarray
   * between those indices has equal distinct counts.
   */
  const n = nums.length;
  if (n === 0) return 0;

  // Track first occurrence of each diff value
  // diffMap[diff] = first index where this diff occurred
  const diffMap = new Map();

  // Initialize: before processing any elements, diff = 0 at index -1
  diffMap.set(0, -1);

  // Sets to track distinct evens and odds seen so far
  const distinctEvens = new Set();
  const distinctOdds = new Set();

  let maxLength = 0;

  for (let i = 0; i < n; i++) {
    const num = nums[i];

    // Update distinct sets based on current number
    if (num % 2 === 0) {
      distinctEvens.add(num);
    } else {
      distinctOdds.add(num);
    }

    // Calculate current difference
    const currentDiff = distinctEvens.size - distinctOdds.size;

    // Check if we've seen this diff before
    if (diffMap.has(currentDiff)) {
      // Subarray from (previous_index + 1) to i is balanced
      const prevIndex = diffMap.get(currentDiff);
      const length = i - prevIndex;
      maxLength = Math.max(maxLength, length);
    } else {
      // First time seeing this diff, record its index
      diffMap.set(currentDiff, i);
    }
  }

  return maxLength;
}
```

```java
// Time: O(n) | Space: O(n)
public int longestBalancedSubarray(int[] nums) {
    /**
     * Find the longest subarray where count of distinct evens equals count of distinct odds.
     *
     * Approach: Use prefix difference of distinct counts with hashmap for O(n) solution.
     * Key insight: When diff = (distinct_evens - distinct_odds) repeats, the subarray
     * between those indices has equal distinct counts.
     */
    int n = nums.length;
    if (n == 0) return 0;

    // Track first occurrence of each diff value
    // diffMap[diff] = first index where this diff occurred
    Map<Integer, Integer> diffMap = new HashMap<>();

    // Initialize: before processing any elements, diff = 0 at index -1
    diffMap.put(0, -1);

    // Sets to track distinct evens and odds seen so far
    Set<Integer> distinctEvens = new HashSet<>();
    Set<Integer> distinctOdds = new HashSet<>();

    int maxLength = 0;

    for (int i = 0; i < n; i++) {
        int num = nums[i];

        // Update distinct sets based on current number
        if (num % 2 == 0) {
            distinctEvens.add(num);
        } else {
            distinctOdds.add(num);
        }

        // Calculate current difference
        int currentDiff = distinctEvens.size() - distinctOdds.size();

        // Check if we've seen this diff before
        if (diffMap.containsKey(currentDiff)) {
            // Subarray from (previous_index + 1) to i is balanced
            int prevIndex = diffMap.get(currentDiff);
            int length = i - prevIndex;
            maxLength = Math.max(maxLength, length);
        } else {
            // First time seeing this diff, record its index
            diffMap.put(currentDiff, i);
        }
    }

    return maxLength;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the array once (n iterations)
- Each iteration performs O(1) operations: set additions (average O(1)), hashmap lookups (average O(1)), and integer calculations
- The sets and hashmap operations are amortized constant time

**Space Complexity: O(n)**

- In the worst case, all numbers are distinct, so both sets could store up to n elements
- The hashmap could store up to O(n) different diff values (one for each prefix)
- Therefore, overall space is O(n)

## Common Mistakes

1. **Confusing distinct counts with total counts**: The biggest pitfall is treating `[2, 2, 7]` as unbalanced because there are 2 evens and 1 odd. Remember we only count distinct values, so this subarray is actually balanced (1 distinct even, 1 distinct odd).

2. **Forgetting to initialize diff=0 at index -1**: Without this, we miss balanced subarrays starting at index 0. When the entire prefix up to index i has diff=0, that means subarray [0, i] is balanced, which corresponds to finding diff=0 at a previous "index" of -1.

3. **Using sliding window incorrectly**: Some candidates try a sliding window approach, but it fails because adding/removing elements from the window doesn't give us enough information about distinct counts. When we shrink the window from the left, we don't know if we're removing the last occurrence of a distinct value.

4. **Not handling empty array or single element cases**: An empty array should return 0. A single element array can never be balanced (needs at least one even and one odd), so should return 0 unless the problem definition allows length 0 subarrays.

## When You'll See This Pattern

This "prefix difference with hashmap" pattern appears in several subarray problems:

1. **Subarray Sum Equals K (LeetCode 560)**: Find subarrays with sum equal to k. Uses prefix sums and hashmap to find when `prefix[i] - prefix[j] = k`.

2. **Contiguous Array (LeetCode 525)**: Find maximum length subarray with equal number of 0s and 1s. Uses prefix difference (count1 - count0) and hashmap.

3. **Find the Longest Substring Containing Vowels in Even Counts (LeetCode 1371)**: Similar pattern but with bitmask to track parity of vowel counts.

The common theme is transforming a subarray condition into a prefix difference condition, then using a hashmap to find matching prefixes efficiently.

## Key Takeaways

1. **Transform subarray problems into prefix problems**: When looking for subarrays with some balanced property, consider tracking a running count/difference and looking for when this value repeats.

2. **Hashmaps store first occurrences for maximum length**: When we want the longest subarray, store the first index where each diff value appears. For other variations (like count of subarrays), you might store frequency instead.

3. **Distinct vs total counts matter**: Always read carefully whether the problem asks for distinct values or total counts. This changes whether you need sets or simple counters.

[Practice this problem on CodeJeet](/problem/longest-balanced-subarray-i)
