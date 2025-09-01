export interface DashboardMetrics {
  total_deliveries: number;
  earnings: number;
  avg_delivery_time: number;
  trend: TrendData[];
}

export interface TrendData {
  date: string;
  deliveries: number;
  earnings: number;
}

export interface Delivery {
  id: number;
  date: string;
  status: 'pending' | 'accepted' | 'delivered' | 'cancelled';
  address: string;
  package_type: string;
  total_price: number;
  delivery_time: number;
}

export interface DeliveryResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Delivery[];
}
