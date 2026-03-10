---
title: "How to Solve Minimum Number of Operations to Make Array Empty — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Number of Operations to Make Array Empty. Medium difficulty, 62.1% acceptance rate. Topics: Array, Hash Table, Greedy, Counting."
date: "2028-10-20"
category: "dsa-patterns"
tags:
  ["minimum-number-of-operations-to-make-array-empty", "array", "hash-table", "greedy", "medium"]
---

# How to Solve Minimum Number of Operations to Make Array Empty

This problem asks us to find the minimum number of operations to delete all elements from an array using only two types of operations: removing two equal elements or removing three equal elements. The challenge lies in determining the optimal combination of these operations for each distinct value's frequency in the array.

## Visual Walkthrough

Let's trace through an example: `nums = [2,2,3,3,3,4,4,4,4]`

First, we count the frequency of each element:

- 2 appears 2 times
- 3 appears 3 times
- 4 appears 4 times

Now we process each frequency:

**For value 2 (frequency = 2):**

- We can use one operation of type 1 (remove 2 equal elements)
- Operations needed: 1

**For value 3 (frequency = 3):**

- We can use one operation of type 2 (remove 3 equal elements)
- Operations needed: 1

**For value 4 (frequency = 4):**

- Option 1: Two type-1 operations (2+2 = 4) → 2 operations
- Option 2: One type-2 and one type-1 operation (3+1, but we can't remove 1 element) → Not valid
- Actually, 4 = 2 + 2 → 2 operations

Total operations: 1 + 1 + 2 = 4

But wait, let's check if we can do better for frequency 4:

- 4 = 3 + 1 (invalid, can't remove 1)
- 4 = 2 + 2 (valid, 2 operations)

So minimum is indeed 4 operations.

Another tricky example: `nums = [2,2,2,2,2]` (frequency = 5)

- 5 = 3 + 2 → 2 operations (remove 3, then remove 2)
- 5 = 2 + 3 → 2 operations (same)
- 5 = 2 + 2 + 1 → invalid (can't remove 1)

So we need 2 operations.

Key insight: For each frequency `f`, we need to find the minimum number of operations by combining 2s and 3s to sum to `f`.

## Brute Force Approach

A naive approach would be to try all possible combinations of operations for each frequency. For a frequency `f`, we could try:

- Using as many 3-operations as possible, then filling with 2-operations
- Using as many 2-operations as possible, then filling with 3-operations
- All combinations in between

We'd need to check all possible counts of 3-operations from 0 to `f//3`, and for each, check if the remainder can be handled by 2-operations.

While this would work, it's inefficient when we have many distinct values with large frequencies. For each frequency `f`, we'd check up to `f//3 + 1` possibilities. If the maximum frequency is `M` and we have `N` distinct values, this could approach O(N × M) in the worst case.

More importantly, there's a mathematical pattern we can exploit to avoid checking all combinations.

## Optimized Approach

The key insight is that we can solve this problem greedily for each frequency:

1. **Count frequencies** of all elements using a hash map.
2. **For each frequency `f`**:
   - If `f == 1`: Impossible to delete (can't remove single element) → return -1
   - The optimal strategy is to use as many 3-operations as possible, because they remove more elements per operation
   - But we need to handle the remainder carefully

Let's think about the possible remainders when dividing by 3:

- If `f % 3 == 0`: Use only 3-operations → `f // 3` operations
- If `f % 3 == 1`: We have one extra element. Example: `f = 4` (3+1) or `f = 7` (3+3+1). The trick is to convert one 3-operation into operations that give us a sum divisible by 2s and 3s. For `f = 4`: 4 = 2 + 2 (not 3+1). For `f = 7`: 7 = 3 + 2 + 2. So formula: `f // 3 - 1 + 2` = `f // 3 + 1`
- If `f % 3 == 2`: We have two extra elements. Example: `f = 5` = 3 + 2 → `f // 3 + 1` operations
  - Actually, `f = 5`: 5 // 3 = 1, remainder 2 → 1 + 1 = 2 operations ✓
  - `f = 8`: 8 // 3 = 2, remainder 2 → 2 + 1 = 3 operations (3+3+2)

Wait, let's verify the formula more carefully:

Actually, there's a cleaner way: For any `f ≥ 2`, the minimum operations is `ceil(f / 3)` when `f % 3 != 1`, but when `f % 3 == 1`, we need to adjust.

Let me derive the correct formula:

- If `f % 3 == 0`: ops = `f // 3`
- If `f % 3 == 1`:
  - We can't have just `3k + 1` because 1 is invalid
  - Solution: Take one less 3-operation: `(f // 3 - 1)` operations of type 2
  - Then we have `f - 3*(f//3 - 1) = f - 3*(f//3) + 3 = (f % 3) + 3 = 1 + 3 = 4` left
  - 4 can be handled by 2 operations of type 1
  - Total: `(f // 3 - 1) + 2 = f // 3 + 1`
- If `f % 3 == 2`: ops = `f // 3 + 1` (one extra 2-operation)

So the unified formula is: `f // 3 + (1 if f % 3 != 0 else 0)`

But wait, check `f = 3`: 3 // 3 + 0 = 1 ✓
`f = 4`: 4 // 3 + 1 = 1 + 1 = 2 ✓
`f = 5`: 5 // 3 + 1 = 1 + 1 = 2 ✓
`f = 6`: 6 // 3 + 0 = 2 ✓

Actually simpler: `ceil(f / 3)` works for all cases except we need to handle `f = 1` specially.

Even simpler: The answer is `(f + 2) // 3` for all `f ≥ 2` (integer division).

Check:

- `f = 2`: (2+2)//3 = 4//3 = 1 ✓
- `f = 3`: (3+2)//3 = 5//3 = 1 ✓
- `f = 4`: (4+2)//3 = 6//3 = 2 ✓
- `f = 5`: (5+2)//3 = 7//3 = 2 ✓
- `f = 6`: (6+2)//3 = 8//3 = 2 ✓

And for `f = 1`: return -1

This works because `(f + 2) // 3` is equivalent to `ceil(f / 3)` with integer arithmetic.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def minOperations(nums):
    """
    Calculate minimum operations to empty array using only:
    1. Remove 2 equal elements
    2. Remove 3 equal elements

    Args:
        nums: List of positive integers

    Returns:
        Minimum operations or -1 if impossible
    """
    from collections import Counter

    # Step 1: Count frequency of each element
    # We need to know how many times each value appears
    freq_map = Counter(nums)

    total_ops = 0

    # Step 2: Process each frequency
    for freq in freq_map.values():
        # If any element appears only once, it's impossible
        # We can't remove a single element with our operations
        if freq == 1:
            return -1

        # Step 3: Calculate minimum operations for this frequency
        # Using formula: ceil(freq / 3)
        # In integer arithmetic: (freq + 2) // 3
        # Why? Because (freq + 2) // 3 = ceil(freq / 3) for integers
        # Examples:
        # - freq=2: (2+2)//3=1 (remove 2)
        # - freq=3: (3+2)//3=1 (remove 3)
        # - freq=4: (4+2)//3=2 (remove 2+2)
        # - freq=5: (5+2)//3=2 (remove 3+2)
        ops_for_this_freq = (freq + 2) // 3
        total_ops += ops_for_this_freq

    return total_ops
```

```javascript
// Time: O(n) | Space: O(n)
function minOperations(nums) {
  /**
   * Calculate minimum operations to empty array using only:
   * 1. Remove 2 equal elements
   * 2. Remove 3 equal elements
   *
   * @param {number[]} nums - Array of positive integers
   * @return {number} Minimum operations or -1 if impossible
   */

  // Step 1: Count frequency of each element
  const freqMap = new Map();

  for (const num of nums) {
    freqMap.set(num, (freqMap.get(num) || 0) + 1);
  }

  let totalOps = 0;

  // Step 2: Process each frequency
  for (const freq of freqMap.values()) {
    // If any element appears only once, it's impossible
    if (freq === 1) {
      return -1;
    }

    // Step 3: Calculate minimum operations for this frequency
    // Using formula: Math.ceil(freq / 3)
    // Equivalent to: (freq + 2) // 3 in integer division
    const opsForThisFreq = Math.ceil(freq / 3);
    totalOps += opsForThisFreq;
  }

  return totalOps;
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.HashMap;
import java.util.Map;

class Solution {
    public int minOperations(int[] nums) {
        /**
         * Calculate minimum operations to empty array using only:
         * 1. Remove 2 equal elements
         * 2. Remove 3 equal elements
         *
         * @param nums Array of positive integers
         * @return Minimum operations or -1 if impossible
         */

        // Step 1: Count frequency of each element
        Map<Integer, Integer> freqMap = new HashMap<>();

        for (int num : nums) {
            freqMap.put(num, freqMap.getOrDefault(num, 0) + 1);
        }

        int totalOps = 0;

        // Step 2: Process each frequency
        for (int freq : freqMap.values()) {
            // If any element appears only once, it's impossible
            if (freq == 1) {
                return -1;
            }

            // Step 3: Calculate minimum operations for this frequency
            // Using formula: ceil(freq / 3)
            // In integer arithmetic: (freq + 2) / 3
            // The +2 ensures we round up when dividing by 3
            int opsForThisFreq = (freq + 2) / 3;
            totalOps += opsForThisFreq;
        }

        return totalOps;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Counting frequencies: O(n) to iterate through all n elements
- Processing frequencies: O(k) where k is number of distinct elements, which is at most n
- Total: O(n + k) = O(n) since k ≤ n

**Space Complexity: O(n)**

- In the worst case, all elements are distinct, so the frequency map stores n entries
- Even with duplicates, we need O(k) space where k is number of distinct values

## Common Mistakes

1. **Not handling frequency = 1 case**: Forgetting that a single occurrence of any value makes the entire problem impossible. Always check for this first.

2. **Wrong formula for operations calculation**: Some candidates try `freq // 3 + freq % 3`, but this doesn't work. For example, freq = 4: 4//3 + 4%3 = 1 + 1 = 2 (correct), but freq = 5: 5//3 + 5%3 = 1 + 2 = 3 (wrong, should be 2). The correct formula is `(freq + 2) // 3`.

3. **Trying to optimize by removing largest groups first without considering remainders**: A greedy approach of always removing 3 if possible fails for frequencies like 4. You might think: remove 3 (leaving 1), but then you're stuck with 1.

4. **Integer division issues in Java/JavaScript**: Forgetting that integer division truncates in Java, so need to use `(freq + 2) / 3` not `freq / 3 + ...`. In JavaScript, use `Math.ceil(freq / 3)` for clarity.

## When You'll See This Pattern

This problem combines frequency counting with greedy optimization, a common pattern in coding interviews:

1. **Majority Element (LeetCode 169)**: Also uses frequency counting to find the most common element.

2. **Task Scheduler (LeetCode 621)**: Requires arranging tasks with cooldown periods, often solved by analyzing frequencies of tasks and finding optimal arrangements.

3. **Reduce Array Size to The Half (LeetCode 1338)**: Another frequency-based problem where you need to remove elements to reduce array size by half.

4. **Partition Array Into Two Arrays to Minimize Sum Difference (LeetCode 2035)**: While more complex, it shares the theme of analyzing element frequencies and combinations.

The core pattern is: when a problem involves operations on elements with specific values or constraints, first count frequencies, then apply mathematical reasoning or greedy algorithms to find the optimal solution.

## Key Takeaways

1. **Frequency counting is your first tool**: When a problem involves operations on equal elements or values, start by counting frequencies with a hash map.

2. **Look for mathematical patterns**: Instead of simulating all operations, derive a formula. Test it on small cases (freq = 1 through 6) to verify.

3. **Handle edge cases early**: Check for impossible cases (like freq = 1) at the beginning to avoid complex logic later.

4. **Integer arithmetic tricks**: Remember that `(n + k - 1) // k` gives you `ceil(n / k)` in integer arithmetic. This is useful in many problems.

[Practice this problem on CodeJeet](/problem/minimum-number-of-operations-to-make-array-empty)
