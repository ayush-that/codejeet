---
title: "How to Solve Most Popular Video Creator — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Most Popular Video Creator. Medium difficulty, 45.2% acceptance rate. Topics: Array, Hash Table, String, Sorting, Heap (Priority Queue)."
date: "2029-06-10"
category: "dsa-patterns"
tags: ["most-popular-video-creator", "array", "hash-table", "string", "medium"]
---

# How to Solve Most Popular Video Creator

This problem asks us to identify the most popular video creators based on their total view counts, and for each top creator, find their most-viewed video (with tie-breaking rules). What makes this problem interesting is the **multi-level aggregation and comparison**: we need to track total views per creator, find maximum views per creator, and handle multiple tie-breaking conditions (lexicographically smallest ID when views are equal). It's essentially a data aggregation problem with sorting and filtering logic.

## Visual Walkthrough

Let's trace through a small example:

```
creators = ["Alice", "Bob", "Alice", "Charlie", "Bob"]
ids = ["one", "two", "three", "four", "five"]
views = [5, 10, 15, 20, 10]
```

**Step 1: Calculate total views per creator**

- Alice: 5 + 15 = 20
- Bob: 10 + 10 = 20
- Charlie: 20 = 20

All three creators have 20 total views, so they're all tied for highest popularity.

**Step 2: For each creator, find their highest-viewed video**

- Alice's videos: "one" (5 views), "three" (15 views) → highest views = 15, video ID = "three"
- Bob's videos: "two" (10 views), "five" (10 views) → highest views = 10, video ID = "two" (lexicographically smaller than "five")
- Charlie's video: "four" (20 views) → highest views = 20, video ID = "four"

**Step 3: Sort results**
We need to return: `[["Alice", "three"], ["Bob", "two"], ["Charlie", "four"]]`

Notice that even though Alice and Bob have the same total views (20), we include all creators with the maximum total views. The tie-breaking for video IDs only applies when multiple videos from the same creator have the same view count.

## Brute Force Approach

A naive approach would be:

1. For each creator, scan through all videos to calculate their total views
2. Find the maximum total views across all creators
3. For each creator with that maximum, scan through their videos again to find the highest-viewed video with the smallest ID
4. Collect and return the results

This would be O(n²) time complexity because for each of n creators, we might scan through all n videos. With n up to 10⁵, this is far too slow (10¹⁰ operations).

Even if we first collect all creators and then process them, without proper data structures we'd still have inefficient lookups when grouping videos by creator.

## Optimized Approach

The key insight is that we need to **aggregate data by creator** efficiently. This screams for a **hash map (dictionary)** where the key is the creator name and the value contains:

1. Their total views (sum of all their videos' views)
2. Their maximum video views
3. The ID of their highest-viewed video (with tie-breaking)

We can process all videos in a single pass:

- For each video, update the creator's total views
- Check if this video has more views than their current maximum, or if views are equal but the ID is lexicographically smaller
- Track the overall maximum total views across all creators

After processing, we iterate through our hash map to find all creators whose total views equal the overall maximum, and collect their information.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def mostPopularCreator(creators, ids, views):
    """
    Find the most popular creators and their most viewed videos.

    Args:
        creators: List of creator names for each video
        ids: List of video IDs for each video
        views: List of view counts for each video

    Returns:
        List of [creator, video_id] pairs for most popular creators
    """
    n = len(creators)
    creator_info = {}  # creator -> [total_views, max_views, best_id]
    max_total_views = 0  # Track overall maximum total views

    # Single pass through all videos
    for i in range(n):
        creator = creators[i]
        video_id = ids[i]
        view_count = views[i]

        if creator not in creator_info:
            # Initialize for new creator
            creator_info[creator] = [view_count, view_count, video_id]
        else:
            # Update existing creator
            info = creator_info[creator]
            info[0] += view_count  # Update total views

            # Check if this video is better than current best
            if view_count > info[1] or (view_count == info[1] and video_id < info[2]):
                info[1] = view_count  # Update max views
                info[2] = video_id    # Update best video ID

        # Update overall maximum total views
        max_total_views = max(max_total_views, creator_info[creator][0])

    # Collect results for creators with maximum total views
    result = []
    for creator, info in creator_info.items():
        total_views, max_views, best_id = info
        if total_views == max_total_views:
            result.append([creator, best_id])

    return result
```

```javascript
// Time: O(n) | Space: O(n)
function mostPopularCreator(creators, ids, views) {
  /**
   * Find the most popular creators and their most viewed videos.
   *
   * @param {string[]} creators - Creator names for each video
   * @param {string[]} ids - Video IDs for each video
   * @param {number[]} views - View counts for each video
   * @return {string[][]} - [creator, video_id] pairs for most popular creators
   */
  const n = creators.length;
  const creatorInfo = new Map(); // creator -> {totalViews, maxViews, bestId}
  let maxTotalViews = 0;

  // Single pass through all videos
  for (let i = 0; i < n; i++) {
    const creator = creators[i];
    const videoId = ids[i];
    const viewCount = views[i];

    if (!creatorInfo.has(creator)) {
      // Initialize for new creator
      creatorInfo.set(creator, {
        totalViews: viewCount,
        maxViews: viewCount,
        bestId: videoId,
      });
    } else {
      // Update existing creator
      const info = creatorInfo.get(creator);
      info.totalViews += viewCount;

      // Check if this video is better than current best
      if (viewCount > info.maxViews || (viewCount === info.maxViews && videoId < info.bestId)) {
        info.maxViews = viewCount;
        info.bestId = videoId;
      }
    }

    // Update overall maximum total views
    const currentTotal = creatorInfo.get(creator).totalViews;
    maxTotalViews = Math.max(maxTotalViews, currentTotal);
  }

  // Collect results for creators with maximum total views
  const result = [];
  for (const [creator, info] of creatorInfo) {
    if (info.totalViews === maxTotalViews) {
      result.push([creator, info.bestId]);
    }
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.*;

class Solution {
    public List<List<String>> mostPopularCreator(String[] creators, String[] ids, int[] views) {
        /**
         * Find the most popular creators and their most viewed videos.
         *
         * @param creators - Creator names for each video
         * @param ids - Video IDs for each video
         * @param views - View counts for each video
         * @return List of [creator, video_id] pairs for most popular creators
         */
        int n = creators.length;
        Map<String, CreatorInfo> creatorInfo = new HashMap<>();
        long maxTotalViews = 0; // Use long to prevent overflow with large sums

        // Single pass through all videos
        for (int i = 0; i < n; i++) {
            String creator = creators[i];
            String videoId = ids[i];
            int viewCount = views[i];

            if (!creatorInfo.containsKey(creator)) {
                // Initialize for new creator
                creatorInfo.put(creator, new CreatorInfo(viewCount, viewCount, videoId));
            } else {
                // Update existing creator
                CreatorInfo info = creatorInfo.get(creator);
                info.totalViews += viewCount;

                // Check if this video is better than current best
                if (viewCount > info.maxViews ||
                    (viewCount == info.maxViews && videoId.compareTo(info.bestId) < 0)) {
                    info.maxViews = viewCount;
                    info.bestId = videoId;
                }
            }

            // Update overall maximum total views
            maxTotalViews = Math.max(maxTotalViews, creatorInfo.get(creator).totalViews);
        }

        // Collect results for creators with maximum total views
        List<List<String>> result = new ArrayList<>();
        for (Map.Entry<String, CreatorInfo> entry : creatorInfo.entrySet()) {
            CreatorInfo info = entry.getValue();
            if (info.totalViews == maxTotalViews) {
                result.add(Arrays.asList(entry.getKey(), info.bestId));
            }
        }

        return result;
    }

    // Helper class to store creator information
    class CreatorInfo {
        long totalViews;
        int maxViews;
        String bestId;

        CreatorInfo(long totalViews, int maxViews, String bestId) {
            this.totalViews = totalViews;
            this.maxViews = maxViews;
            this.bestId = bestId;
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through all n videos to populate our hash map: O(n)
- We make another pass through the hash map (at most n entries) to collect results: O(n)
- Total: O(n) + O(n) = O(n)

**Space Complexity: O(n)**

- The hash map stores at most n entries (one per unique creator)
- Each entry stores a fixed amount of data (total views, max views, best ID)
- In the worst case where all creators are unique, we store n entries: O(n)
- The result list stores at most n entries: O(n)
- Total: O(n) + O(n) = O(n)

## Common Mistakes

1. **Forgetting tie-breaking for video IDs**: When a creator has multiple videos with the same maximum views, you must return the lexicographically smallest ID. Candidates often only track the maximum view count without considering ID tie-breaking.

2. **Including only one creator when there are ties**: The problem asks for ALL creators with the maximum total views, not just one. If Alice and Bob both have 100 total views (the maximum), both should be in the result.

3. **Using integer overflow for total views**: With n up to 10⁵ and views up to 10⁵, total views could reach 10¹⁰, which exceeds 32-bit integer range (2,147,483,647). In Java, use `long` for total views to prevent overflow.

4. **Inefficient video ID comparison**: When updating the best video ID, compare lexicographically using string comparison (`<` in Python/JS, `compareTo()` in Java), not by string length or other metrics.

## When You'll See This Pattern

This problem uses **hash map aggregation with custom comparison logic**, a pattern common in many LeetCode problems:

1. **Design a Food Rating System (Medium)**: Similar structure - aggregate ratings by food, track highest rating with tie-breaking. Both require maintaining multiple pieces of information per key.

2. **Top K Frequent Elements (Medium)**: Uses hash map to count frequencies, then finds top k. This problem is like finding "top all" elements with maximum frequency.

3. **Design Underground System (Medium)**: Tracks multiple statistics (total time, count) per route, similar to tracking total views and best video per creator.

The core pattern is: when you need to group data by a key and compute aggregate statistics, reach for a hash map where values are custom objects or tuples storing multiple metrics.

## Key Takeaways

1. **Hash maps are ideal for grouping and aggregation**: When you need to collect data by key (like creator name), a hash map lets you do this in O(1) average time per operation.

2. **Process all data in one pass when possible**: We calculated total views, maximum views, and best ID simultaneously, avoiding multiple passes through the data.

3. **Pay attention to tie-breaking rules**: Interview problems often include specific tie-breaking conditions. Read carefully and implement them precisely - they're usually testing attention to detail.

Related problems: [Design Video Sharing Platform](/problem/design-video-sharing-platform), [Design a Food Rating System](/problem/design-a-food-rating-system)
