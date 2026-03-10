---
title: "How to Solve Design a Food Rating System — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Design a Food Rating System. Medium difficulty, 52.9% acceptance rate. Topics: Array, Hash Table, String, Design, Heap (Priority Queue)."
date: "2026-04-02"
category: "dsa-patterns"
tags: ["design-a-food-rating-system", "array", "hash-table", "string", "medium"]
---

# How to Solve "Design a Food Rating System"

This problem asks us to design a system that tracks food ratings by cuisine and supports two operations: modifying a food's rating and retrieving the highest-rated food for a given cuisine. What makes this interesting is that we need to efficiently handle both updates and queries while maintaining ordering by rating (and lexicographically when ratings tie). The challenge is balancing quick modifications with fast maximum retrieval.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Initialization:**

- foods = ["pizza", "burger", "pizza"]
- cuisines = ["italian", "american", "italian"]
- ratings = [8, 7, 9]

After initialization:

- "pizza" (italian) has rating 8
- "burger" (american) has rating 7
- "pizza" (italian) has rating 9 (this overwrites the first pizza)

**Operation 1:** `highestRated("italian")`

- Italian foods: "pizza" with rating 9
- Return "pizza"

**Operation 2:** `changeRating("pizza", 6)`

- Update pizza's rating from 9 to 6

**Operation 3:** `highestRated("italian")`

- Italian foods: "pizza" with rating 6
- Return "pizza"

**Operation 4:** `changeRating("burger", 10)`

- Update burger's rating from 7 to 10

**Operation 5:** `highestRated("american")`

- American foods: "burger" with rating 10
- Return "burger"

The key insight: we need to quickly find the maximum rating for each cuisine, but we also need to update ratings efficiently. A simple list would make queries slow (O(n)), while a sorted structure would make updates slow (O(n log n)).

## Brute Force Approach

A naive approach would store foods in lists grouped by cuisine:

1. **Data Structures:**
   - A map from cuisine → list of (food, rating) pairs
   - A map from food → (cuisine, rating) for quick updates

2. **Operations:**
   - `changeRating(food, newRating)`: Find the food's cuisine, update both maps
   - `highestRated(cuisine)`: Scan the cuisine's list to find max rating (and lex smallest food on ties)

**Why this fails:**

- `highestRated()` requires O(k) time where k = number of foods in that cuisine
- With many foods per cuisine, this becomes inefficient
- The problem constraints (up to 2×10⁴ operations) make O(n) queries too slow

**The core issue:** Finding the maximum requires scanning all items each time. We need a data structure that maintains ordering.

## Optimized Approach

The key insight is to use **priority queues (heaps)** for each cuisine to efficiently retrieve the highest-rated food. However, heaps alone aren't enough because we need to handle updates efficiently.

**The challenge with heaps:** Standard heaps don't support efficient updates of arbitrary elements. When we change a rating, we can't easily find and update that specific food in the heap.

**Solution: Lazy deletion pattern**

1. Maintain a max-heap for each cuisine containing (-rating, food) pairs (negative for max-heap in languages with min-heap only)
2. When `changeRating()` is called, don't remove the old entry from the heap
3. Instead, store the new rating in a separate map
4. When `highestRated()` is called, check if the top of heap matches the current rating in the map
5. If not (stale entry), pop it and check the next one

**Why this works:**

- Updates become O(log n) for heap push (we push new entry, not update old)
- Queries become O(log n) amortized (we might pop stale entries)
- We avoid the expensive O(n) update in a sorted structure

**Data structures needed:**

1. `food_info`: Map food → (cuisine, current_rating)
2. `cuisine_heaps`: Map cuisine → max-heap of (-rating, food)
3. When rating changes: update `food_info` and push new entry to heap
4. When querying: pop stale entries until top matches current rating

## Optimal Solution

Here's the complete implementation using the lazy deletion pattern:

<div class="code-group">

```python
# Time: O(log n) for changeRating, O(log n) amortized for highestRated
# Space: O(n) where n = number of foods
import heapq
from collections import defaultdict

class FoodRatings:
    def __init__(self, foods: List[str], cuisines: List[str], ratings: List[int]):
        # Map food -> (cuisine, current_rating)
        self.food_info = {}

        # Map cuisine -> max-heap of (-rating, food)
        # Using negative rating because Python has min-heap by default
        self.cuisine_heaps = defaultdict(list)

        # Initialize data structures
        for food, cuisine, rating in zip(foods, cuisines, ratings):
            # Store food information
            self.food_info[food] = (cuisine, rating)

            # Push to cuisine's heap (negative rating for max-heap behavior)
            heapq.heappush(self.cuisine_heaps[cuisine], (-rating, food))

    def changeRating(self, food: str, newRating: int) -> None:
        # Get current cuisine and update rating in food_info
        cuisine, _ = self.food_info[food]
        self.food_info[food] = (cuisine, newRating)

        # Push new entry to heap (old entry becomes stale)
        # We don't remove old entry - lazy deletion
        heapq.heappush(self.cuisine_heaps[cuisine], (-newRating, food))

    def highestRated(self, cuisine: str) -> str:
        # Get the heap for this cuisine
        heap = self.cuisine_heaps[cuisine]

        # Keep popping until we find a non-stale entry
        while heap:
            # Peek at the top element (highest rating due to negative values)
            neg_rating, food = heap[0]
            rating = -neg_rating  # Convert back to positive

            # Get current rating from food_info
            _, current_rating = self.food_info[food]

            # If ratings match, this entry is valid
            if rating == current_rating:
                return food

            # Otherwise, this is a stale entry - pop it
            heapq.heappop(heap)

        # Should never reach here if input is valid
        return ""
```

```javascript
// Time: O(log n) for changeRating, O(log n) amortized for highestRated
// Space: O(n) where n = number of foods

class FoodRatings {
  constructor(foods, cuisines, ratings) {
    // Map food -> {cuisine, rating}
    this.foodInfo = new Map();

    // Map cuisine -> max-heap of [rating, food]
    // Using negative rating for max-heap since JavaScript doesn't have built-in max-heap
    this.cuisineHeaps = new Map();

    // Initialize data structures
    for (let i = 0; i < foods.length; i++) {
      const food = foods[i];
      const cuisine = cuisines[i];
      const rating = ratings[i];

      // Store food information
      this.foodInfo.set(food, { cuisine, rating });

      // Initialize heap for cuisine if not exists
      if (!this.cuisineHeaps.has(cuisine)) {
        this.cuisineHeaps.set(cuisine, new MinHeap());
      }

      // Push to cuisine's heap (negative rating for max-heap)
      this.cuisineHeaps.get(cuisine).push([-rating, food]);
    }
  }

  changeRating(food, newRating) {
    // Get current cuisine and update rating
    const info = this.foodInfo.get(food);
    info.rating = newRating;
    this.foodInfo.set(food, info);

    // Push new entry to heap (old entry becomes stale)
    const heap = this.cuisineHeaps.get(info.cuisine);
    heap.push([-newRating, food]);
  }

  highestRated(cuisine) {
    const heap = this.cuisineHeaps.get(cuisine);

    // Keep popping until we find a non-stale entry
    while (!heap.isEmpty()) {
      // Peek at the top element
      const [negRating, food] = heap.peek();
      const rating = -negRating; // Convert back to positive

      // Get current rating from foodInfo
      const currentRating = this.foodInfo.get(food).rating;

      // If ratings match, this entry is valid
      if (rating === currentRating) {
        return food;
      }

      // Otherwise, this is a stale entry - pop it
      heap.pop();
    }

    return ""; // Should never reach here
  }
}

// MinHeap implementation for JavaScript
class MinHeap {
  constructor() {
    this.heap = [];
  }

  push(val) {
    this.heap.push(val);
    this._bubbleUp(this.heap.length - 1);
  }

  pop() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();

    const root = this.heap[0];
    this.heap[0] = this.heap.pop();
    this._bubbleDown(0);
    return root;
  }

  peek() {
    return this.heap[0];
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  _bubbleUp(index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.heap[parent][0] <= this.heap[index][0]) break;
      [this.heap[parent], this.heap[index]] = [this.heap[index], this.heap[parent]];
      index = parent;
    }
  }

  _bubbleDown(index) {
    const length = this.heap.length;
    while (true) {
      let left = 2 * index + 1;
      let right = 2 * index + 2;
      let smallest = index;

      if (left < length && this.heap[left][0] < this.heap[smallest][0]) {
        smallest = left;
      }
      if (right < length && this.heap[right][0] < this.heap[smallest][0]) {
        smallest = right;
      }
      if (smallest === index) break;

      [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
      index = smallest;
    }
  }
}
```

```java
// Time: O(log n) for changeRating, O(log n) amortized for highestRated
// Space: O(n) where n = number of foods

import java.util.*;

class FoodRatings {
    // Map food -> FoodInfo (cuisine and current rating)
    private Map<String, FoodInfo> foodInfo;

    // Map cuisine -> priority queue of FoodEntry
    private Map<String, PriorityQueue<FoodEntry>> cuisineHeaps;

    // Helper class to store food information
    class FoodInfo {
        String cuisine;
        int rating;

        FoodInfo(String cuisine, int rating) {
            this.cuisine = cuisine;
            this.rating = rating;
        }
    }

    // Helper class for heap entries
    class FoodEntry {
        int rating;
        String food;

        FoodEntry(int rating, String food) {
            this.rating = rating;
            this.food = food;
        }
    }

    public FoodRatings(String[] foods, String[] cuisines, int[] ratings) {
        foodInfo = new HashMap<>();
        cuisineHeaps = new HashMap<>();

        // Initialize data structures
        for (int i = 0; i < foods.length; i++) {
            String food = foods[i];
            String cuisine = cuisines[i];
            int rating = ratings[i];

            // Store food information
            foodInfo.put(food, new FoodInfo(cuisine, rating));

            // Initialize heap for cuisine if not exists
            cuisineHeaps.putIfAbsent(cuisine,
                new PriorityQueue<>((a, b) -> {
                    // Higher rating first, then lexicographically smaller food
                    if (a.rating != b.rating) {
                        return b.rating - a.rating; // Higher rating first
                    }
                    return a.food.compareTo(b.food); // Lex smaller first
                }));

            // Push to cuisine's heap
            cuisineHeaps.get(cuisine).offer(new FoodEntry(rating, food));
        }
    }

    public void changeRating(String food, int newRating) {
        // Get current cuisine and update rating
        FoodInfo info = foodInfo.get(food);
        info.rating = newRating;
        foodInfo.put(food, info);

        // Push new entry to heap (old entry becomes stale)
        PriorityQueue<FoodEntry> heap = cuisineHeaps.get(info.cuisine);
        heap.offer(new FoodEntry(newRating, food));
    }

    public String highestRated(String cuisine) {
        PriorityQueue<FoodEntry> heap = cuisineHeaps.get(cuisine);

        // Keep popping until we find a non-stale entry
        while (!heap.isEmpty()) {
            FoodEntry entry = heap.peek();
            String food = entry.food;
            int heapRating = entry.rating;

            // Get current rating from foodInfo
            int currentRating = foodInfo.get(food).rating;

            // If ratings match, this entry is valid
            if (heapRating == currentRating) {
                return food;
            }

            // Otherwise, this is a stale entry - poll it
            heap.poll();
        }

        return ""; // Should never reach here
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- **Initialization:** O(n log n) where n = number of foods. Each food is pushed to a heap once.
- **changeRating():** O(log k) where k = number of foods in that cuisine's heap. We push a new entry to the heap.
- **highestRated():** O(log k) amortized. In the worst case, we might pop many stale entries, but each food can only become stale once, so amortized cost is O(log k).

**Space Complexity:** O(n) where n = number of foods. We store each food in `food_info` and potentially multiple times in heaps (when ratings change). However, each food appears at most once per rating change in the heap.

## Common Mistakes

1. **Forgetting to handle ties correctly:** When ratings are equal, we must return the lexicographically smallest food. Many candidates implement max-heap by rating but forget the secondary sort by food name.

2. **Trying to update heap entries directly:** Standard heaps don't support efficient updates. Candidates who try to find and update elements in the heap end up with O(n) operations.

3. **Not handling stale entries in queries:** When popping from the heap in `highestRated()`, candidates must check if the entry matches current rating. Forgetting this means returning outdated information.

4. **Using positive ratings in min-heap without negation:** In languages with only min-heap (Python, JavaScript), candidates must store negative ratings to get max-heap behavior. Using positive ratings returns the lowest-rated food.

## When You'll See This Pattern

The **lazy deletion with heaps** pattern appears whenever you need to support both updates and max/min queries efficiently. Similar problems include:

1. **Design a Number Container System (LeetCode 2349):** Similar structure - need to find smallest index for a number while supporting updates. The same lazy deletion technique applies.

2. **Stock Price Fluctuation (LeetCode 2034):** Track maximum and minimum stock prices while supporting updates. Uses two heaps with lazy deletion.

3. **Sliding Window Maximum (LeetCode 239):** While not identical, it also involves maintaining maximum with changing data, often solved with monotonic deque.

The pattern is: when you need to maintain extremum (max/min) with updates, consider heaps with lazy deletion as an alternative to balanced binary search trees.

## Key Takeaways

1. **Lazy deletion enables efficient heap updates:** Instead of modifying heap elements directly (which is inefficient), push new entries and mark old ones as stale. Clean them up when they surface to the top.

2. **Multiple data structures work together:** This solution combines hash maps (for O(1) lookups) with heaps (for O(log n) extremum queries). Recognizing when to combine structures is key to design problems.

3. **Amortized analysis matters:** While `highestRated()` might pop multiple stale entries, each food can only be stale once, making the amortized cost O(log n). Don't dismiss an approach because of worst-case single-operation cost.

Related problems: [Design a Number Container System](/problem/design-a-number-container-system), [Most Popular Video Creator](/problem/most-popular-video-creator)
