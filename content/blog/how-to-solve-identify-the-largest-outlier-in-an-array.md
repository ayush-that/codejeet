---
title: "How to Solve Identify the Largest Outlier in an Array — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Identify the Largest Outlier in an Array. Medium difficulty, 36.2% acceptance rate. Topics: Array, Hash Table, Counting, Enumeration."
date: "2028-07-07"
category: "dsa-patterns"
tags: ["identify-the-largest-outlier-in-an-array", "array", "hash-table", "counting", "medium"]
---

## How to Solve "Identify the Largest Outlier in an Array"

This problem presents a clever twist on array analysis. You're given an array where exactly `n-2` elements are "special numbers," one of the remaining two is the sum of those special numbers, and the other is an "outlier" (a number that is NOT the sum). Your task is to identify which of these two non-special numbers is the outlier, and specifically return the **largest** outlier if there are multiple possibilities.

What makes this tricky is that you don't know which numbers are special, which is the sum, and which is the outlier. You need to deduce this from the relationships between the numbers. The constraint that exactly `n-2` elements are special is crucial—it means there are only two elements that could potentially be the sum or outlier.

---

## Visual Walkthrough

Let's trace through `nums = [2, 7, 11, 15, 9]`:

**Step 1: Understanding the setup**

- `n = 5`, so there are `n-2 = 3` special numbers
- Two numbers are NOT special: one is the sum of the 3 special numbers, the other is the outlier
- We need to figure out which is which

**Step 2: Testing possibilities**
If we try `9` as the sum candidate:

- Sum of special numbers would be 9
- The three special numbers would be from the remaining four: [2, 7, 11, 15]
- Can we pick three numbers from these four that sum to 9? No, the smallest three (2, 7, 11) sum to 20 > 9

If we try `15` as the sum candidate:

- Sum of special numbers would be 15
- Remaining numbers: [2, 7, 11, 9]
- Can we pick three that sum to 15? Yes: 2 + 7 + 9 = 18 ≠ 15, 2 + 7 + 11 = 20 ≠ 15, 2 + 11 + 9 = 22 ≠ 15, 7 + 11 + 9 = 27 ≠ 15
- None work, so 15 isn't the sum

If we try `11` as the sum candidate:

- Sum of special numbers would be 11
- Remaining: [2, 7, 15, 9]
- Can we pick three that sum to 11? 2 + 7 + 9 = 18 ≠ 11, 2 + 7 + 15 = 24 ≠ 11, etc.
- None work

If we try `2` as the sum candidate:

- Sum would be 2, but we need three positive integers from [7, 11, 15, 9] to sum to 2
- Impossible since all are > 2

If we try `7` as the sum candidate:

- Sum would be 7
- Remaining: [2, 11, 15, 9]
- Can we pick three that sum to 7? 2 is the only number < 7, so impossible

Wait—something's wrong. Let me reconsider...

**Step 3: The key insight**
Actually, we need to think differently. The sum is the sum of ALL `n-2` special numbers. So if we pick a candidate for the sum, the remaining `n-1` numbers must contain exactly `n-2` special numbers whose sum equals our candidate.

Better approach: For each number in the array, check if it could be the sum. If it is, then the other non-special number must be the outlier.

**Step 4: Correct reasoning for [2, 7, 11, 15, 9]**
Total sum of all numbers = 2 + 7 + 11 + 15 + 9 = 44

If `x` is the sum of special numbers and `y` is the outlier:

- Sum of all numbers = x + y + (sum of special numbers)
- But sum of special numbers = x
- So: total = x + y + x = 2x + y
- Therefore: y = total - 2x

So for each candidate `x`, we check if `y = total - 2x` exists in the array (and y ≠ x). If it does, then `y` is a valid outlier.

**Step 5: Testing with formula**
Total = 44

For x = 2: y = 44 - 4 = 40 (not in array) ❌
For x = 7: y = 44 - 14 = 30 (not in array) ❌  
For x = 11: y = 44 - 22 = 22 (not in array) ❌
For x = 15: y = 44 - 30 = 14 (not in array) ❌
For x = 9: y = 44 - 18 = 26 (not in array) ❌

Hmm, maybe my example doesn't work. Let's use a valid example:

**Valid example: nums = [1, 2, 3, 6, 5]**
Total = 17
Special numbers: 1, 2, 3 (sum = 6)
Sum of specials: 6
Outlier: 5

Check with formula:
For x = 6: y = 17 - 12 = 5 ✓ (5 exists in array and ≠ 6)
So outlier = 5

If we also had another valid configuration, we'd return the largest outlier.

---

## Brute Force Approach

A naive approach would be to try every possible partition of the array into:

- `n-2` special numbers
- 1 sum (of those special numbers)
- 1 outlier

We'd need to check all combinations of which 2 numbers are non-special, then for each choice, check if one equals the sum of the other `n-2` numbers.

This requires checking C(n, 2) = O(n²) pairs of non-special candidates, and for each, checking if one equals the sum of the remaining n-2 numbers (O(n) time to compute sum). Total: O(n³) time.

This is clearly too slow for n up to 10⁵ (typical constraints).

```python
# Brute force - O(n³) time, O(1) space
def findLargestOutlierBrute(nums):
    n = len(nums)
    max_outlier = float('-inf')

    # Try every pair as potential (sum, outlier)
    for i in range(n):
        for j in range(i+1, n):
            # Try nums[i] as sum, nums[j] as outlier
            special_sum = 0
            for k in range(n):
                if k != i and k != j:
                    special_sum += nums[k]

            if special_sum == nums[i]:
                max_outlier = max(max_outlier, nums[j])

            # Try nums[j] as sum, nums[i] as outlier
            special_sum = 0
            for k in range(n):
                if k != i and k != j:
                    special_sum += nums[k]

            if special_sum == nums[j]:
                max_outlier = max(max_outlier, nums[i])

    return max_outlier
```

The brute force fails because:

1. O(n³) is impractical for large n
2. We're recomputing the sum of special numbers repeatedly
3. We need to optimize by using mathematical relationships

---

## Optimized Approach

The key insight comes from algebraic manipulation:

Let:

- `total` = sum of all elements in nums
- `x` = the sum of the special numbers (one of the two non-special elements)
- `y` = the outlier (the other non-special element)

We know:

1. There are `n-2` special numbers, and their sum is `x`
2. The total sum includes: `x` (sum of specials) + `x` (the element that IS the sum) + `y` (outlier)
   Wait, careful: The total includes all special numbers (sum = x) PLUS the two non-special numbers (x and y)

So: `total = x + y + x = 2x + y`

Therefore: `y = total - 2x`

**Algorithm:**

1. Compute total sum of all elements
2. Count frequency of each number using a hash map
3. For each unique number `x` in the array:
   - Compute `y = total - 2*x`
   - Check if `y` exists in the array
   - Handle the case where `y == x` (need at least 2 occurrences of x)
4. Track the maximum valid `y` found
5. Return that maximum

**Why this works:**
We're testing each element as the potential "sum of special numbers" (x). If `y = total - 2x` exists in the array, it means we've found a valid configuration where x is the sum and y is the outlier. We need to ensure x and y are distinct elements (or x appears at least twice if y = x).

---

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def findLargestOutlier(nums):
    """
    Find the largest outlier in the array where:
    - n-2 elements are special numbers
    - One of the remaining two is the sum of those special numbers
    - The other is the outlier
    """
    # Step 1: Compute total sum and count frequencies
    total = sum(nums)
    freq = {}
    for num in nums:
        freq[num] = freq.get(num, 0) + 1

    # Step 2: Track the largest valid outlier found
    max_outlier = float('-inf')

    # Step 3: Check each unique number as potential sum (x)
    for x in freq:
        # Calculate the corresponding outlier y using derived formula
        y = total - 2 * x

        # Check if y exists in the array
        if y in freq:
            # Special case: if y == x, we need at least 2 occurrences of x
            # because x appears both as the sum and as itself in the array
            if y == x and freq[x] < 2:
                continue  # Not enough occurrences, skip

            # Found a valid configuration where x is sum and y is outlier
            max_outlier = max(max_outlier, y)

    return max_outlier
```

```javascript
// Time: O(n) | Space: O(n)
function findLargestOutlier(nums) {
  // Step 1: Compute total sum and count frequencies
  let total = 0;
  const freq = new Map();

  for (const num of nums) {
    total += num;
    freq.set(num, (freq.get(num) || 0) + 1);
  }

  // Step 2: Track the largest valid outlier found
  let maxOutlier = -Infinity;

  // Step 3: Check each unique number as potential sum (x)
  for (const [x, count] of freq) {
    // Calculate the corresponding outlier y using derived formula
    const y = total - 2 * x;

    // Check if y exists in the array
    if (freq.has(y)) {
      // Special case: if y == x, we need at least 2 occurrences of x
      if (y === x && count < 2) {
        continue; // Not enough occurrences, skip
      }

      // Found a valid configuration where x is sum and y is outlier
      maxOutlier = Math.max(maxOutlier, y);
    }
  }

  return maxOutlier;
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.*;

public class Solution {
    public int findLargestOutlier(int[] nums) {
        // Step 1: Compute total sum and count frequencies
        long total = 0; // Use long to avoid integer overflow
        Map<Integer, Integer> freq = new HashMap<>();

        for (int num : nums) {
            total += num;
            freq.put(num, freq.getOrDefault(num, 0) + 1);
        }

        // Step 2: Track the largest valid outlier found
        int maxOutlier = Integer.MIN_VALUE;

        // Step 3: Check each unique number as potential sum (x)
        for (Map.Entry<Integer, Integer> entry : freq.entrySet()) {
            int x = entry.getKey();
            int count = entry.getValue();

            // Calculate the corresponding outlier y using derived formula
            long yLong = total - 2L * x; // Use long for calculation

            // Check if y is within integer range and exists in the array
            if (yLong < Integer.MIN_VALUE || yLong > Integer.MAX_VALUE) {
                continue; // y is out of integer range, skip
            }

            int y = (int) yLong;

            if (freq.containsKey(y)) {
                // Special case: if y == x, we need at least 2 occurrences of x
                if (y == x && count < 2) {
                    continue; // Not enough occurrences, skip
                }

                // Found a valid configuration where x is sum and y is outlier
                if (y > maxOutlier) {
                    maxOutlier = y;
                }
            }
        }

        return maxOutlier;
    }
}
```

</div>

---

## Complexity Analysis

**Time Complexity: O(n)**

- Computing the sum of all elements: O(n)
- Building the frequency map: O(n)
- Iterating through unique elements in the map: O(n) in worst case (all elements distinct)
- Each map lookup (for `y in freq`) is O(1) on average
- Total: O(n) + O(n) + O(n) \* O(1) = O(n)

**Space Complexity: O(n)**

- The frequency map stores at most n key-value pairs
- In worst case when all elements are distinct, we store n entries
- Additional variables use O(1) space

---

## Common Mistakes

1. **Not handling the y == x case properly**: When the calculated outlier equals the sum candidate, you need to check that the number appears at least twice in the array. Otherwise, you'd be using the same element as both the sum and the outlier, which is invalid since they must be distinct elements.

2. **Integer overflow**: When computing `total - 2*x`, the intermediate result might exceed 32-bit integer bounds, especially with large n and large numbers. Always use 64-bit integers (long in Java, no issue in Python).

3. **Forgetting there might be multiple valid outliers**: The problem asks for the _largest_ outlier, so you must track the maximum, not just return the first valid one found.

4. **Misunderstanding the problem statement**: Some candidates think the "sum" is the sum of ALL other numbers, but it's specifically the sum of the `n-2` special numbers. The outlier is NOT included in the sum calculation.

---

## When You'll See This Pattern

This problem combines **mathematical derivation** with **hash map lookups**, a pattern common in array problems where you need to find elements satisfying specific relationships.

Related LeetCode problems:

1. **Two Sum** - Uses hash map to find complement (y = target - x)
2. **Find the Duplicate Number** - Uses mathematical relationships or frequency counting
3. **Subarray Sum Equals K** - Uses prefix sums and hash maps to find subarrays with specific sums

The core technique is: derive a mathematical relationship between elements, then use efficient data structures (hash maps) to check for existence of required values.

---

## Key Takeaways

1. **Derive before you code**: Many array problems have hidden mathematical relationships. Before jumping to implementation, spend time deriving formulas from the problem constraints (like `total = 2x + y` here).

2. **Hash maps enable O(1) lookups**: When you need to check if a computed value exists in the array, a frequency map turns O(n) searches into O(1) lookups.

3. **Handle edge cases explicitly**: The `y == x` case shows why you must think through all possibilities, not just the happy path. Always test with small, diverse examples.

[Practice this problem on CodeJeet](/problem/identify-the-largest-outlier-in-an-array)
