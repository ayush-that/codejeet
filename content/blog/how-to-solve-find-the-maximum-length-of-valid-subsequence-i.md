---
title: "How to Solve Find the Maximum Length of Valid Subsequence I — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find the Maximum Length of Valid Subsequence I. Medium difficulty, 54.9% acceptance rate. Topics: Array, Dynamic Programming."
date: "2026-10-20"
category: "dsa-patterns"
tags: ["find-the-maximum-length-of-valid-subsequence-i", "array", "dynamic-programming", "medium"]
---

# How to Solve Find the Maximum Length of Valid Subsequence I

This problem asks us to find the longest subsequence where every consecutive pair sum has the same parity (same remainder when divided by 2). What makes this problem interesting is that it looks like a dynamic programming problem at first glance, but has a much simpler mathematical solution once you understand the pattern.

## Visual Walkthrough

Let's trace through an example: `nums = [1, 2, 3, 4, 5]`

We need to find the longest subsequence where `(sub[i] + sub[i+1]) % 2` is constant for all consecutive pairs.

Let's test some subsequences:

- `[1, 2]`: `(1+2)%2 = 3%2 = 1`
- `[1, 3]`: `(1+3)%2 = 4%2 = 0`
- `[1, 2, 3]`: `(1+2)%2 = 1`, `(2+3)%2 = 5%2 = 1` ✓ Works!
- `[1, 2, 3, 4]`: `(1+2)%2 = 1`, `(2+3)%2 = 1`, `(3+4)%2 = 7%2 = 1` ✓ Works!
- `[1, 2, 3, 4, 5]`: `(1+2)%2 = 1`, `(2+3)%2 = 1`, `(3+4)%2 = 1`, `(4+5)%2 = 9%2 = 1` ✓ Works!

So the entire array works! But wait, let's check another example: `nums = [1, 2, 4]`

- `[1, 2]`: `(1+2)%2 = 1`
- `[2, 4]`: `(2+4)%2 = 6%2 = 0` ✗ Different parity!

The key insight: `(a + b) % 2` is the same as `(a % 2 + b % 2) % 2`. So we only care about whether numbers are even or odd.

Let's analyze the parity patterns:

- Even + Even = Even (0 + 0 = 0)
- Odd + Odd = Even (1 + 1 = 2, 2%2 = 0)
- Even + Odd = Odd (0 + 1 = 1)
- Odd + Even = Odd (1 + 0 = 1)

So consecutive pairs will have the same parity sum if:

1. All numbers have the same parity (all even or all odd) → sum is always even
2. Numbers alternate between even and odd → sum is always odd

This means the longest valid subsequence will either be:

- All numbers of one parity (even or odd), OR
- A sequence that alternates between even and odd

## Brute Force Approach

A naive approach would be to generate all possible subsequences (2^n possibilities) and check each one for validity. For each subsequence, we would need to check all consecutive pairs to ensure they have the same parity sum.

```python
def brute_force(nums):
    n = len(nums)
    max_len = 0

    # Generate all subsequences using bitmask
    for mask in range(1 << n):
        subsequence = []
        for i in range(n):
            if mask & (1 << i):
                subsequence.append(nums[i])

        if len(subsequence) < 2:
            continue

        # Check if valid
        target_parity = (subsequence[0] + subsequence[1]) % 2
        valid = True
        for i in range(1, len(subsequence) - 1):
            if (subsequence[i] + subsequence[i + 1]) % 2 != target_parity:
                valid = False
                break

        if valid:
            max_len = max(max_len, len(subsequence))

    return max_len
```

This approach has O(2^n \* n) time complexity, which is far too slow for typical constraints (n up to 10^5). We need a more efficient solution.

## Optimized Approach

The key insight comes from analyzing the parity patterns we discovered:

1. **All same parity**: If we take all even numbers or all odd numbers, then any consecutive pair sum will be even + even = even or odd + odd = even.

2. **Alternating parity**: If we alternate between even and odd, then each pair sum will be odd.

So the longest valid subsequence will be the maximum of:

- Count of all even numbers
- Count of all odd numbers
- A sequence that starts with even then alternates (length = min(even_count, odd_count) \* 2)
- A sequence that starts with odd then alternates (length = min(even_count, odd_count) \* 2)

Wait, can we do better than just min(even, odd) \* 2? Actually, if we have extra numbers of one parity, we can add one more at the end if we start with the less common parity. For example:

- If even_count > odd_count: We can do odd-even-odd-even... and add one more even at the end
- If odd_count > even_count: We can do even-odd-even-odd... and add one more odd at the end

So the alternating sequences can have length:

- If counts are equal: even_count + odd_count (all numbers)
- If counts differ: 2 \* min(even_count, odd_count) + 1

## Optimal Solution

The optimal solution counts even and odd numbers, then returns the maximum of three possibilities:

1. All even numbers
2. All odd numbers
3. Alternating sequence (with possible extra element)

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def maximumLength(nums):
    # Count even and odd numbers
    even_count = 0
    odd_count = 0

    for num in nums:
        if num % 2 == 0:
            even_count += 1
        else:
            odd_count += 1

    # Case 1: Take all even numbers (if we have at least 2)
    # All pairs will be (even + even) % 2 = 0
    option1 = even_count if even_count >= 2 else 0

    # Case 2: Take all odd numbers (if we have at least 2)
    # All pairs will be (odd + odd) % 2 = 0
    option2 = odd_count if odd_count >= 2 else 0

    # Case 3: Create alternating sequence
    # If counts are equal, we can use all numbers
    # If counts differ, we can use 2*min(counts) + 1
    if even_count == odd_count:
        option3 = even_count + odd_count  # All numbers
    elif even_count > odd_count:
        # Start with odd to maximize length
        option3 = 2 * odd_count + 1 if odd_count > 0 else 0
    else:
        # Start with even to maximize length
        option3 = 2 * even_count + 1 if even_count > 0 else 0

    # Return the maximum of all options
    # Note: We need at least 2 elements for a valid subsequence
    return max(option1, option2, option3, 1 if len(nums) >= 1 else 0)
```

```javascript
// Time: O(n) | Space: O(1)
function maximumLength(nums) {
  // Count even and odd numbers
  let evenCount = 0;
  let oddCount = 0;

  for (let num of nums) {
    if (num % 2 === 0) {
      evenCount++;
    } else {
      oddCount++;
    }
  }

  // Case 1: Take all even numbers (if we have at least 2)
  // All pairs will be (even + even) % 2 = 0
  const option1 = evenCount >= 2 ? evenCount : 0;

  // Case 2: Take all odd numbers (if we have at least 2)
  // All pairs will be (odd + odd) % 2 = 0
  const option2 = oddCount >= 2 ? oddCount : 0;

  // Case 3: Create alternating sequence
  let option3;
  if (evenCount === oddCount) {
    // Can use all numbers in alternating pattern
    option3 = evenCount + oddCount;
  } else if (evenCount > oddCount) {
    // Start with odd to maximize: odd-even-odd-even... + one extra even
    option3 = oddCount > 0 ? 2 * oddCount + 1 : 0;
  } else {
    // Start with even to maximize: even-odd-even-odd... + one extra odd
    option3 = evenCount > 0 ? 2 * evenCount + 1 : 0;
  }

  // Return the maximum of all options
  // Need at least 1 element (single element subsequence is valid by definition)
  return Math.max(option1, option2, option3, nums.length > 0 ? 1 : 0);
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int maximumLength(int[] nums) {
        // Count even and odd numbers
        int evenCount = 0;
        int oddCount = 0;

        for (int num : nums) {
            if (num % 2 == 0) {
                evenCount++;
            } else {
                oddCount++;
            }
        }

        // Case 1: Take all even numbers (if we have at least 2)
        // All pairs will be (even + even) % 2 = 0
        int option1 = evenCount >= 2 ? evenCount : 0;

        // Case 2: Take all odd numbers (if we have at least 2)
        // All pairs will be (odd + odd) % 2 = 0
        int option2 = oddCount >= 2 ? oddCount : 0;

        // Case 3: Create alternating sequence
        int option3;
        if (evenCount == oddCount) {
            // Can use all numbers in alternating pattern
            option3 = evenCount + oddCount;
        } else if (evenCount > oddCount) {
            // Start with odd to maximize: odd-even-odd-even... + one extra even
            option3 = oddCount > 0 ? 2 * oddCount + 1 : 0;
        } else {
            // Start with even to maximize: even-odd-even-odd... + one extra odd
            option3 = evenCount > 0 ? 2 * evenCount + 1 : 0;
        }

        // Return the maximum of all options
        // Single element subsequence is always valid
        int singleElement = nums.length > 0 ? 1 : 0;
        return Math.max(Math.max(option1, option2), Math.max(option3, singleElement));
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We make a single pass through the array to count even and odd numbers
- All subsequent calculations are O(1)

**Space Complexity:** O(1)

- We only use a constant amount of extra space to store the counts
- No additional data structures are needed

## Common Mistakes

1. **Forgetting the single element case**: A subsequence with 1 element is always valid (no pairs to check). Some implementations might return 0 for arrays with 1 element if they only check the three main cases.

2. **Incorrect alternating sequence length**: The formula `2 * min(even, odd) + 1` only works when the counts differ AND we have at least one of the less common parity. If oddCount = 0, we can't start with odd, so the alternating sequence length is 0.

3. **Overlooking the "all same parity" cases**: Some candidates only consider alternating sequences, but taking all even or all odd numbers can sometimes be longer (e.g., array of all even numbers).

4. **Using dynamic programming unnecessarily**: This problem looks like it could be solved with DP (similar to longest increasing subsequence), but that would be O(n²) time. The parity pattern allows for an O(n) solution.

## When You'll See This Pattern

This problem teaches pattern recognition through mathematical simplification. Similar problems include:

1. **Longest Arithmetic Subsequence** (LeetCode 1027): While more complex, it also involves finding subsequences with a constant property between consecutive elements.

2. **Longest Harmonious Subsequence** (LeetCode 594): Involves finding subsequences where the difference between max and min is exactly 1, which can be solved by counting frequencies.

3. **Partition Array Into Three Parts With Equal Sum** (LeetCode 1013): Problems that seem to require complex subsequence operations but have simpler solutions through prefix sums or counting.

The key pattern is recognizing when a problem that appears to require checking all subsequences can be reduced to a counting problem through mathematical properties.

## Key Takeaways

1. **Look for mathematical simplifications**: When dealing with subsequence problems involving operations like modulo, parity, or simple arithmetic, check if the problem can be reduced to counting or simple patterns.

2. **Test with small examples**: Tracing through concrete examples (like we did with [1,2,3,4,5]) helps reveal patterns that aren't obvious from the problem statement alone.

3. **Consider all cases systematically**: The solution requires considering three distinct cases (all even, all odd, alternating). Methodically enumerating possibilities prevents missing optimal solutions.

Related problems: [Longest Increasing Subsequence](/problem/longest-increasing-subsequence), [Length of the Longest Subsequence That Sums to Target](/problem/length-of-the-longest-subsequence-that-sums-to-target)
