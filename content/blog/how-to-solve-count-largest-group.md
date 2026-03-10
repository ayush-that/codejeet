---
title: "How to Solve Count Largest Group — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Count Largest Group. Easy difficulty, 74.7% acceptance rate. Topics: Hash Table, Math, Counting."
date: "2026-03-16"
category: "dsa-patterns"
tags: ["count-largest-group", "hash-table", "math", "counting", "easy"]
---

# How to Solve Count Largest Group

This problem asks us to group numbers from 1 to n based on their digit sum, then count how many groups have the maximum size. While conceptually straightforward, it requires careful counting and tracking of multiple values simultaneously. The tricky part is managing two different counts: the size of each group and tracking which groups have the maximum size.

## Visual Walkthrough

Let's trace through `n = 13` step by step:

1. **Calculate digit sums for numbers 1-13:**
   - 1 → 1
   - 2 → 2
   - 3 → 3
   - 4 → 4
   - 5 → 5
   - 6 → 6
   - 7 → 7
   - 8 → 8
   - 9 → 9
   - 10 → 1 + 0 = 1
   - 11 → 1 + 1 = 2
   - 12 → 1 + 2 = 3
   - 13 → 1 + 3 = 4

2. **Group numbers by their digit sums:**
   - Sum 1: [1, 10] → size 2
   - Sum 2: [2, 11] → size 2
   - Sum 3: [3, 12] → size 2
   - Sum 4: [4, 13] → size 2
   - Sum 5: [5] → size 1
   - Sum 6: [6] → size 1
   - Sum 7: [7] → size 1
   - Sum 8: [8] → size 1
   - Sum 9: [9] → size 1

3. **Find the maximum group size:** 2
4. **Count groups with size 2:** 4 groups (sums 1, 2, 3, and 4)

So for `n = 13`, the answer is 4.

## Brute Force Approach

A naive approach would be:

1. Create a list of all numbers from 1 to n
2. For each number, calculate its digit sum
3. Store numbers in groups (perhaps using a dictionary)
4. Find the maximum group size
5. Count how many groups have that size

While this approach works, it's inefficient in terms of code organization but not necessarily in time complexity. The real "brute force" thinking here would be to:

- Create a 2D array to store all groups
- Manually search through all groups to find the maximum
- Count groups with that maximum

The issue isn't time complexity (which is O(n) anyway), but rather the messy implementation and potential for errors in tracking multiple values. A cleaner approach uses a hash map to track counts efficiently.

## Optimal Solution

The optimal solution uses a hash map to count group sizes:

1. Initialize a dictionary to track how many numbers belong to each digit sum
2. For each number from 1 to n:
   - Calculate its digit sum
   - Increment the count for that sum in the dictionary
3. Track the maximum group size while counting
4. Count how many sums have the maximum size

<div class="code-group">

```python
# Time: O(n * d) where d is the number of digits in n (max 5 for n ≤ 10^4)
# Space: O(n) for storing group counts
def countLargestGroup(n: int) -> int:
    # Dictionary to store count of numbers for each digit sum
    # Key: digit sum, Value: count of numbers with that sum
    group_counts = {}

    # Track the maximum group size we've seen
    max_size = 0

    # Iterate through all numbers from 1 to n
    for num in range(1, n + 1):
        # Calculate digit sum for current number
        digit_sum = 0
        temp = num
        while temp > 0:
            digit_sum += temp % 10  # Add last digit
            temp //= 10             # Remove last digit

        # Update count for this digit sum
        group_counts[digit_sum] = group_counts.get(digit_sum, 0) + 1

        # Update max_size if current group is larger
        max_size = max(max_size, group_counts[digit_sum])

    # Count how many groups have the maximum size
    result = 0
    for count in group_counts.values():
        if count == max_size:
            result += 1

    return result
```

```javascript
// Time: O(n * d) where d is the number of digits in n (max 5 for n ≤ 10^4)
// Space: O(n) for storing group counts
function countLargestGroup(n) {
  // Map to store count of numbers for each digit sum
  // Key: digit sum, Value: count of numbers with that sum
  const groupCounts = new Map();

  // Track the maximum group size we've seen
  let maxSize = 0;

  // Iterate through all numbers from 1 to n
  for (let num = 1; num <= n; num++) {
    // Calculate digit sum for current number
    let digitSum = 0;
    let temp = num;
    while (temp > 0) {
      digitSum += temp % 10; // Add last digit
      temp = Math.floor(temp / 10); // Remove last digit
    }

    // Update count for this digit sum
    const currentCount = (groupCounts.get(digitSum) || 0) + 1;
    groupCounts.set(digitSum, currentCount);

    // Update maxSize if current group is larger
    maxSize = Math.max(maxSize, currentCount);
  }

  // Count how many groups have the maximum size
  let result = 0;
  for (const count of groupCounts.values()) {
    if (count === maxSize) {
      result++;
    }
  }

  return result;
}
```

```java
// Time: O(n * d) where d is the number of digits in n (max 5 for n ≤ 10^4)
// Space: O(n) for storing group counts
class Solution {
    public int countLargestGroup(int n) {
        // HashMap to store count of numbers for each digit sum
        // Key: digit sum, Value: count of numbers with that sum
        Map<Integer, Integer> groupCounts = new HashMap<>();

        // Track the maximum group size we've seen
        int maxSize = 0;

        // Iterate through all numbers from 1 to n
        for (int num = 1; num <= n; num++) {
            // Calculate digit sum for current number
            int digitSum = 0;
            int temp = num;
            while (temp > 0) {
                digitSum += temp % 10;  // Add last digit
                temp /= 10;             // Remove last digit
            }

            // Update count for this digit sum
            int currentCount = groupCounts.getOrDefault(digitSum, 0) + 1;
            groupCounts.put(digitSum, currentCount);

            // Update maxSize if current group is larger
            maxSize = Math.max(maxSize, currentCount);
        }

        // Count how many groups have the maximum size
        int result = 0;
        for (int count : groupCounts.values()) {
            if (count == maxSize) {
                result++;
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × d) where n is the input number and d is the maximum number of digits. Since n ≤ 10⁴, the maximum number of digits is 5 (for 9999), so we can simplify this to O(n) for practical purposes.

**Space Complexity:** O(n) in the worst case. The maximum possible digit sum for numbers up to 10⁴ is 36 (for 9999), so we store at most 36 entries in our hash map. However, we need to consider that each entry stores a count, so the space is O(k) where k is the number of unique digit sums, which is at most 36. But since 36 is a constant, we could also say O(1) space. Most interviewers would accept either O(n) or O(1) with explanation.

## Common Mistakes

1. **Off-by-one errors with range:** Forgetting to include `n` in the loop (`range(1, n)` instead of `range(1, n+1)` in Python, or similar errors in other languages).

2. **Incorrect digit sum calculation:** Not handling the digit extraction properly, especially for numbers with multiple digits. A common mistake is to use string conversion without considering performance or to incorrectly update the temporary variable.

3. **Forgetting to track maximum while counting:** Some candidates first build the complete count map, then find the maximum, then count groups with that maximum. This requires two passes through the map values. While not wrong, it's less efficient than tracking the maximum during the counting phase.

4. **Using inefficient data structures:** Using a list of size n to store groups instead of a hash map. Since digit sums range from 1 to 36 (for n ≤ 10⁴), a hash map is more space-efficient than a list of size n.

## When You'll See This Pattern

This problem combines several common patterns:

1. **Digit manipulation:** Similar to problems like "Add Digits" (LeetCode 258) or "Happy Number" (LeetCode 202) where you need to repeatedly calculate digit sums.

2. **Frequency counting with hash maps:** Like "Top K Frequent Elements" (LeetCode 347) or "First Unique Character in a String" (LeetCode 387), where you count occurrences and then process the counts.

3. **Grouping problems:** Similar to "Group Anagrams" (LeetCode 49) where you group items based on a computed key (in that case, sorted string; here, digit sum).

The core technique of using a hash map to group items by a computed key appears in many interview problems. Once you recognize the pattern of "group by some transformation," reach for a hash map.

## Key Takeaways

1. **Hash maps are perfect for grouping problems:** When you need to group items by some computed property, a hash map with the property as key and count/list as value is usually the right approach.

2. **Track auxiliary information during iteration:** Instead of making multiple passes through data, track useful information (like maximum count) as you build your data structure.

3. **Digit manipulation is a fundamental skill:** Practice extracting digits from numbers using modulo and integer division operations, as this pattern appears in many problems.

[Practice this problem on CodeJeet](/problem/count-largest-group)
