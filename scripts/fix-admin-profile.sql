-- Script para asegurar que el usuario admin tenga el perfil correcto
-- Ejecutar este script para corregir el problema del dashboard

-- Primero, verificar si existe el perfil en la tabla profiles
DO $$
DECLARE
    admin_user_id UUID;
    profile_exists BOOLEAN := FALSE;
BEGIN
    -- Buscar el ID del usuario admin por email
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'productbeersvalencia@gmail.com';
    
    IF admin_user_id IS NOT NULL THEN
        -- Verificar si ya existe un perfil
        SELECT EXISTS(
            SELECT 1 FROM profiles WHERE user_id = admin_user_id
        ) INTO profile_exists;
        
        IF profile_exists THEN
            -- Actualizar el perfil existente para asegurar que sea admin
            UPDATE profiles 
            SET 
                role = 'admin',
                full_name = COALESCE(full_name, 'Admin'),
                updated_at = NOW()
            WHERE user_id = admin_user_id;
            
            RAISE NOTICE 'Perfil de admin actualizado correctamente';
        ELSE
            -- Crear nuevo perfil de admin
            INSERT INTO profiles (
                user_id,
                full_name,
                role,
                is_public,
                created_at,
                updated_at
            ) VALUES (
                admin_user_id,
                'Admin',
                'admin',
                false,
                NOW(),
                NOW()
            );
            
            RAISE NOTICE 'Nuevo perfil de admin creado correctamente';
        END IF;
        
        -- También verificar/migrar desde la tabla users si existe
        IF EXISTS(SELECT 1 FROM users WHERE id = admin_user_id) THEN
            -- Migrar datos de la tabla users a profiles si es necesario
            UPDATE profiles 
            SET 
                full_name = COALESCE(profiles.full_name, users.full_name, 'Admin'),
                avatar_url = COALESCE(profiles.avatar_url, users.avatar_url),
                role = 'admin'
            FROM users 
            WHERE profiles.user_id = users.id 
            AND profiles.user_id = admin_user_id;
            
            RAISE NOTICE 'Datos migrados desde tabla users';
        END IF;
        
    ELSE
        RAISE NOTICE 'Usuario admin no encontrado con email productbeersvalencia@gmail.com';
    END IF;
END $$;

-- Verificar el resultado
SELECT 
    p.user_id,
    p.full_name,
    p.role,
    u.email,
    p.created_at,
    p.updated_at
FROM profiles p
JOIN auth.users u ON p.user_id = u.id
WHERE u.email = 'productbeersvalencia@gmail.com';
