import { Fiber } from '@/react-reconciler/ReactFiber';
import { FunctionComponent, ClassComponent } from '@/shared/ReactWorkTags';

export function commitHookEffectList() {}

export function commitLifeCycles(finishedWork: Fiber): void {
  switch (finishedWork.tag) {
    case FunctionComponent:
      commitHookEffectList();
      break;
    case ClassComponent:
      const instance = finishedWork.stateNode;
      instance.componentDidMount();
      break;
    default:
      break;
  }
}

export function commitBeforeMutationLifeCycles() {}