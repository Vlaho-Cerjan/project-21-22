import {wrapGrid} from 'animate-css-grid';
import NextImage from 'next/image';
import React from 'react';
import {Tooltip} from 'react-tooltip';

import MemoCheckTick from '@/src/icons/check-tick';
import MemoCloudUpload from '@/src/icons/cloud-upload';
import MemoEditMore from '@/src/icons/edit-more';
import MemoFolder from '@/src/icons/folder';
import MemoFolderLarge from '@/src/icons/folder-large';
import MemoMediaText from '@/src/icons/media-text';
import MemoScheduleIcon from '@/src/icons/schedule-icon';

import type {GridData} from '@/types/gridData';
import NoStyleButton from '../../common/button/noStyleButton';
import Title from '../../common/title/title';

export default function CardView({
  selectedFolder,
  prevFolder,
  rootData,
  setRootData,
  onFolderDoubleClick,
  selectedItems,
  breadcrumbs,
  onBreadcrumbClick,
  // findFolder,
  onItemDeSelect,
  isModalOpen,
  onMediaEdit,
  noUpload,
  isVisible,
  hardcodedTopFolders,
  placeName,
  noSelect,
  onFileUpload,
  onDragDropItem,
}: {
  selectedFolder: {
    id: string;
    level: string;
  } | null;
  prevFolder: {
    id: string;
    name: string;
  } | null;
  rootData: GridData[];
  setRootData: React.Dispatch<React.SetStateAction<GridData[]>>;
  onFolderDoubleClick: (folder: GridData) => void;
  selectedItems: GridData[];
  breadcrumbs: {
    id: string;
    name: string;
  }[];
  onBreadcrumbClick: (id: string) => void;
  // findFolder: (id: string) => Promise<GridData | undefined>;
  onItemDeSelect: (items: GridData[]) => void;
  isModalOpen?: boolean;
  onMediaEdit: (media: any) => void;
  noUpload?: boolean;
  isVisible?: boolean;
  hardcodedTopFolders?: boolean;
  placeName: string;
  noSelect?: boolean;
  onFileUpload?: ({
    name,
    url,
    type,
    folderId,
  }: {
    name: string;
    url: string;
    type: string;
    folderId?: string;
  }) => void;
  onDragDropItem?: ({
    item,
    destination,
  }: {
    item: GridData;
    destination: string;
  }) => Promise<{
    success: boolean;
  }>;
}) {
  const [dragType, setDragType] = React.useState<'file' | 'component' | null>(
    null,
  );
  const [selectedItem, setSelectedItem] = React.useState<{
    id: string;
    level: string;
    type: string;
  } | null>(null);
  const [editableId, setEditableId] = React.useState<string | null>(null);
  const [dragFolderId, setDragFolderId] = React.useState<string | null>(null);
  const [dragItemId, setDragItemId] = React.useState<string | null>(null);
  const [dragPlace, setDragPlace] = React.useState('Media');
  const [isDragNDrop, setIsDragNDrop] = React.useState<number>(-1);

  React.useEffect(() => {
    const grid = document.querySelector('.folderViewContentGrid');
    if (grid) {
      setTimeout(() => {
        wrapGrid(grid as HTMLElement, {
          duration: 250,
          stagger: 5,
        });
      }, 1000);
    }
  }, [isVisible]);

  const onBlur = (e: React.FocusEvent<HTMLSpanElement>) => {
    // find item recursively through rootData and mediaData in rootData and mediaData and update the name
    const itemId = e.currentTarget.id;
    const itemName = e.currentTarget.textContent || '';
    setRootData((prevRootData) => {
      const updatedRootData = prevRootData.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            name: itemName,
          };
        }
        return item;
      });
      return updatedRootData;
    });
    const sel = window?.getSelection();
    if (sel) {
      sel.removeAllRanges();
    }
    setTimeout(() => {
      setEditableId(null);
    }, 500);
  };

  const onFolderSelected = (
    e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>,
    media: GridData,
  ) => {
    const spanInput = document.querySelector(
      '.spanInput[contenteditable="true"]',
    );
    const editContainer = document.querySelector('.editContainer');
    if (
      e.target === editContainer ||
      (e.target as HTMLElement).closest('.editContainer')
    )
      return;
    if (spanInput) {
      (spanInput as HTMLElement).blur();
      return;
    }
    if ((e.target as HTMLElement).classList.contains('spanInput')) return;
    if (document.activeElement?.classList.contains('spanInput')) {
      (document.activeElement as HTMLElement).blur();
      return;
    }
    const activeItemsIds = Array.from(selectedItems).map((item) => item.id);
    const items = rootData.filter((item) => activeItemsIds.includes(item.id));
    const item = items.find((tempItem) => tempItem.id === media.id);

    const findAllRelatedItems = (
      dataItem: GridData,
      searchData: GridData[],
      result: GridData[],
    ) => {
      searchData.forEach((tempItem) => {
        if (tempItem.folderId === dataItem.id) {
          result.push(tempItem);
          if (tempItem.type === 'folder') {
            findAllRelatedItems(
              tempItem,
              rootData.filter(
                (searchItem) => searchItem.folderId === tempItem.id,
              ),
              result,
            );
          }
        }
      });
    };
    const result: GridData[] = [media];
    findAllRelatedItems(media, rootData, result);
    if (item) {
      // remove all items that are in this folder recursively if there are subfolders
      onItemDeSelect(items.filter((tempItem) => !result.includes(tempItem)));
    } else {
      onItemDeSelect([...items, ...result]);
    }
  };

  const onMediaSelected = (
    e: React.MouseEvent<HTMLButtonElement>,
    media: GridData,
  ) => {
    const spanInput = document.querySelector(
      '.spanInput[contenteditable="true"]',
    );
    const editContainer = document.querySelector('.editContainer');
    if (
      e.target === editContainer ||
      (e.target as HTMLElement).closest('.editContainer')
    )
      return;
    if (spanInput) {
      (spanInput as HTMLElement).blur();
      return;
    }
    if ((e.target as HTMLElement).classList.contains('spanInput')) return;
    if (document.activeElement?.classList.contains('spanInput')) {
      (document.activeElement as HTMLElement).blur();
      return;
    }
    const activeItemsIds = Array.from(selectedItems).map((item) => item.id);
    const items = rootData.filter((item) => activeItemsIds.includes(item.id));
    const item = items.find((tempItem) => tempItem.id === media.id);
    if (item) {
      onItemDeSelect(items.filter((tempItem) => tempItem.id !== media.id));
    } else {
      onItemDeSelect([...items, media]);
    }
  };

  React.useEffect(() => {
    const folderViewContentWrapper = document.getElementById(
      'folderViewContentWrapper',
    );
    // drag and drop
    const onDragOver = async (e: DragEvent) => {
      e.preventDefault();
      const target = e.target as HTMLElement;
      if (isModalOpen) return;
      if (
        e.dataTransfer?.types.includes('Files') &&
        (typeof noUpload === 'undefined' || !noUpload)
      ) {
        if (
          target !== folderViewContentWrapper &&
          !(target as HTMLElement).closest('#folderViewContentWrapper')
        ) {
          if (e.dataTransfer && e.dataTransfer.types.length > 0) {
            e.preventDefault();
            setIsDragNDrop(0);
            setDragPlace('Media');
          }
        }
        if (
          ((target as HTMLElement).classList.contains(
            'folderViewContentGridItem',
          ) &&
            (target as HTMLElement).classList.contains('folderItem')) ||
          (target as HTMLElement).closest(
            '.folderItem.folderViewContentGridItem',
          )
        ) {
          const folderItem = (target as HTMLElement).classList.contains(
            'folderViewContentGridItem',
          )
            ? (target as HTMLElement)
            : ((target as HTMLElement).closest(
                '.folderViewContentGridItem',
              ) as HTMLElement);
          const folderId = folderItem.id;
          if (selectedFolder?.id === folderId) {
            if (folderItem) {
              const folderName =
                folderItem.getAttribute('data-name') || 'Folder';
              setDragPlace(folderName || 'Folder');
              setIsDragNDrop(1);
              setSelectedItem({
                id: folderItem.id,
                level: folderItem.getAttribute('data-level') || 'top',
                type: 'folder',
              });
            }
            return;
          }
          setDragPlace(folderItem.getAttribute('data-name') || '');
          setIsDragNDrop(1);
          setSelectedItem({
            id: folderItem.id,
            level: folderItem.getAttribute('data-level') || 'top',
            type: 'folder',
          });
        } else {
          setIsDragNDrop(0);
          setDragPlace('Media');
          setSelectedItem(null);
        }
      } else if (e.dataTransfer?.types.length === 0) {
        if (
          target !== folderViewContentWrapper &&
          target instanceof HTMLElement &&
          !(target as HTMLElement).closest('#folderViewContentWrapper')
        ) {
          if (e.dataTransfer && e.dataTransfer.types.length > 0) {
            setDragPlace('Media');
            setIsDragNDrop(2);
          }
        }
        if (
          (typeof (target as HTMLElement).classList !== 'undefined' &&
            (target as HTMLElement).classList.contains(
              'folderViewContentGridItem',
            ) &&
            (target as HTMLElement).classList.contains('folderItem')) ||
          (target as HTMLElement).closest(
            '.folderItem.folderViewContentGridItem',
          )
        ) {
          const folderItem = (target as HTMLElement).classList.contains(
            'folderViewContentGridItem',
          )
            ? (target as HTMLElement)
            : ((target as HTMLElement).closest(
                '.folderViewContentGridItem',
              ) as HTMLElement);
          const folderId = folderItem.id;
          if (dragFolderId === folderId) {
            setIsDragNDrop(1);
            setSelectedItem(null);
            return;
          }
          if (selectedFolder?.id === folderId) {
            const folderName = folderItem.getAttribute('data-name');
            setDragPlace(folderName || 'Folder');
            setIsDragNDrop(1);
            setSelectedItem({
              id: folderItem.id,
              level: folderItem.getAttribute('data-level') || 'top',
              type: 'folder',
            });
            return;
          }
          setDragPlace(folderItem.getAttribute('data-name') || 'Folder');
          setIsDragNDrop(1);
          setSelectedItem({
            id: folderItem.id,
            level: folderItem.getAttribute('data-level') || 'top',
            type: 'folder',
          });
        } else {
          setIsDragNDrop(2);
          setSelectedItem(null);
        }
      }
    };

    const onDragLeave = (e: DragEvent) => {
      e.preventDefault();
      setIsDragNDrop(-1);
    };

    const onDragDrop = async (e: DragEvent) => {
      e.preventDefault();
      if (isModalOpen) {
        setIsDragNDrop(-1);
        setDragFolderId(null);
        setSelectedItem(null);
        setDragPlace('Media');
        setDragType(null);
        return;
      }
      if (
        e.dataTransfer?.types.includes('Files') &&
        (typeof noUpload === 'undefined' || !noUpload) &&
        typeof onFileUpload !== 'undefined'
      ) {
        if (e?.dataTransfer) {
          e.dataTransfer.dropEffect = 'move';
        }
        if (
          e.target === folderViewContentWrapper ||
          (e.target as HTMLElement).closest('#folderViewContentWrapper')
        ) {
          const target = e.target as HTMLElement;
          // get file data from dataTransfer and add to folder
          const {files} = e.dataTransfer;
          for (let i = 0; i < files.length; i += 1) {
            const file = files[i];
            if (file) {
              const reader = new FileReader();
              reader.readAsDataURL(file);
              let type = 'image';
              if (file.type === 'video/mp4') type = 'video';
              if (file.type === 'text/plain') type = 'text';
              reader.addEventListener('load', () => {
                if (reader.result && typeof reader.result === 'string') {
                  onFileUpload({
                    name: file.name,
                    url: reader.result,
                    type,
                    folderId: target.id,
                  });
                }
              });
            }
          }
          // setRootData([...rootData, ...fileData]);
        }
      } else if (e.dataTransfer?.types.length === 0) {
        // move item to folder that's the target
        if (dragItemId) {
          const destination =
            (e.target as HTMLElement).classList.contains(
              'folderViewContentGridItem',
            ) && (e.target as HTMLElement).classList.contains('folderItem')
              ? (e.target as HTMLElement)
              : ((e.target as HTMLElement).closest(
                  '.folderItem.folderViewContentGridItem',
                ) as HTMLElement) || null;
          const source = dragItemId;
          const sourceFolderId = selectedFolder?.id || 'root';
          // console.log(destination, sourceFolderId, dragFolderId, 'drag drop');
          // TODO fix find folder issue below

          if (
            !destination ||
            destination?.id === sourceFolderId ||
            destination?.id === dragFolderId ||
            (hardcodedTopFolders && dragFolderId)
          ) {
            setIsDragNDrop(-1);
            setDragFolderId(null);
            setSelectedItem(null);
            setDragPlace('Media');
            setDragType(null);
            return;
          }

          const item = rootData.find((tempItem) => tempItem.id === source);

          if (item && typeof onDragDropItem !== 'undefined') {
            const res = await onDragDropItem({
              item,
              destination:
                destination?.id === '-1' ? '' : destination?.id || '',
            });

            if (res.success) {
              const newRootData = rootData.filter(
                (tempItem) => tempItem.id !== source,
              );
              setRootData(newRootData);
            }
          }
        }
      }
      setIsDragNDrop(-1);
      setDragFolderId(null);
      setSelectedItem(null);
      setDragPlace('Media');
      setDragType(null);
    };

    document.addEventListener('dragover', onDragOver);
    document.addEventListener('dragleave', onDragLeave);
    document.addEventListener('drop', onDragDrop);
    // touch events
    return () => {
      document.removeEventListener('dragover', onDragOver);
      document.removeEventListener('dragleave', onDragLeave);
      document.removeEventListener('drop', onDragDrop);
    };
  }, [
    rootData,
    dragFolderId,
    dragItemId,
    selectedFolder,
    selectedItem,
    prevFolder,
    isModalOpen,
  ]);

  return (
    <div
      className={`folderViewWrapper${
        dragType === 'component' ? ' folderOnly' : ''
      }${isDragNDrop === 0 ? ' dragActive' : ''}${
        isDragNDrop === 1 || isDragNDrop === 2
          ? ' dragActive folderDragActive'
          : ''
      }`}
    >
      <div id="folderViewContentWrapper" className="folderViewContentWrapper">
        <div className="folderViewContentGrid">
          {selectedFolder && (
            <div>
              <NoStyleButton
                id={`${prevFolder?.id}`}
                data-name={prevFolder?.name}
                onClick={() => {
                  const previousBreadcrumb = breadcrumbs[
                    breadcrumbs.length - 2
                  ] || {
                    id: '-1',
                    name: 'Media',
                  };
                  onBreadcrumbClick(previousBreadcrumb.id);
                }}
                className={`folderItem folderViewContentGridItem ${
                  selectedItem?.id === prevFolder?.id ? ' dragActive' : ''
                }`}
              >
                <div className="folderItem">
                  <div className="svgWrapper">
                    <MemoFolderLarge />
                  </div>
                </div>
                <Title>
                  <span
                    className="spanInput"
                    id={`backFoldername_${selectedFolder?.id}`}
                  >
                    ../
                  </span>
                </Title>
              </NoStyleButton>
            </div>
          )}
          {rootData &&
            rootData
              ?.filter((item) => item.type === 'folder')
              .map((media) => (
                <div key={`folder_${media.id}`}>
                  <NoStyleButton
                    id={`${media.id}`}
                    data-name={media.name}
                    data-level={media.group_id ? 'sub' : 'top'}
                    draggable={
                      typeof hardcodedTopFolders === 'undefined' ||
                      selectedFolder !== null
                    }
                    onDragStart={() => {
                      setDragFolderId(media.id || '');
                      setDragType('component');
                      setDragItemId(media.id || '');
                    }}
                    onKeyDown={(e) => {
                      if (
                        document.activeElement === e.currentTarget &&
                        e.key === 'Enter'
                      ) {
                        e.preventDefault();
                        setEditableId(media.id || '');
                        const nameId = document.getElementById(
                          `name_${media.id}`,
                        );
                        if (
                          nameId &&
                          (document.activeElement !== nameId ||
                            document.activeElement !== e.currentTarget)
                        ) {
                          (document.activeElement as HTMLElement).blur();
                          nameId.focus();
                          window?.getSelection()?.selectAllChildren(nameId);
                          window?.getSelection()?.collapseToEnd();
                        }
                      }
                    }}
                    onMouseOver={(e) => {
                      if (
                        document.activeElement?.classList.contains('spanInput')
                      )
                        return;
                      e.currentTarget.focus();
                    }}
                    onClick={(e) => {
                      if (
                        (e.target as Element).classList.contains(
                          'mediaCheck',
                        ) ||
                        (e.target as Element).closest('.mediaCheck')
                      )
                        return;
                      onFolderDoubleClick(media);
                    }}
                    className={`folderItem folderViewContentGridItem
                    ${dragFolderId === media.id ? ' folderDragging' : ''}
                ${
                  selectedItems &&
                  selectedItems.find((item) => item && item.id === media.id)
                    ? ' selected'
                    : ''
                }${selectedItem?.id === media.id ? ' dragActive' : ''}
                ${hardcodedTopFolders && dragFolderId ? ' blocked' : ''}
                `}
                  >
                    <div className="folderItem">
                      <div className="svgWrapper">
                        <MemoFolderLarge />
                      </div>
                      {typeof noSelect !== 'undefined' && noSelect ? null : (
                        <div
                          role="button"
                          aria-label="Select Media"
                          onClick={(e) => {
                            e.preventDefault();
                            onFolderSelected(e, media);
                          }}
                          className={`mediaCheck${
                            selectedItems.find(
                              (item) => item && item.id === media.id,
                            )
                              ? ' checked'
                              : ''
                          }`}
                        >
                          <div className="check">
                            <MemoCheckTick />
                          </div>
                        </div>
                      )}
                    </div>
                    <Title>
                      <span
                        className="spanInput"
                        id={`name_${media.id}`}
                        role="textbox"
                        contentEditable={editableId === media.id}
                        aria-label="Image Name"
                        tabIndex={0}
                        title={media.name}
                        onClick={(e) => {
                          e.preventDefault();
                          setEditableId(media.id || '');
                          const name = e.currentTarget as HTMLElement;
                          const range = document.createRange();
                          range.selectNodeContents(name);
                          const sel = window?.getSelection();
                          if (sel) {
                            sel.removeAllRanges();
                            sel.addRange(range);
                          }
                        }}
                        onBlur={onBlur}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            setEditableId(null);
                            if (document.activeElement)
                              (document.activeElement as HTMLElement).blur();
                          }
                        }}
                      >
                        {media.name}
                      </span>
                    </Title>
                  </NoStyleButton>
                </div>
              ))}
          {rootData &&
            rootData
              ?.filter((item) => item.type !== 'folder')
              .map((media) => (
                <div key={`image_${media.id}`}>
                  <NoStyleButton
                    id={`${media.id}`}
                    data-name={media.name}
                    data-level={media.group_id ? 'sub' : 'top'}
                    draggable
                    onDragStart={() => {
                      setDragItemId(media.id || '');
                      setDragType('component');
                    }}
                    onKeyDown={(e) => {
                      if (
                        document.activeElement === e.currentTarget &&
                        e.key === 'Enter'
                      ) {
                        e.preventDefault();
                        setEditableId(media.id || '');
                        const nameId = document.getElementById(
                          `name_${media.id}`,
                        );
                        if (
                          nameId &&
                          (document.activeElement !== nameId ||
                            document.activeElement !== e.currentTarget)
                        ) {
                          (document.activeElement as HTMLElement).blur();
                          nameId.focus();
                          window?.getSelection()?.selectAllChildren(nameId);
                          window?.getSelection()?.collapseToEnd();
                        }
                      }
                    }}
                    onMouseOver={(e) => {
                      if (
                        document.activeElement?.classList.contains('spanInput')
                      )
                        return;
                      e.currentTarget.focus();
                    }}
                    onClick={(e) => onMediaSelected(e, media)}
                    className={`folderViewContentGridItem
                ${
                  selectedItems.find((item) => item && item.id === media.id)
                    ? ' selected'
                    : ''
                }`}
                  >
                    <div
                      className={`folderItem imageItem ${
                        media.type === 'schedule' && 'scheduleItem'
                      }`}
                    >
                      <div className="imgWrapper">
                        {media.url || media.thumb ? (
                          <NextImage
                            draggable={false}
                            src={(media.thumb ? media.thumb : media.url) || ''}
                            alt={media.name || ''}
                            fill
                          />
                        ) : media.type === 'schedule' ? (
                          <div className="svgWrapper scheduleWrapper">
                            <MemoScheduleIcon />
                          </div>
                        ) : (
                          <div className="textRssContainer">
                            <div className="textRssIcon">
                              <MemoMediaText />
                            </div>
                            <div className="textRss">{media.text}</div>
                          </div>
                        )}
                      </div>
                      {typeof noSelect !== 'undefined' && noSelect ? null : (
                        <div
                          className={`mediaCheck${
                            selectedItems.find(
                              (item) => item && item.id === media.id,
                            )
                              ? ' checked'
                              : ''
                          }`}
                        >
                          <div className="check">
                            <MemoCheckTick />
                          </div>
                        </div>
                      )}
                      <div className="editContainer">
                        <div
                          data-tooltip-id="editMedia"
                          data-tooltip-content={`Edit ${media.name}`}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              onMediaEdit(media);
                            }
                          }}
                          onClick={() => {
                            onMediaEdit(media);
                          }}
                          role="button"
                          // set proper tabIndex based on index
                          tabIndex={0}
                          className="buttonElement"
                          aria-label="Edit Media Asset"
                        >
                          <MemoEditMore />
                        </div>
                      </div>
                    </div>
                    <Title>
                      <span
                        className="spanInput"
                        id={`name_${media.id}`}
                        role="textbox"
                        title={media.name}
                        contentEditable={editableId === media.id}
                        aria-label="Image Name"
                        tabIndex={0}
                        onClick={(e) => {
                          e.preventDefault();
                          setEditableId(media.id || '');
                          const name = e.currentTarget as HTMLElement;
                          const range = document.createRange();
                          range.selectNodeContents(name);
                          const sel = window?.getSelection();
                          if (sel) {
                            sel.removeAllRanges();
                            sel.addRange(range);
                          }
                        }}
                        onBlur={onBlur}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            setEditableId(null);
                            if (document.activeElement)
                              (document.activeElement as HTMLElement).blur();
                          }
                        }}
                      >
                        {media.name}
                      </span>
                    </Title>
                  </NoStyleButton>
                </div>
              ))}
        </div>
      </div>
      {(!rootData || rootData.length === 0) && (
        <div className="noData">
          <span>No {placeName} found</span>
        </div>
      )}
      <div
        className={`dropFilesHere${
          (isDragNDrop === 0 || isDragNDrop === 1) && dragType !== 'component'
            ? ' dragActive'
            : ''
        }`}
      >
        <MemoCloudUpload className="memoCloud" />
        <div className="textContainer">
          <span>Drop files to upload them to</span>
          <span className="folderName">
            <MemoFolder />
            {dragPlace}
          </span>
        </div>
      </div>
      <Tooltip id="editMedia" variant="info" />
    </div>
  );
}
