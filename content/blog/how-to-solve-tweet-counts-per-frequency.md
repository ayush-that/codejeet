---
title: "How to Solve Tweet Counts Per Frequency — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Tweet Counts Per Frequency. Medium difficulty, 45.9% acceptance rate. Topics: Hash Table, String, Binary Search, Design, Sorting."
date: "2028-12-03"
category: "dsa-patterns"
tags: ["tweet-counts-per-frequency", "hash-table", "string", "binary-search", "medium"]
---

# How to Solve Tweet Counts Per Frequency

This problem asks you to design a system that records tweet timestamps and then queries how many tweets fall into specific time intervals (chunks) based on a frequency (minute, hour, or day). The challenge lies in efficiently handling both record operations (which can come in any order) and range queries that need to count tweets within precise time boundaries. What makes this interesting is balancing insertion efficiency with query performance while handling the tricky edge cases around time interval boundaries.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Operations:**

1. `recordTweet("tweet1", 0)` - Tweet at time 0
2. `recordTweet("tweet2", 59)` - Tweet at time 59
3. `recordTweet("tweet3", 60)` - Tweet at time 60
4. `getTweetCountsPerFrequency("minute", "tweet1", 0, 60)` - Count tweets per minute from 0 to 60

**Step-by-step reasoning:**

- After operations 1-3, we have tweets at times: 0, 59, 60
- Query: frequency="minute", startTime=0, endTime=60
- Minute frequency means 60-second chunks
- We need to divide [0, 60] into chunks:
  - Chunk 1: [0, 59] - contains times 0 and 59 → 2 tweets
  - Chunk 2: [60, 60] - contains time 60 → 1 tweet
- Result should be: [2, 1]

**Key insight:** The end time is inclusive, so time 60 belongs to the chunk starting at 60, not the previous chunk. This boundary handling is crucial.

## Brute Force Approach

A naive approach would store all tweet timestamps in a list for each tweet name. For each query:

1. Get all timestamps for the given tweet name
2. For each chunk in the query range:
   - Count how many timestamps fall within [chunk_start, chunk_end]
   - Add this count to the result list

**Why this fails:**

- Each query requires scanning ALL timestamps for that tweet name
- With many tweets and frequent queries, this becomes O(n × q) where n is number of tweets and q is number of queries
- The problem constraints require efficient range counting, which linear scanning doesn't provide

## Optimized Approach

The key insight is that we need to efficiently:

1. Store tweets in sorted order (for binary search)
2. Quickly count how many tweets fall within a time range [L, R]

**Optimal data structure choice:**

- Store tweets in sorted lists (or maintain sorted order during insertion)
- Use **binary search** to find the first index ≥ L and first index > R
- The count is simply: `count = index_of_first_gt_R - index_of_first_ge_L`

**Why binary search works:**

- If timestamps are sorted, we can use `bisect_left` to find the first timestamp ≥ L
- Use `bisect_right` to find the first timestamp > R (or use `bisect_left(R + 1)`)
- The difference gives us the count of timestamps in [L, R] inclusive

**Handling frequencies:**

- For each frequency, calculate chunk size in seconds:
  - minute = 60 seconds
  - hour = 3600 seconds
  - day = 86400 seconds
- Iterate through chunks from startTime to endTime:
  - For each chunk, calculate chunk_start and chunk_end
  - Use binary search to count tweets in [chunk_start, min(chunk_end, endTime)]
  - Add count to result

## Optimal Solution

<div class="code-group">

```python
class TweetCounts:
    # Time: O(1) for initialization
    # Space: O(n) where n is total number of tweets recorded
    def __init__(self):
        # Dictionary to store tweet name -> list of timestamps
        self.tweets = {}
        # Frequency mapping to seconds
        self.freq_map = {
            "minute": 60,
            "hour": 3600,
            "day": 86400
        }

    # Time: O(log n) for binary search insertion to maintain sorted order
    # Space: O(1) additional space
    def recordTweet(self, tweetName: str, time: int) -> None:
        # If tweet name not seen before, initialize empty list
        if tweetName not in self.tweets:
            self.tweets[tweetName] = []

        # Use bisect to insert while maintaining sorted order
        # This ensures O(log n) insertion instead of O(n) for list insertion
        import bisect
        bisect.insort(self.tweets[tweetName], time)

    # Time: O(k * log n) where k is number of chunks, n is number of tweets
    # Space: O(k) for the result list
    def getTweetCountsPerFrequency(self, freq: str, tweetName: str, startTime: int, endTime: int) -> List[int]:
        # If tweet name doesn't exist, return empty list
        if tweetName not in self.tweets:
            return []

        # Get chunk size in seconds for the given frequency
        chunk_size = self.freq_map[freq]

        # Initialize result list
        result = []

        # Get the sorted list of timestamps for this tweet
        timestamps = self.tweets[tweetName]

        # Import bisect for binary search operations
        import bisect

        # Iterate through chunks from startTime to endTime
        chunk_start = startTime
        while chunk_start <= endTime:
            # Calculate chunk end (inclusive)
            # Min with endTime ensures we don't go beyond query end
            chunk_end = min(chunk_start + chunk_size - 1, endTime)

            # Use binary search to find first index >= chunk_start
            left_idx = bisect.bisect_left(timestamps, chunk_start)

            # Use binary search to find first index > chunk_end
            # We add 1 to chunk_end because bisect_left finds first >= value
            right_idx = bisect.bisect_left(timestamps, chunk_end + 1)

            # Count is difference between indices
            count = right_idx - left_idx
            result.append(count)

            # Move to next chunk
            chunk_start += chunk_size

        return result
```

```javascript
class TweetCounts {
  // Time: O(1) for initialization
  // Space: O(n) where n is total number of tweets recorded
  constructor() {
    // Map to store tweet name -> array of timestamps
    this.tweets = new Map();
    // Frequency mapping to seconds
    this.freqMap = {
      minute: 60,
      hour: 3600,
      day: 86400,
    };
  }

  // Time: O(log n) for binary search insertion
  // Space: O(1) additional space
  recordTweet(tweetName, time) {
    // If tweet name not in map, initialize empty array
    if (!this.tweets.has(tweetName)) {
      this.tweets.set(tweetName, []);
    }

    // Get the array for this tweet name
    const times = this.tweets.get(tweetName);

    // Use binary search to find insertion point
    let left = 0;
    let right = times.length;

    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (times[mid] < time) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }

    // Insert at the found position to maintain sorted order
    times.splice(left, 0, time);
  }

  // Time: O(k * log n) where k is number of chunks, n is number of tweets
  // Space: O(k) for the result array
  getTweetCountsPerFrequency(freq, tweetName, startTime, endTime) {
    // If tweet name doesn't exist, return empty array
    if (!this.tweets.has(tweetName)) {
      return [];
    }

    // Get chunk size in seconds
    const chunkSize = this.freqMap[freq];

    // Get the sorted array of timestamps
    const timestamps = this.tweets.get(tweetName);
    const result = [];

    // Helper function for binary search (lower bound)
    const lowerBound = (arr, target) => {
      let left = 0;
      let right = arr.length;

      while (left < right) {
        const mid = Math.floor((left + right) / 2);
        if (arr[mid] < target) {
          left = mid + 1;
        } else {
          right = mid;
        }
      }

      return left;
    };

    // Process each chunk
    let chunkStart = startTime;
    while (chunkStart <= endTime) {
      // Calculate chunk end (inclusive)
      const chunkEnd = Math.min(chunkStart + chunkSize - 1, endTime);

      // Find first index >= chunkStart
      const leftIdx = lowerBound(timestamps, chunkStart);

      // Find first index > chunkEnd (by searching for chunkEnd + 1)
      const rightIdx = lowerBound(timestamps, chunkEnd + 1);

      // Count is difference between indices
      result.push(rightIdx - leftIdx);

      // Move to next chunk
      chunkStart += chunkSize;
    }

    return result;
  }
}
```

```java
class TweetCounts {
    // Time: O(1) for initialization
    // Space: O(n) where n is total number of tweets recorded
    private Map<String, List<Integer>> tweets;
    private Map<String, Integer> freqMap;

    public TweetCounts() {
        tweets = new HashMap<>();
        freqMap = new HashMap<>();
        freqMap.put("minute", 60);
        freqMap.put("hour", 3600);
        freqMap.put("day", 86400);
    }

    // Time: O(log n) for binary search insertion
    // Space: O(1) additional space
    public void recordTweet(String tweetName, int time) {
        // If tweet name not in map, initialize new list
        tweets.putIfAbsent(tweetName, new ArrayList<>());

        // Get the list for this tweet name
        List<Integer> times = tweets.get(tweetName);

        // Use binary search to find insertion point
        int left = 0;
        int right = times.size();

        while (left < right) {
            int mid = left + (right - left) / 2;
            if (times.get(mid) < time) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }

        // Insert at the found position to maintain sorted order
        times.add(left, time);
    }

    // Time: O(k * log n) where k is number of chunks, n is number of tweets
    // Space: O(k) for the result list
    public List<Integer> getTweetCountsPerFrequency(String freq, String tweetName, int startTime, int endTime) {
        // If tweet name doesn't exist, return empty list
        if (!tweets.containsKey(tweetName)) {
            return new ArrayList<>();
        }

        // Get chunk size in seconds
        int chunkSize = freqMap.get(freq);

        // Get the sorted list of timestamps
        List<Integer> timestamps = tweets.get(tweetName);
        List<Integer> result = new ArrayList<>();

        // Process each chunk
        int chunkStart = startTime;
        while (chunkStart <= endTime) {
            // Calculate chunk end (inclusive)
            int chunkEnd = Math.min(chunkStart + chunkSize - 1, endTime);

            // Use binary search to find first index >= chunkStart
            int leftIdx = lowerBound(timestamps, chunkStart);

            // Use binary search to find first index > chunkEnd
            int rightIdx = lowerBound(timestamps, chunkEnd + 1);

            // Count is difference between indices
            result.add(rightIdx - leftIdx);

            // Move to next chunk
            chunkStart += chunkSize;
        }

        return result;
    }

    // Helper method for binary search (lower bound)
    // Time: O(log n)
    private int lowerBound(List<Integer> list, int target) {
        int left = 0;
        int right = list.size();

        while (left < right) {
            int mid = left + (right - left) / 2;
            if (list.get(mid) < target) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }

        return left;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- `recordTweet()`: O(log n) where n is the number of tweets for that name. We use binary search to find the insertion point.
- `getTweetCountsPerFrequency()`: O(k × log n) where k is the number of chunks and n is the number of tweets. For each chunk, we perform two binary searches.

**Space Complexity:**

- Overall: O(T) where T is the total number of tweets recorded across all tweet names.
- Queries: O(k) for storing the result list, where k is the number of chunks.

**Why this is optimal:**

- We maintain sorted order during insertion (O(log n) instead of O(n) for sorting later)
- Range counting uses binary search (O(log n)) instead of linear scan (O(n))
- The chunk iteration is unavoidable since we need to return counts per chunk

## Common Mistakes

1. **Incorrect chunk boundary handling**: Forgetting that the end time is inclusive. If chunk_end = 59 and we have a tweet at time 59, it should be counted. Solution: Use `chunk_end = min(chunk_start + chunk_size - 1, endTime)`.

2. **Not maintaining sorted order**: Inserting at the end and sorting on every query gives O(n log n) per query instead of O(log n). Solution: Use binary search insertion (`bisect.insort` in Python) or a balanced BST.

3. **Off-by-one errors in binary search**: Using `bisect_right` instead of `bisect_left` for the upper bound. Remember: `bisect_left(x)` finds first index ≥ x, so for upper bound we need `bisect_left(chunk_end + 1)`.

4. **Forgetting to handle missing tweet names**: If a tweet name hasn't been recorded, queries should return empty list, not throw an error. Always check `if tweetName not in self.tweets`.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Range Counting with Binary Search**: Similar to problems where you need to count elements in a range in a sorted array.
   - Related: [Count of Smaller Numbers After Self](https://leetcode.com/problems/count-of-smaller-numbers-after-self/) - uses similar binary search techniques
   - Related: [Find Right Interval](https://leetcode.com/problems/find-right-interval/) - uses binary search on sorted intervals

2. **Time Series Data Processing**: Problems involving partitioning time ranges into buckets.
   - Related: [Design Log Storage System](https://leetcode.com/problems/design-log-storage-system/) - similar time granularity concepts
   - Related: [My Calendar I/II/III](https://leetcode.com/problems/my-calendar-i/) - range queries on time intervals

3. **Design Problems with Multiple Operations**: Systems that need to handle both updates and queries efficiently.
   - Related: [Design Underground System](https://leetcode.com/problems/design-underground-system/) - similar pattern of recording and querying

## Key Takeaways

1. **Maintain sorted data for efficient range queries**: When you need to frequently query "how many elements in range [L, R]", keeping data sorted and using binary search is often optimal.

2. **Precompute frequency mappings**: Hardcoding values like 60, 3600, 86400 in a map makes the code cleaner and easier to extend if new frequencies are added.

3. **Pay attention to inclusive/exclusive boundaries**: Time interval problems often trip people up on whether endpoints are inclusive. Always clarify this in your reasoning during interviews.

Related problems: [Design Video Sharing Platform](/problem/design-video-sharing-platform)
