export interface Fiber {
  tag,
  pendingProps,
  memoizedProps,
  alternate,
}

function FiberNode(tag, pendingProps): void {
  this.tag = tag;
  
  this.pendingProps = pendingProps;
  this.memoizedProps = null;
  
  this.alternate = null;
}

export function createFiber(tag, pendingProps): Fiber {
  return new FiberNode(tag, pendingProps);
}