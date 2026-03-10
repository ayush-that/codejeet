---
title: "How to Solve Find Missing Elements — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find Missing Elements. Easy difficulty, 82.9% acceptance rate. Topics: Array, Hash Table, Sorting."
date: "2028-05-11"
category: "dsa-patterns"
tags: ["find-missing-elements", "array", "hash-table", "sorting", "easy"]
---

# How to Solve Find Missing Elements

This problem asks us to find all missing integers between the smallest and largest numbers in an array, where the original range included every integer between these endpoints. The challenge is that the array is unsorted, contains unique elements, and we need to efficiently identify gaps in what should be a continuous sequence.

**What makes this interesting:** While the problem seems straightforward, efficient solutions require careful consideration of data structures. The brute force approach is intuitive but inefficient, while optimal solutions leverage either sorting or hash sets to achieve better performance. The constraint that the smallest and largest numbers are guaranteed to be present simplifies boundary checking.

## Visual Walkthrough

Let's trace through an example: `nums = [5, 2, 8, 4, 9]`

1. **Identify range boundaries:** The smallest number is 2, the largest is 9. So the original complete range should have been `[2, 3, 4, 5, 6, 7, 8, 9]`.

2. **Compare with given array:** Our array has `[2, 4, 5, 8, 9]`.

3. **Find missing elements:** By comparing the complete range with our array:
   - 3 is missing (present in range, not in array)
   - 6 is missing (present in range, not in array)
   - 7 is missing (present in range, not in array)

4. **Result:** The missing elements are `[3, 6, 7]`.

The key insight is that we don't need to generate the complete range explicitly. We can work directly with the numbers we have to identify gaps.

## Brute Force Approach

A naive approach would be:

1. Find the minimum and maximum values in the array
2. Create a complete list of all numbers from min to max
3. For each number in the complete list, check if it exists in the original array
4. If not found, add it to the missing elements list

**Why this is inefficient:** For each number in the range (which could be up to n numbers if the array is dense), we need to search through the entire array to check if it exists. This results in O(n²) time complexity in the worst case, where n is the size of the array.

**What a naive candidate might try:** Some might try nested loops - for each number in the range, loop through the array to check for its presence. This works but is too slow for larger inputs.

## Optimal Solution

We have two efficient approaches:

### Approach 1: Using a Hash Set (Most Efficient)

1. Convert the array to a set for O(1) lookups
2. Find the minimum and maximum values
3. Iterate from min+1 to max-1, checking if each number exists in the set
4. Collect numbers not found in the set

**Time Complexity:** O(n) - we create the set once (O(n)) and iterate through the range (O(range size), which is at most O(n) if the array is dense)
**Space Complexity:** O(n) for the hash set

### Approach 2: Using Sorting

1. Sort the array
2. Iterate through sorted array, looking for gaps between consecutive elements
3. For each gap, add all missing numbers between the two elements

**Time Complexity:** O(n log n) due to sorting
**Space Complexity:** O(1) extra space (excluding output)

The hash set approach is generally preferred as it has better time complexity and is more intuitive.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def findMissingElements(nums):
    """
    Find all missing integers between the smallest and largest numbers in nums.

    Args:
        nums: List of unique integers

    Returns:
        List of missing integers in ascending order
    """
    # Edge case: if array has 0 or 1 elements, no numbers can be missing between them
    if len(nums) <= 1:
        return []

    # Step 1: Convert array to set for O(1) lookups
    # This allows us to quickly check if a number exists in the original array
    num_set = set(nums)

    # Step 2: Find the minimum and maximum values
    # We know these exist in the array per problem constraints
    min_val = min(nums)
    max_val = max(nums)

    # Step 3: Initialize result list
    missing = []

    # Step 4: Check every number between min and max (exclusive)
    # We start from min+1 because min is guaranteed to be present
    # We end at max because range() excludes the stop value
    for num in range(min_val + 1, max_val):
        # If number is not in the original array, it's missing
        if num not in num_set:
            missing.append(num)

    return missing
```

```javascript
// Time: O(n) | Space: O(n)
function findMissingElements(nums) {
  /**
   * Find all missing integers between the smallest and largest numbers in nums.
   *
   * @param {number[]} nums - Array of unique integers
   * @return {number[]} - Array of missing integers in ascending order
   */

  // Edge case: if array has 0 or 1 elements, no numbers can be missing between them
  if (nums.length <= 1) {
    return [];
  }

  // Step 1: Convert array to set for O(1) lookups
  // Using a Set allows constant-time membership checks
  const numSet = new Set(nums);

  // Step 2: Find the minimum and maximum values
  // Math.min/max with spread operator works well for this
  const minVal = Math.min(...nums);
  const maxVal = Math.max(...nums);

  // Step 3: Initialize result array
  const missing = [];

  // Step 4: Check every number between min and max (exclusive)
  // We iterate from min+1 to max-1 since endpoints are guaranteed present
  for (let num = minVal + 1; num < maxVal; num++) {
    // If number is not in the original array, it's missing
    if (!numSet.has(num)) {
      missing.push(num);
    }
  }

  return missing;
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.*;

public class Solution {
    public List<Integer> findMissingElements(int[] nums) {
        /**
         * Find all missing integers between the smallest and largest numbers in nums.
         *
         * @param nums - Array of unique integers
         * @return List of missing integers in ascending order
         */

        // Edge case: if array has 0 or 1 elements, no numbers can be missing between them
        if (nums.length <= 1) {
            return new ArrayList<>();
        }

        // Step 1: Convert array to set for O(1) lookups
        // HashSet provides average O(1) time for contains() operation
        Set<Integer> numSet = new HashSet<>();
        for (int num : nums) {
            numSet.add(num);
        }

        // Step 2: Find the minimum and maximum values
        // We need to manually find min/max since arrays aren't sorted
        int minVal = Integer.MAX_VALUE;
        int maxVal = Integer.MIN_VALUE;
        for (int num : nums) {
            if (num < minVal) minVal = num;
            if (num > maxVal) maxVal = num;
        }

        // Step 3: Initialize result list
        List<Integer> missing = new ArrayList<>();

        // Step 4: Check every number between min and max (exclusive)
        // We start from min+1 because min is guaranteed to be present
        // We end before max because max is also guaranteed present
        for (int num = minVal + 1; num < maxVal; num++) {
            // If number is not in the original array, it's missing
            if (!numSet.contains(num)) {
                missing.add(num);
            }
        }

        return missing;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Creating the hash set: O(n) where n is the number of elements in the array
- Finding min and max: O(n) - we traverse the array once
- Checking numbers in range: O(k) where k is the size of the range (max - min - 1)
- In the worst case, if the array contains every other number, k ≈ n, so total is O(n + n + n) = O(n)

**Space Complexity: O(n)**

- The hash set stores all n elements from the array: O(n)
- The output list in worst case could store O(n) missing elements
- Total auxiliary space: O(n)

**Why this is optimal:** We need to examine each element at least once to know what we have, so Ω(n) is a lower bound. Our solution achieves O(n), making it asymptotically optimal.

## Common Mistakes

1. **Forgetting that endpoints are guaranteed present:** Some candidates check from `min` to `max` inclusive, adding unnecessary checks. Remember: the problem states the smallest and largest integers are still present, so we only need to check from `min+1` to `max-1`.

2. **Not handling small arrays correctly:** With 0 or 1 elements, there are no missing numbers between endpoints (there are no endpoints or only one endpoint). Always check for these edge cases.

3. **Using array search instead of hash set:** The temptation to use `if num in nums` in Python or similar linear searches in other languages leads to O(n²) time. Always convert to a set/dictionary for O(1) lookups when you need frequent membership tests.

4. **Assuming sorted input:** The problem doesn't state the array is sorted. Never assume input ordering unless explicitly stated. Always check or sort explicitly if needed.

## When You'll See This Pattern

This "find missing elements in a range" pattern appears in various forms:

1. **LeetCode 448: Find All Numbers Disappeared in an Array** - Similar concept but with the twist that numbers are in the range [1, n] and some appear twice. Uses the same "mark seen numbers" approach.

2. **LeetCode 268: Missing Number** - Simpler version where exactly one number is missing from 0 to n. Can be solved with XOR or sum approaches.

3. **LeetCode 41: First Missing Positive** - More challenging variant that requires finding the smallest missing positive integer with O(n) time and O(1) space.

The core technique of using a hash set for O(1) membership tests is fundamental to many array problems where you need to track which elements you've seen.

## Key Takeaways

1. **Hash sets are your friend for membership testing:** When you need to repeatedly check if elements exist in a collection, convert to a set first for O(1) lookups instead of O(n) linear searches.

2. **Range-based problems often have simple solutions:** Don't overcomplicate - sometimes just iterating through the range and checking membership is the cleanest approach.

3. **Always verify problem constraints:** The guarantee that endpoints exist simplifies the solution. In interview settings, carefully note all given constraints - they're usually there to help you.

4. **Consider both time and space trade-offs:** The hash set approach uses O(n) extra space for O(n) time. If space is constrained, the sorting approach uses O(1) extra space but O(n log n) time.

[Practice this problem on CodeJeet](/problem/find-missing-elements)
