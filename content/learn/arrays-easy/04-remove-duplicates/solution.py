def remove_duplicates(a):
    if not a:
        return 0
    write = 0
    for read in range(1, len(a)):
        if a[read] != a[write]:
            write += 1
            a[write] = a[read]
    return write + 1


n = int(input())
a = list(map(int, input().split())) if n > 0 else []
k = remove_duplicates(a)
print(k)
print(" ".join(str(x) for x in a[:k]))
