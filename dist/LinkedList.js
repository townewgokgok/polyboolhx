// (c) Copyright 2016, Sean Connelly (@voidqk), http://syntheti.cc
// MIT License
// Project Home: https://github.com/voidqk/polybooljs
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//
// simple linked list implementation that allows you to traverse down nodes and save positions
//
class LinkedList {
    constructor() {
        this.root = { root: true, next: null };
    }
    exists(node) {
        if (node == null || node == this.root)
            return false;
        return true;
    }
    isEmpty() {
        return this.root.next == null;
    }
    getHead() {
        return this.root.next;
    }
    insertBefore(node, check) {
        var last = this.root;
        var here = this.root.next;
        while (here != null) {
            if (check(here)) {
                node.prev = here.prev;
                node.next = here;
                here.prev.next = node;
                here.prev = node;
                return;
            }
            last = here;
            here = here.next;
        }
        last.next = node;
        node.prev = last;
        node.next = null;
    }
    findTransition(check) {
        var prev = this.root;
        var here = this.root.next;
        while (here != null) {
            if (check(here))
                break;
            prev = here;
            here = here.next;
        }
        return {
            before: prev === this.root ? null : prev,
            after: here,
            insert: function (node) {
                node.prev = prev;
                node.next = here;
                prev.next = node;
                if (here != null)
                    here.prev = node;
                return node;
            }
        };
    }
    static node(data) {
        data.prev = null;
        data.next = null;
        data.remove = function () {
            data.prev.next = data.next;
            if (data.next)
                data.next.prev = data.prev;
            data.prev = null;
            data.next = null;
        };
        return data;
    }
}
exports.LinkedList = LinkedList;
//# sourceMappingURL=LinkedList.js.map