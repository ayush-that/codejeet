---
title: "How to Solve Smallest Missing Integer Greater Than Sequential Prefix Sum — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Smallest Missing Integer Greater Than Sequential Prefix Sum. Easy difficulty, 35.1% acceptance rate. Topics: Array, Hash Table, Sorting."
date: "2028-08-03"
category: "dsa-patterns"
tags:
  [
    "smallest-missing-integer-greater-than-sequential-prefix-sum",
    "array",
    "hash-table",
    "sorting",
    "easy",
  ]
---

# How to Solve Smallest Missing Integer Greater Than Sequential Prefix Sum

This problem asks us to find the smallest missing integer greater than the sum of a sequential prefix in an array. The tricky part is that we need to identify where the sequential prefix ends, calculate its sum, then find the smallest integer larger than that sum which doesn't appear anywhere in the array. This combines prefix validation with missing number detection.

## Visual Walkthrough

Let's trace through an example: `nums = [1, 2, 3, 2, 5]`

**Step 1: Find the sequential prefix**

- Start with `nums[0] = 1` (always sequential)
- Check `nums[1] = 2`: Is `2 == 1 + 1`? Yes, prefix continues
- Check `nums[2] = 3`: Is `3 == 2 + 1`? Yes, prefix continues
- Check `nums[3] = 2`: Is `2 == 3 + 1`? No! Prefix ends here

Our sequential prefix is `[1, 2, 3]`

**Step 2: Calculate prefix sum**
Sum = 1 + 2 + 3 = 6

**Step 3: Find smallest missing integer > 6**
We need the smallest integer > 6 that's NOT in the array:

- Check 7: Is 7 in `[1, 2, 3, 2, 5]`? No ✓
- Since 7 is missing and > 6, we return 7

Another example: `nums = [3, 4, 5, 1, 12, 10, 11]`

- Sequential prefix: `[3, 4, 5]` (stops at index 2)
- Prefix sum = 3 + 4 + 5 = 12
- Smallest missing > 12: Check 13 (not in array), return 13

## Brute Force Approach

A naive approach would:

1. Find the sequential prefix by checking each element
2. Calculate the sum of that prefix
3. Start from `sum + 1` and check each integer sequentially
4. For each integer, scan the entire array to see if it exists

The brute force code would look like this:

```python
def missingInteger(nums):
    # Step 1: Find sequential prefix
    prefix_sum = nums[0]
    for i in range(1, len(nums)):
        if nums[i] == nums[i-1] + 1:
            prefix_sum += nums[i]
        else:
            break

    # Step 2: Find smallest missing > prefix_sum
    x = prefix_sum
    while True:
        x += 1
        found = False
        # Scan entire array
        for num in nums:
            if num == x:
                found = True
                break
        if not found:
            return x
```

**Why this is inefficient:**

- The while loop could run many times (worst case: all numbers up to some large value are present)
- Each iteration scans the entire array: O(n) per check
- Worst-case time complexity: O(n × m) where m is the gap size

## Optimal Solution

The key insight is that we need efficient lookup to check if a number exists in the array. We can use a hash set for O(1) lookups. The algorithm:

1. Find the sequential prefix and calculate its sum
2. Create a set of all numbers in the array
3. Starting from the prefix sum + 1, check each integer until we find one not in the set

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def missingInteger(nums):
    """
    Find the smallest missing integer greater than the sum of the
    longest sequential prefix in nums.
    """
    # Step 1: Find the sequential prefix and calculate its sum
    prefix_sum = nums[0]  # Start with first element
    for i in range(1, len(nums)):
        # Check if current element continues the sequence
        if nums[i] == nums[i-1] + 1:
            prefix_sum += nums[i]
        else:
            break  # Sequence ends here

    # Step 2: Create a set for O(1) lookups
    num_set = set(nums)

    # Step 3: Find smallest missing integer > prefix_sum
    x = prefix_sum
    while True:
        x += 1  # Check next integer
        if x not in num_set:
            return x
```

```javascript
// Time: O(n) | Space: O(n)
function missingInteger(nums) {
  // Step 1: Find the sequential prefix and calculate its sum
  let prefixSum = nums[0];

  // Check each element to see if it continues the sequence
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] === nums[i - 1] + 1) {
      prefixSum += nums[i];
    } else {
      break; // Sequence ends here
    }
  }

  // Step 2: Create a set for O(1) lookups
  const numSet = new Set(nums);

  // Step 3: Find smallest missing integer > prefixSum
  let x = prefixSum;
  while (true) {
    x++; // Check next integer
    if (!numSet.has(x)) {
      return x;
    }
  }
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public int missingInteger(int[] nums) {
        // Step 1: Find the sequential prefix and calculate its sum
        int prefixSum = nums[0];

        // Check each element to see if it continues the sequence
        for (int i = 1; i < nums.length; i++) {
            if (nums[i] == nums[i - 1] + 1) {
                prefixSum += nums[i];
            } else {
                break;  // Sequence ends here
            }
        }

        // Step 2: Create a set for O(1) lookups
        Set<Integer> numSet = new HashSet<>();
        for (int num : nums) {
            numSet.add(num);
        }

        // Step 3: Find smallest missing integer > prefixSum
        int x = prefixSum;
        while (true) {
            x++;  // Check next integer
            if (!numSet.contains(x)) {
                return x;
            }
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Finding the sequential prefix: O(n) in worst case (entire array is sequential)
- Building the hash set: O(n)
- Finding the missing integer: O(k) where k is the gap size, but each check is O(1) due to hash set
- In practice, the while loop dominates for large gaps, but it's still efficient with O(1) lookups

**Space Complexity: O(n)**

- We store all elements in a hash set: O(n) space
- No other significant data structures needed

## Common Mistakes

1. **Forgetting that a single element is always sequential**
   - Some candidates think they need at least 2 elements for a sequential prefix
   - Remember: The problem states "the prefix consisting only of nums[0] is sequential"
   - Fix: Always start with `prefix_sum = nums[0]`

2. **Not breaking when sequence ends**
   - Continuing to add to prefix_sum after sequence breaks gives wrong sum
   - Example: `[1, 2, 3, 5, 6]` - prefix should be `[1, 2, 3]` only
   - Fix: Use `break` when `nums[i] != nums[i-1] + 1`

3. **Using array search instead of hash set**
   - Scanning array for each candidate gives O(n²) worst case
   - Fix: Always use a hash set for O(1) lookups

4. **Starting search from wrong value**
   - Some start checking from `prefix_sum` instead of `prefix_sum + 1`
   - We need integers **greater than** the prefix sum
   - Fix: Start with `x = prefix_sum` then increment before first check

## When You'll See This Pattern

This problem combines two common patterns:

1. **Sequential/Consecutive Element Detection** - Similar to problems where you need to find consecutive sequences:
   - **Longest Consecutive Sequence** (LeetCode 128): Find longest sequence of consecutive numbers
   - **Consecutive Characters** (LeetCode 1446): Find longest substring of consecutive identical characters

2. **Missing Number Detection with Efficient Lookup** - Similar to problems where you need to find missing elements:
   - **First Missing Positive** (LeetCode 41): Find smallest missing positive integer
   - **Find All Numbers Disappeared in an Array** (LeetCode 448): Find all missing numbers in range [1, n]

The core technique of using a hash set for O(1) lookups when checking membership appears in many problems where you need to efficiently test if an element exists in a collection.

## Key Takeaways

1. **Hash sets are your friend for membership testing** - Whenever you need to check "does this value exist in the array?" repeatedly, convert to a set first for O(1) lookups.

2. **Pay attention to boundary conditions** - The definition of "sequential" includes single elements, and "greater than" means start checking from `sum + 1`.

3. **Break early when patterns change** - When tracking sequences, stop as soon as the pattern breaks to avoid incorrect calculations.

This problem teaches how to combine sequence detection with efficient search, a common pattern in array manipulation problems.

Related problems: [Longest Common Prefix](/problem/longest-common-prefix), [First Missing Positive](/problem/first-missing-positive), [Next Greater Element I](/problem/next-greater-element-i)
