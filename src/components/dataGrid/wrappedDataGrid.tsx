import DataGrid from './dataGrid';

export default function WrappedDataGrid({
  gridRef,
  ...props
}: {
  gridRef: any;
  searchText: string;
  data: any;
}) {
  const {searchText, data} = props;

  return <DataGrid ref={gridRef} searchText={searchText} data={data} />;
}
