#include <iostream>
using namespace std;

struct Node {
  int data;
  Node* next;
  Node(int value) : data(value), next(nullptr) {}
};

class LinkedList {
 public:
  Node* head;
  Node* tail;

  LinkedList() : head(nullptr), tail(nullptr) {}

  ~LinkedList() {
    while (head != nullptr) {
      Node* nextNode = head->next;
      delete head;
      head = nextNode;
    }
  }

  // TODO: implement insertAtTail so that values appended in order
  //       are printed in the same order they were inserted.
  // hint: handle the empty-list case (head == nullptr) separately,
  //       then in the common case hook the new node onto tail->next
  //       and advance tail.
  void insertAtTail(int value) {
    // your code here
  }

  void print() const {
    Node* current = head;
    while (current != nullptr) {
      cout << current->data;
      if (current->next != nullptr) cout << " ";
      current = current->next;
    }
    cout << "\n";
  }
};

int main() {
  LinkedList list;
  int value;
  while (cin >> value) {
    if (value == -1) break;
    list.insertAtTail(value);
  }
  list.print();
  return 0;
}
