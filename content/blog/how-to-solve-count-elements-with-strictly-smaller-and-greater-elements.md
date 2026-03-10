---
title: "How to Solve Count Elements With Strictly Smaller and Greater Elements  — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Count Elements With Strictly Smaller and Greater Elements . Easy difficulty, 59.8% acceptance rate. Topics: Array, Sorting, Counting."
date: "2027-11-08"
category: "dsa-patterns"
tags:
  [
    "count-elements-with-strictly-smaller-and-greater-elements",
    "array",
    "sorting",
    "counting",
    "easy",
  ]
---

# How to Solve Count Elements With Strictly Smaller and Greater Elements

This problem asks us to count how many numbers in an array have **both** at least one smaller number and at least one larger number somewhere in the array. While it's categorized as Easy, the subtlety lies in understanding what qualifies as "strictly smaller" and "strictly greater" — a number must have at least one other number that's smaller than it AND at least one other number that's larger than it. The interesting part is that we don't need to know which specific elements are smaller or larger, just whether they exist.

## Visual Walkthrough

Let's trace through an example: `nums = [11, 7, 2, 15, 2, 7, 11]`

**Step 1: Understand what we're looking for**

- For an element to count, there must be at least one number < element AND at least one number > element
- Elements that are the minimum or maximum of the entire array cannot qualify

**Step 2: Find the range of valid elements**
First, let's find the minimum and maximum values:

- Minimum: 2 (appears at indices 2 and 4)
- Maximum: 15 (appears at index 3)

**Step 3: Check each element**

- 11: Is 11 > 2? Yes. Is 11 < 15? Yes. ✓ Counts
- 7: Is 7 > 2? Yes. Is 7 < 15? Yes. ✓ Counts
- 2: Is 2 > 2? No (needs to be strictly greater than minimum). ✗ Doesn't count
- 15: Is 15 > 2? Yes. Is 15 < 15? No (needs to be strictly less than maximum). ✗ Doesn't count
- 2: Same as first 2 ✗
- 7: Same as first 7 ✓
- 11: Same as first 11 ✓

**Step 4: Count valid elements**
Valid elements: 11, 7, 7, 11 → 4 elements

So for `[11, 7, 2, 15, 2, 7, 11]`, the answer is 4.

## Brute Force Approach

A naive approach would be: for each element, scan the entire array to check if there exists at least one smaller element AND at least one larger element.

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def countElements(nums):
    count = 0
    n = len(nums)

    for i in range(n):
        has_smaller = False
        has_larger = False

        # Check all other elements
        for j in range(n):
            if i == j:
                continue  # Skip comparing with itself

            if nums[j] < nums[i]:
                has_smaller = True
            elif nums[j] > nums[i]:
                has_larger = True

            # Early exit if we found both
            if has_smaller and has_larger:
                break

        if has_smaller and has_larger:
            count += 1

    return count
```

```javascript
// Time: O(n²) | Space: O(1)
function countElements(nums) {
  let count = 0;
  const n = nums.length;

  for (let i = 0; i < n; i++) {
    let hasSmaller = false;
    let hasLarger = false;

    // Check all other elements
    for (let j = 0; j < n; j++) {
      if (i === j) continue; // Skip comparing with itself

      if (nums[j] < nums[i]) {
        hasSmaller = true;
      } else if (nums[j] > nums[i]) {
        hasLarger = true;
      }

      // Early exit if we found both
      if (hasSmaller && hasLarger) break;
    }

    if (hasSmaller && hasLarger) {
      count++;
    }
  }

  return count;
}
```

```java
// Time: O(n²) | Space: O(1)
public int countElements(int[] nums) {
    int count = 0;
    int n = nums.length;

    for (int i = 0; i < n; i++) {
        boolean hasSmaller = false;
        boolean hasLarger = false;

        // Check all other elements
        for (int j = 0; j < n; j++) {
            if (i == j) continue;  // Skip comparing with itself

            if (nums[j] < nums[i]) {
                hasSmaller = true;
            } else if (nums[j] > nums[i]) {
                hasLarger = true;
            }

            // Early exit if we found both
            if (hasSmaller && hasLarger) break;
        }

        if (hasSmaller && hasLarger) {
            count++;
        }
    }

    return count;
}
```

</div>

**Why this is inefficient:**

- Time complexity is O(n²) where n is the array length
- For each of n elements, we potentially scan all n elements
- With n up to 100 (typical LeetCode constraints), this is 10,000 operations
- While technically acceptable for small inputs, it's not optimal and shows poor problem-solving skills

## Optimal Solution

The key insight: An element qualifies if and only if it's **strictly greater than the minimum** AND **strictly less than the maximum** of the entire array. We don't need to know which specific elements are smaller/larger, just whether such elements exist somewhere in the array.

**Algorithm:**

1. Find the minimum and maximum values in the array
2. Count how many elements are strictly between these two values

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def countElements(nums):
    # Edge case: if array has less than 3 elements, impossible to have
    # both smaller and greater elements
    if len(nums) < 3:
        return 0

    # Step 1: Find minimum and maximum values in the array
    min_val = min(nums)  # O(n) operation
    max_val = max(nums)  # O(n) operation

    # Step 2: Count elements strictly between min and max
    count = 0
    for num in nums:
        # Check if current number is strictly greater than minimum
        # AND strictly less than maximum
        if min_val < num < max_val:
            count += 1

    return count
```

```javascript
// Time: O(n) | Space: O(1)
function countElements(nums) {
  // Edge case: if array has less than 3 elements, impossible to have
  // both smaller and greater elements
  if (nums.length < 3) {
    return 0;
  }

  // Step 1: Find minimum and maximum values in the array
  let minVal = Math.min(...nums); // O(n) operation
  let maxVal = Math.max(...nums); // O(n) operation

  // Step 2: Count elements strictly between min and max
  let count = 0;
  for (let num of nums) {
    // Check if current number is strictly greater than minimum
    // AND strictly less than maximum
    if (minVal < num && num < maxVal) {
      count++;
    }
  }

  return count;
}
```

```java
// Time: O(n) | Space: O(1)
public int countElements(int[] nums) {
    // Edge case: if array has less than 3 elements, impossible to have
    // both smaller and greater elements
    if (nums.length < 3) {
        return 0;
    }

    // Step 1: Find minimum and maximum values in the array
    int minVal = Integer.MAX_VALUE;
    int maxVal = Integer.MIN_VALUE;

    for (int num : nums) {
        if (num < minVal) {
            minVal = num;
        }
        if (num > maxVal) {
            maxVal = num;
        }
    }

    // Step 2: Count elements strictly between min and max
    int count = 0;
    for (int num : nums) {
        // Check if current number is strictly greater than minimum
        // AND strictly less than maximum
        if (minVal < num && num < maxVal) {
            count++;
        }
    }

    return count;
}
```

</div>

**Why this works:**

- If an element equals the minimum, there's no strictly smaller element
- If an element equals the maximum, there's no strictly larger element
- Only elements strictly between min and max have both smaller and larger elements
- This works even with duplicate values because we're comparing against the global min/max

## Complexity Analysis

**Time Complexity: O(n)**

- Finding minimum: O(n) - one pass through the array
- Finding maximum: O(n) - one pass through the array (can be combined with min finding)
- Counting valid elements: O(n) - one pass through the array
- Total: O(n) + O(n) + O(n) = O(3n) = O(n)

**Space Complexity: O(1)**

- We only use a constant amount of extra space (min_val, max_val, count)
- No additional data structures that grow with input size

## Common Mistakes

1. **Forgetting the "strictly" requirement**: Some candidates check `min_val <= num <= max_val` instead of `min_val < num < max_val`. Remember, if a number equals the minimum, there's no number strictly smaller than it in the array.

2. **Not handling small arrays**: With fewer than 3 elements, it's impossible to have an element with both smaller and greater elements. The edge case `nums.length < 3` should return 0.

3. **Overcomplicating with sorting**: Some candidates sort the array first (O(n log n)), then try to find the first and last occurrence of min/max. While this works, it's less efficient than the O(n) solution and unnecessary.

4. **Counting min/max occurrences incorrectly**: Remember that multiple elements can have the minimum or maximum value. All of them should be excluded from the count, not just one of each.

## When You'll See This Pattern

This problem teaches the **"range exclusion"** pattern: when you need to count elements that fall within a certain range defined by extreme values in the dataset.

**Related problems:**

1. **Third Maximum Number (LeetCode 414)**: Similar pattern of tracking extreme values, though here you need the third distinct maximum.
2. **Find All Numbers Disappeared in an Array (LeetCode 448)**: Uses the concept of marking elements based on their values relative to array indices.
3. **Kth Largest Element in an Array (LeetCode 215)**: Involves finding elements relative to extremes in the array, though typically solved with different techniques.

The core technique of finding min/max in one pass and then using them to filter elements appears in many array processing problems.

## Key Takeaways

1. **Think about global properties**: Instead of comparing each element against every other element, look for global properties (min, max) that determine eligibility for all elements.

2. **"Strictly" means no equality**: When a problem says "strictly smaller" or "strictly greater," remember that equal values don't count. This is a common trick in easy problems.

3. **Consider edge cases early**: Small arrays (0, 1, or 2 elements) and arrays where all elements are equal are important test cases. Always ask yourself: "What if all elements are the same?"

Related problems: [Find Smallest Letter Greater Than Target](/problem/find-smallest-letter-greater-than-target)
