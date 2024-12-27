export default interface SearchBarData {
  searchString?: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}