import { Fiber } from '@/react-reconciler/ReactFiber';
import { ExpirationTime, NoWork } from '@/react-reconciler/ReactFiberExpirationTime';
import * as CommitWork from '@/react-reconciler/ReactFiberCommitWork';

let isWorking: boolean = false;
let isRendering: boolean = false;
let isCommiting: boolean = false;

let nextUnitOfWork: Fiber | null = null

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

/** ツリー状のFiberのRootを受け取り、そのTreeの beginWork, completeWork を行う */
function renderRoot(root: Fiber): void {
  isWorking = true;
  nextUnitOfWork = createWorkInProgress(root);
  workLoop();
}

/** fiberをひとつずつに対し beginWork, completeWork をする */
function workLoop(): void {
  while (nextUnitOfWork != null) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }
}

function performUnitOfWork(workInProgress: Fiber): Fiber | null {
  const current: Fiber = workInProgress.alternate;
  let next: Fiber | null = beginWork(current, workInProgress);
  workInProgress.memoizedProps = workInProgress.pendingProps;
  if (next === null) {
    next = completeUnitOfWork(workInProgress);
  }
  return next;
}

function completeUnitOfWork(workInProgress: Fiber): Fiber | null {
  const current: Fiber = workInProgress.alternate;
  const returnFiber: Fiber = workInProgress.return;   // Treeの親Fiber
  const siblingFiber: Fiber = workInProgress.sibling; // Treeの兄弟Fiber

  nextUnitOfWork = completeWork(current, workInProgress);
  if (nextUnitOfWork !== null) {
    return nextUnitOfWork;
  }
  if (siblingFiber !== null) {
    return siblingFiber;
  }
  if (returnFiber != null) {
    return returnFiber;
  }

}

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
      CommitWork.commitBeforeMutationLifeCycles();
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

  while (nextEffect !== null) {
    try {
      commitAllLifeCycles(root);
    } catch (e) {
      // 省略
    }
  }

  isCommitting = false;
  isWorking = false;
  onCommitRoot(finishedWork.stateNode);
  onCommit(root);
}

function commitAllLifeCycles(finishedRoot: Fiber): void {
  while (nextEffect !== null) {
    CommitWork.commitLifeCycles();
  }
}