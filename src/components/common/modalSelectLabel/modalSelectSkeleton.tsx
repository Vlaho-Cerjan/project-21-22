import Skeleton from '../skeleton/skeleton';

export default function ModalSelectSkeleton() {
  return (
    <div className="modalSelectSkeleton">
      <Skeleton className="labelSkeleton" />
      <Skeleton className="selectSkeleton" />
    </div>
  );
}
