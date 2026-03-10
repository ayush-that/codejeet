---
title: "How to Solve Maximum Split of Positive Even Integers — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Split of Positive Even Integers. Medium difficulty, 59.6% acceptance rate. Topics: Math, Backtracking, Greedy."
date: "2028-05-29"
category: "dsa-patterns"
tags: ["maximum-split-of-positive-even-integers", "math", "backtracking", "greedy", "medium"]
---

# How to Solve Maximum Split of Positive Even Integers

You need to split a given integer `finalSum` into the maximum number of unique positive even integers that sum to it. The challenge is finding the greedy approach that maximizes count while maintaining uniqueness and evenness. This problem is interesting because it looks like a backtracking problem but has a clean mathematical solution.

## Visual Walkthrough

Let's trace through `finalSum = 12` to build intuition:

**Step 1:** Check if `finalSum` is odd. If it is, we can't split it into even numbers at all (sum of even numbers is always even). For `12`, it's even, so we proceed.

**Step 2:** Start with the smallest even number, `2`. Subtract it from `12`, leaving `10`. Add `2` to our result list: `[2]`.

**Step 3:** Next smallest unused even number is `4`. Subtract from remaining `10`, leaving `6`. Add `4` to list: `[2, 4]`.

**Step 4:** Next is `6`. Subtract from remaining `6`, leaving `0`. Add `6` to list: `[2, 4, 6]`.

We've used `2 + 4 + 6 = 12` with 3 unique even numbers. This is indeed the maximum split - we can verify that `[12]` has 1 number, `[2, 10]` has 2, `[4, 8]` has 2, so 3 is maximum.

Now let's try `finalSum = 16`:

- Start with `2`: `16 - 2 = 14`, list `[2]`
- Add `4`: `14 - 4 = 10`, list `[2, 4]`
- Add `6`: `10 - 6 = 4`, list `[2, 4, 6]`
- Next would be `8`, but we only have `4` left. Here's the key: we can't use `8` because `8 > 4`. Instead, we add the remaining `4` to the last number `6`, making it `10`. Final list: `[2, 4, 10]`.

This gives us 3 numbers. Check: `2 + 4 + 10 = 16`. We couldn't use `4` again (needs to be unique), so we merged it with the last number.

## Brute Force Approach

A naive approach would try all combinations of even numbers that sum to `finalSum`. We could use backtracking: start with smallest even number, recursively try adding larger even numbers, track the maximum length solution.

The problem? The search space is huge. For `finalSum = 1000`, there are 500 possible even numbers (2, 4, 6, ..., 1000), and we're trying all subsets that sum to 1000. This is exponential time - O(2^n) where n ≈ finalSum/2.

Even with pruning (stopping when sum exceeds finalSum), this is too slow. We need a more efficient approach.

## Optimized Approach

The key insight is **greedy**: always take the smallest available even number. Why does this work?

1. To maximize the count of numbers, we want numbers to be as small as possible (so we can fit more of them).
2. The smallest sequence of unique even numbers is 2, 4, 6, 8, ...
3. If at any point the next smallest even number is larger than what remains, we add the remainder to the last number.

**Proof sketch**:

- The sum of first k even numbers is: 2 + 4 + ... + 2k = k(k+1)
- For a given finalSum, find largest k such that k(k+1) ≤ finalSum
- The greedy approach will use 2, 4, ..., 2(k-1), and the remainder as the last number
- This gives exactly k numbers when possible, which is maximum

**Algorithm steps**:

1. If finalSum is odd, return empty list (can't split odd into even numbers)
2. Start with current = 2 (smallest positive even)
3. While finalSum ≥ current:
   - Add current to result list
   - Subtract current from finalSum
   - Increment current by 2 (next even number)
4. If finalSum > 0, add it to the last element in result
5. Return result

## Optimal Solution

<div class="code-group">

```python
# Time: O(sqrt(n)) | Space: O(sqrt(n)) for storing result
# We iterate until current exceeds finalSum, which happens in O(sqrt(n)) steps
def maximumEvenSplit(finalSum):
    # Step 1: If finalSum is odd, we cannot split it into even numbers
    # because the sum of even numbers is always even
    if finalSum % 2 != 0:
        return []

    result = []
    current = 2  # Start with the smallest positive even number

    # Step 2: Greedily take the smallest available even number
    # Continue while we have enough remaining sum for the current number
    while finalSum >= current:
        # Add current even number to our result
        result.append(current)
        # Subtract it from the remaining sum
        finalSum -= current
        # Move to next even number (ensuring uniqueness)
        current += 2

    # Step 3: Handle any remainder
    # If there's any sum left, add it to the last element
    # This ensures we use all of finalSum
    if finalSum > 0:
        # Add remainder to the last number in result
        result[-1] += finalSum

    return result
```

```javascript
// Time: O(sqrt(n)) | Space: O(sqrt(n)) for storing result
// We iterate until current exceeds finalSum, which happens in O(sqrt(n)) steps
function maximumEvenSplit(finalSum) {
  // Step 1: If finalSum is odd, we cannot split it into even numbers
  // because the sum of even numbers is always even
  if (finalSum % 2 !== 0) {
    return [];
  }

  const result = [];
  let current = 2; // Start with the smallest positive even number

  // Step 2: Greedily take the smallest available even number
  // Continue while we have enough remaining sum for the current number
  while (finalSum >= current) {
    // Add current even number to our result
    result.push(current);
    // Subtract it from the remaining sum
    finalSum -= current;
    // Move to next even number (ensuring uniqueness)
    current += 2;
  }

  // Step 3: Handle any remainder
  // If there's any sum left, add it to the last element
  // This ensures we use all of finalSum
  if (finalSum > 0) {
    // Add remainder to the last number in result
    result[result.length - 1] += finalSum;
  }

  return result;
}
```

```java
// Time: O(sqrt(n)) | Space: O(sqrt(n)) for storing result
// We iterate until current exceeds finalSum, which happens in O(sqrt(n)) steps
import java.util.ArrayList;
import java.util.List;

public class Solution {
    public List<Long> maximumEvenSplit(long finalSum) {
        List<Long> result = new ArrayList<>();

        // Step 1: If finalSum is odd, we cannot split it into even numbers
        // because the sum of even numbers is always even
        if (finalSum % 2 != 0) {
            return result;
        }

        long current = 2;  // Start with the smallest positive even number

        // Step 2: Greedily take the smallest available even number
        // Continue while we have enough remaining sum for the current number
        while (finalSum >= current) {
            // Add current even number to our result
            result.add(current);
            // Subtract it from the remaining sum
            finalSum -= current;
            // Move to next even number (ensuring uniqueness)
            current += 2;
        }

        // Step 3: Handle any remainder
        // If there's any sum left, add it to the last element
        // This ensures we use all of finalSum
        if (finalSum > 0) {
            // Add remainder to the last number in result
            int lastIndex = result.size() - 1;
            result.set(lastIndex, result.get(lastIndex) + finalSum);
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(√n)**

- We start with current = 2 and increment by 2 each iteration
- The while loop runs while current ≤ finalSum
- The sum 2 + 4 + 6 + ... + 2k = k(k+1) grows quadratically
- For finalSum = n, k ≈ √n iterations
- Thus time complexity is O(√n)

**Space Complexity: O(√n)**

- We store the result list which contains approximately √n elements
- No other significant data structures are used
- Thus space complexity is O(√n)

## Common Mistakes

1. **Not checking for odd finalSum first**: Many candidates jump straight into the algorithm without checking if finalSum is odd. Since sum of even numbers is always even, odd finalSum should return empty list immediately.

2. **Forgetting to handle the remainder**: After the while loop, if finalSum > 0, it must be added to the last element. Otherwise, the numbers won't sum to the original finalSum. This remainder case happens when finalSum is not a perfect sum of consecutive evens.

3. **Using wrong increment or starting point**: Some candidates start with 0 instead of 2 (0 is not positive), or increment by 1 instead of 2 (losing the even property). Always start with 2 and increment by 2.

4. **Not ensuring uniqueness when adding remainder**: When adding the remainder to the last element, we must ensure it doesn't create a duplicate. Since remainder < current (otherwise while loop would continue), and current is the next even number after the last element, adding remainder to last element won't equal any previous number.

## When You'll See This Pattern

This greedy "take smallest first" pattern appears in many optimization problems:

1. **Coin Change (when greedy works)**: For certain coin systems (like US coins), taking the largest coin first minimizes count. Similar greedy "take biggest/smallest" thinking.

2. **Task Scheduler**: Schedule tasks with cooldown by always scheduling the most frequent task first when possible.

3. **Maximum Units on a Truck**: Sort boxes by units per box and take the highest first - similar greedy maximization.

4. **Split Array into Fibonacci Sequence**: While more complex, it also involves building a sequence by adding numbers in a specific order.

The key insight is recognizing when a locally optimal choice (taking the smallest even number) leads to a globally optimal solution (maximum count).

## Key Takeaways

1. **Greedy works for certain number partition problems**: When trying to maximize count of numbers summing to a target, starting with the smallest possible numbers often works. This is because smaller numbers allow you to fit more of them.

2. **Mathematical properties matter**: Recognizing that sum of even numbers is always even saves time. Understanding the formula for sum of consecutive evens (k(k+1)) helps verify the approach.

3. **Edge cases are critical**: Always check for invalid inputs first (odd numbers). Handle the remainder case carefully to ensure correctness.

[Practice this problem on CodeJeet](/problem/maximum-split-of-positive-even-integers)
