---
title: "How to Solve Kids With the Greatest Number of Candies — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Kids With the Greatest Number of Candies. Easy difficulty, 88.0% acceptance rate. Topics: Array."
date: "2026-07-16"
category: "dsa-patterns"
tags: ["kids-with-the-greatest-number-of-candies", "array", "easy"]
---

# How to Solve Kids With the Greatest Number of Candies

This problem asks us to determine which kids could have the greatest number of candies if they received all the extra candies. Given an array of candy counts for each kid and a number of extra candies to distribute, we need to return a boolean array indicating whether each kid could potentially have the most candies after receiving the extras. While conceptually simple, this problem tests your ability to work with arrays, find maximum values, and apply conditional logic—all fundamental skills for coding interviews.

## Visual Walkthrough

Let's walk through an example to build intuition. Suppose we have:

- `candies = [2, 3, 5, 1, 3]`
- `extraCandies = 3`

**Step 1: Find the current maximum**
First, we need to know what the current highest candy count is. Looking at the array:

- Kid 0: 2 candies
- Kid 1: 3 candies
- Kid 2: 5 candies (this is the current maximum)
- Kid 3: 1 candy
- Kid 4: 3 candies

So `max_candies = 5`

**Step 2: Check each kid with extra candies**
Now we check if each kid could reach or exceed this maximum with the extra candies:

- Kid 0: 2 + 3 = 5 → equals max_candies → **true**
- Kid 1: 3 + 3 = 6 → exceeds max_candies → **true**
- Kid 2: 5 + 3 = 8 → exceeds max_candies → **true**
- Kid 3: 1 + 3 = 4 → less than max_candies → **false**
- Kid 4: 3 + 3 = 6 → exceeds max_candies → **true**

**Step 3: Build the result array**
Our final result is: `[true, true, true, false, true]`

The key insight is that we only need to find the maximum once, then compare each kid's candies plus extras against that maximum.

## Brute Force Approach

A naive approach might involve comparing each kid against every other kid after adding extra candies. For each kid, we could:

1. Add extraCandies to their current candies
2. Check if this sum is greater than or equal to every other kid's current candies
3. This would require O(n²) comparisons

However, this is unnecessary and inefficient. The problem becomes much simpler when we realize that we're comparing against a fixed threshold—the current maximum. Any kid who starts with `max_candies` or whose candies plus extras reaches `max_candies` can potentially have the greatest number.

The brute force approach would look like this (inefficient O(n²) solution):

<div class="code-group">

```python
# Time: O(n²) | Space: O(n)
def kidsWithCandies(candies, extraCandies):
    n = len(candies)
    result = [False] * n

    for i in range(n):
        # Calculate total if this kid gets all extra candies
        potential_total = candies[i] + extraCandies

        # Check against all other kids
        is_greatest = True
        for j in range(n):
            if i != j and potential_total < candies[j]:
                is_greatest = False
                break

        result[i] = is_greatest

    return result
```

```javascript
// Time: O(n²) | Space: O(n)
function kidsWithCandies(candies, extraCandies) {
  const n = candies.length;
  const result = new Array(n).fill(false);

  for (let i = 0; i < n; i++) {
    // Calculate total if this kid gets all extra candies
    const potentialTotal = candies[i] + extraCandies;

    // Check against all other kids
    let isGreatest = true;
    for (let j = 0; j < n; j++) {
      if (i !== j && potentialTotal < candies[j]) {
        isGreatest = false;
        break;
      }
    }

    result[i] = isGreatest;
  }

  return result;
}
```

```java
// Time: O(n²) | Space: O(n)
public List<Boolean> kidsWithCandies(int[] candies, int extraCandies) {
    int n = candies.length;
    List<Boolean> result = new ArrayList<>();

    for (int i = 0; i < n; i++) {
        // Calculate total if this kid gets all extra candies
        int potentialTotal = candies[i] + extraCandies;

        // Check against all other kids
        boolean isGreatest = true;
        for (int j = 0; j < n; j++) {
            if (i != j && potentialTotal < candies[j]) {
                isGreatest = false;
                break;
            }
        }

        result.add(isGreatest);
    }

    return result;
}
```

</div>

This approach is inefficient because it does redundant comparisons. We're comparing each kid against all others, when we really just need to know the maximum value.

## Optimal Solution

The optimal solution finds the maximum candy count first, then checks each kid's potential total against that maximum. This reduces the time complexity from O(n²) to O(n).

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def kidsWithCandies(candies, extraCandies):
    """
    Determines which kids could have the greatest number of candies
    after receiving extra candies.

    Args:
        candies: List of integers representing each kid's current candies
        extraCandies: Integer representing additional candies to distribute

    Returns:
        List of booleans indicating if each kid could have the most candies
    """
    # Step 1: Find the maximum number of candies any kid currently has
    # We use max() which iterates through the list once - O(n) operation
    max_candies = max(candies)

    # Step 2: Initialize result list with the same length as candies
    result = []

    # Step 3: Check each kid's potential total against the maximum
    for candy_count in candies:
        # If current candies + extra candies >= current maximum,
        # this kid could have the greatest number
        result.append(candy_count + extraCandies >= max_candies)

    return result
```

```javascript
// Time: O(n) | Space: O(n)
function kidsWithCandies(candies, extraCandies) {
  /**
   * Determines which kids could have the greatest number of candies
   * after receiving extra candies.
   *
   * @param {number[]} candies - Array of each kid's current candies
   * @param {number} extraCandies - Additional candies to distribute
   * @return {boolean[]} - Array indicating if each kid could have the most candies
   */

  // Step 1: Find the maximum number of candies any kid currently has
  // Using Math.max with spread operator to find maximum - O(n) operation
  const maxCandies = Math.max(...candies);

  // Step 2: Initialize result array with the same length as candies
  const result = [];

  // Step 3: Check each kid's potential total against the maximum
  for (let i = 0; i < candies.length; i++) {
    // If current candies + extra candies >= current maximum,
    // this kid could have the greatest number
    result.push(candies[i] + extraCandies >= maxCandies);
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<Boolean> kidsWithCandies(int[] candies, int extraCandies) {
        /**
         * Determines which kids could have the greatest number of candies
         * after receiving extra candies.
         *
         * @param candies - Array of each kid's current candies
         * @param extraCandies - Additional candies to distribute
         * @return List indicating if each kid could have the most candies
         */

        // Step 1: Find the maximum number of candies any kid currently has
        int maxCandies = 0;
        for (int candy : candies) {
            if (candy > maxCandies) {
                maxCandies = candy;
            }
        }

        // Step 2: Initialize result list
        List<Boolean> result = new ArrayList<>();

        // Step 3: Check each kid's potential total against the maximum
        for (int candy : candies) {
            // If current candies + extra candies >= current maximum,
            // this kid could have the greatest number
            result.add(candy + extraCandies >= maxCandies);
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Finding the maximum requires one pass through the array: O(n)
- Building the result array requires another pass: O(n)
- Total: O(n) + O(n) = O(n)

**Space Complexity: O(n)**

- We need to store the result array of size n: O(n)
- The input array is given, so we don't count it toward space complexity
- Additional variables (max_candies, loop counters) use O(1) space
- Total: O(n) for the output array

## Common Mistakes

1. **Forgetting to find the maximum first**: Some candidates try to compare each kid against all others without realizing they can just compare against the maximum. This leads to O(n²) time complexity.

2. **Using strict greater-than comparison**: The problem says "greatest number of candies," which means "greater than or equal to" all others. If multiple kids end up with the same number, they all have the greatest number. Using `>` instead of `>=` would incorrectly mark some kids as false.

3. **Modifying the input array**: Some candidates add extraCandies to each element while checking, which modifies the original array. Always work with copies or temporary variables when you need to preserve input data.

4. **Incorrect edge case handling**:
   - Empty array: Should return an empty result array
   - Single kid: Should always return `[true]` since that kid will always have the most
   - All kids with same number of candies: All should return `true`

## When You'll See This Pattern

This problem uses the "find maximum then compare" pattern, which appears in many array problems:

1. **Find All Numbers Disappeared in an Array (LeetCode 448)**: Similar pattern of marking elements based on comparisons.
2. **Find the Duplicate Number (LeetCode 287)**: Uses array traversal and comparison techniques.
3. **Find All Duplicates in an Array (LeetCode 442)**: Another variation of marking and comparing array elements.

The core technique—finding an extremum (maximum or minimum) first, then using it as a reference point for other operations—is fundamental to many optimization problems.

## Key Takeaways

1. **Look for reference points**: When comparing elements against each other, check if you can find a single reference point (like maximum or minimum) to compare against, rather than comparing all pairs.

2. **Understand the comparison operator**: Pay attention to whether you need strict inequality (`>`, `<`) or inclusive inequality (`>=`, `<=`). In this case, "greatest" means "not less than any other," which translates to `>=`.

3. **Two-pass solutions are often optimal**: Don't be afraid to make multiple passes through data if it simplifies your logic. O(2n) is still O(n), and clear, correct code is better than clever but buggy one-pass solutions.

[Practice this problem on CodeJeet](/problem/kids-with-the-greatest-number-of-candies)
