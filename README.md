SyncPromise
===

A synchronous promise polyfill based on
[promise-lite](https://github.com/gera2ld/promise-lite).

Why this?
---
Promise is a native asynchronous way to handle operations. But it fails webSQL
and indexedDB transactions in some browsers because of at least two kinds of
reasons:

1. Transactions should be short lived, so they should be closed before returning
   back to main event loop. In some browsers (e.g. Firefox), the tranaction will
   be closed whenever we exit the current event loop, even if we are using
   `Promise` and should not really go back to main event loop. However, Chrome
   works well with this via native `Promise`.
1. Some browsers do not support native `Promise`s, while the polyfills implement
   asynchronous `Promise`s by `setTimeout` or `requestAnimationFrame`, which
   will go back to main event loop for a while and fail the transactions of
   course.

To solve the problems above, this special polyfill is implemented.
