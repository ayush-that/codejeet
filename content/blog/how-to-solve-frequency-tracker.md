---
title: "How to Solve Frequency Tracker — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Frequency Tracker. Medium difficulty, 30.9% acceptance rate. Topics: Hash Table, Design."
date: "2029-05-31"
category: "dsa-patterns"
tags: ["frequency-tracker", "hash-table", "design", "medium"]
---

# How to Solve Frequency Tracker

Designing a data structure that efficiently tracks frequencies and supports queries is a classic interview problem that tests your understanding of hash maps and frequency counting. The tricky part is maintaining two-way frequency information: we need to know both "what's the frequency of this number?" and "is there any number with this frequency?" in O(1) time.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

```
Operations: add(5), add(5), add(3), deleteOne(5), hasFrequency(2)
```

**Step 1:** `add(5)`

- Number 5's frequency goes from 0 → 1
- Frequency 1 now has one number (5)

**Step 2:** `add(5)`

- Number 5's frequency goes from 1 → 2
- Frequency 1 loses number 5, frequency 2 gains number 5

**Step 3:** `add(3)`

- Number 3's frequency goes from 0 → 1
- Frequency 1 now has two numbers (5 is gone, but 3 is added)

**Step 4:** `deleteOne(5)`

- Number 5's frequency goes from 2 → 1
- Frequency 2 loses number 5, frequency 1 gains number 5

**Step 5:** `hasFrequency(2)`

- Check if frequency 2 has any numbers
- Currently frequency 2 has no numbers (5 was removed), so return `false`

The key insight: we need **two hash maps**:

1. `num_freq`: number → its current frequency
2. `freq_count`: frequency → how many numbers have that frequency

## Brute Force Approach

A naive approach would store all numbers in a list or multiset and scan through them for queries:

- **add(number)**: Append to a list (O(1))
- **deleteOne(number)**: Find and remove one occurrence (O(n) scan)
- **hasFrequency(frequency)**: Count frequencies of all numbers (O(n) scan)

This gives O(n) time for both `deleteOne` and `hasFrequency`, which is too slow for large datasets. The problem requires efficient O(1) operations.

What makes the brute force insufficient? Every query requires scanning through potentially all stored numbers. With up to 10⁵ operations, O(n) per operation becomes O(10¹⁰) operations, which is infeasible.

## Optimized Approach

The optimal solution uses **two hash maps** to maintain bidirectional frequency information:

1. **`num_freq`**: Tracks each number's current frequency
   - Key: number, Value: frequency count

2. **`freq_count`**: Tracks how many numbers have each frequency
   - Key: frequency, Value: count of numbers with that frequency

**Why two hash maps?**

- `num_freq` alone can answer "what's number X's frequency?" but not "is there any number with frequency Y?"
- `freq_count` alone can answer frequency queries but can't update frequencies when numbers are added/removed
- Together they give us O(1) operations for all methods

**Critical update logic:**
When a number's frequency changes from `old_freq` to `new_freq`:

1. Decrement `freq_count[old_freq]` (one less number has the old frequency)
2. Increment `freq_count[new_freq]` (one more number has the new frequency)
3. Update `num_freq[number]` to `new_freq`

**Edge case handling:**

- When `freq_count[old_freq]` reaches 0, remove the key to keep the map clean
- When deleting a number that doesn't exist or has frequency 0, do nothing

## Optimal Solution

<div class="code-group">

```python
class FrequencyTracker:
    # Time: O(1) for all operations | Space: O(n) where n is unique numbers
    def __init__(self):
        # Map number -> its current frequency
        self.num_freq = {}
        # Map frequency -> count of numbers with that frequency
        self.freq_count = {}

    def add(self, number: int) -> None:
        # Get current frequency of the number (0 if not present)
        old_freq = self.num_freq.get(number, 0)
        new_freq = old_freq + 1

        # Update number's frequency
        self.num_freq[number] = new_freq

        # Update frequency counts:
        # Decrement count for old frequency (if it existed)
        if old_freq > 0:
            self.freq_count[old_freq] -= 1
            # Remove frequency from map if no numbers have it anymore
            if self.freq_count[old_freq] == 0:
                del self.freq_count[old_freq]

        # Increment count for new frequency
        self.freq_count[new_freq] = self.freq_count.get(new_freq, 0) + 1

    def deleteOne(self, number: int) -> None:
        # Only delete if the number exists and has frequency > 0
        if number not in self.num_freq or self.num_freq[number] == 0:
            return

        old_freq = self.num_freq[number]
        new_freq = old_freq - 1

        # Update number's frequency (remove if it becomes 0)
        if new_freq == 0:
            del self.num_freq[number]
        else:
            self.num_freq[number] = new_freq

        # Update frequency counts
        self.freq_count[old_freq] -= 1
        if self.freq_count[old_freq] == 0:
            del self.freq_count[old_freq]

        # Only update new_freq count if new_freq > 0
        if new_freq > 0:
            self.freq_count[new_freq] = self.freq_count.get(new_freq, 0) + 1

    def hasFrequency(self, frequency: int) -> bool:
        # Check if any number has this frequency
        return self.freq_count.get(frequency, 0) > 0
```

```javascript
class FrequencyTracker {
  // Time: O(1) for all operations | Space: O(n) where n is unique numbers
  constructor() {
    // Map number -> its current frequency
    this.numFreq = new Map();
    // Map frequency -> count of numbers with that frequency
    this.freqCount = new Map();
  }

  add(number) {
    // Get current frequency of the number (0 if not present)
    const oldFreq = this.numFreq.get(number) || 0;
    const newFreq = oldFreq + 1;

    // Update number's frequency
    this.numFreq.set(number, newFreq);

    // Update frequency counts
    if (oldFreq > 0) {
      this.freqCount.set(oldFreq, (this.freqCount.get(oldFreq) || 0) - 1);
      // Remove frequency from map if no numbers have it anymore
      if (this.freqCount.get(oldFreq) === 0) {
        this.freqCount.delete(oldFreq);
      }
    }

    // Increment count for new frequency
    this.freqCount.set(newFreq, (this.freqCount.get(newFreq) || 0) + 1);
  }

  deleteOne(number) {
    // Only delete if the number exists and has frequency > 0
    if (!this.numFreq.has(number) || this.numFreq.get(number) === 0) {
      return;
    }

    const oldFreq = this.numFreq.get(number);
    const newFreq = oldFreq - 1;

    // Update number's frequency (delete if it becomes 0)
    if (newFreq === 0) {
      this.numFreq.delete(number);
    } else {
      this.numFreq.set(number, newFreq);
    }

    // Update frequency counts for old frequency
    this.freqCount.set(oldFreq, (this.freqCount.get(oldFreq) || 0) - 1);
    if (this.freqCount.get(oldFreq) === 0) {
      this.freqCount.delete(oldFreq);
    }

    // Only update new frequency count if newFreq > 0
    if (newFreq > 0) {
      this.freqCount.set(newFreq, (this.freqCount.get(newFreq) || 0) + 1);
    }
  }

  hasFrequency(frequency) {
    // Check if any number has this frequency
    return (this.freqCount.get(frequency) || 0) > 0;
  }
}
```

```java
class FrequencyTracker {
    // Time: O(1) for all operations | Space: O(n) where n is unique numbers

    // Map number -> its current frequency
    private Map<Integer, Integer> numFreq;
    // Map frequency -> count of numbers with that frequency
    private Map<Integer, Integer> freqCount;

    public FrequencyTracker() {
        numFreq = new HashMap<>();
        freqCount = new HashMap<>();
    }

    public void add(int number) {
        // Get current frequency of the number (0 if not present)
        int oldFreq = numFreq.getOrDefault(number, 0);
        int newFreq = oldFreq + 1;

        // Update number's frequency
        numFreq.put(number, newFreq);

        // Update frequency counts
        if (oldFreq > 0) {
            freqCount.put(oldFreq, freqCount.get(oldFreq) - 1);
            // Remove frequency from map if no numbers have it anymore
            if (freqCount.get(oldFreq) == 0) {
                freqCount.remove(oldFreq);
            }
        }

        // Increment count for new frequency
        freqCount.put(newFreq, freqCount.getOrDefault(newFreq, 0) + 1);
    }

    public void deleteOne(int number) {
        // Only delete if the number exists and has frequency > 0
        if (!numFreq.containsKey(number) || numFreq.get(number) == 0) {
            return;
        }

        int oldFreq = numFreq.get(number);
        int newFreq = oldFreq - 1;

        // Update number's frequency (remove if it becomes 0)
        if (newFreq == 0) {
            numFreq.remove(number);
        } else {
            numFreq.put(number, newFreq);
        }

        // Update frequency counts for old frequency
        freqCount.put(oldFreq, freqCount.get(oldFreq) - 1);
        if (freqCount.get(oldFreq) == 0) {
            freqCount.remove(oldFreq);
        }

        // Only update new frequency count if newFreq > 0
        if (newFreq > 0) {
            freqCount.put(newFreq, freqCount.getOrDefault(newFreq, 0) + 1);
        }
    }

    public boolean hasFrequency(int frequency) {
        // Check if any number has this frequency
        return freqCount.getOrDefault(frequency, 0) > 0;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(1) for all operations

- `add()`: Constant time hash map operations
- `deleteOne()`: Constant time hash map operations
- `hasFrequency()`: Constant time hash map lookup

**Space Complexity:** O(n) where n is the number of unique numbers stored

- `num_freq` stores at most one entry per unique number
- `freq_count` stores at most one entry per unique frequency value
- In worst case, if all numbers have different frequencies, space is O(n)

## Common Mistakes

1. **Forgetting to update both hash maps**: Only tracking `num_freq` makes `hasFrequency()` O(n). Only tracking `freq_count` makes it impossible to update frequencies correctly when numbers are added/removed.

2. **Not cleaning up zero counts**: If you don't remove frequencies with count 0 from `freq_count`, `hasFrequency()` might return true for frequencies that no longer exist. Always delete map entries when their count reaches 0.

3. **Incorrect order of updates**: When changing a number's frequency, you must:
   - First decrement the old frequency count
   - Then increment the new frequency count
   - Finally update the number's frequency
     Doing these in the wrong order can cause incorrect counts.

4. **Not handling deleteOne on non-existent numbers**: Always check if a number exists and has frequency > 0 before attempting to delete it. Otherwise, you might get negative frequencies.

## When You'll See This Pattern

This "dual hash map" or "frequency of frequencies" pattern appears in several problems:

1. **LFU Cache (LeetCode 460)**: Uses similar frequency tracking to determine which item to evict when the cache is full. The frequency tracking mechanism is almost identical.

2. **Top K Frequent Elements (LeetCode 347)**: While solved differently, understanding frequency distributions is key. A variant might ask "find elements with exactly frequency K."

3. **Design Authentication Manager (LeetCode 1797)**: Similar design pattern where you need to track tokens and their expiration times, requiring efficient updates and queries.

The core pattern is: when you need to maintain and query aggregated statistics (like frequencies) while supporting efficient updates, consider maintaining both the raw data and the aggregated view.

## Key Takeaways

1. **Dual data structure pattern**: When you need to answer two types of queries efficiently (e.g., "value → frequency" and "frequency → exists?"), maintain two complementary data structures that sync with each other.

2. **Frequency distribution tracking**: Many counting problems become easier when you track not just counts, but also the distribution of those counts. This transforms O(n) scans into O(1) lookups.

3. **Clean up unused entries**: Always remove map entries when their counts reach zero. This prevents memory leaks and ensures correct query results.

[Practice this problem on CodeJeet](/problem/frequency-tracker)
