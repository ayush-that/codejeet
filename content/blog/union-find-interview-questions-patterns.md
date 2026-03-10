---
title: "Union-Find Interview Questions: Patterns and Strategies"
description: "Master Union-Find problems for coding interviews — common patterns, difficulty breakdown, which companies ask them, and study tips."
date: "2028-04-20"
category: "dsa-patterns"
tags: ["union-find", "dsa", "interview prep"]
---

# Union-Find Interview Questions: Patterns and Strategies

You’re cruising through an interview, confidently solving a graph problem with BFS, when the interviewer asks: “Can you do it in near-linear time?” You pause. The problem looks like a connectivity question—something about islands or friend groups—but your BFS solution is O(n²). This is the exact moment candidates get tripped up by problems like **Number of Islands II (LeetCode #305)**, where dynamically adding land requires efficient connectivity checks. That’s where Union-Find (or Disjoint Set Union) becomes your secret weapon. With 74 tagged questions on LeetCode—53% Medium, 46% Hard—this isn’t a niche topic. It’s a high-leverage technique that separates candidates who memorize solutions from those who understand algorithmic tool selection.

## Common Patterns

Union-Find excels at managing dynamic connectivity. The core operations—`find` (with path compression) and `union` (by rank/size)—give you amortized near-constant time per operation. Here are the patterns you’ll actually encounter.

### 1. Dynamic Connectivity with Coordinate Mapping

This pattern appears when you have a grid or matrix where connections form between adjacent cells (4 or 8 directions). The trick is mapping 2D coordinates to 1D indices for the parent array.

**LeetCode Examples:** Number of Islands II (#305), Number of Provinces (#547), Most Stones Removed with Same Row or Column (#947)

The intuition: Instead of running BFS/DFS every time connectivity changes, maintain a Union-Find structure that merges components as new connections appear. Each new element starts as its own component, then unions with existing neighbors.

<div class="code-group">

```python
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.count = n  # Track number of components

    def find(self, x):
        # Path compression
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):
        root_x = self.find(x)
        root_y = self.find(y)
        if root_x == root_y:
            return False
        # Union by rank
        if self.rank[root_x] < self.rank[root_y]:
            self.parent[root_x] = root_y
        elif self.rank[root_x] > self.rank[root_y]:
            self.parent[root_y] = root_x
        else:
            self.parent[root_y] = root_x
            self.rank[root_x] += 1
        self.count -= 1
        return True

# Example: Grid connectivity helper
def grid_union_find(rows, cols, positions):
    uf = UnionFind(rows * cols)
    grid = [[0] * cols for _ in range(rows)]
    directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
    result = []

    for r, c in positions:
        if grid[r][c] == 1:
            result.append(uf.count)
            continue
        grid[r][c] = 1
        idx = r * cols + c
        # Initially treat as new component
        # Union with all adjacent land cells
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                uf.union(idx, nr * cols + nc)
        result.append(uf.count)
    return result

# Time: O(k * α(n)) where k = number of positions, α = inverse Ackermann (near-constant)
# Space: O(rows * cols) for parent/rank arrays
```

```javascript
class UnionFind {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = Array(n).fill(0);
    this.count = n;
  }

  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(x, y) {
    const rootX = this.find(x);
    const rootY = this.find(y);
    if (rootX === rootY) return false;

    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }
    this.count--;
    return true;
  }
}

// Grid connectivity example
function gridUnionFind(rows, cols, positions) {
  const uf = new UnionFind(rows * cols);
  const grid = Array.from({ length: rows }, () => Array(cols).fill(0));
  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];
  const result = [];

  for (const [r, c] of positions) {
    if (grid[r][c] === 1) {
      result.push(uf.count);
      continue;
    }
    grid[r][c] = 1;
    const idx = r * cols + c;
    for (const [dr, dc] of directions) {
      const nr = r + dr,
        nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 1) {
        uf.union(idx, nr * cols + nc);
      }
    }
    result.push(uf.count);
  }
  return result;
}

// Time: O(k * α(n)) | Space: O(rows * cols)
```

```java
class UnionFind {
    private int[] parent;
    private int[] rank;
    private int count;

    public UnionFind(int n) {
        parent = new int[n];
        rank = new int[n];
        count = n;
        for (int i = 0; i < n; i++) {
            parent[i] = i;
        }
    }

    public int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }

    public boolean union(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);
        if (rootX == rootY) return false;

        if (rank[rootX] < rank[rootY]) {
            parent[rootX] = rootY;
        } else if (rank[rootX] > rank[rootY]) {
            parent[rootY] = rootX;
        } else {
            parent[rootY] = rootX;
            rank[rootX]++;
        }
        count--;
        return true;
    }

    public int getCount() { return count; }
}

// Grid connectivity example
public List<Integer> gridUnionFind(int rows, int cols, int[][] positions) {
    UnionFind uf = new UnionFind(rows * cols);
    int[][] grid = new int[rows][cols];
    int[][] directions = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};
    List<Integer> result = new ArrayList<>();

    for (int[] pos : positions) {
        int r = pos[0], c = pos[1];
        if (grid[r][c] == 1) {
            result.add(uf.getCount());
            continue;
        }
        grid[r][c] = 1;
        int idx = r * cols + c;
        for (int[] dir : directions) {
            int nr = r + dir[0], nc = c + dir[1];
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == 1) {
                uf.union(idx, nr * cols + nc);
            }
        }
        result.add(uf.getCount());
    }
    return result;
}

// Time: O(k * α(n)) | Space: O(rows * cols)
```

</div>

### 2. Component Size Tracking with Weighted Union

Sometimes you need to know component sizes, not just connectivity. Maintain a `size` array that updates during union operations.

**LeetCode Examples:** Largest Component Size by Common Factor (#952), Friend Circles (#547), Accounts Merge (#721)

The intuition: When merging components, the size of the new component is the sum of both sizes. This is crucial for problems asking for the largest connected component or needing to process all members of a component.

<div class="code-group">

```python
class UnionFindWithSize:
    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1] * n  # Track component sizes
        self.max_size = 1

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):
        root_x = self.find(x)
        root_y = self.find(y)
        if root_x == root_y:
            return
        # Weighted union (by size)
        if self.size[root_x] < self.size[root_y]:
            root_x, root_y = root_y, root_x
        self.parent[root_y] = root_x
        self.size[root_x] += self.size[root_y]
        self.max_size = max(self.max_size, self.size[root_x])

# Time: O(n * α(n)) | Space: O(n)
```

```javascript
class UnionFindWithSize {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.size = Array(n).fill(1);
    this.maxSize = 1;
  }

  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(x, y) {
    const rootX = this.find(x);
    const rootY = this.find(y);
    if (rootX === rootY) return;

    if (this.size[rootX] < this.size[rootY]) {
      [rootX, rootY] = [rootY, rootX];
    }
    this.parent[rootY] = rootX;
    this.size[rootX] += this.size[rootY];
    this.maxSize = Math.max(this.maxSize, this.size[rootX]);
  }
}

// Time: O(n * α(n)) | Space: O(n)
```

```java
class UnionFindWithSize {
    private int[] parent;
    private int[] size;
    private int maxSize;

    public UnionFindWithSize(int n) {
        parent = new int[n];
        size = new int[n];
        maxSize = 1;
        for (int i = 0; i < n; i++) {
            parent[i] = i;
            size[i] = 1;
        }
    }

    public int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }

    public void union(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);
        if (rootX == rootY) return;

        if (size[rootX] < size[rootY]) {
            int temp = rootX;
            rootX = rootY;
            rootY = temp;
        }
        parent[rootY] = rootX;
        size[rootX] += size[rootY];
        maxSize = Math.max(maxSize, size[rootX]);
    }

    public int getMaxSize() { return maxSize; }
}

// Time: O(n * α(n)) | Space: O(n)
```

</div>

### 3. Virtual Nodes for Complex Relationships

Some problems involve relationships that aren’t direct connections. Create virtual nodes to represent states or categories.

**LeetCode Examples:** Satisfiability of Equality Equations (#990), Evaluate Division (#399), Smallest String With Swaps (#1202)

The intuition: When elements can be in multiple categories or have transitive relationships through intermediaries, create additional nodes to represent these categories. For example, in equation satisfaction, you might create nodes for “equal to” and “not equal to” relationships.

## When to Use Union-Find vs Alternatives

The key decision criteria:

1. **Dynamic vs Static Connectivity**: Use Union-Find when connections are added dynamically (like Number of Islands II). Use BFS/DFS when the entire graph is known upfront.
2. **Multiple Connectivity Queries**: Union-Find shines when you need to answer many “are these connected?” queries efficiently after building the structure.
3. **Component Merging**: If the problem involves merging groups (friends, accounts, regions), Union-Find’s union operation is more intuitive than graph traversal.
4. **Space Considerations**: Union-Find uses O(n) space for parent/rank arrays. BFS/DFS may use O(n) for visited sets but also O(n) for recursion stack or queue.

**Decision Flow**:

- Is connectivity changing during the problem? → Union-Find
- Do you need the largest component size? → Union-Find with size tracking
- Is the graph static and you need path information? → BFS/DFS
- Are you checking connectivity between specific pairs many times? → Union-Find

## Edge Cases and Gotchas

1. **Off-by-One in Coordinate Mapping**: When converting 2D grid coordinates to 1D indices, use `row * cols + col`, not `row * rows + col`. Test with non-square grids.
2. **Duplicate Unions**: If your input might contain the same connection multiple times, check `find(x) == find(y)` before union to avoid incorrect rank/size updates.
3. **Empty/Zero-Size Inputs**: Always handle n=0 or empty positions arrays. Your Union-Find constructor should handle this gracefully.
4. **Path Compression in Find**: Without path compression, operations degrade to O(log n) amortized. With it, they’re O(α(n)). Always implement it.
5. **Integer Overflow in Size Tracking**: When components get large (millions of elements), size addition might overflow 32-bit integers. Use 64-bit integers in languages that need it.

## Difficulty Breakdown

The distribution—1% Easy, 53% Medium, 46% Hard—tells a clear story: Union-Find is primarily an **intermediate-to-advanced** technique. Companies use it to differentiate candidates.

**Study prioritization**:

1. **Start with Mediums**: Master the core patterns in problems like Number of Provinces (#547) and Redundant Connection (#684).
2. **Progress to Hard Dynamic Problems**: Number of Islands II (#305) is the classic dynamic connectivity test.
3. **Tackle Creative Applications**: Problems like Largest Component Size by Common Factor (#952) require combining Union-Find with number theory.

## Which Companies Ask Union-Find

- **Google** (/company/google): Favors creative applications combining Union-Find with other concepts. Expect problems like #952 (factor-based connectivity) or #305 (dynamic grid connectivity).
- **Amazon** (/company/amazon): Leans toward practical applications—account merging, friend suggestions, warehouse connectivity. Problems like #721 (Accounts Merge) are representative.
- **Meta** (/company/meta): Often tests graph connectivity in social network contexts. Friend Circles (#547) is a classic example.
- **Microsoft** (/company/microsoft): Mixes classic algorithm problems with creative twists. Satisfiability of Equality Equations (#990) is a good example.
- **Uber** (/company/uber): Tends toward geographical/connectivity problems with real-world mapping applications.

Each company’s style reflects their engineering challenges: Google tests algorithmic creativity, Amazon tests practical data merging, Meta tests social graphs.

## Study Tips

1. **Implement From Memory**: Don’t just understand Union-Find—be able to implement the optimized version (path compression + union by rank) in under 3 minutes. Practice this daily.
2. **Problem Progression Order**:
   - Redundant Connection (#684) – Basic union-find application
   - Number of Provinces (#547) – Grid connectivity
   - Number of Islands II (#305) – Dynamic connectivity
   - Accounts Merge (#721) – Component processing
   - Largest Component Size by Common Factor (#952) – Advanced application
3. **Visualize the Forest**: Draw the tree structure during practice. Understanding how path compression flattens trees helps debug complex problems.
4. **Time Yourself on Mediums**: Aim for 15 minutes from problem reading to working solution for Medium difficulty Union-Find problems.

Union-Find turns intimidating connectivity problems into manageable near-linear-time solutions. The patterns repeat: dynamic grids, component tracking, virtual nodes. Master these, and you’ll have an answer when the interviewer asks for that efficient connectivity solution.

[Practice all Union-Find questions on CodeJeet](/topic/union-find)
