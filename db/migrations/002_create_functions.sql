-- Function to get active room allocations for a user
CREATE OR REPLACE FUNCTION get_active_allocations(user_uuid uuid)
RETURNS TABLE (
  allocation_id uuid,
  room_id uuid,
  room_number text,
  hostel_name text,
  allocated_at timestamptz,
  status text
) AS $$
BEGIN
  RETURN QUERY
  SELECT a.id, r.id, r.room_number, h.name, a.allocated_at, a.status
  FROM allocations a
  JOIN rooms r ON a.room_id = r.id
  JOIN hostels h ON r.hostel_id = h.id
  WHERE a.user_id = user_uuid AND a.status = 'active';
END;
$$ LANGUAGE plpgsql;

-- Function to calculate total payments made by a user
CREATE OR REPLACE FUNCTION get_total_payments(user_uuid uuid)
RETURNS numeric AS $$
DECLARE
  total numeric;
BEGIN
  SELECT COALESCE(SUM(amount), 0) INTO total
  FROM payments
  WHERE user_id = user_uuid AND status = 'completed';
  RETURN total;
END;
$$ LANGUAGE plpgsql;

-- Add more complex functions as needed for reporting and business logic
