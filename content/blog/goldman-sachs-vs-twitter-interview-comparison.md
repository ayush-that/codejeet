---
title: "Goldman Sachs vs Twitter: Interview Question Comparison"
description: "Compare coding interview questions at Goldman Sachs and Twitter — difficulty levels, topic focus, and preparation strategy."
date: "2030-12-16"
category: "tips"
tags: ["goldman-sachs", "twitter", "comparison"]
---

If you're preparing for interviews at both Goldman Sachs and Twitter, you're looking at two distinct worlds of software engineering assessment. One is a financial giant where software is a critical tool for high-stakes, quantitative problems. The other is a social media platform where software _is_ the product, focused on scale, real-time interaction, and user experience. The good news is that there's significant overlap in their technical screening, allowing for efficient preparation. The key is understanding the differences in volume, emphasis, and interview style so you can allocate your study time strategically.

## Question Volume and Difficulty

The raw numbers tell a clear story about interview intensity and focus.

**Goldman Sachs (270 questions)** maintains a massive, well-documented repository of past interview questions. With 171 Medium and 48 Hard problems, their interviews are notoriously comprehensive. The high volume suggests two things: first, they have a deep bench of problems to pull from, making pure memorization futile. Second, they value breadth and the ability to handle a wide array of algorithmic challenges, often with a mathematical or optimization slant. You're likely to face multiple rounds of coding, each potentially containing more than one problem.

**Twitter (53 questions)** has a much more curated list. With 33 Medium and 12 Hard problems, the focus is on depth over sheer breadth. The lower volume doesn't mean it's easier; it means the problems are more targeted and likely more reflective of their core engineering challenges—think efficient data processing, system design fundamentals, and clean API design. You'll need to solve fewer problems, but each one will be scrutinized more heavily for optimal solutions, clean code, and scalability considerations.

In short: Goldman Sachs tests your endurance and breadth, Twitter tests your depth and engineering polish.

## Topic Overlap

Both companies heavily test the foundational data structures. **Array, String, and Hash Table** problems are the bread and butter for both. This is your highest-yield study area.

The major divergence is in their secondary focuses:

- **Goldman Sachs** places a strong emphasis on **Dynamic Programming**. This aligns with the quantitative and optimization problems common in finance (e.g., maximizing profit, minimizing risk, pathfinding in grids). You must be comfortable with both 1D and 2D DP.
- **Twitter** uniquely highlights **Design**. This doesn't just mean high-level system design (though that's crucial for senior roles), but also object-oriented design and API design for specific features. Think "Design Twitter" or "Design a rate limiter."

## Preparation Priority Matrix

Maximize your return on investment by studying in this order:

1.  **Overlap Topics (Study First):** Array, String, Hash Table. Master two-pointer techniques, sliding windows, prefix sums, and hash map indexing patterns.
2.  **Goldman-Sachs-Specific Priority:** Dynamic Programming. Start with classical problems like coin change and longest common subsequence, then move to grid-based problems.
3.  **Twitter-Specific Priority:** Design. For coding rounds, this often manifests as "Design a data structure" problems (e.g., LRU Cache, Insert Delete GetRandom O(1)).

**High-Value LeetCode Problems for Both:**

- **Two Sum (#1):** The quintessential hash table problem.
- **Merge Intervals (#56):** Tests sorting and array manipulation, common in data processing.
- **Longest Substring Without Repeating Characters (#3):** A perfect sliding window problem.
- **LRU Cache (#146):** Combines design, hash table, and linked list. Critical for Twitter, excellent for Goldman Sachs.

## Interview Format Differences

The structure of the interview day reflects their differing cultures.

**Goldman Sachs** typically uses a **multi-round "superday"** format, often virtual. You'll cycle through 3-5 back-to-back interviews (30-60 minutes each) with different engineers. Each round is likely to contain 1-2 coding problems. The questions can feel more academic or puzzle-like. Behavioral questions ("fit") are extremely important and are often a separate, dedicated round. For early-career roles, system design may be minimal or absent.

**Twitter's** process is often more streamlined for coding. You might have 2-3 technical rounds, each **45-60 minutes long and focused on a single, substantial problem**. The interviewer will expect you to code a working solution, discuss edge cases, and analyze time/space complexity in detail. The discussion will often extend into scalability: "What if the data didn't fit in memory?" or "How would this work in a distributed system?" This bridges directly into system design, which is a core component for mid-level and senior roles.

## Specific Problem Recommendations

Here are 5 problems that provide exceptional prep value for both companies.

1.  **Design HashMap (#706):** This is a fantastic warm-up. It tests fundamental understanding of hashing, collision resolution, and array/list manipulation. Implementing `put`, `get`, and `remove` cleanly is a basic skill expected everywhere.

<div class="code-group">

```python
class MyHashMap:
    def __init__(self):
        # Use a fixed-size array of buckets (lists for chaining)
        self.size = 1000
        self.buckets = [[] for _ in range(self.size)]

    def _hash(self, key):
        return key % self.size

    def put(self, key: int, value: int) -> None:
        hash_key = self._hash(key)
        bucket = self.buckets[hash_key]
        # Update if key exists, else append
        for i, (k, v) in enumerate(bucket):
            if k == key:
                bucket[i] = (key, value)
                return
        bucket.append((key, value))

    def get(self, key: int) -> int:
        hash_key = self._hash(key)
        bucket = self.buckets[hash_key]
        for k, v in bucket:
            if k == key:
                return v
        return -1

    def remove(self, key: int) -> None:
        hash_key = self._hash(key)
        bucket = self.buckets[hash_key]
        for i, (k, v) in enumerate(bucket):
            if k == key:
                del bucket[i]
                return
# Time: O(n/k) for n entries and k buckets (average O(1) with good hash) | Space: O(n)
```

```javascript
class MyHashMap {
  constructor() {
    this.size = 1000;
    this.buckets = new Array(this.size).fill(null).map(() => []);
  }

  _hash(key) {
    return key % this.size;
  }

  put(key, value) {
    const hashKey = this._hash(key);
    const bucket = this.buckets[hashKey];
    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        bucket[i][1] = value;
        return;
      }
    }
    bucket.push([key, value]);
  }

  get(key) {
    const hashKey = this._hash(key);
    const bucket = this.buckets[hashKey];
    for (const [k, v] of bucket) {
      if (k === key) return v;
    }
    return -1;
  }

  remove(key) {
    const hashKey = this._hash(key);
    const bucket = this.buckets[hashKey];
    const index = bucket.findIndex(([k, v]) => k === key);
    if (index !== -1) bucket.splice(index, 1);
  }
}
// Time: O(n/k) average | Space: O(n)
```

```java
class MyHashMap {
    private final int SIZE = 1000;
    private List<int[]>[] buckets; // Array of Lists

    public MyHashMap() {
        buckets = new ArrayList[SIZE];
        for (int i = 0; i < SIZE; i++) {
            buckets[i] = new ArrayList<>();
        }
    }

    private int _hash(int key) {
        return key % SIZE;
    }

    public void put(int key, int value) {
        int hashKey = _hash(key);
        List<int[]> bucket = buckets[hashKey];
        for (int[] pair : bucket) {
            if (pair[0] == key) {
                pair[1] = value;
                return;
            }
        }
        bucket.add(new int[]{key, value});
    }

    public int get(int key) {
        int hashKey = _hash(key);
        List<int[]> bucket = buckets[hashKey];
        for (int[] pair : bucket) {
            if (pair[0] == key) {
                return pair[1];
            }
        }
        return -1;
    }

    public void remove(int key) {
        int hashKey = _hash(key);
        List<int[]> bucket = buckets[hashKey];
        for (int i = 0; i < bucket.size(); i++) {
            if (bucket.get(i)[0] == key) {
                bucket.remove(i);
                return;
            }
        }
    }
}
// Time: O(n/k) average | Space: O(n)
```

</div>

2.  **Best Time to Buy and Sell Stock (#121):** A Goldman Sachs favorite due to its financial theme, but also a perfect test of a single-pass array algorithm (tracking min price). It's a simple problem that tests if you can identify the optimal `O(n)` solution.

3.  **Word Break (#139):** This is a classic Dynamic Programming problem. Mastering it gives you the pattern (DP over substring positions) that solves many other problems. It's highly relevant for Goldman and demonstrates algorithmic maturity for Twitter.

4.  **Find All Anagrams in a String (#438):** Excellent for testing sliding window and hash map skills simultaneously. The fixed-size window with character frequency counting is a pattern that appears in many string processing questions at both companies.

5.  **Design Twitter (#355):** While this is a full system design problem, even in a coding round you might be asked to design the core data models or APIs. Thinking about the `follow`, `unfollow`, and `getNewsFeed` operations ties together graph concepts (adjacency lists), sorting, and merging K sorted lists—all highly valuable.

## Which to Prepare for First

**Prepare for Goldman Sachs first.** Here’s the strategic reasoning: their broader question pool and emphasis on DP will force you to build a wider, more robust algorithmic foundation. If you can handle the variety and difficulty of Goldman's problems, you will have over-prepared for the core algorithmic portion of Twitter's interview. You can then layer on Twitter-specific preparation: diving deeper into the nuances of their curated problem list and shifting your mental focus towards design, scalability, and the extended discussion that follows a working solution.

By starting with the more demanding breadth of Goldman Sachs, you create a strong safety net. You then refine your skills with the targeted depth and design focus required for Twitter. This approach ensures you're not caught off-guard by a tricky DP problem from Goldman while still being able to articulate the distributed systems trade-offs Twitter interviewers love to explore.

For more company-specific insights, visit our guides for [Goldman Sachs](/company/goldman-sachs) and [Twitter](/company/twitter).
