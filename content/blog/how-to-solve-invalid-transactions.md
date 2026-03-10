---
title: "How to Solve Invalid Transactions — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Invalid Transactions. Medium difficulty, 32.1% acceptance rate. Topics: Array, Hash Table, String, Sorting."
date: "2027-04-06"
category: "dsa-patterns"
tags: ["invalid-transactions", "array", "hash-table", "string", "medium"]
---

## How to Solve Invalid Transactions

This problem asks us to identify potentially fraudulent transactions based on two rules: transactions over $1000, and transactions that occur within 60 minutes of another transaction with the same name but in a different city. The tricky part is efficiently checking all pairs of transactions for the same person while handling the time window constraint.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:** `["alice,20,800,mtv","alice,50,100,beijing"]`

1. **Parse first transaction:** name="alice", time=20, amount=800, city="mtv"
   - Amount ≤ 1000 ✓
   - No other transactions yet for comparison
   - Not invalid yet

2. **Parse second transaction:** name="alice", time=50, amount=100, city="beijing"
   - Amount ≤ 1000 ✓
   - Check against first transaction:
     - Same name ✓
     - Different city (mtv ≠ beijing) ✓
     - Time difference: |50 - 20| = 30 ≤ 60 ✓
   - **Both transactions become invalid** because they're within 60 minutes in different cities

**Output:** `["alice,20,800,mtv","alice,50,100,beijing"]`

The key insight: when two transactions conflict, **both** become invalid, not just the later one.

## Brute Force Approach

A naive solution would compare every pair of transactions:

1. Parse all transactions into structured data
2. For each transaction i:
   - Check if amount > 1000 → mark invalid
   - For each other transaction j:
     - If same name, different city, and |time_i - time_j| ≤ 60:
       - Mark both i and j as invalid

**Why this is insufficient:** With n transactions, we have O(n²) comparisons. For n=1000, that's 500,000 comparisons. While this might pass for small inputs, it's inefficient and shows poor algorithmic thinking.

## Optimized Approach

The key insight is that we only need to compare transactions with the **same name**. We can group transactions by name using a hash map, then sort each group by time to efficiently find conflicts.

**Step-by-step reasoning:**

1. **Group by name:** Create a map where key=name, value=list of (time, city, original_index)
2. **Sort each group by time:** This allows us to use a sliding window approach
3. **Check for conflicts:** For each transaction in a group:
   - If amount > 1000 → mark invalid
   - Look at nearby transactions in the sorted list (within 60 minutes)
   - If any nearby transaction has different city → mark current transaction invalid
4. **Handle bidirectional conflicts:** When transaction A conflicts with B, both become invalid

**Why sorting helps:** Instead of comparing with all other transactions (O(n²)), we only compare with transactions in a limited time window. Since the list is sorted by time, we can use two pointers to find all transactions within 60 minutes efficiently.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n log n) - sorting dominates
# Space: O(n) - storing parsed transactions and results
def invalidTransactions(transactions):
    """
    Identify invalid transactions based on:
    1. Amount > 1000
    2. Same name, different city, within 60 minutes
    """
    # Parse all transactions into structured format
    parsed = []
    for i, transaction in enumerate(transactions):
        name, time, amount, city = transaction.split(',')
        # Store as tuple: (name, int(time), int(amount), city, original_index)
        parsed.append((name, int(time), int(amount), city, i))

    # Group transactions by name for efficient comparison
    name_to_transactions = {}
    for transaction in parsed:
        name = transaction[0]
        if name not in name_to_transactions:
            name_to_transactions[name] = []
        name_to_transactions[name].append(transaction)

    invalid_indices = set()

    # Process each person's transactions separately
    for name, trans_list in name_to_transactions.items():
        # Sort by time to enable sliding window approach
        trans_list.sort(key=lambda x: x[1])

        # Check each transaction
        for i in range(len(trans_list)):
            name_i, time_i, amount_i, city_i, idx_i = trans_list[i]

            # Rule 1: Amount exceeds $1000
            if amount_i > 1000:
                invalid_indices.add(idx_i)

            # Rule 2: Check for conflicts with nearby transactions
            # We check both forward and backward within 60 minutes
            j = i + 1
            # Check forward (transactions after current)
            while j < len(trans_list):
                name_j, time_j, amount_j, city_j, idx_j = trans_list[j]
                # If beyond 60 minutes, stop checking forward
                if time_j - time_i > 60:
                    break
                # If different city within 60 minutes, both are invalid
                if city_i != city_j:
                    invalid_indices.add(idx_i)
                    invalid_indices.add(idx_j)
                j += 1

            # Check backward (transactions before current)
            j = i - 1
            while j >= 0:
                name_j, time_j, amount_j, city_j, idx_j = trans_list[j]
                # If beyond 60 minutes, stop checking backward
                if time_i - time_j > 60:
                    break
                # If different city within 60 minutes, both are invalid
                if city_i != city_j:
                    invalid_indices.add(idx_i)
                    invalid_indices.add(idx_j)
                j -= 1

    # Convert invalid indices back to original transaction strings
    result = []
    for idx in invalid_indices:
        result.append(transactions[idx])

    return result
```

```javascript
// Time: O(n log n) - sorting dominates
// Space: O(n) - storing parsed transactions and results
function invalidTransactions(transactions) {
  /**
   * Identify invalid transactions based on:
   * 1. Amount > 1000
   * 2. Same name, different city, within 60 minutes
   */

  // Parse all transactions into structured format
  const parsed = [];
  for (let i = 0; i < transactions.length; i++) {
    const [name, timeStr, amountStr, city] = transactions[i].split(",");
    parsed.push({
      name,
      time: parseInt(timeStr),
      amount: parseInt(amountStr),
      city,
      originalIndex: i,
    });
  }

  // Group transactions by name
  const nameMap = new Map();
  for (const trans of parsed) {
    if (!nameMap.has(trans.name)) {
      nameMap.set(trans.name, []);
    }
    nameMap.get(trans.name).push(trans);
  }

  const invalidIndices = new Set();

  // Process each person's transactions
  for (const [name, transList] of nameMap) {
    // Sort by time for sliding window approach
    transList.sort((a, b) => a.time - b.time);

    // Check each transaction
    for (let i = 0; i < transList.length; i++) {
      const current = transList[i];

      // Rule 1: Amount exceeds $1000
      if (current.amount > 1000) {
        invalidIndices.add(current.originalIndex);
      }

      // Rule 2: Check forward for conflicts
      let j = i + 1;
      while (j < transList.length) {
        const other = transList[j];
        // Stop if beyond 60 minutes
        if (other.time - current.time > 60) break;
        // Different city within 60 minutes = conflict
        if (other.city !== current.city) {
          invalidIndices.add(current.originalIndex);
          invalidIndices.add(other.originalIndex);
        }
        j++;
      }

      // Rule 2: Check backward for conflicts
      j = i - 1;
      while (j >= 0) {
        const other = transList[j];
        // Stop if beyond 60 minutes
        if (current.time - other.time > 60) break;
        // Different city within 60 minutes = conflict
        if (other.city !== current.city) {
          invalidIndices.add(current.originalIndex);
          invalidIndices.add(other.originalIndex);
        }
        j--;
      }
    }
  }

  // Convert indices back to transaction strings
  const result = [];
  for (const idx of invalidIndices) {
    result.push(transactions[idx]);
  }

  return result;
}
```

```java
// Time: O(n log n) - sorting dominates
// Space: O(n) - storing parsed transactions and results
import java.util.*;

class Solution {
    public List<String> invalidTransactions(String[] transactions) {
        /**
         * Identify invalid transactions based on:
         * 1. Amount > 1000
         * 2. Same name, different city, within 60 minutes
         */

        // Parse all transactions
        List<Transaction> parsed = new ArrayList<>();
        for (int i = 0; i < transactions.length; i++) {
            String[] parts = transactions[i].split(",");
            String name = parts[0];
            int time = Integer.parseInt(parts[1]);
            int amount = Integer.parseInt(parts[2]);
            String city = parts[3];
            parsed.add(new Transaction(name, time, amount, city, i));
        }

        // Group by name
        Map<String, List<Transaction>> nameMap = new HashMap<>();
        for (Transaction t : parsed) {
            nameMap.computeIfAbsent(t.name, k -> new ArrayList<>()).add(t);
        }

        Set<Integer> invalidIndices = new HashSet<>();

        // Process each person's transactions
        for (List<Transaction> transList : nameMap.values()) {
            // Sort by time
            transList.sort((a, b) -> a.time - b.time);

            // Check each transaction
            for (int i = 0; i < transList.size(); i++) {
                Transaction current = transList.get(i);

                // Rule 1: Amount exceeds $1000
                if (current.amount > 1000) {
                    invalidIndices.add(current.originalIndex);
                }

                // Rule 2: Check forward for conflicts
                int j = i + 1;
                while (j < transList.size()) {
                    Transaction other = transList.get(j);
                    // Stop if beyond 60 minutes
                    if (other.time - current.time > 60) break;
                    // Different city within 60 minutes = conflict
                    if (!other.city.equals(current.city)) {
                        invalidIndices.add(current.originalIndex);
                        invalidIndices.add(other.originalIndex);
                    }
                    j++;
                }

                // Rule 2: Check backward for conflicts
                j = i - 1;
                while (j >= 0) {
                    Transaction other = transList.get(j);
                    // Stop if beyond 60 minutes
                    if (current.time - other.time > 60) break;
                    // Different city within 60 minutes = conflict
                    if (!other.city.equals(current.city)) {
                        invalidIndices.add(current.originalIndex);
                        invalidIndices.add(other.originalIndex);
                    }
                    j--;
                }
            }
        }

        // Convert indices back to transaction strings
        List<String> result = new ArrayList<>();
        for (int idx : invalidIndices) {
            result.add(transactions[idx]);
        }

        return result;
    }

    // Helper class to store transaction data
    class Transaction {
        String name;
        int time;
        int amount;
        String city;
        int originalIndex;

        Transaction(String name, int time, int amount, String city, int originalIndex) {
            this.name = name;
            this.time = time;
            this.amount = amount;
            this.city = city;
            this.originalIndex = originalIndex;
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Parsing all transactions: O(n)
- Grouping by name: O(n)
- Sorting each group: In worst case, all transactions have same name, so O(n log n)
- Checking conflicts with sliding window: Each transaction is compared with a limited number of neighbors, O(n) total
- Dominated by sorting: O(n log n)

**Space Complexity: O(n)**

- Storing parsed transactions: O(n)
- Hash map grouping transactions: O(n)
- Set for invalid indices: O(n) in worst case
- Total: O(n)

## Common Mistakes

1. **Forgetting that conflicts are bidirectional:** When transaction A conflicts with B, candidates often only mark B as invalid. Remember: both become invalid.

2. **Not handling the "within 60 minutes" correctly:** The problem says "within (and including) 60 minutes," so |time1 - time2| ≤ 60. Some candidates use < 60 instead of ≤ 60.

3. **Inefficient comparison strategy:** Comparing every pair leads to O(n²) time. The key optimization is grouping by name first, then sorting by time to use a sliding window.

4. **Losing track of original indices:** After sorting, it's easy to lose which original transaction string corresponds to which parsed data. Always store the original index.

## When You'll See This Pattern

This problem combines **grouping by key** and **sliding window on sorted data**—a common pattern for problems involving temporal or spatial proximity:

1. **Merge Intervals (LeetCode 56)** - Similar grouping and sorting to find overlaps
2. **Car Pooling (LeetCode 1094)** - Tracking events over time with sorting
3. **Meeting Rooms II (LeetCode 253)** - Using sorting to find maximum concurrent events
4. **Time Based Key-Value Store (LeetCode 981)** - Grouping by key and searching sorted timestamps

The core pattern: when you need to find relationships between items based on multiple criteria (name + time), group by one criterion first, then sort by the other for efficient comparison.

## Key Takeaways

1. **Group then sort:** When comparing items based on multiple attributes, group by one attribute first, then sort by another to enable efficient algorithms like sliding window.

2. **Store original indices:** After parsing and transforming data, keep track of original positions to map back to the input format.

3. **Check boundaries carefully:** For "within X minutes/units" problems, pay close attention to inclusive vs exclusive boundaries (≤ vs <).

4. **Bidirectional relationships matter:** When two items conflict with each other, both are typically affected—not just one.

[Practice this problem on CodeJeet](/problem/invalid-transactions)
