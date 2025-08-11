-- Adds 'article' value to the resources.resource_type constraint
DO $$
BEGIN
  -- Drop existing constraint if it exists
  ALTER TABLE public.resources
    DROP CONSTRAINT IF EXISTS resources_resource_type_check;

  -- Add new constraint with 'article' included
  ALTER TABLE public.resources
    ADD CONSTRAINT resources_resource_type_check
    CHECK (resource_type IN ('document','video','link','template','article'));
    
  RAISE NOTICE 'Successfully added article to resource_type constraint';
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error updating constraint: %', SQLERRM;
END
$$;
