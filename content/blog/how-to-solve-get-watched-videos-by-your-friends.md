---
title: "How to Solve Get Watched Videos by Your Friends — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Get Watched Videos by Your Friends. Medium difficulty, 52.1% acceptance rate. Topics: Array, Hash Table, Breadth-First Search, Graph Theory, Sorting."
date: "2028-11-23"
category: "dsa-patterns"
tags:
  ["get-watched-videos-by-your-friends", "array", "hash-table", "breadth-first-search", "medium"]
---

# How to Solve Get Watched Videos by Your Friends

This problem asks us to find videos watched by friends at a specific social distance from a given person. The tricky part is that we need to navigate a friendship graph, collect videos from friends at exactly level `k`, then sort them by frequency and lexicographically. This combines BFS graph traversal with frequency counting and custom sorting.

## Visual Walkthrough

Let's trace through a concrete example:

```
n = 4
watchedVideos = [["A","B"], ["C"], ["B","C"], ["A"]]
friends = [[1,2], [0,3], [0], [1]]
id = 0
level = 1
```

**Step 1: Find friends at level 1 from person 0**

- Start BFS from person 0
- Level 0: Person 0 (distance 0)
- Level 1: Friends of person 0 are persons 1 and 2 (distance 1)
- We want exactly level 1, so persons 1 and 2 are our target friends

**Step 2: Collect videos from persons 1 and 2**

- Person 1 watches: ["C"]
- Person 2 watches: ["B","C"]
- All videos: ["C", "B", "C"]

**Step 3: Count frequencies**

- "B": appears 1 time
- "C": appears 2 times

**Step 4: Sort by frequency, then alphabetically**

- First by count: "B" (1), "C" (2)
- Same frequency? No, so final order: ["B","C"]

The result is `["B","C"]` because "B" appears once and "C" appears twice, but we sort by frequency first (ascending), so "B" comes before "C".

## Brute Force Approach

A naive approach might try to find all friends recursively without tracking distances properly, or might collect videos from all friends at all levels and then try to filter. Here's what that might look like:

1. Recursively explore all friends starting from `id`
2. Keep track of visited people but not distances
3. Collect videos from everyone we encounter
4. Try to somehow filter for level `k` videos

The problem with this approach is that it doesn't properly handle the "exactly level k" requirement. Without BFS or careful distance tracking, we might include videos from friends at the wrong distance level. Even if we track distances recursively, we'd need to ensure we don't revisit nodes in cycles, which makes the implementation complex and error-prone.

## Optimized Approach

The key insight is that this is a **graph traversal problem with a specific distance constraint**. We need to:

1. Use **BFS** to find friends exactly `k` steps away (BFS naturally explores level by level)
2. Use a **queue** to process people level by level
3. Track **visited nodes** to avoid cycles and infinite loops
4. Use a **frequency counter** (hash map) to count video occurrences
5. **Sort** the results by frequency first, then alphabetically

Why BFS instead of DFS? BFS explores all nodes at distance d before moving to distance d+1, making it perfect for finding nodes at a specific distance. DFS would require extra bookkeeping to track distances.

The algorithm:

1. Initialize BFS queue with starting person, visited set, and current level = 0
2. While queue is not empty and we haven't reached level k:
   - Process all nodes at current level
   - For each node, add its unvisited friends to next level
3. When we reach level k, collect videos from all people at that level
4. Count frequencies of each video
5. Sort videos by (frequency, video_name)

## Optimal Solution

<div class="code-group">

```python
# Time: O(n + m + v log v) where n = number of people, m = number of friendships,
#       v = number of videos at level k
# Space: O(n + v) for BFS queue, visited set, and frequency map
from collections import deque, defaultdict
from typing import List

def watchedVideosByFriends(watchedVideos: List[List[str]],
                          friends: List[List[int]],
                          id: int,
                          level: int) -> List[str]:
    """
    Find videos watched by friends at exactly 'level' distance from person 'id'.
    Return videos sorted by frequency (ascending) then alphabetically.
    """
    n = len(friends)

    # Step 1: BFS to find friends at exactly 'level' distance
    queue = deque([id])
    visited = set([id])
    current_level = 0

    # Continue BFS until we reach the desired level
    while queue and current_level < level:
        # Process all nodes at current level
        level_size = len(queue)
        for _ in range(level_size):
            person = queue.popleft()

            # Add unvisited friends to queue for next level
            for friend in friends[person]:
                if friend not in visited:
                    visited.add(friend)
                    queue.append(friend)

        current_level += 1

    # Step 2: Collect videos from friends at target level
    # At this point, queue contains all people at exactly 'level' distance
    video_count = defaultdict(int)

    for person in queue:
        # Count each video watched by this person
        for video in watchedVideos[person]:
            video_count[video] += 1

    # Step 3: Sort videos by frequency then alphabetically
    # Convert to list of (video, count) tuples for sorting
    video_items = list(video_count.items())

    # Sort by count (ascending), then by video name (ascending)
    video_items.sort(key=lambda x: (x[1], x[0]))

    # Extract just the video names in sorted order
    return [video for video, _ in video_items]
```

```javascript
// Time: O(n + m + v log v) where n = number of people, m = number of friendships,
//       v = number of videos at level k
// Space: O(n + v) for BFS queue, visited set, and frequency map
/**
 * @param {string[][]} watchedVideos
 * @param {number[][]} friends
 * @param {number} id
 * @param {number} level
 * @return {string[]}
 */
function watchedVideosByFriends(watchedVideos, friends, id, level) {
  const n = friends.length;

  // Step 1: BFS to find friends at exactly 'level' distance
  const queue = [id];
  const visited = new Set([id]);
  let currentLevel = 0;

  // Continue BFS until we reach the desired level
  while (queue.length > 0 && currentLevel < level) {
    // Process all nodes at current level
    const levelSize = queue.length;
    for (let i = 0; i < levelSize; i++) {
      const person = queue.shift();

      // Add unvisited friends to queue for next level
      for (const friend of friends[person]) {
        if (!visited.has(friend)) {
          visited.add(friend);
          queue.push(friend);
        }
      }
    }
    currentLevel++;
  }

  // Step 2: Collect videos from friends at target level
  // Queue now contains all people at exactly 'level' distance
  const videoCount = new Map();

  for (const person of queue) {
    // Count each video watched by this person
    for (const video of watchedVideos[person]) {
      videoCount.set(video, (videoCount.get(video) || 0) + 1);
    }
  }

  // Step 3: Sort videos by frequency then alphabetically
  // Convert to array of [video, count] pairs for sorting
  const videoItems = Array.from(videoCount.entries());

  // Sort by count (ascending), then by video name (ascending)
  videoItems.sort((a, b) => {
    if (a[1] !== b[1]) {
      return a[1] - b[1]; // Sort by frequency
    }
    return a[0].localeCompare(b[0]); // Sort alphabetically
  });

  // Extract just the video names in sorted order
  return videoItems.map((item) => item[0]);
}
```

```java
// Time: O(n + m + v log v) where n = number of people, m = number of friendships,
//       v = number of videos at level k
// Space: O(n + v) for BFS queue, visited set, and frequency map
import java.util.*;

class Solution {
    public List<String> watchedVideosByFriends(List<List<String>> watchedVideos,
                                               int[][] friends,
                                               int id,
                                               int level) {
        int n = friends.length;

        // Step 1: BFS to find friends at exactly 'level' distance
        Queue<Integer> queue = new LinkedList<>();
        boolean[] visited = new boolean[n];
        queue.offer(id);
        visited[id] = true;
        int currentLevel = 0;

        // Continue BFS until we reach the desired level
        while (!queue.isEmpty() && currentLevel < level) {
            // Process all nodes at current level
            int levelSize = queue.size();
            for (int i = 0; i < levelSize; i++) {
                int person = queue.poll();

                // Add unvisited friends to queue for next level
                for (int friend : friends[person]) {
                    if (!visited[friend]) {
                        visited[friend] = true;
                        queue.offer(friend);
                    }
                }
            }
            currentLevel++;
        }

        // Step 2: Collect videos from friends at target level
        // Queue now contains all people at exactly 'level' distance
        Map<String, Integer> videoCount = new HashMap<>();

        for (int person : queue) {
            // Count each video watched by this person
            for (String video : watchedVideos.get(person)) {
                videoCount.put(video, videoCount.getOrDefault(video, 0) + 1);
            }
        }

        // Step 3: Sort videos by frequency then alphabetically
        // Convert to list for sorting
        List<Map.Entry<String, Integer>> videoItems = new ArrayList<>(videoCount.entrySet());

        // Sort by count (ascending), then by video name (ascending)
        videoItems.sort((a, b) -> {
            if (!a.getValue().equals(b.getValue())) {
                return a.getValue() - b.getValue();  // Sort by frequency
            }
            return a.getKey().compareTo(b.getKey());  // Sort alphabetically
        });

        // Extract just the video names in sorted order
        List<String> result = new ArrayList<>();
        for (Map.Entry<String, Integer> entry : videoItems) {
            result.add(entry.getKey());
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- **BFS traversal**: O(n + m) where n is number of people and m is total friendships (each person and friendship is processed once)
- **Video collection**: O(v) where v is total videos watched by friends at level k
- **Sorting**: O(v log v) where v is number of unique videos at level k
- **Total**: O(n + m + v log v)

**Space Complexity:**

- **BFS queue**: O(n) in worst case
- **Visited set**: O(n)
- **Frequency map**: O(v) where v is number of unique videos
- **Total**: O(n + v)

## Common Mistakes

1. **Not tracking visited nodes**: Forgetting to mark nodes as visited leads to infinite loops in cyclic friendship graphs. Always use a visited set/array in BFS.

2. **Incorrect level tracking**: Using DFS instead of BFS, or not properly tracking when we've reached the target level. BFS processes level by level naturally.

3. **Wrong sorting order**: Sorting by frequency descending instead of ascending, or forgetting the secondary alphabetical sort. Read the problem carefully: "return the list of videos sorted by their frequencies from lowest to highest... with the lexicographical order."

4. **Including starting person's videos**: When level = 0, the result should be the starting person's videos. Some implementations incorrectly return empty list for level 0.

5. **Not handling duplicate videos per person**: If a person watches the same video multiple times (though problem states "list" not "multiset"), our solution counts each occurrence. Check problem constraints carefully.

## When You'll See This Pattern

This problem combines several common patterns:

1. **BFS for level/distance-based graph traversal**: Similar to "Binary Tree Level Order Traversal" (LeetCode 102) but on a general graph. Also seen in "Rotting Oranges" (LeetCode 994) where we need to track time/distance.

2. **Frequency counting with custom sorting**: Like "Top K Frequent Elements" (LeetCode 347) but with additional alphabetical sorting. Also similar to "Sort Characters By Frequency" (LeetCode 451).

3. **Social network analysis**: Problems involving friend networks, degrees of separation, or influence propagation often use BFS on graphs.

Related problems:

- **LeetCode 133: Clone Graph** - BFS traversal of graph with node copying
- **LeetCode 127: Word Ladder** - BFS to find shortest transformation sequence
- **LeetCode 692: Top K Frequent Words** - Frequency counting with custom sorting

## Key Takeaways

1. **BFS is ideal for finding nodes at specific distances** in unweighted graphs. It explores level by level, making distance tracking natural.

2. **Always track visited nodes in graph traversal** to avoid infinite loops, especially with bidirectional friendships.

3. **Complex sorting requirements** often need multi-key sorts. Remember that Python's `sort(key=lambda x: (x[1], x[0]))` and similar constructs in other languages handle this elegantly.

4. **Break complex problems into steps**: 1) Find target friends (BFS), 2) Collect data (frequency counting), 3) Process results (sorting). Tackle each step independently.

[Practice this problem on CodeJeet](/problem/get-watched-videos-by-your-friends)
