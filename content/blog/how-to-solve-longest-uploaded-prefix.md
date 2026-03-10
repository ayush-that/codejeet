---
title: "How to Solve Longest Uploaded Prefix — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Longest Uploaded Prefix. Medium difficulty, 54.8% acceptance rate. Topics: Hash Table, Binary Search, Union-Find, Design, Binary Indexed Tree."
date: "2029-06-09"
category: "dsa-patterns"
tags: ["longest-uploaded-prefix", "hash-table", "binary-search", "union-find", "medium"]
---

# How to Solve Longest Uploaded Prefix

You need to design a data structure that tracks uploaded videos numbered from 1 to n and efficiently returns the longest consecutive prefix of uploaded videos starting from 1. The challenge is handling upload operations in any order while maintaining O(1) time for both uploading and querying the longest prefix.

What makes this problem interesting is that while it appears simple, the optimal solution requires clever use of data structures to avoid linear scans. The uploads can come in any order, and we need to know immediately how far we've consecutively uploaded starting from video 1.

## Visual Walkthrough

Let's trace through an example with n = 5:

1. **Initial state**: No videos uploaded. Longest uploaded prefix = 0
2. **Upload video 3**: Videos uploaded = {3}. Longest prefix = 0 (we don't have video 1 yet)
3. **Upload video 1**: Videos uploaded = {1, 3}. Longest prefix = 1 (we have video 1)
4. **Upload video 4**: Videos uploaded = {1, 3, 4}. Longest prefix = 1 (missing video 2)
5. **Upload video 2**: Videos uploaded = {1, 2, 3, 4}. Longest prefix = 4 (we now have 1, 2, 3, 4 consecutively)
6. **Upload video 5**: Videos uploaded = {1, 2, 3, 4, 5}. Longest prefix = 5 (all videos uploaded)

The key insight: when we upload a video, we only need to update the longest prefix if the uploaded video is exactly one more than the current longest prefix. For example, when we upload video 2 while having prefix length 1, we can extend to 2. Then we check if 3 exists, then 4, etc., until we find a gap.

## Brute Force Approach

A naive approach would store uploaded videos in a set and scan from 1 upwards whenever we need the longest prefix:

1. Maintain a set of uploaded video IDs
2. When `upload()` is called, add the video to the set
3. When `longest()` is called, start from 1 and count upwards until you find a missing video

The problem with this approach is in the `longest()` method. In the worst case, if we've uploaded all videos except the last one, we'll scan through n-1 elements each time we call `longest()`. With m calls to `longest()`, this becomes O(m × n), which is too slow for large n.

## Optimized Approach

The key optimization is to maintain the current longest prefix and only update it when we upload a video that could potentially extend it. Here's the reasoning:

1. **Store uploaded videos**: We need O(1) lookup to check if a video is uploaded. A boolean array or set works well.
2. **Maintain current prefix**: Keep track of the current longest uploaded prefix.
3. **Smart updates**: When a video is uploaded:
   - Mark it as uploaded
   - If this video is exactly `current_prefix + 1`, then we can extend the prefix
   - But we might be able to extend further! After extending to `current_prefix + 1`, check if `current_prefix + 2` exists, then `current_prefix + 3`, etc., until we find a gap

The clever part is that each video is uploaded at most once, so the "chain reaction" of checking consecutive videos happens at most once per video. This gives us amortized O(1) time for uploads.

Think of it like connecting chains: when you add a link that connects to the end of the main chain, you check if it connects to other isolated links, forming a longer chain.

## Optimal Solution

We'll implement this using a boolean array to track uploaded videos and a variable to track the current longest prefix. The upload operation checks if the new video allows us to extend the prefix, and if so, keeps extending until it hits a gap.

<div class="code-group">

```python
class LUPrefix:
    # Time: O(1) for both upload() and longest() amortized
    # Space: O(n) for the uploaded array
    def __init__(self, n: int):
        # Initialize an array to track which videos are uploaded
        # Index 0 is unused since videos are 1-indexed
        self.uploaded = [False] * (n + 2)  # Extra space to avoid index errors
        self.longest_prefix = 0  # Current longest uploaded prefix

    def upload(self, video: int) -> None:
        # Mark this video as uploaded
        self.uploaded[video] = True

        # If this video is exactly one more than our current prefix,
        # we can potentially extend the prefix
        if video == self.longest_prefix + 1:
            # Keep extending the prefix as long as the next video exists
            # We use a while loop here, but each video triggers this at most once
            # So total time across all uploads is O(n)
            while self.uploaded[self.longest_prefix + 1]:
                self.longest_prefix += 1

    def longest(self) -> int:
        # Simply return the current longest prefix
        return self.longest_prefix
```

```javascript
class LUPrefix {
  // Time: O(1) for both upload() and longest() amortized
  // Space: O(n) for the uploaded array
  constructor(n) {
    // Initialize an array to track which videos are uploaded
    // Index 0 is unused since videos are 1-indexed
    this.uploaded = new Array(n + 2).fill(false); // Extra space to avoid index errors
    this.longestPrefix = 0; // Current longest uploaded prefix
  }

  upload(video) {
    // Mark this video as uploaded
    this.uploaded[video] = true;

    // If this video is exactly one more than our current prefix,
    // we can potentially extend the prefix
    if (video === this.longestPrefix + 1) {
      // Keep extending the prefix as long as the next video exists
      // We use a while loop here, but each video triggers this at most once
      // So total time across all uploads is O(n)
      while (this.uploaded[this.longestPrefix + 1]) {
        this.longestPrefix++;
      }
    }
  }

  longest() {
    // Simply return the current longest prefix
    return this.longestPrefix;
  }
}
```

```java
class LUPrefix {
    // Time: O(1) for both upload() and longest() amortized
    // Space: O(n) for the uploaded array
    private boolean[] uploaded;
    private int longestPrefix;

    public LUPrefix(int n) {
        // Initialize an array to track which videos are uploaded
        // Index 0 is unused since videos are 1-indexed
        uploaded = new boolean[n + 2]; // Extra space to avoid index errors
        longestPrefix = 0; // Current longest uploaded prefix
    }

    public void upload(int video) {
        // Mark this video as uploaded
        uploaded[video] = true;

        // If this video is exactly one more than our current prefix,
        // we can potentially extend the prefix
        if (video == longestPrefix + 1) {
            // Keep extending the prefix as long as the next video exists
            // We use a while loop here, but each video triggers this at most once
            // So total time across all uploads is O(n)
            while (uploaded[longestPrefix + 1]) {
                longestPrefix++;
            }
        }
    }

    public int longest() {
        // Simply return the current longest prefix
        return longestPrefix;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- `upload(video)`: Amortized O(1). Although we have a while loop that could theoretically scan many elements, each video can only trigger the extension of the prefix once. Over all n uploads, the total work done by all while loops combined is O(n), giving us amortized O(1) per upload.
- `longest()`: O(1) since we simply return a stored value.

**Space Complexity:** O(n) for the boolean array that tracks which videos have been uploaded. We need n+1 elements (1-indexed) plus one extra to avoid index errors when checking `uploaded[longest_prefix + 1]` at the boundary.

## Common Mistakes

1. **Linear scan in `longest()`**: The most common mistake is scanning from 1 each time `longest()` is called. This makes each call O(n) instead of O(1). Remember: we should update our answer incrementally as videos are uploaded, not recompute from scratch.

2. **Off-by-one errors with array indices**: Since videos are 1-indexed, it's easy to create an array of size n instead of n+1, leading to index out of bounds errors. Always allocate n+1 (or n+2 for safety) when dealing with 1-indexed data.

3. **Not handling the chain reaction correctly**: Some implementations only check if the uploaded video is `current_prefix + 1`, then increment by 1. But if you upload video 5 when you already have 1-4, you need to check if 6, 7, etc., also exist if they were uploaded earlier. The while loop handles this correctly.

4. **Using a set without the optimization**: A set gives O(1) lookup, but if you don't maintain the current prefix and try to find it by checking consecutive numbers in a loop during `longest()`, you're back to O(n) time per query.

## When You'll See This Pattern

This "incremental prefix tracking" pattern appears in several problems where you need to maintain information about consecutive elements as they arrive in any order:

1. **Design an Ordered Stream (LeetCode 1656)**: Similar concept of processing items and returning consecutive chunks starting from a specific point.

2. **First Missing Positive (LeetCode 41)**: While not identical, it involves finding gaps in sequences and can use similar marking techniques.

3. **Stream of integers problems**: Many problems that involve processing a stream and maintaining statistics about what's been seen often use similar incremental update techniques.

The core idea is to avoid recomputing from scratch by maintaining state that gets updated incrementally as new data arrives.

## Key Takeaways

1. **Amortized analysis matters**: The while loop in `upload()` looks like it could be O(n), but because each video only extends the prefix once in its lifetime, the total work is O(n) across all operations, making it amortized O(1).

2. **Update incrementally, not from scratch**: When you need to maintain a property that could be expensive to recompute (like finding the longest consecutive sequence), update it incrementally as new elements arrive rather than recomputing it each time.

3. **1-indexing requires careful array sizing**: When problems use 1-indexed data, remember to allocate arrays of size n+1 to avoid index errors, with potentially +1 more for boundary checks.

Related problems: [Design an Ordered Stream](/problem/design-an-ordered-stream), [Find X Value of Array II](/problem/find-x-value-of-array-ii)
