-- Allow users to update their own blog posts
create policy "Users can update their own blog posts"
on blog_posts for update
using (auth.uid() = author_id);
