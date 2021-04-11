export interface Job {
  name: string;
}

export interface ISlaveData {
  id: number;
  master_id: number;
  price: number;
  sale_price: number;
  job: Job;
  profit_per_min: number;
  fetter_to: number;
  fetter_price: number;
  balance: number;
  last_time_update: number;
  slaves_count: number;
  slaves_profit_per_min: number;
  deleted: boolean;
  accepted_terms: boolean;
}