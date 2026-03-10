---
title: "How to Solve Divide Array in Sets of K Consecutive Numbers — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Divide Array in Sets of K Consecutive Numbers. Medium difficulty, 59.1% acceptance rate. Topics: Array, Hash Table, Greedy, Sorting."
date: "2027-01-16"
category: "dsa-patterns"
tags: ["divide-array-in-sets-of-k-consecutive-numbers", "array", "hash-table", "greedy", "medium"]
---

# How to Solve Divide Array in Sets of K Consecutive Numbers

This problem asks us to determine if we can partition an array of integers into groups where each group contains exactly `k` consecutive numbers. For example, with `nums = [1,2,3,3,4,4,5,6]` and `k = 4`, we can form two groups: `[1,2,3,4]` and `[3,4,5,6]`. What makes this problem interesting is that we need to efficiently track which numbers are available while ensuring each group starts from the smallest available number and forms a consecutive sequence.

## Visual Walkthrough

Let's trace through `nums = [1,2,3,3,4,4,5,6]`, `k = 4`:

1. **Sort the array**: `[1,2,3,3,4,4,5,6]`
2. **Count frequencies**: {1:1, 2:1, 3:2, 4:2, 5:1, 6:1}
3. **Process smallest available number (1)**:
   - Check if we can form sequence 1,2,3,4
   - All frequencies are available: 1(1), 2(1), 3(2), 4(2)
   - Decrease frequencies: 1(0), 2(0), 3(1), 4(1)
4. **Next smallest available number (3)**:
   - Check if we can form sequence 3,4,5,6
   - All frequencies are available: 3(1), 4(1), 5(1), 6(1)
   - Decrease frequencies: 3(0), 4(0), 5(0), 6(0)
5. **All numbers used** → return `true`

If we had `nums = [1,2,3,4]`, `k = 3`:

1. Sort: `[1,2,3,4]`
2. Frequencies: {1:1, 2:1, 3:1, 4:1}
3. Process 1: form 1,2,3 → frequencies become 1(0), 2(0), 3(0), 4(1)
4. Next smallest is 4, but we need 3 consecutive numbers (4,5,6) and 5,6 don't exist → return `false`

## Brute Force Approach

A naive approach would be to repeatedly search for the smallest available number and try to build a consecutive sequence of length `k`. For each group:

1. Find the smallest number in the array
2. Check if the next `k-1` consecutive numbers exist
3. Remove all these numbers from the array
4. Repeat until array is empty or we can't form a group

The problem with this approach is efficiency. Finding the smallest number in an unsorted array takes O(n), and we might do this O(n/k) times, leading to O(n²/k) time complexity. Removing elements from an array also takes O(n) time. This becomes too slow for large inputs.

## Optimized Approach

The key insight is that we need to:

1. **Know what numbers we have and how many of each** → Use a frequency map (hash table)
2. **Always start groups from the smallest available number** → Sort the unique numbers or use a min-heap
3. **Efficiently check and consume consecutive sequences** → For each starting number, check if we have the next `k-1` consecutive numbers

The optimal strategy:

- Count frequencies of all numbers
- Sort the unique numbers (or use a min-heap)
- For each number in sorted order:
  - If it still has frequency > 0, try to form a group starting from it
  - For the next `k-1` numbers, check if they exist with sufficient frequency
  - If any missing, return `false`
  - Otherwise, decrease frequencies for all numbers in the group

This greedy approach works because if we don't use the smallest available number as the start of a group, we might leave it "stranded" without being able to form a complete group later.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def isPossibleDivide(nums, k):
    """
    Check if array can be divided into groups of k consecutive numbers.

    Args:
        nums: List of integers
        k: Size of each consecutive group

    Returns:
        True if possible, False otherwise
    """
    # Step 1: Check basic condition - total elements must be divisible by k
    if len(nums) % k != 0:
        return False

    # Step 2: Count frequency of each number
    from collections import Counter
    freq = Counter(nums)

    # Step 3: Get sorted unique numbers
    sorted_nums = sorted(freq.keys())

    # Step 4: Try to form groups starting from smallest available numbers
    for num in sorted_nums:
        # Get current frequency of this number
        current_freq = freq[num]

        # If this number has been completely used in previous groups, skip it
        if current_freq == 0:
            continue

        # Step 5: Try to form a group starting from 'num'
        # We need to create 'current_freq' groups starting from 'num'
        for i in range(current_freq):
            # Check if we have the next k-1 consecutive numbers
            for j in range(k):
                next_num = num + j

                # If any required number is missing, return False
                if freq.get(next_num, 0) == 0:
                    return False

                # Decrease frequency for this number
                freq[next_num] -= 1

    # Step 6: All numbers successfully grouped
    return True
```

```javascript
// Time: O(n log n) | Space: O(n)
function isPossibleDivide(nums, k) {
  /**
   * Check if array can be divided into groups of k consecutive numbers.
   *
   * @param {number[]} nums - Array of integers
   * @param {number} k - Size of each consecutive group
   * @return {boolean} True if possible, False otherwise
   */

  // Step 1: Check basic condition - total elements must be divisible by k
  if (nums.length % k !== 0) {
    return false;
  }

  // Step 2: Count frequency of each number
  const freq = new Map();
  for (const num of nums) {
    freq.set(num, (freq.get(num) || 0) + 1);
  }

  // Step 3: Get sorted unique numbers
  const sortedNums = Array.from(freq.keys()).sort((a, b) => a - b);

  // Step 4: Try to form groups starting from smallest available numbers
  for (const num of sortedNums) {
    // Get current frequency of this number
    const currentFreq = freq.get(num);

    // If this number has been completely used in previous groups, skip it
    if (currentFreq === 0) {
      continue;
    }

    // Step 5: Try to form groups starting from 'num'
    // We need to create 'currentFreq' groups starting from 'num'
    for (let i = 0; i < currentFreq; i++) {
      // Check if we have the next k-1 consecutive numbers
      for (let j = 0; j < k; j++) {
        const nextNum = num + j;

        // If any required number is missing, return false
        if (!freq.has(nextNum) || freq.get(nextNum) === 0) {
          return false;
        }

        // Decrease frequency for this number
        freq.set(nextNum, freq.get(nextNum) - 1);
      }
    }
  }

  // Step 6: All numbers successfully grouped
  return true;
}
```

```java
// Time: O(n log n) | Space: O(n)
import java.util.*;

class Solution {
    public boolean isPossibleDivide(int[] nums, int k) {
        /**
         * Check if array can be divided into groups of k consecutive numbers.
         *
         * @param nums Array of integers
         * @param k Size of each consecutive group
         * @return True if possible, False otherwise
         */

        // Step 1: Check basic condition - total elements must be divisible by k
        if (nums.length % k != 0) {
            return false;
        }

        // Step 2: Count frequency of each number using TreeMap for automatic sorting
        TreeMap<Integer, Integer> freq = new TreeMap<>();
        for (int num : nums) {
            freq.put(num, freq.getOrDefault(num, 0) + 1);
        }

        // Step 3: Try to form groups starting from smallest available numbers
        while (!freq.isEmpty()) {
            // Get the smallest available number
            int first = freq.firstKey();

            // Step 4: Try to form a group starting from 'first'
            for (int i = 0; i < k; i++) {
                int currentNum = first + i;

                // If any required number is missing, return false
                if (!freq.containsKey(currentNum)) {
                    return false;
                }

                // Decrease frequency for this number
                int count = freq.get(currentNum);
                if (count == 1) {
                    freq.remove(currentNum);
                } else {
                    freq.put(currentNum, count - 1);
                }
            }
        }

        // Step 5: All numbers successfully grouped
        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Counting frequencies: O(n)
- Sorting unique numbers: O(m log m) where m ≤ n (number of unique values)
- Forming groups: O(n) since each number is processed exactly once
- Dominated by the sorting step: O(n log n)

**Space Complexity: O(n)**

- Frequency map stores at most n entries
- In worst case (all numbers unique), we store n entries
- Sorting may require O(n) space for the sorted list (depends on implementation)

## Common Mistakes

1. **Not checking divisibility first**: If `len(nums) % k != 0`, it's impossible to divide into equal groups. This early check saves computation.

2. **Forgetting to handle duplicate numbers correctly**: Candidates might use a Set instead of a frequency map, failing on inputs like `[1,2,2,3]` with `k=2`.

3. **Starting groups from wrong numbers**: Always start from the smallest available number. If you start from a larger number, you might leave smaller numbers stranded.

4. **Not checking all consecutive numbers in a group**: For a group starting at `x`, you need to check for `x, x+1, x+2, ..., x+k-1`. Missing any breaks the consecutive requirement.

5. **Inefficient frequency updates**: Some candidates remove entries when count reaches 0 (like in the Java solution), while others leave them. Both work, but removing them can make subsequent lookups faster.

## When You'll See This Pattern

This greedy frequency-based pattern appears in problems about grouping or partitioning sequences:

1. **Split Array into Consecutive Subsequences (LeetCode 659)**: Similar concept but with variable group sizes (minimum size 3). Uses the same frequency counting and greedy grouping approach.

2. **Hand of Straights (LeetCode 846)**: This is essentially the same problem with different wording.

3. **Task Scheduler (LeetCode 621)**: Uses frequency counting and greedy scheduling, though with different constraints.

4. **Partition Labels (LeetCode 763)**: While not about consecutive numbers, it uses greedy partitioning based on character frequencies.

The core pattern is: when you need to group elements with specific relationships (consecutive, same type, etc.), count frequencies, sort if needed, and process greedily from the most constrained element.

## Key Takeaways

1. **Frequency maps are powerful for grouping problems**: When you need to track how many of each element you have, a hash table with counts is often the right tool.

2. **Greedy from smallest/largest often works**: For consecutive number problems, starting from the smallest available number ensures you don't leave elements stranded.

3. **Early pruning saves time**: Check basic conditions first (divisibility by k) before doing expensive operations.

4. **Think about what makes a group valid**: For this problem, it's having k consecutive numbers. Break down the requirement into checkable steps.

Related problems: [Split Array into Consecutive Subsequences](/problem/split-array-into-consecutive-subsequences), [All Divisions With the Highest Score of a Binary Array](/problem/all-divisions-with-the-highest-score-of-a-binary-array)
