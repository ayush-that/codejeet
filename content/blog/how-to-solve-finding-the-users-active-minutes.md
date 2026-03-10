---
title: "How to Solve Finding the Users Active Minutes — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Finding the Users Active Minutes. Medium difficulty, 80.8% acceptance rate. Topics: Array, Hash Table."
date: "2028-01-29"
category: "dsa-patterns"
tags: ["finding-the-users-active-minutes", "array", "hash-table", "medium"]
---

## How to Solve Finding the Users Active Minutes

This problem asks us to analyze user activity logs to determine how many users have each possible amount of "active minutes." A user's active minutes count is the number of **unique minutes** in which they performed actions. The tricky part is that we need to count users by their unique activity minutes, not total actions, and then build a frequency distribution of these counts.

**What makes this interesting:** We need to handle duplicate timestamps for the same user efficiently, and we need to transform individual user data into a population distribution. It's a great exercise in using hash tables for both deduplication and frequency counting.

## Visual Walkthrough

Let's trace through a concrete example:

```
logs = [[0,5],[1,2],[0,2],[0,5],[1,3]]
k = 4
```

**Step 1: Group actions by user**

- User 0: minutes [5, 2, 5] → unique minutes {2, 5} → 2 active minutes
- User 1: minutes [2, 3] → unique minutes {2, 3} → 2 active minutes

**Step 2: Count how many users have each UAM value**

- 1 active minute: 0 users
- 2 active minutes: 2 users (both user 0 and user 1)
- 3 active minutes: 0 users
- 4 active minutes: 0 users

**Step 3: Build the answer array**
Since k=4, we need an array of length 4:

- answer[0] = users with 1 UAM = 0
- answer[1] = users with 2 UAM = 2
- answer[2] = users with 3 UAM = 0
- answer[3] = users with 4 UAM = 0

Final answer: `[0,2,0,0]`

## Brute Force Approach

A naive approach might try to process each user separately:

1. For each user ID found in logs:
   - Collect all their timestamps
   - Remove duplicates by sorting and scanning
   - Count unique minutes
   - Increment the corresponding answer index

The problem with this approach is inefficiency. If we process users by scanning the entire logs array for each unique user, we get O(n²) time complexity in the worst case (when each log entry is for a different user). Even if we first collect all user IDs, we still need efficient deduplication of timestamps.

What a candidate might try and fail:

- Counting total actions instead of unique minutes (wrong logic)
- Using arrays instead of sets for timestamp storage (inefficient deduplication)
- Nested loops that repeatedly scan the logs array (too slow)

## Optimized Approach

The key insight is that we need **two levels of aggregation**:

1. **First hash table**: Map each user to their unique activity minutes
2. **Second hash table/array**: Count how many users have each UAM value

**Step-by-step reasoning:**

1. We need to group timestamps by user ID → use a dictionary/hash map
2. For each user, we need to store only unique minutes → use a set
3. After processing all logs, for each user:
   - Get the size of their minute set = their UAM
   - Increment the count for that UAM value
4. Since UAM values range from 1 to k, we can use an array of size k
5. Important: Array indices are 0-based, but UAM values start at 1
   - So answer[i] stores count for UAM = i+1

**Why this works efficiently:**

- First pass through logs: O(n) time to build user→minutes mapping
- Using sets gives O(1) average insertion and automatic deduplication
- Second pass through users: O(u) time where u = number of users
- Overall O(n) time and O(n) space

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) where n = len(logs)
# Space: O(n) for storing user-minute mappings
def findingUsersActiveMinutes(logs, k):
    """
    Calculate the distribution of Users Active Minutes (UAM).

    Args:
        logs: List of [user_id, minute] pairs
        k: Maximum UAM value to consider

    Returns:
        List of length k where answer[j] = number of users with UAM = j+1
    """
    # Step 1: Create mapping from user_id to set of unique minutes
    # Using defaultdict(set) automatically creates a new set for new users
    from collections import defaultdict
    user_minutes = defaultdict(set)

    # Process each log entry
    for user_id, minute in logs:
        # Add minute to the user's set (duplicates are automatically ignored)
        user_minutes[user_id].add(minute)

    # Step 2: Initialize answer array with k zeros
    # Index i will store count of users with UAM = i+1
    answer = [0] * k

    # Step 3: Count users by their UAM value
    for minutes_set in user_minutes.values():
        # Calculate UAM = number of unique minutes
        uam = len(minutes_set)

        # Only count if UAM is within 1..k range
        # Problem guarantees UAM >= 1, but we check to be safe
        if 1 <= uam <= k:
            # Convert UAM to 0-based index: UAM=1 -> index=0, UAM=2 -> index=1, etc.
            answer[uam - 1] += 1

    return answer
```

```javascript
// Time: O(n) where n = logs.length
// Space: O(n) for storing user-minute mappings
function findingUsersActiveMinutes(logs, k) {
  /**
   * Calculate the distribution of Users Active Minutes (UAM).
   *
   * @param {number[][]} logs - Array of [user_id, minute] pairs
   * @param {number} k - Maximum UAM value to consider
   * @return {number[]} - Array of length k where answer[j] = number of users with UAM = j+1
   */

  // Step 1: Create mapping from user_id to set of unique minutes
  const userMinutes = new Map();

  // Process each log entry
  for (const [userId, minute] of logs) {
    // Get or create the set for this user
    if (!userMinutes.has(userId)) {
      userMinutes.set(userId, new Set());
    }

    // Add minute to the user's set (duplicates are automatically ignored)
    userMinutes.get(userId).add(minute);
  }

  // Step 2: Initialize answer array with k zeros
  // Index i will store count of users with UAM = i+1
  const answer = new Array(k).fill(0);

  // Step 3: Count users by their UAM value
  for (const minutesSet of userMinutes.values()) {
    // Calculate UAM = number of unique minutes
    const uam = minutesSet.size;

    // Only count if UAM is within 1..k range
    // Problem guarantees UAM >= 1, but we check to be safe
    if (uam >= 1 && uam <= k) {
      // Convert UAM to 0-based index: UAM=1 -> index=0, UAM=2 -> index=1, etc.
      answer[uam - 1] += 1;
    }
  }

  return answer;
}
```

```java
// Time: O(n) where n = logs.length
// Space: O(n) for storing user-minute mappings
import java.util.*;

class Solution {
    public int[] findingUsersActiveMinutes(int[][] logs, int k) {
        /**
         * Calculate the distribution of Users Active Minutes (UAM).
         *
         * @param logs - Array of [user_id, minute] pairs
         * @param k - Maximum UAM value to consider
         * @return - Array of length k where answer[j] = number of users with UAM = j+1
         */

        // Step 1: Create mapping from user_id to set of unique minutes
        // HashMap<Integer, HashSet<Integer>> stores user -> unique minutes
        Map<Integer, Set<Integer>> userMinutes = new HashMap<>();

        // Process each log entry
        for (int[] log : logs) {
            int userId = log[0];
            int minute = log[1];

            // Get or create the set for this user
            userMinutes.putIfAbsent(userId, new HashSet<>());

            // Add minute to the user's set (duplicates are automatically ignored)
            userMinutes.get(userId).add(minute);
        }

        // Step 2: Initialize answer array with k zeros
        // Index i will store count of users with UAM = i+1
        int[] answer = new int[k];

        // Step 3: Count users by their UAM value
        for (Set<Integer> minutesSet : userMinutes.values()) {
            // Calculate UAM = number of unique minutes
            int uam = minutesSet.size();

            // Only count if UAM is within 1..k range
            // Problem guarantees UAM >= 1, but we check to be safe
            if (uam >= 1 && uam <= k) {
                // Convert UAM to 0-based index: UAM=1 -> index=0, UAM=2 -> index=1, etc.
                answer[uam - 1] += 1;
            }
        }

        return answer;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Processing each log entry once: O(n)
- Adding to hash sets: O(1) average case per insertion
- Iterating through users: O(u) where u ≤ n
- Total: O(n + u) = O(n)

**Space Complexity: O(n)**

- Hash map stores up to n user-minute relationships
- Each minute is stored once per user (sets deduplicate)
- In worst case, all minutes are unique for all users: O(n) space
- Answer array: O(k) which is separate from input size

## Common Mistakes

1. **Counting total actions instead of unique minutes**: The most common error is forgetting to deduplicate timestamps for each user. If a user acts at minute 5 twice, that should count as 1 active minute, not 2.

2. **Off-by-one errors with array indices**: Since UAM values start at 1 but array indices start at 0, candidates often confuse `answer[uam]` with `answer[uam-1]`. Remember: `answer[i]` corresponds to UAM = i+1.

3. **Assuming UAM values are bounded by k**: While the problem says to return an array of size k, a user could theoretically have more than k unique minutes. We should only increment counts for UAM ≤ k.

4. **Inefficient deduplication**: Some candidates use lists/arrays and manually check for duplicates (O(n²) per user) instead of using hash sets (O(1) per insertion).

## When You'll See This Pattern

This problem combines two common patterns:

1. **Grouping by key then aggregating**: Similar to "Group Anagrams" (LeetCode 49) where you group strings by their character counts, or "Find Players With Zero or One Losses" (LeetCode 2225) where you group match results by player.

2. **Frequency distribution of frequencies**: The "histogram of histograms" pattern appears in problems like "Sort Characters By Frequency" (LeetCode 451) where you count character frequencies, then bucket characters by frequency.

3. **Two-level hash table problems**: Like "Design Underground System" (LeetCode 1396) where you track customer check-ins then calculate averages, or "Tweet Counts Per Frequency" (LeetCode 1348) which involves time-based aggregation.

## Key Takeaways

1. **When you need to group data by a key and perform aggregation, reach for a hash map** (dictionary in Python, Map in JavaScript, HashMap in Java). The natural structure is `Map<Key, Collection<Values>>`.

2. **When duplicates don't matter, use sets instead of lists** for O(1) deduplication. This is especially important when the problem asks for "unique" or "distinct" items.

3. **Pay attention to index transformations** when output requirements don't match language conventions. The mental shift from "UAM value" to "array index" is a common source of off-by-one errors.

[Practice this problem on CodeJeet](/problem/finding-the-users-active-minutes)
