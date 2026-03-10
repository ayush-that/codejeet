---
title: "How to Solve Form Smallest Number From Two Digit Arrays — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Form Smallest Number From Two Digit Arrays. Easy difficulty, 55.0% acceptance rate. Topics: Array, Hash Table, Enumeration."
date: "2028-07-26"
category: "dsa-patterns"
tags: ["form-smallest-number-from-two-digit-arrays", "array", "hash-table", "enumeration", "easy"]
---

# How to Solve "Form Smallest Number From Two Digit Arrays"

This problem asks us to find the smallest possible number that contains at least one digit from each of two arrays of unique digits. While it's categorized as "Easy," the subtlety lies in recognizing that the smallest number can be either a single digit (if both arrays share a common digit) or a two-digit number formed by the smallest digits from each array. The challenge is efficiently checking for common digits and finding minimums.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose we have:

- `nums1 = [4, 1, 3]`
- `nums2 = [5, 7]`

**Step 1: Check for common digits**
We look for any digit that appears in both arrays. Scanning through:

- 4 is not in [5, 7]
- 1 is not in [5, 7]
- 3 is not in [5, 7]

No common digit exists, so we can't form a single-digit answer.

**Step 2: Find smallest digits from each array**

- Smallest in `nums1` is 1
- Smallest in `nums2` is 5

**Step 3: Form the smallest two-digit number**
We need to arrange these two digits to make the smallest possible number. Compare:

- Option 1: 15 (1 followed by 5)
- Option 2: 51 (5 followed by 1)

15 is smaller than 51, so our answer is 15.

**Another example:** `nums1 = [3, 5, 2, 6]`, `nums2 = [9, 2, 4]`

**Step 1: Check for common digits**

- 2 appears in both arrays!

**Step 2: Since we found a common digit, that's our answer**
The smallest number containing at least one digit from each array is simply 2 (a single digit).

The key insight: if there's any common digit, the answer is the smallest common digit. Otherwise, we take the smallest digit from each array and arrange them as `min(min1, min2) * 10 + max(min1, min2)`.

## Brute Force Approach

A naive approach would be to generate all possible numbers that contain at least one digit from each array and find the smallest. For arrays of size n and m:

1. Find all single digits that appear in both arrays (common digits)
2. Find all two-digit combinations where first digit is from nums1 and second from nums2
3. Find all two-digit combinations where first digit is from nums2 and second from nums1
4. From all these candidates, pick the smallest

This brute force would have O(n × m) time complexity since we'd check every pair. While this might be acceptable for small inputs (digits are only 0-9, so arrays are at most size 10), we can do better with a more direct approach.

The more common "naive" mistake is not recognizing that when there's no common digit, we need to compare both possible orderings of the two smallest digits. Some candidates might just concatenate the two smallest digits in the order they appear, which could give the wrong answer.

## Optimal Solution

The optimal solution has three clear steps:

1. Check if there's any common digit between the arrays
2. If yes, return the smallest common digit
3. If no, find the smallest digit in each array, then return `min(a,b)*10 + max(a,b)`

We can efficiently check for common digits using a set for O(1) lookups.

<div class="code-group">

```python
# Time: O(n + m) where n = len(nums1), m = len(nums2)
# Space: O(min(n, m)) for the set
def minNumber(nums1, nums2):
    """
    Find the smallest number containing at least one digit from each array.

    Approach:
    1. Convert the smaller array to a set for efficient lookup
    2. Find common digits and track the smallest common digit
    3. If common digit exists, return it (single digit answer)
    4. Otherwise, find smallest digit in each array
    5. Return the two-digit number formed by smaller digit as tens place
    """
    # Convert nums2 to set for O(1) lookups
    # We could convert the smaller array to optimize space
    set2 = set(nums2)

    # Track smallest common digit
    smallest_common = float('inf')

    # Check each digit in nums1 against set2
    for num in nums1:
        if num in set2:
            # Found a common digit, update smallest
            smallest_common = min(smallest_common, num)

    # If we found at least one common digit
    if smallest_common != float('inf'):
        return smallest_common

    # No common digit, find smallest in each array
    min1 = min(nums1)
    min2 = min(nums2)

    # Form the smallest two-digit number
    # Put the smaller digit in tens place for smaller overall number
    if min1 < min2:
        return min1 * 10 + min2
    else:
        return min2 * 10 + min1
```

```javascript
// Time: O(n + m) where n = nums1.length, m = nums2.length
// Space: O(min(n, m)) for the set
function minNumber(nums1, nums2) {
  /**
   * Find the smallest number containing at least one digit from each array.
   *
   * Steps:
   * 1. Create a Set from nums2 for O(1) lookups
   * 2. Find the smallest common digit between arrays
   * 3. If common digit exists, return it
   * 4. Otherwise, find min in each array and form two-digit number
   */

  // Convert nums2 to Set for efficient lookup
  const set2 = new Set(nums2);

  // Track smallest common digit
  let smallestCommon = Infinity;

  // Check each digit in nums1 against the set
  for (const num of nums1) {
    if (set2.has(num)) {
      // Update smallest common digit found so far
      smallestCommon = Math.min(smallestCommon, num);
    }
  }

  // If we found a common digit, return it
  if (smallestCommon !== Infinity) {
    return smallestCommon;
  }

  // No common digit, find minimums
  const min1 = Math.min(...nums1);
  const min2 = Math.min(...nums2);

  // Form smallest two-digit number
  // Put smaller digit in tens place
  if (min1 < min2) {
    return min1 * 10 + min2;
  } else {
    return min2 * 10 + min1;
  }
}
```

```java
// Time: O(n + m) where n = nums1.length, m = nums2.length
// Space: O(min(n, m)) for the HashSet
class Solution {
    public int minNumber(int[] nums1, int[] nums2) {
        /**
         * Find the smallest number containing at least one digit from each array.
         *
         * Algorithm:
         * 1. Store digits of nums2 in HashSet for O(1) lookup
         * 2. Find smallest digit present in both arrays
         * 3. If found, return that digit
         * 4. Otherwise, find min in each array and form two-digit number
         */

        // Create HashSet from nums2 for efficient lookups
        Set<Integer> set2 = new HashSet<>();
        for (int num : nums2) {
            set2.add(num);
        }

        // Track smallest common digit
        int smallestCommon = Integer.MAX_VALUE;

        // Check each digit in nums1 against the set
        for (int num : nums1) {
            if (set2.contains(num)) {
                // Update smallest common digit
                smallestCommon = Math.min(smallestCommon, num);
            }
        }

        // If common digit exists, return it
        if (smallestCommon != Integer.MAX_VALUE) {
            return smallestCommon;
        }

        // Find minimum in each array
        int min1 = Integer.MAX_VALUE;
        int min2 = Integer.MAX_VALUE;

        for (int num : nums1) {
            min1 = Math.min(min1, num);
        }

        for (int num : nums2) {
            min2 = Math.min(min2, num);
        }

        // Form smallest two-digit number
        // Put smaller digit in tens place
        if (min1 < min2) {
            return min1 * 10 + min2;
        } else {
            return min2 * 10 + min1;
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + m)**

- Converting one array to a set takes O(m) time (or O(n) if we convert the smaller one)
- Checking for common digits takes O(n) time (iterating through first array)
- Finding minimums takes O(n + m) time (if we didn't track them during iteration)
- Overall linear in the total number of elements

**Space Complexity: O(min(n, m))**

- We store one array in a hash set
- By converting the smaller array to a set, we use O(min(n, m)) space
- The rest uses O(1) additional space

## Common Mistakes

1. **Not checking both orderings for two-digit number**: When there's no common digit, simply concatenating `min1` and `min2` as `min1min2` might not give the smallest number. For example, if `min1=3` and `min2=1`, `31` is larger than `13`. Always compare both `min1*10+min2` and `min2*10+min1`.

2. **Overlooking single-digit solution**: Some candidates jump straight to forming a two-digit number without checking if a single common digit exists. Remember: if there's any digit present in both arrays, that single digit is always smaller than any two-digit number.

3. **Inefficient common digit search**: Checking common digits with nested loops (O(n×m)) is unnecessary. Using a set reduces this to O(n+m). Even though digits are limited to 0-9, showing efficient thinking matters in interviews.

4. **Not handling the "no common digit" case explicitly**: Make sure your code clearly separates the two cases. A clean if-else structure is better than trying to combine logic that handles both cases.

## When You'll See This Pattern

This problem combines several fundamental patterns:

1. **Set-based membership testing**: Using a hash set for O(1) lookups appears in problems like:
   - **Two Sum** (LeetCode 1): Store complements in a hash map for quick lookup
   - **Intersection of Two Arrays** (LeetCode 349): Find common elements between arrays

2. **Min/Max tracking with early termination**: The pattern of tracking minimums while iterating appears in:
   - **Best Time to Buy and Sell Stock** (LeetCode 121): Track minimum price seen so far
   - **Maximum Subarray** (LeetCode 53): Track current and maximum sums

3. **Digit manipulation and number formation**: Problems involving digits and numbers:
   - **Add Two Numbers** (LeetCode 2): Digit-by-digit addition with carry
   - **Plus One** (LeetCode 66): Incrementing a number represented as array of digits

## Key Takeaways

1. **Always check for the simplest case first**: In this problem, checking for a common single-digit solution before forming two-digit numbers is crucial. This pattern of checking edge cases or special conditions early applies to many problems.

2. **Use appropriate data structures for membership testing**: When you need to check if elements exist in another collection, consider using a hash set for O(1) lookups instead of O(n) linear searches.

3. **Think about number properties**: The insight that a single digit is always smaller than any two-digit number (since 0-9 < 10-99) is key. Recognizing such mathematical properties can simplify many coding problems.

[Practice this problem on CodeJeet](/problem/form-smallest-number-from-two-digit-arrays)
