---
title: "How to Solve Richest Customer Wealth — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Richest Customer Wealth. Easy difficulty, 88.7% acceptance rate. Topics: Array, Matrix."
date: "2026-09-03"
category: "dsa-patterns"
tags: ["richest-customer-wealth", "array", "matrix", "easy"]
---

# How to Solve Richest Customer Wealth

This problem asks you to find the richest customer given a 2D array where each row represents a customer and each column represents their money in different banks. The "trick" here isn't algorithmic complexity—it's about cleanly handling 2D array traversal and understanding that we need to sum each row and track the maximum sum. What makes this interesting is that it's a foundational matrix problem that teaches you how to think about nested loops and accumulation patterns.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:** `accounts = [[1,2,3],[3,2,1]]`

**Step 1:** Look at the first customer (row 0: `[1,2,3]`)

- Sum their wealth: 1 + 2 + 3 = 6
- Current maximum wealth: 6

**Step 2:** Look at the second customer (row 1: `[3,2,1]`)

- Sum their wealth: 3 + 2 + 1 = 6
- Compare with current maximum: 6 = 6, so maximum stays 6

**Result:** The richest customer has wealth 6.

Let's try another example: `accounts = [[1,5],[7,3],[3,5]]`

**Step 1:** Customer 0: 1 + 5 = 6 → max = 6
**Step 2:** Customer 1: 7 + 3 = 10 → max = 10 (update!)
**Step 3:** Customer 2: 3 + 5 = 8 → max stays 10

**Result:** Maximum wealth is 10.

The pattern is clear: for each row (customer), sum all elements (bank accounts), then track the maximum sum across all rows.

## Brute Force Approach

For this problem, there's really only one reasonable approach: iterate through each customer, sum their accounts, and track the maximum. Any "brute force" would essentially be the same as the optimal solution since we must examine every element at least once to compute the sums.

However, a naive candidate might try to:

1. Create an array to store all sums first, then find the maximum
2. Use overly complex data structures
3. Try to optimize prematurely with early exits that don't actually help

The straightforward approach is already optimal because we need to look at every bank balance to compute each customer's total wealth. There's no way to avoid O(m×n) time complexity where m is number of customers and n is number of banks.

## Optimal Solution

The optimal solution uses a simple nested loop structure:

1. Initialize a variable to track the maximum wealth (start at 0 or negative infinity)
2. For each customer (row in the matrix):
   - Initialize a sum for that customer
   - For each bank account (column in that row):
     - Add the amount to the customer's sum
   - Update the maximum if this customer's sum is greater
3. Return the maximum wealth

<div class="code-group">

```python
# Time: O(m * n) where m = len(accounts), n = len(accounts[0])
# Space: O(1) - we only use a constant amount of extra space
def maximumWealth(accounts):
    """
    Calculate the maximum wealth among all customers.

    Args:
        accounts: 2D list where accounts[i][j] is customer i's money in bank j

    Returns:
        The maximum wealth (sum of all banks) for any customer
    """
    max_wealth = 0  # Initialize maximum wealth tracker

    # Iterate through each customer (each row in the accounts matrix)
    for customer_accounts in accounts:
        customer_wealth = 0  # Reset wealth counter for this customer

        # Sum all bank accounts for the current customer
        for bank_balance in customer_accounts:
            customer_wealth += bank_balance

        # Update maximum wealth if this customer has more than current max
        if customer_wealth > max_wealth:
            max_wealth = customer_wealth

    return max_wealth
```

```javascript
// Time: O(m * n) where m = accounts.length, n = accounts[0].length
// Space: O(1) - constant extra space
function maximumWealth(accounts) {
  /**
   * Calculate the maximum wealth among all customers.
   *
   * @param {number[][]} accounts - 2D array where accounts[i][j] is customer i's money in bank j
   * @return {number} The maximum wealth (sum of all banks) for any customer
   */
  let maxWealth = 0; // Initialize maximum wealth tracker

  // Iterate through each customer (each row in the accounts matrix)
  for (let i = 0; i < accounts.length; i++) {
    let customerWealth = 0; // Reset wealth counter for this customer

    // Sum all bank accounts for the current customer
    for (let j = 0; j < accounts[i].length; j++) {
      customerWealth += accounts[i][j];
    }

    // Update maximum wealth if this customer has more than current max
    if (customerWealth > maxWealth) {
      maxWealth = customerWealth;
    }
  }

  return maxWealth;
}
```

```java
// Time: O(m * n) where m = accounts.length, n = accounts[0].length
// Space: O(1) - constant extra space
class Solution {
    public int maximumWealth(int[][] accounts) {
        /**
         * Calculate the maximum wealth among all customers.
         *
         * @param accounts 2D array where accounts[i][j] is customer i's money in bank j
         * @return The maximum wealth (sum of all banks) for any customer
         */
        int maxWealth = 0;  // Initialize maximum wealth tracker

        // Iterate through each customer (each row in the accounts matrix)
        for (int i = 0; i < accounts.length; i++) {
            int customerWealth = 0;  // Reset wealth counter for this customer

            // Sum all bank accounts for the current customer
            for (int j = 0; j < accounts[i].length; j++) {
                customerWealth += accounts[i][j];
            }

            // Update maximum wealth if this customer has more than current max
            if (customerWealth > maxWealth) {
                maxWealth = customerWealth;
            }
        }

        return maxWealth;
    }
}
```

</div>

**Alternative using built-in functions (Python):**

```python
def maximumWealth(accounts):
    # Use list comprehension to calculate sum for each row, then find max
    return max(sum(customer) for customer in accounts)
```

This one-liner is elegant but may be less clear to interviewers who want to see your loop-handling skills.

## Complexity Analysis

**Time Complexity:** O(m × n)

- We iterate through each customer (m customers)
- For each customer, we iterate through all their bank accounts (n banks)
- In the worst case, we visit every cell in the m × n matrix exactly once
- This gives us O(m × n) operations

**Space Complexity:** O(1)

- We only use a few variables: `max_wealth`, `customer_wealth`, and loop indices
- These use constant space regardless of input size
- We don't create any additional data structures proportional to input size

## Common Mistakes

1. **Initializing max_wealth incorrectly:** Some candidates initialize `max_wealth = 0`, which works for this problem since all amounts are positive. However, if the problem allowed negative amounts, you'd need to initialize with `float('-inf')` or `Integer.MIN_VALUE`. Always check constraints!

2. **Not resetting customer_wealth for each customer:** Forgetting to reset the sum before processing each customer will cause all bank balances to accumulate across customers, giving completely wrong results.

3. **Off-by-one errors in loop bounds:** Using `<=` instead of `<` when accessing array indices will cause index out of bounds errors. Remember: arrays are 0-indexed, so valid indices go from 0 to length-1.

4. **Assuming all rows have the same length:** While the problem states it's an m × n grid, in real interviews you might get jagged arrays. Always use `accounts[i].length` (or equivalent) for the inner loop bound, not a precomputed value.

5. **Overcomplicating with extra data structures:** Some candidates create an array to store all sums first, then find the maximum. This uses O(m) extra space unnecessarily when we can track the maximum as we go.

## When You'll See This Pattern

This problem teaches **2D array traversal with accumulation**, a fundamental pattern that appears in many problems:

1. **Matrix Diagonal Sum (LeetCode 1572)** - Similar traversal but only along diagonals
2. **Toeplitz Matrix (LeetCode 766)** - Checking relationships between elements in a 2D array
3. **Transpose Matrix (LeetCode 867)** - Another basic matrix operation requiring nested loops
4. **Image Smoother (LeetCode 661)** - More complex 2D traversal that looks at neighbors

The core pattern is: nested loops to traverse rows and columns, with some operation on each element or group of elements. Once you master this, you can solve many matrix problems by adapting what you do inside the loops.

## Key Takeaways

1. **Nested loops are the standard tool for 2D array traversal:** Outer loop for rows, inner loop for columns. This pattern appears in countless matrix problems.

2. **Track results as you go when possible:** Instead of storing all intermediate results and processing them later, update your answer incrementally to save space. This is the difference between O(1) and O(m) space complexity.

3. **Pay attention to initialization and reset points:** Where you initialize variables matters. `max_wealth` is initialized once before all customers, while `customer_wealth` is reset for each customer.

4. **Read constraints carefully:** This problem has positive integers, so initializing with 0 works. If negative values were possible, you'd need a different initialization strategy.

Remember: even "easy" problems test your attention to detail and clean coding habits. Practice writing clear, well-commented solutions that you can easily explain.

[Practice this problem on CodeJeet](/problem/richest-customer-wealth)
