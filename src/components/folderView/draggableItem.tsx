import {useDraggable} from '@dnd-kit/core';

import Item from './item';

export default function DraggableItem(props: any) {
  const {attributes, listeners, setNodeRef} = useDraggable({
    id: props.id,
    data: props.data,
  });

  return (
    <div ref={setNodeRef} {...attributes} {...listeners}>
      <Item>{props.children}</Item>
    </div>
  );
}
