export interface Filter {
  id: string;
  name: string;
  /** radio, checkbox * */
  type: string;
  data: {
    id: string | number;
    name: string;
    checked: boolean;
  }[];
}
