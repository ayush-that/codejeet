---
title: "How to Solve Minimum Penalty for a Shop — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Penalty for a Shop. Medium difficulty, 71.2% acceptance rate. Topics: String, Prefix Sum."
date: "2028-06-25"
category: "dsa-patterns"
tags: ["minimum-penalty-for-a-shop", "string", "prefix-sum", "medium"]
---

# How to Solve Minimum Penalty for a Shop

You're given a string representing customer visits per hour, where 'Y' means customers came and 'N' means no customers. You need to choose a closing hour that minimizes the penalty, where penalty is calculated as the number of customers who come after closing (you turned them away) plus the number of hours before closing when no customers came (you wasted time). The tricky part is that the penalty calculation changes depending on your chosen closing time, requiring you to efficiently evaluate all possibilities.

## Visual Walkthrough

Let's trace through an example: `customers = "YYNY"`

We need to calculate penalty for each possible closing hour (0 to n, where n = length of string = 4):

**Hour 0 (close immediately):**

- Customers after closing: All 3 'Y's at positions 0, 1, 3 → 3
- Hours before closing with no customers: None → 0
- Total penalty = 3

**Hour 1 (close after first hour):**

- Customers after closing: 'Y' at position 1, 'Y' at position 3 → 2
- Hours before closing with no customers: None → 0
- Total penalty = 2

**Hour 2 (close after second hour):**

- Customers after closing: 'Y' at position 3 → 1
- Hours before closing with no customers: 'N' at position 2 → 1
- Total penalty = 1 + 1 = 2

**Hour 3 (close after third hour):**

- Customers after closing: 'Y' at position 3 → 1
- Hours before closing with no customers: 'N' at position 2 → 1
- Total penalty = 1 + 1 = 2

**Hour 4 (close after all hours):**

- Customers after closing: None → 0
- Hours before closing with no customers: 'N' at position 2 → 1
- Total penalty = 1

The minimum penalty is 1 at hour 4. Notice we need to check n+1 possibilities (0 through n).

## Brute Force Approach

The brute force approach would calculate penalty from scratch for each closing hour:

For each closing hour i from 0 to n:

1. Count 'Y's after position i-1 (customers turned away)
2. Count 'N's before position i (hours wasted)
3. Sum these two counts

This requires O(n) work for each of n+1 positions, giving O(n²) time complexity. For n up to 10⁵ (as in LeetCode constraints), this is far too slow.

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def bestClosingTimeBrute(customers: str) -> int:
    n = len(customers)
    min_penalty = float('inf')
    best_hour = 0

    # Try every possible closing hour
    for i in range(n + 1):
        penalty = 0

        # Count 'N's before closing (hours wasted)
        for j in range(i):
            if customers[j] == 'N':
                penalty += 1

        # Count 'Y's after closing (customers turned away)
        for j in range(i, n):
            if customers[j] == 'Y':
                penalty += 1

        # Update minimum penalty
        if penalty < min_penalty:
            min_penalty = penalty
            best_hour = i

    return best_hour
```

```javascript
// Time: O(n²) | Space: O(1)
function bestClosingTimeBrute(customers) {
  const n = customers.length;
  let minPenalty = Infinity;
  let bestHour = 0;

  // Try every possible closing hour
  for (let i = 0; i <= n; i++) {
    let penalty = 0;

    // Count 'N's before closing (hours wasted)
    for (let j = 0; j < i; j++) {
      if (customers[j] === "N") {
        penalty++;
      }
    }

    // Count 'Y's after closing (customers turned away)
    for (let j = i; j < n; j++) {
      if (customers[j] === "Y") {
        penalty++;
      }
    }

    // Update minimum penalty
    if (penalty < minPenalty) {
      minPenalty = penalty;
      bestHour = i;
    }
  }

  return bestHour;
}
```

```java
// Time: O(n²) | Space: O(1)
public int bestClosingTimeBrute(String customers) {
    int n = customers.length();
    int minPenalty = Integer.MAX_VALUE;
    int bestHour = 0;

    // Try every possible closing hour
    for (int i = 0; i <= n; i++) {
        int penalty = 0;

        // Count 'N's before closing (hours wasted)
        for (int j = 0; j < i; j++) {
            if (customers.charAt(j) == 'N') {
                penalty++;
            }
        }

        // Count 'Y's after closing (customers turned away)
        for (int j = i; j < n; j++) {
            if (customers.charAt(j) == 'Y') {
                penalty++;
            }
        }

        // Update minimum penalty
        if (penalty < minPenalty) {
            minPenalty = penalty;
            bestHour = i;
        }
    }

    return bestHour;
}
```

</div>

## Optimized Approach

The key insight is that we can use **prefix sums** to avoid recalculating everything from scratch. Notice that:

1. When we move the closing hour from i to i+1:
   - We gain potential penalty if hour i has 'N' (we wasted that hour)
   - We lose potential penalty if hour i has 'Y' (we no longer turn away that customer)

2. We can think of it as:
   - Start with penalty = total number of 'Y's (closing at hour 0)
   - As we move through each hour:
     - If it's 'Y', penalty decreases by 1 (we're now serving that customer)
     - If it's 'N', penalty increases by 1 (we wasted that hour)

3. We just need to track the current penalty as we iterate and remember where it was minimum.

This transforms an O(n²) problem into O(n) with O(1) space!

## Optimal Solution

Here's the optimal solution using the single-pass approach:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def bestClosingTime(customers: str) -> int:
    """
    Calculate the optimal closing hour to minimize penalty.

    Strategy:
    1. Start with penalty = total 'Y's (closing at hour 0)
    2. Iterate through each hour, updating penalty:
       - 'Y' decreases penalty (we serve the customer)
       - 'N' increases penalty (we waste the hour)
    3. Track the minimum penalty and corresponding hour

    Args:
        customers: String of 'Y' and 'N' characters

    Returns:
        The optimal closing hour (0-indexed)
    """
    n = len(customers)

    # Start with penalty if we close at hour 0
    # This equals all 'Y's (all customers turned away)
    current_penalty = customers.count('Y')
    min_penalty = current_penalty
    best_hour = 0

    # Iterate through each hour, checking penalty if we close AFTER this hour
    for i in range(n):
        # Update penalty for closing at hour i+1
        if customers[i] == 'Y':
            # If this hour has customers, penalty decreases
            # because we're now serving them instead of turning them away
            current_penalty -= 1
        else:  # customers[i] == 'N'
            # If this hour has no customers, penalty increases
            # because we wasted this hour staying open
            current_penalty += 1

        # Check if this gives us a better penalty
        # We use < not <= to get the earliest hour with minimum penalty
        if current_penalty < min_penalty:
            min_penalty = current_penalty
            best_hour = i + 1  # Close AFTER this hour

    return best_hour
```

```javascript
// Time: O(n) | Space: O(1)
/**
 * Calculate the optimal closing hour to minimize penalty.
 *
 * Strategy:
 * 1. Start with penalty = total 'Y's (closing at hour 0)
 * 2. Iterate through each hour, updating penalty:
 *    - 'Y' decreases penalty (we serve the customer)
 *    - 'N' increases penalty (we waste the hour)
 * 3. Track the minimum penalty and corresponding hour
 *
 * @param {string} customers - String of 'Y' and 'N' characters
 * @return {number} The optimal closing hour (0-indexed)
 */
function bestClosingTime(customers) {
  const n = customers.length;

  // Count total 'Y's for initial penalty (closing at hour 0)
  let currentPenalty = 0;
  for (let i = 0; i < n; i++) {
    if (customers[i] === "Y") {
      currentPenalty++;
    }
  }

  let minPenalty = currentPenalty;
  let bestHour = 0;

  // Iterate through each hour, checking penalty if we close AFTER this hour
  for (let i = 0; i < n; i++) {
    // Update penalty for closing at hour i+1
    if (customers[i] === "Y") {
      // If this hour has customers, penalty decreases
      // because we're now serving them instead of turning them away
      currentPenalty--;
    } else {
      // customers[i] === 'N'
      // If this hour has no customers, penalty increases
      // because we wasted this hour staying open
      currentPenalty++;
    }

    // Check if this gives us a better penalty
    // We use < not <= to get the earliest hour with minimum penalty
    if (currentPenalty < minPenalty) {
      minPenalty = currentPenalty;
      bestHour = i + 1; // Close AFTER this hour
    }
  }

  return bestHour;
}
```

```java
// Time: O(n) | Space: O(1)
/**
 * Calculate the optimal closing hour to minimize penalty.
 *
 * Strategy:
 * 1. Start with penalty = total 'Y's (closing at hour 0)
 * 2. Iterate through each hour, updating penalty:
 *    - 'Y' decreases penalty (we serve the customer)
 *    - 'N' increases penalty (we waste the hour)
 * 3. Track the minimum penalty and corresponding hour
 *
 * @param customers String of 'Y' and 'N' characters
 * @return The optimal closing hour (0-indexed)
 */
public int bestClosingTime(String customers) {
    int n = customers.length();

    // Count total 'Y's for initial penalty (closing at hour 0)
    int currentPenalty = 0;
    for (int i = 0; i < n; i++) {
        if (customers.charAt(i) == 'Y') {
            currentPenalty++;
        }
    }

    int minPenalty = currentPenalty;
    int bestHour = 0;

    // Iterate through each hour, checking penalty if we close AFTER this hour
    for (int i = 0; i < n; i++) {
        // Update penalty for closing at hour i+1
        if (customers.charAt(i) == 'Y') {
            // If this hour has customers, penalty decreases
            // because we're now serving them instead of turning them away
            currentPenalty--;
        } else {  // customers.charAt(i) == 'N'
            // If this hour has no customers, penalty increases
            // because we wasted this hour staying open
            currentPenalty++;
        }

        // Check if this gives us a better penalty
        // We use < not <= to get the earliest hour with minimum penalty
        if (currentPenalty < minPenalty) {
            minPenalty = currentPenalty;
            bestHour = i + 1;  // Close AFTER this hour
        }
    }

    return bestHour;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make two passes through the string: one to count initial 'Y's, and one to find the minimum penalty.
- Each pass does O(1) work per character.
- This is optimal since we must examine each character at least once.

**Space Complexity: O(1)**

- We only use a few integer variables to track current penalty, minimum penalty, and best hour.
- No additional data structures are needed.

## Common Mistakes

1. **Off-by-one errors with closing hour indices**: Remember we can close at hour 0 (immediately) through hour n (after all hours). Candidates often forget hour n or incorrectly map indices. The key is to realize closing at hour i means we're open during hours 0 through i-1.

2. **Using <= instead of < when comparing penalties**: The problem asks for the earliest hour with minimum penalty. If you use `<=` instead of `<`, you'll get the latest hour with minimum penalty, which is incorrect.

3. **Not handling empty string or all-'N' cases**: With all 'N's, the optimal is to close immediately (hour 0). With all 'Y's, the optimal is to stay open all hours (hour n). Test these edge cases.

4. **Recalculating penalty from scratch**: The most common performance mistake is the O(n²) approach. Always look for ways to update incrementally rather than recalculate.

## When You'll See This Pattern

This problem uses a **running sum/difference** pattern that appears in many optimization problems:

1. **Grid Game (LeetCode 2017)**: Similar concept of minimizing maximum penalty by choosing a split point, using prefix sums to efficiently evaluate options.

2. **Minimum Amount of Damage Dealt to Bob (LeetCode 3081)**: Another problem where you choose a split point and need to efficiently calculate costs on both sides.

3. **Best Time to Buy and Sell Stock (LeetCode 121)**: While different in domain, it uses the same "track minimum as you iterate" pattern.

4. **Maximum Subarray (LeetCode 53)**: Kadane's algorithm uses similar incremental updating to find optimal subarrays.

The core pattern is: when you need to evaluate all possible split points in an array/string, and the cost/benefit can be updated incrementally as you move the split point, you can often achieve O(n) instead of O(n²).

## Key Takeaways

1. **Look for incremental updates**: When evaluating all possible positions for something (like a closing time), see if moving one position changes the result by a predictable amount. This often turns O(n²) into O(n).

2. **Penalty/cost functions often decompose**: Problems where cost = left_side_cost + right_side_cost are prime candidates for prefix/suffix sum optimizations.

3. **Track minimum/maximum as you go**: Many optimization problems can be solved by maintaining the best solution seen so far while iterating through possibilities.

Related problems: [Grid Game](/problem/grid-game), [Minimum Amount of Damage Dealt to Bob](/problem/minimum-amount-of-damage-dealt-to-bob)
