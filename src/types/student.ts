export interface Student {
  id: string | number;
  full_name: string;
  grade_level: string;
  parent_phone: string;
  subject: string;
  groupe: string | null;
  monthly_fee: number | null;
  start_date: string;
  internal_notes: string | null;
  status: "Paid" | "Unpaid";
  is_active: boolean;
  teacher_id: string;
  created_at: string;
  last_payment_date: string | null;
  last_reminded_at: string | null;
}
