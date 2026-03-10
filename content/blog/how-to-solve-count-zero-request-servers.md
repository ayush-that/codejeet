---
title: "How to Solve Count Zero Request Servers — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count Zero Request Servers. Medium difficulty, 35.6% acceptance rate. Topics: Array, Hash Table, Sliding Window, Sorting."
date: "2026-03-31"
category: "dsa-patterns"
tags: ["count-zero-request-servers", "array", "hash-table", "sliding-window", "medium"]
---

## How to Solve Count Zero Request Servers

You're given `n` servers, a list of request logs (server_id, timestamp), a time window length `x`, and query times. For each query, you need to count how many servers received **no requests** during the time window ending at that query time. The challenge lies in efficiently tracking which servers are "active" (have requests) within each sliding time window across multiple queries.

**What makes this tricky:** The queries aren't sorted, and naively checking each server for each query would be O(n × queries), which is too slow. The key insight is that we need to process queries in sorted order to efficiently slide the time window, while tracking active servers with a hash map and counter.

---

## Visual Walkthrough

Let's trace through a small example:

- `n = 3` servers (IDs: 0, 1, 2)
- `logs = [[0,1],[1,2],[0,3],[2,4]]`
- `x = 2` (window length)
- `queries = [3,4,5]`

**Step 1: Sort queries with indices**  
We need to remember original positions:  
`queries = [(3,0), (4,1), (5,2)]` sorted → same order here.

**Step 2: Sort logs by time**  
`logs = [[0,1],[1,2],[0,3],[2,4]]` already sorted.

**Step 3: Process query at time 3**  
Window = [1, 3] (since 3-2=1, inclusive range)

- Add logs with time ≤ 3:  
  Time 1: server 0 → active_servers={0:1}, active_count=1  
  Time 2: server 1 → active_servers={0:1,1:1}, active_count=2  
  Time 3: server 0 → active_servers={0:2,1:1}, active_count=2
- Remove logs with time < 1: none
- Answer: total servers (3) - active_count (2) = **1** server with zero requests

**Step 4: Process query at time 4**  
Window = [2, 4]

- Add logs with time ≤ 4 and >3:  
  Time 4: server 2 → active_servers={0:2,1:1,2:1}, active_count=3
- Remove logs with time < 2:  
  Time 1: server 0 → active_servers={0:1,1:1,2:1}, active_count=3
- Answer: 3 - 3 = **0**

**Step 5: Process query at time 5**  
Window = [3, 5]

- Add logs with time ≤ 5 and >4: none
- Remove logs with time < 3:  
  Time 2: server 1 → active_servers={0:1,2:1}, active_count=2
- Answer: 3 - 2 = **1**

Final answers: `[1,0,1]` for original query order.

---

## Brute Force Approach

A naive solution would check each server for each query:

1. For each query time `t`, calculate window `[t-x, t]`
2. For each server (0 to n-1), scan all logs to see if it has any request in that window
3. Count servers with zero matching logs

**Why it fails:**

- Time complexity: O(queries × n × logs) → with constraints (n≤10⁵, queries≤10⁵), this is up to 10¹⁵ operations
- Even with preprocessing logs per server, checking each server for each query is still O(queries × n)

**Key insight needed:** Instead of checking each server, we should track which servers are _active_ in the current window using a sliding window approach. Since queries come in arbitrary order, we sort them to process in increasing time order, allowing us to slide the window efficiently.

---

## Optimized Approach

The optimal solution uses **sorting + sliding window + hash map**:

1. **Sort queries** (keeping original indices) so we can process them in increasing time order
2. **Sort logs** by timestamp to efficiently add/remove from window
3. **Two-pointer sliding window**:
   - `left` pointer: index of first log still in window (time ≥ window_start)
   - `right` pointer: index of next log to add (time ≤ query_time)
4. **Active servers tracking**:
   - Hash map `active_count` stores server_id → number of requests in current window
   - Integer `active_servers` counts distinct servers with ≥1 request in window
5. **For each query**:
   - Move `right` forward to add all logs with time ≤ query_time
   - Move `left` forward to remove all logs with time < window_start (query_time - x)
   - Answer = total servers (n) - active_servers

**Why this works:**

- Sorting queries allows O(logs) window sliding instead of O(queries × logs)
- Hash map gives O(1) updates when adding/removing server requests
- Distinct server count avoids iterating through all n servers

---

## Optimal Solution

<div class="code-group">

```python
# Time: O((L + Q) log (L + Q)) where L = len(logs), Q = len(queries)
# Space: O(n + Q) for active_count map and result array
def countServers(n: int, logs: List[List[int]], x: int, queries: List[int]) -> List[int]:
    # Step 1: Sort logs by timestamp for efficient window sliding
    logs.sort(key=lambda log: log[1])

    # Step 2: Sort queries with their original indices
    sorted_queries = sorted([(time, idx) for idx, time in enumerate(queries)])

    # Step 3: Initialize pointers and tracking structures
    left = right = 0
    active_count = {}  # server_id -> count of requests in current window
    active_servers = 0  # number of distinct servers with >=1 request in window
    result = [0] * len(queries)

    # Step 4: Process each query in sorted order
    for query_time, original_idx in sorted_queries:
        window_start = query_time - x

        # Step 4a: Add all logs with time <= query_time to window
        while right < len(logs) and logs[right][1] <= query_time:
            server_id = logs[right][0]
            # If this server wasn't active before, increment distinct count
            if active_count.get(server_id, 0) == 0:
                active_servers += 1
            active_count[server_id] = active_count.get(server_id, 0) + 1
            right += 1

        # Step 4b: Remove all logs with time < window_start from window
        while left < len(logs) and logs[left][1] < window_start:
            server_id = logs[left][0]
            active_count[server_id] -= 1
            # If server no longer has requests in window, decrement distinct count
            if active_count[server_id] == 0:
                active_servers -= 1
                del active_count[server_id]  # Optional cleanup
            left += 1

        # Step 4c: Calculate answer for this query
        result[original_idx] = n - active_servers

    return result
```

```javascript
// Time: O((L + Q) log (L + Q)) where L = logs.length, Q = queries.length
// Space: O(n + Q) for activeCount map and result array
function countServers(n, logs, x, queries) {
  // Step 1: Sort logs by timestamp
  logs.sort((a, b) => a[1] - b[1]);

  // Step 2: Sort queries with original indices
  const sortedQueries = queries.map((time, idx) => [time, idx]);
  sortedQueries.sort((a, b) => a[0] - b[0]);

  // Step 3: Initialize pointers and tracking
  let left = 0,
    right = 0;
  const activeCount = new Map(); // server_id -> request count in window
  let activeServers = 0; // distinct servers with >=1 request
  const result = new Array(queries.length).fill(0);

  // Step 4: Process each query in sorted order
  for (const [queryTime, originalIdx] of sortedQueries) {
    const windowStart = queryTime - x;

    // Step 4a: Add logs with time <= queryTime
    while (right < logs.length && logs[right][1] <= queryTime) {
      const serverId = logs[right][0];
      const count = activeCount.get(serverId) || 0;
      if (count === 0) {
        activeServers++;
      }
      activeCount.set(serverId, count + 1);
      right++;
    }

    // Step 4b: Remove logs with time < windowStart
    while (left < logs.length && logs[left][1] < windowStart) {
      const serverId = logs[left][0];
      const count = activeCount.get(serverId);
      if (count === 1) {
        activeServers--;
        activeCount.delete(serverId);
      } else {
        activeCount.set(serverId, count - 1);
      }
      left++;
    }

    // Step 4c: Calculate answer
    result[originalIdx] = n - activeServers;
  }

  return result;
}
```

```java
// Time: O((L + Q) log (L + Q)) where L = logs.length, Q = queries.length
// Space: O(n + Q) for activeCount map and result array
public int[] countServers(int n, int[][] logs, int x, int[] queries) {
    // Step 1: Sort logs by timestamp
    Arrays.sort(logs, (a, b) -> Integer.compare(a[1], b[1]));

    // Step 2: Sort queries with original indices
    int[][] sortedQueries = new int[queries.length][2];
    for (int i = 0; i < queries.length; i++) {
        sortedQueries[i][0] = queries[i]; // time
        sortedQueries[i][1] = i;          // original index
    }
    Arrays.sort(sortedQueries, (a, b) -> Integer.compare(a[0], b[0]));

    // Step 3: Initialize pointers and tracking
    int left = 0, right = 0;
    Map<Integer, Integer> activeCount = new HashMap<>();
    int activeServers = 0;
    int[] result = new int[queries.length];

    // Step 4: Process each query in sorted order
    for (int[] query : sortedQueries) {
        int queryTime = query[0];
        int originalIdx = query[1];
        int windowStart = queryTime - x;

        // Step 4a: Add logs with time <= queryTime
        while (right < logs.length && logs[right][1] <= queryTime) {
            int serverId = logs[right][0];
            int count = activeCount.getOrDefault(serverId, 0);
            if (count == 0) {
                activeServers++;
            }
            activeCount.put(serverId, count + 1);
            right++;
        }

        // Step 4b: Remove logs with time < windowStart
        while (left < logs.length && logs[left][1] < windowStart) {
            int serverId = logs[left][0];
            int count = activeCount.get(serverId);
            if (count == 1) {
                activeServers--;
                activeCount.remove(serverId);
            } else {
                activeCount.put(serverId, count - 1);
            }
            left++;
        }

        // Step 4c: Calculate answer
        result[originalIdx] = n - activeServers;
    }

    return result;
}
```

</div>

---

## Complexity Analysis

**Time Complexity: O((L + Q) log (L + Q))**

- Sorting logs: O(L log L)
- Sorting queries: O(Q log Q)
- Processing each query: O(L + Q) total (each log added/removed at most once)
- Dominated by sorting → O((L + Q) log (L + Q))

**Space Complexity: O(n + Q)**

- `active_count` map: O(n) in worst case (all servers active)
- Result array: O(Q)
- Sorted queries array: O(Q)
- Total: O(n + Q)

---

## Common Mistakes

1. **Not sorting queries first**  
   Attempting to process queries in given order forces O(Q × L) time. Always consider if sorting inputs can enable more efficient processing.

2. **Incorrect window boundaries**  
   Using `time < window_start` vs `time <= window_start` for removal. Remember: window is inclusive `[t-x, t]`, so remove logs with `time < t-x`.

3. **Counting servers inefficiently**  
   Iterating through all n servers for each query gives O(nQ). Instead, track distinct active servers with a counter that updates in O(1) when adding/removing requests.

4. **Forgetting to store original query indices**  
   Without storing original positions, you can't return answers in the correct order. Always pair queries with their indices before sorting.

---

## When You'll See This Pattern

This **sorted queries + sliding window + frequency map** pattern appears in problems where you need to answer multiple range queries efficiently:

1. **Number of Flowers in Full Bloom (LeetCode 2251)**  
   Similar structure: events (flowers blooming/withering), time queries, need to count active flowers at each query time.

2. **Maximum Population Year (LeetCode 1854)**  
   Multiple intervals (birth-death years), query each year for population count. Uses similar sweeping line technique.

3. **Meeting Rooms II (LeetCode 253)**  
   Finding maximum concurrent meetings uses similar interval processing with start/end events.

The core pattern: When you have multiple queries over ranges/intervals, sort the queries, use two pointers to slide through events, and maintain a frequency counter for efficient updates.

---

## Key Takeaways

1. **Sort queries when order doesn't matter** — This enables processing in optimal order (often chronological) for sliding window problems.

2. **Track distinct counts with hash map + counter** — Instead of iterating through all items, maintain a running count of distinct active elements that updates in O(1).

3. **Two pointers for sliding window over sorted events** — Use `left` and `right` pointers to efficiently add new elements and remove old ones as the window moves.

[Practice this problem on CodeJeet](/problem/count-zero-request-servers)
