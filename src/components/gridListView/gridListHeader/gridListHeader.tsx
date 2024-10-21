import React from 'react';
import {useWindowSize} from 'usehooks-ts';

import MemoAddFolder from '@/src/icons/add-folder';
import MemoAddItem from '@/src/icons/add-item';
import MemoClear from '@/src/icons/clear';
import MemoSearch from '@/src/icons/search';
import MemoTrash from '@/src/icons/trash';
import IconButton from '../../common/iconButton/iconButton';
import Title from '../../common/title/title';

export default function GridListHeader({
  setOpenAddFolderModal,
  addFolderButtonDataId,
  addFolderTooltipText,
  addFolderIcon,
  showFolderButton,
  setOpenAddMediaModal,
  openSearchModal,
  setOpenSearchModal,
  placeName,
  type,
  onDeleteItems,
  selectedItems,
  addButtonTooltipText,
  addButtonIcon,
  id,
  deleteTooltipText,
  resetData,
  gridSearchText,
  searchText,
  approveButtonTooltipText,
  onApprove,
  approveButtonIcon,
  denyButtonTooltipText,
  onDeny,
  denyButtonIcon,
  addButtonDataId,
  denyButtonDataId,
  approveButtonDataId,
  openSearchModalDataId,
  clearSearchDataId,
  mobileClearSearchDataId,
  deleteButtonDataId,
  itemCount,
  showDeleteButton,
  noSearch,
}: {
  setOpenAddFolderModal: React.Dispatch<React.SetStateAction<boolean>>;
  addFolderButtonDataId?: string;
  addFolderTooltipText?: string;
  showFolderButton?: boolean;
  addFolderIcon?: React.ReactNode;
  setOpenAddMediaModal?: React.Dispatch<React.SetStateAction<boolean>>;
  openSearchModal: boolean;
  setOpenSearchModal: React.Dispatch<React.SetStateAction<boolean>>;
  placeName: string;
  type: 'modal' | 'page';
  onDeleteItems?: () => void;
  selectedItems?: any[];
  addButtonTooltipText?: string;
  addButtonIcon?: React.ReactNode;
  id?: string;
  deleteTooltipText?: string;
  resetData: () => void;
  gridSearchText?: string;
  searchText?: string;
  approveButtonTooltipText?: string;
  onApprove?: () => void;
  approveButtonIcon?: React.ReactNode;
  denyButtonTooltipText?: string;
  onDeny?: () => void;
  denyButtonIcon?: React.ReactNode;
  addButtonDataId?: string;
  denyButtonDataId?: string;
  approveButtonDataId?: string;
  openSearchModalDataId?: string;
  clearSearchDataId?: string;
  mobileClearSearchDataId?: string;
  deleteButtonDataId?: string;
  itemCount?: number;
  showDeleteButton?: boolean;
  noSearch?: boolean;
}) {
  const {width} = useWindowSize();

  React.useEffect(() => {
    const buttonSearchContainer = document.querySelector(
      '.buttonSearchContainer',
    );
    if (buttonSearchContainer && width > 768) {
      if (gridSearchText) {
        setTimeout(() => {
          const childrenWidthsCombined = Array.from(
            buttonSearchContainer.children,
          ).reduce((acc, child) => acc + child.clientWidth, 0);
          buttonSearchContainer.setAttribute(
            'style',
            `width: ${childrenWidthsCombined + 10}px`,
          );
        }, 290);
      } else {
        buttonSearchContainer.removeAttribute('style');
      }
    } else {
      buttonSearchContainer?.removeAttribute('style');
    }
  }, [gridSearchText, width]);

  return (
    <>
      <div className="folderViewHeader">
        <Title data-testid="pageHeading" component="h1" className="big">
          {placeName}
        </Title>
        <div className="buttonsContainer">
          {(typeof noSearch === 'undefined' || !noSearch) && (
            <div
              className={`buttonSearchContainer${
                gridSearchText && gridSearchText.length > 0 ? ' active' : ''
              }`}
            >
              <IconButton
                data-testid={openSearchModalDataId || 'openSearchButton'}
                data-tooltip-id={
                  !openSearchModal
                    ? `searchTooltip${id ? `_${id}` : ''}`
                    : undefined
                }
                data-tooltip-variant={
                  !itemCount || itemCount < 2 ? 'error' : undefined
                }
                data-tooltip-content={
                  !itemCount || itemCount < 2
                    ? 'Too few items to search'
                    : `Search ${placeName}`
                }
                containerProps={{
                  className: 'searchIconButton',
                }}
                disabled={!itemCount || itemCount < 1 || false}
                onClick={() => {
                  const input = document.querySelector(
                    '.searchInputContainer input',
                  );
                  setOpenSearchModal(true);
                  setTimeout(() => {
                    if (input && input instanceof HTMLInputElement)
                      input.focus();
                  }, 300);
                }}
                icon={<MemoSearch />}
              />
              <div className="buttonTextContainer">
                <div data-testid="searchText" className="buttonText">
                  {gridSearchText}
                </div>
                <IconButton
                  data-testid={clearSearchDataId || 'clearSearchButton'}
                  data-tooltip-id={`clearTooltip${id ? `_${id}` : ''}`}
                  data-tooltip-content="Clear Search"
                  onClick={() => {
                    if (typeof resetData !== 'undefined') resetData();
                  }}
                  icon={<MemoClear />}
                />
              </div>
            </div>
          )}
          {type === 'page' &&
            (typeof showDeleteButton === 'undefined' || showDeleteButton) &&
            typeof deleteButtonDataId !== 'undefined' && (
              <div className="deleteItemsContainer actionsItemsContainer">
                <IconButton
                  data-testid={deleteButtonDataId || 'deleteMediaButton'}
                  disabled={selectedItems?.length === 0}
                  onClick={onDeleteItems}
                  data-tooltip-id={`trashTooltip${id ? `_${id}` : ''}`}
                  data-tooltip-content={deleteTooltipText || 'Delete Media'}
                  icon={<MemoTrash />}
                />
                <div
                  className={`actionsItemsCount${
                    selectedItems?.length === 0 ? ' hidden' : ''
                  }`}
                >
                  {selectedItems?.length}
                </div>
              </div>
            )}
          {typeof onDeny !== 'undefined' && (
            <div className="approveDenyContainer actionsItemsContainer">
              <IconButton
                data-testid={denyButtonDataId || 'denyMediaButton'}
                disabled={selectedItems?.length === 0}
                onClick={onDeny}
                data-tooltip-id={`denyTooltip${id ? `_${id}` : ''}`}
                data-tooltip-content={denyButtonTooltipText || 'Deny'}
                icon={denyButtonIcon}
              />
              <div
                className={`actionsItemsCount${
                  selectedItems?.length === 0 ? ' hidden' : ''
                }`}
              >
                {selectedItems?.length}
              </div>
            </div>
          )}
          {typeof onApprove !== 'undefined' && (
            <div className="approveDenyContainer actionsItemsContainer">
              <IconButton
                data-testid={approveButtonDataId || 'approveMediaButton'}
                disabled={selectedItems?.length === 0}
                onClick={onApprove}
                data-tooltip-id={`approveTooltip${id ? `_${id}` : ''}`}
                data-tooltip-content={approveButtonTooltipText || 'Approve'}
                icon={approveButtonIcon}
              />
              <div
                className={`actionsItemsCount${
                  selectedItems?.length === 0 ? ' hidden' : ''
                }`}
              >
                {selectedItems?.length}
              </div>
            </div>
          )}
          {typeof showFolderButton !== 'undefined' && showFolderButton && (
            <IconButton
              onClick={() => setOpenAddFolderModal(true)}
              data-testid={addFolderButtonDataId || 'addFolderButton'}
              data-tooltip-id={`addFolderTooltip${id ? `_${id}` : ''}`}
              data-tooltip-content={addFolderTooltipText || 'Add Folder'}
              icon={addFolderIcon || <MemoAddFolder />}
            />
          )}
          {addButtonDataId && (
            <IconButton
              data-testid={addButtonDataId}
              onClick={() => {
                if (typeof setOpenAddMediaModal !== 'undefined')
                  setOpenAddMediaModal(true);
              }}
              data-tooltip-id={`addMediaTooltip${id ? `_${id}` : ''}`}
              data-tooltip-content={addButtonTooltipText || 'Add Media'}
              icon={addButtonIcon || <MemoAddItem />}
            />
          )}
        </div>
      </div>
      {(typeof noSearch === 'undefined' || !noSearch) && (
        <div
          className={`searchResultMobileContainer${
            gridSearchText && gridSearchText.length > 0 ? ' active' : ''
          }`}
        >
          <div className="searchResultContainer">
            <div className="searchText">{searchText}</div>
            <IconButton
              data-testid={mobileClearSearchDataId || 'mobileClearSearchButton'}
              data-tooltip-id="clearTooltip2"
              data-tooltip-content="Clear Search"
              onClick={() => {
                if (typeof resetData !== 'undefined') resetData();
              }}
              className="clearButton"
              icon={<MemoClear />}
            />
          </div>
        </div>
      )}
    </>
  );
}
