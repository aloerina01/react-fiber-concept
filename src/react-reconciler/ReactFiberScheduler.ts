import { Fiber } from '@/react-reconciler/ReactFiber';

let isWorking: boolean = false;

let nextUnitOnWork: Fiber | null = null

let nextFlushedRoot
let nextFlushedExpirationTime


function performWork(): void {
  // 優先度をみて次に実効するrootFiberをglobalにセット
  findHighestPriorityRoot();

  while (
    nextFlushedRoot !== null &&            // 次に実行すべきRootがあり
    nextFlushedExpirationTime !== NoWork   // 次に実行すべきRootのPriorityがNoWorkでない
  ) {
    performWorkOnRoot(nextFlushedRoot, nextFlushedExpirationTime);
    findHighestPriorityRoot();
  }
}