---
title: "How to Solve Time Based Key-Value Store — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Time Based Key-Value Store. Medium difficulty, 49.7% acceptance rate. Topics: Hash Table, String, Binary Search, Design."
date: "2027-01-15"
category: "dsa-patterns"
tags: ["time-based-key-value-store", "hash-table", "string", "binary-search", "medium"]
---

# How to Solve Time Based Key-Value Store

This problem asks us to design a data structure that stores key-value pairs with timestamps, then retrieves the value for a key at a specific timestamp. The tricky part is that we need to handle multiple values for the same key at different times and find the most recent value that was set at or before the given timestamp.

## Visual Walkthrough

Let's trace through an example to build intuition:

```
Operations:
set("foo", "bar", 1)
set("foo", "bar2", 4)
get("foo", 4) → "bar2"
get("foo", 5) → "bar2" (closest timestamp ≤ 5 is 4)
get("foo", 3) → "bar" (closest timestamp ≤ 3 is 1)
get("foo", 1) → "bar"
get("foo", 0) → "" (no timestamp ≤ 0)
```

Think of it like this: For key "foo", we have a timeline:

- At timestamp 1: value = "bar"
- At timestamp 4: value = "bar2"

When we ask for the value at timestamp 4, we get "bar2" (exact match). At timestamp 5, we get "bar2" (closest timestamp ≤ 5 is 4). At timestamp 3, we get "bar" (closest timestamp ≤ 3 is 1). At timestamp 0, we get empty string (no timestamp ≤ 0 exists).

## Brute Force Approach

A naive approach would store all key-value-timestamp triples in a list and scan through them for each `get` operation:

1. **Store everything in a flat list**: Each `set` operation adds a (key, value, timestamp) triple to a list.
2. **Linear search for `get`**: When retrieving, scan through all entries, find those with matching key and timestamp ≤ target, then pick the one with largest timestamp.

**Why this fails**:

- `set` is O(1) but `get` is O(n) where n is total number of entries.
- With many operations, this becomes extremely slow.
- We're not leveraging the fact that timestamps for the same key are naturally ordered.

<div class="code-group">

```python
# Time: set O(1), get O(n) | Space: O(n)
class TimeMapNaive:
    def __init__(self):
        self.data = []  # List of (key, value, timestamp)

    def set(self, key: str, value: str, timestamp: int) -> None:
        self.data.append((key, value, timestamp))

    def get(self, key: str, timestamp: int) -> str:
        result = ""
        max_time = -1

        # Linear scan through all entries
        for k, v, t in self.data:
            if k == key and t <= timestamp and t > max_time:
                result = v
                max_time = t

        return result
```

```javascript
// Time: set O(1), get O(n) | Space: O(n)
class TimeMapNaive {
  constructor() {
    this.data = []; // Array of {key, value, timestamp}
  }

  set(key, value, timestamp) {
    this.data.push({ key, value, timestamp });
  }

  get(key, timestamp) {
    let result = "";
    let maxTime = -1;

    // Linear scan through all entries
    for (const entry of this.data) {
      if (entry.key === key && entry.timestamp <= timestamp && entry.timestamp > maxTime) {
        result = entry.value;
        maxTime = entry.timestamp;
      }
    }

    return result;
  }
}
```

```java
// Time: set O(1), get O(n) | Space: O(n)
class TimeMapNaive {
    class Entry {
        String key;
        String value;
        int timestamp;

        Entry(String k, String v, int t) {
            key = k;
            value = v;
            timestamp = t;
        }
    }

    private List<Entry> data;

    public TimeMapNaive() {
        data = new ArrayList<>();
    }

    public void set(String key, String value, int timestamp) {
        data.add(new Entry(key, value, timestamp));
    }

    public String get(String key, int timestamp) {
        String result = "";
        int maxTime = -1;

        // Linear scan through all entries
        for (Entry entry : data) {
            if (entry.key.equals(key) &&
                entry.timestamp <= timestamp &&
                entry.timestamp > maxTime) {
                result = entry.value;
                maxTime = entry.timestamp;
            }
        }

        return result;
    }
}
```

</div>

## Optimized Approach

The key insight is that for each key, we need to store its values in chronological order and quickly find the largest timestamp ≤ target. This suggests:

1. **Hash map + sorted collections**: Use a hash map where each key maps to a list of (timestamp, value) pairs.
2. **Binary search**: Since `set` operations are called with strictly increasing timestamps (as per problem constraints), the lists are naturally sorted. We can use binary search to find the right timestamp in O(log n) time.

**Why this works**:

- `set`: O(1) to append to list (timestamps are increasing, so list stays sorted)
- `get`: O(log n) binary search to find the right timestamp
- We leverage the sorted nature of timestamps to avoid linear scans

**Step-by-step reasoning**:

1. When we `set(key, value, timestamp)`, append (timestamp, value) to the list for that key.
2. When we `get(key, timestamp)`, binary search the list for that key to find the largest timestamp ≤ target.
3. If found, return the corresponding value; otherwise return empty string.

## Optimal Solution

Here's the complete implementation using hash map + binary search:

<div class="code-group">

```python
# Time: set O(1), get O(log n) | Space: O(n)
class TimeMap:
    def __init__(self):
        # Hash map: key -> list of (timestamp, value) pairs
        # Since set is called with strictly increasing timestamps,
        # the list is naturally sorted by timestamp
        self.store = {}

    def set(self, key: str, value: str, timestamp: int) -> None:
        # If key doesn't exist in store, initialize with empty list
        if key not in self.store:
            self.store[key] = []

        # Append the new (timestamp, value) pair to the key's list
        # Timestamps are strictly increasing, so list stays sorted
        self.store[key].append((timestamp, value))

    def get(self, key: str, timestamp: int) -> str:
        # If key doesn't exist, return empty string
        if key not in self.store:
            return ""

        # Get the list of (timestamp, value) pairs for this key
        entries = self.store[key]

        # Binary search to find the largest timestamp ≤ target
        left, right = 0, len(entries) - 1
        result = ""

        while left <= right:
            mid = (left + right) // 2

            # Check the timestamp at mid position
            if entries[mid][0] <= timestamp:
                # This timestamp is valid (≤ target), update result
                result = entries[mid][1]
                # Search right half for potentially larger valid timestamp
                left = mid + 1
            else:
                # This timestamp is too large (> target), search left half
                right = mid - 1

        return result
```

```javascript
// Time: set O(1), get O(log n) | Space: O(n)
class TimeMap {
  constructor() {
    // Hash map: key -> array of {timestamp, value} objects
    // Since set is called with strictly increasing timestamps,
    // the array is naturally sorted by timestamp
    this.store = new Map();
  }

  set(key, value, timestamp) {
    // If key doesn't exist in store, initialize with empty array
    if (!this.store.has(key)) {
      this.store.set(key, []);
    }

    // Append the new {timestamp, value} object to the key's array
    // Timestamps are strictly increasing, so array stays sorted
    this.store.get(key).push({ timestamp, value });
  }

  get(key, timestamp) {
    // If key doesn't exist, return empty string
    if (!this.store.has(key)) {
      return "";
    }

    // Get the array of {timestamp, value} objects for this key
    const entries = this.store.get(key);

    // Binary search to find the largest timestamp ≤ target
    let left = 0;
    let right = entries.length - 1;
    let result = "";

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);

      // Check the timestamp at mid position
      if (entries[mid].timestamp <= timestamp) {
        // This timestamp is valid (≤ target), update result
        result = entries[mid].value;
        // Search right half for potentially larger valid timestamp
        left = mid + 1;
      } else {
        // This timestamp is too large (> target), search left half
        right = mid - 1;
      }
    }

    return result;
  }
}
```

```java
// Time: set O(1), get O(log n) | Space: O(n)
class TimeMap {
    // Inner class to store timestamp-value pairs
    class TimeValue {
        int timestamp;
        String value;

        TimeValue(int t, String v) {
            timestamp = t;
            value = v;
        }
    }

    // Hash map: key -> list of TimeValue objects
    // Since set is called with strictly increasing timestamps,
    // the list is naturally sorted by timestamp
    private Map<String, List<TimeValue>> store;

    public TimeMap() {
        store = new HashMap<>();
    }

    public void set(String key, String value, int timestamp) {
        // If key doesn't exist in store, initialize with empty list
        store.putIfAbsent(key, new ArrayList<>());

        // Append the new TimeValue to the key's list
        // Timestamps are strictly increasing, so list stays sorted
        store.get(key).add(new TimeValue(timestamp, value));
    }

    public String get(String key, int timestamp) {
        // If key doesn't exist, return empty string
        if (!store.containsKey(key)) {
            return "";
        }

        // Get the list of TimeValue objects for this key
        List<TimeValue> entries = store.get(key);

        // Binary search to find the largest timestamp ≤ target
        int left = 0;
        int right = entries.size() - 1;
        String result = "";

        while (left <= right) {
            int mid = left + (right - left) / 2;

            // Check the timestamp at mid position
            if (entries.get(mid).timestamp <= timestamp) {
                // This timestamp is valid (≤ target), update result
                result = entries.get(mid).value;
                // Search right half for potentially larger valid timestamp
                left = mid + 1;
            } else {
                // This timestamp is too large (> target), search left half
                right = mid - 1;
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**:

- `set(key, value, timestamp)`: O(1) average case. We simply append to a list (or create a new list if the key doesn't exist).
- `get(key, timestamp)`: O(log n) where n is the number of entries for that specific key. We perform binary search on the sorted list of timestamps for that key.

**Space Complexity**: O(n) where n is the total number of `set` operations. We store every (timestamp, value) pair in our data structure.

**Important note**: The problem states that all timestamps passed to `set` are strictly increasing. This guarantee is crucial because:

1. It ensures the lists remain sorted without needing to sort them explicitly.
2. It allows us to use binary search efficiently.
3. It makes the append operation O(1) amortized.

## Common Mistakes

1. **Forgetting to handle missing keys**: When a key doesn't exist in the store, `get` should return an empty string. Always check if the key exists before accessing its list.

2. **Incorrect binary search implementation**: The most common error is using the wrong comparison or update logic. Remember:
   - We want the largest timestamp ≤ target
   - When `entries[mid].timestamp <= timestamp`, we update result and search right (for potentially larger valid timestamps)
   - When `entries[mid].timestamp > timestamp`, we search left

3. **Assuming timestamps are sorted globally**: The problem says timestamps are strictly increasing for each `set` call, but this doesn't mean all timestamps across all keys are sorted. Each key has its own timeline.

4. **Using linear search instead of binary search**: Even with the hash map organization, some candidates still use linear search through the list for a key. Remember: with sorted data, binary search is your friend!

## When You'll See This Pattern

This "hash map + binary search on sorted values" pattern appears in several time-series or versioned data problems:

1. **Stock Price Fluctuation (LeetCode 2034)**: Similar concept of tracking values over time and retrieving values at specific timestamps.

2. **Snapshot Array (LeetCode 1146)**: Maintains multiple versions of an array, requiring efficient retrieval of values at specific snapshots.

3. **Search in Rotated Sorted Array (LeetCode 33)**: While not exactly the same, it reinforces the binary search pattern on sorted data with a twist.

The core pattern is: **When you need to store time-ordered data and query for the closest previous point in time, combine a hash map (for O(1) key access) with binary search (for O(log n) time lookup)**.

## Key Takeaways

1. **Hash map + sorted list + binary search** is a powerful pattern for time-based data. The hash map gives O(1) access to data for a specific key, and binary search on the sorted timestamps gives O(log n) retrieval.

2. **Always check problem constraints**: The "strictly increasing timestamps" constraint is what makes the simple append + binary search approach work. Without it, we'd need a more complex data structure.

3. **Binary search variations matter**: This isn't a standard "find exact match" binary search. We're finding the largest value ≤ target. Practice recognizing and implementing these variations.

Related problems: [Stock Price Fluctuation](/problem/stock-price-fluctuation)
