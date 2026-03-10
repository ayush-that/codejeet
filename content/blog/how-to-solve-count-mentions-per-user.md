---
title: "How to Solve Count Mentions Per User — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count Mentions Per User. Medium difficulty, 50.8% acceptance rate. Topics: Array, Math, Sorting, Simulation."
date: "2027-10-04"
category: "dsa-patterns"
tags: ["count-mentions-per-user", "array", "math", "sorting", "medium"]
---

# How to Solve Count Mentions Per User

This problem asks us to track how many times each user is mentioned across message events, while accounting for the fact that mentions can be "reset" when a user is removed from the conversation. The tricky part is efficiently handling the removal events that reset mention counts for specific users, requiring us to maintain both current mention counts and the last time each user was reset.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:**

```
numberOfUsers = 3
events = [
    ["MESSAGE", 1, "1 2"],
    ["REMOVE_USER", 2, "2"],
    ["MESSAGE", 3, "2 3"],
    ["MESSAGE", 4, "1 2 3"]
]
```

**Step-by-step processing:**

1. **Initialize:** We start with `mentions = [0, 0, 0]` for users 1, 2, 3 (0-indexed: users 0, 1, 2)

2. **Event 1:** `["MESSAGE", 1, "1 2"]`
   - Parse mentions: users 1 and 2 (convert to 0-indexed: users 0 and 1)
   - Increment both users' counts: `mentions = [1, 1, 0]`

3. **Event 2:** `["REMOVE_USER", 2, "2"]`
   - User 2 (0-indexed: user 1) is removed
   - Record removal time: user 1 was removed at timestamp 2
   - Reset user 1's count to 0: `mentions = [1, 0, 0]`

4. **Event 3:** `["MESSAGE", 3, "2 3"]`
   - Parse mentions: users 2 and 3 (0-indexed: users 1 and 2)
   - Check user 1: was removed at timestamp 2, current message is at timestamp 3
     Since 3 > 2, we need to reset before counting
     Reset user 1's count to 0 (already 0)
   - Check user 2: never removed
   - Increment counts: user 1 gets +1, user 2 gets +1
   - `mentions = [1, 1, 1]`

5. **Event 4:** `["MESSAGE", 4, "1 2 3"]`
   - Parse mentions: users 1, 2, 3 (0-indexed: users 0, 1, 2)
   - Check user 1: never removed
   - Check user 2: was removed at timestamp 2, current message is at timestamp 4
     Since 4 > 2, reset user 2's count to 0
   - Check user 3: never removed
   - Increment all three: `mentions = [2, 1, 2]`

**Final result:** `[2, 1, 2]`

The key insight: when we see a user in a MESSAGE event, we need to check if they were removed after their last mention. If so, we must reset their count before incrementing.

## Brute Force Approach

A naive approach would be to process events sequentially and for each MESSAGE event:

1. Parse the mentions string to get user IDs
2. For each mentioned user, scan through all previous REMOVE_USER events to find the most recent removal
3. If found and the removal timestamp is greater than the user's last mention time, reset the count
4. Increment the user's mention count

This approach has several problems:

- For each MESSAGE event, we might scan all previous REMOVE_USER events
- We need to track when each user was last mentioned to compare with removal times
- The worst-case time complexity would be O(n²) where n is the number of events

The brute force becomes inefficient because we're repeatedly searching for removal information. We need a way to quickly access the most recent removal time for any user.

## Optimized Approach

The key insight is that we need to maintain two pieces of information:

1. **Current mention counts** for each user
2. **Last removal time** for each user (or -1 if never removed)

When processing a MESSAGE event:

1. Parse the mentions string to get user IDs
2. For each mentioned user:
   - Check if this user has been removed since their last mention
   - If yes (current timestamp > user's last removal time), reset their count to 0
   - Update the user's last removal time to -1 (since we just processed the removal)
   - Increment their mention count

When processing a REMOVE_USER event:

1. Parse the user ID
2. Update that user's last removal time to the current timestamp

The optimization comes from:

- Using arrays for O(1) access to user data
- Only checking removal status when a user is mentioned (not for every event)
- Tracking removal times separately from mention counts

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n * m) where n = number of events, m = average mentions per message
# Space: O(numberOfUsers) for storing counts and removal times
def countMentions(numberOfUsers, events):
    # Initialize arrays to track state for each user
    # User IDs are 1-indexed in input, but we'll use 0-indexed arrays
    mentions = [0] * numberOfUsers  # Current mention count for each user
    lastRemoval = [-1] * numberOfUsers  # Last timestamp user was removed, -1 if never

    for event in events:
        event_type = event[0]
        timestamp = int(event[1])

        if event_type == "MESSAGE":
            # Parse the space-separated user IDs from the mentions string
            # Convert to 0-indexed for array access
            mentioned_users = [int(user_id) - 1 for user_id in event[2].split()]

            for user in mentioned_users:
                # Check if this user was removed since their last mention
                # If lastRemoval[user] != -1 and we're processing a message after removal,
                # we need to reset the count
                if lastRemoval[user] != -1 and timestamp > lastRemoval[user]:
                    # Reset the mention count for this user
                    mentions[user] = 0
                    # Mark that we've processed this removal
                    lastRemoval[user] = -1

                # Increment the mention count
                mentions[user] += 1

        elif event_type == "REMOVE_USER":
            # Parse the user ID and convert to 0-indexed
            user = int(event[2]) - 1
            # Record when this user was removed
            lastRemoval[user] = timestamp

    return mentions
```

```javascript
// Time: O(n * m) where n = number of events, m = average mentions per message
// Space: O(numberOfUsers) for storing counts and removal times
function countMentions(numberOfUsers, events) {
  // Initialize arrays to track state for each user
  // User IDs are 1-indexed in input, but we'll use 0-indexed arrays
  const mentions = new Array(numberOfUsers).fill(0); // Current mention count for each user
  const lastRemoval = new Array(numberOfUsers).fill(-1); // Last timestamp user was removed, -1 if never

  for (const event of events) {
    const eventType = event[0];
    const timestamp = parseInt(event[1]);

    if (eventType === "MESSAGE") {
      // Parse the space-separated user IDs from the mentions string
      // Convert to 0-indexed for array access
      const mentionedUsers = event[2].split(" ").map((userId) => parseInt(userId) - 1);

      for (const user of mentionedUsers) {
        // Check if this user was removed since their last mention
        // If lastRemoval[user] != -1 and we're processing a message after removal,
        // we need to reset the count
        if (lastRemoval[user] !== -1 && timestamp > lastRemoval[user]) {
          // Reset the mention count for this user
          mentions[user] = 0;
          // Mark that we've processed this removal
          lastRemoval[user] = -1;
        }

        // Increment the mention count
        mentions[user]++;
      }
    } else if (eventType === "REMOVE_USER") {
      // Parse the user ID and convert to 0-indexed
      const user = parseInt(event[2]) - 1;
      // Record when this user was removed
      lastRemoval[user] = timestamp;
    }
  }

  return mentions;
}
```

```java
// Time: O(n * m) where n = number of events, m = average mentions per message
// Space: O(numberOfUsers) for storing counts and removal times
public int[] countMentions(int numberOfUsers, String[][] events) {
    // Initialize arrays to track state for each user
    // User IDs are 1-indexed in input, but we'll use 0-indexed arrays
    int[] mentions = new int[numberOfUsers];  // Current mention count for each user
    int[] lastRemoval = new int[numberOfUsers];  // Last timestamp user was removed

    // Initialize lastRemoval array with -1 (never removed)
    Arrays.fill(lastRemoval, -1);

    for (String[] event : events) {
        String eventType = event[0];
        int timestamp = Integer.parseInt(event[1]);

        if (eventType.equals("MESSAGE")) {
            // Parse the space-separated user IDs from the mentions string
            String[] userIds = event[2].split(" ");

            for (String userIdStr : userIds) {
                // Convert to 0-indexed for array access
                int user = Integer.parseInt(userIdStr) - 1;

                // Check if this user was removed since their last mention
                // If lastRemoval[user] != -1 and we're processing a message after removal,
                // we need to reset the count
                if (lastRemoval[user] != -1 && timestamp > lastRemoval[user]) {
                    // Reset the mention count for this user
                    mentions[user] = 0;
                    // Mark that we've processed this removal
                    lastRemoval[user] = -1;
                }

                // Increment the mention count
                mentions[user]++;
            }

        } else if (eventType.equals("REMOVE_USER")) {
            // Parse the user ID and convert to 0-indexed
            int user = Integer.parseInt(event[2]) - 1;
            // Record when this user was removed
            lastRemoval[user] = timestamp;
        }
    }

    return mentions;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × m)

- `n` is the number of events
- `m` is the average number of mentions per MESSAGE event
- We process each event once, and for MESSAGE events, we process each mentioned user
- In the worst case, every event is a MESSAGE mentioning all users: O(n × numberOfUsers)

**Space Complexity:** O(numberOfUsers)

- We maintain two arrays of size `numberOfUsers`: one for mention counts and one for last removal times
- The input parsing uses temporary space, but it's proportional to the mentions in the current event, not cumulative

## Common Mistakes

1. **Not resetting lastRemoval after processing:** After resetting a user's mention count due to a removal, you must set `lastRemoval[user] = -1`. Otherwise, the next message will incorrectly reset the count again.

2. **Incorrect timestamp comparison:** The condition should be `timestamp > lastRemoval[user]`, not `timestamp >= lastRemoval[user]`. If a user is removed at timestamp 5 and mentioned in a message at timestamp 5, the removal hasn't taken effect yet for that message.

3. **1-indexed to 0-indexed conversion errors:** User IDs in the input are 1-indexed, but arrays are 0-indexed. Forgetting to subtract 1 when accessing arrays will cause index out of bounds errors.

4. **Not handling multiple mentions in one message correctly:** The problem states "a set of users were mentioned," which could include duplicates. However, based on the examples, we should treat each user ID in the string as a separate mention, even if the same user appears multiple times in one message string.

## When You'll See This Pattern

This problem uses **state tracking with conditional resets**, a pattern common in:

1. **LeetCode 362: Design Hit Counter** - Similar timestamp-based tracking where old hits expire after a certain time window.

2. **LeetCode 359: Logger Rate Limiter** - Tracking when messages were last printed and resetting based on time intervals.

3. **LeetCode 1396: Design Underground System** - Maintaining state for multiple entities (customers) and updating based on events (check-ins and check-outs).

The core pattern involves maintaining per-entity state and updating it based on events with timestamps, often requiring conditional resets or expirations.

## Key Takeaways

1. **Separate state tracking:** When dealing with events that affect entity state, maintain separate arrays or maps for different aspects of state (like mention counts and last removal times).

2. **Lazy evaluation of conditions:** Only check removal status when a user is mentioned, not for every event. This is more efficient than proactively updating all users on every removal event.

3. **Careful timestamp handling:** When events have timestamps and state depends on time-based conditions, be precise about comparison operators (>, >=) and ensure you're comparing the right timestamps.

[Practice this problem on CodeJeet](/problem/count-mentions-per-user)
