---
title: "Sorting Questions at Intuit: What to Expect"
description: "Prepare for Sorting interview questions at Intuit — patterns, difficulty breakdown, and study tips."
date: "2028-11-04"
category: "dsa-patterns"
tags: ["intuit", "sorting", "interview prep"]
---

Sorting questions appear in nearly 15% of Intuit's technical interview problems. For a company that manages critical financial data for millions—from TurboTax calculations to QuickBooks transactions—efficient data organization isn't an academic exercise; it's a core engineering requirement. Systems must sort transactions by date, prioritize customer queries, categorize expenses, and generate accurate reports. Your ability to select and implement the right sorting strategy directly reflects your potential to build performant, scalable features for Intuit's products.

## What to Expect — types of problems

You won't be asked to implement a basic sorting algorithm from scratch, like coding Quicksort on a blank page. Instead, Intuit's problems integrate sorting as a critical step within a larger, practical problem. Expect these types:

- **Sorting as a Preprocessing Step:** Many array or string problems become tractable once the data is ordered. You might be given a list of transaction timestamps to find overlaps or a collection of invoices to merge based on sorted intervals.
- **Custom Comparison Sorting:** This is the most common pattern. You'll be asked to sort objects (e.g., customer records, financial entries) based on multiple, sometimes complex, criteria. For example, "sort these tax entries first by year (ascending), then by amount (descending)." Mastering custom comparators is essential.
- **Top K Problems:** These questions ask for the "K largest" or "K smallest" items, like finding the top 5 highest-value transactions. While a heap (`PriorityQueue`) is often optimal, a simple sort followed by slicing is a perfectly acceptable starting point for discussion.
- **Hybrid Problems:** These combine sorting with another core pattern, such as two-pointer technique on a sorted array (e.g., finding pairs that sum to a target) or binary search on sorted results.

## How to Prepare — study tips with one code example

Focus on applying sorting, not memorizing O(n log n) implementation details. Use your language's built-in sort function and learn its API for custom ordering inside out. Practice by identifying when sorting simplifies a problem. The key pattern to master is the **custom comparator**.

Consider this problem: "You are given a list of transactions where each transaction is `[id, amount, customer_type]`. Sort them primarily by `customer_type` in the order `['premium', 'standard', 'basic']`, and secondarily by `amount` from highest to lowest."

The solution requires defining a mapping for the custom priority and writing a comparator that uses it.

<div class="code-group">

```python
def sort_transactions(transactions):
    # Define priority for customer_type
    priority = {'premium': 0, 'standard': 1, 'basic': 2}

    # Sort using a key function. For secondary descending order,
    # we sort by negative amount.
    transactions.sort(key=lambda t: (priority[t[2]], -t[1]))
    return transactions

# Example
txns = [[1, 100, 'basic'], [2, 200, 'premium'], [3, 150, 'premium']]
print(sort_transactions(txns))
# Output: [[2, 200, 'premium'], [3, 150, 'premium'], [1, 100, 'basic']]
```

```javascript
function sortTransactions(transactions) {
  const priority = { premium: 0, standard: 1, basic: 2 };

  transactions.sort((a, b) => {
    if (priority[a[2]] !== priority[b[2]]) {
      return priority[a[2]] - priority[b[2]];
    }
    // Secondary sort: amount descending
    return b[1] - a[1];
  });

  return transactions;
}

// Example
const txns = [
  [1, 100, "basic"],
  [2, 200, "premium"],
  [3, 150, "premium"],
];
console.log(sortTransactions(txns));
// Output: [[2, 200, 'premium'], [3, 150, 'premium'], [1, 100, 'basic']]
```

```java
import java.util.*;

public class Main {
    public static List<int[]> sortTransactions(List<int[]> transactions) {
        Map<String, Integer> priority = new HashMap<>();
        priority.put("premium", 0);
        priority.put("standard", 1);
        priority.put("basic", 2);

        transactions.sort((a, b) -> {
            // a[2] and b[2] are customer_type indices. Cast to String.
            String typeA = (String) a[2];
            String typeB = (String) b[2];
            if (!priority.get(typeA).equals(priority.get(typeB))) {
                return priority.get(typeA) - priority.get(typeB);
            }
            // Secondary sort: amount descending
            return (int) b[1] - (int) a[1];
        });
        return transactions;
    }

    public static void main(String[] args) {
        // Note: Using Object[] for mixed types for simplicity. In practice, use a Transaction class.
        List<int[]> txns = new ArrayList<>();
        txns.add(new Object[]{1, 100, "basic"});
        txns.add(new Object[]{2, 200, "premium"});
        txns.add(new Object[]{3, 150, "premium"});
        System.out.println(Arrays.deepToString(sortTransactions(txns).toArray()));
        // Output: [[2, 200, premium], [3, 150, premium], [1, 100, basic]]
    }
}
```

</div>

## Recommended Practice Order

1.  **Master the Built-in Sort:** Practice writing custom comparators for simple objects (e.g., sort 2D arrays by the second column).
2.  **Solve Top K Problems:** Start with the straightforward sort-and-slice approach, then optimize with a heap.
3.  **Tackle Hybrid Problems:** Combine sorting with two-pointer techniques (like finding a pair sum) or binary search.
4.  **Simulate Intuit Problems:** Finally, practice the specific sorting questions tagged for Intuit on platforms like CodeJeet. This will expose you to their preferred problem domains and difficulty level.

[Practice Sorting at Intuit](/company/intuit/sorting)
