---
title: "How to Solve Design Movie Rental System — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Design Movie Rental System. Hard difficulty, 62.6% acceptance rate. Topics: Array, Hash Table, Design, Heap (Priority Queue), Ordered Set."
date: "2028-01-10"
category: "dsa-patterns"
tags: ["design-movie-rental-system", "array", "hash-table", "design", "hard"]
---

# How to Solve Design Movie Rental System

You need to design a movie rental system that supports searching for movies, renting them, returning them, and generating reports of currently rented movies. Each movie has a shop ID, movie ID, and price. The challenge lies in efficiently supporting multiple operations: finding the cheapest price for a movie across all shops, renting movies (which removes them from search results), returning movies (which adds them back), and generating a sorted report of rented movies.

What makes this problem interesting is that you need to maintain multiple views of the same data simultaneously: you need to quickly find the cheapest available copy of a movie, but also maintain a sorted list of all currently rented movies for reporting. The key is choosing data structures that allow efficient updates across these different views.

## Visual Walkthrough

Let's trace through a small example. Suppose we have 3 shops with these movies:

- Shop 0: Movie 1 for $5, Movie 2 for $3
- Shop 1: Movie 1 for $4, Movie 3 for $6
- Shop 2: Movie 2 for $2, Movie 3 for $7

**Initialization:** We store all movies in a structure that lets us quickly find the cheapest price for any movie.

**Search for Movie 1:** We should find Shop 1's copy for $4 (cheaper than Shop 0's $5).

**Rent Movie 1 from Shop 1:** We remove this from the searchable movies and add it to rented movies.

**Search for Movie 1 again:** Now we only find Shop 0's copy for $5.

**Generate report:** Should show [Shop 1, Movie 1, $4] as the only rented movie.

**Return Movie 1 to Shop 1:** The movie goes back to being searchable.

**Search for Movie 1:** We again find Shop 1's copy for $4 (cheapest).

The tricky part is maintaining both the "available movies by price" view and the "rented movies sorted by shop/movie/price" view efficiently when movies move between these states.

## Brute Force Approach

A naive approach would store all movies in simple arrays or lists:

- Store all movies in a list of [shop, movie, price] tuples
- For `search(movie)`: Filter for the movie, sort by price, return cheapest 5
- For `rent(shop, movie)`: Find the movie, remove from available list, add to rented list
- For `drop(shop, movie)`: Remove from rented list, add back to available list
- For `report()`: Sort rented list and return first 5

The problem? Every operation requires O(n) time for filtering or O(n log n) for sorting, where n is the total number of movies across all shops. With up to 10^5 movies and 10^4 operations, this becomes impossibly slow.

```python
# Brute force - too slow for constraints
class MovieRentingSystem:
    def __init__(self, n, entries):
        self.movies = entries[:]  # All movies
        self.rented = []  # Rented movies

    def search(self, movie):
        # O(n) to filter + O(k log k) to sort
        available = [e for e in self.movies if e[1] == movie]
        available.sort(key=lambda x: (x[2], x[0]))
        return [e[0] for e in available[:5]]

    def rent(self, shop, movie):
        # O(n) to find and remove
        for i, (s, m, p) in enumerate(self.movies):
            if s == shop and m == movie:
                self.rented.append((s, m, p))
                del self.movies[i]
                break

    def drop(self, shop, movie):
        # O(n) to find and remove
        for i, (s, m, p) in enumerate(self.rented):
            if s == shop and m == movie:
                self.movies.append((s, m, p))
                del self.rented[i]
                break

    def report(self):
        # O(n log n) to sort
        self.rented.sort(key=lambda x: (x[2], x[0], x[1]))
        return [[s, m, p] for s, m, p in self.rented[:5]]
```

This approach fails because each operation is too slow. We need data structures that support faster lookups and maintain sorted order.

## Optimized Approach

The key insight is that we need to maintain two different sorted views of our data:

1. **For searching movies:** We need quick access to the cheapest available copy of each movie. A hash table mapping movie ID → min-heap of (price, shop) pairs works perfectly. When we rent a movie, we need to remove it from this heap efficiently.

2. **For tracking rented movies:** We need all rented movies sorted by (price, shop, movie) for reporting. A balanced BST (like TreeSet in Java or sorted list in Python) maintains this order through insertions and deletions.

3. **For efficient removal from heaps:** Since standard heaps don't support efficient removal of arbitrary elements, we use lazy deletion. We keep a separate dictionary `rented` that tracks which movies are currently rented. When we pop from a heap, if the movie is marked as rented, we discard it and pop again.

4. **For quick lookups:** We maintain a dictionary `movie_info[shop][movie] = price` to quickly find the price when renting or dropping.

The operations become:

- `search(movie)`: Peek at the heap for that movie, using lazy deletion to skip rented copies
- `rent(shop, movie)`: Mark as rented in our dictionary, add to rented movies BST
- `drop(shop, movie)`: Unmark as rented, push back to the movie's heap
- `report()`: Return first 5 from rented movies BST

## Optimal Solution

<div class="code-group">

```python
# Time: O(log n) for rent/drop, O(k log n) for search/report where k=5
# Space: O(n) for storing all movies
from collections import defaultdict
import heapq

class MovieRentingSystem:
    def __init__(self, n: int, entries: List[List[int]]):
        # Map movie_id -> min-heap of (price, shop) for available copies
        self.movie_heaps = defaultdict(list)

        # Map (shop, movie) -> price for quick lookups
        self.price_map = {}

        # Set of (shop, movie) currently rented
        self.rented_set = set()

        # Min-heap of rented movies sorted by (price, shop, movie)
        self.rented_heap = []

        # Initialize data structures
        for shop, movie, price in entries:
            # Add to movie-specific heap
            heapq.heappush(self.movie_heaps[movie], (price, shop))
            # Store price for quick lookup
            self.price_map[(shop, movie)] = price

    def search(self, movie: int) -> List[int]:
        """Return 5 cheapest shops with available copy of movie."""
        result = []
        temp_popped = []  # Store popped items to push back

        # Keep searching until we find 5 available copies or heap is empty
        while self.movie_heaps[movie] and len(result) < 5:
            price, shop = heapq.heappop(self.movie_heaps[movie])
            temp_popped.append((price, shop))

            # Check if this copy is currently rented
            if (shop, movie) not in self.rented_set:
                result.append(shop)

        # Push back all popped items to the heap
        for price, shop in temp_popped:
            heapq.heappush(self.movie_heaps[movie], (price, shop))

        return result

    def rent(self, shop: int, movie: int) -> None:
        """Rent a movie from a shop."""
        # Mark as rented
        self.rented_set.add((shop, movie))

        # Add to rented heap for reporting
        price = self.price_map[(shop, movie)]
        heapq.heappush(self.rented_heap, (price, shop, movie))

    def drop(self, shop: int, movie: int) -> None:
        """Return a rented movie."""
        # Remove from rented set
        self.rented_set.remove((shop, movie))

        # Note: We don't remove from rented_heap here - lazy deletion in report()
        # The movie is now available, so we could push to movie heap,
        # but search() already handles availability through rented_set

    def report(self) -> List[List[int]]:
        """Return 5 cheapest rented movies."""
        result = []
        temp_popped = []  # Store valid rented movies

        # Keep searching until we find 5 valid rented movies
        while self.rented_heap and len(result) < 5:
            price, shop, movie = heapq.heappop(self.rented_heap)

            # Check if still rented (lazy deletion for drops)
            if (shop, movie) in self.rented_set:
                result.append([shop, movie, price])
                temp_popped.append((price, shop, movie))

        # Push back valid rented movies
        for item in temp_popped:
            heapq.heappush(self.rented_heap, item)

        return result
```

```javascript
// Time: O(log n) for rent/drop, O(k log n) for search/report where k=5
// Space: O(n) for storing all movies

class MovieRentingSystem {
  constructor(n, entries) {
    // Map movie_id -> min-heap of [price, shop] for available copies
    this.movieHeaps = new Map();

    // Map "shop,movie" -> price for quick lookups
    this.priceMap = new Map();

    // Set of "shop,movie" currently rented
    this.rentedSet = new Set();

    // Min-heap of rented movies sorted by [price, shop, movie]
    this.rentedHeap = new MinHeap((a, b) => {
      if (a[0] !== b[0]) return a[0] - b[0];
      if (a[1] !== b[1]) return a[1] - b[1];
      return a[2] - b[2];
    });

    // Initialize data structures
    for (const [shop, movie, price] of entries) {
      const key = `${shop},${movie}`;

      // Initialize heap for this movie if needed
      if (!this.movieHeaps.has(movie)) {
        this.movieHeaps.set(
          movie,
          new MinHeap((a, b) => {
            if (a[0] !== b[0]) return a[0] - b[0];
            return a[1] - b[1];
          })
        );
      }

      // Add to movie-specific heap
      this.movieHeaps.get(movie).push([price, shop]);

      // Store price for quick lookup
      this.priceMap.set(key, price);
    }
  }

  search(movie) {
    const result = [];
    const tempPopped = [];
    const heap = this.movieHeaps.get(movie);

    if (!heap) return result;

    // Keep searching until we find 5 available copies or heap is empty
    while (heap.size() > 0 && result.length < 5) {
      const [price, shop] = heap.pop();
      tempPopped.push([price, shop]);

      // Check if this copy is currently rented
      const key = `${shop},${movie}`;
      if (!this.rentedSet.has(key)) {
        result.push(shop);
      }
    }

    // Push back all popped items to the heap
    for (const item of tempPopped) {
      heap.push(item);
    }

    return result;
  }

  rent(shop, movie) {
    const key = `${shop},${movie}`;

    // Mark as rented
    this.rentedSet.add(key);

    // Add to rented heap for reporting
    const price = this.priceMap.get(key);
    this.rentedHeap.push([price, shop, movie]);
  }

  drop(shop, movie) {
    const key = `${shop},${movie}`;

    // Remove from rented set
    this.rentedSet.delete(key);

    // Note: We don't remove from rentedHeap here - lazy deletion in report()
  }

  report() {
    const result = [];
    const tempPopped = [];

    // Keep searching until we find 5 valid rented movies
    while (this.rentedHeap.size() > 0 && result.length < 5) {
      const [price, shop, movie] = this.rentedHeap.pop();
      const key = `${shop},${movie}`;

      // Check if still rented (lazy deletion for drops)
      if (this.rentedSet.has(key)) {
        result.push([shop, movie, price]);
        tempPopped.push([price, shop, movie]);
      }
    }

    // Push back valid rented movies
    for (const item of tempPopped) {
      this.rentedHeap.push(item);
    }

    return result;
  }
}

// MinHeap implementation for JavaScript
class MinHeap {
  constructor(comparator = (a, b) => a - b) {
    this.heap = [];
    this.comparator = comparator;
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

  size() {
    return this.heap.length;
  }

  _bubbleUp(idx) {
    while (idx > 0) {
      const parent = Math.floor((idx - 1) / 2);
      if (this.comparator(this.heap[idx], this.heap[parent]) >= 0) break;
      [this.heap[idx], this.heap[parent]] = [this.heap[parent], this.heap[idx]];
      idx = parent;
    }
  }

  _bubbleDown(idx) {
    while (true) {
      let smallest = idx;
      const left = 2 * idx + 1;
      const right = 2 * idx + 2;

      if (left < this.heap.length && this.comparator(this.heap[left], this.heap[smallest]) < 0) {
        smallest = left;
      }

      if (right < this.heap.length && this.comparator(this.heap[right], this.heap[smallest]) < 0) {
        smallest = right;
      }

      if (smallest === idx) break;

      [this.heap[idx], this.heap[smallest]] = [this.heap[smallest], this.heap[idx]];
      idx = smallest;
    }
  }
}
```

```java
// Time: O(log n) for rent/drop, O(k log n) for search/report where k=5
// Space: O(n) for storing all movies

import java.util.*;

class MovieRentingSystem {
    // Map movie_id -> priority queue of ShopPrice (price, shop)
    private Map<Integer, PriorityQueue<ShopPrice>> movieHeaps;

    // Map shop+movie -> price
    private Map<String, Integer> priceMap;

    // Set of rented shop+movie combinations
    private Set<String> rentedSet;

    // Priority queue for rented movies sorted by (price, shop, movie)
    private PriorityQueue<RentedMovie> rentedHeap;

    // Helper class for movie heap entries
    class ShopPrice implements Comparable<ShopPrice> {
        int price;
        int shop;

        ShopPrice(int price, int shop) {
            this.price = price;
            this.shop = shop;
        }

        @Override
        public int compareTo(ShopPrice other) {
            if (this.price != other.price) {
                return Integer.compare(this.price, other.price);
            }
            return Integer.compare(this.shop, other.shop);
        }
    }

    // Helper class for rented heap entries
    class RentedMovie implements Comparable<RentedMovie> {
        int price;
        int shop;
        int movie;

        RentedMovie(int price, int shop, int movie) {
            this.price = price;
            this.shop = shop;
            this.movie = movie;
        }

        @Override
        public int compareTo(RentedMovie other) {
            if (this.price != other.price) {
                return Integer.compare(this.price, other.price);
            }
            if (this.shop != other.shop) {
                return Integer.compare(this.shop, other.shop);
            }
            return Integer.compare(this.movie, other.movie);
        }
    }

    public MovieRentingSystem(int n, int[][] entries) {
        movieHeaps = new HashMap<>();
        priceMap = new HashMap<>();
        rentedSet = new HashSet<>();
        rentedHeap = new PriorityQueue<>();

        // Initialize data structures
        for (int[] entry : entries) {
            int shop = entry[0];
            int movie = entry[1];
            int price = entry[2];

            String key = shop + "," + movie;

            // Initialize heap for this movie if needed
            movieHeaps.putIfAbsent(movie, new PriorityQueue<>());

            // Add to movie-specific heap
            movieHeaps.get(movie).offer(new ShopPrice(price, shop));

            // Store price for quick lookup
            priceMap.put(key, price);
        }
    }

    public List<Integer> search(int movie) {
        List<Integer> result = new ArrayList<>();
        List<ShopPrice> tempPopped = new ArrayList<>();
        PriorityQueue<ShopPrice> heap = movieHeaps.get(movie);

        if (heap == null) return result;

        // Keep searching until we find 5 available copies or heap is empty
        while (!heap.isEmpty() && result.size() < 5) {
            ShopPrice sp = heap.poll();
            tempPopped.add(sp);

            // Check if this copy is currently rented
            String key = sp.shop + "," + movie;
            if (!rentedSet.contains(key)) {
                result.add(sp.shop);
            }
        }

        // Push back all popped items to the heap
        for (ShopPrice sp : tempPopped) {
            heap.offer(sp);
        }

        return result;
    }

    public void rent(int shop, int movie) {
        String key = shop + "," + movie;

        // Mark as rented
        rentedSet.add(key);

        // Add to rented heap for reporting
        int price = priceMap.get(key);
        rentedHeap.offer(new RentedMovie(price, shop, movie));
    }

    public void drop(int shop, int movie) {
        String key = shop + "," + movie;

        // Remove from rented set
        rentedSet.remove(key);

        // Note: We don't remove from rentedHeap here - lazy deletion in report()
    }

    public List<List<Integer>> report() {
        List<List<Integer>> result = new ArrayList<>();
        List<RentedMovie> tempPopped = new ArrayList<>();

        // Keep searching until we find 5 valid rented movies
        while (!rentedHeap.isEmpty() && result.size() < 5) {
            RentedMovie rm = rentedHeap.poll();
            String key = rm.shop + "," + rm.movie;

            // Check if still rented (lazy deletion for drops)
            if (rentedSet.contains(key)) {
                result.add(Arrays.asList(rm.shop, rm.movie, rm.price));
                tempPopped.add(rm);
            }
        }

        // Push back valid rented movies
        for (RentedMovie rm : tempPopped) {
            rentedHeap.offer(rm);
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- `search(movie)`: O(k log n) where k=5 and n is the number of copies of that movie. We pop up to k items from the heap, check if rented, and push them back.
- `rent(shop, movie)`: O(log n) to push into the rented heap.
- `drop(shop, movie)`: O(1) to remove from the rented set.
- `report()`: O(k log n) where k=5. We pop from rented heap until we find k valid rented movies.

**Space Complexity:** O(n) where n is the total number of movie entries. We store each movie in the price map, in movie-specific heaps, and potentially in the rented heap.

The key efficiency gains come from:

1. Using heaps to maintain sorted order without full sorting
2. Using lazy deletion to avoid expensive heap removal operations
3. Using hash maps/sets for O(1) lookups

## Common Mistakes

1. **Forgetting to handle movies that don't exist in search:** Always check if the movie exists in your data structure before trying to access its heap. Return an empty list if the movie isn't in the system.

2. **Not implementing lazy deletion correctly:** When popping from heaps, you must check if the item is still valid (not rented for search, still rented for report). Failing to do this returns incorrect results.

3. **Incorrect sorting order:** For the report, movies must be sorted by price, then shop, then movie ID. Getting this order wrong fails test cases.

4. **Not pushing back popped items:** In both `search()` and `report()`, we pop items to examine them but need to push valid ones back. Forgetting this "destroys" your heap over time.

5. **Using the wrong data structure for price lookups:** You need O(1) access to prices given shop and movie. A nested dictionary or composite key in a single dictionary works, but searching through all entries each time is too slow.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Multiple heaps with lazy deletion:** Similar to "Find Median from Data Stream" (LeetCode 295) where you maintain two heaps, or "Design Twitter" (LeetCode 355) where you merge feeds from multiple sources.

2. **Maintaining multiple sorted views:** Like "Stock Price Fluctuation" (LeetCode 2034) where you need both current price and historical highs/lows, or "Time Based Key-Value Store" (LeetCode 981) with timestamp-based lookups.

3. **System design with efficient updates:** Similar to "Design Underground System" (LeetCode 1396) or "Design Browser History" (LeetCode 1472) where you need to support multiple query types efficiently.

The core pattern is: when you need to maintain data in multiple sorted orders with frequent updates, use heaps with lazy deletion and hash maps for quick lookups.

## Key Takeaways

1. **Use the right data structure for each operation:** Heaps for maintaining min/max with updates, hash maps for O(1) lookups, sets for membership testing.

2. **Lazy deletion is powerful:** When you can't efficiently remove from a heap, mark items as invalid and skip them when they bubble to the top. This turns O(n) removal into O(log n) with cleanup amortized over operations.

3. **Maintain multiple views of the same data:** When different operations need data sorted differently, maintain separate data structures optimized for each operation, with mechanisms to keep them synchronized.

4. **Always consider what happens when data is invalid:** In `search()`, rented movies are invalid. In `report()`, returned movies are invalid. Design your data structures to handle these state changes efficiently.

[Practice this problem on CodeJeet](/problem/design-movie-rental-system)
