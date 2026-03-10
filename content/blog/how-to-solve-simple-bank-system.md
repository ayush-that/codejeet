---
title: "How to Solve Simple Bank System — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Simple Bank System. Medium difficulty, 69.8% acceptance rate. Topics: Array, Hash Table, Design, Simulation."
date: "2026-05-02"
category: "dsa-patterns"
tags: ["simple-bank-system", "array", "hash-table", "design", "medium"]
---

# How to Solve Simple Bank System

This problem asks you to implement a basic banking system that supports deposit, withdrawal, and transfer operations between accounts. What makes this interesting is that while the operations seem straightforward, you need to carefully handle edge cases like invalid account numbers and insufficient funds. The challenge lies in writing clean, efficient code that correctly validates all constraints before performing any transaction.

## Visual Walkthrough

Let's trace through an example with 3 accounts and initial balances [10, 100, 20]:

1. **Initial state**: Account 1: $10, Account 2: $100, Account 3: $20
2. **deposit(3, 50)**: Add $50 to account 3 → Account 3 now has $70
3. **withdraw(2, 30)**: Check if account 2 has ≥ $30 → Yes, subtract $30 → Account 2 now has $70
4. **transfer(1, 2, 5)**: Check if account 1 exists, account 2 exists, and account 1 has ≥ $5 → Yes, subtract $5 from account 1, add $5 to account 2 → Account 1: $5, Account 2: $75
5. **transfer(1, 4, 5)**: Account 4 doesn't exist → Return false immediately, no changes
6. **withdraw(1, 10)**: Account 1 only has $5 → Return false, balance unchanged

The key insight is that every operation must validate account existence first, and withdrawal/transfer must also check for sufficient funds before making any changes.

## Brute Force Approach

A naive approach might involve repeatedly searching for accounts or using inefficient data structures. However, since we're given the accounts as a simple array and account numbers are 1-indexed while the array is 0-indexed, the most straightforward approach is already optimal for this problem.

The "brute force" thinking here would be to not validate account numbers properly or to make partial updates before checking all conditions. For example:

1. For transfer: Withdraw from source first, then check if destination exists
2. Not checking both accounts exist before starting the transfer
3. Using linear search to find accounts (unnecessary since we have direct array access)

These mistakes would lead to incorrect behavior where accounts could end up with negative balances or money could disappear into non-existent accounts.

## Optimized Approach

The optimal solution uses the array directly with careful index adjustments and validation:

1. **Account access**: Since accounts are numbered 1 to n and `balance` is 0-indexed, account `i` corresponds to `balance[i-1]`
2. **Validation first**: Always check account validity before any balance checks or modifications
3. **Atomic operations**: For transfer, check BOTH accounts exist AND source has sufficient funds BEFORE making any changes
4. **Early returns**: Return false immediately when any validation fails

The key insight is that we need to treat each operation as atomic - either all changes happen or none do. We must validate all preconditions before modifying any balances.

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
class Bank:
    # Time: O(1) for all operations | Space: O(n) for storing balances
    def __init__(self, balance: List[int]):
        # Store the balances array
        # Accounts are 1-indexed, so account i corresponds to balance[i-1]
        self.balance = balance
        # Store number of accounts for quick validation
        self.n = len(balance)

    def deposit(self, account: int, money: int) -> bool:
        # Check if account number is valid (1 to n)
        if account < 1 or account > self.n:
            return False

        # Account numbers are 1-indexed, array is 0-indexed
        self.balance[account - 1] += money
        return True

    def withdraw(self, account: int, money: int) -> bool:
        # Check if account number is valid
        if account < 1 or account > self.n:
            return False

        # Check if account has sufficient funds
        if self.balance[account - 1] < money:
            return False

        # Withdraw the money
        self.balance[account - 1] -= money
        return True

    def transfer(self, account1: int, account2: int, money: int) -> bool:
        # Check if both accounts are valid
        if (account1 < 1 or account1 > self.n or
            account2 < 1 or account2 > self.n):
            return False

        # Check if source account has sufficient funds
        if self.balance[account1 - 1] < money:
            return False

        # Perform the transfer atomically
        # Withdraw from account1
        self.balance[account1 - 1] -= money
        # Deposit to account2
        self.balance[account2 - 1] += money
        return True
```

```javascript
// Time: O(1) for all operations | Space: O(n) for storing balances
class Bank {
  constructor(balance) {
    // Store the balances array
    // Accounts are 1-indexed, so account i corresponds to balance[i-1]
    this.balance = balance;
    // Store number of accounts for quick validation
    this.n = balance.length;
  }

  deposit(account, money) {
    // Check if account number is valid (1 to n)
    if (account < 1 || account > this.n) {
      return false;
    }

    // Account numbers are 1-indexed, array is 0-indexed
    this.balance[account - 1] += money;
    return true;
  }

  withdraw(account, money) {
    // Check if account number is valid
    if (account < 1 || account > this.n) {
      return false;
    }

    // Check if account has sufficient funds
    if (this.balance[account - 1] < money) {
      return false;
    }

    // Withdraw the money
    this.balance[account - 1] -= money;
    return true;
  }

  transfer(account1, account2, money) {
    // Check if both accounts are valid
    if (account1 < 1 || account1 > this.n || account2 < 1 || account2 > this.n) {
      return false;
    }

    // Check if source account has sufficient funds
    if (this.balance[account1 - 1] < money) {
      return false;
    }

    // Perform the transfer atomically
    // Withdraw from account1
    this.balance[account1 - 1] -= money;
    // Deposit to account2
    this.balance[account2 - 1] += money;
    return true;
  }
}
```

```java
// Time: O(1) for all operations | Space: O(n) for storing balances
class Bank {
    private long[] balance;
    private int n;

    public Bank(long[] balance) {
        // Store the balances array
        // Accounts are 1-indexed, so account i corresponds to balance[i-1]
        this.balance = balance;
        // Store number of accounts for quick validation
        this.n = balance.length;
    }

    public boolean deposit(int account, long money) {
        // Check if account number is valid (1 to n)
        if (account < 1 || account > n) {
            return false;
        }

        // Account numbers are 1-indexed, array is 0-indexed
        balance[account - 1] += money;
        return true;
    }

    public boolean withdraw(int account, long money) {
        // Check if account number is valid
        if (account < 1 || account > n) {
            return false;
        }

        // Check if account has sufficient funds
        if (balance[account - 1] < money) {
            return false;
        }

        // Withdraw the money
        balance[account - 1] -= money;
        return true;
    }

    public boolean transfer(int account1, int account2, long money) {
        // Check if both accounts are valid
        if (account1 < 1 || account1 > n ||
            account2 < 1 || account2 > n) {
            return false;
        }

        // Check if source account has sufficient funds
        if (balance[account1 - 1] < money) {
            return false;
        }

        // Perform the transfer atomically
        // Withdraw from account1
        balance[account1 - 1] -= money;
        // Deposit to account2
        balance[account2 - 1] += money;
        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(1) for all operations

- Each operation performs a constant number of array accesses and comparisons
- Account validation is O(1) since we store `n` and compare against it
- Balance checks and updates are O(1) array operations

**Space Complexity**: O(n)

- We store the `balance` array of size n
- We use O(1) additional space for variables like `n`
- The space is required by the problem specification to maintain account balances

## Common Mistakes

1. **Off-by-one errors with account indices**: Forgetting that accounts are 1-indexed while arrays are 0-indexed. Always subtract 1 when accessing `balance[account-1]`.

2. **Not validating account numbers first**: Checking balances before validating account existence can cause index out of bounds errors. Always validate account numbers first.

3. **Non-atomic transfers**: Withdrawing from source before checking if destination exists or has sufficient funds. This could leave money in limbo or create negative balances.

4. **Integer overflow**: With large deposits/transfers, balances could exceed integer limits. The problem uses 64-bit integers (long in Java), but candidates might miss this detail.

## When You'll See This Pattern

This problem teaches **transaction validation patterns** and **state machine design**:

1. **Design an ATM Machine (Medium)** - Similar validation requirements for bank notes and amounts
2. **Design Underground System (Medium)** - Maintaining state and calculating aggregates
3. **Design Browser History (Medium)** - Managing state transitions with validation

These problems all involve designing a class that maintains internal state and provides methods that validate inputs before modifying that state. The pattern is common in system design interviews where you need to ensure data consistency.

## Key Takeaways

1. **Validate before modifying**: Always check all preconditions (account existence, sufficient funds) before making any state changes. This ensures operations are atomic.

2. **Mind your indices**: When problem statements use 1-based indexing but programming languages use 0-based arrays, be meticulous about converting between them.

3. **Early returns for validation failures**: Return false immediately when any validation fails to prevent partial updates and simplify control flow.

Related problems: [Design an ATM Machine](/problem/design-an-atm-machine)
