---
title: "How to Solve Design Auction System — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Design Auction System. Medium difficulty, 41.8% acceptance rate. Topics: Hash Table, Design, Heap (Priority Queue), Ordered Set."
date: "2026-02-06"
category: "dsa-patterns"
tags: ["design-auction-system", "hash-table", "design", "heap-(priority-queue)", "medium"]
---

# How to Solve Design Auction System

You need to design an auction system that manages real-time bids from multiple users. Each bid contains a `userId`, `itemId`, and `bidAmount`. The challenge is designing an efficient system that can quickly determine the highest bid for each item while handling potentially thousands of concurrent bids. What makes this interesting is balancing multiple operations: adding bids, finding current winners, and potentially removing bids.

## Visual Walkthrough

Let's trace through a concrete example:

1. **Initialize**: `AuctionSystem auction = new AuctionSystem()`

2. **Add bids**:
   - `auction.addBid(1, 100, 50)` → User 1 bids $50 on item 100
   - `auction.addBid(2, 100, 75)` → User 2 bids $75 on item 100 (higher bid)
   - `auction.addBid(3, 200, 30)` → User 3 bids $30 on item 200
   - `auction.addBid(1, 100, 90)` → User 1 increases bid to $90 on item 100

3. **Check current winners**:
   - For item 100: User 1 with $90 (highest)
   - For item 200: User 3 with $30 (only bidder)

4. **Find highest bid for an item**:
   - `auction.getCurrentWinningBid(100)` → returns 90
   - `auction.getCurrentWinningBid(200)` → returns 30

5. **Find all winners**:
   - `auction.findAllWinningBids()` → returns [(100, 90), (200, 30)]

The tricky part: when a user places multiple bids on the same item, we need to track only their highest bid, not all bids.

## Brute Force Approach

A naive approach would store all bids in a list and scan through them whenever we need to find winners:

1. **Data Structure**: `List<Bid>` where `Bid = (userId, itemId, bidAmount)`
2. **addBid**: Simply append to the list → O(1)
3. **getCurrentWinningBid**: Scan entire list, filter by itemId, find max → O(n)
4. **findAllWinningBids**: For each unique item, scan entire list → O(n × m) where m is number of items

**Why this fails**: In a real auction system with thousands of bids, scanning the entire list for every query is prohibitively slow. The `findAllWinningBids` operation becomes O(n²) in worst case.

## Optimized Approach

The key insight: we need to efficiently track the **maximum bid per item**. This suggests two complementary data structures:

1. **Per-item max tracking**: For each item, we need quick access to the highest bid. A max-heap (priority queue) gives us O(1) access to the maximum, but we need to handle bid updates carefully.

2. **Per-user per-item tracking**: When a user places multiple bids on the same item, we only care about their highest bid. We need to quickly check if a new bid from the same user is higher than their previous bid for that item.

**Solution architecture**:

- `Map<itemId, MaxHeap>`: Tracks all bids for each item in a max-heap
- `Map<userId, Map<itemId, bidAmount>>`: Tracks each user's current highest bid per item
- When adding a bid:
  - Check if user already has a higher bid for this item (skip if so)
  - Add to item's max-heap
  - Update user's bid tracking
- When querying:
  - For single item: peek at max-heap (O(1))
  - For all items: iterate through all max-heaps

**Why heaps work well**: They give us O(log n) insertion and O(1) max retrieval. The trade-off is O(n) space, but that's acceptable for tracking bids.

## Optimal Solution

<div class="code-group">

```python
import heapq
from collections import defaultdict

class AuctionSystem:
    """
    Time Complexity:
    - addBid: O(log n) where n is number of bids for that item
    - getCurrentWinningBid: O(1)
    - findAllWinningBids: O(m) where m is number of items with bids

    Space Complexity: O(n + m) where n is total bids, m is items
    """

    def __init__(self):
        # item_id -> max-heap of (-bid_amount, user_id)
        # Using negative values because Python has min-heap by default
        self.item_bids = defaultdict(list)

        # user_id -> {item_id: bid_amount}
        # Tracks each user's current highest bid per item
        self.user_bids = defaultdict(dict)

    def addBid(self, userId: int, itemId: int, bidAmount: int) -> None:
        """
        Add a bid to the system.
        If user already has a higher bid for this item, ignore the new bid.
        """
        # Check if user already has a higher or equal bid for this item
        if itemId in self.user_bids[userId] and self.user_bids[userId][itemId] >= bidAmount:
            return  # User already has a higher bid, ignore this one

        # Update user's bid for this item
        self.user_bids[userId][itemId] = bidAmount

        # Add to item's max-heap (using negative for max-heap behavior)
        heapq.heappush(self.item_bids[itemId], (-bidAmount, userId))

    def getCurrentWinningBid(self, itemId: int) -> int:
        """
        Returns the current winning bid amount for an item.
        Returns -1 if no bids exist for the item.
        """
        if itemId not in self.item_bids or not self.item_bids[itemId]:
            return -1

        # Clean up the heap: remove entries where user's current bid
        # doesn't match what's in the heap (due to later higher bids)
        heap = self.item_bids[itemId]
        while heap:
            bid_amount, user_id = heap[0]
            current_amount = -bid_amount  # Convert back to positive

            # Check if this is still the user's current bid for this item
            if (itemId in self.user_bids[user_id] and
                self.user_bids[user_id][itemId] == current_amount):
                return current_amount

            # This entry is stale (user placed a higher bid later)
            # Remove it and check next
            heapq.heappop(heap)

        # Heap is empty after cleaning
        return -1

    def findAllWinningBids(self) -> list:
        """
        Returns list of (itemId, winningBidAmount) for all items with bids.
        """
        result = []

        # Iterate through all items that have bids
        for item_id in list(self.item_bids.keys()):
            winning_bid = self.getCurrentWinningBid(item_id)
            if winning_bid != -1:
                result.append((item_id, winning_bid))

        return result
```

```javascript
class AuctionSystem {
  /**
   * Time Complexity:
   * - addBid: O(log n) where n is number of bids for that item
   * - getCurrentWinningBid: O(k log n) where k is stale entries (amortized O(log n))
   * - findAllWinningBids: O(m * k log n) where m is items
   *
   * Space Complexity: O(n + m) where n is total bids, m is items
   */
  constructor() {
    // itemId -> MaxHeap of bids {amount, userId}
    this.itemBids = new Map();

    // userId -> Map{itemId: bidAmount}
    this.userBids = new Map();
  }

  /**
   * Add a bid to the system
   * @param {number} userId - User ID
   * @param {number} itemId - Item ID
   * @param {number} bidAmount - Bid amount
   */
  addBid(userId, itemId, bidAmount) {
    // Get or create user's bid map
    if (!this.userBids.has(userId)) {
      this.userBids.set(userId, new Map());
    }
    const userItemBids = this.userBids.get(userId);

    // Check if user already has higher bid for this item
    if (userItemBids.has(itemId) && userItemBids.get(itemId) >= bidAmount) {
      return; // Ignore lower bid
    }

    // Update user's bid
    userItemBids.set(itemId, bidAmount);

    // Get or create heap for this item
    if (!this.itemBids.has(itemId)) {
      this.itemBids.set(itemId, new MaxHeap());
    }
    const heap = this.itemBids.get(itemId);

    // Add to heap
    heap.push({ amount: bidAmount, userId: userId });
  }

  /**
   * Get current winning bid for an item
   * @param {number} itemId - Item ID
   * @returns {number} Winning bid amount or -1 if no bids
   */
  getCurrentWinningBid(itemId) {
    if (!this.itemBids.has(itemId)) {
      return -1;
    }

    const heap = this.itemBids.get(itemId);

    // Clean up stale entries (where user later placed higher bid)
    while (!heap.isEmpty()) {
      const top = heap.peek();
      const userItemBids = this.userBids.get(top.userId);

      // Check if this bid is still valid
      if (userItemBids && userItemBids.get(itemId) === top.amount) {
        return top.amount;
      }

      // Stale entry, remove it
      heap.pop();
    }

    return -1; // No valid bids
  }

  /**
   * Find all winning bids
   * @returns {Array} Array of [itemId, winningBid] pairs
   */
  findAllWinningBids() {
    const result = [];

    for (const [itemId, heap] of this.itemBids.entries()) {
      const winningBid = this.getCurrentWinningBid(itemId);
      if (winningBid !== -1) {
        result.push([itemId, winningBid]);
      }
    }

    return result;
  }
}

// MaxHeap implementation for JavaScript
class MaxHeap {
  constructor() {
    this.heap = [];
  }

  push(bid) {
    this.heap.push(bid);
    this._bubbleUp(this.heap.length - 1);
  }

  pop() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();

    const top = this.heap[0];
    this.heap[0] = this.heap.pop();
    this._bubbleDown(0);
    return top;
  }

  peek() {
    return this.heap.length > 0 ? this.heap[0] : null;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  _bubbleUp(index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.heap[parent].amount >= this.heap[index].amount) break;

      [this.heap[parent], this.heap[index]] = [this.heap[index], this.heap[parent]];
      index = parent;
    }
  }

  _bubbleDown(index) {
    const length = this.heap.length;

    while (true) {
      let left = 2 * index + 1;
      let right = 2 * index + 2;
      let largest = index;

      if (left < length && this.heap[left].amount > this.heap[largest].amount) {
        largest = left;
      }

      if (right < length && this.heap[right].amount > this.heap[largest].amount) {
        largest = right;
      }

      if (largest === index) break;

      [this.heap[index], this.heap[largest]] = [this.heap[largest], this.heap[index]];
      index = largest;
    }
  }
}
```

```java
import java.util.*;

class AuctionSystem {
    /**
     * Time Complexity:
     * - addBid: O(log n) where n is number of bids for that item
     * - getCurrentWinningBid: O(k log n) where k is stale entries (amortized O(log n))
     * - findAllWinningBids: O(m * k log n) where m is items
     *
     * Space Complexity: O(n + m) where n is total bids, m is items
     */

    // itemId -> max-heap of bids (sorted by bidAmount descending)
    private Map<Integer, PriorityQueue<Bid>> itemBids;

    // userId -> Map<itemId, bidAmount>
    private Map<Integer, Map<Integer, Integer>> userBids;

    // Bid class to store bid information
    private static class Bid {
        int userId;
        int amount;

        Bid(int userId, int amount) {
            this.userId = userId;
            this.amount = amount;
        }
    }

    public AuctionSystem() {
        itemBids = new HashMap<>();
        userBids = new HashMap<>();
    }

    /**
     * Add a bid to the system
     * @param userId - User ID
     * @param itemId - Item ID
     * @param bidAmount - Bid amount
     */
    public void addBid(int userId, int itemId, int bidAmount) {
        // Get or create user's bid map
        Map<Integer, Integer> userItemBids = userBids.computeIfAbsent(
            userId, k -> new HashMap<>());

        // Check if user already has higher bid for this item
        if (userItemBids.containsKey(itemId) &&
            userItemBids.get(itemId) >= bidAmount) {
            return; // Ignore lower bid
        }

        // Update user's bid
        userItemBids.put(itemId, bidAmount);

        // Get or create max-heap for this item
        PriorityQueue<Bid> heap = itemBids.computeIfAbsent(
            itemId, k -> new PriorityQueue<>(
                (a, b) -> Integer.compare(b.amount, a.amount) // Max-heap
            ));

        // Add to heap
        heap.offer(new Bid(userId, bidAmount));
    }

    /**
     * Get current winning bid for an item
     * @param itemId - Item ID
     * @return Winning bid amount or -1 if no bids
     */
    public int getCurrentWinningBid(int itemId) {
        if (!itemBids.containsKey(itemId)) {
            return -1;
        }

        PriorityQueue<Bid> heap = itemBids.get(itemId);

        // Clean up stale entries (where user later placed higher bid)
        while (!heap.isEmpty()) {
            Bid top = heap.peek();
            Map<Integer, Integer> userItemBids = userBids.get(top.userId);

            // Check if this bid is still valid
            if (userItemBids != null &&
                userItemBids.containsKey(itemId) &&
                userItemBids.get(itemId) == top.amount) {
                return top.amount;
            }

            // Stale entry, remove it
            heap.poll();
        }

        return -1; // No valid bids
    }

    /**
     * Find all winning bids
     * @return List of [itemId, winningBid] pairs
     */
    public List<int[]> findAllWinningBids() {
        List<int[]> result = new ArrayList<>();

        for (int itemId : itemBids.keySet()) {
            int winningBid = getCurrentWinningBid(itemId);
            if (winningBid != -1) {
                result.add(new int[]{itemId, winningBid});
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**:

- `addBid`: O(log n) where n is the number of bids for that specific item. We push to a heap.
- `getCurrentWinningBid`: O(k log n) in worst case where k is the number of stale entries, but amortized O(log n) since each bid is removed at most once.
- `findAllWinningBids`: O(m × k log n) where m is number of items, but in practice closer to O(m log n) since stale entries get cleaned.

**Space Complexity**: O(n + m) where n is total bids stored across all heaps, and m is the number of items. Each bid is stored in a heap, and we also store user bid mappings.

## Common Mistakes

1. **Not handling bid updates correctly**: Simply adding every bid to a heap without checking if the user already has a higher bid leads to stale entries. The heap will contain outdated bids that need to be cleaned.

2. **Using only a single global heap**: Some candidates try to use one heap for all items, but this makes it impossible to efficiently find winners per item without scanning all bids.

3. **Forgetting to clean stale heap entries**: In `getCurrentWinningBid`, you must check if the top of heap is still valid (matches user's current bid). Otherwise, you return outdated winning bids.

4. **Not considering the user-item relationship**: Tracking only item bids without user context means you can't detect when a user's new bid replaces their old one.

## When You'll See This Pattern

This "max-per-category" pattern appears in many real-world systems:

1. **Leaderboard problems** (LeetCode 1244): Tracking top scores per player uses similar user-id mapping with heap cleanup.

2. **Top K Frequent Elements** (LeetCode 347): Uses heaps to track most frequent items, similar to tracking highest bids.

3. **Design Twitter/News Feed** (LeetCode 355): Combining user-specific data with global ranking uses similar dual-map structures.

4. **Stock price systems**: Tracking highest bid/ask prices per stock uses identical patterns with price-time priority.

## Key Takeaways

1. **Dual mapping solves multi-dimensional queries**: When you need to query by multiple keys (user + item), maintain separate maps for each dimension and keep them synchronized.

2. **Heaps with lazy deletion**: For tracking max/min values where entries become invalid, use heap with cleanup-on-read rather than immediate deletion for better performance.

3. **Real-time systems need amortized complexity**: Cleaning stale entries only when querying (lazy cleanup) is often better than maintaining perfect data at all times.

[Practice this problem on CodeJeet](/problem/design-auction-system)
