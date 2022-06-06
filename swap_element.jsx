import React, { useEffect } from 'react';
import { BsFillXDiamondFill } from 'react-icons/bs';
import '../../HomePage/Page/styles.scss.css';

const SwapElements = ({ provided, dragUpdateResult, setDropType }) => {
  useEffect(() => {
    if (dragUpdateResult) {
      HandleDragUpdate(dragUpdateResult);
    }
  }, [dragUpdateResult]);

  const HandleDragUpdate = (update) => {
    if (!update.destination) {
      return;
    }
    const draggableId = update.draggableId;
    const draggedDOM = getdraggableDOM(draggableId);
    if (!draggedDOM) {
      return;
    }
    let collections = draggedDOM.children;
    let draggablediv = [];
    for (var index in collections) {
      if (collections[parseInt(index)] && collections[index].style?.transform) {
        let hash = {
          draggableId: collections[index].dataset.rbdDraggableId,
          value: Math.max(...collections[index].style.transform.match(/\d+/g).map(Number)),
          collection_index: index
        };

        draggablediv = draggablediv.concat([hash]);
      }
    }
    for (index in collections) {
      if (collections[parseInt(index)] && collections[index].style?.transform) {
        collections[index].style.transform = `translate(0px, 0px)`;
        collections[index].className = '';
      }
    }
    collections[collections.length - 1].style.height = '2px';
  };

  const HandleButtonEvent = (event) => {
    if (event.type === 'mousedown') {
      setDropType('Row');
    }
  };

  return (
    <>
      <button
        className="view-item-button w-100 border-0 mt-2"
        {...provided.dragHandleProps}
        onMouseDown={(e) => HandleButtonEvent(e)}
      >
        <BsFillXDiamondFill className="bsfillxdiamondfill-icon text-white" size={19} />
      </button>
    </>
  );
};

const getdraggableDOM = (draggableId) => {
  const queryAttr = 'data-rbd-drag-handle-draggable-id';
  const domQuery = `[${queryAttr}='${draggableId}']`;
  let draggedDOM = document.querySelector(domQuery);
  let i = 0;
  while (i < 7) {
    draggedDOM = draggedDOM.parentElement;
    i++;
  } //for accessing parentDom for placeholder

  return draggedDOM;
};

const HandleDragEnd = (dragEndResult, items, setItems, setDropType) => {
  let collections = getdraggableDOM(dragEndResult.draggableId).children; // for removing placeholders
  for (var index in collections) {
    if (collections[index] && collections[index].className) {
      collections[index].className = '';
    }
  }
  if (
    (!dragEndResult.destination && !['Row', 'Column'].includes(dragEndResult.type)) ||
    dragEndResult.destination.index < 1
  ) {
    return;
  }
  if (dragEndResult.type === 'Row') {
    let selected_row_column = items[dragEndResult.source.index];
    let draggable_row_column = items[dragEndResult.destination.index];

    // Swap order numbers
    draggable_row_column.order_number = [
      selected_row_column.order_number,
      (selected_row_column.order_number = draggable_row_column.order_number)
    ][0];

    setItems(items);
  }
  setDropType(false);
};

export default SwapElements;
export { HandleDragEnd };
