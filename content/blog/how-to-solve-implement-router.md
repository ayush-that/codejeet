---
title: "How to Solve Implement Router — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Implement Router. Medium difficulty, 39.1% acceptance rate. Topics: Array, Hash Table, Binary Search, Design, Queue."
date: "2027-08-23"
category: "dsa-patterns"
tags: ["implement-router", "array", "hash-table", "binary-search", "medium"]
---

## How to Solve "Implement Router"

This problem asks you to design a router data structure that can efficiently manage network packets with source, destination, and timestamp attributes. The router needs to handle two operations: adding incoming packets and querying packets within a time range. What makes this tricky is that packets arrive out of order, and you need to support efficient range queries on timestamps while maintaining packet uniqueness.

## Visual Walkthrough

Let's trace through a small example:

**Operations:**

1. `addPacket(1, 2, 100)` - Packet from source 1 to destination 2 at time 100
2. `addPacket(3, 4, 50)` - Packet from source 3 to destination 4 at time 50 (out of order!)
3. `addPacket(1, 2, 150)` - Another packet from source 1 to destination 2
4. `getPackets(75, 125)` - Get all packets between time 75 and 125

**Step-by-step:**

- After operation 1: We store packet (1,2,100) in some data structure
- After operation 2: We store packet (3,4,50) - note it has earlier timestamp but arrived later
- After operation 3: We store packet (1,2,150) - same source/destination as first but different time
- Operation 4: We need to find all packets with timestamp between 75 and 125

The challenge: We need to quickly find packets in a time range, but packets don't arrive sorted by time. A simple array would require O(n) scanning for each query.

## Brute Force Approach

The most straightforward solution is to store all packets in an unsorted list or array. For each query, we scan through all packets and check if their timestamp falls within the range.

**Why this fails:**

- `addPacket`: O(1) - just append to list
- `getPackets`: O(n) - must check every packet
- If we have m queries and n packets, total time becomes O(m × n), which is too slow for large inputs
- No handling of duplicate packets (same source, destination, and timestamp)

The brute force doesn't scale because each query requires a full scan of all packets, even when we only need a small subset.

## Optimized Approach

The key insight is that we need to support two operations efficiently:

1. **Insertion** of packets (possibly out of order)
2. **Range queries** on timestamps

This is a classic use case for a **balanced binary search tree** or **sorted data structure** that maintains packets in timestamp order. However, we also need to handle duplicates and ensure O(log n) operations.

**Step-by-step reasoning:**

1. **Data Structure Choice**: We need something that keeps packets sorted by timestamp. Options include:
   - **Sorted list/array**: Insertion is O(n) due to shifting
   - **Binary Search Tree**: Insertion and query are O(log n) average case
   - **TreeMap/SortedDict**: Built-in sorted dictionary with O(log n) operations

2. **Handling Duplicates**: The problem states packets are unique by (source, destination, timestamp). We need to check for duplicates before insertion.

3. **Efficient Range Queries**: Once packets are sorted by timestamp, we can use binary search to find the start and end of our range in O(log n) time.

4. **Implementation Strategy**:
   - Use a dictionary/map to track seen packets for O(1) duplicate checking
   - Use a sorted data structure (like Python's `SortedList` or Java's `TreeMap`) to store packets sorted by timestamp
   - For queries, find the lower and upper bounds in the sorted structure

## Optimal Solution

We'll use a combination of a hash set for duplicate detection and a sorted list for efficient range queries. In practice, we can use:

- Python: `SortedList` from `sortedcontainers` library (commonly allowed in interviews)
- JavaScript: Maintain a sorted array and use binary search for insertion
- Java: Use `TreeMap<Integer, List<Packet>>` to store packets grouped by timestamp

<div class="code-group">

```python
from sortedcontainers import SortedList
from bisect import bisect_left, bisect_right

class Packet:
    def __init__(self, source, destination, timestamp):
        self.source = source
        self.destination = destination
        self.timestamp = timestamp

    def __hash__(self):
        # Hash based on all three attributes for duplicate detection
        return hash((self.source, self.destination, self.timestamp))

    def __eq__(self, other):
        # Equality check for duplicate detection
        return (self.source == other.source and
                self.destination == other.destination and
                self.timestamp == other.timestamp)

class Router:
    def __init__(self):
        # Time: O(1) | Space: O(1)
        self.packets_set = set()  # For O(1) duplicate checking
        self.packets_sorted = SortedList(key=lambda x: x.timestamp)  # For sorted storage by timestamp

    def addPacket(self, source: int, destination: int, timestamp: int) -> None:
        # Time: O(log n) | Space: O(1)
        # Step 1: Create packet object
        packet = Packet(source, destination, timestamp)

        # Step 2: Check if packet already exists
        if packet in self.packets_set:
            return  # Duplicate packet, ignore

        # Step 3: Add to set for duplicate checking
        self.packets_set.add(packet)

        # Step 4: Add to sorted list (maintains order by timestamp)
        self.packets_sorted.add(packet)

    def getPackets(self, startTime: int, endTime: int) -> List[List[int]]:
        # Time: O(log n + k) where k is number of packets in range
        # Space: O(k) for the result list

        result = []

        # Step 1: Find the insertion points for startTime and endTime
        # bisect_left finds first index where timestamp >= startTime
        # bisect_right finds first index where timestamp > endTime
        start_idx = self.packets_sorted.bisect_left(Packet(0, 0, startTime), key=lambda x: x.timestamp)
        end_idx = self.packets_sorted.bisect_right(Packet(0, 0, endTime), key=lambda x: x.timestamp)

        # Step 2: Extract packets in the range [start_idx, end_idx)
        for i in range(start_idx, end_idx):
            packet = self.packets_sorted[i]
            result.append([packet.source, packet.destination, packet.timestamp])

        return result
```

```javascript
class Packet {
  constructor(source, destination, timestamp) {
    this.source = source;
    this.destination = destination;
    this.timestamp = timestamp;
  }

  // For Set comparison in JavaScript
  toString() {
    return `${this.source},${this.destination},${this.timestamp}`;
  }
}

class Router {
  constructor() {
    // Time: O(1) | Space: O(1)
    this.packetsSet = new Set(); // For O(1) duplicate checking
    this.packetsArray = []; // Sorted array of packets by timestamp
  }

  addPacket(source, destination, timestamp) {
    // Time: O(log n) for binary search + O(n) for insertion worst case
    // Space: O(1)

    // Step 1: Create packet and its string representation for Set
    const packet = new Packet(source, destination, timestamp);
    const packetKey = packet.toString();

    // Step 2: Check for duplicates
    if (this.packetsSet.has(packetKey)) {
      return;
    }

    // Step 3: Add to set
    this.packetsSet.add(packetKey);

    // Step 4: Insert into sorted array using binary search
    // Find insertion point where packet should go
    let left = 0;
    let right = this.packetsArray.length;

    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (this.packetsArray[mid].timestamp < timestamp) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }

    // Step 5: Insert at the found position
    this.packetsArray.splice(left, 0, packet);
  }

  getPackets(startTime, endTime) {
    // Time: O(log n + k) where k is packets in range
    // Space: O(k) for result array

    const result = [];

    // Step 1: Find lower bound (first packet with timestamp >= startTime)
    let left = 0;
    let right = this.packetsArray.length;

    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (this.packetsArray[mid].timestamp < startTime) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    const startIdx = left;

    // Step 2: Find upper bound (first packet with timestamp > endTime)
    left = 0;
    right = this.packetsArray.length;

    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (this.packetsArray[mid].timestamp <= endTime) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    const endIdx = left;

    // Step 3: Extract packets in range [startIdx, endIdx)
    for (let i = startIdx; i < endIdx; i++) {
      const packet = this.packetsArray[i];
      result.push([packet.source, packet.destination, packet.timestamp]);
    }

    return result;
  }
}
```

```java
import java.util.*;

class Packet {
    int source;
    int destination;
    int timestamp;

    public Packet(int source, int destination, int timestamp) {
        this.source = source;
        this.destination = destination;
        this.timestamp = timestamp;
    }

    // Override equals and hashCode for HashSet
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Packet packet = (Packet) o;
        return source == packet.source &&
               destination == packet.destination &&
               timestamp == packet.timestamp;
    }

    @Override
    public int hashCode() {
        return Objects.hash(source, destination, timestamp);
    }
}

class Router {
    // Time: O(1) | Space: O(1)
    private Set<Packet> packetsSet;
    private TreeMap<Integer, List<Packet>> packetsByTime;

    public Router() {
        packetsSet = new HashSet<>();
        packetsByTime = new TreeMap<>();
    }

    public void addPacket(int source, int destination, int timestamp) {
        // Time: O(log n) | Space: O(1)

        // Step 1: Create packet
        Packet packet = new Packet(source, destination, timestamp);

        // Step 2: Check for duplicates
        if (packetsSet.contains(packet)) {
            return;
        }

        // Step 3: Add to set
        packetsSet.add(packet);

        // Step 4: Add to TreeMap (sorted by timestamp)
        packetsByTime.putIfAbsent(timestamp, new ArrayList<>());
        packetsByTime.get(timestamp).add(packet);
    }

    public List<List<Integer>> getPackets(int startTime, int endTime) {
        // Time: O(log n + k) where k is packets in range
        // Space: O(k) for result list

        List<List<Integer>> result = new ArrayList<>();

        // Step 1: Get submap from startTime (inclusive) to endTime (inclusive)
        // subMap returns portion of map with keys from startTime to endTime
        SortedMap<Integer, List<Packet>> subMap =
            packetsByTime.subMap(startTime, true, endTime, true);

        // Step 2: Iterate through all packets in the time range
        for (List<Packet> packetList : subMap.values()) {
            for (Packet packet : packetList) {
                List<Integer> packetData = new ArrayList<>();
                packetData.add(packet.source);
                packetData.add(packet.destination);
                packetData.add(packet.timestamp);
                result.add(packetData);
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- `addPacket`: O(log n) average case
  - Duplicate check: O(1) with hash set
  - Insertion into sorted structure: O(log n) for binary search tree operations
- `getPackets`: O(log n + k) where k is number of packets in the range
  - Finding range bounds: O(log n) with binary search
  - Extracting k packets: O(k)

**Space Complexity:**

- O(n) where n is total number of unique packets
  - Hash set stores all packets: O(n)
  - Sorted structure stores all packets: O(n)
  - Query result: O(k) additional space for returned packets

## Common Mistakes

1. **Forgetting duplicate handling**: Not checking for packets with identical (source, destination, timestamp) will cause incorrect counts. Always use a hash set or similar for O(1) duplicate detection.

2. **Using linear search for queries**: Scanning all packets for each query gives O(n) per query instead of O(log n + k). Remember: when you need range queries on sorted data, binary search is your friend.

3. **Incorrect binary search bounds**: When implementing binary search manually (like in JavaScript), it's easy to get off-by-one errors. Test carefully with edge cases: empty array, single element, elements at boundaries.

4. **Not maintaining sorted order on insertion**: If you just append to an array and sort on every query, you get O(n log n) per query instead of O(log n + k). Maintain the sorted order as you insert.

## When You'll See This Pattern

This pattern of maintaining sorted data for efficient range queries appears in many problems:

1. **Time-Based Key-Value Store (LeetCode 981)**: Similar structure - store values by timestamp and retrieve values within time ranges.

2. **Data Stream as Disjoint Intervals (LeetCode 352)**: Maintain sorted intervals and efficiently add new numbers while keeping intervals merged.

3. **My Calendar I/II/III (LeetCode 729, 731, 732)**: Book time intervals while checking for overlaps, requiring sorted storage of intervals.

The core pattern is: when you need to frequently query ranges in a dataset that receives insertions, maintain the data in sorted order using balanced trees, sorted lists, or similar structures.

## Key Takeaways

1. **Range queries + insertions = sorted data structure**: When a problem requires both adding elements and querying ranges, think immediately of structures that maintain sorted order (TreeMap, SortedList, binary search tree).

2. **Duplicate handling matters**: Always check problem constraints for uniqueness requirements. Hash sets provide O(1) duplicate detection.

3. **Binary search is your friend for ranges**: Once data is sorted, finding elements in a range becomes O(log n) instead of O(n). Learn to recognize when binary search applies.

[Practice this problem on CodeJeet](/problem/implement-router)
