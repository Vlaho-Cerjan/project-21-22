import Skeleton from '../skeleton/skeleton';

export default function ModalInputSkeleton() {
  return (
    <div className="modalInputSkeleton">
      <Skeleton className="labelSkeleton" />
      <Skeleton className="inputSkeleton" />
    </div>
  );
}
