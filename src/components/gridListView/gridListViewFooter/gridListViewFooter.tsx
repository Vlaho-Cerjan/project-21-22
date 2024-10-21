import MemoLeftArrow from '@/src/icons/left-arrow';
import MemoRightArrow from '@/src/icons/right-arrow';
import IconButton from '../../common/iconButton/iconButton';

export default function GridListViewFooter({
  page,
  setPage,
  pageSize,
}: {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  pageSize: number;
}) {
  return (
    <div
      data-testid="folderViewContentFooter"
      className="folderViewContentFooter"
    >
      <div className="folderViewContentFooterLeft" />
      <div className="folderViewContentFooterRight">
        <div
          data-testid="folderViewPagination"
          className="folderViewPagination"
        >
          <IconButton
            data-testid="folderViewPaginationButtonLeft"
            className="folderViewPaginationButton"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            icon={<MemoLeftArrow />}
          />
          <div
            data-testid="folderViewPaginationPage"
            className="folderViewPaginationPage"
          >
            {page} out of {pageSize}
          </div>
          <IconButton
            data-testid="folderViewPaginationButtonRight"
            className="folderViewPaginationButton"
            onClick={() => setPage(page + 1)}
            disabled={page === pageSize}
            icon={<MemoRightArrow />}
          />
        </div>
      </div>
    </div>
  );
}
