import MemoLoading from '@/src/icons/loading';

export default function Loading({
  loading,
  classes,
}: {
  loading: boolean;
  classes?: string[];
}) {
  return (
    <div
      data-testid="loadingContainer"
      className={`loadingContainer${loading ? ' active' : ''}${classes ? ` ${classes.join(' ')}` : ''}`}
    >
      {loading && (
        <div className="loading">
          <div className="loadingSpinner">
            <MemoLoading />
          </div>
        </div>
      )}
    </div>
  );
}
