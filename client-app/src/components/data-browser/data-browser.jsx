//Component Dependancies
var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');
var ReactTable = require('react-table').default;
var alaSQL = require('alasql');
require("../data-browser/styles.less")

//#region Source Selector
class DataSourceSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedDataSourceIndex: this.props.selectedDataSourceIndex };
    this.handleChange = this.handleChange.bind(this);
  }
  //#region React Lifecycle Methods
  componentDidMount() {
    // fires once dom rendered - replace container with component content
    $('#' + this.props.componentId).contents().unwrap();
  }
  componentWillUnmount() { }
  componentWillUpdate() { }
  componentDidUpdate() { }
  shouldComponentUpdate() { }
  componentWillReceiveProps() { }
  handleChange(event) {
    this.setState({ selectedDataSourceIndex: event.target.value });
    ReactDOM.render(
      <Data_Browser
        componentId={this.props.gridElementId}
        dataSources={this.props.dataSources}
        activeDataSource={this.props.dataSources[event.target.value]}
        activeDataSourceIndex={event.target.value}
        pivotColumn={[]} />,
      document.getElementById(this.props.gridElementId));
  }
  
  //#endregion
  render() {
    var options = [];
    this.props.dataSources.forEach((element, index) => {
      if (index == this.state.selectedDataSourceIndex)
        options.push(<option selected key={index} value={index}>{element.searchSourceName}{"   (" + element.rows.length + ")  "}</option>)
      else
        options.push(<option key={index} value={index}>{element.searchSourceName}{"   (" + element.rows.length + ")  "}</option>)
    })
    return (
      <React.Fragment >
        <div className="row" style={{ display: "flex" }}>
          <span className="col-md-2" style={{ marginRight: "-9px", lineHeight: 2.4, width: "auto" }}>Select Data source</span>
          <select className="col-md-2" value={this.state.selectedDataSourceIndex} style={{ height: "30px", width: "auto" }} onChange={this.handleChange}>
            {options}
          </select>
          
        </div>
      </React.Fragment>);
  }
} //Component Class end
//#endregion

//#region Data Grid
class Data_Browser extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selected: -1 };
  }
  //#region React Lifecycle Methods
  componentDidMount() {
    // fires once dom rendered - replace container with component content
    $('#' + this.props.componentId).contents().unwrap();
    if (this.props.dataSources.length > 1) {
      ReactDOM.render(<DataSourceSelector selectedDataSourceIndex={this.props.activeDataSourceIndex} dataSources={this.props.dataSources} gridElementId={this.props.componentId} />, document.getElementById("databrowser-dataSelector"));
    }
  }
  prepareDataColumns(columns, rows) {
    return prepareGridColumns(columns, rows, this.props);
  }
  getTrProps(state, rowInfo) {
    if (rowInfo) {
      return {
        id: "rowId_" + rowInfo.viewIndex,
        style: {
          background: rowInfo.aggregated && rowInfo.groupedByPivot ? '#c9c9c9' : '',
          color: 'black'
        },
        onClick: () => {
          console.log([state, rowInfo]);
        }
      }
    }
    return {};
  }
  componentWillUnmount() {
  }
  componentWillUpdate() { }
  componentDidUpdate() { }
  shouldComponentUpdate() { }
  componentWillReceiveProps() { }
  //#endregion
  render() {
    var dataSelectorElement = <div id="databrowser-dataSelector" style={{ marginTop: "-9px", marginBottom: "20px" }}></div>
    if (this.props.dataSources.length == 1) {
      dataSelectorElement = <div className="data-browser-tools-bar">{"Results Count" + " : " + this.props.activeDataSource.rows.length}</div>;
    }
    return (
      <React.Fragment>
        <div id={this.props.componentId}>
          {dataSelectorElement}
          <ReactTable
            data={this.props.activeDataSource.rows}
            previousText='<<'
            nextText='>>'
            loadingText='loading..'
            noDataText='no data availble'
            pageText=' page '
            ofText=' from '
            rowsText=' results '
            columns={[
              {
                columns: this.prepareDataColumns(this.props.activeDataSource.columns, this.props.activeDataSource.rows)
              }
            ]}
            filterable={this.props.activeDataSource.allowFilters}
            defaultPageSize={10}
            pivotBy={this.props.pivotColumn}
            ExpanderComponent={({ isExpanded }) => isExpanded ? <span style={{ fontSize: "15px", float: "left", fontFamily: "FontAwesome, 'Open Sans', Verdana, sans-serif" }}> {' << '} </span> : <span style={{ fontSize: "15px", float: "left", fontFamily: "FontAwesome, 'Open Sans', Verdana, sans-serif" }}> {" >> "} </span>}
            className="-striped -highlight _DataBrowser-body"
            getTrProps={this.getTrProps}
            collapseOnSortingChange={false} />
        </div>
      </React.Fragment>);
  }
} //Component Class end
//#endregion

function renderComponent(componentId, componentData) {
  ReactDOM.render(
    <Data_Browser
      componentId={componentId}
      dataSources={componentData}
      activeDataSource={componentData[0]}
      activeDataSourceIndex={0}
      pivotColumn={[]} />,
    document.getElementById(componentId));
}

//grid features helper
function filterColumnData(filterField, filterValue, rows) {
  return alaSQL("select * from ? where " + filterField + " like '%" + filterValue + "%'", [rows]);
}

function setCellAction(row, jsxSubComponent, callback) {
  if (jsxSubComponent != '') {
    return (
      <div id="cellButton" style={{ textAlign: "center", cursor: "pointer" }} onClick={() => callback(row)}>
        {row.aggregated && row.groupedByPivot ? "" : jsxSubComponent}
      </div>
    )
  }
  else {
    return (
      <div className="data-browser-default-cell" style={{ cursor: "pointer" }} title={row.value} onClick={() => callback(row)}>{row.value}</div>
    )
  }
}

function prepareInputFilter(column, onChange, data, gridProps) {
  if (data && column) {
    var Distinctlist = alaSQL("select distinct " + column + " from ? ", [data]);
    var optionsList = Distinctlist.map(function (item, index) {
      return (<option key={index} value={item[column]}>{item[column]}</option>)
    });
    if (gridProps.pivotColumn.length > 0) {
      return (
        <div>
          <input style={{ width: "85%", color: "black" }}
            list={column}
            readOnly
            className="data-browser-embeded-input-filter"
            placeholder="search"
            onKeyDown={event => onChange(event.target.value)}
            onKeyUp={event => onChange(event.target.value)} />
          <datalist id={column}>
            {optionsList}
          </datalist>
          <i id={"PivotButton_" + column} className="fas fa-th-list" title="Grouping" style={{ fontSize: "15px", cursor: "pointer", marginRight: "5px" }} onClick={() => PivotByColumn(column, gridProps)}> </i>
        </div>
      )
    }
    else {
      return (
        <div>
          <input style={{ width: "85%", color: "black" }}
            list={column}
            className="data-browser-embeded-input-filter"
            placeholder="search"
            onKeyDown={event => onChange(event.target.value)}
            onKeyUp={event => onChange(event.target.value)} />
          <datalist id={column}>
            {optionsList}
          </datalist>
          <i id={"PivotButton_" + column} className="fas fa-th-list" title="Grouping" style={{ fontSize: "15px", cursor: "pointer", marginRight: "5px" }} onClick={() => PivotByColumn(column, gridProps)}> </i>
        </div>
      )
    }

  }
}

function PivotByColumn(column, gridProps) {
  // handle grouping
  ReactDOM.render(
    <Data_Browser
      componentId={gridProps.componentId}
      dataSources={gridProps.dataSources}
      activeDataSource={gridProps.dataSources[gridProps.activeDataSourceIndex]}
      activeDataSourceIndex={gridProps.activeDataSourceIndex}
      pivotColumn={[column]} />,
    document.getElementById(gridProps.componentId));
  $('#PivotButton_' + column).removeClass('fas fa-th-list').addClass('far fa-times-circle');
  document.getElementById('PivotButton_' + column).title = 'Reset';
  // reset view
  if (column == gridProps.pivotColumn[0]) {
    ReactDOM.render(
      <Data_Browser
        componentId={gridProps.componentId}
        dataSources={gridProps.dataSources}
        activeDataSource={gridProps.dataSources[gridProps.activeDataSourceIndex]}
        activeDataSourceIndex={gridProps.activeDataSourceIndex}
        pivotColumn={[]} />,
      document.getElementById(gridProps.componentId));
    $('#PivotButton_' + column).removeClass('far fa-times-circle').addClass('fas fa-th-list');
    document.getElementById('PivotButton_' + column).title = 'Grouping';
  }
}

function prepareGridColumns(columnsList, data, gridProps) {
  var GridColumns = [];
  columnsList.forEach(element => {
    var column = {
      Header: element.alias,
      accessor: element.key,
      width: element.width
    }
    if (element.allowFiltering) {
      column.filterMethod = (filter, rows) => filterColumnData(filter.id, filter.value, rows);
      column.filterAll = true;
      column.Filter = ({ column, onChange }) => prepareInputFilter(column.id, onChange, data, gridProps);
    }
    else {
      column.filterAll = false;
      column.Filter = (<div>
        <input type="text" readOnly style={{ width: "100%", background: "transparent" }} />
      </div>);
    }
    if (element.allowCellAction) {
      column.Cell = row => setCellAction(row, element.jsxSubComponent, element.cellAction);
    }
    column.aggregate = vals => ""; //_.count(vals);
    GridColumns.push(column);
  });
  return GridColumns;
}


module.exports = {
  renderComponent: renderComponent
};