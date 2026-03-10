---
title: "How to Solve Minimum Number of Days to Eat N Oranges — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Number of Days to Eat N Oranges. Hard difficulty, 36.1% acceptance rate. Topics: Dynamic Programming, Memoization."
date: "2028-10-06"
category: "dsa-patterns"
tags: ["minimum-number-of-days-to-eat-n-oranges", "dynamic-programming", "memoization", "hard"]
---

# How to Solve Minimum Number of Days to Eat N Oranges

You have `n` oranges and three eating options each day: eat one orange, eat half if divisible by 2, or eat two-thirds if divisible by 3. Your goal is to find the minimum days to reach 0 oranges. This problem is tricky because the optimal strategy isn't simply using division when possible—sometimes eating one orange to reach a divisible number is better than eating one orange repeatedly.

## Visual Walkthrough

Let's trace through `n = 10` to build intuition:

**Day 1:** 10 is divisible by 2, so we could eat 10/2 = 5 oranges → 5 remaining.  
**Day 2:** 5 is not divisible by 2 or 3, so we must eat 1 orange → 4 remaining.  
**Day 3:** 4 is divisible by 2, eat 4/2 = 2 → 2 remaining.  
**Day 4:** 2 is divisible by 2, eat 2/2 = 1 → 1 remaining.  
**Day 5:** Eat the last orange → 0 remaining.

That's 5 days, but is it optimal? Let's try a different approach:

**Day 1:** Eat 1 orange (instead of half) → 9 remaining.  
**Day 2:** 9 is divisible by 3, eat 9 × 2/3 = 6 → 3 remaining.  
**Day 3:** 3 is divisible by 3, eat 3 × 2/3 = 2 → 1 remaining.  
**Day 4:** Eat the last orange → 0 remaining.

That's 4 days—better! This shows why we can't greedily divide when possible. Sometimes eating one orange to reach a number divisible by 3 (like going from 10 to 9) yields better results.

## Brute Force Approach

A naive solution would explore all possible sequences of moves using recursion:

```python
def minDays(n):
    if n == 0:
        return 0
    if n == 1:
        return 1

    days = 1 + minDays(n - 1)  # Option 1: eat one

    if n % 2 == 0:
        days = min(days, 1 + minDays(n // 2))  # Option 2: eat half

    if n % 3 == 0:
        days = min(days, 1 + minDays(n // 3))  # Option 3: eat two-thirds

    return days
```

**Why it's too slow:** This creates an exponential recursion tree. For `n = 100`, the recursion explores all paths down to 0, resulting in O(3^n) time complexity. Even `n = 1000` would be impossible. We need to avoid recomputing the same subproblems.

## Optimized Approach

The key insight is that this is a **dynamic programming** problem with overlapping subproblems. However, a standard DP array from 0 to n would be O(n) space and time, which fails for n up to 2×10^9.

**Better approach:** Use memoization with recursion, but optimize further:

1. Instead of always subtracting 1 to reach divisibility, calculate the exact number of "-1" moves needed
2. Use this formula: `minDays(n) = 1 + min(n%2 + minDays(n//2), n%3 + minDays(n//3))`
   - `n%2` represents the 1-orange eats needed to make n divisible by 2
   - `n%3` represents the 1-orange eats needed to make n divisible by 3
3. This reduces the recursion depth to O(log n) since we're dividing by 2 or 3 each time

**Why this works:** For any n, the optimal path involves either:

- Eating enough oranges (0, 1, or 2) to reach a multiple of 2, then eating half
- Eating enough oranges (0, 1, or 2) to reach a multiple of 3, then eating two-thirds

We don't need to simulate every single "-1" move—just count how many are needed.

## Optimal Solution

<div class="code-group">

```python
# Time: O(log n) | Space: O(log n) for recursion stack and memoization
class Solution:
    def minDays(self, n: int) -> int:
        # Memoization dictionary to store computed results
        memo = {}

        def dfs(remaining):
            # Base cases
            if remaining <= 1:
                return remaining  # 0 days for 0 oranges, 1 day for 1 orange

            # Return cached result if available
            if remaining in memo:
                return memo[remaining]

            # Option 1: Eat enough oranges to make it divisible by 2, then eat half
            # remaining % 2 = oranges to eat one-by-one, then 1 day for eating half
            option1 = remaining % 2 + dfs(remaining // 2) + 1

            # Option 2: Eat enough oranges to make it divisible by 3, then eat two-thirds
            # remaining % 3 = oranges to eat one-by-one, then 1 day for eating two-thirds
            option2 = remaining % 3 + dfs(remaining // 3) + 1

            # Take the minimum of both options
            result = min(option1, option2)

            # Cache the result
            memo[remaining] = result
            return result

        return dfs(n)
```

```javascript
// Time: O(log n) | Space: O(log n) for recursion stack and memoization
var minDays = function (n) {
  // Memoization map to store computed results
  const memo = new Map();

  const dfs = (remaining) => {
    // Base cases
    if (remaining <= 1) {
      return remaining; // 0 days for 0 oranges, 1 day for 1 orange
    }

    // Return cached result if available
    if (memo.has(remaining)) {
      return memo.get(remaining);
    }

    // Option 1: Eat enough oranges to make it divisible by 2, then eat half
    // remaining % 2 = oranges to eat one-by-one, then 1 day for eating half
    const option1 = (remaining % 2) + dfs(Math.floor(remaining / 2)) + 1;

    // Option 2: Eat enough oranges to make it divisible by 3, then eat two-thirds
    // remaining % 3 = oranges to eat one-by-one, then 1 day for eating two-thirds
    const option2 = (remaining % 3) + dfs(Math.floor(remaining / 3)) + 1;

    // Take the minimum of both options
    const result = Math.min(option1, option2);

    // Cache the result
    memo.set(remaining, result);
    return result;
  };

  return dfs(n);
};
```

```java
// Time: O(log n) | Space: O(log n) for recursion stack and memoization
import java.util.HashMap;
import java.util.Map;

class Solution {
    // Memoization map to store computed results
    private Map<Integer, Integer> memo = new HashMap<>();

    public int minDays(int n) {
        return dfs(n);
    }

    private int dfs(int remaining) {
        // Base cases
        if (remaining <= 1) {
            return remaining; // 0 days for 0 oranges, 1 day for 1 orange
        }

        // Return cached result if available
        if (memo.containsKey(remaining)) {
            return memo.get(remaining);
        }

        // Option 1: Eat enough oranges to make it divisible by 2, then eat half
        // remaining % 2 = oranges to eat one-by-one, then 1 day for eating half
        int option1 = (remaining % 2) + dfs(remaining / 2) + 1;

        // Option 2: Eat enough oranges to make it divisible by 3, then eat two-thirds
        // remaining % 3 = oranges to eat one-by-one, then 1 day for eating two-thirds
        int option2 = (remaining % 3) + dfs(remaining / 3) + 1;

        // Take the minimum of both options
        int result = Math.min(option1, option2);

        // Cache the result
        memo.put(remaining, result);
        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(log n)

- Each recursive call reduces n by a factor of 2 or 3
- The recursion depth is O(log n)
- With memoization, each distinct n is computed only once
- There are O(log n) distinct values in the memoization cache

**Space Complexity:** O(log n)

- Recursion stack depth: O(log n)
- Memoization storage: O(log n) distinct values
- Total: O(log n)

## Common Mistakes

1. **Greedy approach of always dividing when possible:** As shown in the visual walkthrough, sometimes eating one orange to reach a better divisible number yields fewer total days. Always compare both division options.

2. **Forgetting to add the "+1" for the division day:** When calculating `option1` and `option2`, remember that eating half or two-thirds takes one day in addition to the days needed for the remaining oranges.

3. **Using array DP for large n:** Creating an array of size n (up to 2×10^9) would exceed memory limits. The memoization approach only stores O(log n) values.

4. **Incorrect base cases:** For n=0, you need 0 days (not 1). For n=1, you need 1 day (eating the single orange).

## When You'll See This Pattern

This problem combines **memoization** with **mathematical optimization** to handle extremely large inputs. Similar patterns appear in:

1. **Coin Change (LeetCode 322):** Like finding minimum coins, but with the twist of optimizing division operations.
2. **Integer Replacement (LeetCode 397):** Similar "reduce n to 1" problem with operations n→n-1 or n→n/2 (if even).
3. **2 Keys Keyboard (LeetCode 650):** Finding minimum operations to reach n, where you can copy-paste existing results.

These problems all involve finding minimum steps with operations that include division/multiplication, requiring careful analysis of when to use which operation.

## Key Takeaways

1. **Don't assume greedy works with division operations:** Always compare multiple reduction strategies when you have options like n→n-1, n→n/2, n→n/3.

2. **Memoization can handle huge inputs when recursion depth is shallow:** Even with n up to billions, O(log n) depth is manageable. Store only computed values rather than pre-allocating huge arrays.

3. **Mathematical insight beats brute force simulation:** Instead of simulating every "-1" move, calculate how many are needed to reach divisibility. This reduces O(n) recursion to O(log n).

[Practice this problem on CodeJeet](/problem/minimum-number-of-days-to-eat-n-oranges)
