-- Safe migration to support 'article' in public.resources.resource_type
-- Works whether the column is an ENUM or a TEXT/VARCHAR with a CHECK constraint.
DO $migration$
DECLARE
  schema_name text := 'public';
  table_name  text := 'resources';
  column_name text := 'resource_type';
  con_name    text;
  col_type    regtype;
  is_enum     boolean;
BEGIN
  -- Find the column type and whether it's an enum
  SELECT a.atttypid::regtype,
         (SELECT t.typtype = 'e' FROM pg_type t WHERE t.oid = a.atttypid) AS ty_is_enum
    INTO col_type, is_enum
  FROM pg_attribute a
  JOIN pg_class c ON c.oid = a.attrelid
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = schema_name
    AND c.relname = table_name
    AND a.attname = column_name
    AND a.attnum > 0;

  IF is_enum THEN
    -- Add value to enum type if not present (trap duplicate)
    BEGIN
      EXECUTE format('ALTER TYPE %s ADD VALUE %L', col_type::text, 'article');
    EXCEPTION
      WHEN duplicate_object THEN
        -- value already exists
        NULL;
    END;
  ELSE
    -- Ensure CHECK constraint allows 'article'
    SELECT conname INTO con_name
    FROM pg_constraint
    WHERE conrelid = format('%I.%I', schema_name, table_name)::regclass
      AND contype = 'c'
      AND conname = 'resources_resource_type_check';

    IF con_name IS NOT NULL THEN
      EXECUTE format('ALTER TABLE %I.%I DROP CONSTRAINT %I', schema_name, table_name, con_name);
    END IF;

    EXECUTE format(
      'ALTER TABLE %I.%I ADD CONSTRAINT resources_resource_type_check CHECK (%I IN (''document'',''video'',''link'',''template'',''article''))',
      schema_name, table_name, column_name
    );
  END IF;

  RAISE NOTICE 'resource_type now supports "article". Column type: %, enum: %', col_type::text, is_enum;
END
$migration$;
