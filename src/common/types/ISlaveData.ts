export interface ISlaveData {
  id: number;
  master_id: number;
  price: number;
  sale_price: number;
  job: string;
  profit_per_min: number;
  fetter_to: number;
  fetter_price: number;
  balance: number;
  last_time_update: number;
  slaves_count: number;
}
