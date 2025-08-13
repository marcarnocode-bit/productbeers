-- Add missing DELETE policy for resources table
-- This allows admins and organizers to delete resources

CREATE POLICY "Solo admins y organizadores pueden eliminar recursos" ON resources 
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role IN ('admin', 'organizer')
  )
);
