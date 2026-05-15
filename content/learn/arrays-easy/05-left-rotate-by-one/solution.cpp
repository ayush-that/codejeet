#include <iostream>
#include <vector>
using namespace std;

void leftRotateByOne(vector<int>& a) {
    if (a.empty()) return;
    int first = a[0];
    for (size_t i = 0; i + 1 < a.size(); i++) {
        a[i] = a[i + 1];
    }
    a[a.size() - 1] = first;
}

int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    leftRotateByOne(a);
    for (int i = 0; i < n; i++) {
        if (i) cout << " ";
        cout << a[i];
    }
    cout << "\n";
    return 0;
}
