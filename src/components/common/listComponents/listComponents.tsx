import MemoEditMore from '@/src/icons/edit-more';
import MemoTrash from '@/src/icons/trash';
import {ICellRendererParams} from 'ag-grid-community';
import NoStyleButton from '../button/noStyleButton';
import StyledLink from '../link/link';

export const deleteCellRenderer = (
  params: ICellRendererParams,
  onClick: () => void,
  showOnFolder?: boolean,
) => {
  if (
    (typeof showOnFolder === 'undefined' || !showOnFolder) &&
    params.data &&
    params.data.type === 'folder'
  )
    return '';

  return (
    <NoStyleButton
      data-testid={`deleteButton_${params.data.id}`}
      onClick={onClick}
    >
      <MemoTrash />
    </NoStyleButton>
  );
};
export const editCellRenderer = (
  params: ICellRendererParams,
  onClick: () => void,
  showOnFolder?: boolean,
) => {
  if (
    (typeof showOnFolder === 'undefined' || !showOnFolder) &&
    params.data &&
    params.data.type === 'folder'
  )
    return '';

  return (
    <NoStyleButton
      data-testid={`editButton_${params.data.id}`}
      className="editButton"
      onClick={onClick}
    >
      <MemoEditMore />
    </NoStyleButton>
  );
};

export const linkEditCellRenderer = (href: string) => {
  return (
    <StyledLink className="gridIconLink editButton" href={href}>
      <MemoEditMore />
    </StyledLink>
  );
};
