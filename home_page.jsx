// React imports
import React, { useState, useEffect, useRef } from 'react';

// Libraries import
import { withStyles } from '@material-ui/core/styles';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { connect } from 'react-redux';

// Actions import
import { showTopNavigation } from '../../../actions/marketplace/pages';
import { getSaveDraftHistory, setSaveEditedPage } from '../../../actions/marketplace/site_builder';

// Components & other files imports
import useWindowDimensions from '../../../utils/helper';
import ColWrapper from '../../HOC/ColWrapper';
import RowWrapper from '../../HOC/RowWrapper';
import AddElements from '../../AddElements';
import DeleteElements from '../../DeleteElements';
import DuplicateElements from '../../DuplicateElements';
import EditElements from '../../EditElements';
import SwapElements, { HandleDragEnd } from '../../SwapElements';
import WidthRatio from '../../WidthRatio';
import TopNavigation from '../../TopNavigation';
import CategoryCarousel from '../CategoryCarousel';
import Jumbotron from '../Jumbotron';
import NewRow from '../NewRow';
import ProductCarousel from '../ProductCarousel';
import RssFeed from '../RssFeed';
import StoreLocator from '../StoreLocator';
import TabbedComponent from '../TabbedComponent';

// Styles import
import { styles, dragStyle, dropStyle } from './styles';

const Page = ({
  currentUser,
  marketplace,
  classes,
  marketplacePage,
  getDuplicateRow,
  ComponentName,
  setComponentModal,
  removeComponentName,
  previewButton,
  setNewHoverComponentState,
  setNewHoverComponent,
  SaveDraft,
  saveDraftHistoryData,
  showPublishedPage,
  selectedNewRowElement,
  saveDraftHistory,
  currentUserView,
  saveDraftHistoryItems,
  marketplacePages,
  getSaveDraftHistory,
  setShowTopNavigation,
  items,
  setItems,
  topHeaderdisable,
  disableTopHeader,
  setTopHeaderView,
  setShowTopHeaderMenu,
  saveEditedPage,
  setSaveEditedPage
}) => {
  const componentsName = {
    PromotionalBanner: Jumbotron,
    CategoryCarousel: CategoryCarousel,
    ProductCarousel: ProductCarousel,
    StoreLocator: StoreLocator,
    TabbedComponent: TabbedComponent,
    NewRow: NewRow,
    RssFeed: RssFeed,
    CategoryCarouselNew: CategoryCarousel,
    ProductCarouselNew: ProductCarousel,
    TopNavigation: TopNavigation
  };

  const [copyState, setCopyState] = useState(false);
  const [request, setRequest] = useState(true);
  const [draft, setDraft] = useState(false);
  const [isShown, setIsShown] = useState(false);

  localStorage.setItem('Draft', JSON.stringify(draft));
  const isAdmin =
    currentUser &&
    currentUser.roles &&
    currentUser.roles.sinewave &&
    currentUser.roles.sinewave[0] === 'admin';
  const addElementHover = isAdmin && previewButton ? `mx-0 ${classes.addElementHover}` : 'mx-0';
  const getSaveDraftIndex = localStorage.getItem('Save Draft Index');
  const initialRender = useRef(true);
  const [addRowHover, setAddRowHover] = useState(false);
  const [dropType, setDropType] = useState('drag_n_drop');
  const [dragStartResult, setDragStartResult] = useState({});
  const [selectedComponent, setSelectedComponent] = useState('');
  const [dragUpdateResult, setDragUpdateResult] = useState('');
  let dragProvided = '';
  const [previewState, setPreviewState] = useState(false);
  const { isMobile } = useWindowDimensions();

  useEffect(() => {
    SaveDraft(items);
  }, [items, isShown]);

  useEffect(() => {
    if (!topHeaderdisable) {
      showMarketPlacePage(marketplacePage);
    }
  }, [topHeaderdisable]);
  
  const showDraftPage = (data, items) => {
    const rows = [];
    if (isAdmin) {
      if (
        saveDraftHistory[data] &&
        saveDraftHistory[data].page_rows &&
        saveDraftHistory[data].page_rows.length > 0
      ) {
        if (showPublishedPage && showPublishedPage.id) {
          setItems([...marketplacePage.page_rows]);
        } else {
          if (previewState === true) {
            saveDraftHistory[data].page_rows = items;
          }
          saveDraftHistory[data]?.page_rows &&
            saveDraftHistory[data].page_rows.filter((values) => {
              if (values.components.length > 0) {
                if (rows.length > 0) {
                  if (values.components[0] !== rows[0].components[0]) {
                    rows.push(values);
                  }
                } else {
                  rows.push(values);
                }
              }
            });
          setItems(rows);
        }
      } else {
        setItems([]);
        showMarketPlacePage(marketplacePage);
      }
    } else {
      showMarketPlacePage(marketplacePage);
    }
  };

  const showMarketPlacePage = (marketplacePage) => {
    const rows = [];

    if (marketplacePage && marketplacePage.page_rows && marketplacePage.page_rows.length > 0) {
      if (showPublishedPage && showPublishedPage.id) {
        setItems([...marketplacePage.page_rows]);
      } else {
        marketplacePage.page_rows.filter((values) => {
          if (values.components.length > 0) {
            if (rows.length > 0) {
              if (values.components[0] !== rows[0].components[0]) {
                rows.push(values);
              }
            } else {
              rows.push(values);
            }
          }
        });
        setItems(rows);
      }
    } else {
      setItems([]);
    }
  };

  useEffect(() => {
    setShowTopNavigation(true);
    if (marketplacePages.length > 0 && previewButton) {
      getSaveDraftHistory({
        url_path: marketplacePages[0].url_path,
        published: false,
        preview: previewButton
      });
    }
  }, [marketplacePages, previewButton]);

  useEffect(() => {
    showMarketPlacePage(marketplacePage);
    // eslint-disable-next-line
  }, [currentUserView, marketplacePages, marketplacePage]);

  const editIcons = (row, showEditIcons, data) => {
    const showIcons = showEditIcons ? `${classes.addElementIcons}` : `${classes.editIcons}`;
    data =
      copyState && data === 'productCarousel'
        ? 'ProductCarouselNew'
        : copyState && data === 'categoryCarousel'
        ? 'CategoryCarouselNew'
        : data;
    const editIconsProps = {
      row: row,
      showEditIcons: showEditIcons,
      items: items,
      setItems: setItems,
      setPreviewState: setPreviewState
    };
    return (
      <div
        className={`position-absolute ${showIcons} ${
          isShown && showIcons === classes.editIcons && `showIcons`
        } click`}
        onMouseEnter={() => (previewButton ? setIsShown(true) : null)}
        onMouseLeave={() => (previewButton ? setIsShown(false) : null)}
      >
        <div className="d-flex">
          {row.components[0] !== 'TopNavigation' ? (
            <>
              {showEditIcons ? <EditElements row={row} /> : null}
              {showEditIcons ? (
                <WidthRatio
                  items={items}
                  setItems={setItems}
                  row={row}
                  setRequest={setRequest}
                  draft={draft}
                  setDraft={setDraft}
                />
              ) : null}
              <SwapElements
                {...editIconsProps}
                provided={dragProvided}
                dragStartResult={dragStartResult}
                dragUpdateResult={dragUpdateResult}
                setDropType={setDropType}
              />
              <DuplicateElements
                {...editIconsProps}
                setCopyState={setCopyState}
                setRequest={setRequest}
                setDraft={setDraft}
              />
              <AddElements
                {...editIconsProps}
                initialRender={initialRender}
                setRequest={setRequest}
                draft={draft}
                setDraft={setDraft}
              />
              <DeleteElements {...editIconsProps} setRequest={setRequest} setDraft={setDraft} />
            </>
          ) : (
            <>
              {showEditIcons ? <EditElements row={row} /> : null}
              <AddElements
                {...editIconsProps}
                initialRender={initialRender}
                setRequest={setRequest}
                draft={draft}
                setDraft={setDraft}
              />
            </>
          )}
        </div>
      </div>
    );
  };

  const renderComponent = (row, index, provided) => {
    const componentName = row.length > 0 ? row.components[0] : null;
    dragProvided = provided ? provided : '';

    return row.page_id && row.components[0] ? (
      <div key={index}>
        <RowWrapper
          row={row}
          selectedComponent={selectedComponent}
          dragUpdateResult={dragUpdateResult}
          dragStartResult={dragStartResult}
          setSelectedComponent={setSelectedComponent}
          initialRender={initialRender}
          setIsShown={setIsShown}
          addRowHover={addRowHover}
          setAddRowHover={setAddRowHover}
          isShown={isShown}
          previewButton={previewButton}
          setNewHoverComponentState={setNewHoverComponentState}
          items={items}
          setItems={setItems}
          getDuplicateRow={getDuplicateRow}
          setNewHoverComponent={setNewHoverComponent}
          selectedNewRowElement={selectedNewRowElement}
          ComponentName={ComponentName}
          setComponentModal={setComponentModal}
          removeComponentName={removeComponentName}
          isAdmin={isAdmin}
          editIcons={editIcons}
          draft={draft}
          setDraft={setDraft}
        >
          {row.row_columns.length &&
            row.row_columns
              .sort((a, b) => a.order_number - b.order_number)
              .map((column, index) => (
                <>
                  <React.Fragment>{renderComponent(column, index, provided)}</React.Fragment>
                </>
              ))}
        </RowWrapper>
      </div>
    ) : (
      <ColWrapper
        row={row}
        index={index}
        classes={classes}
        items={items}
        setItems={setItems}
        isAdmin={isAdmin}
      >
        {row.page_rows && row.page_rows.length ? (
          row.page_rows
            .sort((a, b) => a.order_number - b.order_number)
            .map((row, index) => {
              return renderComponent(row, index, provided);
            })
        ) : (
          <div
            onMouseEnter={() => (previewButton ? setIsShown(true) : null)}
            onMouseLeave={() => (previewButton ? setIsShown(false) : null)}
            className={`${classes.jumbotron} ${addElementHover} ${
              isShown ? classes.newRowHover : null
            } ${row.components[0] === 'NewRow' ? classes.addNewRow : null}`}
          >
            {row.components[0] !== 'NewRow'
              ? editIcons && editIcons(row, `columnHover", ${componentName}`)
              : ''}
            {row.components.length &&
              typeof componentsName[row.components[0]] !== 'undefined' &&
              React.createElement(componentsName[row.components[0]], {
                currentUser: currentUser,
                marketplace: marketplace,
                row: row,
                previewButton: previewButton,
                request: request,
                initialRender: initialRender,
                disableTopHeader: disableTopHeader,
                setTopHeaderView: setTopHeaderView,
                setShowTopHeaderMenu: setShowTopHeaderMenu
              })}
          </div>
        )}
      </ColWrapper>
    );
  };

  const onDragEnd = (dragEndResult) => {
    if (dragEndResult.destination) {
      setDragStartResult({});
      HandleDragEnd(dragEndResult, items, setItems, setDropType);
      setDragUpdateResult(false);
    }
  };

  return (
    <DragDropContext
      onDragStart={(results) => setDragStartResult(results)}
      onDragEnd={(results) => onDragEnd(results)}
      onDragUpdate={(results) => setDragUpdateResult(results)}
    >
      <Droppable droppableId="droppable-1" type={dropType}>
        {(provided, snapshot) => (
          <div style={dropStyle(snapshot)} ref={provided.innerRef} {...provided.droppableProps}>
            {marketplacePage && items.length ? (
              <div>
                {items
                  .sort((a, b) => a.order_number - b.order_number)
                  .map((row, index) => (
                    <Draggable key={row.id} draggableId={row.id.toString()} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={dragStyle(provided, snapshot)}
                          className={`${
                            addRowHover &&
                            selectedComponent.compId === row['id'] &&
                            row['components'][0] !== 'TopNavigation'
                              ? 'selectedDOM'
                              : ''
                          }`}
                        >
                          {renderComponent(row, index, provided)}
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            ) : null}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    getSaveDraftHistory: (data) => dispatch(getSaveDraftHistory(data)),
    setShowTopNavigation: (value) => dispatch(showTopNavigation(value)),
    setSaveEditedPage: (data) => dispatch(setSaveEditedPage(data))
  };
};

const mapStateToProps = (state) => {
  return {
    selectedNewRowElement: state.getFilteredProducts.selectedNewRowElement,
    saveDraftHistory: state.getSaveDraftHistory.saveDraftHistory,
    currentUserView: state.getCurrentUser.currentUser,
    saveEditedPage: state.getSiteBuilderAddElement.saveEditedPage
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Page));
