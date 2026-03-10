---
title: "How to Solve Number of Ways to Buy Pens and Pencils — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Number of Ways to Buy Pens and Pencils. Medium difficulty, 56.6% acceptance rate. Topics: Math, Enumeration."
date: "2028-12-11"
category: "dsa-patterns"
tags: ["number-of-ways-to-buy-pens-and-pencils", "math", "enumeration", "medium"]
---

# How to Solve Number of Ways to Buy Pens and Pencils

You have a fixed budget and two items with different prices. You need to count all possible combinations where you spend some or all of your money on these items. The tricky part is that you can buy any non-negative integer quantity of each item, and you don't have to spend all your money. This creates a combinatorial counting problem that needs to be solved efficiently.

## Visual Walkthrough

Let's trace through a concrete example: `total = 20`, `cost1 = 10` (pens), `cost2 = 5` (pencils).

We want to count all combinations `(x, y)` where:

- `x` = number of pens (≥ 0)
- `y` = number of pencils (≥ 0)
- `10*x + 5*y ≤ 20`

Let's enumerate systematically:

**Step 1:** Try different numbers of pens

- If we buy 0 pens: We have 20 left. How many pencils can we buy? `5*y ≤ 20` → `y ≤ 4`. So we can buy 0, 1, 2, 3, or 4 pencils. That's **5** possibilities.
- If we buy 1 pen: We spend 10, leaving 10. `5*y ≤ 10` → `y ≤ 2`. So y can be 0, 1, 2. That's **3** possibilities.
- If we buy 2 pens: We spend 20, leaving 0. `5*y ≤ 0` → `y ≤ 0`. So y can only be 0. That's **1** possibility.
- If we buy 3 pens: We'd need 30, which exceeds our total. Stop here.

Total ways: 5 + 3 + 1 = **9** combinations.

Notice the pattern: For each possible number of pens `x` (from 0 up to `total // cost1`), we calculate how much money remains, then see how many pencils we can buy with that remainder. The number of pencil options is always `(remaining // cost2) + 1` because we can buy 0 pencils too.

## Brute Force Approach

A truly brute force approach would try all possible pairs `(x, y)` and check if `cost1*x + cost2*y ≤ total`. We'd need to try:

- `x` from 0 to `total // cost1`
- `y` from 0 to `total // cost2`

This gives us O((total/cost1) \* (total/cost2)) time complexity, which could be as bad as O(total²) if costs are 1. For `total = 10^6`, this would be 10^12 operations — far too slow.

Even a slightly better brute force would still be inefficient: we could iterate `x` from 0 to `total // cost1`, and for each `x`, iterate `y` from 0 until `cost1*x + cost2*y > total`. This is still O(total² / (cost1\*cost2)) in worst case.

<div class="code-group">

```python
# BRUTE FORCE - TOO SLOW FOR LARGE INPUTS
# Time: O(total² / (cost1*cost2)) | Space: O(1)
def waysToBuyPensPencils_brute(total, cost1, cost2):
    count = 0
    # Try all possible numbers of pens
    for pens in range(total // cost1 + 1):
        # For each number of pens, try all possible pencils
        for pencils in range(total // cost2 + 1):
            if pens * cost1 + pencils * cost2 <= total:
                count += 1
    return count
```

```javascript
// BRUTE FORCE - TOO SLOW FOR LARGE INPUTS
// Time: O(total² / (cost1*cost2)) | Space: O(1)
function waysToBuyPensPencilsBrute(total, cost1, cost2) {
  let count = 0;
  // Try all possible numbers of pens
  for (let pens = 0; pens <= Math.floor(total / cost1); pens++) {
    // For each number of pens, try all possible pencils
    for (let pencils = 0; pencils <= Math.floor(total / cost2); pencils++) {
      if (pens * cost1 + pencils * cost2 <= total) {
        count++;
      }
    }
  }
  return count;
}
```

```java
// BRUTE FORCE - TOO SLOW FOR LARGE INPUTS
// Time: O(total² / (cost1*cost2)) | Space: O(1)
public long waysToBuyPensPencilsBrute(int total, int cost1, int cost2) {
    long count = 0;
    // Try all possible numbers of pens
    for (int pens = 0; pens <= total / cost1; pens++) {
        // For each number of pens, try all possible pencils
        for (int pencils = 0; pencils <= total / cost2; pencils++) {
            if (pens * cost1 + pencils * cost2 <= total) {
                count++;
            }
        }
    }
    return count;
}
```

</div>

## Optimized Approach

The key insight is that we don't need to iterate through all possible `y` values for each `x`. Once we fix `x` (number of pens), we can directly calculate how many valid `y` values exist:

1. Calculate money spent on pens: `spent_on_pens = x * cost1`
2. Calculate remaining money: `remaining = total - spent_on_pens`
3. If `remaining < 0`, we've spent too much — but our loop will stop before this happens
4. The maximum pencils we can buy is `remaining // cost2`
5. We can buy 0, 1, 2, ..., up to `max_pencils` pencils
6. That's exactly `max_pencils + 1` options (including 0)

So for each `x`, we add `(remaining // cost2) + 1` to our count.

This reduces the time complexity from O(total²) to O(total/cost1), which is much more efficient. In the worst case where `cost1 = 1`, this is O(total), which is acceptable for `total ≤ 10^6`.

## Optimal Solution

Here's the efficient implementation using the insight above:

<div class="code-group">

```python
# OPTIMAL SOLUTION
# Time: O(total // cost1) | Space: O(1)
def waysToBuyPensPencils(total, cost1, cost2):
    """
    Count all combinations of pens and pencils that cost ≤ total.

    Args:
        total: Total amount of money available
        cost1: Price of one pen
        cost2: Price of one pencil

    Returns:
        Number of valid (pens, pencils) combinations
    """
    count = 0

    # Try every possible number of pens we can buy
    # We can buy from 0 pens up to the maximum affordable pens
    for pens in range(total // cost1 + 1):
        # Calculate money spent on pens
        spent_on_pens = pens * cost1

        # Calculate remaining money after buying pens
        remaining = total - spent_on_pens

        # With remaining money, we can buy 0 to (remaining // cost2) pencils
        # The +1 accounts for the option of buying 0 pencils
        max_pencils = remaining // cost2
        count += max_pencils + 1

    return count
```

```javascript
// OPTIMAL SOLUTION
// Time: O(Math.floor(total / cost1)) | Space: O(1)
function waysToBuyPensPencils(total, cost1, cost2) {
  /**
   * Count all combinations of pens and pencils that cost ≤ total.
   *
   * @param {number} total - Total amount of money available
   * @param {number} cost1 - Price of one pen
   * @param {number} cost2 - Price of one pencil
   * @return {number} Number of valid (pens, pencils) combinations
   */
  let count = 0;

  // Try every possible number of pens we can buy
  // We can buy from 0 pens up to the maximum affordable pens
  for (let pens = 0; pens <= Math.floor(total / cost1); pens++) {
    // Calculate money spent on pens
    const spentOnPens = pens * cost1;

    // Calculate remaining money after buying pens
    const remaining = total - spentOnPens;

    // With remaining money, we can buy 0 to (remaining // cost2) pencils
    // The +1 accounts for the option of buying 0 pencils
    const maxPencils = Math.floor(remaining / cost2);
    count += maxPencils + 1;
  }

  return count;
}
```

```java
// OPTIMAL SOLUTION
// Time: O(total / cost1) | Space: O(1)
public long waysToBuyPensPencils(int total, int cost1, int cost2) {
    /**
     * Count all combinations of pens and pencils that cost ≤ total.
     *
     * @param total Total amount of money available
     * @param cost1 Price of one pen
     * @param cost2 Price of one pencil
     * @return Number of valid (pens, pencils) combinations
     */
    long count = 0;

    // Try every possible number of pens we can buy
    // We can buy from 0 pens up to the maximum affordable pens
    for (int pens = 0; pens <= total / cost1; pens++) {
        // Calculate money spent on pens
        int spentOnPens = pens * cost1;

        // Calculate remaining money after buying pens
        int remaining = total - spentOnPens;

        // With remaining money, we can buy 0 to (remaining / cost2) pencils
        // The +1 accounts for the option of buying 0 pencils
        int maxPencils = remaining / cost2;
        count += maxPencils + 1;
    }

    return count;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(total // cost1)

- We iterate through all possible numbers of pens from 0 to `total // cost1`
- For each iteration, we perform constant-time operations (multiplication, subtraction, division, addition)
- In the worst case where `cost1 = 1`, this becomes O(total)
- Since `total ≤ 10^6`, this is efficient

**Space Complexity:** O(1)

- We only use a few variables (`count`, `pens`, `spent_on_pens`, `remaining`, `max_pencils`)
- No additional data structures are needed

**Why this is optimal:** Any solution must at least consider each possible number of pens, since each gives different remaining amounts for pencils. Our solution does exactly that with constant work per pen count, so it's asymptotically optimal.

## Common Mistakes

1. **Forgetting the "+1" for zero pencils:** When calculating `max_pencils = remaining // cost2`, candidates often forget to add 1 to include the option of buying 0 pencils. Remember: if you can buy up to 3 pencils, you have 4 options (0, 1, 2, 3).

2. **Using integer division incorrectly:** In languages like Python, `//` is integer division, but in some cases candidates might use `/` which returns a float. In Java and JavaScript, they might forget `Math.floor()` after division. Always ensure you're using integer division.

3. **Off-by-one in the loop range:** The loop should go from 0 to `total // cost1` inclusive. Writing `range(total // cost1)` in Python or `pens < total / cost1` in other languages would exclude the maximum number of pens.

4. **Not using `long` in Java for large counts:** The result can be large (up to ~10^12 when total=10^6 and costs=1). Using `int` would overflow. Always use `long` for the count variable in Java.

5. **Trying to optimize by swapping costs:** Some candidates try to iterate over the cheaper item first to reduce iterations. While this works, it adds complexity. The simpler approach (iterating over pens regardless of cost) is already O(total/min(cost1, cost2)), which is fine given constraints.

## When You'll See This Pattern

This problem uses **iterative counting with remainder calculation**, a pattern common in combinatorial counting problems with constraints:

1. **Coin Change II (LeetCode 518)** - Count ways to make amount with coins. Similar idea of iterating through coin denominations and counting combinations, though with a different constraint (must use exact amount).

2. **Count Integers With Even Digit Sum (LeetCode 2180)** - While not identical, it uses similar iterative checking with mathematical optimization rather than brute force.

3. **Find Three Consecutive Integers That Sum to a Given Number (LeetCode 2177)** - Uses mathematical reasoning to avoid brute force enumeration, similar to how we use division to avoid nested loops.

4. **Two Sum Less Than K (LeetCode 1099)** - Find pairs with sum less than K. The optimization often involves sorting and two pointers, but the core idea of efficiently counting valid pairs is similar.

The pattern is: when you need to count combinations satisfying `a*x + b*y ≤ limit`, fix `x` and mathematically determine valid `y` range instead of iterating through all `y`.

## Key Takeaways

1. **Mathematical optimization beats brute force enumeration:** When counting combinations with linear constraints, use algebra to calculate ranges directly instead of iterating through all possibilities.

2. **Remainder analysis is powerful:** The key insight was recognizing that for fixed `x`, valid `y` values form a simple arithmetic sequence from 0 to `(total - cost1*x) // cost2`.

3. **Check edge cases systematically:** Always test with smallest costs (1, 1), largest total (10^6), and cases where one cost is much larger than the other. These reveal overflow and performance issues.

4. **The "+1" principle:** When counting from 0 to N inclusive, there are N+1 possibilities. This simple fact is easy to overlook in interview pressure.

Related problems: [Find Three Consecutive Integers That Sum to a Given Number](/problem/find-three-consecutive-integers-that-sum-to-a-given-number), [Count Integers With Even Digit Sum](/problem/count-integers-with-even-digit-sum)
