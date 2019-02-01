import { Fiber } from '@/react-reconciler/ReactFiber';
import { ExpirationTime, NoWork } from '@/react-reconciler/ReactFiberExpirationTime';
import { finished } from 'stream';

let isWorking: boolean = false;
let isRendering: boolean = false;
let isCommiting: boolean = false;

let nextUnitOnWork: Fiber | null = null

let nextEffect: Fiber | null = null;

let nextFlushedRoot: any = null;
let nextFlushedExpirationTime: ExpirationTime = NoWork;


function performWork(minExpirationTime: ExpirationTime, isYieldy: boolean): void {
  // 優先度をみて次に実効するrootFiberをglobalにセット
  findHighestPriorityRoot();

  while (
    nextFlushedRoot !== null &&                      // 次に実行すべきRootがあり
    nextFlushedExpirationTime !== NoWork &&          // 次に実行すべきRootのPriorityがNoWorkでない
    minExpirationTime <= nextFlushedExpirationTime   // 次に実行すべきRootのPriorityがここで実行すべき最低位優先度以上
  ) {
    performWorkOnRoot(nextFlushedRoot, nextFlushedExpirationTime);
    findHighestPriorityRoot();
  }
}

function findHighestPriorityRoot(): void {
  // 今のrootのnextRootをとってきて、優先度チェックして実行に値するかをチェック
}

function performWorkOnRoot(root:Fiber, expirationTime: ExpirationTime): void {
  isRendering = true;
  let finishedWork = root.finishedWork;
  if (finishedWork !== null) {
    // 既にrender済みの物がある場合
    completeRoot(root, finishedWork, expirationTime);
  } else {
    // ない場合はReenderから
    renderRoot(root);
    finishedWork = root.finishedWork;
    completeRoot(root, finishedWork, expirationTime);
  }
  isRendering = false;
}

function renderRoot() {}

function completeRoot(root: Fiber, finishedWork: Fiber, expirationTime: ExpirationTime): void {
  root.finishedWork = null;
  commitRoot(root, finishedWork);
}

function commitRoot(root: Fiber, finishedWork: Fiber) {
  isWorking = true;
  isCommiting = true;
  // firstEffects
  while (nextEffect != null) {
    try {
      commitBeforeMutationLifecycles();
    } catch (e) {
      // 省略
    }
  }
  while (nextEffect != null) {
    try {
      commitAllHostEffects();
    } catch (e) {
      // 省略
    }
  }

  // commit完了した時点でworkInProgressのものがcurrentになる
  root.current = finishedWork;

  isCommitting = false;
  isWorking = false;
  onCommitRoot(finishedWork.stateNode);
  onCommit(root);
}