---
title: "How to Solve Longest Well-Performing Interval — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Longest Well-Performing Interval. Medium difficulty, 37.0% acceptance rate. Topics: Array, Hash Table, Stack, Monotonic Stack, Prefix Sum."
date: "2028-09-14"
category: "dsa-patterns"
tags: ["longest-well-performing-interval", "array", "hash-table", "stack", "medium"]
---

# How to Solve Longest Well-Performing Interval

This problem asks us to find the longest contiguous subarray where the number of "tiring days" (hours > 8) exceeds the number of "non-tiring days" (hours ≤ 8). What makes this problem interesting is that we're not looking for a specific sum or count, but rather a subarray where one type of element strictly outnumbers another. The challenge lies in efficiently finding the longest interval where this condition holds true.

## Visual Walkthrough

Let's trace through a concrete example: `hours = [9, 9, 6, 0, 6, 6, 9]`

First, let's convert each day to a score:

- Tiring day (hours > 8) → +1
- Non-tiring day (hours ≤ 8) → -1

Our array becomes: `[1, 1, -1, -1, -1, -1, 1]`

Now we need to find the longest subarray where the sum is positive (> 0).

**Step-by-step thinking:**

1. Day 0: Score = 1, cumulative sum = 1
2. Day 1: Score = 1, cumulative sum = 2
3. Day 2: Score = -1, cumulative sum = 1
4. Day 3: Score = -1, cumulative sum = 0
5. Day 4: Score = -1, cumulative sum = -1
6. Day 5: Score = -1, cumulative sum = -2
7. Day 6: Score = 1, cumulative sum = -1

Now, to find intervals where sum > 0:

- From index 0 to 2: sum = 1+1-1 = 1 > 0 → length = 3
- From index 0 to 6: sum = 1+1-1-1-1-1+1 = -1 ≤ 0
- From index 1 to 2: sum = 1-1 = 0 ≤ 0
- From index 0 to 1: sum = 1+1 = 2 > 0 → length = 2
- From index 6 to 6: sum = 1 > 0 → length = 1

The longest interval is from index 0 to 2 with length 3. But wait, is there a longer one? What about from index 0 to 6? That sum is -1, so no. But what if we look for intervals where the cumulative sum at the end is greater than the cumulative sum at the beginning? That's the key insight!

## Brute Force Approach

The brute force solution would check every possible subarray:

1. For each starting index `i` from 0 to n-1
2. For each ending index `j` from i to n-1
3. Count tiring vs non-tiring days in that subarray
4. If tiring > non-tiring, update max length

This approach has O(n³) time complexity if we count fresh each time, or O(n²) if we use prefix sums. Even O(n²) is too slow for n up to 10,000.

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def longestWPI_brute(hours):
    n = len(hours)
    max_len = 0

    for i in range(n):
        balance = 0  # positive means more tiring days
        for j in range(i, n):
            # Update balance for current day
            if hours[j] > 8:
                balance += 1
            else:
                balance -= 1

            # Check if this interval is well-performing
            if balance > 0:
                max_len = max(max_len, j - i + 1)

    return max_len
```

```javascript
// Time: O(n²) | Space: O(1)
function longestWPI_brute(hours) {
  let n = hours.length;
  let maxLen = 0;

  for (let i = 0; i < n; i++) {
    let balance = 0; // positive means more tiring days

    for (let j = i; j < n; j++) {
      // Update balance for current day
      if (hours[j] > 8) {
        balance++;
      } else {
        balance--;
      }

      // Check if this interval is well-performing
      if (balance > 0) {
        maxLen = Math.max(maxLen, j - i + 1);
      }
    }
  }

  return maxLen;
}
```

```java
// Time: O(n²) | Space: O(1)
public int longestWPI_brute(int[] hours) {
    int n = hours.length;
    int maxLen = 0;

    for (int i = 0; i < n; i++) {
        int balance = 0;  // positive means more tiring days

        for (int j = i; j < n; j++) {
            // Update balance for current day
            if (hours[j] > 8) {
                balance++;
            } else {
                balance--;
            }

            // Check if this interval is well-performing
            if (balance > 0) {
                maxLen = Math.max(maxLen, j - i + 1);
            }
        }
    }

    return maxLen;
}
```

</div>

The brute force is too slow because with n=10,000, O(n²) means 100 million operations, which is borderline but often too slow in interviews.

## Optimized Approach

The key insight is to transform this into a prefix sum problem and use a hash map. Here's the step-by-step reasoning:

1. **Transform the problem**: Convert each day to +1 (tiring) or -1 (non-tiring). Now we need the longest subarray with sum > 0.

2. **Prefix sums**: Let `prefix[i]` be the sum of first i elements. Then the sum from i+1 to j is `prefix[j] - prefix[i]`.

3. **The condition**: We want `prefix[j] - prefix[i] > 0`, which means `prefix[j] > prefix[i]`.

4. **The insight**: For each `prefix[j]`, we want the earliest index `i` where `prefix[i] < prefix[j]`. Why earliest? Because that gives us the longest interval ending at j.

5. **Handling the hash map**: We store the first occurrence of each prefix sum. But we only store it if we haven't seen it before (to keep the earliest index).

6. **Special case**: If `prefix[j] > 0`, then the entire array from start to j is valid, so length = j+1.

7. **Why check `prefix[j]-1`?**: If we can't find a prefix sum less than `prefix[j]`, we check for `prefix[j]-1`. Why? Because if `prefix[j] - prefix[i] > 0`, then `prefix[j] > prefix[i]`. The smallest integer less than `prefix[j]` is `prefix[j]-1`. If we find `prefix[j]-1` in our map, then `prefix[j] - prefix[map[prefix[j]-1]] = 1 > 0`.

This is similar to the "contiguous array" problem (LeetCode 525) but with a > 0 condition instead of = 0.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def longestWPI(hours):
    """
    Find the longest well-performing interval where tiring days > non-tiring days.

    Approach:
    1. Convert each hour to +1 (if > 8) or -1 (if <= 8)
    2. Use prefix sums and a hash map to track first occurrence of each sum
    3. For each position, check if current sum > 0 or if we've seen a smaller sum before

    Args:
        hours: List of hours worked each day

    Returns:
        Length of longest well-performing interval
    """
    n = len(hours)
    max_len = 0
    balance = 0  # Current balance: positive means more tiring days so far
    first_seen = {}  # Map from balance to first index where it occurred

    for i in range(n):
        # Update balance for current day
        balance += 1 if hours[i] > 8 else -1

        # Case 1: If balance > 0, entire array from start to i is valid
        if balance > 0:
            max_len = i + 1
        else:
            # Case 2: Check if we've seen balance - 1 before
            # Why balance - 1? Because if current balance is not > 0,
            # we need to find a previous balance that's smaller.
            # The difference will be positive if current > previous.
            # balance - 1 is the smallest integer less than balance.
            if balance - 1 in first_seen:
                max_len = max(max_len, i - first_seen[balance - 1])

            # Case 3: Check if we've seen this balance before (for future indices)
            # Only store if this is the first time we've seen this balance
            if balance not in first_seen:
                first_seen[balance] = i

    return max_len
```

```javascript
// Time: O(n) | Space: O(n)
function longestWPI(hours) {
  /**
   * Find the longest well-performing interval where tiring days > non-tiring days.
   *
   * Approach:
   * 1. Convert each hour to +1 (if > 8) or -1 (if <= 8)
   * 2. Use prefix sums and a hash map to track first occurrence of each sum
   * 3. For each position, check if current sum > 0 or if we've seen a smaller sum before
   *
   * @param {number[]} hours - Array of hours worked each day
   * @return {number} Length of longest well-performing interval
   */
  let n = hours.length;
  let maxLen = 0;
  let balance = 0; // Current balance: positive means more tiring days so far
  let firstSeen = new Map(); // Map from balance to first index where it occurred

  for (let i = 0; i < n; i++) {
    // Update balance for current day
    balance += hours[i] > 8 ? 1 : -1;

    // Case 1: If balance > 0, entire array from start to i is valid
    if (balance > 0) {
      maxLen = i + 1;
    } else {
      // Case 2: Check if we've seen balance - 1 before
      // Why balance - 1? Because if current balance is not > 0,
      // we need to find a previous balance that's smaller.
      // The difference will be positive if current > previous.
      // balance - 1 is the smallest integer less than balance.
      if (firstSeen.has(balance - 1)) {
        maxLen = Math.max(maxLen, i - firstSeen.get(balance - 1));
      }

      // Case 3: Check if we've seen this balance before (for future indices)
      // Only store if this is the first time we've seen this balance
      if (!firstSeen.has(balance)) {
        firstSeen.set(balance, i);
      }
    }
  }

  return maxLen;
}
```

```java
// Time: O(n) | Space: O(n)
public int longestWPI(int[] hours) {
    /**
     * Find the longest well-performing interval where tiring days > non-tiring days.
     *
     * Approach:
     * 1. Convert each hour to +1 (if > 8) or -1 (if <= 8)
     * 2. Use prefix sums and a hash map to track first occurrence of each sum
     * 3. For each position, check if current sum > 0 or if we've seen a smaller sum before
     *
     * @param hours Array of hours worked each day
     * @return Length of longest well-performing interval
     */
    int n = hours.length;
    int maxLen = 0;
    int balance = 0;  // Current balance: positive means more tiring days so far
    Map<Integer, Integer> firstSeen = new HashMap<>();  // Map from balance to first index where it occurred

    for (int i = 0; i < n; i++) {
        // Update balance for current day
        balance += hours[i] > 8 ? 1 : -1;

        // Case 1: If balance > 0, entire array from start to i is valid
        if (balance > 0) {
            maxLen = i + 1;
        } else {
            // Case 2: Check if we've seen balance - 1 before
            // Why balance - 1? Because if current balance is not > 0,
            // we need to find a previous balance that's smaller.
            // The difference will be positive if current > previous.
            // balance - 1 is the smallest integer less than balance.
            if (firstSeen.containsKey(balance - 1)) {
                maxLen = Math.max(maxLen, i - firstSeen.get(balance - 1));
            }

            // Case 3: Check if we've seen this balance before (for future indices)
            // Only store if this is the first time we've seen this balance
            if (!firstSeen.containsKey(balance)) {
                firstSeen.put(balance, i);
            }
        }
    }

    return maxLen;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the array of n elements
- Each iteration does O(1) hash map operations (get and put)
- Total: O(n)

**Space Complexity: O(n)**

- In the worst case, we might store O(n) different prefix sums in the hash map
- For example, if the array alternates between +1 and -1, we get all distinct prefix sums
- In practice, it's usually less than n but O(n) worst case

## Common Mistakes

1. **Not understanding the balance - 1 check**: Many candidates try to look for any smaller balance, which would require checking all previous balances. The key insight is that we only need to check for `balance - 1` because if there's any smaller balance, there must be `balance - 1` in between (since balances change by ±1 each step).

2. **Forgetting to handle the balance > 0 case**: When the entire prefix sum is positive, the interval from start to current index is valid and often the longest. Missing this case leads to incorrect results.

3. **Storing all occurrences instead of first occurrence**: We only want the first time we see each balance value to maximize interval length. Storing the last occurrence would give us shorter intervals.

4. **Off-by-one errors in interval length calculation**: When calculating `i - first_seen[balance - 1]`, remember this gives the length from `first_seen[balance - 1] + 1` to `i`. Since we want inclusive indices, this is correct.

## When You'll See This Pattern

This prefix sum + hash map pattern appears in several LeetCode problems:

1. **525. Contiguous Array**: Find the maximum length subarray with equal number of 0s and 1s. Very similar pattern but looking for sum = 0 instead of sum > 0.

2. **560. Subarray Sum Equals K**: Count subarrays that sum to k. Uses prefix sums and checks for `prefix[j] - k` in the map.

3. **930. Binary Subarrays With Sum**: Count subarrays with sum equal to goal. Similar to 560 but with binary arrays.

4. **1124. Longest Well-Performing Interval**: This problem itself! The pattern is recognizing when you need to find the longest subarray satisfying a condition on the difference between two types of elements.

The common thread is transforming the problem into a prefix sum problem, then using a hash map to efficiently find previous indices that satisfy some condition on the difference between prefix sums.

## Key Takeaways

1. **Transform binary conditions to +1/-1**: When you need to compare counts of two types of elements, converting to +1 and -1 simplifies the problem to finding subarrays with positive sum.

2. **Prefix sums + hash map for subarray problems**: For problems asking about subarray sums or counts, prefix sums with a hash map storing first occurrences is a powerful O(n) technique.

3. **Look for the minimal difference**: When searching for `prefix[j] > prefix[i]`, you only need to check for `prefix[j] - 1` because balances change incrementally. This optimization reduces O(n²) to O(n).

Remember: The hardest part is recognizing when this pattern applies. Look for problems where you need to find the longest subarray with some condition on the relative counts of two types of elements.

[Practice this problem on CodeJeet](/problem/longest-well-performing-interval)
