---
title: "How to Solve Lemonade Change — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Lemonade Change. Easy difficulty, 58.9% acceptance rate. Topics: Array, Greedy."
date: "2027-03-29"
category: "dsa-patterns"
tags: ["lemonade-change", "array", "greedy", "easy"]
---

# How to Solve Lemonade Change

You run a lemonade stand where each cup costs $5. Customers pay with $5, $10, or $20 bills, and you must give correct change. The challenge is determining whether you can provide change to all customers given your limited bills, which requires careful tracking of your available $5 and $10 bills.

What makes this problem interesting is that it appears simple but requires precise greedy logic. You must always give change using the largest bills first when possible to preserve smaller bills for future customers who might need exact change.

## Visual Walkthrough

Let's trace through an example: `bills = [5, 5, 10, 20]`

**Step 1:** First customer pays with $5

- You receive: $5 bill
- Change needed: $0
- Your cash: 5s: 1, 10s: 0

**Step 2:** Second customer pays with $5

- You receive: $5 bill
- Change needed: $0
- Your cash: 5s: 2, 10s: 0

**Step 3:** Third customer pays with $10

- You receive: $10 bill
- Change needed: $5 (10 - 5 = 5)
- You have a $5 bill? Yes, use it
- Your cash: 5s: 1, 10s: 1

**Step 4:** Fourth customer pays with $20

- You receive: $20 bill
- Change needed: $15 (20 - 5 = 15)
- Options: Give one $10 + one $5, or three $5 bills
- Best choice: Use $10 + $5 to preserve $5 bills
- You have both? Yes, use them
- Your cash: 5s: 0, 10s: 0

All customers received correct change, so return `true`.

## Brute Force Approach

A naive approach might try all possible combinations of giving change for each customer. For example, when a customer pays with $20 and needs $15 change, you could try:

1. Three $5 bills
2. One $10 + one $5 bill
3. One $5 + one $10 bill (same as 2)

You could use backtracking to explore all possibilities, but this is unnecessary overkill. The problem has a clear greedy property: when giving $15 change for a $20 bill, you should always use a $10 bill if available (to preserve $5 bills for future $10 bills that need $5 change).

The brute force would have exponential time complexity in the worst case, while a simple greedy approach runs in O(n) time with O(1) space.

## Optimal Solution

The optimal solution uses a greedy approach with simple bill counting. We track how many $5 and $10 bills we have (we don't need to track $20 bills since we never give them as change). For each customer:

1. **$5 bill:** Just take it, no change needed
2. **$10 bill:** Need to give $5 change, so check if we have a $5 bill
3. **$20 bill:** Need to give $15 change. Prefer giving $10 + $5 if possible (to preserve $5 bills). Otherwise give three $5 bills.

If at any point we can't provide correct change, return `false`.

<div class="code-group">

```python
# Time: O(n) where n is number of customers
# Space: O(1) - we only track two integer counters
def lemonadeChange(bills):
    """
    Determines if we can provide correct change to all customers.

    Args:
        bills: List of integers representing bill denominations (5, 10, or 20)

    Returns:
        True if all customers receive correct change, False otherwise
    """
    # Track count of $5 and $10 bills we have
    # We don't need to track $20 bills since we never give them as change
    fives = 0
    tens = 0

    # Process each customer in order
    for bill in bills:
        # Case 1: Customer pays with $5 - no change needed
        if bill == 5:
            fives += 1

        # Case 2: Customer pays with $10 - need to give $5 change
        elif bill == 10:
            # Check if we have a $5 bill to give as change
            if fives == 0:
                return False  # Cannot provide change
            # Give one $5 bill as change
            fives -= 1
            # Add the $10 bill to our cash
            tens += 1

        # Case 3: Customer pays with $20 - need to give $15 change
        else:  # bill == 20
            # Prefer to give $10 + $5 if possible (greedy choice)
            # This preserves $5 bills for future $10 bills
            if tens > 0 and fives > 0:
                # Give one $10 and one $5
                tens -= 1
                fives -= 1
            # If we can't give $10+$5, try three $5 bills
            elif fives >= 3:
                # Give three $5 bills
                fives -= 3
            else:
                # Cannot provide $15 change with available bills
                return False

    # All customers received correct change
    return True
```

```javascript
// Time: O(n) where n is number of customers
// Space: O(1) - we only track two integer counters
function lemonadeChange(bills) {
  /**
   * Determines if we can provide correct change to all customers.
   *
   * @param {number[]} bills - Array of bill denominations (5, 10, or 20)
   * @return {boolean} True if all customers receive correct change
   */
  // Track count of $5 and $10 bills we have
  // We don't need to track $20 bills since we never give them as change
  let fives = 0;
  let tens = 0;

  // Process each customer in order
  for (let i = 0; i < bills.length; i++) {
    const bill = bills[i];

    // Case 1: Customer pays with $5 - no change needed
    if (bill === 5) {
      fives++;
    }
    // Case 2: Customer pays with $10 - need to give $5 change
    else if (bill === 10) {
      // Check if we have a $5 bill to give as change
      if (fives === 0) {
        return false; // Cannot provide change
      }
      // Give one $5 bill as change
      fives--;
      // Add the $10 bill to our cash
      tens++;
    }
    // Case 3: Customer pays with $20 - need to give $15 change
    else {
      // bill === 20
      // Prefer to give $10 + $5 if possible (greedy choice)
      // This preserves $5 bills for future $10 bills
      if (tens > 0 && fives > 0) {
        // Give one $10 and one $5
        tens--;
        fives--;
      }
      // If we can't give $10+$5, try three $5 bills
      else if (fives >= 3) {
        // Give three $5 bills
        fives -= 3;
      } else {
        // Cannot provide $15 change with available bills
        return false;
      }
    }
  }

  // All customers received correct change
  return true;
}
```

```java
// Time: O(n) where n is number of customers
// Space: O(1) - we only track two integer counters
class Solution {
    public boolean lemonadeChange(int[] bills) {
        /**
         * Determines if we can provide correct change to all customers.
         *
         * @param bills Array of bill denominations (5, 10, or 20)
         * @return True if all customers receive correct change
         */
        // Track count of $5 and $10 bills we have
        // We don't need to track $20 bills since we never give them as change
        int fives = 0;
        int tens = 0;

        // Process each customer in order
        for (int bill : bills) {
            // Case 1: Customer pays with $5 - no change needed
            if (bill == 5) {
                fives++;
            }
            // Case 2: Customer pays with $10 - need to give $5 change
            else if (bill == 10) {
                // Check if we have a $5 bill to give as change
                if (fives == 0) {
                    return false;  // Cannot provide change
                }
                // Give one $5 bill as change
                fives--;
                // Add the $10 bill to our cash
                tens++;
            }
            // Case 3: Customer pays with $20 - need to give $15 change
            else {  // bill == 20
                // Prefer to give $10 + $5 if possible (greedy choice)
                // This preserves $5 bills for future $10 bills
                if (tens > 0 && fives > 0) {
                    // Give one $10 and one $5
                    tens--;
                    fives--;
                }
                // If we can't give $10+$5, try three $5 bills
                else if (fives >= 3) {
                    // Give three $5 bills
                    fives -= 3;
                }
                else {
                    // Cannot provide $15 change with available bills
                    return false;
                }
            }
        }

        // All customers received correct change
        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the number of customers (bills in the array). We process each customer exactly once, performing constant-time operations for each.

**Space Complexity:** O(1). We only use two integer variables to track the count of $5 and $10 bills, regardless of the input size. No additional data structures scale with input size.

The efficiency comes from the greedy property: at each step, we make the locally optimal choice (using larger bills first when possible), which leads to the globally optimal solution.

## Common Mistakes

1. **Not prioritizing $10 bills for $20 change:** Some candidates give three $5 bills for a $20 payment even when they have a $10 bill available. This wastes $5 bills that might be needed later for $10 payments. Always give $10 + $5 when possible.

2. **Forgetting to check both conditions for $20 change:** When checking if you can give $10 + $5 change, you must verify you have **both** a $10 bill **and** a $5 bill. Checking only one or the other will cause incorrect logic.

3. **Using the wrong data structure:** Some candidates try to use a queue or stack to track bills, but simple counters are sufficient and more efficient. The order of bills doesn't matter—only the counts.

4. **Not handling edge cases:** Empty input should return `true` (no customers means all received correct change). Also, the first customer paying with $10 or $20 should immediately return `false` since you start with no cash.

## When You'll See This Pattern

This greedy change-making pattern appears in several problems:

1. **Coin Change (LeetCode 322):** While the full coin change problem uses dynamic programming, the greedy approach works when coin denominations have certain properties (like the US coin system).

2. **Assign Cookies (LeetCode 455):** Another greedy problem where you match the smallest cookie to the smallest greed factor, similar to matching available bills to change needs.

3. **Task Scheduler (LeetCode 621):** Uses greedy scheduling of tasks with cooldown periods, similar to how we prioritize which bills to use for change.

The key insight is recognizing when a locally optimal choice (using the largest bill possible for change) leads to a globally optimal solution.

## Key Takeaways

1. **Greedy algorithms work when local optimality guarantees global optimality.** In this case, using larger bills first preserves smaller bills for situations where only smaller bills work.

2. **Sometimes simple counters beat complex data structures.** You don't always need queues, stacks, or maps—two integers can solve the problem efficiently.

3. **Always test your greedy logic with edge cases.** What if all customers pay with $20? What if they alternate $5 and $10? Walk through examples to verify your approach.

[Practice this problem on CodeJeet](/problem/lemonade-change)
