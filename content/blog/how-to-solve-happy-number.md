---
title: "How to Solve Happy Number — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Happy Number. Easy difficulty, 59.3% acceptance rate. Topics: Hash Table, Math, Two Pointers."
date: "2026-05-15"
category: "dsa-patterns"
tags: ["happy-number", "hash-table", "math", "two-pointers", "easy"]
---

# How to Solve Happy Number

The Happy Number problem asks us to determine whether repeatedly replacing a number with the sum of the squares of its digits eventually reaches 1. If it does, the number is "happy"; otherwise, it enters a cycle that never reaches 1. What makes this problem interesting is that it appears to be about number theory, but the cycle detection aspect makes it fundamentally a graph/traversal problem in disguise.

## Visual Walkthrough

Let's trace through two examples to build intuition:

**Example 1: n = 19 (Happy Number)**

```
19 → 1² + 9² = 1 + 81 = 82
82 → 8² + 2² = 64 + 4 = 68
68 → 6² + 8² = 36 + 64 = 100
100 → 1² + 0² + 0² = 1 + 0 + 0 = 1 ✓
```

Since we reached 1, 19 is a happy number.

**Example 2: n = 2 (Not Happy)**

```
2 → 2² = 4
4 → 4² = 16
16 → 1² + 6² = 1 + 36 = 37
37 → 3² + 7² = 9 + 49 = 58
58 → 5² + 8² = 25 + 64 = 89
89 → 8² + 9² = 64 + 81 = 145
145 → 1² + 4² + 5² = 1 + 16 + 25 = 42
42 → 4² + 2² = 16 + 4 = 20
20 → 2² + 0² = 4 + 0 = 4
```

Notice we're back to 4, which we saw earlier! This means we've entered a cycle: 4 → 16 → 37 → 58 → 89 → 145 → 42 → 20 → 4. Since this cycle doesn't contain 1, 2 is not a happy number.

The key insight: If a number is not happy, the process will eventually repeat a number we've seen before, creating a cycle. Our job is to detect this cycle.

## Brute Force Approach

A naive approach might be to simply run the process for a fixed number of iterations (say 1000) and check if we reach 1. However, this is unreliable because:

1. We don't know how many iterations are enough for all numbers
2. Some numbers might take more than our arbitrary limit to reach 1 or enter a cycle
3. It's inefficient if the cycle is detected early

The brute force approach that actually works is to use a hash set to track seen numbers:

1. Start with the given number n
2. While n is not 1:
   - Calculate the sum of squares of digits of n
   - If we've seen this sum before, return false (cycle detected)
   - Otherwise, add it to the seen set and continue
3. If we reach 1, return true

This approach works but requires O(k) space where k is the number of unique values we encounter before detecting a cycle or reaching 1.

## Optimal Solution

The optimal solution uses Floyd's Cycle Detection Algorithm (also known as the tortoise and hare algorithm). This allows us to detect cycles with O(1) space instead of O(k) space. The insight is that if there's a cycle, a fast pointer moving two steps at a time will eventually meet a slow pointer moving one step at a time.

<div class="code-group">

```python
# Time: O(log n) | Space: O(1)
def isHappy(n: int) -> bool:
    """
    Determines if a number is happy using Floyd's Cycle Detection.

    A happy number eventually reaches 1 when repeatedly replacing it
    with the sum of squares of its digits. Unhappy numbers enter cycles.
    """

    def get_next(num: int) -> int:
        """Helper function to calculate sum of squares of digits."""
        total_sum = 0
        while num > 0:
            # Extract the last digit
            digit = num % 10
            # Add square of digit to total
            total_sum += digit * digit
            # Remove the last digit
            num //= 10
        return total_sum

    # Initialize slow and fast pointers
    slow = n
    fast = get_next(n)

    # Continue until fast reaches 1 or fast meets slow
    while fast != 1 and slow != fast:
        # Move slow one step
        slow = get_next(slow)
        # Move fast two steps
        fast = get_next(get_next(fast))

    # If fast reached 1, it's a happy number
    return fast == 1
```

```javascript
// Time: O(log n) | Space: O(1)
/**
 * Determines if a number is happy using Floyd's Cycle Detection.
 *
 * A happy number eventually reaches 1 when repeatedly replacing it
 * with the sum of squares of its digits. Unhappy numbers enter cycles.
 */
function isHappy(n) {
  /**
   * Helper function to calculate sum of squares of digits.
   * @param {number} num - The number to process
   * @return {number} Sum of squares of digits
   */
  function getNext(num) {
    let totalSum = 0;
    while (num > 0) {
      // Extract the last digit
      const digit = num % 10;
      // Add square of digit to total
      totalSum += digit * digit;
      // Remove the last digit
      num = Math.floor(num / 10);
    }
    return totalSum;
  }

  // Initialize slow and fast pointers
  let slow = n;
  let fast = getNext(n);

  // Continue until fast reaches 1 or fast meets slow
  while (fast !== 1 && slow !== fast) {
    // Move slow one step
    slow = getNext(slow);
    // Move fast two steps
    fast = getNext(getNext(fast));
  }

  // If fast reached 1, it's a happy number
  return fast === 1;
}
```

```java
// Time: O(log n) | Space: O(1)
class Solution {
    /**
     * Determines if a number is happy using Floyd's Cycle Detection.
     *
     * A happy number eventually reaches 1 when repeatedly replacing it
     * with the sum of squares of its digits. Unhappy numbers enter cycles.
     */
    public boolean isHappy(int n) {
        // Initialize slow and fast pointers
        int slow = n;
        int fast = getNext(n);

        // Continue until fast reaches 1 or fast meets slow
        while (fast != 1 && slow != fast) {
            // Move slow one step
            slow = getNext(slow);
            // Move fast two steps
            fast = getNext(getNext(fast));
        }

        // If fast reached 1, it's a happy number
        return fast == 1;
    }

    /**
     * Helper function to calculate sum of squares of digits.
     * @param num The number to process
     * @return Sum of squares of digits
     */
    private int getNext(int num) {
        int totalSum = 0;
        while (num > 0) {
            // Extract the last digit
            int digit = num % 10;
            // Add square of digit to total
            totalSum += digit * digit;
            // Remove the last digit
            num /= 10;
        }
        return totalSum;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(log n)**

- The `getNext()` function processes each digit of the number, which takes O(log₁₀ n) time since a number n has roughly log₁₀ n digits
- The number of steps needed to detect a cycle or reach 1 is also bounded. For numbers less than 243 (the maximum sum of squares for a 3-digit number), the next value is at most 243. This creates a finite state space
- In practice, the algorithm converges quickly, making the overall time complexity O(log n)

**Space Complexity: O(1)**

- We only use a constant amount of extra space for the slow and fast pointers and temporary variables in `getNext()`
- This is the key advantage over the hash set approach which uses O(k) space

## Common Mistakes

1. **Infinite loop without cycle detection**: Simply running the process without checking for cycles will cause infinite loops for unhappy numbers. Always implement cycle detection.

2. **Incorrect digit extraction**: Forgetting to use integer division (`//` in Python, `Math.floor(num / 10)` in JavaScript, `/=` in Java) can lead to floating-point errors or incorrect results.

3. **Wrong termination condition**: Checking only if `slow == fast` without also checking if `fast == 1` can cause premature termination. We need to check both conditions.

4. **Not handling edge cases**: While the problem states n is positive, candidates should still consider n = 1 (which should return true immediately) and very large numbers (which our algorithm handles correctly).

## When You'll See This Pattern

The cycle detection pattern using Floyd's Tortoise and Hare algorithm appears in several problems:

1. **Linked List Cycle (Easy)**: The classic application where you need to detect if a linked list has a cycle without using extra space.

2. **Find the Duplicate Number (Medium)**: Given an array of n+1 integers where each integer is between 1 and n, find the duplicate number using constant space. This problem cleverly treats the array as a linked list where array values point to indices.

3. **Palindrome Linked List (Easy)**: While not exactly the same, the fast/slow pointer technique is used to find the middle of a linked list.

The pattern to recognize: When you need to detect cycles or find meeting points in a sequence where each element determines the next element, consider using two pointers moving at different speeds.

## Key Takeaways

1. **Cycle detection problems often hide in unexpected places**: The Happy Number problem appears to be about math, but the core challenge is detecting cycles in a sequence. Always ask: "Could this process repeat? How would I detect that?"

2. **Floyd's Cycle Detection provides O(1) space solution**: When you need to detect cycles, consider whether you can use slow/fast pointers instead of a hash set to save space.

3. **Break problems into helper functions**: The `getNext()` function isolates the digit calculation logic, making the main algorithm cleaner and easier to understand.

Related problems: [Linked List Cycle](/problem/linked-list-cycle), [Add Digits](/problem/add-digits), [Ugly Number](/problem/ugly-number)
