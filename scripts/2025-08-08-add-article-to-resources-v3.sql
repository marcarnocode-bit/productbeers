-- Habilita 'article' en resources.resource_type tanto si es ENUM como si es TEXT con CHECK
-- Ejecuta este script en tu proyecto Supabase (Postgres)

BEGIN;

-- Caso 1: la columna es de tipo ENUM -> añadir valor 'article' de forma idempotente
DO $$
DECLARE enum_typename text;
BEGIN
  SELECT t.typname INTO enum_typename
  FROM pg_type t
  JOIN information_schema.columns c
    ON t.oid = (c.udt_name)::regtype
  WHERE c.table_schema = 'public'
    AND c.table_name = 'resources'
    AND c.column_name = 'resource_type'
    AND t.typtype = 'e'; -- enum

  IF enum_typename IS NOT NULL THEN
    BEGIN
      EXECUTE format('ALTER TYPE %I ADD VALUE IF NOT EXISTS %L', enum_typename, 'article');
    EXCEPTION
      WHEN duplicate_object THEN
        -- El valor ya existe
        NULL;
    END;
  END IF;
END $$;

-- Caso 2: la columna es TEXT/VARCHAR con CHECK -> soltar el CHECK actual y recrearlo incluyendo 'article'
DO $$
DECLARE col_data_type text;
DECLARE chk_name text;
BEGIN
  SELECT data_type INTO col_data_type
  FROM information_schema.columns
  WHERE table_schema = 'public' AND table_name = 'resources' AND column_name = 'resource_type';

  IF col_data_type IN ('text','character varying','character') THEN
    -- Intentar localizar un CHECK existente sobre resource_type
    SELECT con.constraint_name INTO chk_name
    FROM information_schema.table_constraints con
    JOIN information_schema.constraint_column_usage u
      ON u.constraint_name = con.constraint_name AND u.table_schema = con.table_schema
    WHERE con.table_schema = 'public'
      AND con.table_name = 'resources'
      AND con.constraint_type = 'CHECK'
      AND u.column_name = 'resource_type'
    LIMIT 1;

    IF chk_name IS NOT NULL THEN
      EXECUTE format('ALTER TABLE public.resources DROP CONSTRAINT %I', chk_name);
    END IF;

    -- Crear un CHECK actualizado que incluya 'article'
    ALTER TABLE public.resources
      ADD CONSTRAINT resources_resource_type_check
      CHECK (resource_type IN ('document','video','link','template','article'));
  END IF;
END $$;

COMMIT;

-- Opcional: comentario para documentación
COMMENT ON CONSTRAINT resources_resource_type_check ON public.resources IS 'Tipos permitidos de recurso, incluyendo "article".';
