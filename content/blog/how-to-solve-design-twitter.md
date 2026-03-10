---
title: "How to Solve Design Twitter — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Design Twitter. Medium difficulty, 44.2% acceptance rate. Topics: Hash Table, Linked List, Design, Heap (Priority Queue)."
date: "2027-11-15"
category: "dsa-patterns"
tags: ["design-twitter", "hash-table", "linked-list", "design", "medium"]
---

# How to Solve Design Twitter

Designing Twitter is a classic system design problem simplified into a coding challenge. The tricky part is efficiently retrieving the 10 most recent tweets from a user's feed, which includes their own tweets plus tweets from everyone they follow. The challenge lies in balancing fast tweet posting with fast feed retrieval while handling follow/unfollow operations.

## Visual Walkthrough

Let's trace through a small example:

1. **Initialization**: Twitter object created
2. **postTweet(1, 101)**: User 1 posts tweet 101
3. **postTweet(2, 102)**: User 2 posts tweet 102
4. **postTweet(1, 103)**: User 1 posts tweet 103
5. **follow(1, 2)**: User 1 follows user 2
6. **getNewsFeed(1)**: Should return tweets from user 1 and user 2

Timeline after step 4:

- User 1's tweets: [103, 101] (most recent first)
- User 2's tweets: [102]

After follow(1, 2):

- User 1 follows: {2}
- User 1's feed sources: {1, 2}

getNewsFeed(1) needs to merge:

- From user 1: 103 (timestamp 3), 101 (timestamp 1)
- From user 2: 102 (timestamp 2)

Sorted by timestamp (most recent first): 103, 102, 101

We only need top 10, so we return [103, 102, 101]

## Brute Force Approach

A naive approach might store all tweets in a single list and filter for each user's feed:

1. Store all tweets with (userId, tweetId, timestamp)
2. For getNewsFeed(userId):
   - Get all users this user follows plus themselves
   - Filter all tweets to find those from these users
   - Sort by timestamp descending
   - Return first 10

**Why this fails**:

- `getNewsFeed` becomes O(n log n) where n is total tweets
- With millions of tweets, filtering and sorting all of them for each feed request is impractical
- Follow/unfollow operations are cheap (O(1)), but feed retrieval is too expensive

## Optimized Approach

The key insight is that we need to efficiently merge multiple sorted lists (each user's tweet timeline) to get the most recent tweets. Think of each user's tweets as a timeline sorted by recency (most recent first).

**Core data structures**:

1. **User tweets map**: userId → list of their tweets (with timestamps)
2. **Follow relationships**: userId → set of users they follow
3. **Global timestamp counter**: To determine tweet ordering

**Optimization strategy**:

- Store each user's tweets in reverse chronological order (most recent first)
- For `getNewsFeed(userId)`, we need to merge k sorted lists where k = number of followed users + 1 (self)
- Use a max-heap (priority queue) to efficiently get the next most recent tweet from any of the k lists
- Since we only need top 10 tweets, we can stop early

**Step-by-step merging with heap**:

1. For each followed user (including self), get their most recent tweet
2. Push each tweet into a max-heap ordered by timestamp
3. Pop the most recent tweet from heap, add to result
4. If that user has more tweets, push their next most recent tweet
5. Repeat until we have 10 tweets or heap is empty

## Optimal Solution

<div class="code-group">

```python
# Time: O(k log k + 10 log k) for getNewsFeed where k = number of followed users
#       O(1) for postTweet, follow, unfollow
# Space: O(n + m) where n = total tweets, m = total follow relationships
class Twitter:
    def __init__(self):
        # Counter for tweet timestamps (higher = more recent)
        self.timestamp = 0
        # Map user -> list of (timestamp, tweetId) in chronological order
        self.user_tweets = {}
        # Map user -> set of users they follow
        self.following = {}

    def postTweet(self, userId: int, tweetId: int) -> None:
        """Post a new tweet for the given user."""
        # Initialize user's tweet list if not exists
        if userId not in self.user_tweets:
            self.user_tweets[userId] = []

        # Add tweet with current timestamp (most recent has higher timestamp)
        self.user_tweets[userId].append((self.timestamp, tweetId))
        self.timestamp += 1

        # Keep only recent tweets if we want to limit memory (optional optimization)
        # In real system, we'd store tweets in database, not all in memory

    def getNewsFeed(self, userId: int) -> List[int]:
        """Retrieve the 10 most recent tweet IDs in user's news feed."""
        import heapq

        # Max-heap to get most recent tweets (using negative timestamp for max-heap)
        heap = []

        # Include user's own tweets
        users = [userId]

        # Add all followed users
        if userId in self.following:
            users.extend(self.following[userId])

        # For each user, push their most recent tweet into heap
        for user in users:
            if user in self.user_tweets and self.user_tweets[user]:
                # Get the most recent tweet (last in list since we append in chronological order)
                tweets = self.user_tweets[user]
                timestamp, tweetId = tweets[-1]
                # Push with negative timestamp for max-heap (most recent first)
                heapq.heappush(heap, (-timestamp, tweetId, user, len(tweets) - 1))

        result = []
        # Get up to 10 most recent tweets
        while heap and len(result) < 10:
            # Pop the most recent tweet
            neg_timestamp, tweetId, user, index = heapq.heappop(heap)
            result.append(tweetId)

            # If this user has more tweets, push the next one
            if index > 0:
                next_index = index - 1
                timestamp, next_tweetId = self.user_tweets[user][next_index]
                heapq.heappush(heap, (-timestamp, next_tweetId, user, next_index))

        return result

    def follow(self, followerId: int, followeeId: int) -> None:
        """Follower follows a followee."""
        # Initialize following set if not exists
        if followerId not in self.following:
            self.following[followerId] = set()

        # Add followee to the set
        self.following[followerId].add(followeeId)

    def unfollow(self, followerId: int, followeeId: int) -> None:
        """Follower unfollows a followee."""
        # Only unfollow if follower is following someone
        if followerId in self.following and followeeId in self.following[followerId]:
            self.following[followerId].remove(followeeId)
```

```javascript
// Time: O(k log k + 10 log k) for getNewsFeed where k = number of followed users
//       O(1) for postTweet, follow, unfollow
// Space: O(n + m) where n = total tweets, m = total follow relationships
class Twitter {
  constructor() {
    // Counter for tweet timestamps (higher = more recent)
    this.timestamp = 0;
    // Map user -> array of [timestamp, tweetId] in chronological order
    this.userTweets = new Map();
    // Map user -> set of users they follow
    this.following = new Map();
  }

  postTweet(userId, tweetId) {
    // Initialize user's tweet array if not exists
    if (!this.userTweets.has(userId)) {
      this.userTweets.set(userId, []);
    }

    // Add tweet with current timestamp (most recent has higher timestamp)
    this.userTweets.get(userId).push([this.timestamp, tweetId]);
    this.timestamp++;
  }

  getNewsFeed(userId) {
    // Max-heap simulation using array and sorting
    // In real implementation, we'd use a proper heap data structure
    const heap = [];

    // Include user's own tweets
    const users = [userId];

    // Add all followed users
    if (this.following.has(userId)) {
      for (const followeeId of this.following.get(userId)) {
        users.push(followeeId);
      }
    }

    // For each user, push their most recent tweet into heap
    for (const user of users) {
      const tweets = this.userTweets.get(user);
      if (tweets && tweets.length > 0) {
        // Get the most recent tweet (last in array)
        const lastIndex = tweets.length - 1;
        const [timestamp, tweetId] = tweets[lastIndex];
        heap.push({
          negTimestamp: -timestamp, // Negative for max-heap behavior
          tweetId,
          user,
          index: lastIndex,
        });
      }
    }

    // Sort to simulate heap initialization (k log k)
    heap.sort((a, b) => a.negTimestamp - b.negTimestamp);

    const result = [];
    // Get up to 10 most recent tweets
    while (heap.length > 0 && result.length < 10) {
      // Get the most recent tweet (first in sorted array)
      const { tweetId, user, index } = heap.shift();
      result.push(tweetId);

      // If this user has more tweets, push the next one
      if (index > 0) {
        const tweets = this.userTweets.get(user);
        const nextIndex = index - 1;
        const [timestamp, nextTweetId] = tweets[nextIndex];

        // Insert maintaining sorted order (log k operation)
        const newItem = {
          negTimestamp: -timestamp,
          tweetId: nextTweetId,
          user,
          index: nextIndex,
        };

        // Binary search to insert in sorted position
        let insertAt = 0;
        let left = 0,
          right = heap.length - 1;
        while (left <= right) {
          const mid = Math.floor((left + right) / 2);
          if (heap[mid].negTimestamp <= newItem.negTimestamp) {
            insertAt = mid + 1;
            left = mid + 1;
          } else {
            right = mid - 1;
          }
        }
        heap.splice(insertAt, 0, newItem);
      }
    }

    return result;
  }

  follow(followerId, followeeId) {
    // Initialize following set if not exists
    if (!this.following.has(followerId)) {
      this.following.set(followerId, new Set());
    }

    // Add followee to the set
    this.following.get(followerId).add(followeeId);
  }

  unfollow(followerId, followeeId) {
    // Only unfollow if follower is following someone
    if (this.following.has(followerId)) {
      this.following.get(followerId).delete(followeeId);
    }
  }
}
```

```java
// Time: O(k log k + 10 log k) for getNewsFeed where k = number of followed users
//       O(1) for postTweet, follow, unfollow
// Space: O(n + m) where n = total tweets, m = total follow relationships
class Twitter {
    private int timestamp;
    private Map<Integer, List<int[]>> userTweets; // userId -> list of [timestamp, tweetId]
    private Map<Integer, Set<Integer>> following; // userId -> set of followeeIds

    public Twitter() {
        this.timestamp = 0;
        this.userTweets = new HashMap<>();
        this.following = new HashMap<>();
    }

    public void postTweet(int userId, int tweetId) {
        // Initialize user's tweet list if not exists
        userTweets.putIfAbsent(userId, new ArrayList<>());

        // Add tweet with current timestamp (most recent has higher timestamp)
        userTweets.get(userId).add(new int[]{timestamp, tweetId});
        timestamp++;
    }

    public List<Integer> getNewsFeed(int userId) {
        // Max-heap to get most recent tweets
        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> b[0] - a[0]);

        // Include user's own tweets
        List<Integer> users = new ArrayList<>();
        users.add(userId);

        // Add all followed users
        if (following.containsKey(userId)) {
            users.addAll(following.get(userId));
        }

        // For each user, push their most recent tweet into heap
        for (int user : users) {
            List<int[]> tweets = userTweets.get(user);
            if (tweets != null && !tweets.isEmpty()) {
                // Get the most recent tweet (last in list)
                int[] lastTweet = tweets.get(tweets.size() - 1);
                // Push [timestamp, tweetId, user, index]
                heap.offer(new int[]{lastTweet[0], lastTweet[1], user, tweets.size() - 1});
            }
        }

        List<Integer> result = new ArrayList<>();
        // Get up to 10 most recent tweets
        while (!heap.isEmpty() && result.size() < 10) {
            // Pop the most recent tweet
            int[] current = heap.poll();
            int tweetId = current[1];
            int user = current[2];
            int index = current[3];

            result.add(tweetId);

            // If this user has more tweets, push the next one
            if (index > 0) {
                List<int[]> tweets = userTweets.get(user);
                int[] nextTweet = tweets.get(index - 1);
                heap.offer(new int[]{nextTweet[0], nextTweet[1], user, index - 1});
            }
        }

        return result;
    }

    public void follow(int followerId, int followeeId) {
        // Initialize following set if not exists
        following.putIfAbsent(followerId, new HashSet<>());

        // Add followee to the set
        following.get(followerId).add(followeeId);
    }

    public void unfollow(int followerId, int followeeId) {
        // Only unfollow if follower is following someone
        if (following.containsKey(followerId)) {
            following.get(followerId).remove(followeeId);
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**:

- `postTweet(userId, tweetId)`: O(1) - just append to list and increment timestamp
- `follow(followerId, followeeId)`: O(1) - add to HashSet
- `unfollow(followerId, followeeId)`: O(1) - remove from HashSet
- `getNewsFeed(userId)`: O(k log k + 10 log k) where k = number of followed users + 1
  - O(k log k) to build initial heap with most recent tweet from each followed user
  - O(10 log k) to extract 10 tweets and push next tweets from same users

**Space Complexity**:

- O(n + m) where:
  - n = total number of tweets stored across all users
  - m = total number of follow relationships (edges in follow graph)
- Each tweet stored once in user's tweet list
- Each follow relationship stored once in the following map

## Common Mistakes

1. **Not handling self-tweets in feed**: Forgetting to include the user's own tweets when building their news feed. Always add the user themselves to the list of followed users.

2. **Inefficient feed retrieval**: Trying to collect ALL tweets from followed users then sorting. With millions of tweets, this is O(n log n). The heap approach only looks at the most recent tweets from each user.

3. **Wrong tweet ordering**: Storing tweets with increasing timestamps but iterating from the beginning instead of the end. Since we append new tweets, the most recent is always at the end.

4. **Not checking for null/empty data structures**: When a user hasn't posted any tweets or doesn't follow anyone, we need to handle these edge cases gracefully.

## When You'll See This Pattern

The k-way merge pattern using a heap appears in several problems:

1. **Merge k Sorted Lists (LeetCode 23)**: Exactly the same pattern - merge multiple sorted lists using a min-heap.

2. **Find K Pairs with Smallest Sums (LeetCode 373)**: Similar heap approach to find top k results from multiple sorted sequences.

3. **Top K Frequent Elements (LeetCode 347)**: Uses heap to efficiently get top k elements without full sorting.

The pattern is: when you need to merge or find top k elements from multiple sorted sources, a heap/priority queue is often the right tool.

## Key Takeaways

1. **K-way merge with heap**: When you need to merge k sorted lists or get top k elements from multiple sources, a heap lets you do this in O(k log k) instead of O(n log n).

2. **Trade-offs in system design**: This problem illustrates the classic trade-off between write optimization and read optimization. We optimize writes (O(1) postTweet) at the cost of more complex read logic.

3. **Choose data structures wisely**: Using a Set for follow relationships gives O(1) follow/unfollow. Using Lists for tweets with append gives O(1) postTweet. The right data structures make operations efficient.

Related problems: [Design a File Sharing System](/problem/design-a-file-sharing-system)
