---
title: "How to Solve Max Sum of a Pair With Equal Sum of Digits — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Max Sum of a Pair With Equal Sum of Digits. Medium difficulty, 66.0% acceptance rate. Topics: Array, Hash Table, Sorting, Heap (Priority Queue)."
date: "2028-05-12"
category: "dsa-patterns"
tags: ["max-sum-of-a-pair-with-equal-sum-of-digits", "array", "hash-table", "sorting", "medium"]
---

# How to Solve "Max Sum of a Pair With Equal Sum of Digits"

You're given an array of positive integers and need to find the maximum sum of two numbers whose digit sums are equal. The challenge is efficiently grouping numbers by their digit sum while tracking the largest values in each group to compute the maximum possible pair sum.

## Visual Walkthrough

Let's trace through a concrete example: `nums = [18, 43, 36, 13, 7]`

**Step 1: Calculate digit sums for each number:**

- 18 → 1 + 8 = 9
- 43 → 4 + 3 = 7
- 36 → 3 + 6 = 9
- 13 → 1 + 3 = 4
- 7 → 7 = 7

**Step 2: Group numbers by their digit sum:**

- Digit sum 9: [18, 36]
- Digit sum 7: [43, 7]
- Digit sum 4: [13]

**Step 3: For each group with at least 2 numbers, find the two largest:**

- Group 9: Largest two are 36 and 18 → sum = 54
- Group 7: Largest two are 43 and 7 → sum = 50
- Group 4: Only one number, can't form a pair

**Step 4: Return the maximum sum:** 54

The key insight is we don't need to store all numbers in each group—just the largest two, since we only care about the maximum possible sum.

## Brute Force Approach

A naive solution would check every possible pair `(i, j)` where `i ≠ j`:

1. For each pair `(i, j)`, calculate digit sums of both numbers
2. If digit sums are equal, track the maximum sum found
3. Return the maximum sum or -1 if no valid pair exists

<div class="code-group">

```python
# Time: O(n² * d) | Space: O(1) where d is max digits
def maximumSum(nums):
    n = len(nums)
    max_sum = -1

    # Helper to calculate digit sum
    def digit_sum(num):
        total = 0
        while num > 0:
            total += num % 10
            num //= 10
        return total

    # Check all pairs
    for i in range(n):
        for j in range(i + 1, n):
            if digit_sum(nums[i]) == digit_sum(nums[j]):
                max_sum = max(max_sum, nums[i] + nums[j])

    return max_sum
```

```javascript
// Time: O(n² * d) | Space: O(1) where d is max digits
function maximumSum(nums) {
  let maxSum = -1;

  // Helper to calculate digit sum
  const digitSum = (num) => {
    let total = 0;
    while (num > 0) {
      total += num % 10;
      num = Math.floor(num / 10);
    }
    return total;
  };

  // Check all pairs
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (digitSum(nums[i]) === digitSum(nums[j])) {
        maxSum = Math.max(maxSum, nums[i] + nums[j]);
      }
    }
  }

  return maxSum;
}
```

```java
// Time: O(n² * d) | Space: O(1) where d is max digits
public int maximumSum(int[] nums) {
    int maxSum = -1;

    // Helper to calculate digit sum
    private int digitSum(int num) {
        int total = 0;
        while (num > 0) {
            total += num % 10;
            num /= 10;
        }
        return total;
    }

    // Check all pairs
    for (int i = 0; i < nums.length; i++) {
        for (int j = i + 1; j < nums.length; j++) {
            if (digitSum(nums[i]) == digitSum(nums[j])) {
                maxSum = Math.max(maxSum, nums[i] + nums[j]);
            }
        }
    }

    return maxSum;
}
```

</div>

**Why this is inefficient:** With `n` up to 10⁵, checking all `O(n²)` pairs is far too slow (potentially 10¹⁰ operations). We need an approach that processes each number only once.

## Optimized Approach

The optimal solution uses a hash map to group numbers by their digit sum. Here's the step-by-step reasoning:

1. **Grouping by digit sum:** Numbers with equal digit sums can form valid pairs. We need to efficiently find which digit sum groups have at least 2 numbers.

2. **Tracking only the largest two:** For each digit sum, we only need to keep the two largest numbers seen so far, since adding smaller numbers can't produce a larger sum than adding the two largest.

3. **Single pass with updates:** As we iterate through the array:
   - Calculate the digit sum for the current number
   - Check if we've seen this digit sum before
   - Update the two largest numbers for that digit sum
   - If we now have at least 2 numbers in that group, update the global maximum

4. **Efficient digit sum calculation:** We can compute digit sums using modulo operations in `O(d)` time where `d` is the number of digits (at most 10 for 32-bit integers).

The key data structure is a hash map where keys are digit sums and values are the two largest numbers seen with that digit sum. We can store these as a list or tuple of size 2.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * d) | Space: O(n) where d is max digits (d ≤ 10)
def maximumSum(nums):
    # Dictionary to store the two largest numbers for each digit sum
    # Format: {digit_sum: [largest, second_largest]}
    max_nums = {}
    max_sum = -1

    for num in nums:
        # Calculate digit sum
        digit_sum = 0
        temp = num
        while temp > 0:
            digit_sum += temp % 10
            temp //= 10

        # Update the two largest numbers for this digit sum
        if digit_sum not in max_nums:
            # First number with this digit sum
            max_nums[digit_sum] = [num, -1]
        else:
            # We have at least one number with this digit sum
            largest, second_largest = max_nums[digit_sum]

            if num > largest:
                # New number is larger than current largest
                # Old largest becomes second largest
                max_nums[digit_sum] = [num, largest]
            elif num > second_largest:
                # New number is between largest and second largest
                max_nums[digit_sum][1] = num

            # Update global max if we now have two numbers
            if max_nums[digit_sum][1] != -1:
                current_sum = max_nums[digit_sum][0] + max_nums[digit_sum][1]
                max_sum = max(max_sum, current_sum)

    return max_sum
```

```javascript
// Time: O(n * d) | Space: O(n) where d is max digits (d ≤ 10)
function maximumSum(nums) {
  // Map to store the two largest numbers for each digit sum
  // Format: Map(digit_sum -> [largest, secondLargest])
  const maxNums = new Map();
  let maxSum = -1;

  for (const num of nums) {
    // Calculate digit sum
    let digitSum = 0;
    let temp = num;
    while (temp > 0) {
      digitSum += temp % 10;
      temp = Math.floor(temp / 10);
    }

    // Update the two largest numbers for this digit sum
    if (!maxNums.has(digitSum)) {
      // First number with this digit sum
      maxNums.set(digitSum, [num, -1]);
    } else {
      // We have at least one number with this digit sum
      const [largest, secondLargest] = maxNums.get(digitSum);

      if (num > largest) {
        // New number is larger than current largest
        // Old largest becomes second largest
        maxNums.set(digitSum, [num, largest]);
      } else if (num > secondLargest) {
        // New number is between largest and second largest
        maxNums.get(digitSum)[1] = num;
      }

      // Update global max if we now have two numbers
      const currentPair = maxNums.get(digitSum);
      if (currentPair[1] !== -1) {
        const currentSum = currentPair[0] + currentPair[1];
        maxSum = Math.max(maxSum, currentSum);
      }
    }
  }

  return maxSum;
}
```

```java
// Time: O(n * d) | Space: O(n) where d is max digits (d ≤ 10)
public int maximumSum(int[] nums) {
    // HashMap to store the two largest numbers for each digit sum
    // Key: digit sum, Value: int array of size 2 [largest, secondLargest]
    Map<Integer, int[]> maxNums = new HashMap<>();
    int maxSum = -1;

    for (int num : nums) {
        // Calculate digit sum
        int digitSum = 0;
        int temp = num;
        while (temp > 0) {
            digitSum += temp % 10;
            temp /= 10;
        }

        // Update the two largest numbers for this digit sum
        if (!maxNums.containsKey(digitSum)) {
            // First number with this digit sum
            maxNums.put(digitSum, new int[]{num, -1});
        } else {
            // We have at least one number with this digit sum
            int[] pair = maxNums.get(digitSum);
            int largest = pair[0];
            int secondLargest = pair[1];

            if (num > largest) {
                // New number is larger than current largest
                // Old largest becomes second largest
                maxNums.put(digitSum, new int[]{num, largest});
            } else if (num > secondLargest) {
                // New number is between largest and second largest
                pair[1] = num;
            }

            // Update global max if we now have two numbers
            int[] currentPair = maxNums.get(digitSum);
            if (currentPair[1] != -1) {
                int currentSum = currentPair[0] + currentPair[1];
                maxSum = Math.max(maxSum, currentSum);
            }
        }
    }

    return maxSum;
}
```

</div>

## Complexity Analysis

**Time Complexity:** `O(n * d)` where `n` is the number of elements and `d` is the maximum number of digits in any number. Since numbers are positive integers and constraints typically keep them within 32-bit range, `d ≤ 10`. In practice, this is effectively `O(n)`.

**Space Complexity:** `O(n)` in the worst case. Each unique digit sum gets an entry in the hash map. In the worst case, all numbers could have different digit sums (though with constraints, there are at most `9 * d` possible digit sums, which is constant).

The optimization comes from:

1. Processing each number exactly once instead of comparing all pairs
2. Storing only the information needed (two largest numbers per group)
3. Early termination of digit sum calculation (stop when number becomes 0)

## Common Mistakes

1. **Forgetting to handle the "no valid pair" case:** The problem doesn't guarantee a valid pair exists. Always initialize `maxSum = -1` and return it unchanged if no valid pair is found.

2. **Storing all numbers in each group:** This wastes memory and requires sorting later. We only need the two largest numbers at any time. Update them as we see new numbers.

3. **Incorrect digit sum calculation for numbers with trailing zeros:** Using string conversion or forgetting that `0 % 10 = 0` can cause issues. The while loop `while (num > 0)` correctly handles all positive integers.

4. **Not considering that the two largest might change order:** When a new number is larger than the current largest, remember to demote the old largest to second largest, not discard it.

5. **Using arrays instead of hash maps for digit sums:** The maximum digit sum for a 32-bit integer is small (9 × 10 = 90), so an array of size 91 could work. But a hash map is more general and handles sparse distributions efficiently.

## When You'll See This Pattern

This "group by key then find extremes" pattern appears in many problems:

1. **Two Sum** (LeetCode 1) - Similar grouping concept but looking for complements
2. **Group Anagrams** (LeetCode 49) - Group strings by a derived key (sorted characters)
3. **Find Original Array From Doubled Array** (LeetCode 2007) - Group and match pairs based on value relationships
4. **Maximum Number of Pairs in Array** (LeetCode 2341) - Count frequencies then calculate pairs

The core technique is: when you need to find relationships between elements based on some derived property, use a hash map to group elements by that property, then process each group independently.

## Key Takeaways

1. **Group then process:** When a problem involves finding pairs or groups based on a computed property (like digit sum), first group elements by that property using a hash map.

2. **Store only what you need:** For finding maximum/minimum pairs within groups, you often only need to track the top few values (largest two for pairs), not all elements in the group.

3. **Digit sum calculation is fast:** Computing digit sums via modulo/division is `O(d)` where `d ≤ 10` for practical constraints, making it efficient enough for most problems.

4. **Initialize carefully:** Always consider edge cases like no valid answer (return -1) and update your answer as soon as you have enough information (two numbers in a group).

[Practice this problem on CodeJeet](/problem/max-sum-of-a-pair-with-equal-sum-of-digits)
