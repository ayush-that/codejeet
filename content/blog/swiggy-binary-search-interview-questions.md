---
title: "Binary Search Questions at Swiggy: What to Expect"
description: "Prepare for Binary Search interview questions at Swiggy — patterns, difficulty breakdown, and study tips."
date: "2030-02-09"
category: "dsa-patterns"
tags: ["swiggy", "binary-search", "interview prep"]
---

Binary Search isn't just about finding an element in a sorted array. At Swiggy, a company built on logistics, delivery time optimization, and inventory management, it's a fundamental tool for solving efficiency problems at scale. With 4 out of 41 of their technical interview questions tagged with Binary Search, they clearly value candidates who can apply this O(log n) paradigm to real-world constraints, like determining the minimum delivery capacity for riders or the optimal radius for a restaurant search.

## What to Expect — Types of Problems

You won't see textbook "find 5 in this array" questions. Swiggy's problems typically involve applying the Binary Search _pattern_ to an abstracted scenario. Expect these two main types:

1.  **Search in a Sorted Structure:** This is the classic application, but often disguised. You might search for a specific delivery ID in a sorted log, find a restaurant's rating in a sorted list, or locate a geographic point in partitioned delivery zones. The data structure might be an array, a matrix sorted row and column-wise, or a stream of ordered events.

2.  **Binary Search on Answer (or "Search Space"):** This is the most critical and frequent pattern for Swiggy interviews. Here, you use Binary Search to find the _optimal value_ of something, not to find an existing element. The problem will describe a constraint (e.g., "deliver all orders in N hours"), and you must find the minimum or maximum feasible solution (e.g., "minimum speed for delivery executives"). You define a search space (e.g., possible speeds from 1 to max order distance), write a helper function to check if a given mid-value is feasible, and binary search to find the optimal point.

## How to Prepare — Study Tips with One Code Example

Master the pattern, not just the algorithm. Internalize this three-step framework for "Binary Search on Answer" problems:

1.  **Identify the Search Space:** What is the range of possible answers? Define `low` and `high`.
2.  **Create a Feasibility Function (`canDo(mid)`):** This is the core logic. Given a candidate answer `mid`, determine if it's possible to achieve the goal under the given constraints.
3.  **Apply Standard Binary Search:** Narrow the search space based on the feasibility function's result. Decide if you're finding the minimum feasible value or the maximum.

Consider this classic problem that mirrors delivery optimization: _"Find the minimum capacity for a delivery vehicle to ship all packages within D days."_

<div class="code-group">

```python
def min_capacity(weights, days):
    def can_ship(capacity):
        current_load = 0
        days_needed = 1
        for w in weights:
            if current_load + w > capacity:
                days_needed += 1
                current_load = 0
            current_load += w
        return days_needed <= days

    low, high = max(weights), sum(weights)
    while low < high:
        mid = (low + high) // 2
        if can_ship(mid):
            high = mid  # Try for a smaller capacity
        else:
            low = mid + 1  # Need more capacity
    return low
```

```javascript
function minCapacity(weights, days) {
  const canShip = (capacity) => {
    let currentLoad = 0;
    let daysNeeded = 1;
    for (const w of weights) {
      if (currentLoad + w > capacity) {
        daysNeeded++;
        currentLoad = 0;
      }
      currentLoad += w;
    }
    return daysNeeded <= days;
  };

  let low = Math.max(...weights);
  let high = weights.reduce((a, b) => a + b, 0);
  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (canShip(mid)) {
      high = mid;
    } else {
      low = mid + 1;
    }
  }
  return low;
}
```

```java
public int minCapacity(int[] weights, int days) {
    int low = 0, high = 0;
    for (int w : weights) {
        low = Math.max(low, w);
        high += w;
    }

    while (low < high) {
        int mid = low + (high - low) / 2;
        if (canShip(weights, days, mid)) {
            high = mid;
        } else {
            low = mid + 1;
        }
    }
    return low;
}

private boolean canShip(int[] weights, int days, int capacity) {
    int currentLoad = 0;
    int daysNeeded = 1;
    for (int w : weights) {
        if (currentLoad + w > capacity) {
            daysNeeded++;
            currentLoad = 0;
        }
        currentLoad += w;
    }
    return daysNeeded <= days;
}
```

</div>

## Recommended Practice Order

Build your skill progressively:

1.  **Foundation:** Standard Binary Search (first occurrence, last occurrence).
2.  **Rotation & Search:** Search in a rotated sorted array.
3.  **2D Application:** Search in a row-column sorted matrix.
4.  **Core Pattern:** "Binary Search on Answer" problems (capacity to ship, Koko eating bananas, split array largest sum).
5.  **Swiggy-Specific:** Practice problems directly from their question bank to acclimate to their phrasing and constraints.

[Practice Binary Search at Swiggy](/company/swiggy/binary-search)
