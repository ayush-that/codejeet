---
title: "How to Solve Split Array into Fibonacci Sequence — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Split Array into Fibonacci Sequence. Medium difficulty, 40.2% acceptance rate. Topics: String, Backtracking."
date: "2028-09-07"
category: "dsa-patterns"
tags: ["split-array-into-fibonacci-sequence", "string", "backtracking", "medium"]
---

# How to Solve Split Array into Fibonacci Sequence

You're given a string of digits, and your task is to determine if it can be split into a Fibonacci-like sequence where each number after the first two is the sum of the two preceding numbers. The challenge lies in not knowing where to split the string—you need to try different split points while respecting constraints like 32-bit integer limits and the requirement that numbers can't have leading zeros (except for the number 0 itself).

This problem is tricky because it combines string parsing with backtracking. You need to intelligently explore possible splits without brute-forcing all combinations, which would be exponential. The key insight is that once you choose the first two numbers, the rest of the sequence is determined—you just need to verify if the remaining string matches.

## Visual Walkthrough

Let's trace through the example `num = "123456579"`:

1. **Choose first number**: Try `"1"` (length 1)
2. **Choose second number**: Try `"2"` (length 1)
   - Sum = 1 + 2 = 3
   - Next number should be `"3"`, but the next digits are `"3456579"`, which starts with `"34"`, not `"3"`
   - Backtrack

3. **Choose second number**: Try `"23"` (length 2)
   - Sum = 1 + 23 = 24
   - Next number should be `"24"`, but the next digits are `"456579"`, which starts with `"456"`, not `"24"`
   - Backtrack

4. **Choose second number**: Try `"234"` (length 3)
   - Sum = 1 + 234 = 235
   - Next number should be `"235"`, but the next digits are `"56579"`, which starts with `"565"`, not `"235"`
   - Backtrack

5. **Choose first number**: Try `"12"` (length 2)
6. **Choose second number**: Try `"3"` (length 1)
   - Sum = 12 + 3 = 15
   - Next number should be `"15"`, but the next digits are `"456579"`, which starts with `"456"`, not `"15"`
   - Backtrack

7. **Choose second number**: Try `"34"` (length 2)
   - Sum = 12 + 34 = 46
   - Next number should be `"46"`, but the next digits are `"56579"`, which starts with `"565"`, not `"46"`
   - Backtrack

8. **Choose second number**: Try `"345"` (length 3)
   - Sum = 12 + 345 = 357
   - Next number should be `"357"`, but the next digits are `"6579"`, which starts with `"657"`, not `"357"`
   - Backtrack

9. **Choose first number**: Try `"123"` (length 3)
10. **Choose second number**: Try `"456"` (length 3)
    - Sum = 123 + 456 = 579
    - Next number should be `"579"`, and the remaining string is exactly `"579"`
    - We have a valid sequence: `[123, 456, 579]`

Notice how we systematically try different lengths for the first two numbers, then let the Fibonacci property determine what should come next.

## Brute Force Approach

A truly naive brute force would try all possible splits of the string into numbers, then check if they form a Fibonacci sequence. For a string of length `n`, there are `2^(n-1)` possible ways to split it (between each pair of digits, you either split or don't). For each split, you'd need to validate the Fibonacci property, leading to `O(n * 2^n)` time complexity—completely impractical for `n > 20`.

What candidates often try first is fixing the first number and then trying all possible second numbers, but without proper pruning, this still explores too many possibilities. For example, with `num = "11235813"`, if you choose `"1"` as the first number and `"1"` as the second, you'd correctly find `[1, 1, 2, 3, 5, 8, 13]`. But if you choose `"11"` as first and `"2"` as second, you'd quickly fail because `11 + 2 = 13`, but the next digits are `"35813"`, not starting with `"13"`.

The brute force approach fails because it doesn't leverage the Fibonacci property to prune invalid paths early. Once we choose the first two numbers, every subsequent number is predetermined—we just need to check if it exists in the string at the expected position.

## Optimized Approach

The key insight is **backtracking with pruning**:

1. **Choose first number**: Try all possible prefixes of the string as the first number (respecting no leading zeros and 32-bit limit)
2. **Choose second number**: For each first number, try all possible second numbers starting from the next position
3. **Generate sequence**: Once we have two numbers, we can compute the next number as their sum
4. **Check match**: See if the next digits in the string match this sum
5. **Recurse**: If they match, continue with the last two numbers
6. **Backtrack**: If at any point there's no match, try a different second number or first number

**Critical optimizations**:

- Stop if a number exceeds 2^31 - 1 (32-bit signed integer limit)
- Stop if a number has more than 10 digits (since 2^31 - 1 has 10 digits)
- No leading zeros unless the number is exactly "0"
- Once we have a valid sequence with at least 3 numbers that consumes the entire string, we're done

The backtracking works because we're building the sequence incrementally and abandoning paths as soon as they fail to match the Fibonacci property.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * 2^n) worst case but much faster with pruning | Space: O(n) for recursion stack
class Solution:
    def splitIntoFibonacci(self, num: str) -> List[int]:
        result = []

        def backtrack(start, sequence):
            # If we've reached the end of the string and have at least 3 numbers
            if start == len(num) and len(sequence) >= 3:
                # Found a valid Fibonacci sequence
                result.extend(sequence)
                return True

            # Try to extract the next number starting at position 'start'
            for i in range(start, len(num)):
                # Avoid numbers with leading zeros (except for the number 0 itself)
                if num[start] == '0' and i > start:
                    break

                # Extract the candidate number as a substring
                candidate = num[start:i+1]

                # Check if the number fits in 32-bit signed integer
                if int(candidate) > 2**31 - 1:
                    break

                # If we already have at least 2 numbers in the sequence,
                # check if the candidate equals the sum of the last two
                if len(sequence) >= 2:
                    last_two_sum = sequence[-1] + sequence[-2]
                    candidate_int = int(candidate)

                    # If candidate is greater than the expected sum, no need to check longer numbers
                    if candidate_int > last_two_sum:
                        break

                    # If candidate is less than the expected sum, try a longer number
                    if candidate_int < last_two_sum:
                        continue

                # At this point, either:
                # 1. We have less than 2 numbers (so any valid number is acceptable), OR
                # 2. The candidate equals the sum of the last two numbers
                sequence.append(int(candidate))

                # Recursively try to build the rest of the sequence
                if backtrack(i + 1, sequence):
                    return True

                # Backtrack: remove the candidate and try a different length
                sequence.pop()

            return False

        backtrack(0, [])
        return result
```

```javascript
// Time: O(n * 2^n) worst case but much faster with pruning | Space: O(n) for recursion stack
/**
 * @param {string} num
 * @return {number[]}
 */
var splitIntoFibonacci = function (num) {
  const result = [];
  const MAX_INT = Math.pow(2, 31) - 1;

  function backtrack(start, sequence) {
    // If we've reached the end of the string and have at least 3 numbers
    if (start === num.length && sequence.length >= 3) {
      // Found a valid Fibonacci sequence
      result.push(...sequence);
      return true;
    }

    // Try to extract the next number starting at position 'start'
    for (let i = start; i < num.length; i++) {
      // Avoid numbers with leading zeros (except for the number 0 itself)
      if (num[start] === "0" && i > start) {
        break;
      }

      // Extract the candidate number as a substring
      const candidate = num.substring(start, i + 1);

      // Check if the number fits in 32-bit signed integer
      // Using BigInt to handle large numbers safely
      const candidateInt = BigInt(candidate);
      if (candidateInt > MAX_INT) {
        break;
      }

      // Convert to regular number for arithmetic
      const candidateNum = Number(candidateInt);

      // If we already have at least 2 numbers in the sequence,
      // check if the candidate equals the sum of the last two
      if (sequence.length >= 2) {
        const lastTwoSum = sequence[sequence.length - 1] + sequence[sequence.length - 2];

        // If candidate is greater than the expected sum, no need to check longer numbers
        if (candidateNum > lastTwoSum) {
          break;
        }

        // If candidate is less than the expected sum, try a longer number
        if (candidateNum < lastTwoSum) {
          continue;
        }
      }

      // At this point, either:
      // 1. We have less than 2 numbers (so any valid number is acceptable), OR
      // 2. The candidate equals the sum of the last two numbers
      sequence.push(candidateNum);

      // Recursively try to build the rest of the sequence
      if (backtrack(i + 1, sequence)) {
        return true;
      }

      // Backtrack: remove the candidate and try a different length
      sequence.pop();
    }

    return false;
  }

  backtrack(0, []);
  return result;
};
```

```java
// Time: O(n * 2^n) worst case but much faster with pruning | Space: O(n) for recursion stack
import java.util.*;

class Solution {
    public List<Integer> splitIntoFibonacci(String num) {
        List<Integer> result = new ArrayList<>();
        backtrack(num, 0, new ArrayList<>(), result);
        return result;
    }

    private boolean backtrack(String num, int start, List<Integer> sequence, List<Integer> result) {
        // If we've reached the end of the string and have at least 3 numbers
        if (start == num.length() && sequence.size() >= 3) {
            // Found a valid Fibonacci sequence
            result.addAll(sequence);
            return true;
        }

        // Try to extract the next number starting at position 'start'
        for (int i = start; i < num.length(); i++) {
            // Avoid numbers with leading zeros (except for the number 0 itself)
            if (num.charAt(start) == '0' && i > start) {
                break;
            }

            // Extract the candidate number as a substring
            String candidateStr = num.substring(start, i + 1);

            // Check if the number fits in 32-bit signed integer
            // Using long to handle potential overflow during conversion
            long candidateLong = Long.parseLong(candidateStr);
            if (candidateLong > Integer.MAX_VALUE) {
                break;
            }

            int candidate = (int) candidateLong;

            // If we already have at least 2 numbers in the sequence,
            // check if the candidate equals the sum of the last two
            if (sequence.size() >= 2) {
                int lastTwoSum = sequence.get(sequence.size() - 1) + sequence.get(sequence.size() - 2);

                // If candidate is greater than the expected sum, no need to check longer numbers
                if (candidate > lastTwoSum) {
                    break;
                }

                // If candidate is less than the expected sum, try a longer number
                if (candidate < lastTwoSum) {
                    continue;
                }
            }

            // At this point, either:
            // 1. We have less than 2 numbers (so any valid number is acceptable), OR
            // 2. The candidate equals the sum of the last two numbers
            sequence.add(candidate);

            // Recursively try to build the rest of the sequence
            if (backtrack(num, i + 1, sequence, result)) {
                return true;
            }

            // Backtrack: remove the candidate and try a different length
            sequence.remove(sequence.size() - 1);
        }

        return false;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: In the worst case, the algorithm tries all possible splits, which is `O(n * 2^n)`. However, with the pruning conditions:

1. Numbers can't have leading zeros (except "0")
2. Numbers must fit in 32-bit integers
3. Once we have two numbers, subsequent numbers must equal the sum of the previous two

These constraints dramatically reduce the search space. In practice, the algorithm runs much faster. The `n * 2^n` upper bound is when every digit is '1' and every split produces valid numbers that need to be checked.

**Space Complexity**: `O(n)` for the recursion stack depth (at most `n` recursive calls) and the sequence storage (which can't exceed `n` numbers, each of which is at most 10 digits when converted to string form).

## Common Mistakes

1. **Not handling integer overflow**: When converting substrings to integers, very long substrings (more than 10 digits) can overflow 32-bit integers. Always check the length or use 64-bit integers during conversion.
2. **Incorrect handling of leading zeros**: The requirement is that numbers can't have leading zeros UNLESS the number is exactly "0". So "01" is invalid, but "0" is valid. Many candidates either reject all numbers starting with '0' or accept invalid numbers like "01".

3. **Forgetting to check the 32-bit limit**: The problem explicitly states `0 <= f[i] < 2^31`. Numbers like "2147483648" (2^31) are invalid even if they fit the Fibonacci pattern.

4. **Not requiring at least 3 numbers**: A valid Fibonacci-like sequence must have at least 3 numbers. Some candidates return early with just 2 numbers.

5. **Inefficient string to integer conversion**: Converting the same substring multiple times is wasteful. In the loop, build the number incrementally by multiplying by 10 and adding the new digit.

## When You'll See This Pattern

This backtracking-with-pruning pattern appears in problems where you need to explore possible splits or partitions of a sequence:

1. **Additive Number** (LeetCode 306): Almost identical problem—check if a string can be split into an additive sequence. The main difference is that Additive Number only requires checking existence, not returning the sequence.

2. **Restore IP Addresses** (LeetCode 93): Split a string into valid IP address segments (4 parts, each 0-255, no leading zeros). Similar backtracking over split points with validation rules.

3. **Palindrome Partitioning** (LeetCode 131): Split a string into substrings where each substring is a palindrome. Same pattern of trying different split points and validating each segment.

The core pattern is: try a candidate segment, validate it against constraints, recurse on the remainder, and backtrack if it doesn't lead to a solution.

## Key Takeaways

1. **Backtracking with validation is powerful for partition problems**: When you need to split a sequence into valid segments, backtracking lets you explore possibilities while pruning invalid paths early.

2. **Constraints guide pruning**: Pay close attention to problem constraints (no leading zeros, integer limits, minimum sequence length). Each constraint is an opportunity to prune the search space.

3. **Once the first two numbers are chosen, the sequence is determined**: This is the key insight that makes the problem tractable. You're not trying all possible sequences—you're verifying if a particular choice of first two numbers produces a valid sequence.

Related problems: [Additive Number](/problem/additive-number), [Fibonacci Number](/problem/fibonacci-number)
