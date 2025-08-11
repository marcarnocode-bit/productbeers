-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('event-images', 'event-images', true),
  ('resource-files', 'resource-files', true),
  ('user-avatars', 'user-avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for event images
CREATE POLICY "Anyone can view event images" ON storage.objects FOR SELECT USING (bucket_id = 'event-images');
CREATE POLICY "Authenticated users can upload event images" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'event-images' AND auth.role() = 'authenticated'
);
CREATE POLICY "Users can update their own event images" ON storage.objects FOR UPDATE USING (
  bucket_id = 'event-images' AND auth.uid()::text = (storage.foldername(name))[1]
);
CREATE POLICY "Users can delete their own event images" ON storage.objects FOR DELETE USING (
  bucket_id = 'event-images' AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Set up storage policies for resource files
CREATE POLICY "Anyone can view resource files" ON storage.objects FOR SELECT USING (bucket_id = 'resource-files');
CREATE POLICY "Authenticated users can upload resource files" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'resource-files' AND auth.role() = 'authenticated'
);
CREATE POLICY "Users can update their own resource files" ON storage.objects FOR UPDATE USING (
  bucket_id = 'resource-files' AND auth.uid()::text = (storage.foldername(name))[1]
);
CREATE POLICY "Users can delete their own resource files" ON storage.objects FOR DELETE USING (
  bucket_id = 'resource-files' AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Set up storage policies for user avatars
CREATE POLICY "Anyone can view user avatars" ON storage.objects FOR SELECT USING (bucket_id = 'user-avatars');
CREATE POLICY "Authenticated users can upload user avatars" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'user-avatars' AND auth.role() = 'authenticated'
);
CREATE POLICY "Users can update their own avatars" ON storage.objects FOR UPDATE USING (
  bucket_id = 'user-avatars' AND auth.uid()::text = (storage.foldername(name))[1]
);
CREATE POLICY "Users can delete their own avatars" ON storage.objects FOR DELETE USING (
  bucket_id = 'user-avatars' AND auth.uid()::text = (storage.foldername(name))[1]
);
