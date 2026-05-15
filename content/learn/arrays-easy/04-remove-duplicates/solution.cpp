#include <iostream>
#include <vector>
using namespace std;

int removeDuplicates(vector<int>& a) {
    if (a.empty()) return 0;
    int write = 0;
    for (size_t read = 1; read < a.size(); read++) {
        if (a[read] != a[write]) {
            write++;
            a[write] = a[read];
        }
    }
    return write + 1;
}

int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    int k = removeDuplicates(a);
    cout << k << "\n";
    for (int i = 0; i < k; i++) {
        if (i) cout << " ";
        cout << a[i];
    }
    cout << "\n";
    return 0;
}
