---
title: "How to Solve Distribute Money to Maximum Children — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Distribute Money to Maximum Children. Easy difficulty, 20.5% acceptance rate. Topics: Math, Greedy."
date: "2028-08-21"
category: "dsa-patterns"
tags: ["distribute-money-to-maximum-children", "math", "greedy", "easy"]
---

# How to Solve Distribute Money to Maximum Children

This problem asks us to distribute a given amount of money among a certain number of children with specific constraints: all money must be distributed, no child can receive exactly $4, and every child must receive at least $1. The goal is to maximize the number of children who receive exactly $8. What makes this problem interesting is that it's not just about simple division - we need to carefully navigate around the "no $4" rule while trying to give as many children as possible exactly $8.

## Visual Walkthrough

Let's walk through an example: `money = 20`, `children = 3`

**Step 1:** First, we check if we can give every child at least $1. With 3 children, we need at least $3. We have $20, so this condition is satisfied.

**Step 2:** Now we try to give as many children as possible exactly $8. Let's start giving $8 to each child:

- Child 1 gets $8 → money left = 12
- Child 2 gets $8 → money left = 4
- Child 3... wait, we can't give $8 because we only have $4 left

**Step 3:** We have $4 left for the last child, but there's a rule: no child can receive exactly $4! This is the tricky part. We need to adjust our distribution.

**Step 4:** Let's backtrack. Instead of giving the second child $8, what if we give them $7? Then:

- Child 1 gets $8 → money left = 12
- Child 2 gets $7 → money left = 5
- Child 3 gets $5 → money left = 0

Now we have 1 child with exactly $8. But can we do better? What if we give the second child $9?

- Child 1 gets $8 → money left = 12
- Child 2 gets $9 → money left = 3
- Child 3 gets $3 → money left = 0

Still only 1 child with exactly $8. Actually, with 20 dollars and 3 children, the maximum we can achieve is 1 child with exactly $8. The "no $4" rule prevents us from having 2 children with $8 each (which would leave $4 for the third child).

## Brute Force Approach

A brute force approach would try all possible distributions of money to children. For each child, we could try giving them amounts from 1 to `money` (or up to some reasonable limit), making sure no child gets exactly 4, and then count how many got exactly 8. We'd need to explore all combinations that sum to exactly `money`.

However, this approach is exponential in complexity. With `children` up to 50 and `money` up to 200, the number of combinations would be astronomical. Even with pruning (like stopping when we exceed the money limit), this approach is completely impractical.

The key insight is that we don't need to try all combinations. Since we want to maximize children with exactly $8, we should give $8 to as many children as possible, then handle the remaining money carefully to avoid the $4 restriction.

## Optimal Solution

The optimal solution uses a greedy approach with careful case handling:

1. First, check if we have enough money to give each child at least $1. If not, return -1.
2. Try to give $8 to as many children as possible.
3. Handle the remaining money:
   - If no money remains, we're done
   - If exactly $4 remains, we need to adjust to avoid giving a child exactly $4
   - If we have only 1 child left and $3, we need to check if this creates a $4 situation

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def distMoney(money: int, children: int) -> int:
    # Step 1: Check if we have enough money for basic distribution
    # Each child must get at least $1
    if money < children:
        return -1

    # Step 2: Give $1 to each child first (minimum requirement)
    money -= children
    # Now we have distributed the minimum, remaining money can be used
    # to give additional dollars to reach $8 for some children

    # Step 3: Try to give $7 more to as many children as possible
    # (since they already have $1, $1 + $7 = $8)
    count = 0
    while money >= 7 and count < children:
        money -= 7
        count += 1

    # Step 4: Handle special cases with remaining money
    # Case 1: All children got $8 and no money left - perfect!
    if money == 0 and count == children:
        return count

    # Case 2: All children got $8 but money remains - need to give it to someone
    # This would make someone have more than $8, reducing our count
    if money > 0 and count == children:
        return count - 1

    # Case 3: We have exactly $3 left and only 1 child hasn't gotten $8
    # If we give $3 to that child, they would have $4 (1 + 3 = 4)
    # which violates the "no $4" rule
    if money == 3 and count == children - 1:
        return count - 1

    # Case 4: We have exactly $0 left but not all children got $8
    # This is fine - some children have only $1
    # Case 5: We have money left but not all children got $8
    # This is also fine - we distribute remaining money
    # (but need to check if it creates $4 for last child)
    if money > 0 and count == children - 1:
        # If the last child would get exactly $4, adjust
        last_child_money = 1 + money
        if last_child_money == 4:
            return count - 1

    # Default case: return the count of children with exactly $8
    return count
```

```javascript
// Time: O(1) | Space: O(1)
function distMoney(money, children) {
  // Step 1: Check if we have enough money for basic distribution
  // Each child must get at least $1
  if (money < children) {
    return -1;
  }

  // Step 2: Give $1 to each child first (minimum requirement)
  money -= children;
  // Now we have distributed the minimum, remaining money can be used
  // to give additional dollars to reach $8 for some children

  // Step 3: Try to give $7 more to as many children as possible
  // (since they already have $1, $1 + $7 = $8)
  let count = 0;
  while (money >= 7 && count < children) {
    money -= 7;
    count++;
  }

  // Step 4: Handle special cases with remaining money
  // Case 1: All children got $8 and no money left - perfect!
  if (money === 0 && count === children) {
    return count;
  }

  // Case 2: All children got $8 but money remains - need to give it to someone
  // This would make someone have more than $8, reducing our count
  if (money > 0 && count === children) {
    return count - 1;
  }

  // Case 3: We have exactly $3 left and only 1 child hasn't gotten $8
  // If we give $3 to that child, they would have $4 (1 + 3 = 4)
  // which violates the "no $4" rule
  if (money === 3 && count === children - 1) {
    return count - 1;
  }

  // Case 4: We have exactly $0 left but not all children got $8
  // This is fine - some children have only $1
  // Case 5: We have money left but not all children got $8
  // This is also fine - we distribute remaining money
  // (but need to check if it creates $4 for last child)
  if (money > 0 && count === children - 1) {
    // If the last child would get exactly $4, adjust
    const lastChildMoney = 1 + money;
    if (lastChildMoney === 4) {
      return count - 1;
    }
  }

  // Default case: return the count of children with exactly $8
  return count;
}
```

```java
// Time: O(1) | Space: O(1)
class Solution {
    public int distMoney(int money, int children) {
        // Step 1: Check if we have enough money for basic distribution
        // Each child must get at least $1
        if (money < children) {
            return -1;
        }

        // Step 2: Give $1 to each child first (minimum requirement)
        money -= children;
        // Now we have distributed the minimum, remaining money can be used
        // to give additional dollars to reach $8 for some children

        // Step 3: Try to give $7 more to as many children as possible
        // (since they already have $1, $1 + $7 = $8)
        int count = 0;
        while (money >= 7 && count < children) {
            money -= 7;
            count++;
        }

        // Step 4: Handle special cases with remaining money
        // Case 1: All children got $8 and no money left - perfect!
        if (money == 0 && count == children) {
            return count;
        }

        // Case 2: All children got $8 but money remains - need to give it to someone
        // This would make someone have more than $8, reducing our count
        if (money > 0 && count == children) {
            return count - 1;
        }

        // Case 3: We have exactly $3 left and only 1 child hasn't gotten $8
        // If we give $3 to that child, they would have $4 (1 + 3 = 4)
        // which violates the "no $4" rule
        if (money == 3 && count == children - 1) {
            return count - 1;
        }

        // Case 4: We have exactly $0 left but not all children got $8
        // This is fine - some children have only $1
        // Case 5: We have money left but not all children got $8
        // This is also fine - we distribute remaining money
        // (but need to check if it creates $4 for last child)
        if (money > 0 && count == children - 1) {
            // If the last child would get exactly $4, adjust
            int lastChildMoney = 1 + money;
            if (lastChildMoney == 4) {
                return count - 1;
            }
        }

        // Default case: return the count of children with exactly $8
        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(1) - The while loop runs at most `min(children, money/7)` times, but since both `children` and `money` are bounded (≤ 200), this is effectively constant time. In practice, we could calculate `count = min(children, (money - children) / 7)` without a loop for true O(1).

**Space Complexity:** O(1) - We only use a few integer variables regardless of input size.

The key operations are:

1. Initial check: O(1)
2. Subtracting base amount: O(1)
3. Counting how many can get $8: O(min(children, money/7)) but bounded
4. Handling special cases: O(1)

## Common Mistakes

1. **Forgetting the "at least $1" rule first**: Some candidates jump straight to giving $8 without ensuring every child gets at least $1. Always start by giving $1 to each child, then work with the remaining money.

2. **Missing the $4 edge case**: The most common mistake is not handling the situation where remaining money would cause a child to get exactly $4. Remember: if you have exactly $3 left and only one child hasn't gotten $8, giving that $3 would make their total $4 (1 base + 3 extra).

3. **Incorrect handling when all children get $8 but money remains**: If all children have $8 and there's money left, you must give it to someone, which means that child no longer has exactly $8. You need to reduce your count by 1.

4. **Off-by-one errors in the loop**: When counting how many children can get $8, remember they already have $1, so you need to give them $7 more, not $8. The condition should be `money >= 7`, not `money >= 8`.

## When You'll See This Pattern

This problem uses a **greedy approach with constraint handling**, which appears in many distribution problems:

1. **Distribute Candies to People (Easy)**: Similar circular distribution with increasing amounts. You give candies to people in round-robin fashion with increasing amounts.

2. **Fair Distribution of Cookies (Medium)**: Distributing cookies to children to minimize unfairness, using backtracking to explore distributions.

3. **Calculate Money in Leetcode Bank (Easy)**: Weekly increasing savings pattern that requires careful calculation of cumulative sums.

The core pattern is: start with a greedy approach (give as much as possible to maximize your objective), then handle edge cases and constraints that break the simple greedy solution.

## Key Takeaways

1. **Greedy with constraint checking**: Many "distribution" problems can be solved by taking the greedy approach first, then checking and adjusting for constraints. Always verify your greedy solution doesn't violate any rules.

2. **Handle edge cases systematically**: When a problem has specific rules (like "no $4"), enumerate what situations would violate those rules and check for them explicitly. Create test cases for each edge case.

3. **Start with minimum requirements**: When distributing resources with minimum constraints, satisfy those first (like giving $1 to each child), then work with what's left. This simplifies the problem.

Related problems: [Distribute Candies to People](/problem/distribute-candies-to-people), [Fair Distribution of Cookies](/problem/fair-distribution-of-cookies), [Calculate Money in Leetcode Bank](/problem/calculate-money-in-leetcode-bank)
